import { NextResponse } from "next/server";

/* Forum public d'un article — proxy vers le backend Django.
   L'URL du backend reste côté serveur (même origine pour le navigateur).
   GET  ?after=<id>  -> le fil public (messages non masqués)
   POST { author_name?, author_email?, text, thread_title?, website? } -> poster */

const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const SLUG_RE = /^[a-z0-9-]{1,300}$/i;

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after") ?? "0";
  try {
    const res = await fetch(
      `${API_BASE}/api/chat/forum/${encodeURIComponent(slug)}/?after=${encodeURIComponent(after)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "backend_error" }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch {
    // Backend indisponible : fil vide, la page reste fonctionnelle.
    return NextResponse.json({ thread: { slug, title: "" }, posts: [] });
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot anti-bot : un bot remplit le champ caché "website".
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 5000) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }
  const author_name = typeof body.author_name === "string" ? body.author_name.trim().slice(0, 120) : "";
  const author_email = typeof body.author_email === "string" ? body.author_email.trim().slice(0, 254) : "";
  const thread_title = typeof body.thread_title === "string" ? body.thread_title.trim().slice(0, 300) : "";

  try {
    const res = await fetch(`${API_BASE}/api/chat/forum/${encodeURIComponent(slug)}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ author_name, author_email, text, thread_title }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "backend_error" }, { status: res.status });
    }
    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
