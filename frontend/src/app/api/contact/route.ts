import { NextResponse } from "next/server";
import { isValidEmail, saveLead } from "@/lib/leads";

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // Honeypot : un bot remplit le champ caché "website" -> on accepte sans stocker.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = str(b.name, 120);
  const subject = str(b.subject, 160);
  const message = str(b.message, 5000);
  const email = b.email;

  if (!name || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const { ok } = await saveLead("contact", {
    name,
    email: email.trim().toLowerCase(),
    subject: subject ?? "",
    message,
  });
  if (!ok) {
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
