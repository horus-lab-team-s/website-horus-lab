import { NextResponse } from "next/server";

/* Module de chat du blog — proxy vers le backend Django (temps réel).
   Garde l'URL du backend côté serveur (même origine pour le navigateur,
   donc pas de CORS). POST ici = création d'une conversation. */

const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.length <= 254;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // Honeypot anti-bot.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return NextResponse.json({ id: "bot", token: "bot", messages: [] });
  }

  // Esprit forum : nom et e-mail facultatifs. On retombe sur « Visiteur » et,
  // si un e-mail est fourni, il doit être valide.
  const name = str(b.name, 120) ?? "Visiteur";
  const page = str(b.page, 300) ?? "";
  const emailRaw = typeof b.email === "string" ? b.email.trim() : "";
  if (emailRaw && !isEmail(emailRaw)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/chat/conversations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        visitor_name: name,
        visitor_email: emailRaw.toLowerCase(),
        page,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "backend_error" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ id: data.id, token: data.token, messages: data.messages ?? [] });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
