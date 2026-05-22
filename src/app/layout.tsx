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
    <html lang="fr" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
