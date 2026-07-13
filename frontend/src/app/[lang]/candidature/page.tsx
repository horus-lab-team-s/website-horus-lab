import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CandidatureForm } from "@/components/candidature/CandidatureForm";
import { CareerBackdrop } from "@/components/candidature/CareerBackdrop";
import { IconArrowRight, IconCheck, IconCog, IconEye, IconSpark } from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

const CONTENT: Record<Lang, {
  eyebrow: string;
  title: string;
  intro: string;
  scrollCta: string;
  perksTitle: string;
  perksSubtitle: string;
  perks: { title: string; desc: string }[];
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;
}> = {
  fr: {
    eyebrow: "Rejoignez-nous",
    title: "Construisons l'avenir numérique de l'Afrique, ensemble",
    intro: "Vous êtes développeur, designer, analyste ou étudiant en quête d'un stage qui compte ? Déposez votre candidature en ligne (emploi ou stage professionnel) et rejoignez une équipe qui livre des produits qui ont du sens.",
    scrollCta: "Postuler maintenant",
    perksTitle: "Pourquoi Horus-Lab",
    perksSubtitle: "Une équipe à taille humaine où votre travail a un impact réel.",
    perks: [
      { title: "Projets qui comptent", desc: "Vous travaillez sur des produits réels, livrés à de vrais clients à travers le continent." },
      { title: "Montée en compétences", desc: "Mentorat, revues de code, technologies modernes : vous progressez vite et bien." },
      { title: "Flexibilité & confiance", desc: "Organisation souple, autonomie réelle et une équipe disponible à chaque étape." },
      { title: "Impact local", desc: "Votre code sert des organisations africaines et façonne le numérique du continent." },
    ],
    formEyebrow: "Candidature en ligne",
    formTitle: "Déposez votre dossier",
    formSubtitle: "Remplissez le formulaire et joignez un seul fichier ZIP contenant tous vos documents (CV, lettre de motivation, diplômes…).",
  },
  en: {
    eyebrow: "Join us",
    title: "Let's build Africa's digital future, together",
    intro: "Are you a developer, designer, analyst or a student looking for an internship that matters? Apply online (job or professional internship) and join a team that ships products that count.",
    scrollCta: "Apply now",
    perksTitle: "Why Horus-Lab",
    perksSubtitle: "A human-scale team where your work has real impact.",
    perks: [
      { title: "Work that matters", desc: "You work on real products, shipped to real clients across the continent." },
      { title: "Grow fast", desc: "Mentoring, code reviews and modern technologies: you level up quickly." },
      { title: "Flexibility & trust", desc: "Flexible organisation, real autonomy and a team available at every step." },
      { title: "Local impact", desc: "Your code serves African organisations and shapes the continent's digital future." },
    ],
    formEyebrow: "Online application",
    formTitle: "Submit your documents",
    formSubtitle: "Fill in the form and attach a single ZIP file with all your documents (résumé, cover letter, diplomas…).",
  },
};

const PERK_ICONS = [IconSpark, IconCog, IconEye, IconCheck];
const PERK_COLORS = ["from-brand-700 to-brand-500", "from-sky to-brand-400", "from-emerald-600 to-teal-400", "from-amber-500 to-orange-400"];

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: lang === "fr" ? "Candidature" : "Careers",
    description: c.intro,
    alternates: { canonical: `/${lang}/candidature`, languages: { fr: "/fr/candidature", en: "/en/candidature" } },
  };
}

export default async function CandidaturePage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ═══════════════════════════════════════════════════════
            HERO — image plein fond, overlay, vague animée
        ═══════════════════════════════════════════════════════ */}
        <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden pt-32 pb-32">
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80)" }}
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/85 via-brand-900/70 to-brand-800/80" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.15]" />
          {/* Orbes */}
          <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-sky/15 blur-3xl animate-float-slow" />
          <div aria-hidden className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-brand-400/15 blur-3xl animate-drift" />
          {/* Particules */}
          {[
            { x: "10%", y: "22%", d: "0s" },
            { x: "85%", y: "18%", d: "1.2s" },
            { x: "24%", y: "72%", d: "0.8s" },
            { x: "74%", y: "78%", d: "2s" },
            { x: "52%", y: "28%", d: "1.5s" },
          ].map((p, i) => (
            <div key={i} aria-hidden className="absolute size-2 rounded-full bg-white/25 animate-float"
              style={{ left: p.x, top: p.y, animationDelay: p.d }} />
          ))}

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <IconSpark className="size-4 text-sky" />
                {c.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
                {c.title}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.3)]">
                {c.intro}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <a href="#postuler"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl shadow-black/20 transition-transform hover:scale-[1.04]">
                {c.scrollCta}
                <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* Vague animée bas (comme les autres pages) */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] text-surface dark:text-[#070e1c]">
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
            POURQUOI NOUS — cartes animées
        ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-surface py-20 dark:bg-[#070e1c] sm:py-24">
          <CareerBackdrop variant="perks" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{c.perksTitle}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">{c.perksSubtitle}</h2>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.perks.map((p, i) => {
                const Icon = PERK_ICONS[i] ?? IconCheck;
                return (
                  <Reveal key={p.title} delay={i * 90}>
                    <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900">
                      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${PERK_COLORS[i]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className={`relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${PERK_COLORS[i]} text-white shadow-lg transition-transform group-hover:scale-110`}>
                        <Icon className="size-7" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-brand-900 dark:text-white">{p.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.desc}</p>
                      <span aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${PERK_COLORS[i]} transition-transform duration-700 group-hover:scale-x-100`} />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FORMULAIRE DE CANDIDATURE
        ═══════════════════════════════════════════════════════ */}
        <section id="postuler" className="relative scroll-mt-28 overflow-hidden bg-white py-20 dark:bg-[#070e1c] sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface to-white dark:from-slate-900/40 dark:to-[#070e1c]" />
          <CareerBackdrop variant="form" />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{c.formEyebrow}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">{c.formTitle}</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">{c.formSubtitle}</p>
            </Reveal>

            <Reveal delay={120}>
              <CandidatureForm lang={lang} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
