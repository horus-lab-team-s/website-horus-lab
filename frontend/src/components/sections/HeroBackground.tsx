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

      {/* Particules animées (profondeur) */}
      <svg aria-hidden viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.06]">
        <g fill="currentColor">
          {[
            [120, 80], [380, 200], [640, 60], [900, 180], [1200, 100],
            [200, 400], [500, 350], [750, 450], [1050, 380], [1350, 420],
            [80, 600], [300, 650], [600, 580], [850, 700], [1150, 620],
          ].map(([cx, cy], k) => (
            <circle key={k} cx={cx} cy={cy} r={k % 3 === 0 ? 2.5 : 1.5} />
          ))}
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5">
          <line x1="120" y1="80" x2="380" y2="200" />
          <line x1="380" y1="200" x2="640" y2="60" />
          <line x1="640" y1="60" x2="900" y2="180" />
          <line x1="900" y1="180" x2="1200" y2="100" />
          <line x1="200" y1="400" x2="500" y2="350" />
          <line x1="500" y1="350" x2="750" y2="450" />
          <line x1="750" y1="450" x2="1050" y2="380" />
          <line x1="120" y1="80" x2="200" y2="400" />
          <line x1="380" y1="200" x2="500" y2="350" />
        </g>
      </svg>
    </div>
  );
}
