"use client";

import Image from "next/image";
import { useState } from "react";
import { IconPlay } from "@/components/icons";

/** Extrait l'ID YouTube d'une URL watch?v= / youtu.be / embed. */
function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * Aperçu vidéo d'un cours : miniature + bouton lecture. Accès LIBRE et GRATUIT —
 * aucune inscription requise (cette page n'est qu'un aperçu ; la vraie formation
 * se déroule sur l'application mobile Edlearning). La vidéo YouTube (nocookie) ne
 * se charge qu'au clic.
 */
export function CoursePlayer({
  videoUrl,
  image,
  title,
  label,
}: {
  videoUrl?: string;
  image: string;
  title: string;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(videoUrl);
  const badge = label ?? "Aperçu";

  return (
    <div className="relative aspect-video overflow-hidden bg-brand-900 shadow-2xl">
      {playing && id ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerated-mobile; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Image src={image} alt={title} fill sizes="(max-width:1024px) 100vw, 40vw"
            className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-brand-900/10" />
          <button
            type="button"
            onClick={() => id && setPlaying(true)}
            disabled={!id}
            aria-label={badge}
            className="absolute inset-0 grid place-items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="grid size-16 place-items-center bg-white/95 text-brand-700 shadow-2xl transition-transform hover:scale-110">
              <IconPlay className="size-7" />
            </span>
          </button>
          <span className="absolute bottom-3 left-3 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {badge}
          </span>
        </>
      )}
    </div>
  );
}
