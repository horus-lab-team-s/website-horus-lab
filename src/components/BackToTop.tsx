"use client";

import { useEffect, useState } from "react";
import { IconArrowRight } from "./icons";

/** Bouton flottant « retour en haut », visible après défilement. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Haut de page / Back to top"
      className={`fixed bottom-6 left-6 z-40 grid size-11 place-items-center rounded-full bg-brand-700 text-white shadow-lg shadow-brand-900/25 transition-all duration-300 hover:bg-brand-800 ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <IconArrowRight className="size-5 -rotate-90" />
    </button>
  );
}
