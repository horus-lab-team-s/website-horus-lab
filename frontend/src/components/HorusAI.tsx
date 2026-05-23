"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import {
  IconClose,
  IconEye,
  IconHeadset,
  IconSend,
  IconTelegram,
  IconWhatsApp,
} from "./icons";

type Msg = { role: "user" | "assistant"; content: string };

const WHATSAPP = "https://wa.me/237699173771";
const TELEGRAM = "https://t.me/tonbacm";
const SUPPORT = "mailto:contact@horus-lab.com";

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
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-brand-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync sur changement de langue
    setMessages((prev) =>
      prev.length <= 1 ? [{ role: "assistant", content: ai.greeting }] : prev
    );
  }, [ai.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

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
      {/* Réseaux de contact — bas droite (cluster distinct) */}
      <div
        className={`fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3 transition-all duration-300 ${
          open ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <ChannelLink href={SUPPORT} label={supportLabel} className="bg-brand-600">
          <IconHeadset className="size-6" />
        </ChannelLink>
        <ChannelLink href={TELEGRAM} label="Telegram" className="bg-[#229ED9]">
          <IconTelegram className="size-6" />
        </ChannelLink>
        <ChannelLink href={WHATSAPP} label="WhatsApp" className="bg-[#25D366]" pulse>
          <IconWhatsApp className="size-6" />
        </ChannelLink>
      </div>

      {/* Horus AI — milieu droite, séparé des réseaux pour éviter toute confusion */}
      <div
        className={`fixed right-4 top-1/2 z-50 -translate-y-1/2 transition-opacity duration-300 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={ai.open}
          aria-expanded={open}
          className="group relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-xl shadow-brand-900/30 transition-transform hover:scale-105 animate-bob"
        >
          <span className="absolute inset-0 rounded-full bg-brand-500/60 animate-pulse-ring" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-brand-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {ai.title}
          </span>
          <IconEye className="relative size-8" />
        </button>
      </div>

      {/* Panneau de chat */}
      <div
        role="dialog"
        aria-label={ai.title}
        className={`fixed right-4 top-1/2 z-50 flex w-[min(380px,calc(100vw-2rem))] -translate-y-1/2 origin-right flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-2xl shadow-brand-900/25 transition-[transform,opacity] duration-300 dark:border-white/10 dark:bg-slate-900 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: "min(560px, calc(100vh - 5rem))" }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand-800 to-brand-600 px-5 py-4 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-white/15">
            <IconEye className="size-6" />
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

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
            <div className="flex justify-start">
              <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-brand-100 dark:bg-slate-800 dark:ring-white/10">
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
