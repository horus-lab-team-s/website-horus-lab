"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";

/* ============================================================
   Corps de l'article — défilement interne AUTOMATIQUE.

   Un article très long ne doit pas noyer le lecteur ni repousser le forum tout
   en bas de la page. La zone de texte est donc plafonnée en hauteur
   (`--article-max-h`, définie en `clamp()` → s'adapte à tous les écrans) et
   devient défilante D'ELLE-MÊME dès que le contenu dépasse ce plafond.

   Un article court ne déclenche rien : pas de plafond visible, pas de barre,
   pas de dégradé — la page se comporte exactement comme avant.

   Le composant est client uniquement pour DÉTECTER le dépassement (afin
   d'afficher le dégradé de bas de zone, l'indice de lecture et de rendre la
   zone focusable au clavier). Le plafonnement lui-même est en CSS pur : même
   sans JavaScript, le texte reste lisible et défilable.
   ============================================================ */

const T = {
  fr: {
    label: "Contenu de l'article (zone défilante)",
    hint: "Article long — faites défiler dans le cadre pour lire la suite",
    done: "Fin de l'article",
  },
  en: {
    label: "Article content (scrollable area)",
    hint: "Long article — scroll inside the frame to read on",
    done: "End of article",
  },
};

export function ArticleBody({ html }: { html: string }) {
  const { lang } = useLang();
  const t = T[lang] ?? T.fr;

  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  /** Le contenu dépasse-t-il le plafond ? (2 px de tolérance = arrondis de rendu) */
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const over = el.scrollHeight - el.clientHeight > 2;
    setOverflowing(over);
    if (!over) setAtEnd(false);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;

    // Re-mesure sur redimensionnement de la fenêtre ET du contenu (images qui
    // arrivent, polices web, rotation du téléphone, zoom navigateur…).
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    window.addEventListener("resize", measure);

    // Les polices modifient la hauteur du texte après le 1er rendu.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, html]);

  /** Masque le dégradé une fois le bas atteint (sinon il cache la dernière ligne). */
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
  }, []);

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
      <div className="relative">
        <div
          ref={ref}
          onScroll={onScroll}
          data-overflow={overflowing ? "true" : undefined}
          // Zone défilante = repère de navigation, et focusable pour pouvoir la
          // parcourir aux flèches / Page↓ sans souris (exigence d'accessibilité).
          role={overflowing ? "region" : undefined}
          aria-label={overflowing ? t.label : undefined}
          tabIndex={overflowing ? 0 : undefined}
          className="article-scroll"
        >
          <div
            className="article text-justify [hyphens:auto]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Dégradé de bas de zone : signale qu'il reste du texte à lire. */}
        {overflowing && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent transition-opacity duration-300 ${
              atEnd ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>

      {overflowing && (
        <p className="mt-3 text-center text-xs font-medium text-muted">
          {atEnd ? t.done : t.hint}
        </p>
      )}
    </div>
  );
}
