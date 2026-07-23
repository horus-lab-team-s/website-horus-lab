"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";
import { IconArrowRight } from "@/components/icons";

type Testi = {
  quote: string;
  name: string;
  role: string;
  image: string;
  /** true = logo institutionnel (affiché sur pastille blanche) plutôt qu'une photo */
  logo?: boolean;
};

/* Témoignages réels — promotrices & partenaires qui utilisent nos solutions.
   (Contenu ajustable ensuite dans l'admin / ce fichier.) */
const TESTI: Record<"fr" | "en", Testi[]> = {
  fr: [
    {
      quote:
        "Horus-Lab a digitalisé notre centre de formation avec un vrai sens du détail. Une plateforme claire, fiable et pensée pour nos apprenants, du début à la fin.",
      name: "Paule Diane Himsta",
      role: "Présidente Directrice · Broad Range Consulting (CFP-BRC)",
      image: "/Temoignages/Mme-paul-diane-himsta.png",
    },
    {
      quote:
        "Nos outils de gestion sont enfin à la hauteur de nos ambitions. Une équipe sérieuse, disponible, et un accompagnement impeccable à chaque étape.",
      name: "Paule Diane Himsta",
      role: "Présidente Directrice · CGA Broad Range Consulting",
      image: "/Temoignages/Mme-paul-diane-himsta.png",
    },
    {
      quote:
        "Notre boutique en ligne Afrikamode est fluide, rapide et fidèle à notre image. Horus-Lab a traduit notre univers mode en une vraie expérience e-commerce africaine.",
      name: "Pagop Tchouansi Aurélie",
      role: "Responsable · AfrikaMode",
      image: "/Temoignages/Mme-pagop-Tchouansi-aurelie.png",
    },
    {
      quote:
        "Avec Elec One et EnMKit, Horus-Lab a transformé notre vision en une application mobile concrète : nos utilisateurs pilotent et réduisent leur consommation d'électricité à distance. Un travail remarquable.",
      name: "Dr Agnès Virginie TJAHE",
      role: "Présidente Directrice · 2MeTech Sarl",
      image: "/Temoignages/Dr-Agnes-Virgine-TJAHE.png",
    },
    {
      quote:
        "Un accompagnement technique de qualité pour notre département informatique : rigueur, pédagogie et des solutions adaptées à nos réalités académiques.",
      name: "Département Informatique",
      role: "IUT-FV de Bandjoun · Université de Dschang",
      image: "/Temoignages/iut-fv-university-of-dschang.jpg",
      logo: true,
    },
  ],
  en: [
    {
      quote:
        "Horus-Lab digitalised our training centre with a real eye for detail. A clear, reliable platform built for our learners, from start to finish.",
      name: "Paule Diane Himsta",
      role: "Managing Director · Broad Range Consulting (CFP-BRC)",
      image: "/Temoignages/Mme-paul-diane-himsta.png",
    },
    {
      quote:
        "Our management tools finally match our ambitions. A serious, available team, with flawless support at every step.",
      name: "Paule Diane Himsta",
      role: "Managing Director · CGA Broad Range Consulting",
      image: "/Temoignages/Mme-paul-diane-himsta.png",
    },
    {
      quote:
        "Our Afrikamode online store is smooth, fast and true to our brand. Horus-Lab turned our fashion universe into a real African e-commerce experience.",
      name: "Pagop Tchouansi Aurélie",
      role: "Manager · AfrikaMode",
      image: "/Temoignages/Mme-pagop-Tchouansi-aurelie.png",
    },
    {
      quote:
        "With Elec One and EnMKit, Horus-Lab turned our vision into a real mobile app: our users control and reduce their electricity consumption remotely. Remarkable work.",
      name: "Dr Agnès Virginie TJAHE",
      role: "Managing Director · 2MeTech Sarl",
      image: "/Temoignages/Dr-Agnes-Virgine-TJAHE.png",
    },
    {
      quote:
        "Quality technical support for our computer science department: rigour, teaching skill and solutions tailored to our academic realities.",
      name: "Computer Science Dept.",
      role: "IUT-FV Bandjoun · University of Dschang",
      image: "/Temoignages/iut-fv-university-of-dschang.jpg",
      logo: true,
    },
  ],
};

