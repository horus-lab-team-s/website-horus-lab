"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { IconArrowRight } from "@/components/icons";
import { coverFor } from "@/lib/blogImages";
import { companyLogosFor } from "@/lib/blogCompanies";
import type { PostMeta } from "@/lib/blog";

export function formatDate(date: string, lang: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(date));
}

const CAT_GRADIENTS: Record<string, string> = {
  "Actualités Tech":          "from-brand-700 to-brand-500",
  "Tech News":                "from-brand-700 to-brand-500",
  "Développement":            "from-slate-700 to-brand-600",
  "Development":              "from-slate-700 to-brand-600",
  "Tech Afrique":             "from-emerald-600 to-teal-500",
  "Tech Africa":              "from-emerald-600 to-teal-500",
  "Transformation Digitale":  "from-violet-600 to-brand-500",
  "Digital Transformation":   "from-violet-600 to-brand-500",
  "Formation IT":             "from-amber-500 to-orange-400",
  "IT Training":              "from-amber-500 to-orange-400",
};

/* Couleurs de badge catégorie */
const CAT_BADGE: Record<string, string> = {
  "Actualités Tech":         "bg-brand-600 text-white",
  "Tech News":               "bg-brand-600 text-white",
  "Développement":           "bg-slate-700 text-white",
  "Development":             "bg-slate-700 text-white",
  "Tech Afrique":            "bg-emerald-600 text-white",
  "Tech Africa":             "bg-emerald-600 text-white",
  "Transformation Digitale": "bg-violet-600 text-white",
  "Digital Transformation":  "bg-violet-600 text-white",
  "Formation IT":            "bg-amber-500 text-white",
  "IT Training":             "bg-amber-500 text-white",
};

export function PostCard({ post }: { post: PostMeta }) {
  const { dict, lang, localePath } = useLang();
  const img  = coverFor(post);
  const grad = CAT_GRADIENTS[post.category] ?? "from-brand-700 to-brand-500";
  const badge = CAT_BADGE[post.category] ?? "bg-brand-600 text-white";
  const logos = companyLogosFor(`${post.title} ${post.excerpt} ${post.tags?.join(" ") ?? ""}`);

  return (
    <Link
      href={localePath(`/blog/${post.slug}`)}
      className="group lift-xl relative flex h-full flex-col overflow-hidden bg-white shadow-sm dark:bg-slate-900"
    >
      {/* ── Couverture avec image réelle ── */}
      <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${grad}`}>
        <Image
          src={img}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="zoom-img object-cover opacity-80"
        />
        {/* Overlay dégradé bas */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Badge catégorie coloré */}
        <span className={`absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${badge}`}>
          <span className="size-1.5 rounded-full bg-white/70" />
          {post.category}
        </span>

        {/* Shine */}
        <span aria-hidden className="shine pointer-events-none absolute inset-0" />
      </div>

      {/* ── Corps ── */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} {dict.blog.readTime}</span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <li key={tag} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-white/5 dark:text-brand-300">
                #{tag}
              </li>
            ))}
          </ul>
        )}

        {/* Logos des entreprises citées (miniatures) */}
        {logos.length > 0 && (
          <ul className="mt-3 flex items-center gap-2.5" aria-label="Entreprises citées">
            {logos.map((l) => (
              <li key={l.name} title={l.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.name} width={18} height={18} loading="lazy"
                  className="size-[18px] object-contain opacity-60 dark:opacity-80 dark:invert" />
              </li>
            ))}
          </ul>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700 dark:text-brand-300">
          {dict.blog.readMore}
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
