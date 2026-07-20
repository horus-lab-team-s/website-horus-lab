import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { isLocale, locales, type Lang } from "@/i18n/dictionaries";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): { lang: Lang }[] {
  return locales.map((lang) => ({ lang }));
}

type Section = { h: string; body: string[] };
type Content = { title: string; updated: string; note: string; sections: Section[] };

const CONTENT: Record<Lang, Content> = {
  fr: {
    title: "Mentions légales & Politique de confidentialité",
    updated: "Dernière mise à jour : 23 mai 2026",
    note: "Modèle à faire valider par un conseil juridique avant publication. Les champs entre crochets [ ] sont à compléter.",
    sections: [
      {
        h: "Éditeur du site",
        body: [
          "Le site horus-lab.com est édité par Horus-Lab, entreprise technologique africaine.",
          "Forme juridique : [à compléter]. Immatriculation (RCCM / NIU) : [à compléter].",
          "Siège : Douala, Cameroun.",
          "E-mail : contact@horus-lab.com · Téléphone : +237 673398046 / +237 699173771.",
          "Directeur de la publication : [à compléter].",
        ],
      },
      {
        h: "Hébergement",
        body: [
          "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).",
        ],
      },
      {
        h: "Propriété intellectuelle",
        body: [
          "L'ensemble des contenus du site (textes, logo, illustrations, code) est la propriété de Horus-Lab, sauf mention contraire. Toute reproduction sans autorisation est interdite.",
        ],
      },
      {
        h: "Données personnelles collectées",
        body: [
          "Formulaire de contact : nom, adresse e-mail et message.",
          "Inscription à la newsletter : adresse e-mail.",
          "Aucune donnée n'est revendue à des tiers.",
        ],
      },
      {
        h: "Finalités et base légale",
        body: [
          "Les données servent à répondre à vos demandes et, si vous y consentez, à vous envoyer notre newsletter.",
          "La base légale du traitement est votre consentement, retirable à tout moment.",
        ],
      },
      {
        h: "Sous-traitants",
        body: [
          "Brevo (Sendinblue), envoi d'e-mails et gestion des contacts : brevo.com.",
          "Vercel : hébergement du site.",
        ],
      },
      {
        h: "Durée de conservation",
        body: [
          "Les messages de contact sont conservés le temps nécessaire au traitement de votre demande. Les inscriptions newsletter sont conservées jusqu'à votre désinscription.",
        ],
      },
      {
        h: "Vos droits",
        body: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité de vos données.",
          "Pour exercer ces droits, écrivez à contact@horus-lab.com.",
        ],
      },
      {
        h: "Cookies et stockage local",
        body: [
          "Le site n'utilise pas de cookies de suivi publicitaire.",
          "Seul le stockage local de votre navigateur (localStorage) conserve vos préférences de langue et de thème (clair/sombre).",
        ],
      },
      {
        h: "Contact",
        body: ["Pour toute question relative à ces mentions : contact@horus-lab.com."],
      },
    ],
  },
  en: {
    title: "Legal notice & Privacy policy",
    updated: "Last updated: 23 May 2026",
    note: "Template to be reviewed by legal counsel before publishing. Fields in brackets [ ] must be completed.",
    sections: [
      {
        h: "Site publisher",
        body: [
          "The website horus-lab.com is published by Horus-Lab, an African technology company.",
          "Legal form: [to be completed]. Registration (RCCM / NIU): [to be completed].",
          "Head office: Douala, Cameroon.",
          "Email: contact@horus-lab.com · Phone: +237 673398046 / +237 699173771.",
          "Publication director: [to be completed].",
        ],
      },
      {
        h: "Hosting",
        body: [
          "The website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com).",
        ],
      },
      {
        h: "Intellectual property",
        body: [
          "All site content (text, logo, illustrations, code) is the property of Horus-Lab unless otherwise stated. Reproduction without permission is prohibited.",
        ],
      },
      {
        h: "Personal data collected",
        body: [
          "Contact form: name, email address and message.",
          "Newsletter sign-up: email address.",
          "No data is sold to third parties.",
        ],
      },
      {
        h: "Purpose and legal basis",
        body: [
          "Data is used to respond to your requests and, with your consent, to send you our newsletter.",
          "The legal basis is your consent, which can be withdrawn at any time.",
        ],
      },
      {
        h: "Processors",
        body: [
          "Brevo (Sendinblue), email delivery and contact management: brevo.com.",
          "Vercel: website hosting.",
        ],
      },
      {
        h: "Data retention",
        body: [
          "Contact messages are kept for as long as needed to handle your request. Newsletter sign-ups are kept until you unsubscribe.",
        ],
      },
      {
        h: "Your rights",
        body: [
          "You have the right to access, rectify, erase, object to and port your data.",
          "To exercise these rights, email contact@horus-lab.com.",
        ],
      },
      {
        h: "Cookies and local storage",
        body: [
          "The site does not use advertising tracking cookies.",
          "Only your browser's local storage keeps your language and theme (light/dark) preferences.",
        ],
      },
      {
        h: "Contact",
        body: ["For any question about this notice: contact@horus-lab.com."],
      },
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
    title: c.title,
    alternates: {
      canonical: `/${lang}/legal`,
      languages: { fr: "/fr/legal", en: "/en/legal" },
    },
    robots: { index: false },
  };
}

export default async function LegalPage({
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
      <main
        id="main"
        tabIndex={-1}
        className="bg-gradient-to-b from-brand-50 to-surface pt-32 pb-20 dark:from-slate-950 dark:to-[#070e1c] sm:pt-40"
      >
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-3 text-sm text-muted">{c.updated}</p>

          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {c.note}
          </p>

          <div className="mt-10 space-y-10">
            {c.sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-xl font-bold text-brand-900 dark:text-white">
                  {section.h}
                </h2>
                <div className="mt-3 space-y-2 leading-relaxed text-ink/80 dark:text-brand-100/80">
                  {section.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
