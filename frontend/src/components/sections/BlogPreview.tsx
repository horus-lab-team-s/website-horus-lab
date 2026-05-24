"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { IconArrowRight } from "@/components/icons";
import type { PostMeta } from "@/lib/blog";

export function BlogPreview({ posts }: { posts: PostMeta[] }) {
  const { dict, localePath } = useLang();
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-white py-20 dark:bg-[#070e1c] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {dict.blog.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">
              {dict.blog.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {dict.blog.subtitle}
            </p>
          </Reveal>
          <Reveal>
            <Link
              href={localePath("/blog")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            >
              {dict.blog.allArticles}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
