import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ServiceContactSection } from "@/components/services/ServiceContactSection";
import { ServiceProcessSection } from "@/components/services/ServiceProcessSection";
import {
  IconArrowRight,
  IconCheck,
  IconCode,
  IconCog,
  IconEye,
  IconSpark,
} from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = ["applications", "systemes-information", "digitalisation", "formation-audit"];
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

/* ─── Images Unsplash par feature ────────────────────────────── */
const FEATURE_IMAGES: Record<string, Record<number, string>> = {
  applications: {
    0: "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=600&q=70",
    1: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=70",
    2: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=70",
    3: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=70",
  },
  "systemes-information": {
    0: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70",
    1: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=70",
    2: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70",
    3: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=70",
  },
  digitalisation: {
    0: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=70",
    1: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70",
    2: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70",
    3: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=70",
  },
  "formation-audit": {
    0: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=70",
    1: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=70",
    2: "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=600&q=70",
    3: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=70",
  },
};

type ServiceContent = {
  icon: typeof IconCode;
  gradient: string;
  gradientLight: string;
  badge: string;
  title: string;
  subtitle: string;
  heroImage: string;
  intro: string;
  features: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  deliverables: string[];
  ctaTitle: string;
};

const SERVICES_DATA: Record<string, Record<Lang, ServiceContent>> = {
  applications: {
    fr: {
      icon: IconCode,
      gradient: "from-brand-700 via-brand-600 to-sky",
      gradientLight: "from-brand-50 via-sky/5 to-white",
      badge: "Développement",
      heroImage: "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=1920&q=85",
      title: "Applications sur mesure",
      subtitle: "Web, mobile & PWA conçus pour vos utilisateurs",
      intro: "Nous concevons des applications web et mobiles performantes, de la maquette au déploiement. Chaque produit est pensé autour de vos utilisateurs réels et de vos contraintes terrain.",
      features: [
        { title: "Sites & applications web", desc: "Interfaces modernes, rapides et accessibles. React, Next.js, TypeScript." },
        { title: "Applications mobiles", desc: "iOS et Android natifs ou cross-platform (Flutter, React Native)." },
        { title: "Progressive Web Apps", desc: "L'expérience native dans le navigateur : hors-ligne, installable, rapide." },
        { title: "APIs & intégrations", desc: "APIs REST robustes, connexion à vos systèmes existants." },
      ],
      process: [
        { step: "01", title: "Cadrage & UX Research", desc: "Analyse des besoins, personas, user journeys et wireframes." },
        { step: "02", title: "Design UI / Prototypage", desc: "Interfaces haute-fidélité validées avec vous avant le code." },
        { step: "03", title: "Développement itératif", desc: "Sprints courts, démos régulières, feedback intégré en continu." },
        { step: "04", title: "Tests & déploiement", desc: "Recette complète, mise en production et monitoring." },
      ],
      deliverables: ["Code source versionné (Git)", "Documentation technique", "Formation de votre équipe", "Support post-lancement 3 mois"],
      ctaTitle: "Parlons de votre application",
    },
    en: {
      icon: IconCode,
      gradient: "from-brand-700 via-brand-600 to-sky",
      gradientLight: "from-brand-50 via-sky/5 to-white",
      badge: "Development",
      heroImage: "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=1920&q=85",
      title: "Custom Applications",
      subtitle: "Web, mobile & PWA built around your users",
      intro: "We design and build high-performance web and mobile applications, from wireframe to production. Every product is shaped around your real users and on-the-ground constraints.",
      features: [
        { title: "Web apps & sites", desc: "Modern, fast and accessible interfaces. React, Next.js, TypeScript." },
        { title: "Mobile applications", desc: "Native iOS & Android or cross-platform (Flutter, React Native)." },
        { title: "Progressive Web Apps", desc: "Native-grade experience in the browser: offline, installable, fast." },
        { title: "APIs & integrations", desc: "Robust REST APIs, connected to your existing systems." },
      ],
      process: [
        { step: "01", title: "Scoping & UX Research", desc: "Needs analysis, personas, user journeys and wireframes." },
        { step: "02", title: "UI Design / Prototyping", desc: "High-fidelity interfaces validated with you before any code." },
        { step: "03", title: "Iterative development", desc: "Short sprints, regular demos, continuous feedback." },
        { step: "04", title: "Testing & deployment", desc: "Full QA, production release and monitoring." },
      ],
      deliverables: ["Versioned source code (Git)", "Technical documentation", "Team training", "3-month post-launch support"],
      ctaTitle: "Let's talk about your application",
    },
  },
  "systemes-information": {
    fr: {
      icon: IconEye,
      gradient: "from-slate-800 via-brand-700 to-brand-500",
      gradientLight: "from-slate-50 via-brand-50/30 to-white",
      badge: "Analyse & Conception",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85",
      title: "Systèmes d'information",
      subtitle: "Analyse, conception et architecture SI",
      intro: "Nous modélisons et architecturons vos systèmes d'information avec rigueur — méthode RUP, UML, audit de l'existant — pour vous livrer une base solide, évolutive et documentée.",
      features: [
        { title: "Audit de l'existant", desc: "Cartographie de votre SI, identification des points de friction et opportunités." },
        { title: "Modélisation UML", desc: "Diagrammes de cas d'usage, classes, séquences, déploiement." },
        { title: "Architecture logicielle", desc: "Choix des patterns, découplage, scalabilité et maintenabilité." },
        { title: "Spécifications fonctionnelles", desc: "Cahiers des charges clairs, compréhensibles par tous les acteurs." },
      ],
      process: [
        { step: "01", title: "Audit & état des lieux", desc: "Analyse de votre SI actuel, entretiens avec les équipes." },
        { step: "02", title: "Modélisation", desc: "Diagrammes UML, maquettes d'architecture, flux de données." },
        { step: "03", title: "Validation", desc: "Ateliers de relecture avec vos équipes techniques et métier." },
        { step: "04", title: "Livraison & accompagnement", desc: "Documentation complète et transfert de compétences." },
      ],
      deliverables: ["Dossier d'architecture", "Diagrammes UML complets", "Spécifications fonctionnelles", "Plan de migration"],
      ctaTitle: "Analysons votre système",
    },
    en: {
      icon: IconEye,
      gradient: "from-slate-800 via-brand-700 to-brand-500",
      gradientLight: "from-slate-50 via-brand-50/30 to-white",
      badge: "Analysis & Design",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85",
      title: "Information Systems",
      subtitle: "Analysis, design and IS architecture",
      intro: "We model and architect your information systems with rigour — RUP method, UML, existing system audit — delivering a solid, scalable and documented foundation.",
      features: [
        { title: "Existing system audit", desc: "Mapping your IS, identifying friction points and opportunities." },
        { title: "UML modelling", desc: "Use case, class, sequence and deployment diagrams." },
        { title: "Software architecture", desc: "Pattern selection, decoupling, scalability and maintainability." },
        { title: "Functional specifications", desc: "Clear requirements, understandable by all stakeholders." },
      ],
      process: [
        { step: "01", title: "Audit & assessment", desc: "Analysis of your current IS, team interviews." },
        { step: "02", title: "Modelling", desc: "UML diagrams, architecture mockups, data flows." },
        { step: "03", title: "Validation", desc: "Review workshops with your technical and business teams." },
        { step: "04", title: "Delivery & handover", desc: "Complete documentation and skills transfer." },
      ],
      deliverables: ["Architecture dossier", "Complete UML diagrams", "Functional specifications", "Migration plan"],
      ctaTitle: "Let's analyse your system",
    },
  },
  digitalisation: {
    fr: {
      icon: IconCog,
      gradient: "from-emerald-600 via-teal-600 to-brand-500",
      gradientLight: "from-emerald-50 via-teal-50/30 to-white",
      badge: "Transformation digitale",
      heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=85",
      title: "Digitalisation d'entreprise",
      subtitle: "Transformez vos processus métier en leviers numériques",
      intro: "Nous accompagnons les entreprises africaines dans leur transformation numérique : dématérialisation, automatisation des workflows, déploiement d'outils adaptés à votre contexte.",
      features: [
        { title: "Dématérialisation", desc: "Passage du papier au numérique : documents, validations, signatures électroniques." },
        { title: "Automatisation des processus", desc: "Workflows automatisés, gains de temps mesurables sur vos opérations quotidiennes." },
        { title: "Outils de gestion métier", desc: "CRM, GED, tableaux de bord sur mesure adaptés à votre secteur." },
        { title: "Formation & conduite du changement", desc: "Vos équipes embarquées dès le départ pour une adoption réelle." },
      ],
      process: [
        { step: "01", title: "Diagnostic digital", desc: "Évaluation de la maturité numérique et identification des priorités." },
        { step: "02", title: "Feuille de route", desc: "Plan de transformation structuré, priorisé et réaliste." },
        { step: "03", title: "Déploiement progressif", desc: "Mise en œuvre par phases, avec mesure des résultats à chaque étape." },
        { step: "04", title: "Pérennisation", desc: "Autonomisation de vos équipes et amélioration continue." },
      ],
      deliverables: ["Diagnostic digital détaillé", "Feuille de route digitale", "Outils déployés & configurés", "Formation des équipes"],
      ctaTitle: "Démarrons votre transformation",
    },
    en: {
      icon: IconCog,
      gradient: "from-emerald-600 via-teal-600 to-brand-500",
      gradientLight: "from-emerald-50 via-teal-50/30 to-white",
      badge: "Digital transformation",
      heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=85",
      title: "Business Digitalisation",
      subtitle: "Turn your business processes into digital levers",
      intro: "We guide African businesses through their digital transformation: dematerialisation, workflow automation, deployment of tools adapted to your context.",
      features: [
        { title: "Dematerialisation", desc: "Going paperless: documents, approvals, electronic signatures." },
        { title: "Process automation", desc: "Automated workflows with measurable time savings on daily operations." },
        { title: "Business management tools", desc: "CRM, DMS, custom dashboards adapted to your sector." },
        { title: "Training & change management", desc: "Your teams onboarded from day one for real adoption." },
      ],
      process: [
        { step: "01", title: "Digital diagnostic", desc: "Digital maturity assessment and priority identification." },
        { step: "02", title: "Roadmap", desc: "Structured, prioritised and realistic transformation plan." },
        { step: "03", title: "Phased rollout", desc: "Stage-by-stage implementation with results measured at each step." },
        { step: "04", title: "Sustainability", desc: "Team empowerment and continuous improvement." },
      ],
      deliverables: ["Detailed digital diagnostic", "Digital roadmap", "Deployed & configured tools", "Team training"],
      ctaTitle: "Let's start your transformation",
    },
  },
  "formation-audit": {
    fr: {
      icon: IconSpark,
      gradient: "from-amber-500 via-orange-500 to-brand-600",
      gradientLight: "from-amber-50 via-orange-50/30 to-white",
      badge: "Formation & Audit",
      heroImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=85",
      title: "Formation & Audit IT",
      subtitle: "Montez en compétences, sécurisez vos systèmes",
      intro: "Nous formons vos équipes aux technologies modernes et auditons vos systèmes pour identifier les risques, les inefficacités et les opportunités d'amélioration.",
      features: [
        { title: "Formations techniques", desc: "Développement web, mobile, bases de données, cybersécurité — adaptées à votre niveau." },
        { title: "Ateliers pratiques", desc: "Sessions hands-on sur vos propres outils et projets réels." },
        { title: "Audit de code", desc: "Revue de votre codebase : qualité, sécurité, performances, dette technique." },
        { title: "Audit de sécurité", desc: "Tests de pénétration, analyse des vulnérabilités, recommandations concrètes." },
      ],
      process: [
        { step: "01", title: "Évaluation des besoins", desc: "Analyse du niveau actuel de vos équipes et des objectifs visés." },
        { step: "02", title: "Programme sur mesure", desc: "Curriculum adapté à votre contexte, vos outils et votre secteur." },
        { step: "03", title: "Formation / Audit", desc: "Sessions en présentiel ou distanciel, rapport d'audit détaillé." },
        { step: "04", title: "Suivi & certification", desc: "Évaluation des acquis, remise des certifications, plan de progression." },
      ],
      deliverables: ["Supports de formation", "Rapport d'audit complet", "Plan d'action priorisé", "Certificats de formation"],
      ctaTitle: "Planifions votre formation",
    },
    en: {
      icon: IconSpark,
      gradient: "from-amber-500 via-orange-500 to-brand-600",
      gradientLight: "from-amber-50 via-orange-50/30 to-white",
      badge: "Training & Audit",
      heroImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=85",
      title: "Training & IT Audit",
      subtitle: "Upskill your teams, secure your systems",
      intro: "We train your teams on modern technologies and audit your systems to identify risks, inefficiencies and improvement opportunities.",
      features: [
        { title: "Technical training", desc: "Web dev, mobile, databases, cybersecurity — adapted to your level." },
        { title: "Hands-on workshops", desc: "Practical sessions on your own tools and real projects." },
        { title: "Code audit", desc: "Codebase review: quality, security, performance, technical debt." },
        { title: "Security audit", desc: "Penetration testing, vulnerability analysis, concrete recommendations." },
      ],
      process: [
        { step: "01", title: "Needs assessment", desc: "Analysis of your team's current level and target objectives." },
        { step: "02", title: "Custom programme", desc: "Curriculum adapted to your context, tools and industry." },
        { step: "03", title: "Training / Audit", desc: "On-site or remote sessions, detailed audit report." },
        { step: "04", title: "Follow-up & certification", desc: "Knowledge assessment, certificates, progression plan." },
      ],
      deliverables: ["Training materials", "Full audit report", "Prioritised action plan", "Training certificates"],
      ctaTitle: "Let's plan your training",
    },
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !SERVICES_DATA[slug]) return {};
  const s = SERVICES_DATA[slug][lang as Lang];
  return {
    title: s.title,
    description: s.subtitle,
    alternates: {
      canonical: `/${lang}/services/${slug}`,
      languages: { fr: `/fr/services/${slug}`, en: `/en/services/${slug}` },
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !SERVICES_DATA[slug]) notFound();

  const s = SERVICES_DATA[slug][lang as Lang];
  const Icon = s.icon;
  const featureImgs = FEATURE_IMAGES[slug] ?? {};

  const featuresLabel = lang === "fr" ? "Ce que nous faisons" : "What we do";
  const domainLabel   = lang === "fr" ? "Nos domaines d'intervention" : "Our areas of expertise";
  const processLabel  = lang === "fr" ? "Notre démarche" : "Our approach";
  const howLabel      = lang === "fr" ? "Comment nous travaillons" : "How we work";
  const receivesLabel = lang === "fr" ? "Ce que vous recevez" : "What you receive";
  const othersLabel   = lang === "fr" ? "Nos autres services" : "Our other services";

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ═══════════════════════════════════════════════════════
            HERO — image très visible, overlay léger, vague en bas
        ═══════════════════════════════════════════════════════ */}
        <section className="relative isolate flex min-h-[82vh] items-center overflow-hidden pt-28 pb-32">
          {/* Image plein fond — z-index négatif, aucun filtre */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.heroImage})` }}
          />
          {/* Overlay très léger — juste pour lisibilité du texte blanc */}
          <div
            aria-hidden
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.gradient} opacity-60`}
          />
          {/* Trame discrète */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.12]" />
          {/* Particules */}
          {[
            { x:"8%",  y:"20%", d:"0s"   },
            { x:"88%", y:"15%", d:"1.2s" },
            { x:"25%", y:"75%", d:"0.8s" },
            { x:"72%", y:"80%", d:"2s"   },
            { x:"50%", y:"30%", d:"1.5s" },
          ].map((p,i) => (
            <div key={i} className="absolute size-2 rounded-full bg-white/20 animate-float"
              style={{ left:p.x, top:p.y, animationDelay:p.d }} />
          ))}

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <Icon className="size-4 text-white" />
                {s.badge}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
                {s.title}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.3)]">
                {s.subtitle}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <a href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl shadow-black/20 transition-transform hover:scale-[1.04]">
                {s.ctaTitle}
                <IconArrowRight className="size-5" />
              </a>
            </Reveal>
          </div>

          {/* ── Vague animée identique à la home ── */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] text-white dark:text-[#070e1c]">
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

        {/* ═══════════════════════════════════════════════════════
            INTRO
        ═══════════════════════════════════════════════════════ */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-18">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal>
              <p className="text-xl leading-relaxed text-muted text-center">{s.intro}</p>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CE QUE NOUS FAISONS — cartes avec image + formes animées
        ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          {/* Fond dégradé léger propre au service */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white via-surface to-white dark:from-[#070e1c] dark:via-slate-900 dark:to-[#070e1c]" />
          <div aria-hidden className="absolute inset-0 bg-grid-soft opacity-40" />

          {/* Formes géométriques animées dans tout le fond */}
          {[
            { shape:"circle",  x:"3%",  y:"8%",  sz:50, d:"0s",   dur:"9s"  },
            { shape:"square",  x:"90%", y:"5%",  sz:38, d:"1.2s", dur:"10s" },
            { shape:"hex",     x:"15%", y:"70%", sz:44, d:"0.6s", dur:"8s"  },
            { shape:"diamond", x:"82%", y:"60%", sz:36, d:"2s",   dur:"11s" },
            { shape:"circle",  x:"48%", y:"5%",  sz:28, d:"1.5s", dur:"9s"  },
            { shape:"star",    x:"70%", y:"78%", sz:40, d:"0.3s", dur:"10s" },
            { shape:"square",  x:"5%",  y:"45%", sz:30, d:"2.5s", dur:"8s"  },
            { shape:"triangle",x:"92%", y:"40%", sz:34, d:"1s",   dur:"9s"  },
            { shape:"circle",  x:"55%", y:"88%", sz:24, d:"1.8s", dur:"11s" },
            { shape:"diamond", x:"28%", y:"12%", sz:32, d:"0.9s", dur:"8s"  },
          ].map((s2, i) => (
            <div key={i} aria-hidden
              className="pointer-events-none absolute animate-float text-brand-400/[0.10] dark:text-brand-300/[0.08]"
              style={{ left:s2.x, top:s2.y, animationDelay:s2.d, animationDuration:s2.dur }}
            >
              {s2.shape === "circle"   && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="12" cy="12" r="9"/></svg>}
              {s2.shape === "square"   && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
              {s2.shape === "hex"      && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>}
              {s2.shape === "diamond"  && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><polygon points="12,2 22,12 12,22 2,12"/></svg>}
              {s2.shape === "star"     && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>}
              {s2.shape === "triangle" && <svg width={s2.sz} height={s2.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1"><polygon points="12,3 22,21 2,21"/></svg>}
            </div>
          ))}

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{featuresLabel}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">{domainLabel}</h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {s.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900">
                    {/* Image Unsplash en fond de carte */}
                    <div className="relative h-44 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
                      {featureImgs[i] && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-50 transition-all duration-700 group-hover:opacity-65 group-hover:scale-105"
                          style={{ backgroundImage: `url(${featureImgs[i]})` }}
                        />
                      )}
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Icône + numéro sur l'image */}
                      <div className="absolute inset-0 flex items-end justify-between p-5">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30">
                          <Icon className="size-6 text-white" />
                        </div>
                        <span className="text-5xl font-extrabold text-white/20 select-none leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Contenu texte */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold text-brand-900 dark:text-white">{f.title}</h3>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{f.desc}</p>
                    </div>

                    {/* Liseré coloré en bas */}
                    <span aria-hidden className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${s.gradient} transition-transform duration-700 group-hover:scale-x-100`} />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            NOTRE DÉMARCHE — carousel RAF + fond émojis animés
        ═══════════════════════════════════════════════════════ */}
        <ServiceProcessSection
          process={s.process}
          gradient={s.gradient}
          lang={lang}
          processLabel={processLabel}
          howLabel={howLabel}
        />

        {/* ═══════════════════════════════════════════════════════
            LIVRABLES
        ═══════════════════════════════════════════════════════ */}
        <section className="relative bg-white py-16 dark:bg-[#070e1c] sm:py-20 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-soft opacity-30" />
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal className="rounded-3xl border border-brand-100 bg-gradient-to-br from-white to-brand-50/30 p-8 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:from-slate-900 dark:to-slate-900 sm:p-10">
              <div className={`inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg mb-5`}>
                <Icon className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-brand-900 dark:text-white">{receivesLabel}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-sm text-muted">
                    <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${s.gradient} text-white shadow`}>
                      <IconCheck className="size-3.5" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            AUTRES SERVICES
        ═══════════════════════════════════════════════════════ */}
        <section className="relative bg-surface py-14 dark:bg-slate-900/50 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-soft opacity-30" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{othersLabel}</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(SERVICES_DATA)
                .filter(([k]) => k !== slug)
                .slice(0, 3)
                .map(([k, data], i) => {
                  const d = data[lang as Lang];
                  const OtherIcon = d.icon;
                  return (
                    <Reveal key={k} delay={i * 80}>
                      <Link href={`/${lang}/services/${k}`}
                        className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-br ${d.gradient} p-5 transition-all hover:-translate-y-1 hover:shadow-xl`}>
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25">
                          <OtherIcon className="size-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{d.badge}</p>
                          <p className="mt-0.5 text-sm font-bold text-white leading-snug truncate">{d.title}</p>
                        </div>
                        <IconArrowRight className="size-5 shrink-0 text-white/60 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Reveal>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CONTACT — avec formes géométriques supplémentaires
        ═══════════════════════════════════════════════════════ */}
        <ServiceContactSection gradient={s.gradient} />

      </main>
      <Footer />
    </>
  );
}
