"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

type ValueItem = { title: string; desc: string };

/* Dégradés d'accent par valeur */
const VALUE_COLORS = [
  "from-brand-700 to-brand-500",
  "from-sky to-brand-400",
  "from-brand-600 to-sky",
  "from-brand-500 to-brand-300",
];

export function WhyUs({ items }: { items?: ValueItem[] }) {
  const { dict, lang } = useLang();
  const w = { ...dict.why, items: items ?? dict.why.items };

  return (
    <section
      id="why"
      className="relative overflow-hidden bg-white py-16 dark:bg-[#070e1c] sm:py-20"
    >
      {/* Fond sobre : grille hexagonale légère + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Grille hexagonale légère */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full text-brand-200/20 dark:text-brand-700/15"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <path
                d="M30 4 L56 19 L56 33 L30 48 L4 33 L4 19 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>

        {/* Halos de couleur */}
        <div className="absolute -bottom-32 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-500/8 blur-3xl animate-drift" />
        <div className="absolute -top-20 left-1/3 h-[400px] w-[400px] rounded-full bg-sky/6 blur-3xl animate-float-slow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Colonne gauche : manifeste */}
          <div className="relative lg:col-span-4">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {w.eyebrow}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                {w.title}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {w.subtitle}
              </p>
            </Reveal>

            {/* Compteur animé */}
            <Reveal delay={120} className="mt-10">
              <div className="inline-flex items-center gap-3 rounded-md border border-brand-100 bg-brand-50 px-5 py-3 dark:border-white/10 dark:bg-white/5">
                <span className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">
                  {String(w.items.length).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                  {lang === "fr" ? "Engagements\nforts" : "Core\ncommitments"}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Grille des valeurs en puzzle 2×2 */}
          <div className="lg:col-span-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {w.items.map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <article
                    className="group relative h-full overflow-hidden rounded-lg border border-brand-100 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900"
                  >
                    {/* Fond dégradé dynamique au survol */}
                    <div
                      aria-hidden
                      className={`absolute inset-0 bg-gradient-to-br ${VALUE_COLORS[i]} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                    />

                    {/* Numéro en filigrane */}
                    <span
                      aria-hidden
                      className="numeral pointer-events-none absolute -right-2 -top-3 select-none text-[64px] text-brand-100 dark:text-white/5"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      {/* Badge coloré */}
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white bg-gradient-to-r ${VALUE_COLORS[i]}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-4 text-lg font-bold tracking-tight text-brand-900 dark:text-white sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                        {item.desc}
                      </p>
                    </div>

                    {/* Liseré lumineux */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${VALUE_COLORS[i]} transition-transform duration-700 group-hover:scale-x-100`}
                    />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
