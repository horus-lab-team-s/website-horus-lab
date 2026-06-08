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
import { marked } from "marked";
import type { Dict, Lang } from "@/i18n/dictionaries";
import { getDictionary, locales } from "@/i18n/dictionaries";
import {
  getProjects as getStaticProjects,
  type Project,
} from "@/lib/projects";
import { getNews as getStaticNews, type NewsItem } from "@/lib/news";
import {
  getAllPosts as getStaticPosts,
  getPost as getStaticPost,
  getAllPostParams as getStaticPostParams,
  type PostMeta,
  type Post,
} from "@/lib/blog";

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
  // On utilise TOUJOURS les projets locaux — seuls Afrikamode, Gathe Finance,
  // e-Learning et Formation appartiennent à Horus-Lab.
  return getStaticProjects(lang);
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
   Équipe (membres affichés sur la page À propos)
   ============================================================ */
type ApiTeamMember = {
  id: number;
  name: string;
  role_fr: string; role_en: string;
  bio_fr: string; bio_en: string;
  photo: string | null;
  linkedin_url: string;
  github_url: string;
  email: string;
  is_lead: boolean;
  order: number;
};

export type CmsTeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedin: string;
  github: string;
  email: string;
  isLead: boolean;
};

/** Membres de l'équipe depuis l'admin. Tableau vide si aucun / API indisponible. */
export async function getCmsTeam(lang: Lang): Promise<CmsTeamMember[]> {
  try {
    const data = await fetchList<ApiTeamMember>("/api/team/");
    const t = pick(lang);
    return data
      .slice()
      .sort((a, b) => Number(b.is_lead) - Number(a.is_lead) || a.order - b.order)
      .map((m) => ({
        name: m.name,
        role: t(m.role_fr, m.role_en),
        bio: t(m.bio_fr, m.bio_en),
        photo: m.photo,
        linkedin: m.linkedin_url,
        github: m.github_url,
        email: m.email,
        isLead: m.is_lead,
      }));
  } catch {
    return [];
  }
}

/* ============================================================
   Réglages du site (coordonnées + réseaux sociaux)
   ============================================================ */
type ApiSiteSettings = {
  tagline_fr: string; tagline_en: string;
  about_fr: string; about_en: string;
  email: string;
  phone_primary: string; phone_secondary: string;
  location_fr: string; location_en: string;
  linkedin_url: string; x_url: string; facebook_url: string;
  github_url: string; whatsapp_url: string; telegram_url: string;
};

export type CmsSiteSettings = {
  email: string;
  phones: string[];
  location: string;
  about: string;
  tagline: string;
  socials: {
    linkedin: string;
    x: string;
    facebook: string;
    github: string;
    whatsapp: string;
    telegram: string;
  };
};

/**
 * Réglages du site depuis l'admin. Renvoie `null` si l'API est indisponible —
 * le Footer retombe alors sur les valeurs du dictionnaire.
 */
export async function getCmsSiteSettings(lang: Lang): Promise<CmsSiteSettings | null> {
  try {
    const s = await fetchJson<ApiSiteSettings>("/api/site/");
    const t = pick(lang);
    return {
      email: s.email,
      phones: [s.phone_primary, s.phone_secondary].filter(Boolean),
      location: t(s.location_fr, s.location_en),
      about: t(s.about_fr, s.about_en),
      tagline: t(s.tagline_fr, s.tagline_en),
      socials: {
        linkedin: s.linkedin_url,
        x: s.x_url,
        facebook: s.facebook_url,
        github: s.github_url,
        whatsapp: s.whatsapp_url,
        telegram: s.telegram_url,
      },
    };
  } catch {
    return null;
  }
}

/* ============================================================
   Blog — articles (CMS Django, repli sur les fichiers Markdown)
   ============================================================ */
type ApiCategory = { fr: string; en: string } | null;

