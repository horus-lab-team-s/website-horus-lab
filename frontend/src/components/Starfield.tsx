/* Fond cosmique réutilisable — étoiles scintillantes + astres animés.
   Positions générées de façon déterministe (PRNG seedé) pour éviter
   tout décalage d'hydratation entre serveur et client. */

/* mulberry32 — PRNG déterministe */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; size: number; delay: number; dur: number; bright: boolean };

function buildStars(count: number, seed: number): Star[] {
  const rand = rng(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.6 + rand() * 2.2,
      delay: rand() * 6,
      dur: 2.4 + rand() * 4,
      bright: rand() > 0.82,
    });
  }
  return stars;
}

/* Pré-calcul (module-level → identique SSR / client) */
const STARS_DENSE = buildStars(220, 1337);
const STARS_LIGHT = buildStars(90, 4242);

type AstreDef = {
  x: string; y: string; size: number; ring?: boolean;
  from: string; to: string; dur: string; delay: string; anim: string;
};

const ASTRES: AstreDef[] = [
  { x: "12%", y: "22%", size: 90,  ring: true,  from: "#1b6fd0", to: "#0f2a5e", dur: "16s", delay: "0s",   anim: "animate-float-slow" },
  { x: "82%", y: "16%", size: 54,  ring: false, from: "#5bb8e8", to: "#1b4f9c", dur: "12s", delay: "1.5s", anim: "animate-float" },
  { x: "70%", y: "74%", size: 120, ring: true,  from: "#2196f3", to: "#0f2a5e", dur: "22s", delay: "0.8s", anim: "animate-drift" },
  { x: "26%", y: "78%", size: 40,  ring: false, from: "#84b6f4", to: "#1b6fd0", dur: "14s", delay: "2.2s", anim: "animate-float" },
];

export function Starfield({
  tone = "white",
  density = "dense",
  astres = true,
  className = "",
}: {
  /** "white" pour fond sombre, "brand" pour fond clair */
  tone?: "white" | "brand";
  density?: "dense" | "light";
  astres?: boolean;
  className?: string;
}) {
  const stars = density === "dense" ? STARS_DENSE : STARS_LIGHT;
  const starColor = tone === "white" ? "#ffffff" : "var(--color-brand-500)";
  const brightColor = tone === "white" ? "#bfe3ff" : "var(--color-sky)";

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Étoiles */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.bright ? brightColor : starColor,
            boxShadow: s.bright
              ? `0 0 ${s.size * 3}px ${brightColor}`
              : tone === "white"
                ? `0 0 ${s.size * 1.5}px rgba(255,255,255,0.6)`
                : "none",
            opacity: tone === "white" ? 0.9 : 0.5,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* Astres / planètes */}
      {astres &&
        ASTRES.map((a, i) => (
          <div
            key={`a-${i}`}
            className={`absolute ${a.anim}`}
            style={{
              left: a.x,
              top: a.y,
              width: a.size,
              height: a.size,
              animationDuration: a.dur,
              animationDelay: a.delay,
            }}
          >
            <div
              className="size-full rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${a.from}, ${a.to})`,
                boxShadow: `0 0 ${a.size / 2}px ${a.from}55, inset -${a.size / 8}px -${a.size / 8}px ${a.size / 4}px rgba(0,0,0,0.45)`,
                opacity: tone === "white" ? 0.85 : 0.5,
              }}
            />
            {a.ring && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-[50%]"
                style={{
                  width: a.size * 1.7,
                  height: a.size * 0.55,
                  border: `2px solid ${a.from}66`,
                  transform: "translate(-50%, -50%) rotate(-22deg)",
                }}
              />
            )}
          </div>
        ))}

      {/* Voile de nébuleuse */}
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
