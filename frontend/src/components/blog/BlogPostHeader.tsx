"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { IconArrowRight } from "@/components/icons";
import { formatDate } from "./PostCard";
import { coverFor } from "@/lib/blogImages";
import type { PostMeta } from "@/lib/blog";

export function BlogPostHeader({ post }: { post: PostMeta }) {
  const { dict, lang, localePath } = useLang();
  // Image de fond liée au thème de l'article (cover distant si valide, sinon un
  // visuel tech stable par article) — la même que la carte du blog.
  const bg = coverFor(post);

  return (
    <header className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-16">
      {/* Image du thème en fond + voile sombre pour garder le titre lisible */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/72 to-brand-900/88" />
        <div className="bg-grid-soft absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Link
          href={localePath("/blog")}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-100 transition-colors hover:text-white"
        >
          <IconArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          {dict.blog.backToBlog}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-brand-100/90">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span aria-hidden>·</span>
          <span>
            {post.readingMinutes} {dict.blog.readTime}
          </span>
        </div>

        {/* Titre justifié comme le corps de l'article. La DERNIÈRE ligne reste
            alignée à gauche (comportement natif de `text-justify`) : pas d'espaces
            étirés sur un titre qui se termine par 2 mots. */}
        <h1 className="mt-4 text-justify text-3xl font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.55)] sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm font-medium text-brand-100/85">
          {dict.blog.by} {post.author}
        </p>
      </div>
    </header>
  );
}
