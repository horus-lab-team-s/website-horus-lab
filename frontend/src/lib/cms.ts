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
import {
  getFormations as getStaticFormations,
  getCourse as getStaticCourse,
  getCourseSlugs as getStaticCourseSlugs,
  type Course,
  type CourseCategory,
} from "@/lib/courses";

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
  logo: string | null;
  screenshots: string[];
  icon: string;
  gradient: string;
  url: string;
  is_featured: boolean;
  order: number;
};

/**
 * Le backend pilote les textes/ordre/tags. Les visuels de marque (logo dans
 * /public, captures Unsplash) ne sont pas stockés côté API pour les projets
 * seedés : on les ré-associe par TITRE depuis le catalogue local. Un éditeur
 * peut néanmoins uploader un logo / renseigner des captures dans l'admin :
 * ces valeurs-là (absolues) sont alors prioritaires.
 */
function mapProject(
  p: ApiProject,
  lang: Lang,
  staticByTitle: Map<string, Project>,
): Project {
  const t = pick(lang);
  const title = t(p.title_fr, p.title_en);
  const local = staticByTitle.get(title);
  return {
    title,
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
    logo: p.logo ?? local?.logo,
    cover: p.cover ?? local?.cover,
    screenshots: p.screenshots?.length ? p.screenshots : local?.screenshots,
  };
}

