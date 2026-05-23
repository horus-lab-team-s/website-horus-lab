"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { IconArrowRight } from "@/components/icons";
import type { PostMeta } from "@/lib/blog";

export function formatDate(date: string, lang: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function PostCard({ post }: { post: PostMeta }) {
  const { dict, lang, localePath } = useLang();

  return (
    <Link
      href={localePath(`/blog/${post.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900"
    >
      {/* Illustration de couverture */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-500 to-sky">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-grid opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 to-transparent" />
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span aria-hidden>•</span>
          <span>
            {post.readingMinutes} {dict.blog.readTime}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          {dict.blog.readMore}
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
