import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogForum } from "@/components/blog/BlogForum";
import { getCmsPost } from "@/lib/cms";
import { isLocale } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";

type Params = { lang: string; slug: string };

// Article rendu à la demande depuis le CMS (source de vérité), pas de pré-rendu
// au build : tout article publié dans l'admin est résolu immédiatement, et un
// build lancé pendant que l'API est injoignable ne casse plus les articles.
// (Avant : generateStaticParams ne prérendait que les slugs markdown → les
// articles présents uniquement en CMS renvoyaient 404.)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = await getCmsPost(slug, lang);
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

  const post = await getCmsPost(slug, lang);
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
        url: `${SITE_URL}/logo/logo-light-bg-full.png`,
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
      <main id="main" tabIndex={-1}>
        <BlogPostHeader post={post} />
        <article className="relative overflow-hidden bg-surface pb-20">
          {/* Filigranes discrets : logo Horus dans le fond des zones vides (haut-droite + bas-gauche). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url('/logo/logo-light-bg-full.png')] bg-[length:460px] bg-[right_-1.5rem_top_5rem] bg-no-repeat opacity-[0.05] dark:bg-[url('/logo/logo-dark-bg-full.png')] dark:opacity-[0.07]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url('/logo/logo-light-bg-full.png')] bg-[length:400px] bg-[left_-2rem_bottom_5rem] bg-no-repeat opacity-[0.04] dark:bg-[url('/logo/logo-dark-bg-full.png')] dark:opacity-[0.06]"
          />
          <div
            className="article relative z-10 mx-auto max-w-3xl px-5 text-justify [hyphens:auto] sm:px-8"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
        <BlogForum slug={slug} title={post.title} />
      </main>
      <Footer />
    </>
  );
}
