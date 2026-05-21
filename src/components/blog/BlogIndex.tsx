"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/blog";

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const { dict } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">
            {dict.blog.eyebrow}
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
            {dict.blog.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {dict.blog.subtitle}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-muted">{dict.blog.empty}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