export function Testimonials({ items }: { items?: Testi[] }) {
  const { dict, lang } = useLang();
  const t = dict.testimonials;
  // Piloté par l'admin (CMS) si des témoignages existent ; sinon repli statique.
  const list = items && items.length ? items : TESTI[lang === "en" ? "en" : "fr"];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + list.length) % list.length),
    [list.length],
  );

  // Défilement automatique (pause au survol + respect de prefers-reduced-motion).
  // L'intervalle se relance quand `paused` change : pas de ref lue pendant le rendu.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 6000);
    return () => clearInterval(id);
  }, [paused, list.length]);

  const active = list[index];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-brand-900 py-14 sm:py-16"
    >
      {/* Fond sobre : halos + logo Horus en filigrane */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-500/12 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/8 blur-3xl" />
        <Image
          src="/logo/logo-dark-bg-full.png"
          alt=""
          width={520}
          height={520}
          className="absolute -right-10 top-1/2 hidden w-[460px] -translate-y-1/2 opacity-[0.10] lg:block"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* En-tête centré unifié */}
        <SectionHeading eyebrow={t.eyebrow} title={t.title} light />

        {/* Carrousel */}
        <Reveal className="mt-10">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <figure className="relative overflow-hidden bg-white/5 p-6 backdrop-blur-sm sm:p-9">
              {/* Guillemet décoratif */}
              <span aria-hidden
                className="pointer-events-none absolute right-4 top-0 select-none text-[120px] leading-none font-extrabold text-white/[0.06]">
                &rdquo;
              </span>

              <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
                {/* Média (photo ou logo) — carré, coins légers */}
                <div className="shrink-0">
                  <div className={`relative size-24 overflow-hidden rounded-md ring-2 ring-white/15 sm:size-28 ${active.logo ? "bg-white p-2" : ""}`}>
                    <Image
                      key={active.image}
                      src={active.image}
                      alt={active.name}
                      fill
                      sizes="112px"
                      className={active.logo ? "object-contain" : "object-cover"}
                    />
                  </div>
                </div>

                {/* Texte */}
                <div className="min-w-0">
                  {/* Étoiles */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, k) => (
                      <svg key={k} viewBox="0 0 20 20" fill="currentColor" className="size-4 text-amber-400">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="mt-4 text-base font-medium leading-relaxed text-white sm:text-lg">
                    {active.quote}
                  </blockquote>

                  <figcaption className="mt-5 border-t border-white/10 pt-4">
                    <div className="text-base font-bold text-white">{active.name}</div>
                    <div className="text-sm text-brand-300">{active.role}</div>
                  </figcaption>
                </div>
              </div>
            </figure>

            {/* Contrôles : miniatures + flèches */}
            <div className="mt-5 flex items-center justify-between gap-4">
              {/* Miniatures (photos) qui servent de navigation */}
              <div className="flex flex-wrap items-center gap-2">
                {list.map((it, i) => (
                  <button
                    key={`${it.name}-${i}`}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={it.name}
                    aria-current={i === index}
                    className={`relative size-10 overflow-hidden rounded-md ring-2 transition-all ${
                      i === index ? "ring-sky scale-105" : "ring-white/15 opacity-60 hover:opacity-100"
                    } ${it.logo ? "bg-white p-1" : ""}`}
                  >
                    <Image src={it.image} alt="" fill sizes="40px"
                      className={it.logo ? "object-contain" : "object-cover"} />
                  </button>
                ))}
              </div>

              {/* Flèches carrées */}
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => go(-1)} aria-label={lang === "fr" ? "Précédent" : "Previous"}
                  className="grid size-10 place-items-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10">
                  <IconArrowRight className="size-5 rotate-180" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label={lang === "fr" ? "Suivant" : "Next"}
                  className="grid size-10 place-items-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10">
                  <IconArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
