import { Reveal } from "@/components/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: Props) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      <span
        className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
          light ? "text-sky" : "text-brand-500"
        }`}
      >
        <span className={`h-px w-6 ${light ? "bg-sky/60" : "bg-brand-400/60"}`} />
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-brand-900 dark:text-white"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            light ? "text-brand-100" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
