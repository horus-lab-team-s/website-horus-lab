"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";

/* ============================================================
   Forum PUBLIC d'un article (façon commentaires/forum pro).
   Tout le monde lit le fil ; chacun poste sous un pseudo (optionnel).
   L'équipe répond depuis l'admin (badge « Équipe Horus-Lab »). Les
   nouveaux messages arrivent en direct (polling). Aucune inscription.
   ============================================================ */

type ReplyPreview = {
  id: number;
  author_name: string;
  text: string;
  is_staff: boolean;
};

type Post = {
  key: string;
  id: number | null;
  author_name: string;
  text: string;
  is_staff: boolean;
  created_at: string;
  reply_to?: ReplyPreview | null;
  pending?: boolean;
  failed?: boolean;
};

const POLL_MS = 10000;

const T = {
  fr: {
    heading: "Discussion",
    intro: "Une question, un avis ? Écrivez ici : l'équipe et les autres lecteurs vous répondent publiquement.",
    empty: "Aucun message pour l'instant. Lancez la discussion.",
    name: "Votre nom (optionnel)",
    message: "Écrivez un message public…",
    publish: "Publier",
    publishing: "Publication…",
    team: "Équipe Horus-Lab",
    anon: "Visiteur",
    retry: "Non publié, réessayer",
    note: "Les messages sont publics, visibles par tous les lecteurs.",
    reply: "Répondre",
    replyingTo: "En réponse à",
    cancelReply: "Annuler la réponse",
  },
  en: {
    heading: "Discussion",
    intro: "A question or a thought? Post here: the team and other readers will reply, publicly.",
    empty: "No messages yet. Start the discussion.",
    name: "Your name (optional)",
    message: "Write a public message…",
    publish: "Post",
    publishing: "Posting…",
    team: "Horus-Lab team",
    anon: "Visitor",
    retry: "Not posted, retry",
    note: "Messages are public, visible to all readers.",
    reply: "Reply",
    replyingTo: "Replying to",
    cancelReply: "Cancel reply",
  },
};

let tmp = 0;

