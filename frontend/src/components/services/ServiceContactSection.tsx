"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

/**
 * Bande d'appel à l'action des pages Service.
 * On ne duplique PLUS le formulaire de contact : un bouton redirige vers la
 * page /contact (source unique, évite les répétitions).
 * On garde id="contact" pour que l'ancre "#contact" du hero fonctionne.
 */
export function ServiceContactSection({ gradient }: { gradient: string }) {
  const { dict, lang, localePath } = useLang();
  const c = dict.cta;
  const f = dict.footer;

  return (
    <section id="contact" className="relative overflow-hidden bg-white px-5 py-14 dark:bg-[#070e1c] sm:px-8 sm:py-20">
      <Reveal className="relative mx-auto max-w-5xl">
        <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${gradient} px-7 py-10 text-center shadow-2xl shadow-brand-900/30 sm:px-16 sm:py-12`}>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.1]" />
          <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-16 size-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">{c.subtitle}</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={localePath("/contact")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-xl shadow-brand-900/30 transition-all hover:scale-[1.04]"
              >
                {c.button}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`mailto:${f.email}`}
                className="inline-flex items-center justify-center rounded-md border border-white/35 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                {lang === "fr" ? "Nous écrire" : "Email us"}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
