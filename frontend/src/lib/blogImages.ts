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
const CODE_IMAGES = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=75", // code écran
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=75", // circuit
  "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=700&q=75", // laptop code
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=700&q=75", // code couleur
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=75", // code sombre
  "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=700&q=75", // terminal
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=700&q=75", // écrans dev
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=75", // clavier macro
  "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=700&q=75", // code bleu
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=75", // matrix
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