export function BlogForum({ slug, title }: { slug: string; title?: string }) {
  const { lang } = useLang();
  const t = T[lang] ?? T.fr;

  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [replyTo, setReplyTo] = useState<ReplyPreview | null>(null);

  const lastId = useRef(0);
  const website = useRef(""); // honeypot
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const merge = useCallback((incoming: Omit<Post, "key">[]) => {
    if (!incoming.length) return;
    setPosts((prev) => {
      const known = new Set(prev.map((p) => p.id).filter((x): x is number => x != null));
      const next = [...prev];
      for (const p of incoming) {
        if (p.id != null && p.id > lastId.current) lastId.current = p.id;
        if (p.id != null && known.has(p.id)) continue;
        next.push({ ...p, key: `srv-${p.id}` });
      }
      return next;
    });
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/${slug}?after=${lastId.current}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { posts?: Omit<Post, "key">[] };
      if (data.posts?.length) merge(data.posts);
    } catch {
      /* réseau indisponible — on réessaiera */
    }
  }, [slug, merge]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    const onVis = () => document.visibilityState === "visible" && poll();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [poll]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setError(false);
    setSending(true);
    const key = `tmp-${tmp++}`;
    const authorName = name.trim() || t.anon;
    const currentReply = replyTo; // message cité, capturé avant reset
    setPosts((prev) => [
      ...prev,
      { key, id: null, author_name: authorName, text: content, is_staff: false, created_at: new Date().toISOString(), reply_to: currentReply, pending: true },
    ]);
    setInput("");
    setReplyTo(null);

    try {
      const res = await fetch(`/api/forum/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: name.trim(),
          text: content,
          thread_title: title ?? "",
          reply_to: currentReply?.id ?? null,
          website: website.current,
        }),
      });
      if (!res.ok) throw new Error("post_failed");
      const saved = (await res.json()) as Post;
      if (saved.id != null && saved.id > lastId.current) lastId.current = saved.id;
      setPosts((prev) =>
        prev.map((p) =>
          p.key === key
            ? { ...p, id: saved.id, key: saved.id != null ? `srv-${saved.id}` : p.key, reply_to: saved.reply_to ?? currentReply, pending: false }
            : p,
        ),
      );
    } catch {
      setError(true);
      setPosts((prev) => prev.map((p) => (p.key === key ? { ...p, pending: false, failed: true } : p)));
    } finally {
      setSending(false);
    }
  }

  function fmt(iso: string) {
    try {
      return new Date(iso).toLocaleString(lang === "en" ? "en-GB" : "fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  const count = posts.filter((p) => !p.failed).length;

  return (
    <section aria-label={t.heading} className="bg-surface pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-xl font-bold text-ink dark:text-brand-50">
              {t.heading}
              {count > 0 && <span className="ml-1 text-brand-600 dark:text-brand-300">({count})</span>}
            </h2>
          </div>
          <p className="mb-6 text-sm text-muted dark:text-brand-100/70">{t.intro}</p>

          {/* Fil des messages */}
          <div ref={listRef} className="space-y-4">
            {posts.length === 0 && (
              <p className="rounded-lg bg-surface/60 px-4 py-6 text-center text-sm text-muted dark:bg-white/5">
                {t.empty}
              </p>
            )}
            {posts.map((p) => (
              <div key={p.key} className={`flex ${p.is_staff ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  p.is_staff
                    ? "rounded-br-md bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-500/10 dark:ring-brand-400/20"
                    : "rounded-bl-md bg-surface/70 ring-1 ring-brand-100 dark:bg-white/5 dark:ring-white/10"
                } ${p.pending ? "opacity-60" : ""} ${p.failed ? "ring-red-300" : ""}`}>
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span className={`font-bold ${p.is_staff ? "text-brand-700 dark:text-brand-300" : "text-ink dark:text-brand-50"}`}>
                      {p.is_staff ? t.team : p.author_name || t.anon}
                    </span>
                    {p.is_staff && (
                      <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        ✓ {lang === "en" ? "Team" : "Équipe"}
                      </span>
                    )}
                    <span className="text-muted">· {fmt(p.created_at)}</span>
                  </div>
                  {p.reply_to && (
                    <div className="mb-1.5 rounded-md border-l-2 border-brand-400 bg-brand-50/70 px-2 py-1 dark:border-brand-400/50 dark:bg-white/5">
                      <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                        {p.reply_to.is_staff ? t.team : p.reply_to.author_name || t.anon}
                      </span>
                      <p className="line-clamp-2 text-[11px] leading-snug text-muted">{p.reply_to.text}</p>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink dark:text-brand-50">{p.text}</p>
                  {p.failed && <p className="mt-1 text-[11px] font-medium text-red-500">{t.retry}</p>}
                  {p.id != null && !p.pending && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo({ id: p.id as number, author_name: p.author_name, text: p.text, is_staff: p.is_staff });
                        textareaRef.current?.focus();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
                    >
                      ↩ {t.reply}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <form onSubmit={submit} className="mt-6 space-y-3">
            {/* Barre « En réponse à … » (citation du message auquel on répond) */}
            {replyTo && (
              <div className="flex items-start justify-between gap-2 rounded-md border-l-2 border-brand-500 bg-brand-50 px-3 py-2 dark:border-brand-400/60 dark:bg-white/5">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                    {t.replyingTo} {replyTo.is_staff ? t.team : replyTo.author_name || t.anon}
                  </span>
                  <p className="truncate text-[11px] text-muted">{replyTo.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  aria-label={t.cancelReply}
                  className="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-brand-700 dark:hover:text-brand-200"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name}
              aria-label={t.name}
              maxLength={120}
              className="w-full rounded-md border border-brand-100 bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            {/* Honeypot anti-bot */}
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
              onChange={(e) => { website.current = e.target.value; }}
            />
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.message}
                aria-label={t.message}
                rows={2}
                maxLength={5000}
                className="min-h-[46px] flex-1 resize-y rounded-md border border-brand-100 bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="shrink-0 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
              >
                {sending ? t.publishing : t.publish}
              </button>
            </div>
            <p className="text-[11px] text-muted">{t.note}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
