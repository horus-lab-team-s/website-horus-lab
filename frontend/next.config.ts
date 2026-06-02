import type { NextConfig } from "next";

// Hôte du backend Django (médias uploadés : couvertures d'articles, logos…).
// Dérivé de BACKEND_API_URL pour autoriser next/image en dev comme en prod.
const backendUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const backendHost = (() => {
  try {
    const u = new URL(backendUrl);
    return { protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname, port: u.port };
  } catch {
    return null;
  }
})();

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
      ...(backendHost
        ? [
            {
              protocol: backendHost.protocol,
              hostname: backendHost.hostname,
              port: backendHost.port || undefined,
              pathname: "/media/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
