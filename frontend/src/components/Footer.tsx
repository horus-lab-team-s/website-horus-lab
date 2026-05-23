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
  IconWhatsApp,
  IconX,
} from "./icons";

const SOCIAL = [
  { Icon: IconLinkedIn, label: "LinkedIn", href: "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259" },
  { Icon: IconX, label: "X", href: "https://x.com/horuslabafrik" },
  { Icon: IconFacebook, label: "Facebook", href: "https://www.facebook.com/HorusLab" },
  { Icon: IconWhatsApp, label: "WhatsApp", href: "https://wa.me/237699173771" },
  { Icon: IconGitHub, label: "GitHub", href: "https://github.com/horus-lab-team-s" },
];

export function Footer() {
  const { dict, localePath } = useLang();
  const f = dict.footer;
  const year = new Date().getFullYear();

  const columns = [
    {
      title: f.columns[0].title,
      links: dict.services.items.map((item) => ({
        label: item.title,
        href: localePath("#services"),
      })),
    },
    {
      title: f.columns[1].title,
      links: [
        { label: dict.nav.about, href: localePath("/about") },
        { label: dict.nav.portfolio, href: localePath("/portfolio") },
        { label: dict.nav.process, href: localePath("#process") },
        { label: dict.nav.sectors, href: localePath("#sectors") },
        { label: dict.nav.blog, href: localePath("/blog") },
      ],
    },
  ];

  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/Logo-HORUS-LAB.jpeg"
                alt="Horus-Lab"
                width={44}
                height={44}
                className="rounded-full ring-1 ring-white/20"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                horus<span className="text-sky">-lab</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
              {f.about}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-sky">
              {f.tagline}
            </p>
          </div>

          {/* Colonnes de liens */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {f.contactTitle}
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${f.email}`}
                  className="flex items-center gap-3 text-brand-200 transition-colors hover:text-white"
                >
                  <IconMail className="size-5 text-sky" />
                  {f.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-brand-200">
                <IconPhone className="mt-0.5 size-5 shrink-0 text-sky" />
                <span className="flex flex-col gap-1">
                  {f.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3 text-brand-200">
                <IconPin className="size-5 text-sky" />
                {f.location}
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-500"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-brand-300 sm:flex-row">
          <p>
            © {year} Horus-Lab. {f.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={localePath("/legal")}
              className="transition-colors hover:text-white"
            >
              {f.legal}
            </Link>
            <span aria-hidden>Made in Africa 🌍</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
