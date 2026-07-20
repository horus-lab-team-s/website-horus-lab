"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";
import { coverFor } from "@/lib/blogImages";
import { PostCard, formatDate } from "./PostCard";
import type { PostMeta } from "@/lib/blog";

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const { dict, lang, localePath } = useLang();
  const allLabel = lang === "fr" ? "Tous" : "All";
  const [activeCategory, setActiveCategory] = useState(allLabel);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean));
    return [allLabel, ...Array.from(cats)];
  }, [posts, allLabel]);

  const filtered = activeCategory === allLabel
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <section className="relative overflow-hidden bg-surface py-16 pb-20 sm:pb-28 dark:bg-[#070e1c]">

      {/* ── Fond sobre : dégradé + grille + halos discrets ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-surface to-brand-50/20 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
        <div className="absolute inset-0 bg-grid-soft opacity-30 dark:opacity-20" />
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-200/10 blur-3xl dark:bg-brand-500/6" />
        <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/8 blur-3xl dark:bg-sky/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Filtres catégories — centrés */}
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

        {filtered.length === 0 ? (
          <Reveal className="mt-16">
            <p className="rounded-lg border border-brand-100 bg-white/70 p-10 text-center text-muted backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              {dict.blog.empty}
            </p>
          </Reveal>
        ) : (
          <>
            {/* ── Article à la une (le plus récent) ── */}
            {featured && (
              <Reveal className="mt-10">
                <Link
                  href={localePath(`/blog/${featured.slug}`)}
                  className="group grid overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900 lg:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[320px]">
                    <Image
                      src={coverFor(featured)}
                      alt={featured.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 640px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      <span className="size-1.5 rounded-full bg-white/80" />
                      {lang === "fr" ? "À la une" : "Featured"}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center gap-3 p-7 sm:p-9">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted">
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700 dark:bg-white/5 dark:text-brand-200">
                        {featured.category}
                      </span>
                      <time dateTime={featured.date}>{formatDate(featured.date, lang)}</time>
                      <span aria-hidden>·</span>
                      <span>{featured.readingMinutes} {dict.blog.readTime}</span>
                    </div>

                    <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 sm:text-3xl">
                      {featured.title}
                    </h2>

                    <p className="line-clamp-3 text-[15px] leading-relaxed text-muted">
                      {featured.excerpt}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-300">
                      {dict.blog.readMore}
                      <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* ── Les autres articles ── */}
            {rest.length > 0 && (
              <>
                <Reveal className="mt-14 mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500">
                    {lang === "fr" ? "Derniers articles" : "Latest articles"}
                  </h2>
                </Reveal>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.slug} delay={i * 70}>
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
