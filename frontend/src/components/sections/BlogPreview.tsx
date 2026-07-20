"use client";

import Image from "next/image";
import Link from "next/link";
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

function getGrad(post: PostMeta) { return CAT_GRAD[post.category] ?? "from-brand-700 to-brand-500"; }
function getAccent(post: PostMeta) {
  return CAT_ACCENT[post.category] ?? { border: "border-brand-400/50", badge: "bg-brand-600 text-white", dot: "bg-brand-400" };
}

export function BlogPreview({ posts }: { posts: PostMeta[] }) {
  const { dict, lang, localePath } = useLang();
  if (posts.length === 0) return null;

  const featured = posts.slice(0, 3);

  return (
    <section id="blog" className="relative overflow-hidden bg-surface py-16 dark:bg-[#070e1c] sm:py-20">

      {/* ── Fond sobre : grille fine + halos discrets ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-brand-300/10 blur-3xl dark:bg-brand-600/8" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/8 blur-3xl dark:bg-sky/5" />
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
              className="group inline-flex items-center gap-2 rounded-md border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-300 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5">
              {dict.blog.allArticles}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* ── Cartes vedettes (pas de défilage : évite la répétition) ── */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, i) => {
            const img    = coverFor(post);
            const grad   = getGrad(post);
            const accent = getAccent(post);
            return (
              <Reveal key={post.slug} delay={i * 90}>
                <Link
                  href={localePath(`/blog/${post.slug}`)}
                  className={`group lift-xl flex h-full flex-col overflow-hidden rounded-lg border bg-white dark:bg-slate-900 ${accent.border}`}
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
      </div>
    </section>
  );
}
