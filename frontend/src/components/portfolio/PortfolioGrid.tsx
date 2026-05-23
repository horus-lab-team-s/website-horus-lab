"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  IconCheck,
  IconCode,
  IconCog,
  IconEye,
  IconGlobe,
  IconLayers,
  IconSpark,
} from "@/components/icons";

export type Project = {
  title: string;
  category: string;
  desc: string;
  tags: string[];
  result: string;
  iconKey: string;
  gradient: string;
};

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
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === cat
                ? "bg-brand-700 text-white"
                : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => {
          const Icon = ICONS[p.iconKey] ?? IconCode;
          return (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900">
                {/* Cover */}
                <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <Icon className="absolute left-6 top-1/2 size-16 -translate-y-1/2 text-white/90 transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute bottom-3 left-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                    {p.category}
                  </span>
                </div>
                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-white">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-white/5 dark:text-brand-200"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-baseline gap-2 border-t border-brand-100 pt-4 dark:border-white/10">
                    <span className="text-xl font-extrabold text-brand-700 dark:text-brand-300">
                      {p.result}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-muted">
                      {resultLabel}
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
