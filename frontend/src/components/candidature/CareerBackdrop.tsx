/**
 * Décor de fond sobre (CSS pur, server-component) pour la page Candidature :
 * grille fine + halos discrets. Aucune forme flottante ni animation.
 */
export function CareerBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-soft opacity-40 dark:opacity-20" />
      <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-brand-200/25 blur-3xl dark:bg-brand-700/12" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/12 blur-3xl dark:bg-sky/8" />
    </div>
  );
}
