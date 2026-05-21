"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error" | "invalid";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const { dict } = useLang();
  const n = dict.newsletter;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");

    if (!emailRe.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-sky/20 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
                {n.title}
              </h2>
              <p className="mt-3 text-muted">{n.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="email"
                  type="email"
                  required
                  aria-label="Email"
                  placeholder={n.placeholder}
                  className="w-full rounded-full border border-brand-100 bg-white px-5 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 disabled:opacity-60"
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
