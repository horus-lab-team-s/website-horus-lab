import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { type Lang, locales, defaultLocale } from "@/i18n/dictionaries";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  lang: Lang;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  category: string;
  cover: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  /** HTML rendu depuis le markdown (contenu de confiance, fichiers locaux). */
  html: string;
};

/** Fichiers attendus : `content/blog/<slug>.<lang>.md` (ex. mon-article.fr.md). */
function filePath(slug: string, lang: Lang) {
  return path.join(BLOG_DIR, `${slug}.${lang}.md`);
}

/** Renvoie le chemin du fichier dans la langue demandée, ou la langue par défaut. */
function resolveFile(slug: string, lang: Lang): { file: string; lang: Lang } | null {
  if (fs.existsSync(filePath(slug, lang))) return { file: filePath(slug, lang), lang };
  if (fs.existsSync(filePath(slug, defaultLocale)))
    return { file: filePath(slug, defaultLocale), lang: defaultLocale };
  return null;
}

function toMeta(
  slug: string,
  lang: Lang,
  data: Record<string, unknown>,
  content: string
): PostMeta {
  const words = content.trim().split(/\s+/).length;
  return {
    slug,
    lang,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    author: String(data.author ?? "Horus-Lab"),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    category: String(data.category ?? ""),
    cover: String(data.cover ?? ""),
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

/** Liste des slugs uniques (toutes langues confondues). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const slugs = new Set<string>();
  for (const f of fs.readdirSync(BLOG_DIR)) {
    const m = f.match(/^(.+)\.(fr|en)\.md$/);
    if (m) slugs.add(m[1]);
  }
  return [...slugs];
}

export function getAllPosts(lang: Lang): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const resolved = resolveFile(slug, lang);
      if (!resolved) return null;
      const { data, content } = matter(fs.readFileSync(resolved.file, "utf8"));
      // On garde la locale demandée pour les liens, même si le contenu est en fallback.
      return toMeta(slug, lang, data, content);
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string, lang: Lang): Post | null {
  const resolved = resolveFile(slug, lang);
  if (!resolved) return null;
  const { data, content } = matter(fs.readFileSync(resolved.file, "utf8"));
  const meta = toMeta(slug, lang, data, content);
  const html = marked.parse(content, { async: false });
  return { ...meta, html };
}

/** Toutes les combinaisons (lang, slug) pour generateStaticParams. */
export function getAllPostParams(): { lang: Lang; slug: string }[] {
  const slugs = getPostSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}
