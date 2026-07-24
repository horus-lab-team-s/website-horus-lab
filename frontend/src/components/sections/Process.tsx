"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

type ProcessItem = { title: string; desc: string };

const STEP_COLORS = [
  { grad: "from-brand-700 to-brand-500", icon: "bg-brand-600" },
  { grad: "from-brand-600 to-sky",       icon: "bg-sky" },
  { grad: "from-sky to-brand-400",       icon: "bg-brand-400" },
  { grad: "from-brand-500 to-brand-300", icon: "bg-brand-500" },
];

/* Fond sobre partagé */
function SharedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-grid-soft absolute inset-0 opacity-35 dark:opacity-20" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/12" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl dark:bg-brand-900/10" />
    </div>
  );
}

export function Process({ steps }: { steps?: ProcessItem[] }) {
  const { dict } = useLang();
  const p = { ...dict.process, steps: steps ?? dict.process.steps };

  return (
    <section id="process" className="relative overflow-hidden bg-surface py-14 sm:py-16">
      <SharedBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        {/* Frise statique : 4 étapes claires */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((step, i) => {
            const c = STEP_COLORS[i % STEP_COLORS.length];
            const isLast = i === p.steps.length - 1;
            return (
              <Reveal key={step.title} delay={i * 90}>
                <div className="relative flex h-full flex-col bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/8 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md text-base font-extrabold text-white shadow-md bg-gradient-to-br ${c.grad}`}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {!isLast && (
                      <span
                        aria-hidden
                        className="hidden h-px flex-1 bg-gradient-to-r from-brand-200 to-transparent dark:from-white/15 lg:block"
                      />
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold leading-tight text-brand-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {step.desc}
                  </p>

                  <div className={`mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r ${c.grad}`} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
