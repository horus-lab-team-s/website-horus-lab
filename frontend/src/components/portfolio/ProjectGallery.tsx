"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IconArrowRight, IconClose } from "@/components/icons";
import type { GalleryGroup } from "@/lib/projectGalleries";

export function ProjectGallery({
  groups,
  lang,
  projectTitle,
  open,
  onClose,
}: {
  groups: GalleryGroup[];
  lang: string;
  projectTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const isFr = lang === "fr";
  const [g, setG] = useState(0);
  const [shot, setShot] = useState<number | null>(null);

  const group = groups[g];
  const shots = group?.shots ?? [];

  const closeLightbox = useCallback(() => setShot(null), []);
  const prev = useCallback(
    () => setShot((s) => (s == null ? s : (s - 1 + shots.length) % shots.length)),
    [shots.length],
  );
  const next = useCallback(
    () => setShot((s) => (s == null ? s : (s + 1) % shots.length)),
    [shots.length],
  );

  /* Réinitialise à l'ouverture */
  useEffect(() => {
    if (open) {
      setG(0);
      setShot(null);
    }
  }, [open]);

  /* Verrou du scroll de la page */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  /* Clavier : Échap ferme, flèches naviguent dans la lightbox */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (shot != null) closeLightbox();
        else onClose();
      } else if (shot != null && e.key === "ArrowLeft") prev();
      else if (shot != null && e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shot, prev, next, closeLightbox, onClose]);

  if (!open || !group) return null;

  const label = (grp: GalleryGroup) => (isFr ? grp.labelFr : grp.labelEn);
  const note = (grp: GalleryGroup) => (isFr ? grp.noteFr : grp.noteEn);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} : ${isFr ? "aperçu du produit" : "product preview"}`}
      className="fixed inset-0 z-[100] flex items-stretch justify-center p-0 sm:p-4"
    >
      {/* Fond */}
      <button
        type="button"
        aria-label={isFr ? "Fermer" : "Close"}
        onClick={onClose}
        className="absolute inset-0 bg-[#050a16]/85 backdrop-blur-sm"
      />

      {/* Panneau */}
      <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 sm:rounded-lg">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-brand-100 px-5 py-4 dark:border-white/10 sm:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
              {isFr ? "Étude de cas" : "Case study"}
            </p>
            <h3 className="mt-0.5 text-lg font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-xl">
              {projectTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isFr ? "Fermer" : "Close"}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-100 text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
          >
            <IconClose className="size-5" />
          </button>
        </div>

        {/* Onglets des volets */}
        <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-7">
          {groups.map((grp, i) => (
            <button
              key={grp.id}
              type="button"
              onClick={() => {
                setG(i);
                setShot(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                i === g
                  ? "bg-brand-700 text-white shadow-md shadow-brand-700/25"
                  : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
              }`}
            >
              {label(grp)}
              <span className="ml-1.5 opacity-60">{grp.shots.length}</span>
            </button>
          ))}
        </div>

        {/* Accroche du volet */}
        <p className="px-5 pt-3 text-sm leading-relaxed text-muted sm:px-7">{note(group)}</p>

        {/* Grille des captures */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div
            className={`grid gap-4 ${
              group.portrait ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"
            }`}
          >
            {shots.map((sh, i) => (
              <button
                key={sh.src}
                type="button"
                onClick={() => setShot(i)}
                className="group/th flex flex-col overflow-hidden rounded-lg border border-brand-100 bg-surface text-left transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
              >
                <div className={`relative overflow-hidden ${group.portrait ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                  <Image
                    src={sh.src}
                    alt={isFr ? sh.fr : sh.en}
                    fill
                    sizes="(max-width:640px) 50vw, 320px"
                    className="object-cover object-top transition-transform duration-500 group-hover/th:scale-[1.03]"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover/th:opacity-100" />
                </div>
                <p className="px-3 py-2.5 text-xs font-semibold leading-snug text-brand-900 dark:text-brand-100">
                  {isFr ? sh.fr : sh.en}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox plein écran */}
      {shot != null && shots[shot] && (
        <div className="absolute inset-0 z-10 flex flex-col bg-[#050a16]/95">
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-8">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">
              <span className="text-white/50">
                {shot + 1}/{shots.length} · {label(group)} :{" "}
              </span>
              {isFr ? shots[shot].fr : shots[shot].en}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label={isFr ? "Fermer l'aperçu" : "Close preview"}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <IconClose className="size-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-4 pb-6 sm:px-8">
            {/* Capture réelle (fichier local) affichée à sa taille naturelle, scrollable */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shots[shot].src}
              alt={isFr ? shots[shot].fr : shots[shot].en}
              className="mx-auto h-auto w-full max-w-5xl rounded-md ring-1 ring-white/15"
            />
          </div>

          {shots.length > 1 && (
            <div className="flex items-center justify-center gap-3 pb-5">
              <button
                type="button"
                onClick={prev}
                aria-label={isFr ? "Précédent" : "Previous"}
                className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <IconArrowRight className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={isFr ? "Suivant" : "Next"}
                className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <IconArrowRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
