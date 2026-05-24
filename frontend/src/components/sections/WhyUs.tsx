"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconCheck } from "@/components/icons";
import { SectionHeading } from "./SectionHeading";

export function WhyUs() {
  const { dict } = useLang();
  const w = dict.why;

  return (
    <section id="why" className="bg-white py-20 dark:bg-[#070e1c] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={w.eyebrow} title={w.title} subtitle={w.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {w.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="card flex h-full gap-5 p-7">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                  <IconCheck className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
