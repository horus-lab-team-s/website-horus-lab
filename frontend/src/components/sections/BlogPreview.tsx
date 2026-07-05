"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";
import { coverFor } from "@/lib/blogImages";
import type { PostMeta } from "@/lib/blog";

const CAT_GRAD: Record<string, string> = {
  "Actualités Tech":         "from-brand-700 to-brand-500",
  "Tech News":               "from-brand-700 to-brand-500",
  "Développement":           "from-slate-700 to-brand-600",
  "Development":             "from-slate-700 to-brand-600",
  "Tech Afrique":            "from-emerald-600 to-teal-500",
  "Tech Africa":             "from-emerald-600 to-teal-500",
  "Transformation Digitale": "from-violet-600 to-purple-500",
  "Digital Transformation":  "from-violet-600 to-purple-500",
  "Formation IT":            "from-amber-500 to-orange-400",
  "IT Training":             "from-amber-500 to-orange-400",
};

/* Accentuation couleur par catégorie (border + texte badge) */
const CAT_ACCENT: Record<string, { border: string; badge: string; dot: string }> = {
  "Actualités Tech":         { border: "border-brand-400/50", badge: "bg-brand-600 text-white", dot: "bg-brand-400" },
  "Tech News":               { border: "border-brand-400/50", badge: "bg-brand-600 text-white", dot: "bg-brand-400" },
  "Développement":           { border: "border-slate-400/50", badge: "bg-slate-700 text-white", dot: "bg-slate-400" },
  "Development":             { border: "border-slate-400/50", badge: "bg-slate-700 text-white", dot: "bg-slate-400" },
  "Tech Afrique":            { border: "border-emerald-400/50", badge: "bg-emerald-600 text-white", dot: "bg-emerald-400" },
  "Tech Africa":             { border: "border-emerald-400/50", badge: "bg-emerald-600 text-white", dot: "bg-emerald-400" },
  "Transformation Digitale": { border: "border-violet-400/50", badge: "bg-violet-600 text-white", dot: "bg-violet-400" },
  "Digital Transformation":  { border: "border-violet-400/50", badge: "bg-violet-600 text-white", dot: "bg-violet-400" },
  "Formation IT":            { border: "border-amber-400/50", badge: "bg-amber-500 text-white", dot: "bg-amber-400" },
  "IT Training":             { border: "border-amber-400/50", badge: "bg-amber-500 text-white", dot: "bg-amber-400" },
};

function getImg(post: PostMeta) {
  return coverFor(post);
}
function getGrad(post: PostMeta) { return CAT_GRAD[post.category] ?? "from-brand-700 to-brand-500"; }
function getAccent(post: PostMeta) {
  return CAT_ACCENT[post.category] ?? { border: "border-brand-400/50", badge: "bg-brand-600 text-white", dot: "bg-brand-400" };
}

const CARD_W = 230; // largeur compacte comme Process
const GAP    = 16;
const SPEED  = 40;  // px/s — lisible

