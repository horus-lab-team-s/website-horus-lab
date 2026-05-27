"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

type ValueItem = { title: string; desc: string };

export function WhyUs({ items }: { items?: ValueItem[] }) {
  const { dict } = useLang();
  const w = { ...dict.why, items: items ?? dict.why.items };

  return (
    <section
      id="why"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[420px] w-[420px] rounded-full bg-brand-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Colonne gauche : manifeste éditorial */}
          <div className="relative lg:col-span-5">
            {/* Lignes topographiques (contour-map) en filigrane */}
            <svg
              aria-hidden
              viewBox="0 0 400 320"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -left-6 -top-4 h-72 w-[420px] text-brand-300/30 dark:text-brand-600/25"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M-20 220 C 80 180 180 250 280 200 S 480 220 540 180" />
                <path d="M-20 180 C 80 140 180 210 280 160 S 480 180 540 140" />
                <path d="M-20 140 C 80 100 180 170 280 120 S 480 140 540 100" />
                <path d="M-20 100 C 80 60 180 130 280 80 S 480 100 540 60" />
                <path d="M-20 60 C 80 20 180 90 280 40 S 480 60 540 20" />
              </g>
            </svg>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {w.eyebrow}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                {w.title}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {w.subtitle}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-brand-700 dark:text-brand-300">
                <span className="size-2 rounded-full bg-brand-500" />
                <span className="tabular-nums">
                  {String(w.items.length).padStart(2, "0")} — Engagements
                </span>
              </div>
            </Reveal>
          </div>

          {/* Colonne droite : liste éditoriale numérotée */}
          <div className="lg:col-span-7">
            <ol className="relative">
              {w.items.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <li className="group relative grid grid-cols-[auto_1fr] gap-6 border-t border-brand-100 py-7 transition-colors hover:border-brand-300 sm:gap-8 sm:py-8 dark:border-white/10 dark:hover:border-white/25">
                    <span className="numeral pt-1 text-4xl sm:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-brand-900 dark:text-white sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
                        {item.desc}
                      </p>
                    </div>
                    {/* Liseré qui s'illumine */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-sky to-transparent transition-transform duration-700 group-hover:scale-x-100"
                    />
                  </li>
                </Reveal>
              ))}
              {/* Ligne de clôture */}
              <li
                aria-hidden
                className="h-px bg-brand-100 dark:bg-white/10"
              />
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
