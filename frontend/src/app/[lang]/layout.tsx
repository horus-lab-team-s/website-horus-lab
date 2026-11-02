import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { getCmsSiteSettings, getCmsFormationsPromo } from "@/lib/cms";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { HorusAI } from "@/components/HorusAI";
import { EdlearningPromo } from "@/components/EdlearningPromo";
import { BRAND_NAME, brandHomeTitle, brandShareDescription, brandShareImage } from "@/lib/brand";
import {
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
  const title = brandHomeTitle(lang);
  const description = brandShareDescription(lang);
  const image = brandShareImage(lang);

  return {
    title: { absolute: title, template: `%s | ${BRAND_NAME}` },
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: BRAND_NAME,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
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

  const [settings, promo] = await Promise.all([
    getCmsSiteSettings(lang),
    getCmsFormationsPromo(lang),
  ]);

  return (
    <LanguageProvider lang={lang} settings={settings}>
      <ScrollProgress />
      {children}
      <BackToTop />
      <HorusAI />
      <EdlearningPromo promo={promo} />
    </LanguageProvider>
  );
}