export async function getCmsProjects(lang: Lang): Promise<Project[]> {
  // Piloté par l'admin (`/admin/` → Réalisations). Repli total sur le catalogue
  // local si l'API est vide/indisponible → la home et /portfolio restent intacts.
  const local = getStaticProjects(lang);
  try {
    const data = await fetchList<ApiProject>("/api/portfolio/");
    if (!data.length) return local;
    const byTitle = new Map(local.map((p) => [p.title, p]));
    return data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((p) => mapProject(p, lang, byTitle));
  } catch {
    return local;
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
   Équipe (membres affichés sur la page À propos)
   ============================================================ */
type ApiTeamMember = {
  id: number;
  name: string;
  role_fr: string; role_en: string;
  bio_fr: string; bio_en: string;
  photo: string | null;
  photo_path: string;
  linkedin_url: string;
  github_url: string;
  whatsapp_url: string;
  email: string;
  badge_fr: string; badge_en: string;
  gradient: string;
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
  whatsapp: string;
  email: string;
  badge: string;
  gradient: string;
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
        photo: m.photo || m.photo_path || null,
        linkedin: m.linkedin_url,
        github: m.github_url,
        whatsapp: m.whatsapp_url,
        email: m.email,
        badge: t(m.badge_fr, m.badge_en),
        gradient: m.gradient,
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
   Bannière « aperçu » Edlearning (site entier)
   ============================================================ */
type ApiFormationsPromo = {
  is_active: boolean;
  badge_fr: string; badge_en: string;
  title_fr: string; title_en: string;
  body_fr: string; body_en: string;
  store_label_fr: string; store_label_en: string;
  play_url: string;
  logo_path: string;
  teaser_badge_fr: string; teaser_badge_en: string;
  teaser_title_fr: string; teaser_title_en: string;
  teaser_body_fr: string; teaser_body_en: string;
  teaser_cta_fr: string; teaser_cta_en: string;
  start_date: string | null;
  end_date: string | null;
};

export type CmsPromo = {
  active: boolean;
  logoPath: string;
  playUrl: string;
  storeLabel: string;
  /** Variante affichée sur les pages Formations (aperçu Edlearning → Play Store). */
  preview: { badge: string; title: string; body: string };
  /** Variante affichée sur les autres pages (date de démarrage → /formations). */
  teaser: { badge: string; title: string; body: string; cta: string };
  /** Début de la formation (ISO `YYYY-MM-DD`) ou `null` → compte à rebours. */
  startDate: string | null;
  /** Fin calculée (début + durée) ou `null` → auto-expiration de la bannière. */
  endDate: string | null;
};

/**
 * Bannière Edlearning pilotée depuis l'admin (`/admin/` → Bannière Formations).
 * Renvoie `null` si l'API est indisponible → le composant retombe alors sur ses
 * textes intégrés (le site continue d'afficher la bannière). Un `active: false`
 * renvoyé par l'admin masque explicitement la bannière.
 */
export async function getCmsFormationsPromo(lang: Lang): Promise<CmsPromo | null> {
  try {
    const p = await fetchJson<ApiFormationsPromo>("/api/formations-promo/");
    const t = pick(lang);
    return {
      active: p.is_active,
      logoPath: p.logo_path,
      playUrl: p.play_url,
      storeLabel: t(p.store_label_fr, p.store_label_en),
      preview: {
        badge: t(p.badge_fr, p.badge_en),
        title: t(p.title_fr, p.title_en),
        body: t(p.body_fr, p.body_en),
      },
      teaser: {
        badge: t(p.teaser_badge_fr, p.teaser_badge_en),
        title: t(p.teaser_title_fr, p.teaser_title_en),
        body: t(p.teaser_body_fr, p.teaser_body_en),
        cta: t(p.teaser_cta_fr, p.teaser_cta_en),
      },
      startDate: p.start_date ?? null,
      endDate: p.end_date ?? null,
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
      // Piloté par l'admin ; repli sur le dictionnaire si le champ est vide.
      subtitle: t(data.content.subtitle_fr, data.content.subtitle_en) || fallback.subtitle,
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
  // Piloté par l'admin (`/admin/` → Services). La section home dérive l'icône,
  // le thème couleur et le slug de la page service à partir de l'ORDRE et du
  // TITRE ; gardez donc l'ordre 0→3 et les titres cohérents avec les 4 pages
  // service. Repli sur le dictionnaire local si l'API est vide ou indisponible.
  const fallback = getDictionary(lang).services.items;
  try {
    const data = await fetchList<ApiService>("/api/services/");
    if (!data.length) return fallback;
    const t = pick(lang);
    return data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        title: t(s.title_fr, s.title_en),
        desc: t(s.description_fr, s.description_en),
        tags: s.tags ?? [],
      }));
  } catch {
    return fallback;
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
  image_path: string;
  is_logo: boolean;
  is_featured: boolean;
  order: number;
};

export type CmsTestimonial = {
  quote: string; name: string; role: string;
  image: string; logo: boolean;
};

/**
 * Témoignages (avec photo/logo), pilotés par l'admin (`/admin/` → Témoignages).
 * Tri : « mis en avant » d'abord, puis par ordre. Renvoie [] si vide/indisponible
 * → le composant `Testimonials` retombe sur sa liste statique.
 */
export async function getCmsTestimonials(lang: Lang): Promise<CmsTestimonial[]> {
  try {
    const data = await fetchList<ApiTestimonial>("/api/testimonials/");
    const t = pick(lang);
    return data
      .slice()
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.order - b.order)
      .map((it) => ({
        quote: t(it.quote_fr, it.quote_en),
        name: it.name,
        role: t(it.role_fr, it.role_en),
        image: it.avatar || it.image_path || "",
        logo: it.is_logo,
      }));
  } catch {
    return [];
  }
}

/* ============================================================
   Partenaires (logos défilants)
   ============================================================ */
type ApiPartner = {
  id: number; name: string; logo: string | null; logo_path: string; url: string; order: number;
};
export type CmsPartner = { name: string; src: string; href: string };

/** Partenaires depuis l'admin. Vide si aucun → repli statique côté composant. */
export async function getCmsPartners(): Promise<CmsPartner[]> {
  try {
    const data = await fetchList<ApiPartner>("/api/partners/");
    return data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ name: p.name, src: p.logo || p.logo_path || "", href: p.url }))
      .filter((p) => p.src);
  } catch {
    return [];
  }
}

/* ============================================================
   Formations (page /formations — app Django `courses`)
   ============================================================ */
type ApiCourseCategory = {
  slug: string;
  name_fr: string; name_en: string;
  tagline_fr: string; tagline_en: string;
  icon_key: string;
  order: number;
};

// Liste = version légère (catalogue) ; le programme n'y est pas.
type ApiCourseListItem = {
  slug: string;
  category: string; // slug de la catégorie
  title_fr: string; title_en: string;
  subtitle_fr: string; subtitle_en: string;
  level_fr: string; level_en: string;
  duration_hours: number;
  lessons_count: number;
  price_fr: string; price_en: string;
  is_free: boolean;
  tags: string[];
  image: string;
  video_url_fr: string;
  video_url_en: string;
  instructor_name: string;
  instructor_role_fr: string; instructor_role_en: string;
  order: number;
};

type ApiCourseModule = {
  title_fr: string; title_en: string;
  lessons_fr: string[]; lessons_en: string[];
  order: number;
};

// Détail = liste + intro/objectifs/programme.
type ApiCourseDetail = ApiCourseListItem & {
  intro_fr: string; intro_en: string;
  learn_fr: string[]; learn_en: string[];
  curriculum: ApiCourseModule[];
};

