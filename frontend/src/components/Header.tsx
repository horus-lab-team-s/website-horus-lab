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

/* ── Sous-menus formations (catégories du catalogue) ── */
const FORMATION_SUBMENU: Record<LangCode, { slug: string; label: string }[]> = {
  fr: [
    { slug: "web",            label: "Développement Web" },
    { slug: "mobile",         label: "Développement Mobile" },
    { slug: "genie-logiciel", label: "Génie logiciel" },
    { slug: "ia",             label: "IA & Productivité" },
  ],
  en: [
    { slug: "web",            label: "Web Development" },
    { slug: "mobile",         label: "Mobile Development" },
    { slug: "genie-logiciel", label: "Software Engineering" },
    { slug: "ia",             label: "AI & Productivity" },
  ],
};

/* ── Sous-menus blog (catégories d'articles → /blog?cat=) ── */
const BLOG_SUBMENU: Record<LangCode, { slug: string; label: string }[]> = {
  fr: [
    { slug: "Actualités Tech",         label: "Actualités Tech" },
    { slug: "Développement",           label: "Développement" },
    { slug: "Tech Afrique",            label: "Tech Afrique" },
    { slug: "Transformation Digitale", label: "Transformation Digitale" },
    { slug: "Formation IT",            label: "Formation IT" },
  ],
  en: [
    { slug: "Tech News",               label: "Tech News" },
    { slug: "Development",             label: "Development" },
    { slug: "Tech Africa",            label: "Tech Africa" },
    { slug: "Digital Transformation", label: "Digital Transformation" },
    { slug: "IT Training",            label: "IT Training" },
  ],
};

