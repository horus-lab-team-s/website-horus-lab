"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Sectors() {
  const { dict } = useLang();
  const s = dict.sectors;

  return (
    <section id="sectors" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {s.items.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="group flex h-full items-center gap-3 rounded-2xl border border-brand-100 bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/25">
                <span className="size-2.5 shrink-0 rounded-full bg-brand-400 transition-colors group-hover:bg-brand-500" />
                <span className="text-sm font-semibold text-brand-900 dark:text-white">
                  {item}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
