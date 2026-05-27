/**
 * Client CMS — récupère le contenu administrable depuis le backend Django,
 * avec deux promesses :
 *   1. ISR : les réponses sont mises en cache côté Next et revalidées toutes
 *      les `CMS_REVALIDATE` secondes (60 par défaut). Une fois l'admin met à
 *      jour quelque chose, le site se rafraîchit automatiquement à la minute.
 *   2. Fallback : si l'API est indisponible (réseau, déploiement, backend
 *      down), on retombe sur les données locales du dictionnaire — le site
 *      continue à fonctionner. Zéro régression possible.
 *
 * Variable d'environnement : `BACKEND_API_URL` côté serveur uniquement
 * (Next n'expose pas cette URL au navigateur). En dev : http://localhost:8000.
 */
import type { Dict, Lang } from "@/i18n/dictionaries";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getProjects as getStaticProjects,
  type Project,
} from "@/lib/projects";
import { getNews as getStaticNews, type NewsItem } from "@/lib/news";

export const CMS_REVALIDATE = 60;
const API_BASE = (process.env.BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Paginated<T> = { results: T[] } | T[];

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: CMS_REVALIDATE },
  });
  if (!res.ok) throw new Error(`API ${path} returned ${res.status}`);
  return (await res.json()) as T;
}

async function fetchList<T>(path: string): Promise<T[]> {
  const data = await fetchJson<Paginated<T>>(path);
  return Array.isArray(data) ? data : data.results;
}

const pick = (lang: Lang) => (fr: string, en: string) => (lang === "fr" ? fr : en);

/* ============================================================
   Projets
   ============================================================ */
type ApiProject = {
  id: number;
  title_fr: string; title_en: string;
  client_fr: string; client_en: string;
  category_fr: string; category_en: string;
  description_fr: string; description_en: string;
  role_fr: string; role_en: string;
  scope_fr: string; scope_en: string;
  tags: string[];
  result_fr: string; result_en: string;
  cover: string | null;
  icon: string;
  gradient: string;
  url: string;
  is_featured: boolean;
  order: number;
};

function mapProject(p: ApiProject, lang: Lang): Project {
  const t = pick(lang);
  return {
    title: t(p.title_fr, p.title_en),
    client: t(p.client_fr, p.client_en) || undefined,
    category: t(p.category_fr, p.category_en),
    desc: t(p.description_fr, p.description_en),
    role: t(p.role_fr, p.role_en) || undefined,
    scope: t(p.scope_fr, p.scope_en) || undefined,
    tags: p.tags ?? [],
    result: t(p.result_fr, p.result_en),
    iconKey: p.icon,
    gradient: p.gradient,
    url: p.url || undefined,
  };
}