export function Header() {
  const { dict, lang, localePath } = useLang();
  const pathname  = usePathname();
  const router    = useRouter();

  const [scrolled,             setScrolled]             = useState(false);
  const [menuOpen,             setMenuOpen]             = useState(false);
  const [servicesOpen,         setServicesOpen]         = useState(false);
  const [mobileServicesOpen,   setMobileServicesOpen]   = useState(false);
  const [formationsOpen,       setFormationsOpen]       = useState(false);
  const [mobileFormationsOpen, setMobileFormationsOpen] = useState(false);
  const [blogOpen,             setBlogOpen]             = useState(false);
  const [mobileBlogOpen,       setMobileBlogOpen]       = useState(false);
  const [langOpen,             setLangOpen]             = useState(false);

  const servicesRef   = useRef<HTMLLIElement>(null);
  const formationsRef = useRef<HTMLLIElement>(null);
  const langRef       = useRef<HTMLDivElement>(null);
  const blogRef       = useRef<HTMLLIElement>(null);
  const svcTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fmtTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blogTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Fermer les dropdowns services / formations au clic extérieur */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node))
        setServicesOpen(false);
      if (formationsRef.current && !formationsRef.current.contains(e.target as Node))
        setFormationsOpen(false);
      if (blogRef.current && !blogRef.current.contains(e.target as Node))
        setBlogOpen(false);
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

  /* Panneau mobile ouvert : on verrouille le défilement du fond et on ferme sur Échap */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openSvc  = () => { if (svcTimer.current) clearTimeout(svcTimer.current); setServicesOpen(true); };
  const closeSvc = () => { svcTimer.current = setTimeout(() => setServicesOpen(false), 180); };
  const openFmt  = () => { if (fmtTimer.current) clearTimeout(fmtTimer.current); setFormationsOpen(true); };
  const closeFmt = () => { fmtTimer.current = setTimeout(() => setFormationsOpen(false), 180); };
  const openBlog  = () => { if (blogTimer.current) clearTimeout(blogTimer.current); setBlogOpen(true); };
  const closeBlog = () => { blogTimer.current = setTimeout(() => setBlogOpen(false), 180); };

  const submenus     = SERVICE_SUBMENU[lang as LangCode] ?? SERVICE_SUBMENU.fr;
  const fmtSubmenus  = FORMATION_SUBMENU[lang as LangCode] ?? FORMATION_SUBMENU.fr;
  const blogSubmenus = BLOG_SUBMENU[lang as LangCode] ?? BLOG_SUBMENU.fr;
  const currentLang  = LANGS.find(l => l.code === lang) ?? LANGS[0];

  // Ordre logique « de vente » : Services & Formations (offres, en dropdowns) →
  // Réalisations (preuve) → À propos (confiance) → Blog (contenu) → Contact (CTA).
  const links = [
    { href: localePath("/portfolio"),   label: dict.nav.portfolio },
    { href: localePath("/about"),       label: dict.nav.about },
    { href: localePath("/contact"),     label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    !!(pathname && (pathname === href || pathname.startsWith(`${href}/`)));

  const isServicesActive   = !!(pathname?.includes("/services"));
  const isFormationsActive = !!(pathname?.includes("/formations"));
  const isBlogActive = !!(pathname?.includes("/blog"));
  const fmtHref = (slug: string) => localePath(`/formations?cat=${slug}#catalogue`);
  const blogHref = (slug: string) => localePath(`/blog?cat=${encodeURIComponent(slug)}`);

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
            <Image src="/logo/logo-light-bg-full.png" alt="Horus-Lab" width={200} height={64} priority
              className="h-14 w-auto object-contain dark:hidden" />
            <Image src="/logo/logo-dark-bg-full.png" alt="Horus-Lab" width={200} height={64} priority
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

            {/* Formations dropdown */}
            <li ref={formationsRef} className="relative" onMouseEnter={openFmt} onMouseLeave={closeFmt}>
              <Link href={localePath("/formations")} aria-haspopup="true" aria-expanded={formationsOpen}
                onClick={() => setFormationsOpen(false)}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isFormationsActive
                    ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                    : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                }`}>
                {isFormationsActive && <span aria-hidden className="size-1.5 rounded-full bg-brand-500 glow-pulse" />}
                {dict.nav.formations}
                <svg className={`size-3.5 transition-transform duration-200 ${formationsOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Dropdown formations */}
              <div onMouseEnter={openFmt} onMouseLeave={closeFmt}
                className={`absolute left-0 top-full mt-2 w-64 origin-top-left rounded-md border border-brand-100 bg-white/97 shadow-xl shadow-brand-900/10 backdrop-blur transition-all duration-200 dark:border-white/10 dark:bg-slate-900/97 ${
                  formationsOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
                }`}>
                <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  {dict.nav.formations}
                </p>
                <ul className="px-1.5 pb-1.5">
                  <li>
                    <Link href={localePath("/formations")} onClick={() => setFormationsOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-white/5">
                      <span className="h-px w-3 shrink-0 bg-brand-500" />
                      {lang === "fr" ? "Toutes les formations" : "All courses"}
                    </Link>
                  </li>
                  {fmtSubmenus.map(s => (
                    <li key={s.slug} className="border-t border-dashed border-brand-100 dark:border-white/10">
                      <Link href={fmtHref(s.slug)} onClick={() => setFormationsOpen(false)}
                        className="group/fmt flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-brand-100/80 dark:hover:bg-white/5 dark:hover:text-brand-200">
                        <span className="h-px w-3 shrink-0 bg-brand-400 transition-all group-hover/fmt:w-4" />
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Blog dropdown */}
            <li ref={blogRef} className="relative" onMouseEnter={openBlog} onMouseLeave={closeBlog}>
              <Link href={localePath("/blog")} aria-haspopup="true" aria-expanded={blogOpen}
                onClick={() => setBlogOpen(false)}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isBlogActive
                    ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                    : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                }`}>
                {isBlogActive && <span aria-hidden className="size-1.5 rounded-full bg-brand-500 glow-pulse" />}
                {dict.nav.blog}
                <svg className={`size-3.5 transition-transform duration-200 ${blogOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <div onMouseEnter={openBlog} onMouseLeave={closeBlog}
                className={`absolute left-0 top-full mt-2 w-64 origin-top-left rounded-md border border-brand-100 bg-white/97 shadow-xl shadow-brand-900/10 backdrop-blur transition-all duration-200 dark:border-white/10 dark:bg-slate-900/97 ${
                  blogOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
                }`}>
                <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  {dict.nav.blog}
                </p>
                <ul className="px-1.5 pb-1.5">
                  <li>
                    <Link href={localePath("/blog")} onClick={() => setBlogOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-white/5">
                      <span className="h-px w-3 shrink-0 bg-brand-500" />
                      {lang === "fr" ? "Tous les articles" : "All articles"}
                    </Link>
                  </li>
                  {blogSubmenus.map(s => (
                    <li key={s.slug} className="border-t border-dashed border-brand-100 dark:border-white/10">
                      <Link href={blogHref(s.slug)} onClick={() => setBlogOpen(false)}
                        className="group/blog flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-brand-100/80 dark:hover:bg-white/5 dark:hover:text-brand-200">
                        <span className="h-px w-3 shrink-0 bg-brand-400 transition-all group-hover/blog:w-4" />
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

      </div>

      {/* ══ Menu mobile : panneau latéral qui glisse de la DROITE, pleine hauteur ══ */}

      {/* Voile — assombrit le site derrière et ferme au clic */}
      <div
        aria-hidden
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-brand-900/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panneau — occupe la moitié de l'écran (jamais sous 17.5rem pour rester lisible) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.services}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-1/2 min-w-[17.5rem] max-w-md flex-col border-l border-brand-100 bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out dark:border-white/10 dark:bg-slate-900 lg:hidden ${
          menuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        {/* En-tête du panneau : logo + fermeture */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-brand-100 px-4 dark:border-white/10">
          <Image src="/logo/logo-light-bg-full.png" alt="Horus-Lab" width={140} height={44}
            className="h-9 w-auto object-contain dark:hidden" />
          <Image src="/logo/logo-dark-bg-full.png" alt="Horus-Lab" width={140} height={44}
            className="hidden h-9 w-auto rounded-sm object-contain dark:block" />
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"
            className="grid size-10 place-items-center rounded-md border border-brand-200 text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5">
            <IconClose className="size-5" />
          </button>
        </div>

        {/* Corps défilant */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3">
          <ul className="flex flex-col gap-1">

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

            {/* Formations accordion */}
            <li>
              <button type="button" onClick={() => setMobileFormationsOpen(v => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  isFormationsActive ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                                     : "text-ink/80 hover:bg-brand-50 hover:text-brand-700"
                }`}>
                {dict.nav.formations}
                <svg className={`size-4 transition-transform ${mobileFormationsOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {mobileFormationsOpen && (
                <ul className="mt-1 ml-4 flex flex-col gap-0.5">
                  <li>
                    <Link href={localePath("/formations")}
                      onClick={() => { setMenuOpen(false); setMobileFormationsOpen(false); }}
                      className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-200">
                      <span className="size-1.5 rounded-full bg-brand-500" />
                      {lang === "fr" ? "Toutes les formations" : "All courses"}
                    </Link>
                  </li>
                  {fmtSubmenus.map(s => (
                    <li key={s.slug}>
                      <Link href={fmtHref(s.slug)}
                        onClick={() => { setMenuOpen(false); setMobileFormationsOpen(false); }}
                        className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-brand-50 hover:text-brand-700">
                        <span className="size-1.5 rounded-full bg-brand-500/60" />
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Blog accordion (mobile) */}
            <li>
              <button type="button" onClick={() => setMobileBlogOpen(v => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  isBlogActive ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                               : "text-ink/80 hover:bg-brand-50 hover:text-brand-700"
                }`}>
                {dict.nav.blog}
                <svg className={`size-4 transition-transform ${mobileBlogOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {mobileBlogOpen && (
                <ul className="mt-1 ml-4 flex flex-col gap-0.5">
                  <li>
                    <Link href={localePath("/blog")}
                      onClick={() => { setMenuOpen(false); setMobileBlogOpen(false); }}
                      className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-200">
                      <span className="size-1.5 rounded-full bg-brand-500" />
                      {lang === "fr" ? "Tous les articles" : "All articles"}
                    </Link>
                  </li>
                  {blogSubmenus.map(s => (
                    <li key={s.slug}>
                      <Link href={blogHref(s.slug)}
                        onClick={() => { setMenuOpen(false); setMobileBlogOpen(false); }}
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

          </ul>
        </div>

        {/* Pied du panneau : appel à l'action */}
        <div className="shrink-0 border-t border-brand-100 p-3 dark:border-white/10">
          <Link href={localePath("/contact")} onClick={() => setMenuOpen(false)}
            className="block rounded-md bg-brand-700 px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-800">
            {dict.nav.cta}
          </Link>
        </div>
      </aside>
    </header>
  );
}
