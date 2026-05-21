import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { Newsletter } from "@/components/sections/Newsletter";
import { getAllPostParams, getPost } from "@/lib/blog";
import { isLocale } from "@/i18n/dictionaries";

type Params = { lang: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPost(slug, lang);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: { fr: `/fr/blog/${slug}`, en: `/en/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPost(slug, lang);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Horus-Lab",
      logo: {
        "@type": "ImageObject",
        url: "https://horus-lab.com/Logo-HORUS-LAB.jpeg",
      },
    },
    inLanguage: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Header />
      <main>
        <BlogPostHeader post={post} />
        <article className="bg-surface pb-20">
          <div
            className="article mx-auto max-w-3xl px-5 sm:px-8"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
