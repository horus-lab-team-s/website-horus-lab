"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function BlogHero() {
  const { dict } = useLang();
  const b = dict.blog;

  return (
    <section className="relative isolate flex min-h-[64vh] items-center overflow-hidden pt-28 pb-32">
      {/* Image fond */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85)` }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/78 via-brand-900/60 to-slate-900/70" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.14]" />

      {/* Particules */}
      {[
        { x: "10%", y: "24%", d: "0s" }, { x: "86%", y: "16%", d: "1.2s" },
        { x: "24%", y: "74%", d: "0.8s" }, { x: "74%", y: "78%", d: "2s" },
        { x: "52%", y: "30%", d: "1.5s" },
      ].map((p, i) => (
        <div key={i} aria-hidden className="absolute size-2 rounded-full bg-white/20 animate-float"
          style={{ left: p.x, top: p.y, animationDelay: p.d }} />
      ))}

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

      {/* ── Vague animée identique aux autres pages ── */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] text-surface dark:text-[#070e1c]">
        <svg viewBox="0 0 2880 120" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_16s_linear_infinite]">
          <path fill="currentColor" opacity="0.45"
            d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 C1680,90 1920,10 2160,50 C2400,90 2640,10 2880,50 L2880,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 2880 120" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_11s_linear_infinite_reverse]">
          <path fill="currentColor"
            d="M0,60 C360,100 720,30 1440,60 C2160,90 2520,30 2880,60 L2880,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
