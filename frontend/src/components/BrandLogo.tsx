import Image from "next/image";

/**
 * Logo de marque. Le site est servi sous deux noms : horus-lab.com (logo
 * Horus-Lab) et zayra.technologies.horus-lab.com (logo Zayra Technologies).
 * Les deux logos sont rendus ; le script de app/layout.tsx pose la classe
 * `brand-zayra` sur <html> avant le premier affichage selon le domaine, et le
 * CSS (globals.css) n'affiche que le bon. Les pages restent ainsi statiques.
 *
 * `variant` : "auto" suit le thème clair/sombre, "light" / "dark" forcent la
 * version pour fond clair ou sombre.
 */
type Props = {
  variant?: "auto" | "light" | "dark";
  /** Classes du logo Horus-Lab (logo carré). */
  horusClassName: string;
  /** Classes du logo Zayra (logo horizontal, plus large que haut). */
  zayraClassName: string;
  horusSrc?: { light: string; dark: string };
  priority?: boolean;
};

const HORUS = { light: "/logo/logo-light-bg-full.png", dark: "/logo/logo-dark-bg-full.png" };
const ZAYRA = { light: "/zayra/brand/zayra-logo.png", dark: "/zayra/brand/zayra-logo-white.png" };

export function BrandLogo({ variant = "auto", horusClassName, zayraClassName, horusSrc = HORUS, priority }: Props) {
  const show = (v: "light" | "dark") =>
    variant === "auto" ? (v === "light" ? "dark:hidden" : "hidden dark:block") : variant === v ? "" : "hidden";

  return (
    <>
      <span className="brand-horus">
        {(["light", "dark"] as const).map((v) =>
          variant === "auto" || variant === v ? (
            <Image key={v} src={horusSrc[v]} alt="Horus-Lab" width={320} height={232} priority={priority}
              className={`${horusClassName} ${show(v)}`} />
          ) : null,
        )}
      </span>
      <span className="brand-zayra-only">
        {(["light", "dark"] as const).map((v) =>
          variant === "auto" || variant === v ? (
            <Image key={v} src={ZAYRA[v]} alt="Zayra Technologies" width={700} height={243} priority={priority}
              className={`${zayraClassName} ${show(v)}`} />
          ) : null,
        )}
      </span>
    </>
  );
}
