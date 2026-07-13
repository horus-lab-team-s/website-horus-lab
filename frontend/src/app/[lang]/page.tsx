import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Sectors } from "@/components/sections/Sectors";
import { Testimonials } from "@/components/sections/Testimonials";
import { Achievements } from "@/components/sections/Achievements";
import { Stack } from "@/components/sections/Stack";
import { News } from "@/components/sections/News";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTA } from "@/components/sections/CTA";
import { Contact } from "@/components/sections/Contact";
import { Newsletter } from "@/components/sections/Newsletter";
import { isLocale, type Lang } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import {
  getCmsAchievements,
  getCmsHero,
  getCmsNews,
  getCmsPosts,
  getCmsProcessSteps,
  getCmsProjects,
  getCmsSectors,
  getCmsServices,
  getCmsStack,
  getCmsTestimonials,
  getCmsValues,
  type CmsAchievement,
} from "@/lib/cms";

/* Replis (repli si l'API CMS est vide/indisponible) */
const ACHIEVEMENTS_FALLBACK: Record<Lang, CmsAchievement[]> = {
  fr: [
    { value: "8+", label: "projets livrés" },
    { value: "4", label: "pays couverts" },
    { value: "11", label: "filiales déployées" },
    { value: "24/7", label: "accompagnement" },
  ],
  en: [
    { value: "8+", label: "projects delivered" },
    { value: "4", label: "countries covered" },
    { value: "11", label: "subsidiaries deployed" },
    { value: "24/7", label: "support" },
  ],
};

const STACK_FALLBACK = [
  "React", "Next.js", "TypeScript", "Flutter", "Python", "Django",
  "PostgreSQL", "Docker", "REST API", "Tailwind CSS", "Node.js", "Cybersécurité",
];

type Params = { lang: string };

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Horus-Lab",
  url: SITE_URL,
  logo: `${SITE_URL}/Logo-HORUS-LAB.jpeg`,
  description:
    "Entreprise technologique africaine : applications web & mobile sur mesure, systèmes d'information, digitalisation d'entreprise et formation & audit IT.",
  email: "contact@horus-lab.com",
  areaServed: "Africa",
  sameAs: [
    "https://x.com/horuslabafrik",
    "https://www.facebook.com/HorusLab",
    "https://github.com/horus-lab-team-s",
  ],
};

export default async function Home({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // Fetch parallèle de TOUT le contenu CMS (chaque appel a son propre
  // fallback statique, donc même si l'API tombe le site reste intact).
  const [
    hero,
    services,
    process,
    values,
    sectors,
    testimonials,
    projects,
    latestPosts,
    achievements,
    stack,
    news,
  ] = await Promise.all([
    getCmsHero(lang),
    getCmsServices(lang),
    getCmsProcessSteps(lang),
    getCmsValues(lang),
    getCmsSectors(lang),
    getCmsTestimonials(lang),
    getCmsProjects(lang),
    getCmsPosts(lang).then((p) => p.slice(0, 3)),
    getCmsAchievements(lang, ACHIEVEMENTS_FALLBACK[lang]),
    getCmsStack(STACK_FALLBACK),
    getCmsNews(lang),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero content={hero} />
        <Services items={services} />
        <Realisations projects={projects} />
        <Achievements items={achievements} />
        <Process steps={process} />
        <WhyUs items={values} />
        <Stack items={stack} />
        <Sectors items={sectors} />
        <Testimonials items={testimonials} />
        <News items={news} />
        <BlogPreview posts={latestPosts} />
        <CTA />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