type ApiPostList = {
  slug: string;
  title_fr: string; title_en: string;
  excerpt_fr: string; excerpt_en: string;
  cover: string | null;
  author: string;
  category: ApiCategory;
  tags: string[];
  published_at: string;
  reading_minutes: number;
};

type ApiPostDetail = ApiPostList & { body_fr: string; body_en: string };

function mapPostMeta(p: ApiPostList, lang: Lang): PostMeta {
  const t = pick(lang);
  return {
    slug: p.slug,
    lang,
    title: t(p.title_fr, p.title_en),
    date: p.published_at,
    excerpt: t(p.excerpt_fr, p.excerpt_en),
    author: p.author,
    tags: p.tags ?? [],
    category: p.category ? t(p.category.fr, p.category.en) : "",
    cover: p.cover ?? "",
    readingMinutes: p.reading_minutes,
  };
}

/** Liste des articles : CMS si disponible, sinon fichiers Markdown locaux. */
export async function getCmsPosts(lang: Lang): Promise<PostMeta[]> {
  try {
    const data = await fetchList<ApiPostList>("/api/blog/posts/");
    if (!data.length) return getStaticPosts(lang);
    return data
      .map((p) => mapPostMeta(p, lang))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return getStaticPosts(lang);
  }
}

/** Article unique : CMS si trouvé, sinon fichier Markdown local. */
export async function getCmsPost(slug: string, lang: Lang): Promise<Post | null> {
  try {
    const p = await fetchJson<ApiPostDetail>(`/api/blog/posts/${slug}/`);
    const t = pick(lang);
    // Le corps est stocké en Markdown côté admin (le fallback _en bascule sur _fr).
    const body = t(p.body_fr, p.body_en) || p.body_fr;
    return {
      ...mapPostMeta(p, lang),
      html: marked.parse(body, { async: false }),
    };
  } catch {
    return getStaticPost(slug, lang);
  }
}

/**
 * Paramètres statiques (lang × slug) pour generateStaticParams.
 * Union des slugs CMS et locaux pour qu'aucun lien ne soit en 404 ;
 * repli total sur les fichiers si l'API est indisponible.
 */
export async function getCmsPostParams(): Promise<{ lang: Lang; slug: string }[]> {
  const staticParams = getStaticPostParams();
  try {
    const data = await fetchList<ApiPostList>("/api/blog/posts/");
    const slugs = new Set<string>(data.map((p) => p.slug));
    for (const { slug } of staticParams) slugs.add(slug);
    return locales.flatMap((lang) =>
      [...slugs].map((slug) => ({ lang, slug })),
    );
  } catch {
    return staticParams;
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
  // On utilise TOUJOURS le dictionnaire local — les services sont fixes et définis dans le code.
  // Le backend peut avoir d'anciens services (ERP, etc.) qui ne correspondent pas à la réalité.
  return getDictionary(lang).services.items;
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
   Achievements (chiffres clés — page Réalisations)
   ============================================================ */
type ApiAchievement = {
  id: number;
  value: string;
  label_fr: string;
  label_en: string;
  order: number;
};

export type CmsAchievement = { value: string; label: string };

export async function getCmsAchievements(
  lang: Lang,
  fallback: CmsAchievement[],
): Promise<CmsAchievement[]> {
  try {
    const data = await fetchList<ApiAchievement>("/api/achievements/");
    if (!data.length) return fallback;
    const t = pick(lang);
    return data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((a) => ({ value: a.value, label: t(a.label_fr, a.label_en) }));
  } catch {
    return fallback;
  }
}

/* ============================================================
   Tech stack (bandeau « stack maîtrisée »)
   ============================================================ */
type ApiStackItem = { id: number; name: string; order: number };

export async function getCmsStack(fallback: string[]): Promise<string[]> {
  try {
    const data = await fetchList<ApiStackItem>("/api/stack/");
    if (!data.length) return fallback;
    return data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => s.name);
  } catch {
    return fallback;
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
