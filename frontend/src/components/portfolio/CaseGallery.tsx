"use client";

import Image from "next/image";
import { useState } from "react";
import { IconEye } from "@/components/icons";
import type { GalleryGroup } from "@/lib/projectGalleries";
import { ProjectGallery } from "./ProjectGallery";

/**
 * Aperçu des captures d'une étude de cas : les premières images en grille,
 * chacune ouvrant la galerie complète (ProjectGallery, volets + visionneuse).
 */
export function CaseGallery({ groups, lang, projectTitle }: { groups: GalleryGroup[]; lang: string; projectTitle: string }) {
  const [open, setOpen] = useState(false);
  const isFr = lang === "fr";
  const shots = groups.flatMap((g) => (g.portrait ? [] : g.shots)).slice(0, 4);
  const total = groups.reduce((n, g) => n + g.shots.length, 0);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {shots.map((s) => (
          <button key={s.src} type="button" onClick={() => setOpen(true)}
            className="group relative overflow-hidden bg-white text-left shadow-sm ring-1 ring-brand-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:ring-white/10">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={s.src} alt={isFr ? s.fr : s.en} fill sizes="(max-width:640px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className="border-t border-brand-100 px-5 py-3.5 text-sm font-semibold text-brand-900 dark:border-white/10 dark:text-white">
              {isFr ? s.fr : s.en}
            </p>
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button type="button" onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-brand-200">
          <IconEye className="size-4" />
          {isFr ? `Voir toutes les captures (${total})` : `See all screenshots (${total})`}
        </button>
      </div>
      {open && (
        <ProjectGallery groups={groups} lang={lang} projectTitle={projectTitle} open onClose={() => setOpen(false)} />
      )}
    </>
  );
}
