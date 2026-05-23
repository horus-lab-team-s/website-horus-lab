import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

// Toujours évalué à la demande (jamais mis en cache).
export const dynamic = "force-dynamic";

type Ping = { ok: boolean; status: number; error?: string };

async function ping(url: string, headers: Record<string, string>): Promise<Ping> {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0, error: "unreachable" };
  }
}

/**
 * Diagnostic des intégrations : clés présentes + joignabilité réelle des
 * fournisseurs (Groq, Brevo). Lecture seule, aucun effet de bord.
 * Pratique pour valider la production : GET /api/health
 */
export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

  const [groq, brevo] = await Promise.all([
    groqKey
      ? ping(`${baseUrl}/models`, { Authorization: `Bearer ${groqKey}` })
      : Promise.resolve<Ping>({ ok: false, status: 0, error: "unconfigured" }),
    brevoKey
      ? ping("https://api.brevo.com/v3/account", {
          "api-key": brevoKey,
          Accept: "application/json",
        })
      : Promise.resolve<Ping>({ ok: false, status: 0, error: "unconfigured" }),
  ]);

  const summarize = (configured: boolean, p: Ping) =>
    !configured ? "unconfigured" : p.ok ? "ok" : p.status === 0 ? "unreachable" : "auth_error";

  return NextResponse.json(
    {
      checkedAt: new Date().toISOString(),
      siteUrl: SITE_URL,
      groq: {
        configured: !!groqKey,
        status: summarize(!!groqKey, groq),
        httpStatus: groq.status,
      },
      brevo: {
        configured: !!brevoKey,
        listConfigured: !!process.env.BREVO_NEWSLETTER_LIST_ID,
        status: summarize(!!brevoKey, brevo),
        httpStatus: brevo.status,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
