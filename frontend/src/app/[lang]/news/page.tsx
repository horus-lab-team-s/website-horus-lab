import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";
import { isLocale, locales, type Lang, getDictionary } from "@/i18n/dictionaries";
import { getNews } from "@/lib/news";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: d.news.pageTitle,
    description: d.news.subtitle,
    alternates: {
      canonical: `/${lang}/news`,
      languages: { fr: "/fr/news", en: "/en/news" },
    },
  };
}

function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function NewsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const n = d.news;
  const items = getNews(lang);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Hero éditorial */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface pt-32 pb-16 dark:from-slate-950 dark:to-[#070e1c] sm:pt-40">
          <div aria-hidden className="bg-grid-soft pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-[300px] w-[300px] rounded-full bg-sky/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-400/60" />
                {n.eyebrow}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 dark:text-white sm:text-5xl lg:text-6xl">
                {n.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                {n.subtitle}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Feed complet */}
        <section className="bg-surface pb-24 sm:pb-28">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            {items.length === 0 ? (
              <Reveal>
                <p className="rounded-2xl border border-brand-100 bg-white p-10 text-center text-muted dark:border-white/10 dark:bg-slate-900">
                  {n.empty}
                </p>
              </Reveal>
            ) : (
              <ol>
                {items.map((it, i) => (
                  <Reveal key={it.title} delay={(i % 4) * 70}>
                    <li className="group relative grid grid-cols-1 gap-4 border-t border-brand-100 py-7 transition-colors hover:border-brand-300 dark:border-white/10 dark:hover:border-white/25 sm:grid-cols-[200px_1fr] sm:gap-10 sm:py-8">
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <time
                          dateTime={it.date}
                          className="text-sm font-semibold text-brand-700 dark:text-brand-300"
                        >
                          {formatDate(it.date, lang)}
                        </time>
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:bg-white/5 dark:text-brand-200">
                          <span className="size-1.5 rounded-full bg-brand-500" />
                          {it.tag}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-brand-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 sm:text-2xl">
                          {it.title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                          {it.body}
                        </p>
                        {it.url && (
                          <a
                            href={it.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                          >
                            {n.readMore}
                            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        )}
                      </div>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-sky to-transparent transition-transform duration-700 group-hover:scale-x-100"
                      />
                    </li>
                  </Reveal>
                ))}
                <li
                  aria-hidden
                  className="h-px bg-brand-100 dark:bg-white/10"
                />
              </ol>
            )}
          </div>
        </section>

        {/* CTA bas */}
        <section className="bg-surface px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-12 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
                {d.cta.title}
              </h2>
              <div className="relative mt-7 flex justify-center">
                <Link
                  href={`/${lang}#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03]"
                >
                  {d.cta.button}
                  <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
