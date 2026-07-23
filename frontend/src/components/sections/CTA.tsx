"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

export function CTA() {
  const { dict, localePath } = useLang();
  const c = dict.cta;

  return (
    <section className="relative overflow-hidden bg-white px-5 py-12 dark:bg-[#070e1c] sm:px-8 sm:py-14">
      <Reveal className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-10 text-center shadow-2xl shadow-brand-900/40 sm:px-16 sm:py-12">

          {/* ── Fond intérieur sobre + logo Horus en filigrane ── */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.1]" />
            <div className="absolute -left-16 -top-16 size-72 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -right-10 -bottom-20 size-80 rounded-full bg-sky/15 blur-3xl" />
            <Image src="/logo/logo-dark-bg-full.png" alt="" width={460} height={460}
              className="absolute -right-8 -bottom-8 w-80 opacity-[0.12]" />
          </div>

          {/* ── Contenu ── */}
          <div className="relative">
            <Reveal>
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <span className="size-1.5 rounded-full bg-sky glow-pulse" />
                Horus-Lab
              </span>
            </Reveal>

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-brand-100/90">{c.subtitle}</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={localePath("/contact")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-xl shadow-brand-900/30 transition-all hover:scale-[1.04] hover:shadow-2xl">
                {c.button}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={localePath("/contact")}
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50">
                {c.secondary}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
