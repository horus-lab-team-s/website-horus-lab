"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { IconClose, IconGlobe, IconMenu } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { dict, otherLang, switchHref, localePath } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Épaissit le fond/l'ombre une fois la page défilée.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: localePath("#services"), label: dict.nav.services, anchor: true },
    { href: localePath("/portfolio"), label: dict.nav.portfolio, anchor: false },
    { href: localePath("/news"), label: dict.nav.news, anchor: false },
    { href: localePath("/blog"), label: dict.nav.blog, anchor: false },
    { href: localePath("/about"), label: dict.nav.about, anchor: false },
  ];

  /** Un lien est "actif" si on est sur la page exacte ou un sous-chemin
   *  (ex. /fr/blog/[slug] active aussi "Blog"). Les ancres restent inactives. */
  const isActive = (link: { href: string; anchor: boolean }) => {
    if (link.anchor || !pathname) return false;
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  };

  return (
    // En-tête FLOTTANT : détaché du bord (top-4), centré, marges latérales.
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto max-w-6xl">
        {/* La "pilule" a TOUJOURS un fond translucide (glass) : les menus
            restent lisibles partout — y compris au-dessus du hero — sans avoir
            à changer la couleur du texte selon l'arrière-plan. */}
        <nav
          className={`flex h-16 items-center justify-between gap-3 rounded-full border border-brand-100 px-3 backdrop-blur-md transition-all duration-300 dark:border-white/10 sm:px-5 ${
            scrolled
              ? "bg-white/90 shadow-xl shadow-brand-900/10 dark:bg-slate-900/90"
              : "bg-white/75 shadow-lg shadow-brand-900/5 dark:bg-slate-900/70"
          }`}
        >
          <Link href={localePath("/")} className="flex items-center gap-2.5">
            <Image
              src="/Logo-HORUS-LAB.jpeg"
              alt="Horus-Lab"
              width={40}
              height={40}
              priority
              className="rounded-full ring-1 ring-brand-100 dark:ring-white/10"
            />
            <span className="text-lg font-bold tracking-tight text-brand-900 dark:text-white">
              horus<span className="text-brand-500">-lab</span>
            </span>
          </Link>

          {/* Liens (desktop) — état actif marqué visuellement (fond + couleur + point) */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active = isActive(link);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                        : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-brand-500 glow-pulse"
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href={switchHref}
              hrefLang={otherLang}
              aria-label="Changer de langue / Switch language"
              className="flex items-center gap-1.5 rounded-full border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
            >
              <IconGlobe className="size-4" />
              {otherLang.toUpperCase()}
            </Link>

            <Link
              href={localePath("#contact")}
              className="hidden rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 sm:inline-flex"
            >
              {dict.nav.cta}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex size-10 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 lg:hidden"
            >
              {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Menu mobile : carte arrondie qui se déploie sous la pilule */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden ${
            open ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 rounded-2xl border border-brand-100 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
            {links.map((link) => {
              const active = isActive(link);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200"
                        : "text-ink/80 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                    }`}
                  >
                    {active && (
                      <span aria-hidden className="size-1.5 rounded-full bg-brand-500" />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={localePath("#contact")}
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl bg-brand-700 px-4 py-3 text-center text-base font-semibold text-white"
              >
                {dict.nav.cta}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
