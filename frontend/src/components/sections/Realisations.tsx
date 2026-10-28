"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { caseSlugForTitle, getCaseStudy } from "@/lib/caseStudies";
import { SectionHeading } from "./SectionHeading";
import { IconArrowRight } from "@/components/icons";
import { ZAYRA_TITLES, type Project } from "@/lib/projects";



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

type Filter = "all" | "solutions" | "clients";

/* Ordre de la vue « Tout » : solutions Zayra et projets clients alternés. */
const MIXED_ORDER = ["Zayra Drive", "Afrikamode", "Zayra School", "Zayra Agro", "Elec One", "Zayra Nkap"];

export function Realisations({ projects }: { projects: Project[] }) {
  const { dict, lang, localePath } = useLang();
  const r = dict.realisations;
  const isFr = lang === "fr";
  const [filter, setFilter] = useState<Filter>("all");

  const isSolution = (p: Project) => ZAYRA_TITLES.includes(p.title);
  const solutions = projects.filter(isSolution);
  const clients = projects.filter((p) => !isSolution(p));
  const mixed = [
    ...MIXED_ORDER.map((t) => projects.find((p) => p.title === t)).filter(Boolean),
    ...projects.filter((p) => !MIXED_ORDER.includes(p.title)),
  ].slice(0, 6) as Project[];
  const visible = filter === "solutions" ? solutions : filter === "clients" ? clients : mixed;
  if (projects.length === 0) return null;

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: isFr ? "Tout" : "All", count: mixed.length },
    { id: "solutions", label: isFr ? "Nos solutions" : "Our solutions", count: solutions.length },
    { id: "clients", label: isFr ? "Projets clients" : "Client projects", count: clients.length },
  ];

  return (
    <section id="realisations" className="relative overflow-hidden pb-14 pt-12 sm:pb-16">
      <RealisationsBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* En-tête centré */}
        <SectionHeading eyebrow={r.eyebrow} title={r.title} subtitle={r.subtitle} />

        {/* Sélecteur : défile horizontalement sur mobile si besoin */}
        <Reveal className="mt-7 flex justify-center">
          <div role="tablist" aria-label={r.eyebrow}
            className="flex max-w-full gap-1 overflow-x-auto bg-white p-1 shadow-sm ring-1 ring-brand-100 dark:bg-white/5 dark:ring-white/10">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
                className={`inline-flex shrink-0 items-center gap-2 px-3 py-2 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm ${
                  filter === t.id
                    ? "bg-brand-700 text-white"
                    : "text-brand-700 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-white/10"
                }`}>
                {t.label}
                <span className={`hidden text-xs sm:inline ${filter === t.id ? "text-white/70" : "text-muted"}`}>{t.count}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grille régulière : 1 colonne (mobile), 2 (tablette), 3 (bureau) */}
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => {
            const slug = caseSlugForTitle(p.title);
            const cs = slug ? getCaseStudy(slug) : undefined;
            const tagline = cs?.content[lang].tagline ?? p.result;
            const sector = cs?.content[lang].sector ?? p.category;
            // Uniquement de vraies captures ; sinon le logo du projet.
            const cover = p.cover;
            const solution = isSolution(p);
            return (
              <Reveal key={`${filter}-${p.title}`} delay={(i % 3) * 80}>
                <article className="group lift-xl flex h-full flex-col overflow-hidden bg-white shadow-sm dark:bg-slate-900">
                  {/* Capture réelle (ou logo sur fond clair si le projet n'en a pas) */}
                  <Link href={localePath(slug ? `/portfolio/${slug}` : "/portfolio")}
                    className="relative block aspect-[16/10] overflow-hidden bg-surface dark:bg-white/5">
                    {cover ? (
                      <Image src={cover} alt={p.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    ) : p.logo ? (
                      <>
                        <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-[0.08]`} />
                        <Image src={p.logo} alt={`Logo ${p.title}`} fill sizes="(max-width:640px) 100vw, 33vw"
                          className="object-contain p-12 transition-transform duration-500 group-hover:scale-[1.04]" />
                      </>
                    ) : (
                      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                    )}

                    {/* Type de projet + statut */}
                    <span className={`absolute left-3 top-3 px-2.5 py-1 text-[11px] font-bold shadow-sm ${
                      solution ? "bg-brand-700 text-white" : "bg-white/95 text-brand-700"
                    }`}>
                      {solution ? (isFr ? "Solution Zayra" : "Zayra solution") : (isFr ? "Projet client" : "Client project")}
                    </span>
                    {p.url && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 bg-green-600/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                        <span className="size-1.5 bg-white" />
                        {isFr ? "En ligne" : "Live"}
                      </span>
                    )}

                    {/* Logo en pastille, si la couverture est une capture */}
                    {cover && p.logo && (
                      <span className="absolute bottom-3 left-3 flex size-12 items-center justify-center bg-white p-1.5 shadow-md">
                        <span className="relative h-full w-full">
                          <Image src={p.logo} alt="" fill sizes="48px" className="object-contain" />
                        </span>
                      </span>
                    )}
                  </Link>

                  {/* Corps : court et lisible */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">{sector}</p>
                    <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-brand-900 dark:text-white">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">{tagline}</p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-100 pt-4 dark:border-white/10">
                      <Link href={localePath(slug ? `/portfolio/${slug}` : "/portfolio")}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 dark:text-brand-200">
                        {isFr ? "Étude de cas" : "Case study"}
                        <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold text-muted transition-colors hover:text-brand-700 dark:hover:text-brand-200">
                          {isFr ? "Voir le site ↗" : "Visit site ↗"}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Lien vers toutes les réalisations */}
        <Reveal className="mt-10 flex justify-center">
          <Link href={localePath("/portfolio")}
            className="group inline-flex items-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-300 dark:border-white/15 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10">
            {r.viewAll}
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
