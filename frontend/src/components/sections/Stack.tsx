"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";

/* Frise défilante des technologies maîtrisées — piloté par l'admin (Stack). */
export function Stack({ items }: { items: string[] }) {
  const { dict } = useLang();
  const s = dict.stack;
  if (!items.length) return null;

  // Doublé pour un défilement continu et sans couture.
  const row = [...items, ...items];

  return (
    <section
      id="stack"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} />
      </div>

      <div className="marquee-mask relative mt-12 w-full overflow-hidden">
        <div className="marquee-track">
          {row.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-100 bg-brand-50 px-5 py-2.5 text-base font-semibold text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-brand-200"
            >
              <span className="size-1.5 rounded-full bg-brand-500" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
