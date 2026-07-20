"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "./HeroBackground";
import { WaveDivider } from "@/components/WaveDivider";
import { IconArrowRight, IconEye } from "@/components/icons";
import type { CmsHero } from "@/lib/cms";

/* Images hébergées en local (frontend/public) : toujours disponibles,
   aucune dépendance à un service externe. */
const HERO_IMAGES = [
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-4.jpg",
  "/hero-5.jpg",
];

/* Services Horus-Lab — affiches sous le titre hero */
const SERVICES = {
  fr: [
    "Applications sur mesure",
    "Systèmes d'information",
    "Digitalisation entreprises",
    "Formation & Audit",
  ],
  en: [
    "Custom Applications",
    "Information Systems",
    "Business Digitalisation",
    "Training & Audit",
  ],
};

export function Hero({ content }: { content?: CmsHero }) {
  const { dict, lang, localePath } = useLang();
  const h = content ?? dict.hero;
  const services = SERVICES[lang] ?? SERVICES.fr;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[86vh] items-center overflow-hidden pt-32 pb-20 sm:pb-24"
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

        {/* ── Chips services ── */}
        <Reveal delay={210}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {services.map((svc) => (
              <span
                key={svc}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/20"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-sky" />
                {svc}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={localePath("/contact")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-xl shadow-brand-900/30 transition-transform hover:scale-[1.03]"
            >
              {h.ctaPrimary}
              <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-white/35 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              {h.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <Reveal delay={360}>
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

      {/* Scroll hint */}
      <a
        href="#services"
        aria-label={h.ctaSecondary}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="animate-bob">
          <IconArrowRight className="size-5 rotate-90" />
        </span>
      </a>

      {/* Séparateur en vague STATIQUE vers « Nos services » (fond blanc) */}
      <WaveDivider className="text-white dark:text-[#070e1c]" />
    </section>
  );
}
