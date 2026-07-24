import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horus-Lab, solutions technologiques intelligentes",
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
        src: "/logo/logo-light-bg-full.png",
        sizes: "1254x1254",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
