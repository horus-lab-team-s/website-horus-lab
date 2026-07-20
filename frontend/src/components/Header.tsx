"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { IconClose, IconMenu } from "./icons";
import { FlagIcon } from "./Flags";
import { ThemeToggle } from "./ThemeToggle";

/* ── Données de langues ── */
const LANGS = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
] as const;

type LangCode = "fr" | "en";

/* ── Sous-menus services ── */
const SERVICE_SUBMENU: Record<LangCode, { slug: string; label: string }[]> = {
  fr: [
    { slug: "applications",        label: "Applications sur mesure" },
    { slug: "systemes-information", label: "Systèmes d'information" },
    { slug: "digitalisation",      label: "Digitalisation entreprises" },
    { slug: "formation-audit",     label: "Formation & Audit" },
  ],
  en: [
    { slug: "applications",        label: "Custom Applications" },
    { slug: "systemes-information", label: "Information Systems" },
    { slug: "digitalisation",      label: "Business Digitalisation" },
    { slug: "formation-audit",     label: "Training & Audit" },
  ],
};

export function Header() {
  const { dict, lang, localePath } = useLang();
  const pathname  = usePathname();
  const router    = useRouter();

  const [scrolled,            setScrolled]            = useState(false);
  const [menuOpen,            setMenuOpen]            = useState(false);
  const [servicesOpen,        setServicesOpen]        = useState(false);
  const [mobileServicesOpen,  setMobileServicesOpen]  = useState(false);
  const [langOpen,            setLangOpen]            = useState(false);

  const servicesRef = useRef<HTMLLIElement>(null);
  const langRef     = useRef<HTMLDivElement>(null);
  const svcTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Fermer services dropdown au clic extérieur */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node))
        setServicesOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* Fermer lang dropdown au clic extérieur */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const openSvc  = () => { if (svcTimer.current) clearTimeout(svcTimer.current); setServicesOpen(true); };
  const closeSvc = () => { svcTimer.current = setTimeout(() => setServicesOpen(false), 180); };

  const submenus = SERVICE_SUBMENU[lang as LangCode] ?? SERVICE_SUBMENU.fr;
  const currentLang = LANGS.find(l => l.code === lang) ?? LANGS[0];

  const links = [
    { href: localePath("/portfolio"),   label: dict.nav.portfolio },
    { href: localePath("/blog"),        label: dict.nav.blog },
    { href: localePath("/about"),       label: dict.nav.about },
    { href: localePath("/candidature"), label: dict.nav.careers },
    { href: localePath("/contact"),     label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    !!(pathname && (pathname === href || pathname.startsWith(`${href}/`)));

  const isServicesActive = !!(pathname?.includes("/services"));

  /* Changement de langue */
  function switchLang(targetLang: string) {
    setLangOpen(false);
    setMenuOpen(false);
    // Remplace la locale dans l'URL courante
    const newPath = (pathname ?? `/${lang}`).replace(/^\/(fr|en)(?=\/|$)/, `/${targetLang}`);
    router.push(newPath);
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto max-w-6xl">

        {/* ── Barre principale (coins carrés / rayon léger, look pro) ── */}
        <nav className={`flex h-16 items-center justify-between gap-3 rounded-md border border-brand-100 px-3 backdrop-blur-md transition-all duration-300 dark:border-white/10 sm:px-5 ${
          scrolled ? "bg-white/90 shadow-xl shadow-brand-900/10 dark:bg-slate-900/90"
                   : "bg-white/80 shadow-lg shadow-brand-900/5  dark:bg-slate-900/70"
        }`}>

          {/* Logo — noir (transparent) sur fond clair, blanc sur fond sombre : toujours lisible */}
          <Link href={localePath("/")} className="flex shrink-0 items-center" aria-label="Horus-Lab">
            <Image src="/logo-HORUS-LAB-black.png" alt="Horus-Lab" width={200} height={64} priority
              className="h-14 w-auto object-contain dark:hidden" />
            <Image src="/logo-HORUS-LAB-white.jpeg" alt="Horus-Lab" width={200} height={64} priority
              className="hidden h-14 w-auto rounded-sm object-contain dark:block" />
          </Link>

          {/* Liens desktop */}
          <ul className="hidden items-center gap-1 lg:flex">

            {/* Services dropdown */}
            <li ref={servicesRef} className="relative" onMouseEnter={openSvc} onMouseLeave={closeSvc}>
              <button type="button" aria-haspopup="true" aria-expanded={servicesOpen}
                onClick={() => setServicesOpen(v => !v)}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isServicesActive
                    ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                    : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                }`}>
                {isServicesActive && <span aria-hidden className="size-1.5 rounded-full bg-brand-500 glow-pulse" />}
                {dict.nav.services}
                <svg className={`size-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown services — coins carrés + tirets de séparation */}
              <div onMouseEnter={openSvc} onMouseLeave={closeSvc}
                className={`absolute left-0 top-full mt-2 w-64 origin-top-left rounded-md border border-brand-100 bg-white/97 shadow-xl shadow-brand-900/10 backdrop-blur transition-all duration-200 dark:border-white/10 dark:bg-slate-900/97 ${
                  servicesOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
                }`}>
                <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  {dict.nav.services}
                </p>
                <ul className="px-1.5 pb-1.5">
                  {submenus.map(s => (
                    <li key={s.slug} className="border-t border-dashed border-brand-100 first:border-t-0 dark:border-white/10">
                      <Link href={localePath(`/services/${s.slug}`)} onClick={() => setServicesOpen(false)}
                        className="group/svc flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-brand-100/80 dark:hover:bg-white/5 dark:hover:text-brand-200">
                        <span className="h-px w-3 shrink-0 bg-brand-400 transition-all group-hover/svc:w-4" />
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Autres liens */}
            {links.map(link => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                             : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                    }`}>
                    {active && <span aria-hidden className="size-1.5 rounded-full bg-brand-500 glow-pulse" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* ── Sélecteur de langue (dropdown) ── */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(v => !v)}
                aria-label="Changer de langue"
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 rounded-md border border-brand-200 px-2.5 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
              >
                <FlagIcon code={currentLang.code} className="h-4 w-6 shrink-0 shadow-sm ring-1 ring-black/5" />
                <span>{currentLang.code.toUpperCase()}</span>
                <svg className={`size-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown langues */}
              <div className={`absolute right-0 top-full mt-2 w-40 origin-top-right rounded-md border border-brand-100 bg-white/97 shadow-xl shadow-brand-900/10 backdrop-blur transition-all duration-200 dark:border-white/10 dark:bg-slate-900/97 ${
                langOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
              }`}>
                <ul className="p-1.5">
                  {LANGS.map(l => {
                    const isCurrentLang = l.code === lang;
                    return (
                      <li key={l.code}>
                        <button
                          type="button"
                          onClick={() => switchLang(l.code)}
                          className={`flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                            isCurrentLang
                              ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                              : "text-ink/80 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-100/80 dark:hover:bg-white/5 dark:hover:text-brand-200"
                          }`}
                        >
                          <FlagIcon code={l.code} className="h-4 w-6 shrink-0 shadow-sm ring-1 ring-black/5" />
                          <span>{l.label}</span>
                          {isCurrentLang && (
                            <span className="ml-auto size-2 rounded-full bg-brand-500" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <Link href={localePath("/contact")}
              className="hidden rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 sm:inline-flex">
              {dict.nav.cta}
            </Link>

            {/* Burger mobile */}
            <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu" aria-expanded={menuOpen}
              className="flex size-10 items-center justify-center rounded-md border border-brand-200 text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 lg:hidden">
              {menuOpen ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* ── Menu mobile ── */}
        <div className={`overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen ? "mt-2 max-h-[36rem] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <ul className="flex flex-col gap-1 rounded-md border border-brand-100 bg-white/97 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/97">

            {/* Services accordion */}
            <li>
              <button type="button" onClick={() => setMobileServicesOpen(v => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  isServicesActive ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                                   : "text-ink/80 hover:bg-brand-50 hover:text-brand-700"
                }`}>
                {dict.nav.services}
                <svg className={`size-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <ul className="mt-1 ml-4 flex flex-col gap-0.5">
                  {submenus.map(s => (
                    <li key={s.slug}>
                      <Link href={localePath(`/services/${s.slug}`)}
                        onClick={() => { setMenuOpen(false); setMobileServicesOpen(false); }}
                        className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-brand-50 hover:text-brand-700">
                        <span className="size-1.5 rounded-full bg-brand-500/60" />
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Autres liens */}
            {links.map(link => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium transition-colors ${
                      active ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                             : "text-ink/80 hover:bg-brand-50 hover:text-brand-700"
                    }`}>
                    {active && <span aria-hidden className="size-1.5 rounded-full bg-brand-500" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Sélecteur langue mobile */}
            <li className="mt-1 border-t border-brand-100 pt-2 dark:border-white/10">
              <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                {lang === "fr" ? "Langue" : "Language"}
              </p>
              <div className="flex gap-2 px-2">
                {LANGS.map(l => (
                  <button key={l.code} type="button" onClick={() => switchLang(l.code)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                      l.code === lang
                        ? "bg-brand-700 text-white"
                        : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200"
                    }`}>
                    <FlagIcon code={l.code} className="h-4 w-6 shrink-0 shadow-sm ring-1 ring-black/5" />
                    <span>{l.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </li>

            {/* CTA */}
            <li>
              <Link href={localePath("/contact")} onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-md bg-brand-700 px-4 py-3 text-center text-base font-semibold text-white">
                {dict.nav.cta}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
