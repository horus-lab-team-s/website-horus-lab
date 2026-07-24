"use client";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

type ProcessStep = { step: string; title: string; desc: string };

const STEP_COLORS = [
  { grad: "from-brand-700 to-brand-500", border: "border-brand-400/40" },
  { grad: "from-brand-600 to-sky",       border: "border-sky/40" },
  { grad: "from-sky to-brand-400",       border: "border-brand-400/40" },
  { grad: "from-brand-500 to-brand-300", border: "border-brand-300/40" },
];

export function ServiceProcessSection({
  process,
  processLabel,
  howLabel,
}: {
  process: ProcessStep[];
  gradient: string;
  lang: string;
  processLabel: string;
  howLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-16">
      {/* Fond sobre : grille + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/12 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={processLabel} title={howLabel} light />

        {/* Frise statique : 4 étapes claires */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => {
            const c = STEP_COLORS[i % STEP_COLORS.length];
            const isLast = i === process.length - 1;
            return (
              <Reveal key={step.step} delay={i * 90}>
                <div className="flex h-full flex-col bg-white/8 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${c.grad} text-sm font-extrabold text-white shadow-lg`}>
                      {step.step}
                    </div>
                    {!isLast && (
                      <span aria-hidden className="hidden h-px flex-1 bg-gradient-to-r from-white/20 to-transparent lg:block" />
                    )}
                  </div>

                  <h3 className="mt-5 text-base font-extrabold leading-tight text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200/80">{step.desc}</p>

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
