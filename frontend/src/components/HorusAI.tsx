"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import {
  IconClose,
  IconHeadset,
  IconSend,
  IconTelegram,
  IconWhatsApp,
} from "./icons";

type Msg = { role: "user" | "assistant"; content: string };

const WHATSAPP = "https://wa.me/237699173771";
const TELEGRAM = "https://t.me/tonbacm";
const SUPPORT = "mailto:contact@horus-lab.com";

/** Icône chatbot IA sophistiquée — cerveau connecté / robot */
function IconAIBot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Tête robot */}
      <rect x="8" y="13" width="24" height="18" rx="6" fill="currentColor" opacity="0.15" />
      <rect x="8" y="13" width="24" height="18" rx="6" stroke="currentColor" strokeWidth="1.8" />
      {/* Antenne */}
      <line x1="20" y1="13" x2="20" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="6.5" r="2" fill="currentColor" className="animate-pulse" />
      {/* Yeux */}
      <circle cx="15" cy="21" r="2.5" fill="currentColor" />
      <circle cx="25" cy="21" r="2.5" fill="currentColor" />
      {/* Pupilles lumineuses */}
      <circle cx="15.8" cy="20.2" r="0.8" fill="white" />
      <circle cx="25.8" cy="20.2" r="0.8" fill="white" />
      {/* Bouche / expression */}
      <path d="M14 27 Q20 30 26 27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Oreilles */}
      <rect x="4" y="17" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="32" y="17" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      {/* Signal wifi sur le front */}
      <path d="M17 17 Q20 14.5 23 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

function ChannelLink({
  href,
  label,
  className,
  pulse,
  children,
}: {
  href: string;
  label: string;
  className: string;
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative grid size-12 place-items-center rounded-full text-white shadow-lg shadow-brand-900/25 transition-transform hover:scale-110 ${className}`}
    >
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-current opacity-60 animate-pulse-ring" />
      )}
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-brand-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <span className="relative">{children}</span>
    </a>
  );
}

export function HorusAI() {
  const { dict, lang } = useLang();
  const ai = dict.ai;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: ai.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.length <= 1 ? [{ role: "assistant", content: ai.greeting }] : prev
    );
  }, [ai.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  // Signale l'ouverture/fermeture du chat (le bouton « haut de page » s'efface alors).
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("horusai:toggle", { detail: open }));
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: res.ok && data.reply ? data.reply : ai.error },
      ]);
      setOffline(data?.reason === "provider_error");
    } catch {
      setMessages([...next, { role: "assistant", content: ai.error }]);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }

  const supportLabel = lang === "fr" ? "Support (e-mail)" : "Support (email)";

  return (
    <>
      {/* Cluster bas-droite : UNE seule icône. Les canaux (Support / Telegram /
          WhatsApp) se déplient au survol ou au focus, et se replient en quittant. */}
      <div
        className={`group fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3 transition-all duration-300 ${
          open ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        {/* Canaux repliés par défaut — révélés au survol/focus de l'icône */}
        <div className="flex flex-col items-center gap-3 translate-y-3 opacity-0 pointer-events-none transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
          {/* Support email */}
          <ChannelLink href={SUPPORT} label={supportLabel} className="bg-brand-600">
            <IconHeadset className="size-6" />
          </ChannelLink>

          {/* Telegram */}
          <ChannelLink href={TELEGRAM} label="Telegram" className="bg-[#229ED9]">
            <IconTelegram className="size-6" />
          </ChannelLink>

          {/* WhatsApp */}
          <ChannelLink href={WHATSAPP} label="WhatsApp" className="bg-[#25D366]">
            <IconWhatsApp className="size-6" />
          </ChannelLink>
        </div>

        {/* Icône principale — Horus AI (ouvre le chat au clic, déplie les canaux au survol) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={ai.open}
          aria-expanded={open}
          className="relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-xl shadow-brand-900/30 ring-2 ring-white/20 transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 rounded-full bg-brand-500/40 animate-pulse-ring" />
          {/* Petit indicateur « + » qui invite à survoler */}
          <span aria-hidden className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-sky text-[13px] font-bold leading-none text-white ring-2 ring-white/70 transition-transform group-hover:rotate-45">
            +
          </span>
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-brand-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {ai.title}
          </span>
          <IconAIBot className="relative size-9 text-white" />
        </button>
      </div>

      {/* Panneau de chat */}
      <div
        role="dialog"
        aria-label={ai.title}
        className={`fixed bottom-6 right-6 z-50 flex w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-2xl shadow-brand-900/25 transition-[transform,opacity] duration-300 dark:border-white/10 dark:bg-slate-900 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        }`}
        style={{ height: "min(560px, calc(100vh - 5rem))" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand-800 to-brand-600 px-5 py-4 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-white/15">
            <IconAIBot className="size-7 text-white" />
          </span>
          <div className="flex-1">
            <p className="font-bold leading-tight">{ai.title}</p>
            <p className="flex items-center gap-1.5 text-xs text-brand-100">
              <span
                className={`size-2 rounded-full ${offline ? "bg-amber-400" : "bg-green-400"}`}
              />
              {offline ? ai.offline : ai.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={ai.close}
            className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            <IconClose className="size-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <span className="mr-2 mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500">
                  <IconAIBot className="size-5 text-white" />
                </span>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-brand-700 text-white"
                    : "rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:text-brand-50 dark:ring-white/10"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center justify-start gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500">
                <IconAIBot className="size-5 text-white" />
              </span>
              <div className="flex gap-1.5 rounded-lg rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:ring-white/10">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="typing-dot size-2 rounded-full bg-brand-400"
                    style={{ animationDelay: `${d * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {ai.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:bg-slate-800 dark:text-brand-200 dark:hover:bg-white/5"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zone de saisie */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-brand-100 bg-white p-3 dark:border-white/10 dark:bg-slate-900"
        >
          <div className="flex items-end gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ai.placeholder}
              aria-label={ai.placeholder}
              className="min-w-0 flex-1 rounded-full border border-brand-100 bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={ai.send}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
            >
              <IconSend className="size-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">{ai.disclaimer}</p>
        </form>
      </div>
    </>
  );
}
