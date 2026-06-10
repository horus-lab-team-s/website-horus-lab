"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/i18n/LanguageProvider";
import { IconClose, IconSend, IconTelegram, IconWhatsApp } from "@/components/icons";

/* ============================================================
   Module de chat du blog — TEMPS RÉEL & sans friction.
   Esprit « forum moderne » : le visiteur ouvre la discussion et écrit
   immédiatement, sans formulaire d'inscription. Une identité anonyme est
   créée à la volée à l'envoi du premier message. Il peut, s'il le souhaite,
   laisser son e-mail (optionnel) pour être recontacté — sinon le système le
   traite comme un visiteur anonyme. L'équipe répond depuis l'admin Django et
   les réponses s'affichent ici en direct (polling). WhatsApp / Telegram restent
   offerts. Indépendant de Horus AI.
   ============================================================ */

type Msg = {
  key: string;
  id: number | null;
  from: "visitor" | "team";
  text: string;
  status?: "pending" | "sent" | "failed";
};
type Conversation = { id: string; token: string };
type Visitor = { name: string; email: string; anonymous: boolean };

const STORAGE_KEY = "horus-blog-chat-v3";
const WHATSAPP = "https://wa.me/237699173771";
const TELEGRAM = "https://t.me/tonbacm";
const POLL_OPEN = 3500;
const POLL_IDLE = 12000;

