"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconMail, IconPhone, IconPin } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Formes géométriques supplémentaires (ronds, carrés, triangles, trapèzes) ── */
const EXTRA_SHAPES = [
  /* Rond */        { el:"circle",   x:"6%",  y:"12%", sz:52, d:"0s",   dur:"10s" },
  /* Carré */       { el:"rect",     x:"88%", y:"8%",  sz:40, d:"1.3s", dur:"9s"  },
  /* Triangle */    { el:"polygon",  x:"15%", y:"72%", sz:44, d:"0.6s", dur:"11s" },
  /* Trapèze */     { el:"trapeze",  x:"80%", y:"68%", sz:48, d:"2s",   dur:"8s"  },
  /* Rond */        { el:"circle",   x:"50%", y:"5%",  sz:30, d:"1.5s", dur:"9s"  },
  /* Carré rotatif*/{ el:"rect-rot", x:"92%", y:"42%", sz:34, d:"0.4s", dur:"10s" },
  /* Triangle inv */{ el:"tri-inv",  x:"3%",  y:"50%", sz:38, d:"2.4s", dur:"8s"  },
  /* Losange */     { el:"diamond",  x:"70%", y:"88%", sz:36, d:"0.8s", dur:"11s" },
  /* Rond double */ { el:"dbl-circle",x:"35%",y:"90%", sz:42, d:"1.9s", dur:"9s"  },
  /* Hexagone */    { el:"hex",      x:"60%", y:"20%", sz:40, d:"0.2s", dur:"10s" },
  /* Octogone */    { el:"octo",     x:"25%", y:"35%", sz:36, d:"1.1s", dur:"8s"  },
  /* Carré */       { el:"rect",     x:"77%", y:"32%", sz:28, d:"2.7s", dur:"9s"  },
];

