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

/* ── Les trois cofondateurs (repli si l'admin n'a pas d'équipe) ──
   Rôles alignés sur la présentation de l'entreprise (octobre 2026). */
const TEAM_MEMBERS = {
  fr: [
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Stratégie et opérations · Cofondateur",
      bio: "Architecte logiciel et ingénieur senior. J'assemble des applications web et mobiles robustes (APIs REST, cloud, méthodes RUP & UML), pensées pour durer et passer à l'échelle. Lauréat du Prix du Meilleur Projet de Fin d'Études, IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/A-propos/photo-Edwin-co-founder.png",
      linkedin: "",
      email: "tchambaedwin@gmail.com",
      whatsapp: "https://wa.me/237673398046",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
      badge: "Cofondateur",
    },
    {
      name: "Loïc DJIMGOU TONBA",
      role: "Architecture et produit · Cofondateur",
      bio: "Ingénieur full-stack et entrepreneur, je transforme des idées en produits numériques qui marchent, du web au mobile, du concept au déploiement. Je pilote la vision produit de Zayra Technologies, convaincu que la tech est un vrai levier de croissance pour le continent.",
      initials: "LT",
      photo: "/A-propos/photo-loic-tonba-cofounder.png",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      email: "tonbaloic@gmail.com",
      whatsapp: "https://wa.me/237699173771",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Cofondateur",
    },
    {
      name: "Cardin KIEPOUO",
      role: "Ingénieur IA · Cofondateur",
      bio: "Ingénieur en intelligence artificielle, il conçoit et intègre l'IA au cœur des solutions Zayra, pour qu'elle reste utile, sobre et vérifiable.",
      initials: "CK",
      photo: null,
      linkedin: "",
      email: "",
      whatsapp: "",
      isLead: true,
      gradient: "from-brand-600 via-sky to-amber-400",
      badge: "Cofondateur",
    },
  ],
  en: [
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Strategy & operations · Co-founder",
      bio: "Software architect and senior engineer. I build robust web and mobile applications (REST APIs, cloud, RUP & UML methods), designed to last and scale. Winner of the Best Final Year Project Award, IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/A-propos/photo-Edwin-co-founder.png",
      linkedin: "",
      email: "tchambaedwin@gmail.com",
      whatsapp: "https://wa.me/237673398046",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
      badge: "Co-founder",
    },
    {
      name: "Loïc DJIMGOU TONBA",
      role: "Architecture & product · Co-founder",
      bio: "Full-stack engineer and entrepreneur, I turn ideas into digital products that ship, web and mobile, from concept to deployment. I lead Zayra Technologies' product vision, convinced that technology is a real growth engine for the continent.",
      initials: "LT",
      photo: "/A-propos/photo-loic-tonba-cofounder.png",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      email: "tonbaloic@gmail.com",
      whatsapp: "https://wa.me/237699173771",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Co-founder",
    },
    {
      name: "Cardin KIEPOUO",
      role: "AI engineer · Co-founder",
      bio: "An artificial intelligence engineer, he designs and integrates AI at the heart of Zayra's solutions, keeping it useful, lean and verifiable.",
      initials: "CK",
      photo: null,
      linkedin: "",
      email: "",
      whatsapp: "",
      isLead: true,
      gradient: "from-brand-600 via-sky to-amber-400",
      badge: "Co-founder",
    },
  ],
};

/* Contenu tiré de la présentation de l'entreprise : vision, mission, ce qui
   nous distingue, histoire et chiffres. Identique sur les deux sites : Horus Lab
   est le laboratoire de Zayra Technologies. */
