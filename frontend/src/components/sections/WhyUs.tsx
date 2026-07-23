"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

type ValueItem = { title: string; desc: string };

/* Dégradés d'accent par valeur */
const VALUE_COLORS = [
  "from-brand-700 to-brand-500",
  "from-sky to-brand-400",
  "from-brand-600 to-sky",
  "from-brand-500 to-brand-300",
];

export function WhyUs({ items }: { items?: ValueItem[] }) {
  const { dict } = useLang();
  const w = { ...dict.why, items: items ?? dict.why.items };

  return (
    <section
      id="why"
      className="relative overflow-hidden bg-white py-14 dark:bg-[#070e1c] sm:py-16"
    >
      {/* Fond sobre : grille fine + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-[0.35] dark:opacity-[0.2]" />
        <div className="absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-brand-500/8 blur-3xl" />
        <div className="absolute -top-20 left-1/3 h-[360px] w-[360px] rounded-full bg-sky/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={w.eyebrow} title={w.title} subtitle={w.subtitle} />

        {/* 4 engagements sur une ligne (desktop) */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {w.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className="group relative h-full overflow-hidden bg-surface p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/10 dark:bg-white/5">
                {/* Numéro filigrane */}
                <span
                  aria-hidden
                  className="numeral pointer-events-none absolute -right-2 -top-3 select-none text-[64px] text-brand-100 dark:text-white/5"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white bg-gradient-to-r ${VALUE_COLORS[i]}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-brand-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>

                {/* Liseré lumineux bas */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${VALUE_COLORS[i]} transition-transform duration-700 group-hover:scale-x-100`}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
