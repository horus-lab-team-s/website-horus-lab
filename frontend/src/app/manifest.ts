import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horus-Lab — Solutions technologiques intelligentes",
    short_name: "Horus-Lab",
    description:
      "Entreprise technologique africaine : développement web & mobile, ERP, logiciels sur-mesure et solutions d'intelligence artificielle.",
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
