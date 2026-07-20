/**
 * Séparateur en vague STATIQUE (sobre, pro) entre une section hero (fond sombre)
 * et la section suivante. `className` porte la COULEUR de la section suivante via
 * `text-*` (la vague est peinte en `currentColor`).
 *
 * Exemple : <WaveDivider className="text-white dark:text-[#070e1c]" />
 */
export function WaveDivider({
  className = "text-white dark:text-[#070e1c]",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] ${className}`}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[52px] w-full sm:h-[72px]"
      >
        {/* couche douce (léger relief) */}
        <path
          fill="currentColor"
          opacity="0.4"
          d="M0,48 C320,84 620,20 900,44 C1140,64 1300,72 1440,58 L1440,90 L0,90 Z"
        />
        {/* vague principale pleine */}
        <path
          fill="currentColor"
          d="M0,60 C300,92 640,34 960,56 C1200,72 1340,74 1440,66 L1440,90 L0,90 Z"
        />
      </svg>
    </div>
  );
}
