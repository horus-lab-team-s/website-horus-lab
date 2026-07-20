"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function Sectors({ items }: { items?: string[] }) {
  const { dict } = useLang();
  const s = { ...dict.sectors, items: items ?? dict.sectors.items };
  const addLabel = dict.langName === "EN" ? "+ your industry" : "+ votre secteur";

  return (
    <section
      id="sectors"
      className="relative overflow-hidden bg-surface py-16 sm:py-20"
    >
      {/* Fond sobre : grille fine + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-soft absolute inset-0 opacity-40 dark:opacity-20" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/12" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky/10 blur-3xl dark:bg-brand-900/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Colonne gauche */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {s.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
                {s.title}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                {s.subtitle}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-8 flex items-baseline gap-4">
              <span className="numeral text-[86px] leading-none sm:text-[104px]">
                {String(s.items.length).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                secteurs<br />accompagnés
              </span>
            </Reveal>
          </div>

          {/* Grille de secteurs — tuiles UNIFORMES (même couleur, même taille), agencement pro */}
          <div className="lg:col-span-7">
            <Reveal>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {s.items.map((item, i) => (
                  <li
                    key={item}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="sector-chip group flex items-center gap-3 rounded-md border border-brand-100 bg-white px-4 py-3.5 text-sm font-semibold text-brand-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:border-white/25"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-white/5 dark:text-brand-300">
                      <span className="size-2 rounded-full bg-current" />
                    </span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
                {/* Ouverture : aucune limite de secteur */}
                <li className="flex items-center justify-center gap-2 rounded-md border border-dashed border-brand-300 px-4 py-3.5 text-sm font-semibold text-brand-600 dark:border-white/20 dark:text-brand-300">
                  {addLabel}
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
