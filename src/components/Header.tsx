"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { IconClose, IconGlobe, IconMenu } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { dict, otherLang, switchHref, localePath } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // On épaissit légèrement le fond/l'ombre une fois la page défilée.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: localePath("#services"), label: dict.nav.services },
    { href: localePath("/portfolio"), label: dict.nav.portfolio },
    { href: localePath("/about"), label: dict.nav.about },
    { href: localePath("/blog"), label: dict.nav.blog },
  ];

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

          {/* Liens (desktop) — couleurs du thème, sur le fond de la pilule */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
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
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
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
