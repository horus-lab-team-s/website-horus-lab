"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconArrowRight, IconMail, IconPhone, IconPin } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    <section id="contact" className="relative overflow-hidden py-14 sm:py-16">

      {/* ── Fond sobre : dégradé + grille + halos discrets ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sky/5 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
        <div className="absolute inset-0 bg-grid-soft opacity-[0.4] dark:opacity-[0.2]" />
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-200/25 blur-3xl dark:bg-brand-700/10" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky/15 blur-3xl dark:bg-sky/8" />
      </div>

      {/* ── Contenu ── */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">

        {/* Coordonnées */}
        <Reveal className="flex flex-col justify-center">
          <ul className="space-y-3">
            {[
              { href: `mailto:${f.email}`,                                icon: IconMail,  label: "Email",        val: f.email },
              { href: `tel:${f.phones[0]?.replace(/\s/g, "")}`,          icon: IconPhone, label: "Téléphone",    val: f.phones.join(" · ") },
              { href: "#",                                                  icon: IconPin,   label: "Localisation", val: f.location },
            ].map(({ href, icon: Icon, label, val }) => (
              <li key={label}>
                <a href={href}
                  className="group flex items-center gap-4 bg-white/80 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 transition-all group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
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
            className="relative overflow-hidden bg-white p-6 shadow-2xl shadow-brand-900/8 dark:bg-slate-900 sm:p-8">
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
              <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {c.success}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {c.error}
              </p>
            )}
            {status === "invalid" && (
              <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                {c.invalid}
              </p>
            )}
          </form>
        </Reveal>

        </div>
      </div>
    </section>
  );
}

const cls =
  "w-full rounded-md border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10";

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
