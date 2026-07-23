"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "@/components/sections/HeroBackground";

export function BlogHero() {
  const { dict } = useLang();
  const b = dict.blog;

  return (
    <section className="relative isolate flex min-h-[52vh] items-center overflow-hidden pt-24 pb-12 sm:pb-14">
      {/* Fond vidéo « actualité tech » (boucle) — image de repli si hors-ligne */}
      <HeroBackground videoSrc="/blog/blog-hero.mp4" poster="/img/photo-1518770660439-4636190af475-w1920.jpg" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            <span className="size-1.5 rounded-full bg-sky glow-pulse" />
            {b.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-4xl lg:text-5xl">
            {b.title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/88">{b.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}
