"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";
import { getNews } from "@/lib/news";

function formatDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function News() {
  const { dict, lang, localePath } = useLang();
  const n = dict.news;
  const items = getNews(lang).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section
      id="news"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-[380px] w-[380px] rounded-full bg-sky/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* En-tête + lien "tout voir" */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {n.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
              {n.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {n.subtitle}
            </p>
          </Reveal>
          <Reveal>
            <Link
              href={localePath("/news")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            >
              {n.viewAll}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Feed éditorial : 4 items, ligne fine séparatrice */}
        <ol className="mt-12">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <li className="group relative grid grid-cols-1 gap-4 border-t border-brand-100 py-6 transition-colors hover:border-brand-300 dark:border-white/10 dark:hover:border-white/25 sm:grid-cols-[180px_1fr_auto] sm:items-start sm:gap-8 sm:py-7">
                {/* Date + tag */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <time
                    dateTime={it.date}
                    className="text-sm font-semibold text-brand-700 dark:text-brand-300"
                  >
                    {formatDate(it.date, lang)}
                  </time>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:bg-white/5 dark:text-brand-200">
                    <span className="size-1.5 rounded-full bg-brand-500" />
                    {it.tag}
                  </span>
                </div>

                {/* Titre + corps */}
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-brand-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 sm:text-xl">
                    {it.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {it.body}
                  </p>
                </div>

                {/* Lien externe ou flèche d'indication */}
                <div className="sm:pt-1">
                  {it.url ? (
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                    >
                      {n.readMore}
                      <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <IconArrowRight
                      aria-hidden
                      className="size-5 text-brand-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-600 dark:text-brand-700"
                    />
                  )}
                </div>

                {/* Liseré qui s'illumine */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-sky to-transparent transition-transform duration-700 group-hover:scale-x-100"
                />
              </li>
            </Reveal>
          ))}
          {/* Ligne de clôture */}
          <li
            aria-hidden
            className="h-px bg-brand-100 dark:bg-white/10"
          />
        </ol>
      </div>
    </section>
  );
}
