"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

/* Vision et mission de l'entreprise (présentation d'octobre 2026), en bandeau
   sobre sur l'accueil, avec un lien vers la page À propos. */
const COPY = {
  fr: {
    eyebrow: "Notre vision",
    quote: "« Voir le continent africain se hisser dans le monde comme le géant qu'il est. »",
    mission:
      "Notre mission : faire grandir l'Afrique à partir de ses propres forces, en mettant l'IA au service de l'élève, de l'agriculteur, de l'entrepreneur et de la communauté, avec des outils accessibles, bilingues et payables par Mobile Money.",
    link: "Notre histoire et nos fondateurs",
  },
  en: {
    eyebrow: "Our vision",
    quote: "“To see the African continent rise in the world as the giant it is.”",
    mission:
      "Our mission: grow Africa from its own strengths by putting AI at the service of the student, the farmer, the entrepreneur and the community, with tools that are accessible, bilingual and payable by Mobile Money.",
    link: "Our story and founders",
  },
};

export function Vision() {
  const { lang, localePath } = useLang();
  const t = COPY[lang];

  return (
    <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <Reveal className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky">{t.eyebrow}</p>
        <blockquote className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
          {t.quote}
        </blockquote>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-100/85">{t.mission}</p>
        <Link href={localePath("/about")}
          className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-white underline-offset-4 hover:underline">
          {t.link}
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