const T = {
  fr: {
    launcher: "Discuter",
    teaser: "Une question ? On vous répond en direct 👋",
    headerTitle: "Équipe Horus-Lab",
    online: "En ligne · réponse en direct",
    introTitle: "Bonjour 👋",
    introText:
      "Posez votre question, on vous répond ici même, en direct. Pas besoin de compte — écrivez simplement votre message.",
    emailToggle: "Laisser mon e-mail (optionnel)",
    emailPlaceholder: "Votre e-mail (pour être recontacté)",
    emailHint: "Optionnel — utile uniquement si vous voulez une réponse par mail.",
    welcome:
      "Bonjour 🙌 L'équipe Horus-Lab vous répond ici en direct. Quelle est votre question ?",
    placeholder: "Écrivez votre message…",
    connError:
      "Impossible d'ouvrir la discussion pour le moment. Réessayez ou écrivez-nous sur WhatsApp / Telegram.",
    sendFail: "Message non envoyé. Réessayez.",
    instant: "Réponse instantanée aussi sur :",
    quick: ["Je veux un devis", "Question sur un article", "Travailler avec vous"],
    waiting: "L'équipe a été notifiée — la réponse s'affichera ici.",
    closed: "Cette conversation a été clôturée. Merci !",
  },
  en: {
    launcher: "Chat",
    teaser: "A question? We reply live 👋",
    headerTitle: "Horus-Lab team",
    online: "Online · live replies",
    introTitle: "Hi there 👋",
    introText:
      "Ask your question and we'll reply right here, live. No account needed — just type your message.",
    emailToggle: "Leave my email (optional)",
    emailPlaceholder: "Your email (to be contacted back)",
    emailHint: "Optional — only useful if you'd like a reply by email.",
    welcome:
      "Hi 🙌 The Horus-Lab team replies here live. What's your question?",
    placeholder: "Type your message…",
    connError:
      "Couldn't open the chat right now. Try again or message us on WhatsApp / Telegram.",
    sendFail: "Message not sent. Try again.",
    instant: "Instant reply also on:",
    quick: ["I'd like a quote", "Question about an article", "Work with you"],
    waiting: "The team has been notified — the reply will appear here.",
    closed: "This conversation has been closed. Thank you!",
  },
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/** Identité anonyme synthétique — valide pour le backend, sans gêner le visiteur. */
function anonymousVisitor(): Visitor {
  const rand = Math.random().toString(36).slice(2, 10);
  return { name: "Visiteur", email: `visiteur-${rand}@visitors.horus-lab.com`, anonymous: true };
}

let tmpCounter = 0;

export function LiveChat() {
  const { lang } = useLang();
  const pathname = usePathname();
  const t = T[lang] ?? T.fr;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [closed, setClosed] = useState(false);

  const [email, setEmail] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const website = useRef(""); // honeypot
  const lastIdRef = useRef(0);
  const sendingRef = useRef(false);
  const openRef = useRef(false);

  /* ── Hydratation depuis localStorage ── */
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as {
          conversation?: Conversation;
          visitor?: Visitor;
          messages?: Msg[];
          lastId?: number;
        };
        if (d.conversation) setConversation(d.conversation);
        if (d.visitor) setVisitor(d.visitor);
        if (Array.isArray(d.messages)) setMessages(d.messages);
        if (typeof d.lastId === "number") lastIdRef.current = d.lastId;
      }
    } catch {
      /* ignore */
    }
    const teaser = setTimeout(() => setShowTeaser(true), 3500);
    return () => clearTimeout(teaser);
  }, []);

  /* ── Persistance ── */
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ conversation, visitor, messages, lastId: lastIdRef.current }),
      );
    } catch {
      /* ignore */
    }
  }, [conversation, visitor, messages, mounted]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  /* ── Polling temps réel des nouveaux messages ── */
  const poll = useCallback(async () => {
    if (!conversation || sendingRef.current) return;
    try {
      const res = await fetch(
        `/api/blog-chat/messages?id=${conversation.id}&token=${encodeURIComponent(conversation.token)}&after=${lastIdRef.current}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        messages: { id: number; sender: "visitor" | "team"; text: string }[];
        is_closed?: boolean;
      };
      if (data.is_closed) setClosed(true);
      if (!data.messages?.length) return;

      let added = 0;
      setMessages((prev) => {
        const known = new Set(prev.map((m) => m.id).filter((x): x is number => x != null));
        const next = [...prev];
        for (const m of data.messages) {
          if (m.id > lastIdRef.current) lastIdRef.current = m.id;
          if (known.has(m.id)) continue;
          next.push({ key: `srv-${m.id}`, id: m.id, from: m.sender, text: m.text, status: "sent" });
          if (m.sender === "team") added += 1;
        }
        return next;
      });
      if (added > 0 && !openRef.current) setUnread((u) => u + added);
    } catch {
      /* réseau indisponible — on réessaiera au prochain tick */
    }
  }, [conversation]);

  useEffect(() => {
    if (!mounted || !conversation) return;
    poll(); // tick immédiat
    const interval = setInterval(poll, open ? POLL_OPEN : POLL_IDLE);
    return () => clearInterval(interval);
  }, [mounted, conversation, open, poll]);

  /* ── Crée la conversation à la volée (1er message) ──
     Identité anonyme par défaut ; e-mail réel utilisé seulement s'il est saisi
     et valide. Renvoie la conversation prête, ou null en cas d'échec. */
  const ensureConversation = useCallback(async (): Promise<Conversation | null> => {
    if (conversation) return conversation;

    const v: Visitor =
      email.trim() && isEmail(email)
        ? { name: "Visiteur", email: email.trim().toLowerCase(), anonymous: false }
        : anonymousVisitor();

    try {
      const res = await fetch("/api/blog-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          page: pathname,
          website: website.current,
        }),
      });
      if (!res.ok) throw new Error("start_failed");
      const data = (await res.json()) as Conversation;
      const convo = { id: data.id, token: data.token };
      lastIdRef.current = 0;
      setVisitor(v);
      setConversation(convo);
      setMessages([{ key: "welcome", id: null, from: "team", text: t.welcome }]);
      return convo;
    } catch {
      setError(t.connError);
      return null;
    }
  }, [conversation, email, pathname, t.welcome, t.connError]);

  /* ── Envoyer un message (crée la conversation si besoin) ── */
  async function send(text: string) {
    const content = text.trim();
    if (!content || sending || closed) return;

    setError("");
    setSending(true);
    sendingRef.current = true;

    const convo = await ensureConversation();
    if (!convo) {
      setSending(false);
      sendingRef.current = false;
      return;
    }

    const key = `tmp-${tmpCounter++}`;
    setMessages((prev) => [...prev, { key, id: null, from: "visitor", text: content, status: "pending" }]);
    setInput("");

    try {
      const res = await fetch("/api/blog-chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convo.id, token: convo.token, text: content }),
      });
      if (!res.ok) throw new Error("send_failed");
      const m = (await res.json()) as { id: number };
      if (m.id > lastIdRef.current) lastIdRef.current = m.id;
      setMessages((prev) =>
        prev.map((x) => (x.key === key ? { ...x, id: m.id, key: `srv-${m.id}`, status: "sent" } : x)),
      );
    } catch {
      setMessages((prev) => prev.map((x) => (x.key === key ? { ...x, status: "failed" } : x)));
    } finally {
      setSending(false);
      sendingRef.current = false;
    }
  }

  if (!mounted) return null;

  const noMessageYet = messages.filter((m) => m.from === "visitor").length === 0;
  const showQuick = noMessageYet && !closed;
  const sentOnce = messages.some((m) => m.from === "visitor" && m.status === "sent");

  return (
    <>
      {/* ── Lanceur flottant (bas-gauche, pour ne pas gêner Horus AI) ── */}
      <div
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 transition-all duration-300 ${
          open ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        {showTeaser && !conversation && (
          <button
            type="button"
            onClick={() => { setOpen(true); setShowTeaser(false); }}
            className="hidden max-w-[15rem] rounded-2xl rounded-bl-sm border border-brand-100 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-ink shadow-xl shadow-brand-900/15 transition-transform hover:scale-[1.02] dark:border-white/10 dark:bg-slate-900 dark:text-brand-50 sm:block"
          >
            {t.teaser}
          </button>
        )}
        <button
          type="button"
          onClick={() => { setOpen(true); setShowTeaser(false); }}
          aria-label={t.launcher}
          className="group relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-xl shadow-brand-900/30 ring-2 ring-white/20 transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 rounded-full bg-brand-500/50 animate-pulse-ring" />
          <span className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full border-2 border-white bg-green-400" />
          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          )}
          <svg viewBox="0 0 24 24" className="relative size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
          </svg>
        </button>
      </div>

      {/* ── Panneau de chat ── */}
      <div
        role="dialog"
        aria-label={t.headerTitle}
        className={`fixed bottom-6 left-6 z-50 flex w-[min(380px,calc(100vw-2rem))] origin-bottom-left flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-2xl shadow-brand-900/25 transition-[transform,opacity] duration-300 dark:border-white/10 dark:bg-slate-900 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
        style={{ height: "min(580px, calc(100vh - 5rem))" }}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-brand-800 to-brand-600 px-5 py-4 text-white">
          <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15 ring-2 ring-white/25">
            <Image src="/photo-the-co-founders-together.png" alt={t.headerTitle} width={44} height={44} className="size-full object-cover" />
          </span>
          <div className="flex-1">
            <p className="font-bold leading-tight">{t.headerTitle}</p>
            <p className="flex items-center gap-1.5 text-xs text-brand-100">
              <span className="size-2 rounded-full bg-green-400" />
              {t.online}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close"
            className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15">
            <IconClose className="size-5" />
          </button>
        </div>

        {/* Corps — conversation immédiate (esprit forum, sans inscription) */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-4 py-4">
          {/* Bulle d'accueil */}
          <div className="flex items-start gap-2">
            <span className="mt-1 grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-700 to-brand-500">
              <Image src="/photo-the-co-founders-together.png" alt="" width={28} height={28} className="size-full object-cover" />
            </span>
            <div className="rounded-2xl rounded-bl-md bg-white p-4 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:text-brand-50 dark:ring-white/10">
              <p className="font-bold">{t.introTitle}</p>
              <p className="mt-1 text-muted dark:text-brand-100/70">{t.introText}</p>
            </div>
          </div>

          {/* Messages de la conversation */}
          {messages
            .filter((m) => m.key !== "welcome")
            .map((m) => (
              <div key={m.key} className={`flex ${m.from === "visitor" ? "justify-end" : "justify-start"}`}>
                {m.from === "team" && (
                  <span className="mr-2 mt-1 grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-700 to-brand-500">
                    <Image src="/photo-the-co-founders-together.png" alt="" width={28} height={28} className="size-full object-cover" />
                  </span>
                )}
                <div className="flex flex-col">
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "visitor"
                      ? `rounded-br-md text-white ${m.status === "failed" ? "bg-red-500" : "bg-brand-700"}`
                      : "rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:text-brand-50 dark:ring-white/10"
                  }`}>
                    {m.text}
                  </div>
                  {m.from === "visitor" && m.status === "failed" && (
                    <button type="button" onClick={() => send(m.text)} className="mt-0.5 self-end text-[11px] font-medium text-red-500 hover:underline">
                      {t.sendFail}
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* Note discrète après le 1er envoi */}
          {sentOnce && !closed && (
            <p className="px-2 text-center text-[11px] text-muted">{t.waiting}</p>
          )}
          {closed && <p className="px-2 text-center text-[11px] font-medium text-muted">{t.closed}</p>}
          {error && <p className="px-2 text-center text-[11px] font-medium text-red-500">{error}</p>}

          {/* E-mail optionnel — uniquement tant qu'aucun message n'est parti */}
          {noMessageYet && !conversation && (
            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:ring-white/10">
              {emailOpen ? (
                <>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder={t.emailPlaceholder}
                    aria-label={t.emailPlaceholder}
                    className="w-full rounded-xl border border-brand-100 bg-surface/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <p className="mt-1.5 px-1 text-[11px] text-muted">{t.emailHint}</p>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEmailOpen(true)}
                  className="flex w-full items-center gap-2 text-left text-[12px] font-medium text-brand-600 dark:text-brand-300"
                >
                  <IconMailSmall className="size-4" />
                  {t.emailToggle}
                </button>
              )}
            </div>
          )}

          {/* Suggestions rapides au démarrage */}
          {showQuick && (
            <div className="flex flex-wrap gap-2 pt-1">
              {t.quick.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:bg-slate-800 dark:text-brand-200 dark:hover:bg-white/5">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Honeypot anti-bot */}
          <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden"
            onChange={(e) => { website.current = e.target.value; }} />

          {/* Canaux instantanés */}
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted">{t.instant}</p>
            <div className="flex gap-2">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]">
                <IconWhatsApp className="size-4" /> WhatsApp
              </a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#229ED9] px-3 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]">
                <IconTelegram className="size-4" /> Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Saisie — toujours disponible */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t border-brand-100 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-end gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              disabled={closed}
              className="min-w-0 flex-1 rounded-full border border-brand-100 bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <button type="submit" disabled={sending || closed || !input.trim()} aria-label="Send"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
              <IconSend className="size-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* Petite icône enveloppe (e-mail optionnel) */
function IconMailSmall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
