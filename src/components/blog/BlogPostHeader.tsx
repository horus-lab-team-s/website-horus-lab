"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { IconArrowRight } from "@/components/icons";
import { formatDate } from "./PostCard";
import type { PostMeta } from "@/lib/blog";

export function BlogPostHeader({ post }: { post: PostMeta }) {
  const { dict, lang, localePath } = useLang();

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface pt-32 pb-12 dark:from-slate-950 dark:to-[#070e1c] sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Link
          href={localePath("/blog")}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          <IconArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          {dict.blog.backToBlog}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-white/10 dark:text-brand-200">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span aria-hidden>•</span>
          <span>
            {post.readingMinutes} {dict.blog.readTime}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-brand-900 dark:text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm font-medium text-muted">
          {dict.blog.by} {post.author}
        </p>
      </div>
    </header>
  );
}
