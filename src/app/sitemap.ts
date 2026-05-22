import type { MetadataRoute } from "next";
import { locales } from "@/i18n/dictionaries";
import { getPostSlugs } from "@/lib/blog";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getPostSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push({
      url: `${BASE}/${lang}`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { fr: `${BASE}/fr`, en: `${BASE}/en` } },
    });
    entries.push({
      url: `${BASE}/${lang}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const slug of slugs) {
      entries.push({
        url: `${BASE}/${lang}/blog/${slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            fr: `${BASE}/fr/blog/${slug}`,
            en: `${BASE}/en/blog/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
