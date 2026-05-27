"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight,
  IconCode,
  IconCog,
  IconEye,
  IconLayers,
  IconSpark,
} from "@/components/icons";
import { SectionHeading } from "./SectionHeading";

const icons = [IconCode, IconLayers, IconCog, IconSpark];

/* Bento : 1=large, 2=étroit, 3=étroit, 4=large — pattern "Z" éditorial */
const bentoSpans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

export function Services() {
  const { dict } = useLang();
  const s = dict.services;

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      {/* Trame technique en filigrane */}
      <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-60" />
      {/* Halo doux en haut à droite */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {s.items.map((item, i) => {
            const Icon = icons[i] ?? IconCode;
            const isFeature = bentoSpans[i].includes("col-span-7");
            return (
              <Reveal
                key={item.title}
                delay={i * 90}
                className={bentoSpans[i] ?? "lg:col-span-6"}
              >
                <article
                  className={`card group relative h-full overflow-hidden p-7 sm:p-9 ${
                    isFeature ? "min-h-[280px]" : "min-h-[240px]"
                  }`}
                >
                  {/* Œil filigrane (signature Horus) */}
                  {isFeature && (
                    <IconEye className="eye-watermark -bottom-10 -right-10 size-[280px]" />
                  )}

                  {/* Tracé de circuit qui s'éclaire au survol */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 80"
                    className="pointer-events-none absolute right-0 top-0 h-20 w-52 text-brand-200 opacity-50 transition-opacity duration-500 group-hover:opacity-100 dark:text-brand-700/40"
                  >
                    <path
                      d="M0 40 H60 L80 20 H140 L160 40 H200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <circle cx="60" cy="40" r="2.5" fill="currentColor" />
                    <circle cx="140" cy="20" r="2.5" fill="currentColor" />
                    <circle cx="200" cy="40" r="2.5" fill="currentColor" />
                  </svg>

                  {/* Numéro éditorial */}
                  <span
                    aria-hidden
                    className={`numeral pointer-events-none absolute right-7 top-4 select-none ${
                      isFeature ? "text-[110px]" : "text-[90px]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-full flex-col">
                    {/* Glyphe icône */}
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200 dark:ring-white/10 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                      <Icon className="size-6" />
                    </div>

                    <h3
                      className={`mt-6 font-extrabold tracking-tight text-brand-900 dark:text-white ${
                        isFeature ? "text-2xl sm:text-[28px]" : "text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
                      {item.desc}
                    </p>

                    <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-brand-100 bg-white/60 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur transition-colors group-hover:border-brand-200 dark:border-white/10 dark:bg-white/5 dark:text-brand-200 dark:group-hover:border-white/20"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {/* Indicateur discret en bas */}
                    <div className="absolute bottom-0 right-0 flex items-center gap-1 text-brand-400 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 translate-x-2">
                      <IconArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Liseré qui s'illumine au survol */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-brand-300 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
