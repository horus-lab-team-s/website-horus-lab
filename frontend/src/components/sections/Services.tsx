"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconCode, IconCog, IconEye, IconSpark } from "@/components/icons";
import { Starfield } from "@/components/Starfield";
import { SectionHeading } from "./SectionHeading";

/* Mapping titre → slug de page service */
const SLUG_MAP: Record<string, string> = {
  "Applications sur mesure":   "applications",
  "Custom Applications":       "applications",
  "Systèmes d'information":    "systemes-information",
  "Information Systems":       "information-systems",
  "Digitalisation d'entreprise": "digitalisation",
  "Business Digitalisation":   "digitalisation",
  "Formation & Audit IT":      "formation-audit",
  "Training & IT Audit":       "formation-audit",
};

const ICONS = [IconCode, IconEye, IconCog, IconSpark];

/* Couleurs dominantes par service — light + dark compatibles */
const CARD_THEMES = [
  {
    bg:      "bg-blue-50   dark:bg-blue-950/40",
    border:  "border-blue-200  dark:border-blue-800/50",
    hover:   "hover:border-blue-400 dark:hover:border-blue-600",
    icon:    "bg-blue-600   text-white",
    accent:  "from-blue-600 to-sky-500",
    num:     "text-blue-600/10 dark:text-blue-400/10",
    tag:     "bg-blue-100  text-blue-700  dark:bg-blue-900/50  dark:text-blue-300",
    cta:     "text-blue-600 dark:text-blue-300",
    glow:    "bg-blue-400/20",
  },
  {
    bg:      "bg-violet-50  dark:bg-violet-950/40",
    border:  "border-violet-200 dark:border-violet-800/50",
    hover:   "hover:border-violet-400 dark:hover:border-violet-600",
    icon:    "bg-violet-600  text-white",
    accent:  "from-violet-600 to-purple-500",
    num:     "text-violet-600/10 dark:text-violet-400/10",
    tag:     "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    cta:     "text-violet-600 dark:text-violet-300",
    glow:    "bg-violet-400/20",
  },
  {
    bg:      "bg-emerald-50  dark:bg-emerald-950/40",
    border:  "border-emerald-200 dark:border-emerald-800/50",
    hover:   "hover:border-emerald-400 dark:hover:border-emerald-600",
    icon:    "bg-emerald-600  text-white",
    accent:  "from-emerald-600 to-teal-500",
    num:     "text-emerald-600/10 dark:text-emerald-400/10",
    tag:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    cta:     "text-emerald-600 dark:text-emerald-300",
    glow:    "bg-emerald-400/20",
  },
  {
    bg:      "bg-amber-50   dark:bg-amber-950/40",
    border:  "border-amber-200  dark:border-amber-800/50",
    hover:   "hover:border-amber-400 dark:hover:border-amber-600",
    icon:    "bg-amber-500   text-white",
    accent:  "from-amber-500 to-orange-400",
    num:     "text-amber-500/10 dark:text-amber-400/10",
    tag:     "bg-amber-100  text-amber-700  dark:bg-amber-900/50  dark:text-amber-300",
    cta:     "text-amber-600 dark:text-amber-300",
    glow:    "bg-amber-400/20",
  },
];

/* Spans bento : 1=large gauche, 2=étroit droit, 3=étroit gauche, 4=large droit */
const BENTO = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/* Image Unsplash par service */
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=600&q=70", // code/IDE
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70", // circuit board
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=70", // team meeting
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=70", // training
];

type ServiceItem = { title: string; desc: string; tags: string[] };

