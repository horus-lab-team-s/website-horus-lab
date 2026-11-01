import type { MetadataRoute } from "next";
import { IS_ZAYRA } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  if (IS_ZAYRA) {
    return {
      name: "Zayra Technologies, solutions numériques pour l'Afrique",
      short_name: "Zayra",
      description:
        "Zayra Drive, Zayra School, Zayra Agro et Zayra Nkap : des applications web et mobiles conçues, développées et exploitées par Horus Lab.",
      start_url: "/fr",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#002a72",
      lang: "fr",
      icons: [{ src: "/zayra/brand/zayra-icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
    };
  }
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
