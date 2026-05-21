"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const { dict } = useLang();
  const t = dict.testimonials;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/50 to-white p-7 shadow-sm">
                <span aria-hidden className="text-5xl leading-none text-brand-300">
                  &ldquo;
                </span>
                <blockquote className="-mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/80">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-100 pt-5">
                  <div className="grid size-11 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">
                    {item.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-muted">{item.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
