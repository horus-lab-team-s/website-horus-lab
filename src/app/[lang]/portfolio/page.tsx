import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PortfolioGrid, type Project } from "@/components/portfolio/PortfolioGrid";
import { IconArrowRight } from "@/components/icons";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

type Content = {
  eyebrow: string;
  title: string;
  subtitle: string;
  allLabel: string;
  resultLabel: string;
  note: string;
  projects: Project[];
  ctaTitle: string;
  ctaButton: string;
};

const GRADIENTS = [
  "from-brand-700 via-brand-500 to-sky",
  "from-brand-800 via-brand-600 to-brand-400",
  "from-brand-600 via-sky to-brand-300",
  "from-brand-900 via-brand-700 to-brand-500",
  "from-brand-500 via-sky to-brand-200",
  "from-brand-700 to-brand-900",
];

const CONTENT: Record<Lang, Content> = {
  fr: {
    eyebrow: "Réalisations",
    title: "Des projets qui créent de la valeur",
    subtitle:
      "Un aperçu de ce que nous construisons avec nos clients, du concept à la mise en production.",
    allLabel: "Tous",
    resultLabel: "résultat",
    note: "Exemples représentatifs de nos savoir-faire.",
    ctaTitle: "Votre projet sera le prochain ?",
    ctaButton: "Discutons-en",
    projects: [
      { title: "Plateforme de paiement mobile", category: "Fintech", desc: "Application de transferts et paiements mobile money, sécurisée et temps réel, pensée pour le marché africain.", tags: ["Mobile", "API", "Sécurité"], result: "+40% de transactions", iconKey: "globe", gradient: GRADIENTS[0] },
      { title: "ERP agricole intégré", category: "AgriTech", desc: "Gestion des stocks, des coopératives et de la traçabilité, du champ jusqu'à la vente.", tags: ["ERP", "Cloud", "Data"], result: "−30% de pertes", iconKey: "layers", gradient: GRADIENTS[1] },
      { title: "Téléconsultation médicale", category: "Santé", desc: "Application de prise de rendez-vous et de consultation à distance, avec dossier patient.", tags: ["Mobile", "Web", "IA"], result: "10k+ patients", iconKey: "spark", gradient: GRADIENTS[2] },
      { title: "Marketplace e-commerce", category: "Commerce", desc: "Place de marché multi-vendeurs avec paiements intégrés et logistique de livraison.", tags: ["Next.js", "Paiement"], result: "x3 ventes", iconKey: "code", gradient: GRADIENTS[3] },
      { title: "Plateforme e-learning", category: "Éducation", desc: "Cours en ligne, suivi de progression et certifications, optimisée pour faible bande passante.", tags: ["PWA", "Vidéo"], result: "25k apprenants", iconKey: "eye", gradient: GRADIENTS[4] },
      { title: "Suivi logistique temps réel", category: "Logistique", desc: "Tableau de bord de géolocalisation et d'optimisation des tournées de livraison.", tags: ["IoT", "Cartographie"], result: "−20% de délais", iconKey: "cog", gradient: GRADIENTS[5] },
    ],
  },
  en: {
    eyebrow: "Work",
    title: "Projects that create value",
    subtitle:
      "A glimpse of what we build with our clients, from concept to production.",
    allLabel: "All",
    resultLabel: "outcome",
    note: "Representative examples of our expertise.",
    ctaTitle: "Will your project be next?",
    ctaButton: "Let's talk",
    projects: [
      { title: "Mobile payment platform", category: "Fintech", desc: "Secure, real-time mobile-money transfer and payment app, built for the African market.", tags: ["Mobile", "API", "Security"], result: "+40% transactions", iconKey: "globe", gradient: GRADIENTS[0] },
      { title: "Integrated agri ERP", category: "AgriTech", desc: "Inventory, cooperative and traceability management, from field to sale.", tags: ["ERP", "Cloud", "Data"], result: "−30% losses", iconKey: "layers", gradient: GRADIENTS[1] },
      { title: "Medical teleconsultation", category: "Health", desc: "Appointment booking and remote consultation app, with patient records.", tags: ["Mobile", "Web", "AI"], result: "10k+ patients", iconKey: "spark", gradient: GRADIENTS[2] },
      { title: "E-commerce marketplace", category: "Commerce", desc: "Multi-vendor marketplace with integrated payments and delivery logistics.", tags: ["Next.js", "Payments"], result: "3x sales", iconKey: "code", gradient: GRADIENTS[3] },
      { title: "E-learning platform", category: "Education", desc: "Online courses, progress tracking and certifications, optimized for low bandwidth.", tags: ["PWA", "Video"], result: "25k learners", iconKey: "eye", gradient: GRADIENTS[4] },
      { title: "Real-time logistics tracking", category: "Logistics", desc: "Geolocation dashboard and delivery-route optimization.", tags: ["IoT", "Mapping"], result: "−20% delays", iconKey: "cog", gradient: GRADIENTS[5] },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = CONTENT[lang];
  return {
    title: c.eyebrow,
    description: c.subtitle,
    alternates: {
      canonical: `/${lang}/portfolio`,
      languages: { fr: "/fr/portfolio", en: "/en/portfolio" },
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = CONTENT[lang];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface pt-32 pb-12 dark:from-slate-950 dark:to-[#070e1c] sm:pt-40">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">
                {c.eyebrow}
              </span>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">{c.subtitle}</p>
              <p className="mt-2 text-sm text-muted/80">{c.note}</p>
            </Reveal>
          </div>
        </section>

        <section className="bg-surface pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <PortfolioGrid
              projects={c.projects}
              allLabel={c.allLabel}
              resultLabel={c.resultLabel}
            />
          </div>
        </section>

        <section className="bg-surface px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-7 py-14 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
              <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
                {c.ctaTitle}
              </h2>
              <div className="relative mt-8 flex justify-center">
                <Link
                  href={`/${lang}#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03]"
                >
                  {c.ctaButton}
                  <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
