import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horus-Lab — Solutions technologiques intelligentes",
    short_name: "Horus-Lab",
    description:
      "Entreprise technologique africaine : applications web & mobile sur mesure, systèmes d'information, digitalisation d'entreprise et formation & audit IT.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#f5f9ff",
    theme_color: "#1b4f9c",
    lang: "fr",
    icons: [
      {
        src: "/Logo-HORUS-LAB.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