const CONTENT: Record<Lang, {
  eyebrow: string; title: string; intro: string;
  pillars: { h: string; body: string }[];
  valuesTitle: string; valuesSubtitle: string;
  values: { title: string; desc: string }[];
  storyTitle: string; story: { date: string; title: string; text: string }[];
  teamTitle: string; teamSubtitle: string;
  ctaTitle: string; ctaButton: string;
  stats: { value: string; label: string }[];
}> = {
  fr: {
    eyebrow: "À propos",
    title: "L'Afrique, intelligente par nature.",
    intro: "Zayra Technologies conçoit, développe, héberge et maintient des applications, des systèmes d'information et des solutions SaaS pensés pour les réalités africaines. Quatre solutions en ligne et un laboratoire interne, Horus Lab, forment un écosystème cohérent.",
    pillars: [
      { h: "Notre vision",  body: "« Voir le continent africain se hisser dans le monde comme le géant qu'il est. »" },
      { h: "Notre mission", body: "Faire grandir l'Afrique à partir de ses propres forces, en mettant l'IA au service de chacun : l'élève, l'agriculteur, l'entrepreneur et la communauté, avec des outils accessibles, bilingues et payables par Mobile Money." },
    ],
    valuesTitle: "Ce qui nous distingue",
    valuesSubtitle: "Des outils pensés ici, pour celles et ceux qui font l'Afrique.",
    values: [
      { title: "Pensé pour l'Afrique",  desc: "Mobile Money, hors ligne, français et anglais, même avec peu de réseau." },
      { title: "Une IA sourcée",        desc: "Tuteur et conseiller s'appuient sur des contenus vérifiés." },
      { title: "La confiance intégrée", desc: "Données cloisonnées, journal des actions, double approbation." },
      { title: "Maîtrise totale",       desc: "Équipe 100 % interne, de la conception à l'hébergement." },
    ],
    storyTitle: "Notre histoire : le laboratoire est devenu un écosystème",
    story: [
      { date: "Mai 2025",      title: "Naissance d'Horus Lab",       text: "Lancement à Douala et premiers projets sur mesure." },
      { date: "2025 – 2026",   title: "Premières réalisations",      text: "Six projets livrés au Cameroun et en Europe." },
      { date: "Janvier 2026",  title: "Horus Lab devient Zayra",     text: "L'entreprise prend le nom de son écosystème ; Horus Lab devient son laboratoire." },
      { date: "Octobre 2026",  title: "Lancement commercial",        text: "Drive, School, Agro et Nkap partent à la conquête du marché." },
    ],
    teamTitle: "L'équipe fondatrice",
    teamSubtitle: "Trois cofondateurs, une équipe 100 % interne.",
    ctaTitle: "Construisons quelque chose de durable ensemble.",
    ctaButton: "Démarrer un projet",
    stats: [
      { value: "2025",  label: "création à Douala" },
      { value: "4",     label: "solutions Zayra en ligne" },
      { value: "6+",    label: "projets clients livrés" },
      { value: "100 %", label: "équipe interne" },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Africa, intelligent by nature.",
    intro: "Zayra Technologies designs, builds, hosts and maintains applications, information systems and SaaS solutions built for African realities. Four live solutions and an in-house lab, Horus Lab, form one coherent ecosystem.",
    pillars: [
      { h: "Our vision",  body: "“To see the African continent rise in the world as the giant it is.”" },
      { h: "Our mission", body: "Grow Africa from its own strengths by putting AI at everyone's service: the student, the farmer, the entrepreneur and the community, with tools that are accessible, bilingual and payable by Mobile Money." },
    ],
    valuesTitle: "What sets us apart",
    valuesSubtitle: "Tools designed here, for the people who make Africa.",
    values: [
      { title: "Built for Africa",   desc: "Mobile Money, offline mode, French and English, even with a weak network." },
      { title: "Sourced AI",         desc: "Our tutor and advisor rely on verified content." },
      { title: "Trust built in",     desc: "Isolated data, action logs, dual approval." },
      { title: "Full control",       desc: "A 100% in-house team, from design to hosting." },
    ],
    storyTitle: "Our story: the lab became an ecosystem",
    story: [
      { date: "May 2025",      title: "Horus Lab is born",          text: "Launched in Douala with our first custom projects." },
      { date: "2025 – 2026",   title: "First deliveries",           text: "Six projects delivered in Cameroon and Europe." },
      { date: "January 2026",  title: "Horus Lab becomes Zayra",    text: "The company takes the name of its ecosystem; Horus Lab becomes its lab." },
      { date: "October 2026",  title: "Commercial launch",          text: "Drive, School, Agro and Nkap set out to win the market." },
    ],
    teamTitle: "The founding team",
    teamSubtitle: "Three co-founders, a 100% in-house team.",
    ctaTitle: "Let's build something lasting together.",
    ctaButton: "Start a project",
    stats: [
      { value: "2025",  label: "founded in Douala" },
      { value: "4",     label: "Zayra solutions live" },
      { value: "6+",    label: "client projects delivered" },
      { value: "100%",  label: "in-house team" },
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
  photo: string | null; linkedin: string; email: string; whatsapp: string;
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
  const fromCms: TeamCard[] = cms.map((m, i) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    initials: initialsOf(m.name),
    photo: m.photo,
    linkedin: m.linkedin,
    email: m.email,
    whatsapp: m.whatsapp,
    isLead: m.isLead,
    gradient: m.gradient || TEAM_GRADIENTS[i % TEAM_GRADIENTS.length],
    badge: m.badge || (m.isLead ? (lang === "fr" ? "Cofondateur" : "Co-founder") : m.role),
  }));
  // Les trois cofondateurs apparaissent toujours, même si l'un d'eux manque
  // encore dans l'admin.
  const known = new Set(fromCms.map((m) => m.name.toLowerCase()));
  return [...fromCms, ...staticTeam.filter((m) => !known.has(m.name.toLowerCase()))];
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
                  <p className={`mt-3 leading-relaxed ${i === 0 ? "text-lg font-semibold text-brand-900 dark:text-white" : "text-muted"}`}>{pl.body}</p>
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

        {/* ── Notre histoire : frise datée + chiffres ── */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-3xl">{c.storyTitle}</h2>
            </Reveal>
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <ol className="relative space-y-6 border-l-2 border-brand-100 pl-6 dark:border-white/10">
                  {c.story.map((step) => (
                    <li key={step.date} className="relative">
                      <span aria-hidden className="round-portrait absolute -left-[31px] top-1.5 size-3 bg-brand-500 ring-4 ring-white dark:ring-[#070e1c]" />
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">{step.date}</p>
                      <p className="mt-1 text-lg font-bold text-brand-900 dark:text-white">{step.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted sm:text-base">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={120}>
                <div className="relative bg-gradient-to-br from-brand-50 to-white p-8 dark:from-slate-900 dark:to-slate-900">
                  <div aria-hidden className="absolute -right-4 -top-4 size-24 rounded-full bg-sky/15 blur-2xl" />
                  <dl className="grid grid-cols-2 gap-6">
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

            {/* ── Les co-fondateurs : portraits ronds, sobres ── */}
            <div className="mx-auto mt-10 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 120}
                  className={team.length % 2 === 1 && i === team.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-auto" : undefined}>
                  <article className="h-full border border-white/12 bg-white/[0.04] px-7 pb-8 pt-9 text-center">
                    {/* Portrait réel dans un cercle ; à défaut, initiales */}
                    <div className="round-portrait relative mx-auto size-36 overflow-hidden ring-4 ring-white/15">
                      {m.photo ? (
                        <Image src={m.photo} alt={m.name} fill sizes="144px" className="object-cover" />
                      ) : (
                        <span className="grid h-full w-full place-items-center bg-white/10 text-3xl font-extrabold text-white">
                          {m.initials}
                        </span>
                      )}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-extrabold tracking-tight text-white">{m.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-sky">{m.role}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">{m.bio}</p>

                      {(m.linkedin || m.email || m.whatsapp) && (
                        <div className="mt-5 flex justify-center gap-2.5">
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md hover:shadow-brand-700/25">
                              <IconLinkedIn className="size-4" />
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
