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
