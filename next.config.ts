import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise next/image à servir nos illustrations SVG locales (de confiance),
    // en les isolant via une CSP sandbox.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
