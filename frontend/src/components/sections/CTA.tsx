"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

/* Formes géométriques qui remplissent la gauche et la droite */
function FloatingShape({ type, x, y, size, color, delay, opacity }:{
  type: "circle"|"square"|"triangle"|"diamond"; x:string; y:string;
  size:number; color:string; delay:number; opacity:number;
}) {
  const cls = `pointer-events-none absolute animate-float ${color}`;
  const style = { left:x, top:y, animationDelay:`${delay}s`, animationDuration:`${7+delay*2}s`, opacity };

  if (type === "circle")
    return <div className={`${cls} rounded-full`} style={{ ...style, width:size, height:size }} />;
  if (type === "square")
    return <div className={`${cls} rounded-lg`} style={{ ...style, width:size, height:size, transform:`rotate(${delay*20}deg)` }} />;
  if (type === "diamond")
    return <div className={`${cls}`} style={{ ...style, width:size, height:size, transform:`rotate(45deg)` }} />;
  // triangle via border trick
  return (
    <div className={cls} style={{ ...style, width:0, height:0,
      borderLeft:`${size/2}px solid transparent`,
      borderRight:`${size/2}px solid transparent`,
      borderBottom:`${size}px solid currentColor`,
    }} />
  );
}

const LEFT_SHAPES = [
  { type:"circle"   as const, x:"-8%",  y:"10%", size:80,  color:"text-brand-400/25", delay:0,   opacity:1 },
  { type:"square"   as const, x:"2%",   y:"40%", size:48,  color:"text-sky/30",       delay:1.5, opacity:1 },
  { type:"diamond"  as const, x:"-4%",  y:"65%", size:60,  color:"text-brand-300/20", delay:0.8, opacity:1 },
  { type:"circle"   as const, x:"6%",   y:"80%", size:36,  color:"text-white/15",     delay:2.2, opacity:1 },
  { type:"square"   as const, x:"0%",   y:"25%", size:28,  color:"text-brand-500/20", delay:3,   opacity:1 },
  { type:"circle"   as const, x:"4%",   y:"55%", size:20,  color:"text-sky/25",       delay:1,   opacity:1 },
];

const RIGHT_SHAPES = [
  { type:"circle"   as const, x:"92%",  y:"8%",  size:72,  color:"text-sky/25",       delay:0.5, opacity:1 },
  { type:"diamond"  as const, x:"88%",  y:"35%", size:52,  color:"text-brand-400/20", delay:1.8, opacity:1 },
  { type:"square"   as const, x:"94%",  y:"60%", size:40,  color:"text-white/12",     delay:0.3, opacity:1 },
  { type:"circle"   as const, x:"86%",  y:"78%", size:32,  color:"text-brand-300/25", delay:2.5, opacity:1 },
  { type:"circle"   as const, x:"96%",  y:"48%", size:22,  color:"text-sky/20",       delay:1.2, opacity:1 },
  { type:"square"   as const, x:"90%",  y:"90%", size:30,  color:"text-brand-500/15", delay:3.5, opacity:1 },
];

export function CTA() {
  const { dict } = useLang();
  const c = dict.cta;

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 dark:bg-[#070e1c] sm:px-8 sm:py-28">
      {/* Formes flottantes gauche et droite EN DEHORS de la carte */}
      {LEFT_SHAPES.map((s, i)  => <FloatingShape key={`l${i}`} {...s} />)}
      {RIGHT_SHAPES.map((s, i) => <FloatingShape key={`r${i}`} {...s} />)}

      <Reveal className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/40 sm:px-20 sm:py-20">

          {/* ── Fond intérieur très riche ── */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Grille */}
            <div className="absolute inset-0 bg-grid opacity-[0.15]" />

            {/* Formes géométriques intérieures */}
            <div className="absolute -left-16 -top-16 size-72 rounded-full bg-brand-500/25 blur-3xl animate-float-slow" />
            <div className="absolute -right-10 -bottom-20 size-80 rounded-full bg-sky/20 blur-3xl animate-drift" />
            <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/15 blur-2xl animate-float" style={{ animationDelay:"1s" }} />

            {/* Hexagones décoratifs */}
            <svg aria-hidden viewBox="0 0 500 400" className="absolute inset-0 h-full w-full text-white/[0.06]">
              <polygon points="60,20 100,44 100,88 60,112 20,88 20,44" fill="none" stroke="currentColor" strokeWidth="1" />
              <polygon points="420,20 460,44 460,88 420,112 380,88 380,44" fill="none" stroke="currentColor" strokeWidth="1" />
              <polygon points="60,290 100,314 100,358 60,382 20,358 20,314" fill="none" stroke="currentColor" strokeWidth="1" />
              <polygon points="420,290 460,314 460,358 420,382 380,358 380,314" fill="none" stroke="currentColor" strokeWidth="1" />
              <polygon points="240,40 280,64 280,108 240,132 200,108 200,64" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
            </svg>

            {/* Lignes diagonales */}
            <svg aria-hidden viewBox="0 0 800 400" preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full text-white/[0.06]">
              <path d="M0 350 H150 L200 300 H380 L430 350 H600 L650 280 H800" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M0 60 H100 L160 110 H340 L400 60 H580 L640 110 H800" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <circle cx="150" cy="350" r="3" fill="currentColor" />
              <circle cx="380" cy="300" r="3" fill="currentColor" />
              <circle cx="600" cy="350" r="3" fill="currentColor" />
            </svg>

            {/* Particules */}
            {[
              { x:"10%",y:"20%",d:"0s" },{ x:"85%",y:"15%",d:"1.2s" },
              { x:"25%",y:"75%",d:"0.8s" },{ x:"72%",y:"80%",d:"2s" },
              { x:"50%",y:"10%",d:"1.5s" },{ x:"90%",y:"55%",d:"0.3s" },
              { x:"5%", y:"60%",d:"2.5s" },{ x:"60%",y:"45%",d:"1s" },
            ].map((p,i) => (
              <div key={i} className="absolute size-1.5 rounded-full bg-white/30 animate-float"
                style={{ left:p.x, top:p.y, animationDelay:p.d }} />
            ))}
          </div>

          {/* ── Contenu ── */}
          <div className="relative">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <span className="size-1.5 rounded-full bg-sky glow-pulse" />
                Horus-Lab
              </span>
            </Reveal>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100/90">{c.subtitle}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl shadow-brand-900/30 transition-all hover:scale-[1.04] hover:shadow-2xl">
                {c.button}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50">
                {c.secondary}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
