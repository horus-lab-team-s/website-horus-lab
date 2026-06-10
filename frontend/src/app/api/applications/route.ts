import { NextResponse } from "next/server";
import { isValidEmail, saveApplication, type ApplicationPayload } from "@/lib/leads";

/* Dépôt de candidature (page Candidature).
   Reçoit un formulaire multipart : coordonnées + un dossier ZIP.

   Flux : on transmet d'abord la candidature au backend Django (source de
   vérité : stockage du ZIP + gestion dans l'admin + notifications). Si le
   backend est indisponible, on retombe sur une sauvegarde locale + e-mail
   Brevo — zéro perte de candidature. */

export const runtime = "nodejs";

const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

/** Transmet la candidature au backend Django (multipart). */
async function forwardToBackend(payload: ApplicationPayload, file: Buffer): Promise<boolean> {
  try {
    const fd = new FormData();
    fd.set("first_name", payload.firstName);
    fd.set("last_name", payload.lastName);
    fd.set("email", payload.email);
    fd.set("phone", payload.phone);
    fd.set("type", payload.type);
    fd.set("position", payload.position);
    fd.set("message", payload.message);
    fd.set("document", new Blob([new Uint8Array(file)], { type: "application/zip" }), payload.fileName);
    const res = await fetch(`${API_BASE}/api/applications/`, { method: "POST", body: fd, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

const MAX_FILE = 15 * 1024 * 1024; // 15 Mo
const ZIP_TYPES = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream", // certains navigateurs/OS
  "multipart/x-zip",
]);

function field(form: FormData, key: string, max: number): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot anti-bot.
  if (field(form, "website", 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const firstName = field(form, "firstName", 80);
  const lastName = field(form, "lastName", 80);
  const email = field(form, "email", 254);
  const phone = field(form, "phone", 40);
  const rawType = field(form, "type", 20);
  const type: "emploi" | "stage" = rawType === "stage" ? "stage" : "emploi";
  const position = field(form, "position", 160);
  const message = field(form, "message", 5000);

  if (!firstName || !lastName || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "missing_file" }, { status: 422 });
  }
  const isZipName = /\.zip$/i.test(file.name);
  if (!isZipName && !ZIP_TYPES.has(file.type)) {
    return NextResponse.json({ error: "not_a_zip" }, { status: 415 });
  }
  if (file.size > MAX_FILE) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const payload: ApplicationPayload = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    type,
    position,
    message,
    fileName: file.name || "dossier.zip",
    fileSize: file.size,
  };

  // 1. Backend Django (stockage + admin + notifications).
  if (await forwardToBackend(payload, buffer)) {
    return NextResponse.json({ ok: true });
  }

  // 2. Repli : sauvegarde locale + e-mail Brevo si le backend est indisponible.
  const { ok } = await saveApplication(payload, buffer);
  if (!ok) {
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
