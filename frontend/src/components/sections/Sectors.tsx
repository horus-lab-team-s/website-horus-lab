"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Sectors({ items }: { items?: string[] }) {
  const { dict } = useLang();
  const s = { ...dict.sectors, items: items ?? dict.sectors.items };
  const addLabel = dict.langName === "EN" ? "+ your industry" : "+ votre secteur";

  return (
    <section id="sectors" className="relative overflow-hidden bg-surface py-14 sm:py-16">
      {/* Fond sobre : grille fine + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-soft absolute inset-0 opacity-40 dark:opacity-20" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/12" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky/10 blur-3xl dark:bg-brand-900/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        {/* Tuiles uniformes, agencées sur toute la largeur */}
        <Reveal className="mt-10">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {s.items.map((item, i) => (
              <li
                key={item}
                style={{ animationDelay: `${i * 50}ms` }}
                className="sector-chip group flex items-center gap-3 bg-white px-4 py-3.5 text-sm font-semibold text-brand-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:text-white"
              >
                <span className="grid size-7 shrink-0 place-items-center bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-white/5 dark:text-brand-300">
                  <span className="size-2 rounded-full bg-current" />
                </span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
            {/* Ouverture : aucune limite de secteur */}
            <li className="flex items-center justify-center gap-2 bg-brand-50 px-4 py-3.5 text-sm font-semibold text-brand-600 dark:bg-white/5 dark:text-brand-300">
              {addLabel}
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
