"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight, IconCheck, IconCode, IconCog,
  IconEye, IconGlobe, IconLayers, IconSpark,
} from "@/components/icons";
import type { Project } from "@/lib/projects";

const ICONS: Record<string, typeof IconCode> = {
  code: IconCode, layers: IconLayers, cog: IconCog,
  spark: IconSpark, eye: IconEye, globe: IconGlobe, check: IconCheck,
};

const PROJECT_IMAGES: Record<string, string> = {
  "Afrikamode":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  "Gathe Finance":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75",
  "Plateforme e-Learning":
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=75",
  "e-Learning platform":
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=75",
  "Programme Formation IT":
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=75",
  "IT Training Programme":
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=75",
};

/* ── Formes SVG disposées individuellement dans tout le fond ──
   Chaque forme est positionnée de façon absolue, chacune avec sa propre
   animation. On n'utilise PAS un SVG global — chaque <svg> est indépendant.
*/
const BG_PATHS = [
  // Étoile 4 branches
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
  // Diamant
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><rect x="6" y="6" width="12" height="12" rx="1" transform="rotate(45 12 12)"/></svg>`,
  // Hexagone
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>`,
  // Double cercle
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.1" opacity="${op}"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`,
  // Croix
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="${op}"><path d="M12 2v20M2 12h20"/></svg>`,
  // Triangle
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><polygon points="12,3 22,21 2,21"/></svg>`,
  // Bouclier
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><path d="M12 2l8 4v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>`,
  // Vague
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" height="26" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="${op}"><path d="M2 12 Q6 6 10 12 Q14 18 18 12 Q20 8 22 12"/></svg>`,
  // Losange simple
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.2" opacity="${op}"><polygon points="12,2 22,12 12,22 2,12"/></svg>`,
  // Octogone
  (op: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.1" opacity="${op}"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7"/></svg>`,
];

/* 32 positions bien réparties sur TOUT le fond (x% y%) */
const SHAPE_POSITIONS = [
  { x:"3%",  y:"4%",  i:0, d:"0s",   dur:"8s"  },
  { x:"14%", y:"16%", i:1, d:"1.2s", dur:"9s"  },
  { x:"24%", y:"2%",  i:2, d:"0.5s", dur:"10s" },
  { x:"36%", y:"10%", i:3, d:"2s",   dur:"7s"  },
  { x:"48%", y:"5%",  i:4, d:"0.3s", dur:"11s" },
  { x:"60%", y:"18%", i:5, d:"1.8s", dur:"8s"  },
  { x:"72%", y:"1%",  i:6, d:"0.7s", dur:"9s"  },
  { x:"84%", y:"12%", i:7, d:"2.5s", dur:"10s" },
  { x:"93%", y:"6%",  i:8, d:"1s",   dur:"8s"  },
  { x:"7%",  y:"32%", i:9, d:"1.5s", dur:"9s"  },
  { x:"18%", y:"46%", i:0, d:"0.2s", dur:"11s" },
  { x:"30%", y:"30%", i:1, d:"2.2s", dur:"8s"  },
  { x:"42%", y:"42%", i:2, d:"0.8s", dur:"7s"  },
  { x:"55%", y:"35%", i:3, d:"1.6s", dur:"10s" },
  { x:"67%", y:"50%", i:4, d:"0.4s", dur:"9s"  },
  { x:"80%", y:"38%", i:5, d:"2.8s", dur:"8s"  },
  { x:"91%", y:"44%", i:6, d:"1.1s", dur:"11s" },
  { x:"5%",  y:"60%", i:7, d:"0.6s", dur:"9s"  },
  { x:"20%", y:"70%", i:8, d:"2.1s", dur:"8s"  },
  { x:"33%", y:"58%", i:9, d:"1.3s", dur:"10s" },
  { x:"46%", y:"66%", i:0, d:"0.9s", dur:"9s"  },
  { x:"58%", y:"74%", i:1, d:"2.4s", dur:"8s"  },
  { x:"71%", y:"62%", i:2, d:"0.1s", dur:"11s" },
  { x:"88%", y:"68%", i:3, d:"1.7s", dur:"7s"  },
  { x:"2%",  y:"80%", i:4, d:"0.4s", dur:"9s"  },
  { x:"16%", y:"88%", i:5, d:"2.3s", dur:"8s"  },
  { x:"29%", y:"82%", i:6, d:"0.7s", dur:"10s" },
  { x:"44%", y:"91%", i:7, d:"1.9s", dur:"9s"  },
  { x:"57%", y:"85%", i:8, d:"0.3s", dur:"8s"  },
  { x:"70%", y:"92%", i:9, d:"2.6s", dur:"11s" },
  { x:"83%", y:"80%", i:0, d:"1.0s", dur:"9s"  },
  { x:"95%", y:"88%", i:1, d:"0.5s", dur:"8s"  },
];

function RealisationsBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Base dégradée */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/20 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />

      {/* Formes SVG — chacune positionnée individuellement, animée séparément */}
      {SHAPE_POSITIONS.map((pos, idx) => (
        <div
          key={idx}
          className="absolute animate-float text-brand-400/[0.15] dark:text-brand-300/[0.12]"
          style={{
            left: pos.x,
            top: pos.y,
            animationDelay: pos.d,
            animationDuration: pos.dur,
            color: "currentColor",
          }}
          dangerouslySetInnerHTML={{
            __html: BG_PATHS[pos.i % BG_PATHS.length](0.18),
          }}
        />
      ))}

      {/* Halos de profondeur */}
      <div className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-rose-200/10 blur-3xl animate-float-slow dark:bg-rose-500/5" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl animate-drift dark:bg-amber-500/5" />
      <div className="absolute left-1/3 top-0 h-56 w-56 rounded-full bg-brand-200/8 blur-3xl animate-float dark:bg-brand-500/4" style={{ animationDelay: "2s" }} />

      {/* Tracé de circuit */}
      <svg aria-hidden viewBox="0 0 1400 600" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand-300/10 dark:text-brand-600/8">
        <path d="M0 500 H250 L320 430 H580 L650 500 H900 L970 400 H1200 L1270 480 H1400"
          fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0 100 H180 L240 160 H460 L520 100 H750 L810 160 H1100 L1160 100 H1400"
          fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      </svg>
    </div>
  );
}

export function Realisations({ projects }: { projects: Project[] }) {
  const { dict, localePath } = useLang();
  const r = dict.realisations;
  const top = projects.slice(0, 4);
  if (top.length === 0) return null;
  const [featured, ...rest] = top;
  const Featured = ICONS[featured.iconKey] ?? IconCode;
  const featuredImg = PROJECT_IMAGES[featured.title];

  return (
    <section id="realisations" className="relative overflow-hidden py-20 sm:py-28">
      <RealisationsBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* En-tête */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {r.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
              {r.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{r.subtitle}</p>
          </Reveal>
          <Reveal>
            <Link href={localePath("/portfolio")}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-300 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5">
              {r.viewAll}
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Layout : 1 featured grand + stack à droite */}
        <div className="mt-14 grid gap-7 lg:grid-cols-12">

          {/* ── Projet phare ── */}
          <Reveal className="lg:col-span-7">
            <Link
              href={featured.url ?? localePath("/portfolio")}
              target={featured.url ? "_blank" : "_self"}
              rel={featured.url ? "noopener noreferrer" : undefined}
              className="group lift-xl relative flex h-full flex-col overflow-hidden rounded-3xl shadow-2xl shadow-brand-900/12"
            >
              {/* Image de couverture */}
              <div className="relative h-72 overflow-hidden sm:h-80">
                <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
                {featuredImg && (
                  <Image
                    src={featuredImg}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ zIndex: 1 }}
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" style={{ zIndex: 2 }} />

                {/* Logo du projet phare — occupe tout l'espace de la couverture */}
                {featured.logo ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8" style={{ zIndex: 2 }}>
                    <div className="relative h-36 w-[78%] max-w-sm overflow-hidden rounded-2xl bg-white/92 p-5 shadow-2xl ring-1 ring-white/50 backdrop-blur sm:h-40">
                      <Image
                        src={featured.logo}
                        alt={`Logo ${featured.title}`}
                        fill
                        sizes="(max-width:1024px) 70vw, 400px"
                        className="object-contain p-3"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="absolute inset-0 flex items-start justify-between p-6" style={{ zIndex: 3 }}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-brand-700 shadow-lg">
                    <span className="size-2 rounded-full bg-brand-500 glow-pulse" />
                    {r.featuredLabel}
                  </span>
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30">
                    <Featured className="size-7 text-white drop-shadow" />
                  </span>
                </div>
                {featured.url && (
                  <div className="absolute bottom-4 right-5 z-[3] flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                )}
              </div>

              {/* Corps texte */}
              <div className={`relative flex flex-1 flex-col bg-gradient-to-br ${featured.gradient} p-7 sm:p-8`}>
                <div aria-hidden className="absolute inset-0 bg-grid opacity-10" />
                <div className="relative">
                  {featured.client && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{featured.client}</p>
                  )}
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{featured.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/88 line-clamp-3">{featured.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {featured.tags.map(t => (
                      <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-5">
                    <div>
                      <p className="text-base font-extrabold text-white">{featured.result}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">{featured.category}</p>
                    </div>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg transition-transform group-hover:translate-x-1 group-hover:shadow-xl">
                      <IconArrowRight className="size-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* ── Stack secondaire ── */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {rest.map((p, i) => {
              const Icon = ICONS[p.iconKey] ?? IconCode;
              const img = PROJECT_IMAGES[p.title];
              return (
                <Reveal key={p.title} delay={(i + 1) * 100}>
                  <Link
                    href={p.url ?? localePath("/portfolio")}
                    target={p.url ? "_blank" : "_self"}
                    rel={p.url ? "noopener noreferrer" : undefined}
                    className="group lift-xl flex items-stretch overflow-hidden rounded-3xl border border-brand-100/80 bg-white shadow-sm transition-all hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
                  >
                    {/* Vignette gauche — logo du projet sur toute la zone */}
                    <div className={`relative w-32 shrink-0 overflow-hidden ${p.logo ? "bg-white dark:bg-white/95" : `bg-gradient-to-br ${p.gradient}`}`}>
                      {p.logo ? (
                        <Image src={p.logo} alt={`Logo ${p.title}`} fill sizes="128px"
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          style={{ zIndex: 1 }} />
                      ) : (
                        <>
                          {img && (
                            <Image src={img} alt={p.title} fill sizes="128px"
                              className="object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                              style={{ zIndex: 1 }} />
                          )}
                          <div aria-hidden className="absolute inset-0 bg-black/25" style={{ zIndex: 2 }} />
                          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
                            <div className="flex size-13 items-center justify-center rounded-xl bg-white/20 backdrop-blur ring-1 ring-white/30 shadow-md">
                              <Icon className="size-7 text-white drop-shadow-md" />
                            </div>
                          </div>
                        </>
                      )}
                      {/* Badge numéro */}
                      <div className="absolute left-2 top-2 z-[4] flex size-7 items-center justify-center rounded-full bg-white/95 text-[11px] font-extrabold text-brand-700 shadow ring-1 ring-brand-100">
                        {String(i + 2).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Corps */}
                    <div className="flex flex-1 flex-col justify-center gap-1 p-5">
                      {p.client && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{p.client}</p>
                      )}
                      <h3 className="text-base font-extrabold leading-tight text-brand-900 dark:text-white sm:text-lg">{p.title}</h3>
                      <p className="text-xs text-muted">{p.category}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-300">
                        {p.result}
                        <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map(t => (
                          <li key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600 dark:bg-white/5 dark:text-brand-300">{t}</li>
                        ))}
                      </ul>
                    </div>
                    <span aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${p.gradient} opacity-60`} />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