export type CmsCatalog = { categories: CourseCategory[]; courses: Course[] };

const ICON_KEYS = ["code", "layers", "spark", "eye", "cog"] as const;
function toIconKey(value: string): CourseCategory["iconKey"] {
  return (ICON_KEYS as readonly string[]).includes(value)
    ? (value as CourseCategory["iconKey"])
    : "code";
}

function mapCourseCategory(c: ApiCourseCategory, lang: Lang): CourseCategory {
  const t = pick(lang);
  return {
    slug: c.slug,
    name: t(c.name_fr, c.name_en),
    tagline: t(c.tagline_fr, c.tagline_en),
    iconKey: toIconKey(c.icon_key),
  };
}

// Élément de catalogue : le programme (intro/learn/curriculum) n'est pas chargé
// en liste → valeurs neutres ; il l'est sur la page détail via getCmsCourse().
function mapCourseListItem(c: ApiCourseListItem, lang: Lang): Course {
  const t = pick(lang);
  return {
    slug: c.slug,
    category: c.category,
    title: t(c.title_fr, c.title_en),
    subtitle: t(c.subtitle_fr, c.subtitle_en),
    level: t(c.level_fr, c.level_en),
    durationHours: c.duration_hours,
    lessonsCount: c.lessons_count,
    price: t(c.price_fr, c.price_en),
    free: c.is_free,
    tags: c.tags ?? [],
    image: c.image,
    videoUrl: (lang === "fr" ? c.video_url_fr : c.video_url_en) || undefined,
    // Le catalogue ne met en avant AUCUN formateur nommé : on force l'entité
    // « Formateurs Horus-Lab », quelles que soient les valeurs encore en base
    // (le CMS peut contenir d'anciens noms tant qu'il n'est pas re-seedé).
    instructor: { name: "Formateurs Horus-Lab", role: "" },
    intro: "",
    learn: [],
    curriculum: [],
  };
}

function mapCourseDetail(c: ApiCourseDetail, lang: Lang): Course {
  const t = pick(lang);
  const isFr = lang === "fr";
  return {
    ...mapCourseListItem(c, lang),
    intro: t(c.intro_fr, c.intro_en),
    learn: (isFr ? c.learn_fr : c.learn_en) ?? [],
    curriculum: (c.curriculum ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((m) => ({
        title: t(m.title_fr, m.title_en),
        lessons: (isFr ? m.lessons_fr : m.lessons_en) ?? [],
      })),
  };
}

/**
 * Catalogue complet (domaines + cours légers) pour la page /formations.
 * Piloté par l'admin Django (`/admin/` → Formations). Repli TOTAL sur le
 * catalogue statique `lib/courses.ts` si l'API est vide ou indisponible.
 * NB : la liste des cours suit la pagination DRF (PAGE_SIZE=20) ; au-delà,
 * prévoir un paramètre de page — aujourd'hui 10 cours, une seule page.
 */
export async function getCmsFormations(lang: Lang): Promise<CmsCatalog> {
  const fallback = getStaticFormations(lang);
  try {
    const [cats, courses] = await Promise.all([
      fetchList<ApiCourseCategory>("/api/courses/categories/"),
      fetchList<ApiCourseListItem>("/api/courses/"),
    ]);
    if (!cats.length || !courses.length) return fallback;
    return {
      categories: cats
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((c) => mapCourseCategory(c, lang)),
      courses: courses
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((c) => mapCourseListItem(c, lang)),
    };
  } catch {
    return fallback;
  }
}

/** Cours unique (avec programme) : CMS si trouvé, sinon catalogue statique. */
export async function getCmsCourse(lang: Lang, slug: string): Promise<Course | undefined> {
  try {
    const c = await fetchJson<ApiCourseDetail>(`/api/courses/${slug}/`);
    return mapCourseDetail(c, lang);
  } catch {
    return getStaticCourse(lang, slug);
  }
}

/**
 * Slugs pour generateStaticParams : union des slugs CMS et statiques pour
 * qu'aucun lien ne tombe en 404. Repli total sur les slugs statiques si l'API
 * est indisponible.
 */
export async function getCmsCourseSlugs(): Promise<string[]> {
  const staticSlugs = getStaticCourseSlugs();
  try {
    const data = await fetchList<ApiCourseListItem>("/api/courses/");
    const slugs = new Set<string>(staticSlugs);
    for (const c of data) slugs.add(c.slug);
    return [...slugs];
  } catch {
    return staticSlugs;
  }
}
