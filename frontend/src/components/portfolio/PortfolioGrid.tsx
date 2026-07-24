"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight, IconCheck, IconCode, IconCog,
  IconEye, IconGlobe, IconLayers, IconSpark,
} from "@/components/icons";
import type { Project } from "@/lib/projects";
import { galleryFor } from "@/lib/projectGalleries";
import { ProjectGallery } from "./ProjectGallery";

export type { Project };

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode, layers: IconLayers, cog: IconCog,
  spark: IconSpark, eye: IconEye, globe: IconGlobe, check: IconCheck,
};

/* Stacks techniques (logos plus parlants que du texte) — SVG dans /public/tech.
   Web : Next.js, Tailwind, FastAPI, Django, PostgreSQL, Docker, nginx.
   Mobile : Dart, Flutter, Firebase. */
const WEB_STACK = [
  { name: "Next.js", src: "/tech/nextjs.svg" },
  { name: "Tailwind CSS", src: "/tech/tailwindcss.svg" },
  { name: "FastAPI", src: "/tech/fastapi.svg" },
  { name: "Django", src: "/tech/django.svg" },
  { name: "PostgreSQL", src: "/tech/postgresql.svg" },
  { name: "Docker", src: "/tech/docker.svg" },
  { name: "nginx", src: "/tech/nginx.svg" },
];
const MOBILE_STACK = [
  { name: "Dart", src: "/tech/dart.svg" },
  { name: "Flutter", src: "/tech/flutter.svg" },
  { name: "Firebase", src: "/tech/firebase.svg" },
];
const TECH_STACKS: Record<string, { name: string; src: string }[]> = {
  "Afrikamode": WEB_STACK,
  "Gathe Finance": WEB_STACK,
  "Plateforme e-Learning": MOBILE_STACK,
  "e-Learning platform": MOBILE_STACK,
  "Elec One": MOBILE_STACK,
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
  lang,
}: {
  projects: Project[];
  allLabel: string;
  resultLabel: string;
  lang: string;
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
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const openGroups = openTitle ? galleryFor(openTitle) : null;

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
          const gallery = galleryFor(p.title);
          return (
            <Reveal key={p.title} delay={(i % 2) * 80}>
              <article className="group lift-xl flex h-full flex-col overflow-hidden bg-white shadow-sm dark:bg-slate-900">

                {/* ── Couverture : vidéo / vraie capture de la solution, logo par-dessus ── */}
                <div className={`relative h-60 overflow-hidden ${p.video || p.cover ? "bg-brand-900" : p.logo ? "bg-white dark:bg-slate-800" : `bg-gradient-to-br ${p.gradient}`}`}>
                  {p.video ? (
                    <>
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={p.cover}
                      >
                        <source src={p.video} type="video/mp4" />
                      </video>
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/35 to-brand-900/10" />
                      {p.logo && (
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="relative h-24 w-[68%] max-w-xs overflow-hidden bg-white/92 p-4 shadow-2xl backdrop-blur">
                            <Image src={p.logo} alt={`Logo ${p.title}`} fill className="object-contain p-1" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : p.cover ? (
                    <>
                      <Image
                        src={p.cover}
                        alt={p.title}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/35 to-brand-900/10" />
                      {p.logo && (
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="relative h-24 w-[68%] max-w-xs overflow-hidden bg-white/92 p-4 shadow-2xl backdrop-blur">
                            <Image src={p.logo} alt={`Logo ${p.title}`} fill className="object-contain p-1" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : p.logo ? (
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
                        <div className="flex size-20 items-center justify-center rounded-lg bg-white/15 backdrop-blur ring-2 ring-white/30 shadow-xl">
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

                  {TECH_STACKS[p.title]?.length ? (
                    <ul className="mt-5 flex flex-wrap items-center gap-x-3.5 gap-y-2" aria-label="Technologies">
                      {TECH_STACKS[p.title].map((t) => (
                        <li key={t.name} title={t.name}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.src} alt={t.name} width={24} height={24} loading="lazy"
                            className="size-6 object-contain grayscale transition-all duration-300 group-hover:grayscale-0" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors group-hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

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

                  {gallery && (
                    <button
                      type="button"
                      onClick={() => setOpenTitle(p.title)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-xs font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
                    >
                      <IconEye className="size-4" />
                      {isFr ? "Le projet en images : site & back-office" : "Project in pictures: site & back-office"}
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {openGroups && openTitle && (
        <ProjectGallery
          groups={openGroups}
          lang={isFr ? "fr" : "en"}
          projectTitle={openTitle}
          open
          onClose={() => setOpenTitle(null)}
        />
      )}

      {visible.length === 0 && (
        <Reveal>
          <p className="mt-16 rounded-lg border border-brand-100 bg-white p-10 text-center text-muted dark:border-white/10 dark:bg-slate-900">
            Aucun projet dans cette catégorie.
          </p>
        </Reveal>
      )}
    </div>
  );
}
