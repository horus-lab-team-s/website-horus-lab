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
    <section id="services" className="bg-white py-20 dark:bg-[#070e1c] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => {
            const Icon = icons[i] ?? IconCode;
            return (
              <Reveal key={item.title} delay={i * 70}>
                <article className="card group h-full p-7">
                  <div>
                    <div className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/25 transition-colors group-hover:bg-brand-500">
                      <Icon className="size-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-brand-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">
                      {item.desc}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-white/5 dark:text-brand-200"
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
