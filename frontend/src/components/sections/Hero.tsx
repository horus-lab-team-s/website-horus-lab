"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "./HeroBackground";
import { IconArrowRight, IconEye } from "@/components/icons";
import type { CmsHero } from "@/lib/cms";

export function Hero({ content }: { content?: CmsHero }) {
  const { dict, localePath } = useLang();
  const h = content ?? dict.hero;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[54vh] items-center overflow-hidden pt-24 pb-12 sm:pb-14"
    >
      <HeroBackground videoSrc="/Hero/hero-video.mp4" poster="/Hero/hero-1.jpg" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <IconEye className="size-4 text-sky" />
            {h.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
            {h.titleLead}{" "}
            <span className="bg-gradient-to-r from-sky via-brand-200 to-white bg-clip-text text-transparent">
              {h.titleHighlight}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-50 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
            {h.subtitle}
          </p>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={localePath("/contact")}
              className="group inline-flex items-center justify-center gap-2 bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-xl shadow-brand-900/30 transition-transform hover:scale-[1.03]"
            >
              {h.ctaPrimary}
              <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center border border-white/40 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              {h.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <dl className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-extrabold text-white">{stat.value}</dt>
                <dd className="mt-1 text-sm text-brand-100">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
