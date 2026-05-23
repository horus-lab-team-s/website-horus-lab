"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { IconClose, IconGlobe, IconMenu } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ onDark = false }: { onDark?: boolean }) {
  const { dict, otherLang, switchHref, localePath } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ancres préfixées par la locale : ramènent à l'accueil /<lang> puis scrollent.
  const links = [
    { href: localePath("#services"), label: dict.nav.services },
    { href: localePath("/portfolio"), label: dict.nav.portfolio },
    { href: localePath("/about"), label: dict.nav.about },
    { href: localePath("/blog"), label: dict.nav.blog },
  ];

  // Navbar transparente au-dessus d'un hero sombre -> contrôles en blanc.
  const overHero = onDark && !scrolled;
  const navLinkCls = overHero
    ? "text-white/90 hover:bg-white/10 hover:text-white"
    : "text-ink/75 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200";
  const ctrlCls = overHero
    ? "border-white/40 text-white hover:bg-white/10"
    : "border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-brand-100/70 shadow-[0_8px_30px_-12px_rgba(15,42,94,0.18)] dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href={localePath("/")} className="flex items-center gap-3">
          <Image
            src="/Logo-HORUS-LAB.jpeg"
            alt="Horus-Lab"
            width={44}
            height={44}
            priority
            className="rounded-full ring-1 ring-brand-100"
          />
          <span
            className={`text-lg font-bold tracking-tight ${
              overHero ? "text-white" : "text-brand-900 dark:text-white"
            }`}
          >
            horus<span className="text-brand-500">-lab</span>
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${navLinkCls}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle onDark={overHero} />

          <Link
            href={switchHref}
            hrefLang={otherLang}
            aria-label="Changer de langue / Switch language"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${ctrlCls}`}
          >
            <IconGlobe className="size-4" />
            {otherLang.toUpperCase()}
          </Link>

          <Link
            href={localePath("#contact")}
            className="hidden rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 hover:shadow-brand-700/40 sm:inline-flex"
          >
            {dict.nav.cta}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className={`flex size-10 items-center justify-center rounded-full border transition-colors lg:hidden ${ctrlCls}`}
          >
            {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`overflow-hidden border-t border-brand-100 bg-white/95 backdrop-blur transition-[max-height] duration-300 dark:border-white/10 dark:bg-slate-900/95 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
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
    </header>
  );
}
