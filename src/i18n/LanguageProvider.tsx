"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { dictionaries, type Dict, type Lang } from "./dictionaries";

type LanguageContextValue = {
  lang: Lang;
  dict: Dict;
  /** Langue alternative (pour le sélecteur). */
  otherLang: Lang;
  /** URL de la page courante dans l'autre langue. */
  switchHref: string;
  /** Préfixe une URL interne avec la locale active : localePath("/blog"). */
  localePath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || `/${lang}`;
  const otherLang: Lang = lang === "fr" ? "en" : "fr";

  // Bascule la locale en tête de l'URL courante.
  const switchHref = pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${otherLang}`);

  const localePath = (path: string) => {
    if (path === "/") return `/${lang}`;
    if (path.startsWith("#")) return `/${lang}${path}`; // ancre sur l'accueil
    return `/${lang}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Maintient <html lang> correct côté client (l'attribut SSR par défaut est "fr").
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{ lang, dict: dictionaries[lang], otherLang, switchHref, localePath }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
