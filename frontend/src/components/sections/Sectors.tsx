"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

const variants = [
  "bg-brand-700 text-white border-brand-700 hover:bg-brand-600",
  "bg-white text-brand-900 border-brand-200 hover:border-brand-400 dark:bg-slate-900 dark:text-white dark:border-white/10 dark:hover:border-white/25",
  "bg-brand-50 text-brand-700 border-brand-100 hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200 dark:border-white/10",
];

const sizes = [
  "px-7 py-4 text-base sm:text-lg",
  "px-5 py-3 text-sm",
  "px-6 py-3.5 text-base",
  "px-5 py-3 text-sm",
  "px-7 py-4 text-base sm:text-lg",
  "px-5 py-3 text-sm",
  "px-6 py-3.5 text-base",
  "px-5 py-3 text-sm",
];

/* Orbes animées en fond */
function FloatingOrb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full opacity-60 blur-2xl ${color} animate-float`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${8 + delay * 2}s`,
      }}
    />
  );
}

export function Sectors({ items }: { items?: string[] }) {
  const { dict } = useLang();
  const s = { ...dict.sectors, items: items ?? dict.sectors.items };

  return (
    <section
      id="sectors"
      className="relative overflow-hidden bg-surface py-20 sm:py-28"
    >
      {/* Fond vivant : grille + orbes + vague */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-soft absolute inset-0 opacity-50" />

        {/* Orbes colorées flottantes */}
        <FloatingOrb x="5%" y="20%" size={180} color="bg-brand-300/20" delay={0} />
        <FloatingOrb x="80%" y="10%" size={140} color="bg-sky/20" delay={1.5} />
        <FloatingOrb x="60%" y="70%" size={160} color="bg-brand-400/15" delay={2.5} />
        <FloatingOrb x="15%" y="75%" size={120} color="bg-sky/15" delay={1} />

        {/* Lignes de circuit animées */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full text-brand-300/25 dark:text-brand-600/20"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <path
            d="M0 300 H200 L240 260 H450 L490 300 H700 L740 250 H950 L990 300 H1200 L1240 280 H1440"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M0 400 H150 L200 350 H380 L430 400 H600 L650 350 H800 L850 400 H1100 L1150 360 H1440"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.6"
          />
          {[200, 450, 700, 950, 1200].map((cx, i) => (
            <circle key={i} cx={cx} cy={i % 2 === 0 ? 260 : 300} r="3" fill="currentColor" />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Colonne gauche */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {s.eyebrow}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                {s.title}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {s.subtitle}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 flex items-baseline gap-4">
              <span className="numeral text-[110px] sm:text-[140px]">
                {String(s.items.length).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                secteurs<br />accompagnés
              </span>
            </Reveal>
          </div>

          {/* Mur de puces avec animation cascade */}
          <div className="lg:col-span-7">
            <Reveal>
              <ul className="flex flex-wrap gap-3 sm:gap-4">
                {s.items.map((item, i) => {
                  const v = variants[i % variants.length];
                  const z = sizes[i % sizes.length];
                  return (
                    <li
                      key={item}
                      style={{ animationDelay: `${i * 70}ms` }}
                      className={`sector-chip group relative inline-flex cursor-default items-center gap-2.5 rounded-full border font-semibold transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg ${v} ${z}`}
                    >
                      {/* Point pulsant */}
                      <span className="relative flex size-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
                        <span className="relative inline-flex size-2 rounded-full bg-current opacity-70" />
                      </span>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
