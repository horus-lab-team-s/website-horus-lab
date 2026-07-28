import type { TechNewsItem } from "@/lib/cms";
import type { Lang } from "@/i18n/dictionaries";

/**
 * Section « Actualités tech » : brèves récupérées automatiquement depuis des
 * flux RSS tech (mondial + Afrique), traduites dans la langue du site. On
 * n'affiche que titre + résumé + lien vers la source (respect du droit d'auteur).
 * Rien à afficher si la liste est vide → la section disparaît.
 */
export function TechNews({ items, lang }: { items: TechNewsItem[]; lang: Lang }) {
  if (!items.length) return null;

  const c =
    lang === "fr"
      ? { eyebrow: "En direct", title: "Actualités tech", subtitle: "L'actualité tech mondiale et africaine, mise à jour en continu.", read: "Lire sur" }
      : { eyebrow: "Live", title: "Tech news", subtitle: "Global and African tech news, updated continuously.", read: "Read on" };

  return (
    <section aria-label={c.title} className="bg-white py-14 dark:bg-[#070e1c] sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            <span className="size-1.5 rounded-full bg-emerald-500 glow-pulse" />
            {c.eyebrow}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-3xl">
            {c.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted">{c.subtitle}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((n) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              {n.image && (
                <div className="relative h-36 overflow-hidden bg-brand-50 dark:bg-white/5">
                  {/* Images distantes (hôtes RSS variés) : balise <img> volontaire. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                  {n.source}
                </span>
                <h3 className="mt-1.5 font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600 dark:text-white line-clamp-3">
                  {n.title}
                </h3>
                {n.summary && (
                  <p className="mt-2 flex-1 text-sm text-muted line-clamp-3">{n.summary}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">
                  {c.read} {n.source}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
