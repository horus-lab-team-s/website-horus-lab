/**
 * Décor animé (CSS pur, server-component) pour la page Candidature.
 * Grille + halos + objets flottants thématiques (carrière / dossier).
 * Deux variantes :
 *   - "perks" : objets « emploi » (fusée, mallette, ampoule, cible…)
 *   - "form"  : objets « dossier » (document, upload, trombone, ZIP…)
 */

type Shape =
  | "rocket" | "briefcase" | "bulb" | "target" | "code" | "gear"
  | "star" | "chart" | "diamond" | "spark" | "badge"
  | "doc" | "upload" | "clip" | "check" | "mail" | "zip" | "circle";

function Glyph({ shape, size }: { shape: Shape; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (shape) {
    case "rocket":    return <svg {...common}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 12c2-5 5-8 11-9 1 6-2 9-7 11l-4-2z"/><circle cx="14.5" cy="8.5" r="1.5"/></svg>;
    case "briefcase": return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>;
    case "bulb":      return <svg {...common}><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10c.7.7 1 1.3 1 2h6c0-.7.3-1.3 1-2a6 6 0 0 0-4-10z"/></svg>;
    case "target":    return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>;
    case "code":      return <svg {...common}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 6l-2 12"/></svg>;
    case "gear":      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>;
    case "star":      return <svg {...common}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
    case "chart":     return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>;
    case "diamond":   return <svg {...common}><polygon points="12,2 22,12 12,22 2,12"/></svg>;
    case "spark":     return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>;
    case "badge":     return <svg {...common}><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>;
    case "doc":       return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>;
    case "upload":    return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
    case "clip":      return <svg {...common}><path d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>;
    case "check":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>;
    case "mail":      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case "zip":       return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M11 7h1M12 9h1M11 11h1M12 13h1"/></svg>;
    case "circle":    return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

const PERKS_SHAPES: { s: Shape; x: string; y: string; sz: number; d: string; dur: string }[] = [
  { s: "rocket",    x: "5%",  y: "14%", sz: 46, d: "0s",   dur: "11s" },
  { s: "briefcase", x: "90%", y: "9%",  sz: 40, d: "1.2s", dur: "9s"  },
  { s: "bulb",      x: "16%", y: "70%", sz: 40, d: "0.6s", dur: "10s" },
  { s: "target",    x: "84%", y: "68%", sz: 44, d: "2.0s", dur: "12s" },
  { s: "star",      x: "48%", y: "8%",  sz: 30, d: "1.6s", dur: "9s"  },
  { s: "code",      x: "70%", y: "82%", sz: 38, d: "0.3s", dur: "10s" },
  { s: "gear",      x: "28%", y: "34%", sz: 30, d: "2.6s", dur: "8s"  },
  { s: "chart",     x: "78%", y: "38%", sz: 34, d: "0.9s", dur: "11s" },
  { s: "badge",     x: "9%",  y: "44%", sz: 36, d: "1.9s", dur: "9s"  },
  { s: "diamond",   x: "56%", y: "60%", sz: 24, d: "2.2s", dur: "10s" },
  { s: "spark",     x: "38%", y: "88%", sz: 30, d: "1.4s", dur: "8s"  },
  { s: "circle",    x: "94%", y: "50%", sz: 26, d: "0.5s", dur: "12s" },
];

const FORM_SHAPES: { s: Shape; x: string; y: string; sz: number; d: string; dur: string }[] = [
  { s: "doc",     x: "4%",  y: "12%", sz: 40, d: "0s",   dur: "11s" },
  { s: "upload",  x: "92%", y: "10%", sz: 38, d: "1.1s", dur: "9s"  },
  { s: "zip",     x: "12%", y: "74%", sz: 40, d: "0.7s", dur: "10s" },
  { s: "clip",    x: "86%", y: "70%", sz: 34, d: "2.0s", dur: "12s" },
  { s: "mail",    x: "50%", y: "6%",  sz: 30, d: "1.5s", dur: "9s"  },
  { s: "check",   x: "72%", y: "84%", sz: 34, d: "0.3s", dur: "10s" },
  { s: "star",    x: "30%", y: "40%", sz: 24, d: "2.6s", dur: "8s"  },
  { s: "doc",     x: "80%", y: "40%", sz: 28, d: "0.9s", dur: "11s" },
  { s: "spark",   x: "8%",  y: "46%", sz: 28, d: "1.9s", dur: "9s"  },
  { s: "diamond", x: "58%", y: "58%", sz: 22, d: "2.2s", dur: "10s" },
];

export function CareerBackdrop({ variant }: { variant: "perks" | "form" }) {
  const shapes = variant === "perks" ? PERKS_SHAPES : FORM_SHAPES;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Trame technique */}
      <div className="absolute inset-0 bg-grid-soft opacity-40" />
      {/* Halos colorés en mouvement */}
      <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-brand-300/12 blur-3xl animate-float-slow dark:bg-brand-600/10" />
      <div className="absolute right-0 bottom-0 h-60 w-60 rounded-full bg-sky/10 blur-3xl animate-drift dark:bg-sky/6" />
      <div className="absolute left-1/2 top-1/4 h-52 w-52 rounded-full bg-violet-200/10 blur-3xl animate-float dark:bg-violet-500/6" style={{ animationDelay: "1.5s" }} />

      {/* Tracé « circuit » subtil */}
      <svg viewBox="0 0 1400 400" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand-300/10 dark:text-brand-600/10">
        <path d="M0 220 H220 L280 160 H520 L580 220 H800 L860 150 H1080 L1140 220 H1400"
          fill="none" stroke="currentColor" strokeWidth="0.8" />
        {[220, 520, 800, 1080].map((x, k) => (
          <circle key={k} cx={x} cy={k % 2 === 0 ? 160 : 220} r="2.5" fill="currentColor" />
        ))}
      </svg>

      {/* Objets flottants thématiques */}
      {shapes.map((sh, i) => (
        <div key={i}
          className="absolute animate-float text-brand-400/[0.13] dark:text-brand-300/[0.10]"
          style={{ left: sh.x, top: sh.y, animationDelay: sh.d, animationDuration: sh.dur }}>
          <Glyph shape={sh.s} size={sh.sz} />
        </div>
      ))}
    </div>
  );
}