function ShapeSVG({ el, sz }: { el: string; sz: number }) {
  const sw = "1.1";
  const base = { width:sz, height:sz, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:sw };
  switch (el) {
    case "circle":     return <svg {...base}><circle cx="12" cy="12" r="9"/></svg>;
    case "rect":       return <svg {...base}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
    case "rect-rot":   return <svg {...base}><rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(15 12 12)"/></svg>;
    case "polygon":    return <svg {...base}><polygon points="12,3 22,21 2,21"/></svg>;
    case "tri-inv":    return <svg {...base}><polygon points="2,3 22,3 12,21"/></svg>;
    case "trapeze":    return <svg {...base}><polygon points="5,18 19,18 22,6 2,6"/></svg>;
    case "diamond":    return <svg {...base}><polygon points="12,2 22,12 12,22 2,12"/></svg>;
    case "dbl-circle": return <svg {...base}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>;
    case "hex":        return <svg {...base}><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>;
    case "octo":       return <svg {...base}><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7"/></svg>;
    default:           return <svg {...base}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

export function ServiceContactSection({ gradient }: { gradient: string }) {
  const { dict } = useLang();
  const c = dict.contactForm;
  const f = dict.footer;
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || !data.message?.trim() || !emailRe.test(data.email ?? "")) {
      setStatus("invalid"); return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success"); form.reset();
    } catch { setStatus("error"); }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-20 sm:py-28">
      {/* ── Fond de base (existant) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sky/5 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
        <div className="absolute inset-0 bg-grid-soft opacity-[0.5] dark:opacity-[0.3]" />
        {/* Orbes existantes */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl animate-float-slow dark:bg-brand-700/10" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky/20 blur-3xl animate-drift dark:bg-sky/8" />
        <div className="absolute right-1/3 top-1/4 h-64 w-64 rounded-full bg-violet-100/30 blur-2xl animate-float dark:bg-violet-900/8" style={{ animationDelay:"1.5s" }} />
        {/* Radar (existant) */}
        <svg aria-hidden viewBox="0 0 1200 600" preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-brand-300/15 dark:text-brand-600/12">
          <circle cx="120" cy="300" r="60"  fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="120" cy="300" r="110" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 6" />
          <circle cx="120" cy="300" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="120" cy="300" r="4"   fill="currentColor" />
          <path d="M200 100 H400 L450 60 H650 L700 100 H900" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M200 500 H380 L430 460 H620 L670 500 H850" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </svg>

        {/* ── Formes géométriques supplémentaires ── */}
        {EXTRA_SHAPES.map((s, i) => (
          <div key={i} aria-hidden
            className="pointer-events-none absolute animate-float text-brand-400/[0.12] dark:text-brand-300/[0.10]"
            style={{ left:s.x, top:s.y, animationDelay:s.d, animationDuration:s.dur }}
          >
            <ShapeSVG el={s.el} sz={s.sz} />
          </div>
        ))}

        {/* Particules ponctuelles */}
        {[
          { x:"18%",y:"15%",d:"0s"   },{ x:"70%",y:"8%",d:"1.3s" },
          { x:"40%",y:"85%",d:"0.7s" },{ x:"85%",y:"70%",d:"2s"  },
          { x:"55%",y:"35%",d:"1.8s" },{ x:"22%",y:"55%",d:"0.5s"},
          { x:"66%",y:"48%",d:"2.2s" },
        ].map((p,i) => (
          <div key={i} className="absolute size-2 rounded-full bg-brand-400/25 animate-bob dark:bg-brand-400/15"
            style={{ left:p.x, top:p.y, animationDelay:p.d }} />
        ))}
      </div>

      {/* ── Contenu du formulaire ── */}
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">

        {/* Coordonnées */}
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            <span className="h-px w-6 bg-brand-400/60" />
            {c.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
            {c.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{c.subtitle}</p>

          <ul className="mt-10 space-y-3">
            {[
              { href:`mailto:${f.email}`, Icon:IconMail,  label:"Email",        val:f.email },
              { href:`tel:${f.phones[0]?.replace(/\s/g,"")}`, Icon:IconPhone, label:"Téléphone", val:f.phones.join(" · ") },
              { href:"#",                  Icon:IconPin,   label:"Localisation", val:f.location },
            ].map(({ href, Icon, label, val }) => (
              <li key={label}>
                <a href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/80 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-all group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</div>
                    <div className="text-sm font-bold text-brand-900 dark:text-white">{val}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800/40">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            Réponse sous 24h • Disponible pour nouveaux projets
          </div>
        </Reveal>

        {/* Formulaire */}
        <Reveal delay={120}>
          <form onSubmit={handleSubmit} noValidate
            className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl shadow-brand-900/8 dark:border-white/10 dark:bg-slate-900 sm:p-8">
            {/* Bandeau gradient service */}
            <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gradient}`} />
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-100/40 blur-2xl dark:bg-brand-700/15" />

            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={c.name} active={focused==="name"}>
                <input name="name" type="text" required placeholder={c.namePlaceholder}
                  onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} className={cls} />
              </Field>
              <Field label={c.email} active={focused==="email"}>
                <input name="email" type="email" required placeholder={c.emailPlaceholder}
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} className={cls} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.subject} active={focused==="subject"}>
                <input name="subject" type="text" placeholder={c.subjectPlaceholder}
                  onFocus={()=>setFocused("subject")} onBlur={()=>setFocused(null)} className={cls} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.message} active={focused==="message"}>
                <textarea name="message" required rows={5} placeholder={c.messagePlaceholder}
                  onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)} className={`${cls} resize-y`} />
              </Field>
            </div>

            <button type="submit" disabled={status==="sending"}
              className={`group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 sm:w-auto`}>
              {status==="sending" ? c.sending : c.send}
              {status!=="sending" && <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />}
            </button>

            {status==="success" && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">{c.success}</p>}
            {status==="error"   && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{c.error}</p>}
            {status==="invalid" && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{c.invalid}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const cls = "w-full rounded-xl border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10";

function Field({ label, children, active }: { label:string; children:React.ReactNode; active?:boolean }) {
  return (
    <label className="block">
      <span className={`mb-1.5 block text-sm font-semibold transition-colors ${active ? "text-brand-600 dark:text-brand-300" : "text-brand-900 dark:text-white"}`}>
        {label}
      </span>
      {children}
    </label>
  );
}
