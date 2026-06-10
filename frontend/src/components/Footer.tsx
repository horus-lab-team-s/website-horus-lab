"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import {
  IconFacebook,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconPhone,
  IconPin,
  IconTelegram,
  IconWhatsApp,
  IconX,
} from "./icons";

const DEFAULT_SOCIAL = {
  linkedin: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
  x: "https://x.com/horuslabafrik",
  facebook: "https://www.facebook.com/HorusLab",
  whatsapp: "https://wa.me/237699173771",
  github: "https://github.com/horus-lab-team-s",
  telegram: "https://t.me/tonbacm",
};

/* Slugs des pages services — doit correspondre au sous-menu navbar */
const SERVICE_SLUGS: Record<string, Record<string, string>> = {
  fr: {
    "Applications sur mesure": "applications",
    "Systèmes d'information": "systemes-information",
    "Digitalisation d'entreprise": "digitalisation",
    "Formation & Audit IT": "formation-audit",
  },
  en: {
    "Custom Applications": "applications",
    "Information Systems": "systemes-information",
    "Business Digitalisation": "digitalisation",
    "Training & IT Audit": "formation-audit",
  },
};

export function Footer() {
  const { dict, lang, localePath, settings } = useLang();
  const f = dict.footer;
  const year = new Date().getFullYear();

  const email = settings?.email || f.email;
  const phones = settings?.phones?.length ? settings.phones : f.phones;
  const location = settings?.location || f.location;
  const about = settings?.about || f.about;
  const tagline = settings?.tagline || f.tagline;

  const social = [
    { Icon: IconLinkedIn, label: "LinkedIn", href: settings?.socials.linkedin || DEFAULT_SOCIAL.linkedin },
    { Icon: IconX,        label: "X",         href: settings?.socials.x        || DEFAULT_SOCIAL.x },
    { Icon: IconFacebook, label: "Facebook",  href: settings?.socials.facebook  || DEFAULT_SOCIAL.facebook },
    { Icon: IconWhatsApp, label: "WhatsApp",  href: settings?.socials.whatsapp  || DEFAULT_SOCIAL.whatsapp },
    { Icon: IconGitHub,   label: "GitHub",    href: settings?.socials.github    || DEFAULT_SOCIAL.github },
    { Icon: IconTelegram, label: "Telegram",  href: settings?.socials.telegram  || DEFAULT_SOCIAL.telegram },
  ].filter((s) => s.href);

  const serviceMap = SERVICE_SLUGS[lang] ?? SERVICE_SLUGS.fr;
  const serviceLinks = Object.entries(serviceMap).map(([label, slug]) => ({
    label,
    href: localePath(`/services/${slug}`),
  }));

  const companyLinks = [
    { label: dict.nav.about,     href: localePath("/about") },
    { label: dict.nav.portfolio, href: localePath("/portfolio") },
    { label: dict.nav.blog,      href: localePath("/blog") },
    { label: dict.nav.careers,   href: localePath("/candidature") },
    { label: lang === "fr" ? "Contact" : "Contact", href: localePath("/#contact") },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-900 text-brand-100">
      {/* ── Décor animé de fond ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grille technique */}
        <div className="absolute inset-0 bg-grid opacity-[0.12]" />
        {/* Orbes colorées */}
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl animate-drift" />
        <div className="absolute right-0 bottom-1/2 h-48 w-48 rounded-full bg-brand-400/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        {/* Tracé de circuit */}
        <svg aria-hidden viewBox="0 0 1440 300" preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-24 w-full text-white/[0.04]">
          <path d="M0 200 H200 L260 150 H500 L560 200 H800 L860 140 H1100 L1160 200 H1440"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 250 H150 L220 200 H400 L470 250 H700 L770 190 H1000 L1070 250 H1440"
            fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          {[200, 500, 800, 1100].map((x, i) => (
            <circle key={i} cx={x} cy={i % 2 === 0 ? 150 : 200} r="3" fill="currentColor" />
          ))}
        </svg>
        {/* Constellation de points */}
        <svg aria-hidden viewBox="0 0 400 300" className="absolute right-0 top-0 h-64 w-80 text-white/[0.05]">
          <g fill="currentColor">
            {[[40,30],[120,60],[200,20],[280,70],[350,40],[80,120],[180,140],[300,110],[360,150],[50,200],[150,180],[260,210],[380,190]].map(([cx,cy],k) => (
              <circle key={k} cx={cx} cy={cy} r={k%3===0?2:1.2} />
            ))}
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
            <line x1="40" y1="30" x2="120" y2="60" /><line x1="120" y1="60" x2="200" y2="20" />
            <line x1="200" y1="20" x2="280" y2="70" /><line x1="80" y1="120" x2="180" y2="140" />
            <line x1="180" y1="140" x2="300" y2="110" /><line x1="120" y1="60" x2="80" y2="120" />
          </g>
        </svg>
      </div>

      {/* ── Contenu principal ── */}
      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-0 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">

          {/* Colonne marque */}
          <div>
            <Link href={localePath("/")} className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-md group-hover:blur-lg transition-all duration-500" />
                <Image
                  src="/Logo-HORUS-LAB.jpeg"
                  alt="Horus-Lab"
                  width={48}
                  height={48}
                  className="relative rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                horus<span className="text-sky">-lab</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-300">
              {about}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-sky">
              {tagline}
            </p>

            {/* Réseaux sociaux avec animation */}
            <div className="mt-7 flex flex-wrap gap-2">
              {social.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative grid size-10 place-items-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:bg-brand-500 hover:ring-brand-400/50 hover:shadow-lg hover:shadow-brand-500/25"
                >
                  <span className="absolute inset-0 rounded-full bg-brand-400/0 group-hover:bg-brand-400/20 blur-sm transition-all duration-300" />
                  <Icon className="relative size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              {f.columns[0].title}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-brand-300 transition-colors hover:text-white"
                  >
                    <span className="size-1 rounded-full bg-brand-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne entreprise */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              {f.columns[1].title}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-brand-300 transition-colors hover:text-white"
                  >
                    <span className="size-1 rounded-full bg-brand-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              {f.contactTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${email}`}
                  className="group flex items-start gap-3 text-sm text-brand-300 transition-colors hover:text-white">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10 transition-colors group-hover:bg-brand-500">
                    <IconMail className="size-4" />
                  </span>
                  <span className="leading-relaxed">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-brand-300">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                  <IconPhone className="size-4" />
                </span>
                <span className="flex flex-col gap-0.5">
                  {phones.map((ph) => (
                    <a key={ph} href={`tel:${ph.replace(/\s/g,"")}`}
                      className="transition-colors hover:text-white">{ph}</a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-300">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                  <IconPin className="size-4" />
                </span>
                {location}
              </li>
            </ul>

            {/* Badge disponibilité */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-xs font-semibold text-brand-200 ring-1 ring-white/10">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              {lang === "fr" ? "Disponible pour de nouveaux projets" : "Available for new projects"}
            </div>
          </div>
        </div>

        {/* ── Séparateur animé ── */}
        <div className="relative mt-14 h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-400/40 to-transparent animate-[gradient_6s_ease_infinite] bg-[length:200%_auto]" />
        </div>

        {/* ── Bas de page ── */}
        <div className="flex flex-col items-center justify-between gap-3 py-7 text-xs text-brand-400 sm:flex-row">
          <p>© {year} Horus-Lab. {f.rights}</p>
          <div className="flex items-center gap-5">
            <Link href={localePath("/legal")} className="transition-colors hover:text-white">
              {f.legal}
            </Link>
            <span aria-hidden className="flex items-center gap-1.5">
              <span>Made in Africa</span>
              <span className="text-base">🌍</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
