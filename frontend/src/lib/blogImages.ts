import type { PostMeta } from "@/lib/blog";

/**
 * Visuels de couverture pour les cartes du blog.
 *
 * Deux objectifs :
 *  1. VARIÉTÉ — deux articles ne doivent pas afficher la même image de code.
 *     On pioche dans un pool d'illustrations « dev / tech » de façon
 *     déterministe à partir du slug (stable entre SSR et client).
 *  2. ROBUSTESSE — on n'utilise `post.cover` que s'il s'agit d'une URL absolue
 *     (http/https). Les anciens chemins locaux du type `/blog/cover-x.jpg` ne
 *     pointent vers aucun fichier réel → image cassée ; on retombe alors sur le
 *     pool ci-dessous.
 */
// IMPORTANT : uniquement des visuels Unsplash déjà utilisés ailleurs sur le
// site (hero, services, catégories) — donc garantis valides. Évite les 404 qui
// faisaient « disparaître » certaines images de cartes.
const CODE_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=75", // circuit board
  "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=700&q=75", // laptop + code
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=75", // code à l'écran
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=75", // dev au clavier
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=75", // serveurs / data
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=75", // dashboard
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=75", // équipe / desk
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=75", // transformation digitale
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=700&q=75", // tech
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=700&q=75", // workspace
];

/** Hash déterministe simple (djb2) → même image pour un slug donné. */
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h);
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Image de couverture d'un article : cover distant si valide, sinon pool varié. */
export function coverFor(post: Pick<PostMeta, "slug" | "cover">): string {
  if (post.cover && isHttpUrl(post.cover)) return post.cover;
  return CODE_IMAGES[hash(post.slug) % CODE_IMAGES.length];
}
