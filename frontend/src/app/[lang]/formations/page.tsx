import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CourseCatalog } from "@/components/formations/CourseCatalog";
import { DomainSlides } from "@/components/formations/DomainSlides";
import {
  IconArrowRight, IconCode, IconCog, IconEye, IconLayers, IconSpark,
} from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";
import { getCmsFormations } from "@/lib/cms";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

const CAT_ICON = {
  code: IconCode, layers: IconLayers, spark: IconSpark, eye: IconEye, cog: IconCog,
} as const;

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; subtitle: string;
  catsTitle: string; catsSubtitle: string;
  catalogTitle: string; catalogSubtitle: string;
  coursesLabel: string; catsLabel: string; freeLabel: string;
  ctaTitle: string; ctaSubtitle: string; ctaButton: string;
}> = {
  fr: {
    eyebrow: "Formations",
    title: "Montez en compétences en technologies",
    subtitle: "Des cours, des concepts et des vidéos pour apprendre le développement, la data, la cybersécurité et le cloud — à votre rythme, encadrés par nos ingénieurs.",
    catsTitle: "Explorez par domaine",
    catsSubtitle: "Choisissez un parcours et progressez pas à pas, du débutant à l'avancé.",
    catalogTitle: "Notre catalogue de cours",
    catalogSubtitle: "Filtrez par domaine et trouvez la formation qui vous correspond.",
    coursesLabel: "cours",
    catsLabel: "domaines",
    freeLabel: "cours gratuits",
    ctaTitle: "Une formation sur mesure pour votre équipe ?",
    ctaSubtitle: "Nous concevons aussi des programmes adaptés à vos besoins et à votre niveau.",
    ctaButton: "Discuter de votre besoin",
  },
  en: {
    eyebrow: "Courses",
    title: "Level up your tech skills",
    subtitle: "Courses, concepts and videos to learn development, data, cybersecurity and cloud — at your own pace, guided by our engineers.",
    catsTitle: "Explore by field",
    catsSubtitle: "Pick a track and progress step by step, from beginner to advanced.",
    catalogTitle: "Our course catalogue",
    catalogSubtitle: "Filter by field and find the course that fits you.",
    coursesLabel: "courses",
    catsLabel: "fields",
    freeLabel: "free courses",
    ctaTitle: "A tailored training for your team?",
    ctaSubtitle: "We also design programmes adapted to your needs and your level.",
    ctaButton: "Discuss your needs",
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: c.eyebrow,
    description: c.subtitle,
    alternates: { canonical: `/${lang}/formations`, languages: { fr: "/fr/formations", en: "/en/formations" } },
  };
}

export default async function FormationsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { cat } = await searchParams;
  const c = CONTENT[lang];
  const { categories, courses } = await getCmsFormations(lang);
  const freeCount = courses.filter((x) => x.free).length;
  const initialCategory = cat && categories.some((x) => x.slug === cat) ? cat : "all";

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ── Hero ── */}
        <section className="relative isolate flex min-h-[52vh] items-center overflow-hidden pt-24 pb-12 sm:pb-14">
          {/* Diaporama d'images par domaine (pas de vidéo : un aperçu vidéo est déjà sur chaque cours) */}
          <DomainSlides />

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <span className="size-1.5 rounded-full bg-sky glow-pulse" />
                {c.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={40}>
              <div className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-emerald-500 px-5 py-2 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-emerald-900/30">
                <span>{lang === "fr" ? "100% Gratuit" : "100% Free"}</span>
                <span aria-hidden className="opacity-70">·</span>
                <span>{lang === "fr" ? "Démarrage le 1er septembre 2026" : "Starts 1 September 2026"}</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-4xl lg:text-5xl">
                {c.title}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/88">{c.subtitle}</p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/80">
                {lang === "fr"
                  ? "Cette page est un aperçu. La formation complète et le suivi des apprenants se déroulent sur notre application mobile Edlearning (disponible sur Play Store)."
                  : "This page is a preview. The full training and learner tracking happen on our Edlearning mobile app (available on Play Store)."}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <dl className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
                <div><dt className="text-3xl font-extrabold text-white">{courses.length}</dt><dd className="mt-1 text-sm text-brand-100">{c.coursesLabel}</dd></div>
                <div><dt className="text-3xl font-extrabold text-white">{categories.length}</dt><dd className="mt-1 text-sm text-brand-100">{c.catsLabel}</dd></div>
                <div><dt className="text-3xl font-extrabold text-white">{freeCount}</dt><dd className="mt-1 text-sm text-brand-100">{c.freeLabel}</dd></div>
              </dl>
            </Reveal>
          </div>

        </section>

        {/* ── Catégories / parcours ── */}
        <section className="bg-white pt-10 pb-12 dark:bg-[#070e1c] sm:pt-12 sm:pb-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading
              eyebrow={lang === "fr" ? "Parcours" : "Tracks"}
              title={c.catsTitle}
              subtitle={c.catsSubtitle}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const Icon = CAT_ICON[cat.iconKey];
                const count = courses.filter((x) => x.category === cat.slug).length;
                return (
                  <Reveal key={cat.slug} delay={(i % 4) * 70}>
                    <Link
                      href={`/${lang}/formations?cat=${cat.slug}#catalogue`}
                      className="group flex h-full items-start gap-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-md bg-brand-700 text-white shadow-lg transition-transform group-hover:scale-110">
                        <Icon className="size-6" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-brand-900 dark:text-white">{cat.name}</h3>
                        <p className="mt-1 text-sm text-muted">{cat.tagline}</p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-300">
                          {count} {c.coursesLabel}
                          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Catalogue ── */}
        <section id="catalogue" className="scroll-mt-24 bg-surface pt-10 pb-12 dark:bg-[#070e1c] sm:pt-12 sm:pb-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading
              eyebrow={lang === "fr" ? "Cours" : "Courses"}
              title={c.catalogTitle}
              subtitle={c.catalogSubtitle}
            />

            <div className="mt-8">
              <CourseCatalog categories={categories} courses={courses} initialCategory={initialCategory} />
            </div>
          </div>
        </section>

        {/* ── CTA formation sur mesure ── */}
        <section className="bg-white px-5 py-12 dark:bg-[#070e1c] sm:px-8 sm:py-14">
          <Reveal className="relative mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-8 text-center shadow-2xl shadow-brand-900/40 sm:px-14 sm:py-10">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.1]" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{c.ctaTitle}</h2>
                <p className="mx-auto mt-3 max-w-xl text-white/90">{c.ctaSubtitle}</p>
                <div className="mt-8">
                  <Link href={`/${lang}/contact`}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-xl shadow-brand-900/30 transition-all hover:scale-[1.04]">
                    {c.ctaButton}
                    <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

      </main>
      <Footer />
    </>
  );
}
