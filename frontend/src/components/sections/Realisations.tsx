"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight,
  IconCheck,
  IconCode,
  IconCog,
  IconEye,
  IconGlobe,
  IconLayers,
  IconSpark,
} from "@/components/icons";
import { getProjects } from "@/lib/projects";

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode,
  layers: IconLayers,
  cog: IconCog,
  spark: IconSpark,
  eye: IconEye,
  globe: IconGlobe,
  check: IconCheck,
};

export function Realisations() {
  const { dict, lang, localePath } = useLang();
  const r = dict.realisations;
  const projects = getProjects(lang);
  const [featured, ...rest] = projects;
  const Featured = ICONS[featured.iconKey] ?? IconCode;

  return (
    <section
      id="realisations"
      className="relative overflow-hidden bg-surface py-20 sm:py-28"
    >
      {/* Trame + halo */}
      <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-1/4 h-[360px] w-[360px] rounded-full bg-brand-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* En-tête */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {r.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
              {r.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {r.subtitle}
            </p>
          </Reveal>
          <Reveal>
            <Link
              href={localePath("/portfolio")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            >
              {r.viewAll}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Layout magazine : 1 featured large + 3 stack à droite */}
        <div className="mt-14 grid gap-7 lg:grid-cols-12">
          {/* Projet phare */}
          <Reveal className="lg:col-span-7">
            <Link
              href={localePath("/portfolio")}
              className={`group lift-xl relative block h-full overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br ${featured.gradient} dark:border-white/10`}
            >
              {/* Trame + tracé */}
              <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
              <svg
                aria-hidden
                viewBox="0 0 800 300"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-white/25"
              >
                <path
                  d="M0 220 H160 L220 160 H400 L460 200 H620 L680 120 H800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="160" cy="220" r="4" fill="currentColor" />
                <circle cx="400" cy="160" r="4" fill="currentColor" />
                <circle cx="620" cy="200" r="4" fill="currentColor" />
              </svg>
              <IconEye
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 size-[320px] text-white/10"
              />
              {/* Shine sweep */}
              <span aria-hidden className="shine pointer-events-none absolute inset-0" />

              <div className="relative flex h-full min-h-[520px] flex-col justify-between p-8 sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700">
                    <span className="size-1.5 rounded-full bg-brand-500 glow-pulse" />
                    {r.featuredLabel}
                  </span>
                  <Featured className="size-14 text-white drop-shadow-lg zoom-img" />
                </div>

                <div className="text-white">
                  {featured.client && (
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      {featured.client}
                    </div>
                  )}
                  <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90">
                    {featured.desc}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {featured.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex items-center justify-between border-t border-white/20 pt-5">
                    <div>
                      <div className="text-lg font-extrabold text-white">
                        {featured.result}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/70">
                        {featured.category}
                      </div>
                    </div>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-700 transition-transform group-hover:translate-x-1">
                      <IconArrowRight className="size-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Stack secondaire (3 projets) */}
          <div className="space-y-5 lg:col-span-5">
            {rest.map((p, i) => {
              const Icon = ICONS[p.iconKey] ?? IconCode;
              return (
                <Reveal key={p.title} delay={(i + 1) * 110}>
                  <Link
                    href={localePath("/portfolio")}
                    className="group lift-xl flex items-stretch overflow-hidden rounded-3xl border border-brand-100 bg-white dark:border-white/10 dark:bg-slate-900"
                  >
                    {/* Bande latérale en couleur */}
                    <div
                      className={`relative grid w-28 shrink-0 place-items-center bg-gradient-to-br ${p.gradient}`}
                    >
                      <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
                      <Icon className="size-9 text-white drop-shadow zoom-img" />
                      <span className="numeral absolute -bottom-3 left-1 select-none text-[70px] text-white/20">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Corps */}
                    <div className="flex flex-1 flex-col justify-center p-5">
                      {p.client && (
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-500">
                          {p.client}
                        </div>
                      )}
                      <h3 className="mt-1 text-base font-bold leading-tight text-brand-900 dark:text-white sm:text-lg">
                        {p.title}
                      </h3>
                      <div className="mt-1 text-xs text-muted">
                        {p.category}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                        {p.result}
                        <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
