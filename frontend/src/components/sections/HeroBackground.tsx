"use client";

import { useEffect, useState } from "react";

export function HeroBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(images.map(() => false));

  useEffect(() => {
    // Précharge toutes les images
    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () =>
        setLoaded((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
    });
  }, [images]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 7000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base dégradée de marque (fallback permanent) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />

      {/* Photos en fondu enchaîné — apparaissent seulement une fois chargées */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
            i === index && loaded[i] ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Voile de marque : lisibilité du texte garantie */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 via-brand-900/45 to-brand-800/60" />
      {/* Renforcement bas pour CTA/stats */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/55 to-transparent" />
    </div>
  );
}
