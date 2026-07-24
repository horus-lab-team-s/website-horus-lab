import { NextResponse } from "next/server";
import { isValidEmail, saveLead } from "@/lib/leads";

/**
 * Mur d'accès aux vidéos de formation : le visiteur laisse son e-mail (+ nom)
 * pour débloquer la lecture. On l'enregistre comme lead newsletter (Brevo) afin
 * de pouvoir le recontacter (produits, nouvelles formations). Le frontend
 * mémorise ensuite l'accès côté navigateur (localStorage) pour ne plus redemander.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot : un bot remplit le champ caché "website" -> on accepte sans stocker.
  const honeypot = (body as { website?: unknown })?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body as { email?: unknown })?.email;
  const nameRaw = (body as { name?: unknown })?.name;
  const name = typeof nameRaw === "string" ? nameRaw.trim().slice(0, 120) : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  const { ok } = await saveLead("newsletter", {
    email: email.trim().toLowerCase(),
    name,
    source: "formations",
  });
  if (!ok) {
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
