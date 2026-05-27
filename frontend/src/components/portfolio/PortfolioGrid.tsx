"use client";

import { useMemo, useState } from "react";
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
import type { Project } from "@/lib/projects";

export type { Project };

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode,
  layers: IconLayers,
  cog: IconCog,
  spark: IconSpark,
  eye: IconEye,
  globe: IconGlobe,
  check: IconCheck,
};

export function PortfolioGrid({
  projects,
  allLabel,
  resultLabel,
}: {
  projects: Project[];
  allLabel: string;
  resultLabel: string;
}) {
  const categories = useMemo(
    () => [allLabel, ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects, allLabel]
  );
  const [active, setActive] = useState(allLabel);

  const visible =
    active === allLabel ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active === cat
                ? "bg-brand-700 text-white shadow-md shadow-brand-700/25"
                : "border border-brand-200 text-brand-700 hover:-translate-y-0.5 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille 2 colonnes (cartes plus expressives) */}
      <div className="mt-14 grid gap-7 lg:grid-cols-2">
        {visible.map((p, i) => {
          const Icon = ICONS[p.iconKey] ?? IconCode;
          return (
            <Reveal key={p.title} delay={(i % 2) * 100}>
              <article className="group lift-xl flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white dark:border-white/10 dark:bg-slate-900">
                {/* Couverture éditoriale */}
                <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                  {/* Trame technique */}
                  <div aria-hidden className="absolute inset-0 bg-grid opacity-25" />
                  {/* Tracé de circuit */}
                  <svg
                    aria-hidden
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full text-white/30"
                  >
                    <path
                      d="M0 140 H120 L160 100 H300 L340 140 H460 L500 80 H600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <circle cx="120" cy="140" r="3" fill="currentColor" />
                    <circle cx="300" cy="100" r="3" fill="currentColor" />
                    <circle cx="460" cy="140" r="3" fill="currentColor" />
                    <circle cx="600" cy="80" r="3" fill="currentColor" />
                  </svg>

                  {/* Œil filigrane */}
                  <IconEye
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-4 size-44 text-white/10"
                  />

                  {/* Numéro + icône */}
                  <div className="relative flex h-full items-center justify-between px-8">
                    <Icon className="size-16 text-white/95 zoom-img drop-shadow-lg" />
                    <span className="numeral select-none text-[120px] text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Badge catégorie */}
                  <span className="absolute bottom-4 left-6 rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                    {p.category}
                  </span>

                  {/* Shine sweep au survol */}
                  <span aria-hidden className="shine pointer-events-none absolute inset-0" />
                </div>

                {/* Corps */}
                <div className="flex flex-1 flex-col p-7">
                  {p.client && (
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
                      {p.client}
                    </div>
                  )}
                  <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-2xl">
                    {p.title}
                  </h3>
                  {p.role && (
                    <div className="mt-1 text-xs font-medium text-muted">
                      {p.role}
                    </div>
                  )}
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
                    {p.desc}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors group-hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200 dark:group-hover:bg-white/10"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-brand-100 pt-5 dark:border-white/10">
                    <div>
                      <div className="text-lg font-extrabold tracking-tight text-brand-700 dark:text-brand-300">
                        {p.result}
                      </div>
                      <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted">
                        {resultLabel}
                      </div>
                    </div>
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                      <IconArrowRight className="size-5" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
