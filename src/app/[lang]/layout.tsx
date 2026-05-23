import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import {
  getDictionary,
  isLocale,
  locales,
  type Lang,
} from "@/i18n/dictionaries";

type Params = { lang: string };

// N'autorise que les locales connues ; les autres -> 404.
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
  const dict = getDictionary(lang);

  const title =
    lang === "fr"
      ? "Horus-Lab — Solutions technologiques intelligentes"
      : "Horus-Lab — Intelligent technology solutions";
  const description = dict.hero.subtitle;

  return {
    title: { absolute: title, template: "%s — Horus-Lab" },
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: ["/Logo-HORUS-LAB.jpeg"],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <LanguageProvider lang={lang}>
      <ScrollProgress />
      {children}
      <BackToTop />
    </LanguageProvider>
  );
}
