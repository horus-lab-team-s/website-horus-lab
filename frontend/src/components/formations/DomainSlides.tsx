"use client";

import { useEffect, useState } from "react";

/* Diaporama de fond du hero Formations : images représentant les domaines
   (web, mobile, génie logiciel, IA) en fondu enchaîné. Statique si l'utilisateur
   préfère les animations réduites. Un voile de marque garantit la lisibilité. */
const IMAGES = [
  "/img/photo-1461749280684-dccba630e2f6-w1200.jpg", // Web / code
  "/img/photo-1512941937669-90a1b58e7e9c-w700.jpg",  // Mobile
  "/img/photo-1522202176988-66273c2fd55f-w1200.jpg", // Génie logiciel / UML
  "/img/photo-1518770660439-4636190af475-w700.jpg",  // IA / circuit
];

export function DomainSlides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Repli permanent (dégradé de marque) sous les images */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />

      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Voile de marque : lisibilité du texte blanc */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/82 via-brand-900/62 to-slate-900/72" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/60 to-transparent" />
    </div>
  );
}
