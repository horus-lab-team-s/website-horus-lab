import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome : Next génère un serveur Node minimal, idéal pour Docker.
  output: "standalone",
  images: {
    // Autorise next/image à servir nos illustrations SVG locales (de confiance),
    // en les isolant via une CSP sandbox.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Hôtes externes autorisés pour les couvertures d'articles & visuels.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
