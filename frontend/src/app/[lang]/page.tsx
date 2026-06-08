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
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTA } from "@/components/sections/CTA";
import { Contact } from "@/components/sections/Contact";
import { Newsletter } from "@/components/sections/Newsletter";
import { isLocale } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import {
  getCmsHero,
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
  logo: `${SITE_URL}/Logo-HORUS-LAB.jpeg`,
  description:
    "Entreprise technologique africaine : développement web & mobile, ERP, logiciels sur-mesure et solutions d'intelligence artificielle.",
  email: "contact@horus-lab.com",
  areaServed: "Africa",
  sameAs: [
    "https://www.linkedin.com/company/horus-lab",
    "https://twitter.com/horuslab",
    "https://github.com/horus-lab",
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
  ] = await Promise.all([
    getCmsHero(lang),
    getCmsServices(lang),
    getCmsProcessSteps(lang),
    getCmsValues(lang),
    getCmsSectors(lang),
    getCmsTestimonials(lang),
    getCmsProjects(lang),
    getCmsPosts(lang).then((p) => p.slice(0, 3)),
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
        <BlogPreview posts={latestPosts} />
        <CTA />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
