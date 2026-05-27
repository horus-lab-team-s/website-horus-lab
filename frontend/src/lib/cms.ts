/**
 * Client CMS — récupère le contenu administrable depuis le backend Django,
 * avec deux promesses :
 *   1. ISR : les réponses sont mises en cache côté Next et revalidées toutes
 *      les `CMS_REVALIDATE` secondes (60 par défaut). Une fois l'admin met à
 *      jour quelque chose, le site se rafraîchit automatiquement à la minute.
 *   2. Fallback statique : si l'API est indisponible (réseau, déploiement,
 *      backend down), on retombe sur les données locales — le site continue
 *      à fonctionner sans plâtre, donc aucune régression possible.
 *
 * Variable d'environnement : `BACKEND_API_URL` côté serveur uniquement
 * (Next n'expose pas cette URL au navigateur). En dev : http://localhost:8000.
 */
import type { Lang } from "@/i18n/dictionaries";
import {
  getProjects as getStaticProjects,
  type Project,
} from "@/lib/projects";
import { getNews as getStaticNews, type NewsItem } from "@/lib/news";

export const CMS_REVALIDATE = 60;
const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Paginated<T> = { results: T[] } | T[];

async function fetchPaginated<T>(path: string): Promise<T[]> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: CMS_REVALIDATE },
  });
  if (!res.ok) {
    throw new Error(`API ${path} returned ${res.status}`);
  }
  const data = (await res.json()) as Paginated<T>;
  return Array.isArray(data) ? data : data.results;
}

/* ============================================================
   Projets
   ============================================================ */
type ApiProject = {
  id: number;
  title_fr: string;
  title_en: string;
  client_fr: string;
  client_en: string;
  category_fr: string;
  category_en: string;
  description_fr: string;
  description_en: string;
  role_fr: string;
  role_en: string;
  scope_fr: string;
  scope_en: string;
  tags: string[];
  result_fr: string;
  result_en: string;
  cover: string | null;
  icon: string;
  gradient: string;
  url: string;
  is_featured: boolean;
  order: number;
};

function mapProject(p: ApiProject, lang: Lang): Project {
  const pick = (fr: string, en: string) => (lang === "fr" ? fr : en);
  return {
    title: pick(p.title_fr, p.title_en),
    client: pick(p.client_fr, p.client_en) || undefined,
    category: pick(p.category_fr, p.category_en),
    desc: pick(p.description_fr, p.description_en),
    role: pick(p.role_fr, p.role_en) || undefined,
    scope: pick(p.scope_fr, p.scope_en) || undefined,
    tags: p.tags ?? [],
    result: pick(p.result_fr, p.result_en),
    iconKey: p.icon,
    gradient: p.gradient,
    url: p.url || undefined,
  };
}

export async function getCmsProjects(lang: Lang): Promise<Project[]> {
  try {
    const data = await fetchPaginated<ApiProject>("/api/portfolio/");
    if (!data.length) return getStaticProjects(lang);
    // Tri : featured puis order (le backend applique déjà ordering=["order"]).
    return data
      .slice()
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.order - b.order)
      .map((p) => mapProject(p, lang));
  } catch {
    return getStaticProjects(lang);
  }
}

/* ============================================================
   Actualités
   ============================================================ */
type ApiNews = {
  id: number;
  title_fr: string;
  title_en: string;
  body_fr: string;
  body_en: string;
  tag_fr: string;
  tag_en: string;
  url: string;
  published_at: string;
};

function mapNews(n: ApiNews, lang: Lang): NewsItem {
  const pick = (fr: string, en: string) => (lang === "fr" ? fr : en);
  return {
    date: n.published_at,
    title: pick(n.title_fr, n.title_en),
    body: pick(n.body_fr, n.body_en),
    tag: pick(n.tag_fr, n.tag_en),
    url: n.url || undefined,
  };
}

export async function getCmsNews(lang: Lang): Promise<NewsItem[]> {
  try {
    const data = await fetchPaginated<ApiNews>("/api/news/");
    if (!data.length) return getStaticNews(lang);
    return data
      .slice()
      .sort((a, b) => (a.published_at < b.published_at ? 1 : -1))
      .map((n) => mapNews(n, lang));
  } catch {
    return getStaticNews(lang);
  }
}
