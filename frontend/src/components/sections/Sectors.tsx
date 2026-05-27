"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

/* Trois variantes de "puces" qui s'alternent pour casser la monotonie de la grille */
const variants = [
  "bg-brand-700 text-white border-brand-700 hover:bg-brand-600",
  "bg-white text-brand-900 border-brand-200 hover:border-brand-400 dark:bg-slate-900 dark:text-white dark:border-white/10 dark:hover:border-white/25",
  "bg-brand-50 text-brand-700 border-brand-100 hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200 dark:border-white/10",
];

/* Tailles éditoriales variables — flex-wrap fait le reste */
const sizes = [
  "px-7 py-4 text-base sm:text-lg",
  "px-5 py-3 text-sm",
  "px-6 py-3.5 text-base",
  "px-5 py-3 text-sm",
  "px-7 py-4 text-base sm:text-lg",
  "px-5 py-3 text-sm",
  "px-6 py-3.5 text-base",
  "px-5 py-3 text-sm",
];

export function Sectors() {
  const { dict } = useLang();
  const s = dict.sectors;

  return (
    <section
      id="sectors"
      className="relative overflow-hidden bg-surface py-20 sm:py-28"
    >
      {/* Trame technique de fond */}
      <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/4 h-[360px] w-[360px] rounded-full bg-sky/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Colonne gauche : titre + chiffre */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {s.eyebrow}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                {s.title}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {s.subtitle}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 flex items-baseline gap-4">
              <span className="numeral text-[110px] sm:text-[140px]">
                {String(s.items.length).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                secteurs<br />accompagnés
              </span>
            </Reveal>
          </div>

          {/* Colonne droite : mur de puces éditoriales */}
          <div className="lg:col-span-7">
            <Reveal>
              <ul className="flex flex-wrap gap-3 sm:gap-4">
                {s.items.map((item, i) => {
                  const v = variants[i % variants.length];
                  const z = sizes[i % sizes.length];
                  return (
                    <li
                      key={item}
                      style={{ animationDelay: `${i * 70}ms` }}
                      className={`sector-chip group relative inline-flex items-center gap-2.5 rounded-full border font-semibold transition-all duration-500 hover:-translate-y-1 ${v} ${z}`}
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-70 transition-opacity group-hover:opacity-100" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
