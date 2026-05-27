"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

type ProcessItem = { title: string; desc: string };

export function Process({ steps }: { steps?: ProcessItem[] }) {
  const { dict } = useLang();
  const p = { ...dict.process, steps: steps ?? dict.process.steps };

  return (
    <section id="process" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      {/* Halo doux à gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[360px] w-[360px] rounded-full bg-sky/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        {/* Timeline verticale (mobile) + zigzag (desktop) */}
        <div className="relative mt-20">
          {/* Ligne médiane dessinée (desktop) */}
          <Reveal className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block">
            <svg
              aria-hidden
              viewBox="0 0 4 600"
              preserveAspectRatio="none"
              className="h-full w-1"
            >
              <line
                x1="2"
                y1="0"
                x2="2"
                y2="600"
                stroke="url(#processLine)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                className="draw-line"
              />
              <defs>
                <linearGradient id="processLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-300)" stopOpacity="0" />
                  <stop offset="20%" stopColor="var(--color-brand-400)" />
                  <stop offset="80%" stopColor="var(--color-brand-500)" />
                  <stop offset="100%" stopColor="var(--color-sky)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </Reveal>

          {/* Ligne verticale gauche (mobile) */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-[19px] w-px bg-gradient-to-b from-transparent via-brand-200 to-transparent lg:hidden"
          />

          <ol className="relative space-y-12 lg:space-y-20">
            {p.steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={step.title}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12`}
                >
                  {/* Nœud sur la ligne (desktop) */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-2 hidden size-4 -translate-x-1/2 rounded-full bg-brand-500 ring-4 ring-surface lg:block"
                  >
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/40" />
                  </span>

                  {/* Nœud mobile */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 grid size-10 place-items-center rounded-full bg-white text-sm font-extrabold text-brand-700 ring-1 ring-brand-100 lg:hidden dark:bg-slate-900 dark:text-brand-200 dark:ring-white/10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Reveal
                    delay={i * 120}
                    className={`pl-14 lg:pl-0 ${
                      isLeft
                        ? "lg:col-start-1 lg:pr-12 lg:text-right"
                        : "lg:col-start-2 lg:pl-12"
                    }`}
                  >
                    <div
                      className={`inline-flex items-baseline gap-3 ${
                        isLeft ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <span className="numeral text-5xl sm:text-6xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
                        étape
                      </span>
                    </div>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-brand-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-md text-[15px] leading-relaxed text-muted ${
                        isLeft ? "lg:ml-auto" : ""
                      }`}
                    >
                      {step.desc}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
