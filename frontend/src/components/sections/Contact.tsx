"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconMail, IconPhone, IconPin } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Formes géométriques animées */
const GEO_SHAPES = [
  { shape: "circle",   x: "5%",  y: "10%", sz: 48, d: "0s",   dur: "10s" },
  { shape: "square",   x: "91%", y: "6%",  sz: 38, d: "1.4s", dur: "9s"  },
  { shape: "triangle", x: "14%", y: "74%", sz: 42, d: "0.6s", dur: "11s" },
  { shape: "trapeze",  x: "82%", y: "66%", sz: 46, d: "2.1s", dur: "8s"  },
  { shape: "diamond",  x: "48%", y: "4%",  sz: 32, d: "1.6s", dur: "10s" },
  { shape: "hex",      x: "68%", y: "80%", sz: 40, d: "0.3s", dur: "9s"  },
  { shape: "rect-rot", x: "3%",  y: "48%", sz: 30, d: "2.7s", dur: "8s"  },
  { shape: "circle",   x: "95%", y: "40%", sz: 26, d: "0.9s", dur: "11s" },
  { shape: "octo",     x: "32%", y: "88%", sz: 36, d: "1.2s", dur: "9s"  },
  { shape: "tri-inv",  x: "78%", y: "22%", sz: 34, d: "2.3s", dur: "10s" },
  { shape: "diamond",  x: "58%", y: "58%", sz: 28, d: "1.9s", dur: "8s"  },
  { shape: "circle",   x: "22%", y: "38%", sz: 22, d: "0.5s", dur: "11s" },
] as const;

function GeoShape({ shape, sz }: { shape: string; sz: number }) {
  const p = { width: sz, height: sz, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.1" } as const;
  if (shape === "circle")   return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  if (shape === "square")   return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
  if (shape === "triangle") return <svg {...p}><polygon points="12,3 22,21 2,21"/></svg>;
  if (shape === "trapeze")  return <svg {...p}><polygon points="5,18 19,18 22,6 2,6"/></svg>;
  if (shape === "diamond")  return <svg {...p}><polygon points="12,2 22,12 12,22 2,12"/></svg>;
  if (shape === "hex")      return <svg {...p}><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>;
  if (shape === "rect-rot") return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(20 12 12)"/></svg>;
  if (shape === "octo")     return <svg {...p}><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7"/></svg>;
  if (shape === "tri-inv")  return <svg {...p}><polygon points="2,3 22,3 12,21"/></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
}

export function Contact() {
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
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-20 sm:py-28">

      {/* ── Fond complet ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base dégradée */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sky/5 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
        {/* Grille */}
        <div className="absolute inset-0 bg-grid-soft opacity-[0.6] dark:opacity-[0.3]" />
        {/* Orbes */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl animate-float-slow dark:bg-brand-700/10" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky/20 blur-3xl animate-drift dark:bg-sky/8" />
        <div className="absolute right-1/3 top-1/4 h-64 w-64 rounded-full bg-violet-100/30 blur-2xl animate-float dark:bg-violet-900/8" style={{ animationDelay: "1.5s" }} />
        {/* Radar SVG */}
        <svg aria-hidden viewBox="0 0 1200 600" preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-brand-300/20 dark:text-brand-600/15">
          <circle cx="120" cy="300" r="60"  fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="120" cy="300" r="110" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 6" />
          <circle cx="120" cy="300" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="120" cy="300" r="4"   fill="currentColor" />
          <path d="M200 100 H400 L450 60 H650 L700 100 H900" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M200 500 H380 L430 460 H620 L670 500 H850" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {[400, 650, 900].map((x, k) => (
            <circle key={k} cx={x} cy={k % 2 === 0 ? 60 : 100} r="2.5" fill="currentColor" />
          ))}
        </svg>
        {/* Particules */}
        {[
          { x: "18%", y: "15%", d: "0s"   },
          { x: "70%", y: "8%",  d: "1.3s" },
          { x: "40%", y: "85%", d: "0.7s" },
          { x: "85%", y: "70%", d: "2s"   },
          { x: "55%", y: "35%", d: "1.8s" },
        ].map((p, i) => (
          <div key={i}
            className="absolute size-2 rounded-full bg-brand-400/30 animate-bob dark:bg-brand-400/20"
            style={{ left: p.x, top: p.y, animationDelay: p.d }}
          />
        ))}
        {/* Formes géométriques animées */}
        {GEO_SHAPES.map((s, i) => (
          <div key={`gs-${i}`}
            className="pointer-events-none absolute animate-float text-brand-400/[0.12] dark:text-brand-300/[0.09]"
            style={{ left: s.x, top: s.y, animationDelay: s.d, animationDuration: s.dur }}
          >
            <GeoShape shape={s.shape} sz={s.sz} />
          </div>
        ))}
      </div>

      {/* ── Contenu ── */}
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
              { href: `mailto:${f.email}`,                                icon: IconMail,  label: "Email",        val: f.email },
              { href: `tel:${f.phones[0]?.replace(/\s/g, "")}`,          icon: IconPhone, label: "Téléphone",    val: f.phones.join(" · ") },
              { href: "#",                                                  icon: IconPin,   label: "Localisation", val: f.location },
            ].map(({ href, icon: Icon, label, val }) => (
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
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-sky" />
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-100/40 blur-2xl dark:bg-brand-700/15" />
            {/* Honeypot */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={c.name} active={focused === "name"}>
                <input name="name" type="text" required placeholder={c.namePlaceholder}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} className={cls} />
              </Field>
              <Field label={c.email} active={focused === "email"}>
                <input name="email" type="email" required placeholder={c.emailPlaceholder}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} className={cls} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.subject} active={focused === "subject"}>
                <input name="subject" type="text" placeholder={c.subjectPlaceholder}
                  onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)} className={cls} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.message} active={focused === "message"}>
                <textarea name="message" required rows={5} placeholder={c.messagePlaceholder}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  className={`${cls} resize-y`} />
              </Field>
            </div>

            <button type="submit" disabled={status === "sending"}
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/30 transition-all hover:from-brand-800 hover:to-brand-700 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 sm:w-auto">
              {status === "sending" ? c.sending : c.send}
              {status !== "sending" && (
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            {status === "success" && (
              <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {c.success}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {c.error}
              </p>
            )}
            {status === "invalid" && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                {c.invalid}
              </p>
            )}
          </form>
        </Reveal>

      </div>
    </section>
  );
}

const cls =
  "w-full rounded-xl border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10";

function Field({
  label,
  children,
  active,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <label className="block">
      <span className={`mb-1.5 block text-sm font-semibold transition-colors ${
        active ? "text-brand-600 dark:text-brand-300" : "text-brand-900 dark:text-white"
      }`}>
        {label}
      </span>
      {children}
    </label>
  );
}
