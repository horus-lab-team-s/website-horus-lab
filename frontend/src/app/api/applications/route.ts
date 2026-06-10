import { NextResponse } from "next/server";
import { isValidEmail, saveApplication, type ApplicationPayload } from "@/lib/leads";

/* Dépôt de candidature (page Candidature).
   Reçoit un formulaire multipart : coordonnées + un dossier ZIP. */

export const runtime = "nodejs";

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

  const { ok } = await saveApplication(payload, buffer);
  if (!ok) {
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
