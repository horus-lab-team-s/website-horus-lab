import { NextResponse } from "next/server";
import { isValidEmail, saveLead } from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  await saveLead("newsletter", { email: email.trim().toLowerCase() });

  // On renvoie toujours un succès côté UX (l'inscription est enregistrée
  // localement ou déléguée à un provider).
  return NextResponse.json({ ok: true });
}
