"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import {
  IconCode,
  IconCog,
  IconLayers,
  IconSpark,
} from "@/components/icons";
import { SectionHeading } from "./SectionHeading";

const icons = [IconCode, IconLayers, IconCog, IconSpark];

export function Services() {
  const { dict } = useLang();
  const s = dict.services;

  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => {
            const Icon = icons[i] ?? IconCode;
            return (
              <Reveal key={item.title} delay={i * 90}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-b from-white to-brand-50/40 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-900/10">
                  <span className="absolute -right-8 -top-8 size-24 rounded-full bg-brand-100/60 transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative">
                    <div className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/25 transition-colors group-hover:bg-brand-500">
                      <Icon className="size-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-brand-900">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">
                      {item.desc}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
