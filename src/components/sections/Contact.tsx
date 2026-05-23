"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconMail, IconPhone, IconPin } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { dict } = useLang();
  const c = dict.contactForm;
  const f = dict.footer;
  const [status, setStatus] = useState<Status>("idle");

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
    <section id="contact" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Messaging */}
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">
            {c.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{c.subtitle}</p>

          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${f.email}`}
                className="flex items-center gap-3 font-medium text-brand-900 dark:text-white transition-colors hover:text-brand-600"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                  <IconMail className="size-5" />
                </span>
                {f.email}
              </a>
            </li>
            <li className="flex items-center gap-3 font-medium text-brand-900 dark:text-white">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                <IconPhone className="size-5" />
              </span>
              <span className="flex flex-col">
                {f.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-brand-600"
                  >
                    {phone}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-3 font-medium text-brand-900 dark:text-white">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                <IconPin className="size-5" />
              </span>
              {f.location}
            </li>
          </ul>
        </Reveal>

        {/* Form */}
        <Reveal delay={120}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/5 dark:border-white/10 dark:bg-slate-900 sm:p-8"
          >
            {/* Honeypot anti-spam : invisible pour les humains, ignoré par les lecteurs d'écran. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" hidden>
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={c.name}>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={c.namePlaceholder}
                  className={inputCls}
                />
              </Field>
              <Field label={c.email}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={c.emailPlaceholder}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.subject}>
                <input
                  name="subject"
                  type="text"
                  placeholder={c.subjectPlaceholder}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={c.message}>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={c.messagePlaceholder}
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 disabled:opacity-60 sm:w-auto"
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
  "w-full rounded-xl border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-900 dark:text-white">
        {label}
      </span>
      {children}
    </label>
  );
}
