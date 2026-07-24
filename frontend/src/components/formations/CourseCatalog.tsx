"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconClock, IconPlay } from "@/components/icons";
import type { Course, CourseCategory } from "@/lib/courses";

export function CourseCatalog({
  categories,
  courses,
  initialCategory = "all",
}: {
  categories: CourseCategory[];
  courses: Course[];
  initialCategory?: string;
}) {
  const { lang, localePath } = useLang();
  const [cat, setCat] = useState(initialCategory);

  // Synchronise le filtre quand la catégorie change via l'URL (menu, cartes de
  // domaine) alors qu'on est DÉJÀ sur la page — sinon l'état resterait figé sur
  // la valeur initiale et le clic « ne renverrait nulle part » visuellement.
  useEffect(() => {
    setCat(initialCategory);
  }, [initialCategory]);

  const allLabel = lang === "fr" ? "Tous les cours" : "All courses";
  const lessonsLabel = lang === "fr" ? "leçons" : "lessons";

  const filtered = cat === "all" ? courses : courses.filter((c) => c.category === cat);

  const chip = (active: boolean) =>
    `rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
      active
        ? "border-brand-700 bg-brand-700 text-white"
        : "border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50 dark:border-white/15 dark:bg-slate-900 dark:text-brand-200 dark:hover:bg-white/5"
    }`;

  return (
    <div>
      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={() => setCat("all")} className={chip(cat === "all")}>
          {allLabel}
        </button>
        {categories.map((c) => (
          <button key={c.slug} type="button" onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Grille de cours */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course, i) => (
          <Reveal key={course.slug} delay={(i % 3) * 80}>
            <Link
              href={localePath(`/formations/${course.slug}`)}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              {/* Vignette */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                {/* Badges */}
                <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-700 shadow">
                  {course.level}
                </span>
                <span className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-bold shadow ${
                  course.free ? "bg-emerald-500 text-white" : "bg-brand-700 text-white"
                }`}>
                  {course.price}
                </span>
                {/* Bouton lecture */}
                <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-brand-700 shadow-lg transition-transform group-hover:scale-110">
                  <IconPlay className="size-4" />
                </span>
              </div>

              {/* Corps */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 line-clamp-2">
                  {course.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{course.subtitle}</p>

                {/* Méta */}
                <div className="mt-4 flex items-center gap-3 text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-1">
                    <IconClock className="size-3.5" />
                    {course.durationHours} h
                  </span>
                  <span aria-hidden>·</span>
                  <span>{course.lessonsCount} {lessonsLabel}</span>
                </div>

                {/* Formateur + flèche */}
                <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-3 dark:border-white/10">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-brand-900 dark:text-white">{course.instructor.name}</div>
                    {course.instructor.role && <div className="truncate text-[11px] text-muted">{course.instructor.role}</div>}
                  </div>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-white/5 dark:text-brand-200">
                    <IconArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
