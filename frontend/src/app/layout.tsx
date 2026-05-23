import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Horus-Lab",
    template: "%s — Horus-Lab",
  },
  icons: { icon: "/Logo-HORUS-LAB.jpeg" },
};

export const viewport: Viewport = {
  themeColor: "#1b4f9c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // L'attribut lang est ajusté par langue côté client (LanguageProvider).
  return (
    <html lang="fr" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Applique le thème avant le 1er paint → pas de flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Aller au contenu / Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
