"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/i18n/LanguageProvider";

/**
 * Lien d'un site à l'autre. Sur horus-lab.com il mène vers Zayra Technologies,
 * sur zayra.technologies.horus-lab.com il ramène vers Horus Lab, en gardant la
 * page en cours. Les deux liens sont rendus ; le CSS de marque (globals.css)
 * n'affiche que le bon, comme pour BrandLogo.
 */
const HORUS_URL = "https://horus-lab.com";
const ZAYRA_URL = "https://zayra.technologies.horus-lab.com";

export function SiteSwitch({ className, short }: { className: string; short?: boolean }) {
  const pathname = usePathname() || "/";
  const { lang } = useLang();
  const isFr = lang === "fr";
  const go = isFr ? "Aller vers" : "Go to";

  return (
    <>
      <span className="brand-horus">
        <a href={`${ZAYRA_URL}${pathname}`} className={className} title={`${go} Zayra Technologies`}>
          {short ? "Zayra Technologies" : `${go} Zayra Technologies`}
          <span aria-hidden>↗</span>
        </a>
      </span>
      <span className="brand-zayra-only">
        <a href={`${HORUS_URL}${pathname}`} className={className} title={`${go} Horus Lab`}>
          {short ? "Horus Lab" : `${go} Horus Lab`}
          <span aria-hidden>↗</span>
        </a>
      </span>
    </>
  );
}