export async function getCmsProjects(lang: Lang): Promise<Project[]> {
  try {
    const data = await fetchList<ApiProject>("/api/portfolio/");
    if (!data.length) return getStaticProjects(lang);
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
  title_fr: string; title_en: string;
  body_fr: string; body_en: string;
  tag_fr: string; tag_en: string;
  url: string;
  published_at: string;
};

function mapNews(n: ApiNews, lang: Lang): NewsItem {
  const t = pick(lang);
  return {
    date: n.published_at,
    title: t(n.title_fr, n.title_en),
    body: t(n.body_fr, n.body_en),
    tag: t(n.tag_fr, n.tag_en),
    url: n.url || undefined,
  };
}

export async function getCmsNews(lang: Lang): Promise<NewsItem[]> {
  try {
    const data = await fetchList<ApiNews>("/api/news/");
    if (!data.length) return getStaticNews(lang);
    return data
      .slice()
      .sort((a, b) => (a.published_at < b.published_at ? 1 : -1))
      .map((n) => mapNews(n, lang));
  } catch {
    return getStaticNews(lang);
  }
}

/* ============================================================
   Hero — textes + stats
   ============================================================ */
type ApiHero = {
  content: {
    eyebrow_fr: string; eyebrow_en: string;
    title_lead_fr: string; title_lead_en: string;
    title_highlight_fr: string; title_highlight_en: string;
    subtitle_fr: string; subtitle_en: string;
    cta_primary_fr: string; cta_primary_en: string;
    cta_secondary_fr: string; cta_secondary_en: string;
  };
  stats: { value: string; label_fr: string; label_en: string; order: number }[];
};

export type CmsHero = Dict["hero"];

export async function getCmsHero(lang: Lang): Promise<CmsHero> {
  const fallback = getDictionary(lang).hero;
  try {
    const data = await fetchJson<ApiHero>("/api/hero/");
    const t = pick(lang);
    return {
      eyebrow: t(data.content.eyebrow_fr, data.content.eyebrow_en),
      titleLead: t(data.content.title_lead_fr, data.content.title_lead_en),
      titleHighlight: t(data.content.title_highlight_fr, data.content.title_highlight_en),
      subtitle: t(data.content.subtitle_fr, data.content.subtitle_en),
      ctaPrimary: t(data.content.cta_primary_fr, data.content.cta_primary_en),
      ctaSecondary: t(data.content.cta_secondary_fr, data.content.cta_secondary_en),
      stats: data.stats
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((s) => ({ value: s.value, label: t(s.label_fr, s.label_en) })),
    };
  } catch {
    return fallback;
  }
}

/* ============================================================
   Services — items
   ============================================================ */
type ApiService = {
  id: number;
  title_fr: string; title_en: string;
  description_fr: string; description_en: string;
  tags: string[];
  icon: string;
  order: number;
};

export type CmsServices = Dict["services"]["items"];

export async function getCmsServices(lang: Lang): Promise<CmsServices> {
  try {
    const data = await fetchList<ApiService>("/api/services/");
    if (!data.length) return getDictionary(lang).services.items;
    const t = pick(lang);
    return data.map((s) => ({
      title: t(s.title_fr, s.title_en),
      desc: t(s.description_fr, s.description_en),
      tags: s.tags ?? [],
    }));
  } catch {
    return getDictionary(lang).services.items;
  }
}

/* ============================================================
   Process — steps
   ============================================================ */
type ApiProcessStep = {
  id: number;
  title_fr: string; title_en: string;
  description_fr: string; description_en: string;
  order: number;
};

export type CmsProcessSteps = Dict["process"]["steps"];

export async function getCmsProcessSteps(lang: Lang): Promise<CmsProcessSteps> {
  try {
    const data = await fetchList<ApiProcessStep>("/api/process/");
    if (!data.length) return getDictionary(lang).process.steps;
    const t = pick(lang);
    return data.map((s) => ({
      title: t(s.title_fr, s.title_en),
      desc: t(s.description_fr, s.description_en),
    }));
  } catch {
    return getDictionary(lang).process.steps;
  }
}

/* ============================================================
   Values (used by "Why us")
   ============================================================ */
type ApiValue = {
  id: number;
  title_fr: string; title_en: string;
  description_fr: string; description_en: string;
  order: number;
};

export type CmsValues = Dict["why"]["items"];

export async function getCmsValues(lang: Lang): Promise<CmsValues> {
  try {
    const data = await fetchList<ApiValue>("/api/values/");
    if (!data.length) return getDictionary(lang).why.items;
    const t = pick(lang);
    return data.map((v) => ({
      title: t(v.title_fr, v.title_en),
      desc: t(v.description_fr, v.description_en),
    }));
  } catch {
    return getDictionary(lang).why.items;
  }
}

/* ============================================================
   Sectors
   ============================================================ */
type ApiSector = {
  id: number;
  name_fr: string;
  name_en: string;
  order: number;
};

export async function getCmsSectors(lang: Lang): Promise<string[]> {
  try {
    const data = await fetchList<ApiSector>("/api/sectors/");
    if (!data.length) return getDictionary(lang).sectors.items;
    const t = pick(lang);
    return data.map((s) => t(s.name_fr, s.name_en));
  } catch {
    return getDictionary(lang).sectors.items;
  }
}

/* ============================================================
   Testimonials
   ============================================================ */
type ApiTestimonial = {
  id: number;
  quote_fr: string; quote_en: string;
  name: string;
  role_fr: string; role_en: string;
  avatar: string | null;
  is_featured: boolean;
  order: number;
};

export type CmsTestimonials = Dict["testimonials"]["items"];

export async function getCmsTestimonials(lang: Lang): Promise<CmsTestimonials> {
  try {
    const data = await fetchList<ApiTestimonial>("/api/testimonials/");
    if (!data.length) return getDictionary(lang).testimonials.items;
    const t = pick(lang);
    // Featured d'abord (devient le grand témoignage).
    return data
      .slice()
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.order - b.order)
      .map((tt) => ({
        quote: t(tt.quote_fr, tt.quote_en),
        name: tt.name,
        role: t(tt.role_fr, tt.role_en),
      }));
  } catch {
    return getDictionary(lang).testimonials.items;
  }
}
