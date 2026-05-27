"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconMail } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const { dict } = useLang();
  const n = dict.newsletter;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const website = String(fd.get("website") ?? "");

    if (!emailRe.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-surface px-5 pb-20 sm:px-8 sm:pb-28">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50 p-8 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:p-12">
          {/* Décor animé */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-sky/20 blur-3xl animate-float-slow"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-12 size-44 rounded-full bg-brand-400/15 blur-3xl animate-drift"
          />

          {/* Tracé décoratif */}
          <svg
            aria-hidden
            viewBox="0 0 600 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-8 bottom-8 hidden h-14 text-brand-200 opacity-50 sm:block dark:text-brand-700/30"
          >
            <path
              d="M0 30 H120 L150 10 H300 L330 30 H460 L490 50 H600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="120" cy="30" r="2.5" fill="currentColor" />
            <circle cx="300" cy="10" r="2.5" fill="currentColor" />
            <circle cx="460" cy="30" r="2.5" fill="currentColor" />
          </svg>

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/25">
                <IconMail className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-brand-900 dark:text-white sm:text-3xl">
                {n.title}
              </h2>
              <p className="mt-3 text-muted">{n.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot anti-spam */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" hidden>
                <label>
                  Website
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="email"
                  type="email"
                  required
                  aria-label="Email"
                  placeholder={n.placeholder}
                  className="w-full rounded-full border border-brand-100 bg-white px-5 py-3.5 text-sm text-ink outline-none transition-all placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 hover:shadow-xl hover:shadow-brand-700/40 disabled:opacity-60"
                >
                  {status === "sending" ? n.sending : n.button}
                  {status !== "sending" && (
                    <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </div>
              {status === "success" && (
                <p className="mt-3 text-sm font-medium text-green-700">{n.success}</p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm font-medium text-red-700">{n.error}</p>
              )}
              {status === "invalid" && (
                <p className="mt-3 text-sm font-medium text-amber-700">{n.invalid}</p>
              )}
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
