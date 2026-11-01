import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CTA } from "@/components/sections/CTA";
import { CaseGallery } from "@/components/portfolio/CaseGallery";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { isLocale, type Lang } from "@/i18n/dictionaries";
import { CASE_SLUGS, CASE_STUDIES, getCaseStudy } from "@/lib/caseStudies";
import { galleryFor } from "@/lib/projectGalleries";

type Params = { lang: string; slug: string };

export const dynamicParams = false;

// Le segment parent [lang] génère déjà la locale : on ne renvoie que le slug.
export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!isLocale(lang) || !cs) return {};
  const c = cs.content[lang];
  return {
    title: `${cs.titles[lang]} · ${lang === "fr" ? "Étude de cas" : "Case study"}`,
    description: c.intro,
    alternates: {
      canonical: `/${lang}/portfolio/${slug}`,
      languages: { fr: `/fr/portfolio/${slug}`, en: `/en/portfolio/${slug}` },
    },
    openGraph: { title: cs.titles[lang], description: c.tagline, images: cs.cover ? [cs.cover] : [cs.logo] },
  };
}

const L = {
  fr: {
    eyebrow: "Étude de cas",
    solution: "Solution Zayra",
    client: "Projet client",
    clientLabel: "Client",
    sectorLabel: "Secteur",
    typeLabel: "Type",
    statusLabel: "Statut",
    challenge: "Le besoin",
    approach: "Notre réponse",
    servicesEyebrow: "Ce que nous avons réalisé",
    servicesTitle: "Les services livrés",
    featuresEyebrow: "Fonctionnalités",
    featuresTitle: "Ce que la plateforme permet",
    galleryEyebrow: "En images",
    galleryTitle: "Captures réelles",
    resultsEyebrow: "Résultats",
    resultsTitle: "Ce que le projet a apporté",
    stackEyebrow: "Technologies",
    stackTitle: "La stack technique",
    links: "Liens",
    visit: "Voir le site",
    dossier: "Télécharger le dossier des réalisations (PDF)",
    back: "Toutes les réalisations",
    others: "Autres réalisations",
  },
  en: {
    eyebrow: "Case study",
    solution: "Zayra solution",
    client: "Client project",
    clientLabel: "Client",
    sectorLabel: "Sector",
    typeLabel: "Type",
    statusLabel: "Status",
    challenge: "The need",
    approach: "Our answer",
    servicesEyebrow: "What we delivered",
    servicesTitle: "Services delivered",
    featuresEyebrow: "Features",
    featuresTitle: "What the platform does",
    galleryEyebrow: "In pictures",
    galleryTitle: "Real screenshots",
    resultsEyebrow: "Results",
    resultsTitle: "What the project delivered",
    stackEyebrow: "Technologies",
    stackTitle: "The tech stack",
    links: "Links",
    visit: "Visit site",
    dossier: "Download the portfolio dossier (PDF)",
    back: "All projects",
    others: "Other projects",
  },
} satisfies Record<Lang, Record<string, string>>;

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!isLocale(lang) || !cs) notFound();

  const t = L[lang];
  const c = cs.content[lang];
  const title = cs.titles[lang];
  const gallery = galleryFor(cs.titles.fr);
  const links = cs.links[lang];
  const dossier = `/docs/dossier-realisations-${lang}.pdf`;
  const others = CASE_STUDIES.filter((o) => o.slug !== slug).slice(0, 3);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ═══ HERO : capture réelle en fond, logo, accroche ═══ */}
        <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden pt-28 pb-14">
          {cs.cover ? (
            <Image src={cs.cover} alt="" fill priority sizes="100vw" className="-z-20 scale-110 object-cover object-top opacity-40 blur-xl" />
          ) : (
            <div aria-hidden className={`absolute inset-0 -z-20 bg-gradient-to-br ${cs.gradient}`} />
          )}
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/95 via-brand-900/90 to-slate-900/92" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.12]" />

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <Link href={`/${lang}/portfolio`} className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                ← {t.back}
              </Link>
            </Reveal>
            <Reveal delay={60}>
              <div className="mx-auto mt-6 flex h-24 w-56 items-center justify-center bg-white/95 p-3 shadow-2xl">
                <div className="relative h-full w-full">
                  <Image src={cs.logo} alt={`Logo ${title}`} fill sizes="224px" className="object-contain" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                {t.eyebrow} · {cs.kind === "solution" ? t.solution : t.client}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{c.tagline}</p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {links[0] && (
                  <a href={links[0].href} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-xl shadow-black/20 transition-transform hover:scale-[1.03]">
                    {t.visit}
                    <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
                <a href={dossier} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
                  {t.dossier}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ FICHE D'IDENTITÉ ═══ */}
        <section className="border-b border-brand-100 bg-white dark:border-white/10 dark:bg-[#070e1c]">
          <dl className="mx-auto grid max-w-7xl gap-px bg-brand-100 sm:grid-cols-2 lg:grid-cols-4 dark:bg-white/10">
            {[
              [t.clientLabel, c.client],
              [t.sectorLabel, c.sector],
              [t.typeLabel, cs.kind === "solution" ? t.solution : t.client],
              [t.statusLabel, c.results[0]],
            ].map(([k, v]) => (
              <div key={k} className="bg-white px-6 py-6 dark:bg-[#070e1c]">
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">{k}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-brand-900 dark:text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ═══ PRÉSENTATION + BESOIN / RÉPONSE ═══ */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted sm:text-lg">{c.intro}</p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[[t.challenge, c.challenge], [t.approach, c.approach]].map(([k, v], i) => (
                <Reveal key={k} delay={i * 80}>
                  <article className="h-full bg-surface p-7 shadow-sm dark:bg-white/5">
                    <span className={`inline-block h-1 w-10 bg-gradient-to-r ${cs.gradient}`} />
                    <h2 className="mt-4 text-xl font-extrabold tracking-tight text-brand-900 dark:text-white">{k}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{v}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SERVICES LIVRÉS ═══ */}
        <section className="relative overflow-hidden bg-surface py-14 dark:bg-slate-900 sm:py-16">
          <div aria-hidden className="absolute inset-0 bg-grid-soft opacity-30" />
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <SectionHeading eyebrow={t.servicesEyebrow} title={t.servicesTitle} />
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {c.services.map((s) => (
                <Reveal key={s}>
                  <li className="flex items-center gap-3 bg-white px-5 py-4 text-sm font-medium text-brand-900 shadow-sm dark:bg-white/5 dark:text-white">
                    <span className={`inline-flex size-7 shrink-0 items-center justify-center bg-gradient-to-br ${cs.gradient} text-white`}>
                      <IconCheck className="size-4" />
                    </span>
                    {s}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ═══ FONCTIONNALITÉS ═══ */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading eyebrow={t.featuresEyebrow} title={t.featuresTitle} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 70}>
                  <article className="group relative h-full overflow-hidden bg-surface p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-white/5">
                    <span className="text-3xl font-extrabold leading-none text-brand-100 dark:text-white/10">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 text-base font-bold text-brand-900 dark:text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
                    <span aria-hidden className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${cs.gradient} transition-transform duration-700 group-hover:scale-x-100`} />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ GALERIE ═══ */}
        {gallery && (
          <section className="relative overflow-hidden bg-surface py-14 dark:bg-slate-900 sm:py-16">
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
              <SectionHeading eyebrow={t.galleryEyebrow} title={t.galleryTitle} />
              <div className="mt-10">
                <CaseGallery groups={gallery} lang={lang} projectTitle={title} />
              </div>
            </div>
          </section>
        )}

        {/* ═══ RÉSULTATS ═══ */}
        <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-16">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading eyebrow={t.resultsEyebrow} title={t.resultsTitle} light />
            <ul className={`mx-auto mt-10 grid gap-5 ${c.results.length > 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "max-w-3xl sm:grid-cols-2"}`}>
              {c.results.map((r, i) => (
                <Reveal key={r} delay={i * 70}>
                  <li className="h-full border border-white/12 bg-white/[0.05] p-6">
                    <span className="text-sm font-extrabold text-sky">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-white">{r}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ═══ STACK + LIENS ═══ */}
        <section className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <SectionHeading eyebrow={t.stackEyebrow} title={t.stackTitle} />
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {cs.stack.map((s) => (
                <li key={s.name} className="inline-flex items-center gap-2.5 border border-brand-100 bg-surface px-4 py-2.5 text-sm font-semibold text-brand-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                  {s.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.icon} alt="" width={22} height={22} className="size-5.5 object-contain" />
                  )}
                  {s.name}
                </li>
              ))}
            </ul>

            {links.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{t.links}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-800">
                      {l.label}
                      <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ TÉMOIGNAGE ═══ */}
        {cs.testimonial && (
          <section className="bg-surface py-14 dark:bg-slate-900 sm:py-16">
            <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
              <p className="text-2xl font-semibold leading-relaxed text-brand-900 dark:text-white sm:text-[1.6rem]">
                « {cs.testimonial.quote[lang]} »
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="round-portrait relative size-14 overflow-hidden ring-2 ring-brand-100">
                  <Image src={cs.testimonial.photo} alt={cs.testimonial.name} fill sizes="56px" className="object-cover object-top" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-brand-900 dark:text-white">{cs.testimonial.name}</p>
                  <p className="text-sm text-muted">{cs.testimonial.role[lang]}</p>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ═══ AUTRES RÉALISATIONS ═══ */}
        <section className="bg-white py-12 dark:bg-[#070e1c]">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{t.others}</p>
              <a href={dossier} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline dark:text-brand-200">
                {t.dossier}
              </a>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 80}>
                  <Link href={`/${lang}/portfolio/${o.slug}`}
                    className="group flex items-center gap-4 bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-white/5">
                    <div className="relative size-14 shrink-0 bg-white p-1.5 ring-1 ring-brand-100">
                      <Image src={o.logo} alt="" fill sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-brand-500">{o.content[lang].sector}</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-brand-900 dark:text-white">{o.titles[lang]}</p>
                    </div>
                    <IconArrowRight className="size-5 shrink-0 text-brand-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
