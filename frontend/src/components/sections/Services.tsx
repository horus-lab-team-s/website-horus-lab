"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconCode, IconCog, IconEye, IconSpark } from "@/components/icons";
import { SectionHeading } from "./SectionHeading";

/* Mapping titre → slug de page service */
const SLUG_MAP: Record<string, string> = {
  "Applications sur mesure": "applications",
  "Custom Applications": "applications",
  "Systèmes d'information": "systemes-information",
  "Information Systems": "information-systems",
  "Digitalisation d'entreprise": "digitalisation",
  "Business Digitalisation": "digitalisation",
  "Formation & Audit IT": "formation-audit",
  "Training & IT Audit": "formation-audit",
};

const ICONS = [IconCode, IconEye, IconCog, IconSpark];

/* Accent de couleur par service (icône) — light + dark */
const ICON_BG = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-500",
];

/* Technologies que nous utilisons — logos qui défilent sous les services. */
const STACK = [
  { name: "React", src: "/tech/react.svg" },
  { name: "Next.js", src: "/tech/nextjs.svg" },
  { name: "TypeScript", src: "/tech/typescript.svg" },
  { name: "JavaScript", src: "/tech/javascript.svg" },
  { name: "Python", src: "/tech/python.svg" },
  { name: "Django", src: "/tech/django.svg" },
  { name: "FastAPI", src: "/tech/fastapi.svg" },
  { name: "Flutter", src: "/tech/flutter.svg" },
  { name: "PostgreSQL", src: "/tech/postgresql.svg" },
  { name: "Node.js", src: "/tech/nodejs.svg" },
  { name: "Docker", src: "/tech/docker.svg" },
  { name: "Tailwind", src: "/tech/tailwindcss.svg" },
];
/* Doublé pour une boucle continue (translateX 0 → -50%). */
const STACK_TRACK = [...STACK, ...STACK];

type ServiceItem = { title: string; desc: string; tags: string[] };

export function Services({ items }: { items?: ServiceItem[] }) {
  const { dict, lang, localePath } = useLang();
  const s = { ...dict.services, items: items ?? dict.services.items };
  const stackLabel = lang === "fr" ? "Les technologies que nous utilisons" : "The technologies we build with";

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white pb-12 pt-12 dark:bg-[#070e1c] sm:pb-16 sm:pt-14"
    >
      {/* Fond sobre : grille fine + halos discrets */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-[0.4] dark:opacity-[0.22]" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/15" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky/10 blur-3xl dark:bg-brand-900/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        {/* 4 services sur une seule ligne (desktop) */}
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => {
            const Icon = ICONS[i] ?? IconCode;
            const slug = SLUG_MAP[item.title] ?? "applications";
            return (
              <Reveal key={item.title} delay={i * 70}>
                <Link
                  href={localePath(`/services/${slug}`)}
                  className="group flex h-full flex-col bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/5"
                >
                  <div className={`inline-flex size-11 items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${ICON_BG[i]}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-brand-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted dark:text-brand-200/70 line-clamp-3">
                    {item.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-brand-300">
                    {lang === "fr" ? "Découvrir" : "Explore"}
                    <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Bandeau des technologies (logos qui défilent) */}
        <Reveal delay={120} className="mt-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted">{stackLabel}</p>
          <div className="marquee-mask group relative mt-5 overflow-hidden">
            <ul className="flex w-max items-center gap-10 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
              {STACK_TRACK.map((tech, i) => (
                <li key={`${tech.name}-${i}`} className="flex shrink-0 items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tech.src} alt={tech.name} width={36} height={36} loading="lazy"
                    className="size-9 object-contain" />
                  <span className="text-sm font-semibold text-brand-800 dark:text-brand-100">{tech.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