export function BlogPreview({ posts }: { posts: PostMeta[] }) {
  const { dict, lang, localePath } = useLang();
  if (posts.length === 0) return null;

  /* Dupliquer pour boucle infinie */
  const CLONE = [...posts, ...posts, ...posts]; // triple pour avoir assez de largeur
  const total = posts.length;

  const offsetRef  = useRef(0);
  const pausedRef  = useRef(false);
  const rafRef     = useRef<number | null>(null);
  const lastRef    = useRef<number>(0);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const limit = total * (CARD_W + GAP);

    function tick(now: number) {
      if (!pausedRef.current) {
        const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
        offsetRef.current += SPEED * dt;
        if (offsetRef.current >= limit) offsetRef.current -= limit;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [total]);

  return (
    <section id="blog" className="relative overflow-hidden bg-surface py-20 sm:py-24 dark:bg-[#070e1c]">

      {/* ── Fond : même style que Réalisations (formes + grille + halos) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        {/* Halos */}
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-brand-300/10 blur-3xl animate-float-slow dark:bg-brand-600/8" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/8 blur-3xl animate-drift dark:bg-sky/5" />
        <div className="absolute left-1/2 top-0 h-56 w-56 rounded-full bg-violet-200/8 blur-3xl animate-float dark:bg-violet-600/5" style={{ animationDelay: "1.5s" }} />
        {/* Tracé circuit */}
        <svg aria-hidden viewBox="0 0 1400 400" preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-brand-300/10 dark:text-brand-600/8">
          <path d="M0 200 H200 L260 140 H500 L560 200 H780 L840 130 H1060 L1120 200 H1400"
            fill="none" stroke="currentColor" strokeWidth="0.8" />
          {[200, 500, 780, 1060].map((x, k) => (
            <circle key={k} cx={x} cy={k % 2 === 0 ? 140 : 200} r="2.5" fill="currentColor" />
          ))}
        </svg>
        {/* Nos réalisations en filigrane très subtil (nos vrais projets) */}
        <div className="absolute inset-x-0 bottom-4 overflow-hidden opacity-[0.04] select-none dark:opacity-[0.06]">
          <div className="flex gap-8 whitespace-nowrap text-4xl font-black text-brand-900 dark:text-white animate-[marquee_50s_linear_infinite]">
            {["Afrikamode","Gathe Finance","Elec One","e-Learning","Formation IT","Horus-Lab",
              "Afrikamode","Gathe Finance","Elec One","e-Learning","Formation IT","Horus-Lab"].map((n,i) => (
              <span key={i} className="shrink-0">{n}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* En-tête */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {dict.blog.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
              {dict.blog.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{dict.blog.subtitle}</p>
          </Reveal>
          <Reveal>
            <Link href={localePath("/blog")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-300 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5">
              {dict.blog.allArticles}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* ── Rangée du haut : cartes vedettes avec images Unsplash ── */}
        {posts.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => {
              const img    = getImg(post);
              const grad   = getGrad(post);
              const accent = getAccent(post);
              return (
                <Reveal key={`feat-${post.slug}`} delay={i * 90}>
                  <Link
                    href={localePath(`/blog/${post.slug}`)}
                    className={`group lift-xl flex h-full flex-col overflow-hidden rounded-3xl border bg-white dark:bg-slate-900 ${accent.border}`}
                  >
                    <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${grad}`}>
                      <Image
                        src={img}
                        alt={post.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="zoom-img object-cover opacity-85"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <span className={`absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${accent.badge}`}>
                        <span className={`size-1.5 rounded-full ${accent.dot}`} />
                        {post.category}
                      </span>
                      <span aria-hidden className="shine pointer-events-none absolute inset-0" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>
                          {new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
                            day: "numeric", month: "long", year: "numeric",
                          }).format(new Date(post.date))}
                        </span>
                        <span aria-hidden>·</span>
                        <span>{post.readingMinutes} {dict.blog.readTime}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300">
                        {dict.blog.readMore}
                        <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* ── Carousel infini RAF ── */}
        <div
          className="relative mt-12 overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {/* Masques fondu aux bords */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-surface to-transparent dark:from-[#070e1c]" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-surface to-transparent dark:from-[#070e1c]" />

          {/* Piste */}
          <div
            ref={trackRef}
            className="flex"
            style={{ gap: `${GAP}px`, willChange: "transform" }}
          >
            {CLONE.map((post, i) => {
              const img    = getImg(post);
              const grad   = getGrad(post);
              const accent = getAccent(post);

              return (
                <Link
                  key={`${post.slug}-${i}`}
                  href={localePath(`/blog/${post.slug}`)}
                  className={`group flex-shrink-0 flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:bg-slate-900 ${accent.border}`}
                  style={{ width: CARD_W }}
                >
                  {/* ── Image compacte ── */}
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${grad}`}
                    style={{ height: 120, position: "relative" }}
                  >
                    <Image
                      src={img}
                      alt={post.title}
                      fill
                      sizes={`${CARD_W}px`}
                      className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      unoptimized={false}
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Badge catégorie */}
                    <span className={`absolute bottom-2 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${accent.badge}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* ── Contenu compact ── */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Date + temps de lecture */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted">
                      <span className={`size-1.5 rounded-full ${accent.dot}`} />
                      <span>
                        {new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
                          day: "numeric", month: "short", year: "numeric",
                        }).format(new Date(post.date))}
                      </span>
                      <span>·</span>
                      <span>{post.readingMinutes} {dict.blog.readTime}</span>
                    </div>

                    {/* Titre */}
                    <h3 className="mt-2 text-[13px] font-extrabold leading-snug text-brand-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                      {post.title}
                    </h3>

                    {/* Extrait */}
                    <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-muted line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <li key={tag} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-white/5 dark:text-brand-300">
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Lire */}
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-300">
                      {dict.blog.readMore}
                      <IconArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Liseré bas coloré */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${grad}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Indicateurs de couleur (un par catégorie présente) */}
        <div className="mt-6 flex justify-center gap-3">
          {posts.map((post, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${getGrad(post)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
