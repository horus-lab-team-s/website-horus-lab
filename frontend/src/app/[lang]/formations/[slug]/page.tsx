import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CoursePlayer } from "@/components/formations/CoursePlayer";
import {
  IconArrowRight, IconBook, IconCheck, IconClock, IconPlay,
} from "@/components/icons";
import { isLocale, type Lang } from "@/i18n/dictionaries";
import { getCmsCourse, getCmsCourseSlugs, getCmsFormations } from "@/lib/cms";

type Params = { lang: string; slug: string };

export const dynamicParams = false;
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getCmsCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

const T: Record<Lang, {
  backLabel: string; enroll: string; preview: string; freeAccess: string;
  learnTitle: string; curriculumTitle: string; modulesLabel: string; lessonsLabel: string;
  instructorTitle: string; otherTitle: string; level: string; duration: string;
  ctaNote: string;
}> = {
  fr: {
    backLabel: "Toutes les formations", enroll: "S'inscrire à ce cours", preview: "Aperçu du cours",
    freeAccess: "Accès encadré par nos formateurs",
    learnTitle: "Ce que vous allez apprendre", curriculumTitle: "Programme du cours",
    modulesLabel: "modules", lessonsLabel: "leçons", instructorTitle: "Votre formateur",
    otherTitle: "Autres formations", level: "Niveau", duration: "Durée",
    ctaNote: "Inscription et suivi assurés par l'équipe Horus-Lab.",
  },
  en: {
    backLabel: "All courses", enroll: "Enroll in this course", preview: "Course preview",
    freeAccess: "Guided by our instructors",
    learnTitle: "What you'll learn", curriculumTitle: "Course curriculum",
    modulesLabel: "modules", lessonsLabel: "lessons", instructorTitle: "Your instructor",
    otherTitle: "Other courses", level: "Level", duration: "Duration",
    ctaNote: "Enrollment and follow-up handled by the Horus-Lab team.",
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const course = await getCmsCourse(lang, slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.subtitle,
    alternates: {
      canonical: `/${lang}/formations/${slug}`,
      languages: { fr: `/fr/formations/${slug}`, en: `/en/formations/${slug}` },
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const course = await getCmsCourse(lang, slug);
  if (!course) notFound();
  const t = T[lang];
  const { categories, courses } = await getCmsFormations(lang);
  const category = categories.find((x) => x.slug === course.category);
  const others = courses.filter((x) => x.slug !== slug && x.category === course.category).slice(0, 3);
  const totalLessons = course.curriculum.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>

        {/* ── Hero du cours ── */}
        <section className="relative overflow-hidden bg-brand-900 pt-28 pb-16 sm:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.1]" />
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Texte */}
            <div>
              <Link href={`/${lang}/formations`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200 transition-colors hover:text-white">
                <IconArrowRight className="size-4 rotate-180" />
                {t.backLabel}
              </Link>

              {category && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {category.name}
                </span>
              )}

              <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-100/90">{course.subtitle}</p>

              {/* Méta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-100">
                <span className="inline-flex items-center gap-1.5"><IconBook className="size-4 text-sky" />{t.level} : <b className="text-white">{course.level}</b></span>
                <span className="inline-flex items-center gap-1.5"><IconClock className="size-4 text-sky" />{course.durationHours} h</span>
                <span className="inline-flex items-center gap-1.5"><IconPlay className="size-3.5 text-sky" />{course.lessonsCount} {t.lessonsLabel}</span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/${lang}/contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-xl shadow-brand-900/30 transition-all hover:scale-[1.04]">
                  {t.enroll}
                  <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold ${
                  course.free ? "bg-emerald-500 text-white" : "bg-white/10 text-white ring-1 ring-white/20"
                }`}>
                  {course.price}
                </span>
              </div>
            </div>

            {/* Carte aperçu vidéo — vraie vidéo de cours (YouTube) */}
            <Reveal>
              <CoursePlayer videoUrl={course.videoUrl} image={course.image} title={course.title} label={t.preview} />
            </Reveal>
          </div>
        </section>

        {/* ── Contenu ── */}
        <section className="bg-white py-16 dark:bg-[#070e1c] sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_0.6fr]">

            {/* Colonne principale */}
            <div>
              <Reveal>
                <p className="text-lg leading-relaxed text-muted">{course.intro}</p>
              </Reveal>

              {/* Ce que vous apprendrez */}
              <Reveal className="mt-12">
                <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white">{t.learnTitle}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.learn.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-md border border-brand-100 bg-surface/60 p-4 dark:border-white/10 dark:bg-white/5">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-brand-700 text-white">
                        <IconCheck className="size-4" />
                      </span>
                      <span className="text-sm leading-relaxed text-ink dark:text-brand-50">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Programme */}
              <Reveal className="mt-12">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white">{t.curriculumTitle}</h2>
                  <span className="text-sm font-medium text-muted">
                    {course.curriculum.length} {t.modulesLabel} · {totalLessons} {t.lessonsLabel}
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  {course.curriculum.map((mod, i) => (
                    <div key={mod.title} className="overflow-hidden rounded-lg border border-brand-100 dark:border-white/10">
                      <div className="flex items-center gap-3 bg-surface/70 px-5 py-3.5 dark:bg-white/5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-700 text-xs font-bold text-white">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-bold text-brand-900 dark:text-white">{mod.title}</h3>
                        <span className="ml-auto text-xs text-muted">{mod.lessons.length} {t.lessonsLabel}</span>
                      </div>
                      <ul className="divide-y divide-brand-100/70 dark:divide-white/10">
                        {mod.lessons.map((lesson) => (
                          <li key={lesson} className="flex items-center gap-3 px-5 py-3 text-sm text-ink/80 dark:text-brand-100/80">
                            <IconPlay className="size-3.5 shrink-0 text-brand-500" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Colonne latérale : formateur + inscription */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5 dark:border-white/10 dark:bg-slate-900">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">{t.instructorTitle}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand-700 to-brand-500 text-base font-bold text-white">
                    {course.instructor.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-brand-900 dark:text-white">{course.instructor.name}</div>
                    {course.instructor.role && <div className="text-xs text-muted">{course.instructor.role}</div>}
                  </div>
                </div>

                <div className="mt-6 border-t border-brand-100 pt-5 dark:border-white/10">
                  <Link href={`/${lang}/contact`}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800">
                    {t.enroll}
                    <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="mt-3 text-center text-xs text-muted">{t.ctaNote}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Autres cours ── */}
        {others.length > 0 && (
          <section className="bg-surface py-16 dark:bg-[#070e1c] sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white">{t.otherTitle}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <Link key={o.slug} href={`/${lang}/formations/${o.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={o.image} alt={o.title} fill sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-brand-700">{o.level}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white line-clamp-2">{o.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted line-clamp-2">{o.subtitle}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-300">
                        {o.durationHours} h · {o.lessonsCount} {t.lessonsLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
