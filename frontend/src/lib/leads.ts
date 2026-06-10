import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".data");
const BREVO_API = "https://api.brevo.com/v3";

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    email.length <= 254
  );
}

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ApplicationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** "emploi" (poste) ou "stage" (stage professionnel). */
  type: "emploi" | "stage";
  /** Poste ou domaine visé. */
  position: string;
  message: string;
  fileName: string;
  fileSize: number;
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string
  );
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/* Brevo (https://app.brevo.com) — activé dès que BREVO_API_KEY existe */
/* ------------------------------------------------------------------ */

/** Ajoute/maj un contact, optionnellement dans une liste (newsletter). */
async function brevoAddContact(email: string): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return false;
  const listId = process.env.BREVO_NEWSLETTER_LIST_ID;
  try {
    const res = await fetch(`${BREVO_API}/contacts`, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        ...(listId ? { listIds: [Number(listId)] } : {}),
      }),
    });
    if (res.ok) return true;
    console.warn("[brevo] addContact failed", res.status, await safeText(res));
    return false;
  } catch (err) {
    console.warn("[brevo] addContact error", err);
    return false;
  }
}

/** Envoie un e-mail transactionnel à l'équipe pour un message de contact. */
async function brevoSendContactEmail(p: ContactPayload): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return false;
  const to = process.env.BREVO_CONTACT_TO || "contact@horus-lab.com";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@horus-lab.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Horus-Lab";

  try {
    const res = await fetch(`${BREVO_API}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: to }],
        replyTo: { email: p.email, name: p.name },
        subject: `[Contact] ${p.subject || "Nouveau message"} — ${p.name}`,
        htmlContent: `<h2>Nouveau message via le site Horus-Lab</h2>
          <p><strong>Nom :</strong> ${escapeHtml(p.name)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(p.email)}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(p.subject) || "—"}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(p.message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (res.ok) return true;
    console.warn("[brevo] sendEmail failed", res.status, await safeText(res));
    return false;
  } catch (err) {
    console.warn("[brevo] sendEmail error", err);
    return false;
  }
}

/** Envoie un e-mail à l'équipe pour une candidature, avec le ZIP en pièce jointe. */
async function brevoSendApplicationEmail(
  p: ApplicationPayload,
  attachment?: { name: string; base64: string },
): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return false;
  const to = process.env.BREVO_CONTACT_TO || "contact@horus-lab.com";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@horus-lab.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Horus-Lab";
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const kindLabel = p.type === "stage" ? "Stage" : "Emploi";

  try {
    const res = await fetch(`${BREVO_API}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: to }],
        replyTo: { email: p.email, name: fullName },
        subject: `[Candidature · ${kindLabel}] ${p.position || "Spontanée"} — ${fullName}`,
        htmlContent: `<h2>Nouvelle candidature via le site Horus-Lab</h2>
          <p><strong>Nom :</strong> ${escapeHtml(fullName)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(p.email)}</p>
          <p><strong>Téléphone :</strong> ${escapeHtml(p.phone) || "—"}</p>
          <p><strong>Type :</strong> ${escapeHtml(kindLabel)}</p>
          <p><strong>Poste / domaine :</strong> ${escapeHtml(p.position) || "—"}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(p.message).replace(/\n/g, "<br>") || "—"}</p>
          <p><strong>Dossier :</strong> ${escapeHtml(p.fileName)} (${Math.round(p.fileSize / 1024)} Ko)</p>`,
        ...(attachment ? { attachment: [{ name: attachment.name, content: attachment.base64 }] } : {}),
      }),
    });
    if (res.ok) return true;
    console.warn("[brevo] sendApplication failed", res.status, await safeText(res));
    return false;
  } catch (err) {
    console.warn("[brevo] sendApplication error", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */

/** Journalise localement (audit / repli dev), au mieux. */
function appendLocal(kind: string, record: Record<string, unknown>): boolean {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(DATA_DIR, `${kind}.jsonl`),
      JSON.stringify(record) + "\n",
      "utf8"
    );
    return true;
  } catch (err) {
    console.warn(`[leads] écriture locale impossible (${kind}):`, err);
    return false;
  }
}

/**
 * Enregistre une soumission :
 *  1. journal local `.data/<kind>.jsonl` (audit, repli en dev) ;
 *  2. envoi à Brevo si `BREVO_API_KEY` est défini.
 *
 * Renvoie `ok: true` si la donnée a été captée quelque part (local OU Brevo).
 * En production (FS en lecture seule), Brevo doit être configuré, sinon `ok: false`.
 */
export async function saveLead(
  kind: "newsletter" | "contact",
  payload: Record<string, unknown>
): Promise<{ ok: boolean }> {
  const record = { ...payload, kind, createdAt: new Date().toISOString() };
  const localOk = appendLocal(kind, record);

  let providerOk = false;
  if (process.env.BREVO_API_KEY) {
    providerOk =
      kind === "newsletter"
        ? await brevoAddContact(String(payload.email))
        : await brevoSendContactEmail(payload as unknown as ContactPayload);
  }

  return { ok: localOk || providerOk };
}

/* ------------------------------------------------------------------ */
/* Candidatures (page Candidature) — dépôt d'un dossier ZIP            */
/* ------------------------------------------------------------------ */

const APPLICATIONS_DIR = path.join(DATA_DIR, "applications");

/** Brevo limite les pièces jointes : on n'attache que les dossiers raisonnables. */
const MAX_EMAIL_ATTACHMENT = 8 * 1024 * 1024; // 8 Mo

/**
 * Enregistre une candidature :
 *  1. sauvegarde locale du ZIP + métadonnées (audit / repli dev) ;
 *  2. e-mail à l'équipe via Brevo (ZIP joint si < 8 Mo), si configuré.
 *
 * `ok: true` si la candidature a été captée quelque part (local OU Brevo).
 */
export async function saveApplication(
  payload: ApplicationPayload,
  file: Buffer,
): Promise<{ ok: boolean }> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = `${stamp}-${payload.lastName || "candidat"}`.replace(/[^a-zA-Z0-9._-]/g, "_");

  let localOk = false;
  try {
    fs.mkdirSync(APPLICATIONS_DIR, { recursive: true });
    fs.writeFileSync(path.join(APPLICATIONS_DIR, `${safeName}.zip`), file);
    fs.writeFileSync(
      path.join(APPLICATIONS_DIR, `${safeName}.json`),
      JSON.stringify({ ...payload, createdAt: new Date().toISOString() }, null, 2),
      "utf8",
    );
    localOk = true;
  } catch (err) {
    console.warn("[applications] écriture locale impossible :", err);
  }

  let providerOk = false;
  if (process.env.BREVO_API_KEY) {
    const attachment =
      file.length <= MAX_EMAIL_ATTACHMENT
        ? { name: payload.fileName, base64: file.toString("base64") }
        : undefined;
    providerOk = await brevoSendApplicationEmail(payload, attachment);
  }

  return { ok: localOk || providerOk };
}
