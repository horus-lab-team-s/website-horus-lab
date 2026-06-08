"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/Reveal";

/* ── Émojis tech animés style Telegram ── */
const EMOJIS = [
  "🚀","💡","⚡","🎯","🔥","✨","💎","🌟","🏆","🌍",
  "🤖","📱","💻","🔬","⚙️","🛡️","📊","🔒","🎨","🌐",
  "🦁","🦅","🐬","🦋","🦚","🌺","⭐","🎉","💪","🙌",
  "🔮","🪄","🌈","💫","🎪","🧩","🔭","🛸","🌙","☀️",
];

const EMOJI_POS = [
  { x:"2%",  y:"3%",  d:"0s",   dur:"9s"  },
  { x:"12%", y:"15%", d:"1.2s", dur:"10s" },
  { x:"22%", y:"2%",  d:"0.5s", dur:"8s"  },
  { x:"35%", y:"10%", d:"2s",   dur:"11s" },
  { x:"47%", y:"4%",  d:"0.3s", dur:"9s"  },
  { x:"60%", y:"18%", d:"1.8s", dur:"10s" },
  { x:"72%", y:"1%",  d:"0.7s", dur:"8s"  },
  { x:"83%", y:"12%", d:"2.5s", dur:"9s"  },
  { x:"94%", y:"5%",  d:"1s",   dur:"11s" },
  { x:"6%",  y:"35%", d:"1.5s", dur:"9s"  },
  { x:"18%", y:"48%", d:"0.2s", dur:"10s" },
  { x:"30%", y:"30%", d:"2.2s", dur:"8s"  },
  { x:"44%", y:"42%", d:"0.8s", dur:"9s"  },
  { x:"56%", y:"33%", d:"1.6s", dur:"11s" },
  { x:"68%", y:"50%", d:"0.4s", dur:"8s"  },
  { x:"80%", y:"37%", d:"2.8s", dur:"10s" },
  { x:"93%", y:"44%", d:"1.1s", dur:"9s"  },
  { x:"5%",  y:"60%", d:"0.6s", dur:"8s"  },
  { x:"20%", y:"70%", d:"2.1s", dur:"11s" },
  { x:"34%", y:"58%", d:"1.3s", dur:"9s"  },
  { x:"48%", y:"66%", d:"0.9s", dur:"10s" },
  { x:"62%", y:"74%", d:"2.4s", dur:"8s"  },
  { x:"75%", y:"62%", d:"0.1s", dur:"9s"  },
  { x:"89%", y:"68%", d:"1.7s", dur:"11s" },
  { x:"3%",  y:"80%", d:"0.4s", dur:"9s"  },
  { x:"16%", y:"88%", d:"2.3s", dur:"8s"  },
  { x:"29%", y:"82%", d:"0.7s", dur:"10s" },
  { x:"43%", y:"92%", d:"1.9s", dur:"9s"  },
  { x:"57%", y:"86%", d:"0.3s", dur:"8s"  },
  { x:"70%", y:"91%", d:"2.6s", dur:"11s" },
  { x:"84%", y:"80%", d:"1.0s", dur:"9s"  },
  { x:"96%", y:"87%", d:"0.5s", dur:"8s"  },
];

type ProcessStep = { step: string; title: string; desc: string };

const STEP_COLORS = [
  { grad: "from-brand-700 to-brand-500", border: "border-brand-400/40" },
  { grad: "from-brand-600 to-sky",       border: "border-sky/40" },
  { grad: "from-sky to-brand-400",       border: "border-brand-400/40" },
  { grad: "from-brand-500 to-brand-300", border: "border-brand-300/40" },
];

const CARD_W = 224;
const GAP    = 16;
const SPEED  = 42;

export function ServiceProcessSection({
  process,
  gradient,
  lang,
  processLabel,
  howLabel,
}: {
  process: ProcessStep[];
  gradient: string;
  lang: string;
  processLabel: string;
  howLabel: string;
}) {
  const total    = process.length;
  const CLONE    = [...process, ...process, ...process];
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef    = useRef<number | null>(null);
  const lastRef   = useRef<number>(0);
  const trackRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const limit = total * (CARD_W + GAP);
    function tick(now: number) {
      if (!pausedRef.current) {
        const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
        offsetRef.current += SPEED * dt;
        if (offsetRef.current >= limit) offsetRef.current -= limit;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [total]);

  return (
    <section className="relative overflow-hidden bg-brand-900 py-20 sm:py-24">
      {/* ── Fond : overlay dégradé de marque ── */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-900/88 to-slate-900/92" />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.10]" />

      {/* ── Émojis flottants style Telegram ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {EMOJI_POS.map((pos, i) => (
          <span
            key={i}
            className="absolute animate-float"
            style={{
              left:            pos.x,
              top:             pos.y,
              fontSize:        "1.3rem",
              opacity:         0.16,
              animationDelay:  pos.d,
              animationDuration: pos.dur,
            }}
          >
            {EMOJIS[i % EMOJIS.length]}
          </span>
        ))}
        {/* Halos */}
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl animate-drift" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* En-tête */}
        <Reveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky">
            <span className="h-px w-6 bg-sky/60" />
            {processLabel}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{howLabel}</h2>
        </Reveal>

        {/* ── Carousel RAF continu ── */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {/* Masques de fondu */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-brand-900 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-brand-900 to-transparent" />

          <div ref={trackRef} className="flex" style={{ gap:`${GAP}px`, willChange:"transform" }}>
            {CLONE.map((step, i) => {
              const c = STEP_COLORS[i % total];
              return (
                <div
                  key={`${step.step}-${i}`}
                  className={`flex-shrink-0 flex flex-col overflow-hidden rounded-2xl border bg-white/8 backdrop-blur p-5 ${c.border}`}
                  style={{ width: CARD_W, minHeight: 210 }}
                >
                  {/* Numéro badge */}
                  <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.grad} text-sm font-extrabold text-white shadow-lg mb-4`}>
                    {step.step}
                  </div>

                  {/* Tracé mini */}
                  <svg viewBox="0 0 40 16" className="mb-2 h-4 w-10 text-white/20" fill="none">
                    <path d="M0 8 H12 L15 3 H28 L31 8 H40" stroke="currentColor" strokeWidth="1" />
                    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="28" cy="3" r="1.5" fill="currentColor" />
                  </svg>

                  <h3 className="text-sm font-extrabold leading-tight text-white">{step.title}</h3>
                  <p className="mt-2 flex-1 text-[12px] leading-relaxed text-brand-200/80 line-clamp-4">{step.desc}</p>

                  {/* Liseré coloré */}
                  <div className={`mt-4 h-0.5 w-full rounded-full bg-gradient-to-r ${c.grad}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateurs */}
        <div className="mt-6 flex justify-center gap-2">
          {process.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${STEP_COLORS[i % STEP_COLORS.length].grad}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
