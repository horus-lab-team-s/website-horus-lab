"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight, IconCheck, IconCode, IconCog,
  IconEye, IconGlobe, IconLayers, IconSpark,
} from "@/components/icons";
import type { Project } from "@/lib/projects";

export type { Project };

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode, layers: IconLayers, cog: IconCog,
  spark: IconSpark, eye: IconEye, globe: IconGlobe, check: IconCheck,
};

/* Catégories autorisées dans le filtre — dans l'ordre d'affichage */
const FILTER_ORDER_FR = [
  "Mode & e-commerce",
  "Fintech & Gestion",
  "Éducation & EdTech",
  "Énergie & Industrie",
  "Formation",
];
const FILTER_ORDER_EN = [
  "Fashion & e-commerce",
  "Fintech & Management",
  "Education & EdTech",
  "Energy & Industry",
  "Training",
];

export function PortfolioGrid({
  projects,
  allLabel,
  resultLabel,
}: {
  projects: Project[];
  allLabel: string;
  resultLabel: string;
}) {
  /* Détecter la langue à partir de allLabel */
  const isFr = allLabel === "Tous";
  const orderedCats = isFr ? FILTER_ORDER_FR : FILTER_ORDER_EN;

  /* Garder uniquement les catégories présentes dans les projets */
  const presentCats = orderedCats.filter(cat =>
    projects.some(p => p.category === cat)
  );
  const filterLabels = [allLabel, ...presentCats];

  const [active, setActive] = useState(allLabel);

  const visible =
    active === allLabel
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      {/* ── Filtres centrés ── */}
      <div className="flex flex-wrap justify-center gap-2.5 pb-2">
        {filterLabels.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active === cat
                ? "bg-brand-700 text-white shadow-lg shadow-brand-700/25"
                : "border border-brand-200 bg-white text-brand-700 hover:-translate-y-0.5 hover:bg-brand-50 hover:border-brand-300 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grille des projets ── */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {visible.map((p, i) => {
          const Icon = ICONS[p.iconKey] ?? IconCode;
          return (
            <Reveal key={p.title} delay={(i % 2) * 80}>
              <article className="group lift-xl flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white dark:border-white/10 dark:bg-slate-900">

                {/* ── Couverture : logo qui occupe tout l'espace supérieur ── */}
                <div className={`relative h-60 overflow-hidden ${p.logo ? "bg-white dark:bg-slate-800" : `bg-gradient-to-br ${p.gradient}`}`}>
                  {p.logo ? (
                    <>
                      {/* Teinte de marque très douce derrière le logo */}
                      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-[0.08]`} />
                      <div aria-hidden className="absolute inset-0 bg-grid-soft opacity-50" />
                      <Image
                        src={p.logo}
                        alt={`Logo ${p.title}`}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-contain p-10 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {/* Liseré de couleur en bas */}
                      <span aria-hidden className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${p.gradient}`} />
                    </>
                  ) : (
                    <>
                      {/* Image Unsplash de fond */}
                      {p.screenshots?.[0] && (
                        <Image
                          src={p.screenshots[0]}
                          alt={p.title}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-br opacity-60" />
                      <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
                      {/* Tracé de circuit */}
                      <svg aria-hidden viewBox="0 0 600 200" preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full text-white/25">
                        <path d="M0 140 H120 L160 100 H300 L340 140 H460 L500 80 H600"
                          fill="none" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="120" cy="140" r="3" fill="currentColor" />
                        <circle cx="300" cy="100" r="3" fill="currentColor" />
                        <circle cx="460" cy="140" r="3" fill="currentColor" />
                      </svg>
                      <div className="relative flex h-full items-center justify-between px-8">
                        <div className="flex size-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-2 ring-white/30 shadow-xl">
                          <Icon className="size-10 text-white drop-shadow-lg" />
                        </div>
                        <span className="numeral select-none text-[110px] text-white/20">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Badge catégorie */}
                  <span className="absolute bottom-4 left-6 rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow ring-1 ring-brand-100 backdrop-blur">
                    {p.category}
                  </span>

                  {/* Badge Live */}
                  {p.url && (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-[11px] font-bold text-white shadow backdrop-blur">
                      <span className="size-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </span>
                  )}

                  {!p.logo && <span aria-hidden className="shine pointer-events-none absolute inset-0" />}
                </div>

                {/* ── Corps ── */}
                <div className="flex flex-1 flex-col p-7">
                  {p.client && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">{p.client}</p>
                  )}
                  <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-2xl">
                    {p.title}
                  </h3>
                  {p.role && <p className="mt-1 text-xs font-medium text-muted">{p.role}</p>}
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.desc}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors group-hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-brand-100 pt-5 dark:border-white/10">
                    <div>
                      <p className="text-lg font-extrabold tracking-tight text-brand-700 dark:text-brand-300">{p.result}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted">{resultLabel}</p>
                    </div>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-700/25 transition-all hover:bg-brand-800 hover:shadow-lg">
                        Voir le site
                        <IconArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </a>
                    ) : (
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                        <IconArrowRight className="size-5" />
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {visible.length === 0 && (
        <Reveal>
          <p className="mt-16 rounded-2xl border border-brand-100 bg-white p-10 text-center text-muted dark:border-white/10 dark:bg-slate-900">
            Aucun projet dans cette catégorie.
          </p>
        </Reveal>
      )}
    </div>
  );
}
