import { Reveal } from "@/components/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
};

/**
 * Titre de section unifié pour tout le site : toujours CENTRÉ par défaut, même
 * forme partout (eyebrow discret + gros titre + sous-titre fin). Pas de tiret
 * décoratif. Le sous-titre est volontairement compact (une ligne en desktop).
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: Props) {
  const wrap = align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-2xl text-left";
  return (
    <Reveal className={wrap}>
      <span
        className={`text-xs font-bold uppercase tracking-[0.24em] ${
          light ? "text-sky" : "text-brand-500"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-brand-900 dark:text-white"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-3 max-w-3xl text-pretty text-[15px] leading-relaxed ${
            light ? "text-brand-100" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
