"use client";

/**
 * Fond du hero : une VIDÉO tech en boucle (muette, autoplay) qui couvre toute la
 * section, avec un voile de marque pour garder le texte lisible. Aucune forme
 * décorative — un simple rectangle net et sérieux. Repli : image `poster` puis
 * dégradé de marque si la vidéo n'est pas disponible.
 */
export function HeroBackground({
  videoSrc,
  poster,
}: {
  videoSrc: string;
  poster: string;
}) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base dégradée de marque (repli permanent, sous la vidéo) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />

      {/* Vidéo de fond en boucle */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Voile de marque : lisibilité du texte garantie */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-900/58 to-brand-800/70" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/65 to-transparent" />
    </div>
  );
}
