/**
 * Décor pour la page Candidature : grille + halos ANIMÉS + tracé « circuit ».
 * Les objets/icônes flottants (fusée, mallette, document…) ont été retirés
 * pour un rendu plus sobre ; on garde le mouvement des halos.
 * L'API `variant` est conservée.
 */

export function CareerBackdrop({ variant }: { variant: "perks" | "form" }) {
  void variant;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Trame technique */}
      <div className="absolute inset-0 bg-grid-soft opacity-60" />
      {/* Halos colorés en mouvement */}
      <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl animate-float-slow dark:bg-brand-600/20" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky/20 blur-3xl animate-drift dark:bg-sky/12" />
      <div className="absolute left-1/2 top-1/4 h-56 w-56 rounded-full bg-brand-200/18 blur-3xl animate-float dark:bg-brand-500/12" style={{ animationDelay: "1.5s" }} />

      {/* Tracé « circuit » */}
      <svg viewBox="0 0 1400 400" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand-400/20 dark:text-brand-500/20">
        <path d="M0 220 H220 L280 160 H520 L580 220 H800 L860 150 H1080 L1140 220 H1400"
          fill="none" stroke="currentColor" strokeWidth="1.2" />
        {[220, 520, 800, 1080].map((x, k) => (
          <circle key={k} cx={x} cy={k % 2 === 0 ? 160 : 220} r="3" fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}
