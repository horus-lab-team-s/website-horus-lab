"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./icons";

/** Bascule clair/sombre. La classe `.dark` est posée pré-paint par un script
 *  inline (voir layout racine) ; ici on lit l'état puis on le commute. */
export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture du DOM après hydratation
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer le thème clair / sombre"
      className={`grid size-10 place-items-center rounded-full border transition-colors ${
        onDark
          ? "border-white/40 text-white hover:bg-white/10"
          : "border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
      }`}
    >
      {dark ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
    </button>
  );
}
