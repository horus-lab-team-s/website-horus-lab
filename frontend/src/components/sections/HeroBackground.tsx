"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

/**
 * Fond du hero : une image optimisée (next/image, chargée en priorité) puis, sur
 * ordinateur avec une bonne connexion seulement, une VIDÉO tech en boucle
 * (muette, autoplay) par-dessus. Sur mobile, en économie de données, sur une
 * connexion lente ou avec les animations réduites : image seule (quelques
 * dizaines de Ko au lieu de 1 à 7 Mo de vidéo). Voile de marque par-dessus pour
 * garder le texte lisible.
 */
function canPlayVideo(): boolean {
  if (window.matchMedia("(max-width: 1023px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return false;
  return true;
}

const noSubscribe = () => () => {};

export function HeroBackground({
  videoSrc,
  poster,
}: {
  videoSrc: string;
  poster: string;
}) {
  // Côté serveur : image seule ; côté navigateur : vidéo si les conditions le permettent.
  const video = useSyncExternalStore(noSubscribe, canPlayVideo, () => false);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base dégradée de marque (repli permanent) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />

      {/* Image de fond, servie au bon format et à la taille de l'écran */}
      <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />

      {/* Vidéo de fond en boucle (ordinateur, bonne connexion) */}
      {video && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Voile de marque : lisibilité du texte garantie */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-900/58 to-brand-800/70" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/65 to-transparent" />
    </div>
  );
}