export function Services({ items }: { items?: ServiceItem[] }) {
  const { dict, lang, localePath } = useLang();
  const s = { ...dict.services, items: items ?? dict.services.items };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-28"
    >
      {/* ── Champ d'étoiles & astres animés (ambiance spatiale) ── */}
      <Starfield tone="brand" density="light" />

      {/* ── Fond vivant multi-couches ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grille fine */}
        <div className="absolute inset-0 bg-grid-soft opacity-[0.5] dark:opacity-[0.3]" />

        {/* Formes géométriques animées – mode light : teintes pastelles ; dark : teintes profondes */}
        {/* Cercle grand gauche */}
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl animate-float-slow dark:bg-blue-900/20" />
        {/* Cercle milieu haut */}
        <div className="absolute left-1/2 -top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-100/50 blur-3xl animate-drift dark:bg-violet-900/15" style={{ animationDelay: "2s" }} />
        {/* Cercle droite bas */}
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl animate-float dark:bg-emerald-900/15" style={{ animationDelay: "1s" }} />
        {/* Cercle milieu bas */}
        <div className="absolute left-1/3 bottom-1/4 h-56 w-56 rounded-full bg-amber-100/40 blur-2xl animate-bob dark:bg-amber-900/10" style={{ animationDelay: "3s" }} />

        {/* Particules (points) flottantes */}
        {[
          { x: "15%", y: "20%", c: "bg-blue-400",   d: "0s",   s: "size-2" },
          { x: "80%", y: "12%", c: "bg-violet-400", d: "1.2s", s: "size-1.5" },
          { x: "65%", y: "70%", c: "bg-emerald-400",d: "0.8s", s: "size-2.5" },
          { x: "25%", y: "80%", c: "bg-amber-400",  d: "2s",   s: "size-2" },
          { x: "48%", y: "38%", c: "bg-sky-400",    d: "1.5s", s: "size-1.5" },
          { x: "90%", y: "55%", c: "bg-blue-300",   d: "3s",   s: "size-2" },
        ].map((p, i) => (
          <div key={i}
            className={`absolute rounded-full opacity-60 animate-float dark:opacity-40 ${p.c} ${p.s}`}
            style={{ left: p.x, top: p.y, animationDelay: p.d }} />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {s.items.map((item, i) => {
            const Icon    = ICONS[i] ?? IconCode;
            const theme   = CARD_THEMES[i];
            const slug    = SLUG_MAP[item.title] ?? "applications";
            const span    = BENTO[i] ?? "lg:col-span-6";
            const isLarge = span.includes("7");
            const img     = SERVICE_IMAGES[i];

            return (
              <Reveal key={item.title} delay={i * 80} className={span}>
                <Link
                  href={localePath(`/services/${slug}`)}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${theme.bg} ${theme.border} ${theme.hover} ${isLarge ? "min-h-[320px]" : "min-h-[280px]"}`}
                >
                  {/* Image Unsplash de fond – légèrement visible */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-700 dark:opacity-[0.05] dark:group-hover:opacity-[0.09]"
                    style={{ backgroundImage: `url(${img})` }}
                  />

                  {/* Glow au survol */}
                  <div aria-hidden
                    className={`absolute -right-8 -top-8 size-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${theme.glow}`} />

                  {/* Tracé de circuit */}
                  <svg aria-hidden viewBox="0 0 220 80"
                    className="pointer-events-none absolute right-0 top-0 h-20 w-56 text-current opacity-[0.12] group-hover:opacity-[0.25] transition-opacity duration-500">
                    <path d="M0 40 H60 L80 20 H140 L160 40 H220"
                      fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="60"  cy="40" r="2.5" fill="currentColor" />
                    <circle cx="140" cy="20" r="2.5" fill="currentColor" />
                    <circle cx="220" cy="40" r="2.5" fill="currentColor" />
                  </svg>

                  {/* Numéro filigrane */}
                  <span aria-hidden
                    className={`numeral pointer-events-none absolute right-6 top-2 select-none ${theme.num} ${isLarge ? "text-[120px]" : "text-[100px]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-full flex-col p-7 sm:p-9">
                    {/* Icône */}
                    <div className={`inline-flex size-13 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${theme.icon}`}>
                      <Icon className="size-6" />
                    </div>

                    <h3 className={`mt-6 font-extrabold tracking-tight text-brand-900 dark:text-white ${isLarge ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted dark:text-brand-200/70">
                      {item.desc}
                    </p>

                    <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                      {item.tags.map((tag) => (
                        <li key={tag}
                          className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${theme.tag}`}>
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className={`mt-4 flex items-center gap-1.5 text-sm font-bold opacity-0 transition-all duration-300 group-hover:opacity-100 ${theme.cta}`}>
                      {lang === "fr" ? "Découvrir ce service" : "Explore this service"}
                      <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Liseré animé bas */}
                  <span aria-hidden
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${theme.accent} to-transparent transition-transform duration-700 group-hover:scale-x-100`} />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
