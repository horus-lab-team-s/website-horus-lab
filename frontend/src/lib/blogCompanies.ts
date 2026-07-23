/* Détecte les entreprises tech citées dans un article de blog (titre/extrait/tags)
   et renvoie leurs logos (miniatures) — plus parlant qu'un simple nom.
   Logos monochromes (simple-icons) dans /public/logo/companies. La détection est
   volontairement CASSE-SENSIBLE (tokens capitalisés) pour éviter les faux positifs
   (ex. la couleur « orange » ≠ l'opérateur « Orange »). */

type Company = { name: string; src: string; tokens: string[] };

const COMPANIES: Company[] = [
  { name: "Google", src: "/logo/companies/google.svg", tokens: ["Google"] },
  { name: "Gemini", src: "/logo/companies/googlegemini.svg", tokens: ["Gemini"] },
  { name: "NVIDIA", src: "/logo/companies/nvidia.svg", tokens: ["NVIDIA", "Nvidia"] },
  { name: "Meta", src: "/logo/companies/meta.svg", tokens: ["Meta", "Facebook"] },
  { name: "Apple", src: "/logo/companies/apple.svg", tokens: ["Apple"] },
  { name: "Anthropic", src: "/logo/companies/anthropic.svg", tokens: ["Anthropic", "Claude"] },
  { name: "Orange", src: "/logo/companies/orange.svg", tokens: ["Orange"] },
];

export type CompanyLogo = { name: string; src: string };

export function companyLogosFor(text: string): CompanyLogo[] {
  if (!text) return [];
  const out: CompanyLogo[] = [];
  for (const c of COMPANIES) {
    const re = new RegExp(`\\b(${c.tokens.join("|")})\\b`);
    if (re.test(text)) out.push({ name: c.name, src: c.src });
  }
  return out;
}
