/* Fond décoratif réutilisable — halos diffus ANIMÉS (profondeur discrète).
   Les étoiles scintillantes et les planètes/astres ont été retirées
   (icônes de fond) ; on garde le voile de nébuleuse pour garder de la vie.
   L'API est conservée pour ne pas casser les appels existants. */

export function Starfield({
  tone = "white",
  className = "",
}: {
  /** "white" pour fond sombre, "brand" pour fond clair */
  tone?: "white" | "brand";
  density?: "dense" | "light";
  astres?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full blur-3xl animate-float-slow"
        style={{ background: tone === "white" ? "rgba(33,150,243,0.18)" : "rgba(33,150,243,0.10)" }}
      />
      <div
        className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl animate-drift"
        style={{ background: tone === "white" ? "rgba(91,184,232,0.16)" : "rgba(132,182,244,0.10)" }}
      />
    </div>
  );
}
