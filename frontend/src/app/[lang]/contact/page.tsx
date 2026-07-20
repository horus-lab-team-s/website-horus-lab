import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/sections/Contact";
import { getDictionary, isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;
export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: lang === "fr" ? "Contactez-nous" : "Contact us",
    description: d.contactForm.subtitle,
    alternates: { canonical: `/${lang}/contact`, languages: { fr: "/fr/contact", en: "/en/contact" } },
  };
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="pt-20 sm:pt-24">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
