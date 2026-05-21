import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".data");

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    email.length <= 254
  );
}

/**
 * Persiste un "lead" (inscription newsletter ou message de contact).
 *
 * Stratégie :
 *  - En local / sur un serveur Node : écrit une ligne JSON dans `.data/<kind>.jsonl`.
 *  - Point d'intégration provider : branchez ici Resend / Mailchimp / Brevo…
 *    via une variable d'environnement (voir `// TODO provider`).
 *
 * Sur un hébergement au système de fichiers en lecture seule (ex. serverless),
 * l'écriture échoue silencieusement : connectez alors un provider externe.
 */
export async function saveLead(
  kind: "newsletter" | "contact",
  payload: Record<string, unknown>
): Promise<{ ok: boolean }> {
  const record = {
    ...payload,
    kind,
    createdAt: new Date().toISOString(),
  };

  // TODO provider : si process.env.RESEND_API_KEY (ou MAILCHIMP_*) est défini,
  // envoyez `record` au provider ici, puis `return { ok: true }`.

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(DATA_DIR, `${kind}.jsonl`),
      JSON.stringify(record) + "\n",
      "utf8"
    );
    return { ok: true };
  } catch (err) {
    // FS en lecture seule : on log et on renvoie un succès "best effort"
    // pour ne pas bloquer l'UX. Branchez un provider pour une vraie persistance.
    console.warn(`[leads] écriture impossible (${kind}):`, err);
    return { ok: false };
  }
}
