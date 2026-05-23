"use client";

import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconEye } from "@/components/icons";

export function Hero() {
  const { dict } = useLang();
  const h = dict.hero;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-surface pt-32 pb-20 dark:from-slate-950 dark:via-[#0a1326] dark:to-[#070e1c] sm:pt-40 sm:pb-28"
    >
      {/* Décor : aurora + blobs animés + trame + vagues */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 size-[42rem] -translate-x-1/2 rounded-full aurora opacity-20" />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-brand-300/30 blur-3xl animate-drift" />
        <div className="absolute -right-20 top-20 size-[28rem] rounded-full bg-sky/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-brand-200/40 blur-3xl animate-drift" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Colonne texte */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-brand-200">
              <IconEye className="size-4 text-brand-500" />
              {h.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-900 dark:text-white sm:text-5xl lg:text-6xl">
              {h.titleLead}{" "}
              <span className="text-gradient animate-gradient">
                {h.titleHighlight}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {h.subtitle}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-700/25 transition-all hover:bg-brand-800 hover:shadow-brand-700/40"
              >
                {h.ctaPrimary}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-7 py-3.5 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {h.ctaSecondary}
              </a>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={320}>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-brand-100 pt-8 dark:border-white/10 sm:grid-cols-4">
              {h.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Colonne visuelle : logo en orbite */}
        <Reveal delay={200} className="hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-100 to-sky/30 blur-2xl" />

            {/* Anneaux pulsés */}
            <div className="absolute inset-0 rounded-full border border-brand-200/70 animate-pulse-ring" />
            <div className="absolute inset-6 rounded-full border border-brand-200/50" />

            {/* Anneau en rotation lente avec nœuds de circuit */}
            <div className="absolute inset-4 animate-spin-slow">
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
              <span className="absolute bottom-2 right-6 size-2.5 rounded-full bg-sky" />
              <span className="absolute bottom-8 left-2 size-2 rounded-full bg-brand-400" />
            </div>

            {/* Logo central */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="animate-float rounded-full bg-white p-3 shadow-2xl shadow-brand-900/15 ring-1 ring-brand-100">
                <Image
                  src="/Logo-HORUS-LAB.jpeg"
                  alt="Horus-Lab"
                  width={300}
                  height={300}
                  priority
                  className="size-60 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Vague de transition vers la section suivante */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 text-white dark:text-[#070e1c]"
      >
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0 64L60 58.7C120 53 240 43 360 48C480 53 600 75 720 80C840 85 960 75 1080 64C1200 53 1320 43 1380 37.3L1440 32V120H0Z"
          />
        </svg>
      </div>
    </section>
  );
}
