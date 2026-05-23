/**
 * URL canonique du site, utilisée pour les métadonnées SEO, le sitemap et le
 * JSON-LD. Surchargée par `NEXT_PUBLIC_SITE_URL` (ex. domaine Vercel/prod) ;
 * repli sur le domaine de production par défaut.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://horus-lab.com"
).replace(/\/$/, "");
