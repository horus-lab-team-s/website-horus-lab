"use client";

import { useEffect, useState } from "react";

/**
 * Fond du hero : photos qui se fondent en boucle (chargées par le navigateur
 * via background-image — robuste, pas d'optimiseur serveur). Un dégradé de
 * marque reste toujours visible dessous : si une image tarde/échoue, le hero
 * reste élégant. Remplaçable par vos propres photos dans `images`.
 */
export function HeroBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base dégradée de marque (fallback permanent) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />

      {/* Photos en fondu enchaîné */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Voile de marque ALLÉGÉ : on laisse mieux voir les photos.
          La lisibilité du texte est assurée par une ombre portée sur le texte
          (voir Hero) plutôt que par un voile très opaque. */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/65 via-brand-900/40 to-brand-800/55" />
      {/* Léger renforcement bas pour les CTA/stats */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/45 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-10" />
    </div>
  );
}
