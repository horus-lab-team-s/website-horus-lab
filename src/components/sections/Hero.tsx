"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "./HeroBackground";
import { IconArrowRight, IconEye } from "@/components/icons";

// Photos Unsplash (tech, code, équipe, data) — chargées par le navigateur.
// Remplaçables par vos propres visuels.
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1740&q=70",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1740&q=70",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1740&q=70",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1740&q=70",
];

export function Hero() {
  const { dict } = useLang();
  const h = dict.hero;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-32 pb-28"
    >
      <HeroBackground images={HERO_IMAGES} />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white shadow-sm backdrop-blur">
            <IconEye className="size-4 text-sky" />
            {h.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {h.titleLead}{" "}
            <span className="bg-gradient-to-r from-sky via-brand-200 to-white bg-clip-text text-transparent">
              {h.titleHighlight}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-100">
            {h.subtitle}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-xl shadow-brand-900/30 transition-transform hover:scale-[1.03]"
            >
              {h.ctaPrimary}
              <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {h.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-extrabold text-white">{stat.value}</dt>
                <dd className="mt-1 text-sm text-brand-100">{stat.label}</dd>
              </div>
            ))}
          </dl>
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
