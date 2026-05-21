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
    <section id="blog" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">
              {dict.blog.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
              {dict.blog.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {dict.blog.subtitle}
            </p>
          </Reveal>
          <Reveal>
            <Link
              href={localePath("/blog")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
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
