import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Starfield } from "@/components/Starfield";
import {
  IconArrowRight,
  IconCheck,
  IconCog,
  IconEye,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconSpark,
} from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

/* ── Équipe statique (les co-fondateurs) ── */
const TEAM_MEMBERS = {
  fr: [
    {
      name: "Brailain Loïc TONBA",
      role: "Ingénieur logiciel · Co-fondateur",
      bio: "Développeur full-stack et entrepreneur tech, je pilote la vision produit de Horus-Lab et conçois des solutions numériques de bout en bout pour des entreprises africaines et internationales. Passionné par l'impact de la technologie sur le continent.",
      initials: "BT",
      photo: "",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      github: "https://github.com/LoicTonba",
      email: "tonbaloic@gmail.com",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Co-fondateur",
    },
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Architecte logiciel · Co-fondateur",
      bio: "Senior Software Engineer & Architecte logiciel, passionné par la résolution de problèmes complexes et l'innovation technologique. Avec plus de 3 ans d'expérience en développement full-stack (web & mobile), conception d'APIs REST et déploiement cloud, je livre des solutions performantes et adaptées aux besoins réels. Maîtrise de la méthode RUP et de la modélisation UML. Formation IUT-FV & ENSPD. Lauréat du Prix du Meilleur Projet de Fin d'Études — IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/photo-Edwin-co-founder.png",
      linkedin: "",
      github: "",
      email: "",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
      badge: "Co-fondateur",
    },
  ],
  en: [
    {
      name: "Brailain Loïc TONBA",
      role: "Software engineer · Co-founder",
      bio: "Full-stack developer and tech entrepreneur, I drive the product vision at Horus-Lab and build end-to-end digital solutions for African and international businesses. Passionate about technology's impact across the continent.",
      initials: "BT",
      photo: "",
      linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
      github: "https://github.com/LoicTonba",
      email: "tonbaloic@gmail.com",
      isLead: true,
      gradient: "from-brand-700 via-brand-500 to-sky",
      badge: "Co-founder",
    },
    {
      name: "Edwin TCHAMBA TCHAKOUNTE",
      role: "Software architect · Co-founder",
      bio: "Senior Software Engineer & Software Architect, driven by complex problem-solving and technological innovation. With 3+ years of hands-on experience in full-stack web & mobile development, REST API design and cloud deployment, I deliver high-performance solutions tailored to real-world needs. Expert in RUP methodology and UML modelling, trained at IUT-FV and ENSPD. Winner of the Best Final Year Project Award — IUT-FV Bandjoun (2024).",
      initials: "ET",
      photo: "/photo-Edwin-co-founder.png",
      linkedin: "",
      github: "",
      email: "",
      isLead: true,
      gradient: "from-slate-800 via-brand-700 to-amber-500",
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
    intro: "Horus-Lab est une entreprise technologique africaine. Nous concevons des produits numériques — applications web & mobile, logiciels sur-mesure, systèmes d'information et solutions de digitalisation — pensés pour les réalités du continent et construits pour durer.",
    pillars: [
      { h: "Notre mission", body: "Rendre la technologie de pointe accessible et utile aux organisations africaines, en les accompagnant de l'idée jusqu'à l'impact." },
      { h: "Notre vision",  body: "Une Afrique qui construit ses propres solutions numériques, à la hauteur des standards mondiaux — et au-delà des frontières." },
    ],
    valuesTitle: "Nos valeurs",
    valuesSubtitle: "Ce qui guide chacune de nos décisions et de nos lignes de code.",
    values: [
      { title: "Excellence technique",    desc: "Des solutions robustes, performantes et maintenables, sans compromis sur la qualité." },
      { title: "Proximité & écoute",      desc: "Nous travaillons avec vous, pas seulement pour vous : transparence et disponibilité à chaque étape." },
      { title: "Innovation utile",        desc: "La bonne technologie au service d'un problème réel — jamais l'inverse." },
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
      { value: "8+",  label: "projets livrés" },
      { value: "4",   label: "pôles d'expertise" },
      { value: "8+",  label: "secteurs servis" },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Beyond borders, in service of your impact",
    intro: "Horus-Lab is an African technology company. We build digital products — web & mobile apps, custom software, information systems and digitalisation solutions — designed for the realities of the continent and built to last.",
    pillars: [
      { h: "Our mission", body: "Make leading-edge technology accessible and useful to African organizations, guiding them from idea to impact." },
      { h: "Our vision",  body: "An Africa that builds its own digital solutions, matching world-class standards — and reaching beyond borders." },
    ],
    valuesTitle: "Our values",
    valuesSubtitle: "What guides every decision and every line of code.",
    values: [
      { title: "Technical excellence", desc: "Robust, performant and maintainable solutions, with no compromise on quality." },
      { title: "Closeness & listening", desc: "We work with you, not just for you: transparency and availability at every step." },
      { title: "Useful innovation",    desc: "The right technology for a real problem — never the other way around." },
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
      { value: "8+", label: "projects delivered" },
      { value: "4",  label: "areas of expertise" },
      { value: "8+", label: "industries served" },
    ],
  },
};

const VALUE_ICONS = [IconCog, IconEye, IconSpark, IconCheck];
const VALUE_COLORS = ["from-brand-700 to-brand-500","from-sky to-brand-400","from-brand-600 to-sky","from-brand-500 to-brand-300"];

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
  const team = TEAM_MEMBERS[lang];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ── Hero about ── */}
        <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
          {/* Image fond */}
          <div aria-hidden
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1740&q=75)` }}
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/80 via-brand-900/60 to-brand-800/70" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.15]" />
          {/* Orbes */}
          <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-sky/15 blur-3xl animate-float-slow" />
          <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-brand-400/15 blur-3xl animate-drift" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                  <IconEye className="size-4 text-sky" />
                  {c.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
                  {c.title}
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{c.intro}</p>
              </Reveal>
              <Reveal delay={240}>
                <Link href={`/${lang}#contact`}
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
                    className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all hover:-translate-x-1 hover:bg-white/15"
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

          {/* ── Vague animée bas (comme les autres pages) ── */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[90px] text-surface dark:text-[#070e1c]">
            <svg viewBox="0 0 2880 120" preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_16s_linear_infinite]">
              <path fill="currentColor" opacity="0.45"
                d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 C1680,90 1920,10 2160,50 C2400,90 2640,10 2880,50 L2880,120 L0,120 Z" />
            </svg>
            <svg viewBox="0 0 2880 120" preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-full w-[200%] animate-[waveX_11s_linear_infinite_reverse]">
              <path fill="currentColor"
                d="M0,60 C360,100 720,30 1440,60 C2160,90 2520,30 2880,60 L2880,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="bg-gradient-to-b from-surface via-white to-brand-50/40 py-16 dark:from-[#070e1c] dark:via-slate-900/40 dark:to-[#070e1c] sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
            {c.pillars.map((pl, i) => (
              <Reveal key={pl.h} delay={i * 100}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:from-slate-900 dark:to-slate-900">
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
        <section className="relative bg-surface py-20 sm:py-28 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="bg-grid-soft absolute inset-0 opacity-50" />
            <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-brand-400/8 blur-3xl animate-float-slow" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sky/8 blur-3xl animate-drift" />

            {/* Objets géométriques + symboles de loyauté/confiance, animés */}
            {[
              { t: "shield",   x: "6%",  y: "16%", sz: 44, d: "0s",   dur: "10s" },
              { t: "hex",      x: "90%", y: "10%", sz: 40, d: "1.2s", dur: "9s"  },
              { t: "badge",    x: "16%", y: "72%", sz: 42, d: "0.6s", dur: "11s" },
              { t: "handshake",x: "84%", y: "70%", sz: 50, d: "2.0s", dur: "8s"  },
              { t: "star",     x: "48%", y: "8%",  sz: 34, d: "1.6s", dur: "10s" },
              { t: "diamond",  x: "70%", y: "82%", sz: 30, d: "0.3s", dur: "9s"  },
              { t: "heart",    x: "30%", y: "40%", sz: 30, d: "2.6s", dur: "8s"  },
              { t: "triangle", x: "78%", y: "40%", sz: 32, d: "0.9s", dur: "11s" },
              { t: "medal",    x: "10%", y: "46%", sz: 38, d: "1.9s", dur: "9s"  },
              { t: "circle",   x: "56%", y: "60%", sz: 26, d: "2.2s", dur: "10s" },
            ].map((s, i) => (
              <div key={i}
                className="absolute animate-float text-brand-400/[0.13] dark:text-brand-300/[0.10]"
                style={{ left: s.x, top: s.y, animationDelay: s.d, animationDuration: s.dur }}>
                {s.t === "shield"    && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2l8 4v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>}
                {s.t === "hex"       && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>}
                {s.t === "badge"     && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>}
                {s.t === "handshake" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12l3 3 2-2 3 3"/><path d="M2 10l4-3 6 2 4-2 6 3"/><path d="M2 10v5l4 3"/><path d="M22 10v5l-4 3"/></svg>}
                {s.t === "star"      && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>}
                {s.t === "diamond"   && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="12,2 22,12 12,22 2,12"/></svg>}
                {s.t === "heart"     && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3 1.2 4 2.5C11 6.2 12 5 14 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg>}
                {s.t === "triangle"  && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="12,3 22,21 2,21"/></svg>}
                {s.t === "medal"     && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="15" r="6"/><path d="M9 9L6 2M15 9l3-7M12 13l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.2 11 15z"/></svg>}
                {s.t === "circle"    && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>}
              </div>
            ))}
          </div>
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{c.valuesTitle}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">{c.valuesSubtitle}</h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.values.map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? IconCheck;
                return (
                  <Reveal key={v.title} delay={i * 90}>
                    <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900">
                      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${VALUE_COLORS[i]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className={`relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${VALUE_COLORS[i]} text-white shadow-lg transition-transform group-hover:scale-110`}>
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

        {/* ── Histoire ── */}
        <section className="bg-white py-20 dark:bg-[#070e1c] sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">{c.storyTitle}</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                {c.story.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 dark:border-white/10 dark:from-slate-900 dark:to-slate-900">
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
        </section>

        {/* ── Équipe — fond "création de l'univers" (astres & étoiles animés) ── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Ciel profond */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#040814] via-[#0a1430] to-[#0f2a5e]" />
          {/* Champ d'étoiles + astres */}
          <Starfield tone="white" density="dense" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky">{c.teamTitle}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">{c.teamSubtitle}</h2>
            </Reveal>

            {/* ── Les deux fondateurs, ensemble ── */}
            <Reveal className="mx-auto mt-14 max-w-4xl">
              <div className="group relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40">
                <div className="relative h-72 w-full sm:h-96">
                  <Image
                    src="/photo-the-co-founders-together.png"
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
                      Brailain Loïc TONBA <span className="text-sky">&amp;</span> Edwin TCHAMBA TCHAKOUNTE
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
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-white/25 hover:shadow-2xl hover:shadow-black/50">
                    {/* En-tête : photo réelle si disponible, sinon dégradé + initiales */}
                    <div className={`relative h-40 overflow-hidden ${m.photo ? "" : `bg-gradient-to-br ${m.gradient}`}`}>
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

                      {(m.linkedin || m.github || m.email) && (
                        <div className="mt-5 flex gap-2.5">
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn — ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md hover:shadow-brand-700/25">
                              <IconLinkedIn className="size-4" />
                            </a>
                          )}
                          {m.github && (
                            <a href={m.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub — ${m.name}`}
                              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-600 hover:shadow-md">
                              <IconGitHub className="size-4" />
                            </a>
                          )}
                          {m.email && (
                            <a href={`mailto:${m.email}`} aria-label={`E-mail — ${m.name}`}
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
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 size-60 rounded-full bg-brand-500/30 blur-3xl animate-float-slow" />
              <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 size-48 rounded-full bg-sky/20 blur-3xl animate-drift" />
              <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">{c.ctaTitle}</h2>
              <div className="relative mt-8 flex justify-center">
                <Link href={`/${lang}#contact`}
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
