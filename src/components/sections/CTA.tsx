"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

export function CTA() {
  const { dict } = useLang();
  const c = dict.cta;

  return (
    <section className="bg-white px-5 py-20 dark:bg-[#070e1c] sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16 sm:py-20">
          {/* Décor */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 -top-16 size-64 rounded-full bg-brand-500/30 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-20 -right-10 size-72 rounded-full bg-sky/20 blur-3xl animate-drift" />
            <div className="absolute inset-0 bg-grid opacity-[0.15]" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              {c.subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03]"
              >
                {c.button}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                {c.secondary}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
