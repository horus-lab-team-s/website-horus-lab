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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
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
