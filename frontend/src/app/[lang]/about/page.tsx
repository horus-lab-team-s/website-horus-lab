import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconCheck, IconCog, IconEye, IconSpark } from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

type Content = {
  eyebrow: string;
  title: string;
  intro: string;
  pillars: { h: string; body: string }[];
  valuesTitle: string;
  valuesSubtitle: string;
  values: { title: string; desc: string }[];
  storyTitle: string;
  story: string[];
  ctaTitle: string;
  ctaButton: string;
  stats: { value: string; label: string }[];
};

const CONTENT: Record<Lang, Content> = {
  fr: {
    eyebrow: "À propos",
    title: "Au-delà des frontières, au service de votre impact",
    intro:
      "Horus-Lab est une entreprise technologique africaine. Nous concevons des produits numériques — web, mobile, ERP, logiciels sur-mesure et intelligence artificielle — pensés pour les réalités du continent et conçus pour durer.",
    pillars: [
      {
        h: "Notre mission",
        body: "Rendre la technologie de pointe accessible et utile aux organisations africaines, en les accompagnant de l'idée jusqu'à l'impact.",
      },
      {
        h: "Notre vision",
        body: "Une Afrique qui construit ses propres solutions numériques, à la hauteur des standards mondiaux — et au-delà des frontières.",
      },
    ],
    valuesTitle: "Nos valeurs",
    valuesSubtitle: "Ce qui guide chacune de nos décisions et de nos lignes de code.",
    values: [
      { title: "Excellence technique", desc: "Des solutions robustes, performantes et maintenables, sans compromis sur la qualité." },
      { title: "Proximité & écoute", desc: "Nous travaillons avec vous, pas seulement pour vous : transparence et disponibilité." },
      { title: "Innovation utile", desc: "La bonne technologie au service d'un problème réel — jamais l'inverse." },
      { title: "Impact durable", desc: "Nous construisons pour durer : code pérenne, documentation et transfert de compétences." },
    ],
    storyTitle: "Notre approche",
    story: [
      "Née de la conviction que l'Afrique a tout pour devenir un acteur majeur du numérique, Horus-Lab réunit des talents pluridisciplinaires autour d'une exigence commune : la qualité.",
      "Nous avançons par incréments, en livrant de la valeur tôt et souvent, et en gardant nos clients aux commandes à chaque étape.",
    ],
    ctaTitle: "Construisons quelque chose de durable ensemble.",
    ctaButton: "Démarrer un projet",
    stats: [
      { value: "8+", label: "projets livrés" },
      { value: "4", label: "pôles d'expertise" },
      { value: "8+", label: "secteurs servis" },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Beyond borders, in service of your impact",
    intro:
      "Horus-Lab is an African technology company. We build digital products — web, mobile, ERPs, custom software and artificial intelligence — designed for the realities of the continent and built to last.",
    pillars: [
      {
        h: "Our mission",
        body: "Make leading-edge technology accessible and useful to African organizations, guiding them from idea to impact.",
      },
      {
        h: "Our vision",
        body: "An Africa that builds its own digital solutions, matching world-class standards — and reaching beyond borders.",
      },
    ],
    valuesTitle: "Our values",
    valuesSubtitle: "What guides every decision and every line of code.",
    values: [
      { title: "Technical excellence", desc: "Robust, performant and maintainable solutions, with no compromise on quality." },
      { title: "Closeness & listening", desc: "We work with you, not just for you: transparency and availability." },
      { title: "Useful innovation", desc: "The right technology for a real problem — never the other way around." },
      { title: "Lasting impact", desc: "We build to last: durable code, documentation and skills transfer." },
    ],
    storyTitle: "Our approach",
    story: [
      "Born from the belief that Africa has everything it takes to become a major digital player, Horus-Lab brings together cross-functional talent around one shared standard: quality.",
      "We move in increments, delivering value early and often, and keeping our clients in control at every step.",
    ],
    ctaTitle: "Let's build something lasting together.",
    ctaButton: "Start a project",
    stats: [
      { value: "8+", label: "projects delivered" },
      { value: "4", label: "areas of expertise" },
      { value: "8+", label: "industries served" },
    ],
  },
};

const VALUE_ICONS = [IconCog, IconEye, IconSpark, IconCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: lang === "fr" ? "À propos" : "About",
    description: c.intro,
    alternates: {
      canonical: `/${lang}/about`,
      languages: { fr: "/fr/about", en: "/en/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Intro */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-surface pt-32 pb-16 dark:from-slate-950 dark:via-[#0a1326] dark:to-[#070e1c] sm:pt-40 sm:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/4 size-[40rem] -translate-x-1/2 rounded-full aurora opacity-20" />
            <div className="absolute inset-0 bg-grid opacity-50" />
          </div>
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-brand-200">
                  <IconEye className="size-4 text-brand-500" />
                  {c.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                  {c.title}
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{c.intro}</p>
              </Reveal>
            </div>
            <Reveal delay={200} className="hidden lg:block">
              <div className="relative mx-auto aspect-square w-full max-w-sm">
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-100 to-sky/30 blur-2xl dark:from-brand-700/30 dark:to-sky/10" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="animate-float rounded-full bg-white p-3 shadow-2xl shadow-brand-900/15 ring-1 ring-brand-100 dark:ring-white/10">
                    <Image
                      src="/Logo-HORUS-LAB.jpeg"
                      alt="Horus-Lab"
                      width={260}
                      height={260}
                      priority
                      className="size-52 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-white py-16 dark:bg-[#070e1c] sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
            {c.pillars.map((p, i) => (
              <Reveal key={p.h} delay={i * 100}>
                <article className="h-full rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/50 to-white p-8 dark:border-white/10 dark:from-slate-900 dark:to-slate-900">
                  <h2 className="text-xl font-bold text-brand-900 dark:text-white">{p.h}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Valeurs */}
        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">
                {c.valuesTitle}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">
                {c.valuesSubtitle}
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.values.map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? IconCheck;
                return (
                  <Reveal key={v.title} delay={i * 90}>
                    <article className="h-full rounded-3xl border border-brand-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/10 dark:border-white/10 dark:bg-slate-900">
                      <div className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/25">
                        <Icon className="size-7" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-brand-900 dark:text-white">
                        {v.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.desc}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Histoire + stats */}
        <section className="bg-white py-20 dark:bg-[#070e1c] sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">
                {c.storyTitle}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                {c.story.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {c.stats.map((s) => (
                  <div
                    key={s.label}
                    className="group relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/50 to-white p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10 dark:border-white/10 dark:from-slate-900 dark:to-slate-900 dark:hover:border-white/25"
                  >
                    <dt className="text-4xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300 sm:text-5xl">
                      {s.value}
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-muted">{s.label}</dd>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-brand-300 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                    />
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
                {c.ctaTitle}
              </h2>
              <div className="relative mt-8 flex justify-center">
                <Link
                  href={`/${lang}#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03]"
                >
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
