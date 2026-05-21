"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Process() {
  const { dict } = useLang();
  const p = dict.process;

  return (
    <section id="process" className="relative bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        <div className="relative mt-16">
          {/* Ligne de connexion (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block"
          />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {p.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 110}>
                <li className="relative">
                  <div className="relative z-10 grid size-14 place-items-center rounded-2xl bg-white text-xl font-extrabold text-brand-700 shadow-lg shadow-brand-900/10 ring-1 ring-brand-100">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-brand-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
