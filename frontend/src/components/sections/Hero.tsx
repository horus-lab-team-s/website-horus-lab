"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "./HeroBackground";
import { IconArrowRight, IconEye } from "@/components/icons";

// Photos Unsplash (professionnels africains + tech) — chargées par le navigateur.
// Remplaçables par vos propres visuels.
const HERO_IMAGES = [
  // Femmes noires dans la tech (collection WOCinTech)
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1740&q=70",
  // Circuit / technologie (bleu)
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1740&q=70",
  // Professionnelle africaine à l'ordinateur
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1740&q=70",
  // Code / développement
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1740&q=70",
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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <IconEye className="size-4 text-sky" />
            {h.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl xl:text-7xl">
            {h.titleLead}{" "}
            <span className="bg-gradient-to-r from-sky via-brand-200 to-white bg-clip-text text-transparent">
              {h.titleHighlight}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-50 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
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
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              {h.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-extrabold text-white">{stat.value}</dt>
                <dd className="mt-1 text-sm text-brand-100">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Indice de défilement (discret, desktop) */}
      <a
        href="#services"
        aria-label={h.ctaSecondary}
        className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="animate-bob">
          <IconArrowRight className="size-5 rotate-90" />
        </span>
      </a>

      {/* Vague animée de transition vers la section suivante */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] text-white dark:text-[#070e1c]"
      >
        {/* Couche arrière (plus lente, translucide) */}
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_16s_linear_infinite]"
        >
          <path
            fill="currentColor"
            opacity="0.45"
            d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 C1680,90 1920,10 2160,50 C2400,90 2640,10 2880,50 L2880,120 L0,120 Z"
          />
        </svg>
        {/* Couche avant (plus rapide, sens inverse, pleine couleur) */}
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_11s_linear_infinite_reverse]"
        >
          <path
            fill="currentColor"
            d="M0,60 C360,100 720,30 1440,60 C2160,90 2520,30 2880,60 L2880,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
