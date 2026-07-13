"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";

/* ── Émojis style Telegram — fond animé ────────────────────── */
const EMOJI_BG = [
  "🌍","🚀","💡","🤖","📱","💻","🌐","⚡","🎯","🏆",
  "✨","🔥","💎","🌟","🎉","🙌","👏","💪","🤝","🌱",
  "📊","🔒","⚙️","🎨","🏗️","📡","🔬","💡","🌈","⭐",
  "🦁","🦅","🐘","🦊","🐬","🦋","🦚","🐆","🦁","🌺",
];

/* Positions pseudo-aléatoires fixes (SSR safe) */
const EMOJI_POSITIONS = [
  { x:3,  y:5,  s:1.4, d:0,   rot:-12 }, { x:12, y:18, s:1.1, d:1.2, rot:8  },
  { x:22, y:3,  s:1.3, d:0.5, rot:-5  }, { x:35, y:12, s:1.0, d:2,   rot:15 },
  { x:48, y:6,  s:1.5, d:0.3, rot:-20 }, { x:60, y:20, s:1.2, d:1.8, rot:10 },
  { x:72, y:2,  s:1.1, d:0.7, rot:-8  }, { x:85, y:14, s:1.4, d:2.5, rot:18 },
  { x:93, y:7,  s:1.0, d:1,   rot:-15 }, { x:5,  y:35, s:1.3, d:1.5, rot:5  },
  { x:18, y:45, s:1.1, d:0.2, rot:-10 }, { x:30, y:30, s:1.4, d:2.2, rot:12 },
  { x:45, y:40, s:1.0, d:0.8, rot:-6  }, { x:58, y:32, s:1.2, d:1.6, rot:20 },
  { x:70, y:48, s:1.3, d:0.4, rot:-18 }, { x:82, y:36, s:1.1, d:2.8, rot:7  },
  { x:95, y:42, s:1.4, d:1.1, rot:-12 }, { x:8,  y:60, s:1.0, d:0.6, rot:14 },
  { x:20, y:70, s:1.3, d:2.1, rot:-4  }, { x:33, y:58, s:1.2, d:1.3, rot:16 },
  { x:48, y:65, s:1.1, d:0.9, rot:-22 }, { x:62, y:72, s:1.4, d:2.4, rot:9  },
  { x:75, y:62, s:1.0, d:0.1, rot:-7  }, { x:88, y:68, s:1.2, d:1.7, rot:19 },
  { x:2,  y:80, s:1.3, d:0.4, rot:-11 }, { x:15, y:88, s:1.1, d:2.3, rot:6  },
  { x:28, y:82, s:1.4, d:0.7, rot:-16 }, { x:42, y:90, s:1.0, d:1.9, rot:13 },
  { x:56, y:85, s:1.2, d:0.3, rot:-3  }, { x:68, y:92, s:1.3, d:2.6, rot:21 },
  { x:80, y:80, s:1.1, d:1.0, rot:-9  }, { x:92, y:88, s:1.4, d:0.5, rot:17 },
];

const avatarGradients = [
  "from-brand-700 to-brand-500",
  "from-rose-500 to-orange-400",
  "from-emerald-600 to-teal-400",
];
const starColors = ["text-amber-400", "text-amber-400", "text-amber-400"];

type TestimonialItem = { quote: string; name: string; role: string };

export function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const { dict } = useLang();
  const t = { ...dict.testimonials, items: items ?? dict.testimonials.items };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-brand-900 py-20 sm:py-28"
    >
      {/* ── Fond style Telegram — émojis flottants ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Overlay dégradé par-dessus les émojis */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/92 via-brand-900/85 to-slate-900/90" />

        {/* Émojis */}
        {EMOJI_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className="absolute animate-float"
            style={{
              left:  `${pos.x}%`,
              top:   `${pos.y}%`,
              fontSize: `${pos.s * 1.6}rem`,
              transform: `rotate(${pos.rot}deg)`,
              animationDelay: `${pos.d}s`,
              animationDuration: `${6 + pos.d * 2}s`,
              opacity: 0.18,
            }}
          >
            {EMOJI_BG[i % EMOJI_BG.length]}
          </span>
        ))}

        {/* Halos de couleur */}
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/10 blur-3xl animate-drift" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* En-tête */}
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            <span className="h-px w-6 bg-sky/60" />
            {t.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
        </Reveal>

        {/* Layout magazine */}
        <div className="mt-14 grid gap-7 lg:grid-cols-12">

          {/* Témoignage featured */}
          <Reveal className="lg:col-span-7">
            <figure className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-12">
              {/* Guillemet décoratif */}
              <span aria-hidden
                className="pointer-events-none absolute -left-2 -top-8 select-none text-[180px] leading-none font-extrabold text-white/8">
                &ldquo;
              </span>

              {/* Étoiles */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, k) => (
                  <svg key={k} viewBox="0 0 20 20" fill="currentColor"
                    className="size-5 text-amber-400">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="relative text-xl font-medium leading-relaxed text-white sm:text-2xl">
                {t.items[0]?.quote}
              </blockquote>

              <figcaption className="relative mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className={`grid size-14 place-items-center rounded-full text-base font-bold text-white shadow-lg bg-gradient-to-br ${avatarGradients[0]}`}>
                  {t.items[0]?.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div className="text-base font-bold text-white">{t.items[0]?.name}</div>
                  <div className="text-sm text-brand-300">{t.items[0]?.role}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* Stack secondaire */}
          <div className="space-y-5 lg:col-span-5">
            {t.items.slice(1).map((item, i) => (
              <Reveal key={item.name} delay={(i + 1) * 110}>
                <figure className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span aria-hidden
                    className="pointer-events-none absolute -top-2 right-4 select-none text-[80px] leading-none font-extrabold text-white/6">
                    &ldquo;
                  </span>
                  {/* Mini étoiles */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, k) => (
                      <svg key={k} viewBox="0 0 20 20" fill="currentColor" className="size-3.5 text-amber-400">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-brand-100/90">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className={`grid size-10 place-items-center rounded-full text-xs font-bold text-white bg-gradient-to-br ${avatarGradients[(i + 1) % avatarGradients.length]}`}>
                      {item.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-brand-300">{item.role}</div>
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
