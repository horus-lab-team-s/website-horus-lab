"use client";

import { useEffect, useState } from "react";
import { IconArrowRight } from "./icons";

/** Bouton flottant « retour en haut » — à DROITE, à côté du bouton d'assistance.
 *  Il s'efface quand le chat Horus AI est ouvert (pour ne pas gêner le panneau). */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onToggle = (e: Event) => setChatOpen(Boolean((e as CustomEvent).detail));
    window.addEventListener("horusai:toggle", onToggle as EventListener);
    return () => window.removeEventListener("horusai:toggle", onToggle as EventListener);
  }, []);

  const visible = show && !chatOpen;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Haut de page / Back to top"
      className={`fixed bottom-6 right-24 z-40 grid size-11 place-items-center rounded-md bg-brand-700 text-white shadow-lg shadow-brand-900/25 transition-all duration-300 hover:bg-brand-800 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <IconArrowRight className="size-5 -rotate-90" />
    </button>
  );
}
