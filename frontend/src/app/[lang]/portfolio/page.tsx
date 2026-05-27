import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { IconArrowRight } from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/projects";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

type Achievement = { value: string; label: string };

type Content = {
  eyebrow: string;
  title: string;
  subtitle: string;
  allLabel: string;
  resultLabel: string;
  note: string;
  context: string;
  contextTeam: string;
  achievementsTitle: string;
  achievements: Achievement[];
  stackTitle: string;
  stack: string[];
  ctaTitle: string;
  ctaButton: string;
};

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "HTML5 · CSS3",
  "Tailwind CSS",
  "Prisma",
  "SQL Server",
  "JIRA",
];

const CONTENT: Record<Lang, Content> = {
  fr: {
    eyebrow: "Réalisations",
    title: "Des projets qui créent de la valeur",
    subtitle:
      "Une sélection de produits livrés en production pour des groupes multinationaux. De la conception au déploiement, en équipe.",
    allLabel: "Tous",
    resultLabel: "portée",
    note: "Projets réels livrés en production.",
    context:
      "En collaboration avec SOFTRONIC INNOVING — direction Armel SIME (PDG). Équipe : Brailain Loic TONBA et ses collègues.",
    contextTeam: "Armel SIME (PDG SOFTRONIC INNOVING) · Brailain Loic TONBA · équipe SOFTRONIC INNOVING",
    achievementsTitle: "Impact mesuré",
    achievements: [
      { value: "−30%", label: "temps de chargement" },
      { value: "+25%", label: "stabilité des applications" },
      { value: "11", label: "pays couverts (Afrique)" },
      { value: "3", label: "groupes multinationaux servis" },
    ],
    stackTitle: "Stack maîtrisée",
    stack: STACK,
    ctaTitle: "Votre projet sera le prochain ?",
    ctaButton: "Discutons-en",
  },
  en: {
    eyebrow: "Work",
    title: "Projects that create value",
    subtitle:
      "A selection of products shipped to production for multinational groups. Concept to deployment, with the team.",
    allLabel: "All",
    resultLabel: "scope",
    note: "Real projects, live in production.",
    context:
      "In collaboration with SOFTRONIC INNOVING — led by Armel SIME (CEO). Team: Brailain Loic TONBA and colleagues.",
    contextTeam: "Armel SIME (CEO SOFTRONIC INNOVING) · Brailain Loic TONBA · SOFTRONIC INNOVING team",
    achievementsTitle: "Measured impact",
    achievements: [
      { value: "−30%", label: "page load time" },
      { value: "+25%", label: "application stability" },
      { value: "11", label: "African countries reached" },
      { value: "3", label: "multinational groups served" },
    ],
    stackTitle: "Stack we master",
    stack: STACK,
    ctaTitle: "Will your project be next?",
    ctaButton: "Let's talk",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: c.eyebrow,
    description: c.subtitle,
    alternates: {
      canonical: `/${lang}/portfolio`,
      languages: { fr: "/fr/portfolio", en: "/en/portfolio" },
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];
  const projects = getProjects(lang);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Hero éditorial */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface pt-32 pb-16 dark:from-slate-950 dark:to-[#070e1c] sm:pt-40">
          <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/3 h-[360px] w-[360px] rounded-full bg-brand-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 h-[300px] w-[300px] rounded-full bg-sky/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {c.eyebrow}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl lg:text-6xl">
                {c.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">{c.subtitle}</p>
              <p className="mt-2 text-sm italic text-muted/80">{c.note}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-brand-100 bg-white/70 px-5 py-2.5 text-xs font-medium text-brand-800 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-brand-100">
                <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />
                {c.context}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Impact mesuré (compteurs) */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="grid gap-6 rounded-3xl border border-brand-100 bg-white p-8 dark:border-white/10 dark:bg-slate-900 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
                {c.achievements.map((a, i) => (
                  <div key={a.label} className="relative">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1 hidden h-12 w-px bg-brand-100 lg:block dark:bg-white/10"
                      />
                    )}
                    <div className="text-4xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300 sm:text-5xl">
                      {a.value}
                    </div>
                    <div className="mt-2 text-sm font-medium text-muted">
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stack */}
            <Reveal delay={120} className="mt-10">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                  {c.stackTitle}
                </span>
                <div className="marquee-mask overflow-hidden">
                  <ul className="marquee-track items-center text-sm font-semibold text-brand-800 dark:text-brand-100">
                    {[...c.stack, ...c.stack].map((t, i) => (
                      <li key={`${t}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
                        <span className="size-1.5 rounded-full bg-brand-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Grille des projets */}
        <section className="bg-surface pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <PortfolioGrid
              projects={projects}
              allLabel={c.allLabel}
              resultLabel={c.resultLabel}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -top-10 size-60 rounded-full bg-brand-500/30 blur-3xl animate-float-slow"
              />
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
