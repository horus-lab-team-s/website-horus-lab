"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/blog";

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const { dict, lang } = useLang();
  const allLabel = lang === "fr" ? "Tous" : "All";
  const [activeCategory, setActiveCategory] = useState(allLabel);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean));
    return [allLabel, ...Array.from(cats)];
  }, [posts, allLabel]);

  const filtered = activeCategory === allLabel
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <section className="relative overflow-hidden bg-surface py-16 pb-20 sm:pb-28 dark:bg-[#070e1c]">

      {/* ── Fond animé : formes géométriques (comme Réalisations) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-surface to-brand-50/20 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        {/* Halos */}
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-200/10 blur-3xl animate-float-slow dark:bg-brand-500/6" />
        <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/8 blur-3xl animate-drift dark:bg-sky/5" />
        <div className="absolute left-1/2 top-0 h-60 w-60 rounded-full bg-violet-100/8 blur-3xl animate-float dark:bg-violet-500/4" style={{ animationDelay: "2s" }} />
        {/* Formes géométriques */}
        {[
          { sh: "circle", x: "2%", y: "5%", sz: 52, d: "0s", dur: "10s" },
          { sh: "square", x: "92%", y: "3%", sz: 40, d: "1.3s", dur: "9s" },
          { sh: "triangle", x: "12%", y: "72%", sz: 44, d: "0.6s", dur: "11s" },
          { sh: "trapeze", x: "84%", y: "68%", sz: 48, d: "2.0s", dur: "8s" },
          { sh: "diamond", x: "46%", y: "4%", sz: 34, d: "1.6s", dur: "10s" },
          { sh: "hex", x: "66%", y: "82%", sz: 42, d: "0.3s", dur: "9s" },
          { sh: "circle", x: "28%", y: "40%", sz: 28, d: "2.8s", dur: "8s" },
          { sh: "square", x: "76%", y: "30%", sz: 30, d: "0.9s", dur: "11s" },
          { sh: "octo", x: "38%", y: "88%", sz: 36, d: "1.4s", dur: "9s" },
          { sh: "diamond", x: "58%", y: "55%", sz: 26, d: "2.2s", dur: "10s" },
          { sh: "triangle", x: "90%", y: "48%", sz: 32, d: "0.5s", dur: "8s" },
          { sh: "hex", x: "8%", y: "52%", sz: 38, d: "1.9s", dur: "11s" },
        ].map((s, i) => (
          <div key={i} aria-hidden
            className="pointer-events-none absolute animate-float text-brand-400/[0.10] dark:text-brand-300/[0.08]"
            style={{ left: s.x, top: s.y, animationDelay: s.d, animationDuration: s.dur }}
          >
            {s.sh === "circle" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="9" /></svg>}
            {s.sh === "square" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
            {s.sh === "triangle" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,3 22,21 2,21" /></svg>}
            {s.sh === "trapeze" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="5,18 19,18 22,6 2,6" /></svg>}
            {s.sh === "diamond" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,2 22,12 12,22 2,12" /></svg>}
            {s.sh === "hex" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7" /></svg>}
            {s.sh === "octo" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" /></svg>}
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Filtres catégories — centrés (comme Réalisations) */}
        {categories.length > 1 && (
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2.5 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-brand-700 text-white shadow-lg shadow-brand-700/25"
                      : "border border-brand-200 bg-white text-brand-700 hover:-translate-y-0.5 hover:bg-brand-50 hover:border-brand-300 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Grille d'articles */}
        {filtered.length === 0 ? (
          <Reveal className="mt-16">
            <p className="rounded-2xl border border-brand-100 bg-white/70 p-10 text-center text-muted backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              {dict.blog.empty}
            </p>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <Reveal key={post.slug} delay={i * 70}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
