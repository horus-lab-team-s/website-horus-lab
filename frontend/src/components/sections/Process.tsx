"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

type ProcessItem = { title: string; desc: string };

const STEP_COLORS = [
  { grad: "from-brand-700 to-brand-500", border: "border-brand-400/40", icon: "bg-brand-600" },
  { grad: "from-brand-600 to-sky",       border: "border-sky/40",       icon: "bg-sky" },
  { grad: "from-sky to-brand-400",       border: "border-brand-400/40", icon: "bg-brand-400" },
  { grad: "from-brand-500 to-brand-300", border: "border-brand-300/40", icon: "bg-brand-500" },
];

/* Fond partagé Réalisations + Process */
function SharedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-grid-soft absolute inset-0 opacity-40" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-400/8 blur-3xl animate-float-slow" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/7 blur-3xl animate-drift" />
      <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-300/7 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <svg aria-hidden viewBox="0 0 1400 400" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand-300/10 dark:text-brand-600/8">
        <path d="M0 200 H200 L260 150 H480 L540 200 H760 L820 140 H1050 L1110 200 H1400"
          fill="none" stroke="currentColor" strokeWidth="0.8" />
        {[200, 480, 760, 1050].map((x, k) => (
          <circle key={k} cx={x} cy={k % 2 === 0 ? 150 : 200} r="2.5" fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}

export function Process({ steps }: { steps?: ProcessItem[] }) {
  const { dict } = useLang();
  const p = { ...dict.process, steps: steps ?? dict.process.steps };
  const total = p.steps.length;

  /* ── Carousel infini : clones dupliqués pour l'illusion de boucle ── */
  // On duplique la liste : [0,1,2,3,0,1,2,3] → défile puis reset invisible
  const CLONE = [...p.steps, ...p.steps];

  const [offset, setOffset] = useState(0);          // px décalage actuel
  const [transition, setTransition] = useState(true); // active/désactive la CSS transition
  const pausedRef = useRef(false);
  const rafRef    = useRef<number | null>(null);
  const lastRef   = useRef<number>(0);
  const CARD_W    = 220; // largeur d'une carte en px
  const GAP       = 16;  // gap entre cartes
  const STEP      = CARD_W + GAP;
  const SPEED     = 38;  // px/s — vitesse modérée, lisible

  /* Animation RAF continue */
  useEffect(() => {
    function tick(now: number) {
      if (!pausedRef.current) {
        const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
        setOffset(prev => {
          const next = prev + SPEED * dt;
          // Quand on a parcouru la moitié (total cartes), on reset silencieusement
          const limit = total * STEP;
          if (next >= limit) {
            return next - limit; // saut invisible car on a un clone identique
          }
          return next;
        });
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [total, STEP, SPEED]);

  return (
    <section id="process" className="relative overflow-hidden bg-surface py-20 sm:py-24">
      <SharedBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        <div
          className="mt-12 overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {/* Masques fondu aux bords */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface to-transparent" style={{ top: "auto", bottom: "auto" }} />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent" style={{ top: "auto", bottom: "auto" }} />

          {/* Piste — transform CSS contrôlé par RAF */}
          <div
            className="flex"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(-${offset}px)`,
              willChange: "transform",
            }}
          >
            {CLONE.map((step, i) => {
              const c = STEP_COLORS[i % total];
              return (
                <div
                  key={`${step.title}-${i}`}
                  className={`flex-shrink-0 flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 dark:bg-slate-900 ${c.border} shadow-sm`}
                  style={{ width: CARD_W, minHeight: 200 }}
                >
                  {/* Numéro + icône */}
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex size-9 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md bg-gradient-to-br ${c.grad}`}>
                      {String((i % total) + 1).padStart(2, "0")}
                    </div>
                    {/* Tracé circuit mini */}
                    <svg viewBox="0 0 40 20" className="h-5 w-10 text-brand-200/60 dark:text-brand-700/40" fill="none">
                      <path d="M0 10 H12 L16 4 H28 L32 10 H40" stroke="currentColor" strokeWidth="1" />
                      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="28" cy="4"  r="1.5" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Titre */}
                  <h3 className="mt-3 text-sm font-extrabold leading-tight text-brand-900 dark:text-white">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-[12px] leading-relaxed text-muted line-clamp-4">
                    {step.desc}
                  </p>

                  {/* Liseré bas coloré */}
                  <div className={`mt-4 h-0.5 w-full rounded-full bg-gradient-to-r ${c.grad}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateur de progression (barre statique) */}
        <div className="mt-6 flex justify-center gap-2">
          {p.steps.map((_, i) => (
            <div key={i}
              className={`h-1.5 rounded-full transition-all duration-300 bg-gradient-to-r ${STEP_COLORS[i].grad}`}
              style={{ width: 32 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
