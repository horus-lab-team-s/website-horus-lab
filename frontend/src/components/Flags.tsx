/* Drapeaux SVG — rendus fiables sur tous les OS (les emojis 🇫🇷/🇬🇧
   ne s'affichent pas sous Windows, d'où ces composants vectoriels). */

type FlagProps = { className?: string };

/** Drapeau français (tricolore) */
export function FlagFR({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden role="img"
      style={{ borderRadius: 2, overflow: "hidden" }}>
      <rect width="24" height="16" fill="#fff" />
      <rect width="8" height="16" fill="#0055A4" />
      <rect x="16" width="8" height="16" fill="#EF4135" />
    </svg>
  );
}

/** Drapeau britannique (Union Jack) — anglais */
export function FlagGB({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden role="img"
      style={{ borderRadius: 2, overflow: "hidden" }}>
      <clipPath id="gb-clip"><rect width="24" height="16" rx="0" /></clipPath>
      <g clipPath="url(#gb-clip)">
        <rect width="24" height="16" fill="#012169" />
        {/* Diagonales blanches */}
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.2" />
        {/* Diagonales rouges */}
        <path d="M0 0 L24 16" stroke="#C8102E" strokeWidth="1.6"
          clipPath="url(#gb-clip)" />
        <path d="M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
        {/* Croix blanche */}
        <rect x="9.5" width="5" height="16" fill="#fff" />
        <rect y="5.5" width="24" height="5" fill="#fff" />
        {/* Croix rouge */}
        <rect x="10.5" width="3" height="16" fill="#C8102E" />
        <rect y="6.5" width="24" height="3" fill="#C8102E" />
      </g>
    </svg>
  );
}

/** Sélecteur par code langue */
export function FlagIcon({ code, className }: { code: string; className?: string }) {
  return code === "en" ? <FlagGB className={className} /> : <FlagFR className={className} />;
}
