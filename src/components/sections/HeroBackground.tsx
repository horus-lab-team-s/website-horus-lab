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

      {/* Voile de marque pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/92 via-brand-900/80 to-brand-800/82" />
      <div className="absolute inset-0 bg-grid opacity-10" />
    </div>
  );
}
