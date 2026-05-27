"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import {
  IconArrowRight,
  IconEye,
  IconMail,
  IconPhone,
  IconPin,
} from "@/components/icons";

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
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-surface py-20 sm:py-28"
    >
      {/* Décor */}
      <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-brand-400/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Coordonnées éditoriales */}
        <Reveal>
          <div className="relative">
            <IconEye
              aria-hidden
              className="eye-watermark -left-8 -top-6 size-[280px]"
            />
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-400/60" />
              {c.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-4xl lg:text-5xl">
              {c.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{c.subtitle}</p>

            <ul className="mt-10 space-y-3">
              <li>
                <a
                  href={`mailto:${f.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                    <IconMail className="size-5" />
                  </span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Email
                    </div>
                    <div className="text-sm font-bold text-brand-900 dark:text-white">
                      {f.email}
                    </div>
                  </div>
                </a>
              </li>
              <li className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                  <IconPhone className="size-5" />
                </span>
                <div className="flex flex-col">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Téléphone
                  </div>
                  {f.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-sm font-bold text-brand-900 transition-colors hover:text-brand-600 dark:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                  <IconPin className="size-5" />
                </span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Localisation
                  </div>
                  <div className="text-sm font-bold text-brand-900 dark:text-white">
                    {f.location}
                  </div>
                </div>
              </li>
            </ul>

            {/* Réponse sous 24h badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 dark:bg-white/5 dark:text-brand-200">
              <span className="size-1.5 rounded-full bg-brand-500 glow-pulse" />
              Réponse sous 24h
            </div>
          </div>
        </Reveal>

        {/* Formulaire */}
        <Reveal delay={120}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/5 dark:border-white/10 dark:bg-slate-900 sm:p-8"
          >
            {/* Bandeau dégradé en haut */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-sky"
            />

            {/* Honeypot anti-spam */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" hidden>
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={c.name} active={focused === "name"}>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={c.namePlaceholder}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className={inputCls}
                />
              </Field>
              <Field label={c.email} active={focused === "email"}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={c.emailPlaceholder}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.subject} active={focused === "subject"}>
                <input
                  name="subject"
                  type="text"
                  placeholder={c.subjectPlaceholder}
                  onFocus={() => setFocused("subject")}
                  onBlur={() => setFocused(null)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.message} active={focused === "message"}>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={c.messagePlaceholder}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 hover:shadow-xl hover:shadow-brand-700/40 disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? c.sending : c.send}
              {status !== "sending" && (
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            {status === "success" && (
              <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {c.success}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {c.error}
              </p>
            )}
            {status === "invalid" && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                {c.invalid}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const inputCls =
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
      <span
        className={`mb-1.5 block text-sm font-semibold transition-colors ${
          active ? "text-brand-600 dark:text-brand-300" : "text-brand-900 dark:text-white"
        }`}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
