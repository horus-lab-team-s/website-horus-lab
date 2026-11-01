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
import { Partners } from "@/components/sections/Partners";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTA } from "@/components/sections/CTA";
import { isLocale } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import { IS_ZAYRA } from "@/lib/brand";
import { CASE_STUDIES } from "@/lib/caseStudies";
import {
  getCmsHero,
  getCmsPartners,
  getCmsPosts,
  getCmsProcessSteps,
  getCmsProjects,
  getCmsSectors,
  getCmsServices,
  getCmsTestimonials,
  getCmsValues,
} from "@/lib/cms";

type Params = { lang: string };

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Horus-Lab",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-light-bg-full.png`,
  description:
    "Entreprise technologique africaine : applications web & mobile sur mesure, systèmes d'information, digitalisation d'entreprise et formation & audit IT.",
  email: "contact@horus-lab.com",
  areaServed: "Africa",
  // Profils officiels déclarés aux moteurs de recherche. X et GitHub retirés
  // le 2026-08-05 (ils ne sont plus référencés nulle part sur le site).
  sameAs: [
    "https://www.facebook.com/HorusLab",
    "https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
  ],
  parentOrganization: { "@type": "Organization", name: "Zayra Technologies", url: "https://zayra.technologies.horus-lab.com" },
};

/* Version Zayra : l'entreprise, son laboratoire et ses 4 solutions, déclarés
   à Google (fiche entreprise + liste des applications). */
const zayraSolutions = CASE_STUDIES.filter((c) => c.kind === "solution");
const zayraLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zayra Technologies",
    url: SITE_URL,
    logo: `${SITE_URL}/zayra/brand/zayra-logo.png`,
    description:
      "Entreprise technologique africaine basée à Douala : Zayra Drive, Zayra School, Zayra Agro et Zayra Nkap, des applications web et mobiles conçues et exploitées par son laboratoire Horus Lab.",
    email: "contact@horus-lab.com",
    telephone: "+237659902191",
    address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" },
    areaServed: "Africa",
    subOrganization: { "@type": "Organization", name: "Horus Lab", url: "https://horus-lab.com" },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Solutions Zayra Technologies",
    itemListElement: zayraSolutions.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: c.titles.fr,
        description: c.content.fr.tagline,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android",
        url: `${SITE_URL}/fr/portfolio/${c.slug}`,
        publisher: { "@type": "Organization", name: "Zayra Technologies" },
      },
    })),
  },
];

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
    projects,
    latestPosts,
    testimonials,
    partners,
  ] = await Promise.all([
    getCmsHero(lang),
    getCmsServices(lang),
    getCmsProcessSteps(lang),
    getCmsValues(lang),
    getCmsSectors(lang),
    getCmsProjects(lang),
    getCmsPosts(lang).then((p) => p.slice(0, 3)),
    getCmsTestimonials(lang),
    getCmsPartners(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(IS_ZAYRA ? zayraLd : organizationLd) }}
      />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero content={hero} />
        <Services items={services} />
        <Realisations projects={projects} />
        <Process steps={process} />
        <WhyUs items={values} />
        <Sectors items={sectors} />
        <Testimonials items={testimonials} />
        <Partners partners={partners} />
        <BlogPreview posts={latestPosts} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
