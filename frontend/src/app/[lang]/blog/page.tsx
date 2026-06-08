import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { LiveChat } from "@/components/blog/LiveChat";
import { getCmsPosts } from "@/lib/cms";
import { getDictionary, isLocale, locales, type Lang } from "@/i18n/dictionaries";

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
  const dict = getDictionary(lang);
  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { fr: "/fr/blog", en: "/en/blog" },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const posts = await getCmsPosts(lang);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <BlogHero />
        <BlogIndex posts={posts} />
      </main>
      <LiveChat />
      <Footer />
    </>
  );
}
