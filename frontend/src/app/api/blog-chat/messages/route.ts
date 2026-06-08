import { NextResponse } from "next/server";

/* Proxy messages du chat blog vers Django.
   GET  ?id=&token=&after=  -> polling des nouveaux messages
   POST { id, token, text } -> le visiteur envoie un message            */

const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const token = searchParams.get("token") ?? "";
  const after = searchParams.get("after") ?? "0";
  if (!UUID_RE.test(id) || !token) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/chat/conversations/${id}/messages/?token=${encodeURIComponent(token)}&after=${encodeURIComponent(after)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "backend_error" }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id : "";
  const token = typeof b.token === "string" ? b.token : "";
  const text = typeof b.text === "string" ? b.text.trim() : "";
  if (!UUID_RE.test(id) || !token || !text) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/chat/conversations/${id}/messages/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Chat-Token": token },
      cache: "no-store",
      body: JSON.stringify({ text: text.slice(0, 5000) }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "backend_error" }, { status: res.status });
    }
    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
