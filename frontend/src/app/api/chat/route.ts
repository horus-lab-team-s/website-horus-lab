import { NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

const KNOWLEDGE = `
Horus-Lab — entreprise technologique africaine (vision au-delà des frontières, impact durable).
Basée à Douala, Cameroun. Sert toute l'Afrique.
Services : applications web & mobile sur mesure (React, Next.js, Flutter, PWA) ; systèmes d'information (analyse, conception & architecture — UML/RUP) ; digitalisation d'entreprise (automatisation des workflows, CRM, GED, cloud) ; formation & audit IT (ateliers, cybersécurité, audit de code).
Méthode : 1) Écoute & cadrage 2) Conception & design 3) Développement agile 4) Livraison & accompagnement.
Secteurs : fintech, santé, éducation, agriculture, commerce, logistique, administration publique, énergie.
Contact : email contact@horus-lab.com ; téléphones +237 673398046 et +237 699173771.
`;

function systemPrompt(lang: string): string {
  return `Tu es "Horus AI", l'assistant virtuel de l'entreprise Horus-Lab.
Réponds de façon concise, professionnelle et chaleureuse, dans la langue de l'utilisateur (${lang === "en" ? "anglais" : "français"} par défaut).
Utilise uniquement les informations ci-dessous pour ce qui concerne Horus-Lab. N'invente pas de tarifs ni d'engagements : pour un devis ou un projet précis, invite à écrire à contact@horus-lab.com.
Garde des réponses courtes (2-5 phrases).
--- Informations Horus-Lab ---${KNOWLEDGE}`;
}

/* Repli sans clé API : petite FAQ par mots-clés, pour que le widget reste utile. */
function faqFallback(message: string, lang: string): string {
  const m = message.toLowerCase();
  const fr = lang !== "en";
  const has = (...k: string[]) => k.some((w) => m.includes(w));

  if (has("service", "faites", "proposez", "offer", "do you do"))
    return fr
      ? "Horus-Lab conçoit des applications web & mobile sur mesure, des systèmes d'information, des projets de digitalisation d'entreprise et de la formation & audit IT. Que souhaitez-vous construire ?"
      : "Horus-Lab builds custom web & mobile apps, information systems, business digitalisation and IT training & audits. What would you like to build?";
  if (has("contact", "email", "mail", "téléphone", "phone", "joindre", "reach"))
    return fr
      ? "Vous pouvez nous écrire à contact@horus-lab.com ou appeler le +237 673398046 / +237 699173771."
      : "Reach us at contact@horus-lab.com or call +237 673398046 / +237 699173771.";
  if (has("où", "situé", "adresse", "where", "located", "location"))
    return fr
      ? "Nous sommes basés à Douala, au Cameroun, et accompagnons des clients dans toute l'Afrique."
      : "We're based in Douala, Cameroon, and serve clients across Africa.";
  if (has("démarrer", "commencer", "projet", "start", "begin", "project", "devis", "quote"))
    return fr
      ? "Avec plaisir ! Décrivez votre besoin via le formulaire de contact ou écrivez à contact@horus-lab.com : nous répondons sous 24h."
      : "Glad to help! Describe your need via the contact form or email contact@horus-lab.com — we reply within 24h.";
  if (has("bonjour", "salut", "hello", "hi", "hey", "coucou"))
    return fr
      ? "Bonjour 👋 Comment puis-je vous aider à propos de Horus-Lab ?"
      : "Hello 👋 How can I help you with Horus-Lab?";
  return fr
    ? "Je peux vous renseigner sur les services, la méthode et le contact de Horus-Lab. Pour une demande précise : contact@horus-lab.com."
    : "I can tell you about Horus-Lab's services, method and contact. For a specific request: contact@horus-lab.com.";
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[]; lang?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "fr";
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser || typeof lastUser.content !== "string" || !lastUser.content.trim()) {
    return NextResponse.json({ error: "empty_message" }, { status: 422 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

  // Pas de clé -> repli FAQ (le widget fonctionne quand même).
  if (!apiKey) {
    return NextResponse.json({
      reply: faqFallback(lastUser.content, lang),
      fallback: true,
      reason: "unconfigured",
    });
  }

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt(lang) },
          ...messages.map((m) => ({
            role: m.role,
            content: String(m.content).slice(0, 2000),
          })),
        ],
      }),
    });

    if (!res.ok) {
      console.warn("[chat] provider error", res.status, await res.text());
      return NextResponse.json({
        reply: faqFallback(lastUser.content, lang),
        fallback: true,
        reason: "provider_error",
      });
    }

    const data = await res.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() || faqFallback(lastUser.content, lang);
    return NextResponse.json({ reply });
  } catch (err) {
    console.warn("[chat] error", err);
    return NextResponse.json({
      reply: faqFallback(lastUser.content, lang),
      fallback: true,
      reason: "provider_error",
    });
  }
}
