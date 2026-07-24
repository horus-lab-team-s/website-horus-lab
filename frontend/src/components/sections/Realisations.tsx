"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";
import {
  IconArrowRight, IconCheck, IconCode, IconCog,
  IconEye, IconGlobe, IconLayers, IconSpark,
} from "@/components/icons";
import type { Project } from "@/lib/projects";

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode, layers: IconLayers, cog: IconCog,
  spark: IconSpark, eye: IconEye, globe: IconGlobe, check: IconCheck,
};

const PROJECT_IMAGES: Record<string, string> = {
  "Afrikamode":
    "/afrikamode-realisations/01-site-accueil.png",
  "Gathe Finance":
    "/img/photo-1551288049-bebda4e38f71-w800.jpg",
  "Plateforme e-Learning":
    "/img/photo-1501504905252-473c47e087f8-w800.jpg",
  "e-Learning platform":
    "/img/photo-1501504905252-473c47e087f8-w800.jpg",
  "Programme Formation IT":
    "/img/photo-1573164713988-8665fc963095-w800.jpg",
  "IT Training Programme":
    "/img/photo-1573164713988-8665fc963095-w800.jpg",
};

function RealisationsBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Base dégradée sobre */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/20 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
      {/* Grille fine */}
      <div className="absolute inset-0 bg-grid-soft opacity-[0.35] dark:opacity-[0.2]" />
      {/* Halos discrets */}
      <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/12" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky/10 blur-3xl dark:bg-brand-900/10" />
    </div>
  );
}

