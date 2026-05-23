"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  // Défilement auto (sauf si l'utilisateur préfère réduire les animations).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-2xl shadow-brand-900/20 ring-1 ring-brand-100 dark:ring-white/10">
      {slides.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Légende de la diapo active */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-900/40 to-transparent" />

      {/* Indicateurs */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={s.alt}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
