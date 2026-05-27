"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconEye } from "@/components/icons";

/* Palettes de pastilles d'initiales — légère diversité visuelle */
const avatarPalettes = [
  "bg-gradient-to-br from-brand-700 to-brand-500",
  "bg-gradient-to-br from-brand-600 to-sky",
  "bg-gradient-to-br from-brand-800 to-brand-500",
];

type TestimonialItem = { quote: string; name: string; role: string };

export function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const { dict } = useLang();
  const t = { ...dict.testimonials, items: items ?? dict.testimonials.items };
  const [featured, ...rest] = t.items;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      {/* Aurora discrète */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-sky/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* En-tête éditoriale */}
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            <span className="h-px w-6 bg-brand-400/60" />
            {t.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
        </Reveal>

        {/* Layout magazine : 1 featured + 2 stack */}
        <div className="mt-14 grid gap-7 lg:grid-cols-12">
          {/* Featured */}
          <Reveal className="lg:col-span-7">
            <figure className="relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50 p-8 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:p-12">
              <IconEye
                aria-hidden
                className="eye-watermark -bottom-12 -right-12 size-[360px]"
              />
              {/* Grande guillemet décorative */}
              <span
                aria-hidden
                className="numeral pointer-events-none absolute -left-3 -top-10 select-none text-[180px] leading-none"
              >
                &ldquo;
              </span>

              <blockquote className="relative max-w-2xl text-2xl font-medium leading-relaxed text-brand-900 dark:text-white sm:text-3xl">
                {featured.quote}
              </blockquote>

              <figcaption className="relative mt-10 flex items-center gap-4 border-t border-brand-100 pt-6 dark:border-white/10">
                <div
                  className={`grid size-14 place-items-center rounded-full text-base font-bold text-white shadow-lg shadow-brand-900/20 ${avatarPalettes[0]}`}
                >
                  {featured.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-base font-bold text-brand-900 dark:text-white">
                    {featured.name}
                  </div>
                  <div className="text-sm text-muted">{featured.role}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* Stack secondaire */}
          <div className="space-y-5 lg:col-span-5">
            {rest.map((item, i) => (
              <Reveal key={item.name} delay={(i + 1) * 110}>
                <figure className="card relative h-full p-7">
                  <span
                    aria-hidden
                    className="numeral pointer-events-none absolute -top-3 right-5 select-none text-[80px] leading-none"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="text-[15px] leading-relaxed text-ink/80 dark:text-brand-100/85">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-100 pt-5 dark:border-white/10">
                    <div
                      className={`grid size-11 place-items-center rounded-full text-sm font-bold text-white ${
                        avatarPalettes[(i + 1) % avatarPalettes.length]
                      }`}
                    >
                      {item.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-900 dark:text-white">
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
      </div>
    </section>
  );
}