export function Realisations({ projects }: { projects: Project[] }) {
  const { dict, localePath } = useLang();
  const r = dict.realisations;
  // Afrikamode & Elec One sont nos deux projets phares (déjà en production) :
  // on les fait passer en tête (vedette + haut de la pile).
  const PHARES = ["Afrikamode", "Elec One"];
  const ordered: Project[] = [
    ...(PHARES.map((t) => projects.find((p) => p.title === t)).filter(Boolean) as Project[]),
    ...projects.filter((p) => !PHARES.includes(p.title)),
  ];
  const top = ordered.slice(0, 4);
  if (top.length === 0) return null;
  const [featured, ...rest] = top;
  const Featured = ICONS[featured.iconKey] ?? IconCode;
  const featuredImg = PROJECT_IMAGES[featured.title];

  return (
    <section id="realisations" className="relative overflow-hidden pb-14 pt-12 sm:pb-16">
      <RealisationsBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* En-tête centré */}
        <SectionHeading eyebrow={r.eyebrow} title={r.title} subtitle={r.subtitle} />
        <Reveal className="mt-6 flex justify-center">
          <Link href={localePath("/portfolio")}
            className="group inline-flex items-center gap-2 border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-300 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5">
            {r.viewAll}
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* Layout : 1 featured grand + stack à droite */}
        <div className="mt-9 grid gap-6 lg:grid-cols-12">

          {/* ── Projet phare ── */}
          <Reveal className="lg:col-span-7">
            <Link
              href={featured.url ?? localePath("/portfolio")}
              target={featured.url ? "_blank" : "_self"}
              rel={featured.url ? "noopener noreferrer" : undefined}
              className="group lift-xl relative flex h-full flex-col overflow-hidden rounded-lg shadow-2xl shadow-brand-900/12"
            >
              {/* Image de couverture */}
              <div className="relative h-72 overflow-hidden sm:h-80">
                <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
                {featuredImg && (
                  <Image
                    src={featuredImg}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ zIndex: 1 }}
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" style={{ zIndex: 2 }} />

                {/* Logo du projet phare — occupe tout l'espace de la couverture */}
                {featured.logo ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8" style={{ zIndex: 2 }}>
                    <div className="relative h-36 w-[78%] max-w-sm overflow-hidden rounded-lg bg-white/92 p-5 shadow-2xl ring-1 ring-white/50 backdrop-blur sm:h-40">
                      <Image
                        src={featured.logo}
                        alt={`Logo ${featured.title}`}
                        fill
                        sizes="(max-width:1024px) 70vw, 400px"
                        className="object-contain p-3"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="absolute inset-0 flex items-start justify-between p-6" style={{ zIndex: 3 }}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-brand-700 shadow-lg">
                    <span className="size-2 rounded-full bg-brand-500 glow-pulse" />
                    {r.featuredLabel}
                  </span>
                  <span className="inline-flex size-12 items-center justify-center rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/30">
                    <Featured className="size-7 text-white drop-shadow" />
                  </span>
                </div>
                {featured.url && (
                  <div className="absolute bottom-4 right-5 z-[3] flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                )}
              </div>

              {/* Corps texte */}
              <div className={`relative flex flex-1 flex-col bg-gradient-to-br ${featured.gradient} p-7 sm:p-8`}>
                <div aria-hidden className="absolute inset-0 bg-grid opacity-10" />
                <div className="relative">
                  {featured.client && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{featured.client}</p>
                  )}
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{featured.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/88 line-clamp-3">{featured.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {featured.tags.map(t => (
                      <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-5">
                    <div>
                      <p className="text-base font-extrabold text-white">{featured.result}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">{featured.category}</p>
                    </div>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg transition-transform group-hover:translate-x-1 group-hover:shadow-xl">
                      <IconArrowRight className="size-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* ── Stack secondaire ── */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {rest.map((p, i) => {
              const Icon = ICONS[p.iconKey] ?? IconCode;
              const img = PROJECT_IMAGES[p.title];
              return (
                <Reveal key={p.title} delay={(i + 1) * 100}>
                  <Link
                    href={p.url ?? localePath("/portfolio")}
                    target={p.url ? "_blank" : "_self"}
                    rel={p.url ? "noopener noreferrer" : undefined}
                    className="group lift-xl flex items-stretch overflow-hidden bg-white shadow-sm transition-all hover:shadow-xl dark:bg-slate-900"
                  >
                    {/* Vignette gauche — logo du projet sur toute la zone */}
                    <div className={`relative w-32 shrink-0 overflow-hidden ${p.logo ? "bg-white dark:bg-white/95" : `bg-gradient-to-br ${p.gradient}`}`}>
                      {p.logo ? (
                        <Image src={p.logo} alt={`Logo ${p.title}`} fill sizes="128px"
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          style={{ zIndex: 1 }} />
                      ) : (
                        <>
                          {img && (
                            <Image src={img} alt={p.title} fill sizes="128px"
                              className="object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                              style={{ zIndex: 1 }} />
                          )}
                          <div aria-hidden className="absolute inset-0 bg-black/25" style={{ zIndex: 2 }} />
                          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
                            <div className="flex size-13 items-center justify-center rounded-md bg-white/20 backdrop-blur ring-1 ring-white/30 shadow-md">
                              <Icon className="size-7 text-white drop-shadow-md" />
                            </div>
                          </div>
                        </>
                      )}
                      {/* Badge numéro */}
                      <div className="absolute left-2 top-2 z-[4] flex size-7 items-center justify-center rounded-full bg-white/95 text-[11px] font-extrabold text-brand-700 shadow ring-1 ring-brand-100">
                        {String(i + 2).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Corps */}
                    <div className="flex flex-1 flex-col justify-center gap-1 p-5">
                      {p.client && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{p.client}</p>
                      )}
                      <h3 className="text-base font-extrabold leading-tight text-brand-900 dark:text-white sm:text-lg">{p.title}</h3>
                      <p className="text-xs text-muted">{p.category}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-300">
                        {p.result}
                        <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map(t => (
                          <li key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600 dark:bg-white/5 dark:text-brand-300">{t}</li>
                        ))}
                      </ul>
                    </div>
                    <span aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${p.gradient} opacity-60`} />
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
