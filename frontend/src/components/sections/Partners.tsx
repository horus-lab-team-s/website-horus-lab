"use client";

import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

/* Logos des partenaires — la plupart sont aussi nos clients/témoignages.
   Chaque logo est cliquable et ouvre le site du partenaire. */
const PARTNERS = [
  { name: "Broad Range Consulting · CFP-BRC", src: "/Nos-partenaires/CFP-Broad-Range-Consulting-logo.jpg", href: "https://www.cfp-brcgroup.com/" },
  { name: "CGA Broad Range Consulting", src: "/Nos-partenaires/CGA-Broad-Range-Consulting-logo.jpg", href: "https://www.cga-brcgroup.com/" },
  { name: "2MeTech Sarl", src: "/Nos-partenaires/logo-2MeTech-bgWHITE.png", href: "https://www.2metechsarl.org/" },
  { name: "Afrikamode", src: "/Nos-partenaires/logo-Afrikamode.jpeg", href: "https://www.afrikamode.store/" },
  { name: "IUT-FV de Bandjoun · Université de Dschang", src: "/Nos-partenaires/iut-fv-university-of-dschang.jpg", href: "https://www.univ-dschang.org/iutfv/" },
];

/* Doublé pour un défilement en boucle continue (translateX 0 → -50%). */
const TRACK = [...PARTNERS, ...PARTNERS];

export function Partners() {
  const { lang } = useLang();
  const eyebrow = lang === "fr" ? "Partenaires" : "Partners";
  const title = lang === "fr" ? "Ils nous font confiance" : "Trusted by";

  return (
    <section id="partners" className="relative overflow-hidden bg-surface py-14 sm:py-16">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} />
      </div>

      {/* Bandeau défilant (pause au survol) */}
      <Reveal delay={100} className="mt-9">
        <div className="marquee-mask group relative overflow-hidden">
          <ul className="flex w-max items-center gap-4 animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused]">
            {TRACK.map((p, i) => (
              <li key={`${p.name}-${i}`} className="shrink-0">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.name}
                  aria-label={p.name}
                  className="group/logo flex h-24 w-44 items-center justify-center rounded-md border border-brand-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-white/10 dark:bg-white"
                >
                  <Image
                    src={p.src}
                    alt={p.name}
                    width={180}
                    height={72}
                    className="max-h-14 w-auto object-contain opacity-80 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
