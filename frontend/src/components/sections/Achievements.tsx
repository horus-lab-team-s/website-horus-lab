"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";
import type { CmsAchievement } from "@/lib/cms";

/* Bandeau « chiffres clés » — piloté par l'admin (Achievements), repli sinon. */
export function Achievements({ items }: { items: CmsAchievement[] }) {
  const { dict } = useLang();
  const a = dict.achievements;
  if (!items.length) return null;

  return (
    <section
      id="achievements"
      className="relative overflow-hidden bg-brand-900 py-20 sm:py-28"
    >
      {/* Halos animés (profondeur) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl animate-drift" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle} light />

        <dl className="mt-14 grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 90}>
              <div className="text-center">
                <dt className="text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {item.value}
                </dt>
                <dd className="mt-3 text-sm font-medium text-brand-100 sm:text-base">
                  {item.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
