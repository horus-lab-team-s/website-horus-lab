import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { HeroBackground } from "@/components/sections/HeroBackground";
import {
  IconArrowRight,
  IconCheck,
  IconCog,
  IconEye,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconSpark,
  IconWhatsApp,
} from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";
import { getCmsTeam } from "@/lib/cms";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

/* ── Équipe statique (les co-fondateurs) ── */
const TEAM_MEMBERS = {
  fr: [
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Architecte logiciel · Co-fondateur",
      bio: "Architecte logiciel et ingénieur senior. J'assemble des applications web et mobiles robustes — APIs REST, cloud, méthodes RUP & UML — pensées pour durer et passer à l'échelle. Lauréat du Prix du Meilleur Projet de Fin d'Études, IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/A-propos/photo-Edwin-co-founder.png",
      linkedin: "",
      github: "https://github.com/EdwinTchakounte",
      email: "tchambaedwin@gmail.com",
      whatsapp: "https://wa.me/237673398046",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
      badge: "Co-fondateur",
    },
    {
      name: "Loïc DJIMGOU TONBA",
      role: "Ingénieur logiciel · Co-fondateur",
      bio: "Ingénieur full-stack et entrepreneur, je transforme des idées en produits numériques qui marchent — du web au mobile, du concept au déploiement. Je pilote la vision produit de Horus-Lab pour des clients africains et internationaux, convaincu que la tech est un vrai levier de croissance pour le continent.",
      initials: "LT",
      photo: "/A-propos/photo-loic-tonba-cofounder.png",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      github: "https://github.com/LoicTonba",
      email: "tonbaloic@gmail.com",
      whatsapp: "https://wa.me/237699173771",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Co-fondateur",
    },
  ],
  en: [
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Software architect · Co-founder",
      bio: "Software architect and senior engineer. I build robust web and mobile applications — REST APIs, cloud, RUP & UML methods — designed to last and scale. Winner of the Best Final Year Project Award, IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/A-propos/photo-Edwin-co-founder.png",
      linkedin: "",
      github: "https://github.com/EdwinTchakounte",
      email: "tchambaedwin@gmail.com",
      whatsapp: "https://wa.me/237673398046",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
      badge: "Co-founder",
    },
    {
      name: "Loïc DJIMGOU TONBA",
      role: "Software engineer · Co-founder",
      bio: "Full-stack engineer and entrepreneur, I turn ideas into digital products that ship — web and mobile, from concept to deployment. I lead Horus-Lab's product vision for African and international clients, convinced that technology is a real growth engine for the continent.",
      initials: "LT",
      photo: "/A-propos/photo-loic-tonba-cofounder.png",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      github: "https://github.com/LoicTonba",
      email: "tonbaloic@gmail.com",
      whatsapp: "https://wa.me/237699173771",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Co-founder",
    },
  ],
};

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; intro: string;
  pillars: { h: string; body: string }[];
  valuesTitle: string; valuesSubtitle: string;
  values: { title: string; desc: string }[];
  storyTitle: string; story: string[];
  teamTitle: string; teamSubtitle: string;
  ctaTitle: string; ctaButton: string;
  stats: { value: string; label: string }[];
}> = {
  fr: {
    eyebrow: "À propos",
    title: "Au-delà des frontières, au service de votre impact",
    intro: "Horus-Lab est une entreprise technologique africaine. Nous concevons des produits numériques : applications web & mobile, logiciels sur-mesure, systèmes d'information et solutions de digitalisation, pensés pour les réalités du continent et construits pour durer.",
    pillars: [
      { h: "Notre mission", body: "Rendre la technologie de pointe accessible et utile aux organisations africaines, en les accompagnant de l'idée jusqu'à l'impact." },
      { h: "Notre vision",  body: "Une Afrique qui construit ses propres solutions numériques, à la hauteur des standards mondiaux, et au-delà des frontières." },
    ],
    valuesTitle: "Nos valeurs",
    valuesSubtitle: "Ce qui guide chacune de nos décisions et de nos lignes de code.",
    values: [
      { title: "Excellence technique",    desc: "Des solutions robustes, performantes et maintenables, sans compromis sur la qualité." },
      { title: "Proximité & écoute",      desc: "Nous travaillons avec vous, pas seulement pour vous : transparence et disponibilité à chaque étape." },
      { title: "Innovation utile",        desc: "La bonne technologie au service d'un problème réel, jamais l'inverse." },
      { title: "Impact durable",          desc: "Nous construisons pour durer : code pérenne, documentation complète et transfert de compétences." },
    ],
    storyTitle: "Notre approche",
    story: [
      "Née de la conviction que l'Afrique a tout pour devenir un acteur majeur du numérique mondial, Horus-Lab réunit des ingénieurs pluridisciplinaires autour d'une exigence commune : livrer des produits qui comptent.",
      "Nous avançons par incréments, en livrant de la valeur tôt et souvent, et en gardant nos clients aux commandes à chaque étape du projet.",
    ],
    teamTitle: "L'équipe fondatrice",
    teamSubtitle: "Les ingénieurs qui conçoivent et livrent vos produits.",
    ctaTitle: "Construisons quelque chose de durable ensemble.",
    ctaButton: "Démarrer un projet",
    stats: [
      { value: "5",   label: "projets livrés" },
      { value: "4",   label: "pôles d'expertise" },
      { value: "8+",  label: "secteurs servis" },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Beyond borders, in service of your impact",
    intro: "Horus-Lab is an African technology company. We build digital products: web & mobile apps, custom software, information systems and digitalisation solutions, designed for the realities of the continent and built to last.",
    pillars: [
      { h: "Our mission", body: "Make leading-edge technology accessible and useful to African organizations, guiding them from idea to impact." },
      { h: "Our vision",  body: "An Africa that builds its own digital solutions, matching world-class standards, and reaching beyond borders." },
    ],
    valuesTitle: "Our values",
    valuesSubtitle: "What guides every decision and every line of code.",
    values: [
      { title: "Technical excellence", desc: "Robust, performant and maintainable solutions, with no compromise on quality." },
      { title: "Closeness & listening", desc: "We work with you, not just for you: transparency and availability at every step." },
      { title: "Useful innovation",    desc: "The right technology for a real problem, never the other way around." },
      { title: "Lasting impact",       desc: "We build to last: durable code, complete documentation and skills transfer." },
    ],
    storyTitle: "Our approach",
    story: [
      "Born from the belief that Africa has everything it takes to become a major global digital player, Horus-Lab brings together cross-functional engineers around one shared standard: shipping products that matter.",
      "We move in increments, delivering value early and often, and keeping our clients in control at every step.",
    ],
    teamTitle: "The founding team",
    teamSubtitle: "The engineers who design and ship your products.",
    ctaTitle: "Let's build something lasting together.",
    ctaButton: "Start a project",
    stats: [
      { value: "5",  label: "projects delivered" },
      { value: "4",  label: "areas of expertise" },
      { value: "8+", label: "industries served" },
    ],
  },
};

const VALUE_ICONS = [IconCog, IconEye, IconSpark, IconCheck];
const VALUE_COLORS = ["from-brand-700 to-brand-500","from-sky to-brand-400","from-brand-600 to-sky","from-brand-500 to-brand-300"];

/* Dégradés de repli pour les cartes d'équipe venues du CMS (par position). */
const TEAM_GRADIENTS = ["from-brand-700 via-brand-500 to-sky", "from-slate-800 via-brand-700 to-amber-500"];

/** Initiales = 1re lettre du prénom + 1re lettre du dernier mot du nom. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

type TeamCard = {
  name: string; role: string; bio: string; initials: string;
  photo: string | null; linkedin: string; github: string; email: string; whatsapp: string;
  isLead: boolean; gradient: string; badge: string;
};

/**
 * Équipe affichée : pilotée par l'admin (`/admin/` → Équipe) si des membres y
 * existent, sinon repli sur l'équipe statique. La photo (/public) et le dégradé
 * sont ré-associés par nom ; initiales et badge sont dérivés.
 */
async function resolveTeam(lang: Lang): Promise<TeamCard[]> {
  // Piloté par l'admin (`/admin/` → Équipe) si des membres existent, sinon repli
  // statique. Le CMS porte désormais photo (photo_path), badge et dégradé → plus
  // besoin de ré-associer par nom (l'ancienne cause du bug de photo).
  const staticTeam = TEAM_MEMBERS[lang];
  const cms = await getCmsTeam(lang);
  if (!cms.length) return staticTeam;
  return cms.map((m, i) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    initials: initialsOf(m.name),
    photo: m.photo,
    linkedin: m.linkedin,
    github: m.github,
    email: m.email,
    whatsapp: m.whatsapp,
    isLead: m.isLead,
    gradient: m.gradient || TEAM_GRADIENTS[i % TEAM_GRADIENTS.length],
    badge: m.badge || (m.isLead ? (lang === "fr" ? "Co-fondateur" : "Co-founder") : m.role),
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: lang === "fr" ? "À propos" : "About",
    description: c.intro,
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];
  const team = await resolveTeam(lang);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ── Hero about ── */}
        <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-14">
          {/* Fond vidéo : vision & jeunesse tech africaine */}
          <HeroBackground videoSrc="/A-propos/about-hero.mp4" poster="/img/photo-1531482615713-2afd69097998-w1740.jpg" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                  <IconEye className="size-4 text-sky" />
                  {c.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] sm:text-4xl lg:text-5xl">
                  {c.title}
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{c.intro}</p>
              </Reveal>
              <Reveal delay={240}>
                <Link href={`/${lang}/contact`}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-xl transition-transform hover:scale-[1.03]">
                  {c.ctaButton}
                  <IconArrowRight className="size-5" />
                </Link>
              </Reveal>
            </div>

            {/* Stats flottantes */}
            <Reveal delay={200} className="hidden lg:block">
              <div className="grid grid-cols-1 gap-4">
                {c.stats.map((s, i) => (
                  <div key={s.label}
                    className="group relative overflow-hidden bg-white/10 p-5 backdrop-blur transition-all hover:-translate-x-1 hover:bg-white/15"
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                      <span className="text-4xl font-extrabold text-white">{s.value}</span>
                      <span className="text-sm font-medium text-white/70">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

        </section>

        {/* ── Mission & Vision ── */}
        <section className="bg-gradient-to-b from-surface via-white to-brand-50/40 py-14 dark:from-[#070e1c] dark:via-slate-900/40 dark:to-[#070e1c] sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
            {c.pillars.map((pl, i) => (
              <Reveal key={pl.h} delay={i * 100}>
                <article className="group relative h-full overflow-hidden bg-gradient-to-br from-brand-50/60 to-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:from-slate-900 dark:to-slate-900">
                  <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-brand-400/8 blur-2xl group-hover:bg-brand-400/15 transition-all" />
                  <span className={`mb-4 inline-block rounded-full bg-gradient-to-r ${VALUE_COLORS[i]} px-3 py-1 text-xs font-bold text-white uppercase tracking-wide`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-bold text-brand-900 dark:text-white">{pl.h}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{pl.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Valeurs ── */}
        <section className="relative bg-surface py-14 sm:py-16 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="bg-grid-soft absolute inset-0 opacity-40 dark:opacity-20" />
            <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-brand-400/8 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sky/8 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">{c.valuesTitle}</span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-3xl">{c.valuesSubtitle}</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.values.map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? IconCheck;
                return (
                  <Reveal key={v.title} delay={i * 90}>
                    <article className="group relative h-full overflow-hidden bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10 dark:bg-slate-900">
                      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${VALUE_COLORS[i]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className={`relative grid size-14 place-items-center rounded-lg bg-gradient-to-br ${VALUE_COLORS[i]} text-white shadow-lg transition-transform group-hover:scale-110`}>
                        <Icon className="size-7" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-brand-900 dark:text-white">{v.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.desc}</p>
                      <span aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${VALUE_COLORS[i]} transition-transform duration-700 group-hover:scale-x-100`} />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Notre approche (histoire) — titre centré ── */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-3xl">{c.storyTitle}</h2>
            </Reveal>
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
                  {c.story.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="relative bg-gradient-to-br from-brand-50 to-white p-8 dark:from-slate-900 dark:to-slate-900">
                  <div aria-hidden className="absolute -right-4 -top-4 size-24 rounded-full bg-sky/15 blur-2xl" />
                  <dl className="grid gap-6 sm:grid-cols-3">
                    {c.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <dt className="text-4xl font-extrabold text-brand-700 dark:text-brand-300">{s.value}</dt>
                        <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Équipe — fond sombre sobre ── */}
        <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-16">
          {/* Halos discrets */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-500/12 blur-3xl" />
            <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/8 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky">{c.teamTitle}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">{c.teamSubtitle}</h2>
            </Reveal>

            {/* ── Les deux fondateurs, ensemble ── */}
            <Reveal className="mx-auto mt-10 max-w-4xl">
              <div className="group relative overflow-hidden shadow-2xl shadow-black/40">
                <div className="relative h-72 w-full sm:h-96">
                  <Image
                    src="/A-propos/photo-the-co-founders-together.png"
                    alt={lang === "fr" ? "Les co-fondateurs de Horus-Lab" : "Horus-Lab co-founders"}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 900px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#040814] via-[#040814]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                      <span className="size-1.5 rounded-full bg-sky glow-pulse" />
                      {lang === "fr" ? "Co-fondateurs" : "Co-founders"}
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                      Edwin TCHAMBA TCHAKOUNTE <span className="text-sky">&amp;</span> Loïc DJIMGOU TONBA
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      {lang === "fr"
                        ? "Deux ingénieurs, une même ambition : faire grandir Horus-Lab."
                        : "Two engineers, one shared ambition: growing Horus-Lab."}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Puis chacun séparément ── */}
            <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 120}>
                  <article className="group relative h-full overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-white/25 hover:shadow-2xl hover:shadow-black/50">
                    {/* En-tête : photo réelle si disponible, sinon dégradé + initiales */}
                    <div className={`relative h-72 overflow-hidden ${m.photo ? "" : `bg-gradient-to-br ${m.gradient}`}`}>
                      {m.photo ? (
                        <>
                          <Image
                            src={m.photo}
                            alt={m.name}
                            fill
                            sizes="(max-width:640px) 100vw, 400px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a1430] via-transparent to-transparent" />
                        </>
                      ) : (
                        <>
                          <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
                          <div className="absolute inset-0 grid place-items-center">
                            <span className="grid size-20 place-items-center rounded-full bg-white/90 text-2xl font-extrabold shadow-xl ring-4 ring-white/30">
                              <span className={`bg-gradient-to-br ${m.gradient} bg-clip-text text-transparent`}>{m.initials}</span>
                            </span>
                          </div>
                        </>
                      )}
                      <span className="absolute bottom-3 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        {m.badge}
                      </span>
                    </div>

                    <div className="px-7 pb-7 pt-6">
                      <h3 className="text-xl font-extrabold tracking-tight text-white">{m.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-sky">{m.role}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">{m.bio}</p>

                      {(m.linkedin || m.github || m.email || m.whatsapp) && (
                        <div className="mt-5 flex gap-2.5">
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md hover:shadow-brand-700/25">
                              <IconLinkedIn className="size-4" />
                            </a>
                          )}
                          {m.github && (
                            <a href={m.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md">
                              <IconGitHub className="size-4" />
                            </a>
                          )}
                          {m.whatsapp && (
                            <a href={m.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-[#25D366] hover:shadow-md">
                              <IconWhatsApp className="size-4" />
                            </a>
                          )}
                          {m.email && (
                            <a href={`mailto:${m.email}`} aria-label={`E-mail ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md">
                              <IconMail className="size-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-surface px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
              <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 size-60 rounded-full bg-brand-500/25 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 size-48 rounded-full bg-sky/15 blur-3xl" />
              <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">{c.ctaTitle}</h2>
              <div className="relative mt-8 flex justify-center">
                <Link href={`/${lang}/contact`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03]">
                  {c.ctaButton}
                  <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
