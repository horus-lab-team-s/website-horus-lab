import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { IconArrowRight } from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";
import { getCmsProjects } from "@/lib/cms";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; subtitle: string;
  allLabel: string; resultLabel: string;
  ctaTitle: string; ctaButton: string;
}> = {
  fr: {
    eyebrow: "Réalisations",
    title: "Des projets qui créent de la valeur",
    subtitle: "Une sélection de produits livrés en production, du concept au déploiement.",
    allLabel: "Tous",
    resultLabel: "portée",
    ctaTitle: "Votre projet sera le prochain ?",
    ctaButton: "Discutons-en",
  },
  en: {
    eyebrow: "Work",
    title: "Projects that create value",
    subtitle: "A selection of products shipped to production, concept to deployment.",
    allLabel: "All",
    resultLabel: "scope",
    ctaTitle: "Will your project be next?",
    ctaButton: "Let's talk",
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: c.eyebrow,
    description: c.subtitle,
    alternates: { canonical: `/${lang}/portfolio`, languages: { fr: "/fr/portfolio", en: "/en/portfolio" } },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];
  const projects = await getCmsProjects(lang);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ── Hero avec vague en bas ── */}
        <section className="relative isolate flex min-h-[72vh] items-center overflow-hidden pt-28 pb-32">
          {/* Image fond */}
          <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=1920&q=85)` }} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/72 via-brand-900/55 to-slate-900/65" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.14]" />
          {/* Particules */}
          {[
            { x:"8%",y:"22%",d:"0s"   },{ x:"88%",y:"14%",d:"1.2s" },
            { x:"25%",y:"76%",d:"0.8s"},{ x:"72%",y:"80%",d:"2s"  },
            { x:"50%",y:"28%",d:"1.5s"},
          ].map((p,i) => (
            <div key={i} aria-hidden className="absolute size-2 rounded-full bg-white/20 animate-float"
              style={{ left:p.x, top:p.y, animationDelay:p.d }} />
          ))}

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <span className="size-1.5 rounded-full bg-sky glow-pulse" />
                {c.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
                {c.title}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/88">{c.subtitle}</p>
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

        {/* ── Section grille des projets — filtres + formes animées ── */}
        <section className="relative overflow-hidden bg-surface py-16 pb-20 sm:pb-28 dark:bg-[#070e1c]">

          {/* Fond avec formes géométriques animées */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-surface to-brand-50/20 dark:from-[#070e1c] dark:via-slate-900 dark:to-[#0a1326]" />
            <div className="absolute inset-0 bg-grid-soft opacity-40" />
            {/* Halos */}
            <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-200/10 blur-3xl animate-float-slow dark:bg-brand-500/6" />
            <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-sky/8 blur-3xl animate-drift dark:bg-sky/5" />
            <div className="absolute left-1/2 top-0 h-60 w-60 rounded-full bg-rose-100/8 blur-3xl animate-float dark:bg-rose-500/4" style={{ animationDelay:"2s" }} />
            {/* Formes géométriques */}
            {[
              { sh:"circle",   x:"2%",  y:"5%",  sz:52, d:"0s",   dur:"10s" },
              { sh:"square",   x:"92%", y:"3%",  sz:40, d:"1.3s", dur:"9s"  },
              { sh:"triangle", x:"12%", y:"72%", sz:44, d:"0.6s", dur:"11s" },
              { sh:"trapeze",  x:"84%", y:"68%", sz:48, d:"2.0s", dur:"8s"  },
              { sh:"diamond",  x:"46%", y:"4%",  sz:34, d:"1.6s", dur:"10s" },
              { sh:"hex",      x:"66%", y:"82%", sz:42, d:"0.3s", dur:"9s"  },
              { sh:"circle",   x:"28%", y:"40%", sz:28, d:"2.8s", dur:"8s"  },
              { sh:"square",   x:"76%", y:"30%", sz:30, d:"0.9s", dur:"11s" },
              { sh:"octo",     x:"38%", y:"88%", sz:36, d:"1.4s", dur:"9s"  },
              { sh:"diamond",  x:"58%", y:"55%", sz:26, d:"2.2s", dur:"10s" },
              { sh:"triangle", x:"90%", y:"48%", sz:32, d:"0.5s", dur:"8s"  },
              { sh:"hex",      x:"8%",  y:"52%", sz:38, d:"1.9s", dur:"11s" },
            ].map((s, i) => (
              <div key={i} aria-hidden
                className="pointer-events-none absolute animate-float text-brand-400/[0.10] dark:text-brand-300/[0.08]"
                style={{ left:s.x, top:s.y, animationDelay:s.d, animationDuration:s.dur }}
              >
                {s.sh === "circle"   && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="9"/></svg>}
                {s.sh === "square"   && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                {s.sh === "triangle" && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,3 22,21 2,21"/></svg>}
                {s.sh === "trapeze"  && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="5,18 19,18 22,6 2,6"/></svg>}
                {s.sh === "diamond"  && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,2 22,12 12,22 2,12"/></svg>}
                {s.sh === "hex"      && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg>}
                {s.sh === "octo"     && <svg width={s.sz} height={s.sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7"/></svg>}
              </div>
            ))}
          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <PortfolioGrid projects={projects} allLabel={c.allLabel} resultLabel={c.resultLabel} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-surface px-5 pb-24 sm:px-8 dark:bg-[#070e1c]">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 size-60 rounded-full bg-brand-500/30 blur-3xl animate-float-slow" />
              <div aria-hidden className="pointer-events-none absolute -right-8 bottom-0 size-48 rounded-full bg-sky/20 blur-3xl animate-drift" />
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
