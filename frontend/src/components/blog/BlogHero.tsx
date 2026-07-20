"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { WaveDivider } from "@/components/WaveDivider";

export function BlogHero() {
  const { dict } = useLang();
  const b = dict.blog;

  return (
    <section className="relative isolate flex min-h-[64vh] items-center overflow-hidden pt-28 pb-32">
      {/* Image fond */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(/img/photo-1518770660439-4636190af475-w1920.jpg)` }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/78 via-brand-900/60 to-slate-900/70" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.14]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            <span className="size-1.5 rounded-full bg-sky glow-pulse" />
            {b.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
            {b.title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/88">{b.subtitle}</p>
        </Reveal>
      </div>

      {/* Séparateur en vague statique vers la section suivante */}
      <WaveDivider className="text-surface dark:text-[#070e1c]" />
    </section>
  );
}
