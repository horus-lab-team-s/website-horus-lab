"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import type { CmsPromo } from "@/lib/cms";
import { IconArrowRight, IconClose } from "./icons";

/**
 * Bannière « accrochante » mais NON bloquante (ce n'est pas un modal) : une
 * carte flottante en bas à gauche. Deux messages selon la page :
 *   • pages Formations  → aperçu Edlearning (la vraie formation est sur l'app,
 *     bouton Play Store) ;
 *   • autres pages      → annonce la date de démarrage et renvoie vers le
 *     catalogue (/formations).
 * Le visiteur peut la fermer quand il veut. La fermeture ne vaut que pour la vue
 * courante : la bannière RÉAPPARAÎT au rechargement ET à chaque changement de
 * page (remontage via `key={pathname}`) — volontaire, pour ne pas « perdre »
 * l'annonce. Placée en bas à gauche pour ne pas gêner le chat / le bouton
 * « haut de page » (bas à droite).
 *
 * Contenu piloté par l'admin Django (`getCmsFormationsPromo`). Le `promo` reçu
 * en prop prime ; s'il est `null` (API indisponible), on retombe sur les textes
 * intégrés ci-dessous → la bannière reste fonctionnelle hors-ligne.
 */

const LOGO = "/logo/logo-Edlearning.png";
// Repli si l'admin est injoignable. La source de vérité est le CMS ; ce lien
// reste un placeholder à remplacer par la fiche Play Store réelle de l'app.
const PLAY_URL = "https://play.google.com/store/search?q=Edlearning&c=apps";

const FALLBACK: Record<"fr" | "en", CmsPromo> = {
  fr: {
    active: true,
    logoPath: LOGO,
    playUrl: PLAY_URL,
    storeLabel: "Disponible sur",
    preview: {
      badge: "Aperçu",
      title: "La formation continue sur l'app Edlearning",
      body: "Ce site n'est qu'un aperçu. La formation complète et le suivi des apprenants se déroulent sur notre application mobile Edlearning.",
    },
    teaser: {
      badge: "Formations",
      title: "Nos formations gratuites démarrent le mardi 1er septembre 2026",
      body: "Développement web & mobile, génie logiciel et IA. Rejoignez le bootcamp Horus-Lab et montez en compétences.",
      cta: "Voir les formations",
    },
  },
  en: {
    active: true,
    logoPath: LOGO,
    playUrl: PLAY_URL,
    storeLabel: "Get it on",
    preview: {
      badge: "Preview",
      title: "The full training lives on the Edlearning app",
      body: "This site is only a preview. The complete training and learner tracking happen on our Edlearning mobile app.",
    },
    teaser: {
      badge: "Courses",
      title: "Our free courses start on Tuesday 1 September 2026",
      body: "Web & mobile development, software engineering and AI. Join the Horus-Lab bootcamp and level up your skills.",
      cta: "See the courses",
    },
  },
};

const CLOSE_LABEL = { fr: "Fermer", en: "Close" } as const;

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="edl-gp" x1="3" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00D3FF" />
          <stop offset="0.4" stopColor="#00E676" />
          <stop offset="0.7" stopColor="#FFCE00" />
          <stop offset="1" stopColor="#FF3D47" />
        </linearGradient>
      </defs>
      <path
        fill="url(#edl-gp)"
        d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L18.11,14.38L15.36,11.62L18.11,8.86L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
      />
    </svg>
  );
}

export function EdlearningPromo({ promo = null }: { promo?: CmsPromo | null }) {
  const pathname = usePathname() || "";
  // La clé = chemin de la page → le composant se REMONTE à chaque navigation,
  // ce qui relance l'animation d'entrée : la bannière réapparaît même si elle
  // avait été fermée sur la page précédente (comme au rechargement).
  return <PromoCard key={pathname} promo={promo} pathname={pathname} />;
}

function PromoCard({ promo, pathname }: { promo: CmsPromo | null; pathname: string }) {
  const { lang, localePath } = useLang();
  const key = lang === "en" ? "en" : "fr";
  const c = promo ?? FALLBACK[key];
  const active = c.active;

  // Sur les pages Formations : aperçu Edlearning (→ Play Store). Ailleurs :
  // annonce de la date de démarrage (→ catalogue /formations).
  const onFormations = /\/formations(\/|$)/.test(pathname);

  const [render, setRender] = useState(false); // présence dans le DOM
  const [shown, setShown] = useState(false); // état « entré » (animation)

  useEffect(() => {
    if (!active) return; // masquée depuis l'admin : rien à faire
    let raf = 0;
    // Petite temporisation : la carte apparaît puis glisse doucement (frame
    // suivante), sans agresser à l'arrivée. Pas de persistance : elle réapparaît
    // au rechargement (mais reste fermée pendant la navigation dans le site).
    const id = setTimeout(() => {
      setRender(true);
      raf = requestAnimationFrame(() => setShown(true));
    }, 700);
    return () => {
      clearTimeout(id);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  function dismiss() {
    setShown(false);
    setTimeout(() => setRender(false), 300);
  }

  if (!active || !render) return null;

  const title = onFormations ? c.preview.title : c.teaser.title;
  const badge = onFormations ? c.preview.badge : c.teaser.badge;
  const body = onFormations ? c.preview.body : c.teaser.body;

  return (
    <div
      role="complementary"
      aria-label={title}
      className={`fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100vw-2rem))] transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative overflow-hidden rounded-lg border border-brand-100 bg-white/95 shadow-2xl shadow-brand-900/20 backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
        {/* Filet d'accent coloré (rappel du logo Edlearning) */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky via-emerald-500 to-amber-400" />

        <button
          type="button"
          onClick={dismiss}
          aria-label={CLOSE_LABEL[key]}
          className="absolute right-2 top-2.5 grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <IconClose className="size-4" />
        </button>

        <div className="p-4 pt-5">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-white ring-1 ring-brand-100 dark:ring-white/10">
              <Image
                src={c.logoPath || LOGO}
                alt="Edlearning"
                width={48}
                height={48}
                className="h-11 w-11 object-contain"
              />
            </span>
            <div className="min-w-0 pr-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                {badge}
              </p>
              <h3 className="mt-0.5 text-sm font-extrabold leading-snug text-brand-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-muted">{body}</p>

          {onFormations
            ? c.playUrl && (
                <a
                  href={c.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center gap-2.5 rounded-md bg-black px-3.5 py-2 text-white shadow-lg shadow-black/20 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:bg-white/10 dark:ring-1 dark:ring-white/15"
                >
                  <GooglePlayMark className="size-6 shrink-0" />
                  <span className="flex flex-col leading-none">
                    <span className="text-[9px] font-medium uppercase tracking-wide text-white/75">{c.storeLabel}</span>
                    <span className="text-sm font-bold">Google Play</span>
                  </span>
                </a>
              )
            : (
              <Link
                href={localePath("/formations")}
                className="group mt-3.5 inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                {c.teaser.cta}
                <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}
