"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight } from "@/components/icons";

/* Référence phare « transition numérique » : Broad Range Consulting Group,
   dont chaque métier a été digitalisé (cabinet comptable agréé, coopérative
   d'épargne et de crédit, centre de formation, image de la dirigeante).
   Chaque volet renvoie vers son étude de cas. */
type Item = { logo?: string; slug?: string; trade: string; name: string; text: string; status: string };

const COPY: Record<"fr" | "en", {
  eyebrow: string; title: string; intro: string; cta: string; caseLink: string;
  quote: string; role: string; items: Item[];
}> = {
  fr: {
    eyebrow: "Référence · Transition numérique",
    title: "Broad Range Consulting Group : un groupe accompagné sur tous ses métiers",
    intro: "Cabinet comptable agréé, coopérative d'épargne et de crédit, centre de formation : une même équipe a conçu, développé et mis en ligne les outils de chaque activité du groupe.",
    cta: "Parlons de la transition numérique de votre organisation",
    caseLink: "Voir l'étude de cas",
    quote: "Nos outils de gestion sont enfin à la hauteur de nos ambitions. Une équipe sérieuse, disponible, et un accompagnement impeccable à chaque étape.",
    role: "Présidente-Directrice Générale · Broad Range Consulting Group",
    items: [
      { logo: "/logo/logo-cga-brcg.png", slug: "cga-brcg", trade: "Comptabilité & fiscalité", name: "CGA BRCG", text: "Contrôle des pièces dès leur réception, SYSCOHADA, TVA et application mobile pour les adhérents.", status: "En cours de déploiement" },
      { logo: "/logo/logo-GATHE_FINANCE.png", slug: "gathe-finance", trade: "Épargne & crédit", name: "Gathe Finance", text: "Épargne, collectes, crédit et remboursements depuis le téléphone des membres.", status: "En production" },
      { logo: "/logo/logo-Edlearning.png", slug: "elearning", trade: "Formation", name: "CFP Broad Range Consulting", text: "La plateforme e-learning du centre de formation professionnelle.", status: "En production" },
      { trade: "Image de la dirigeante", name: "Site de Paule Diane Himsta", text: "Site personnel avec prise de rendez-vous et back-office de gestion.", status: "Bientôt en ligne" },
    ],
  },
  en: {
    eyebrow: "Reference · Digital transformation",
    title: "Broad Range Consulting Group: a group supported across all its businesses",
    intro: "Approved accounting firm, savings and credit cooperative, training centre: one team designed, built and launched the tools for each of the group's businesses.",
    cta: "Let's talk about your organisation's digital transformation",
    caseLink: "See the case study",
    quote: "Our management tools finally match our ambitions. A dedicated, responsive team, with flawless support at every step.",
    role: "Managing Director · Broad Range Consulting Group",
    items: [
      { logo: "/logo/logo-cga-brcg.png", slug: "cga-brcg", trade: "Accounting & tax", name: "CGA BRCG", text: "Documents checked on arrival, SYSCOHADA, VAT and a mobile app for members.", status: "Being rolled out" },
      { logo: "/logo/logo-GATHE_FINANCE.png", slug: "gathe-finance", trade: "Savings & credit", name: "Gathe Finance", text: "Savings, collections, credit and repayments from members' phones.", status: "In production" },
      { logo: "/logo/logo-Edlearning.png", slug: "elearning", trade: "Training", name: "CFP Broad Range Consulting", text: "The vocational training centre's e-learning platform.", status: "In production" },
      { trade: "Leader's image", name: "Paule Diane Himsta's website", text: "Personal website with appointment booking and a management back-office.", status: "Coming soon" },
    ],
  },
};

export function BrcgShowcase() {
  const { lang, localePath } = useLang();
  const t = COPY[lang];

  return (
    <section className="relative overflow-hidden bg-surface py-14 sm:py-16 dark:bg-[#070e1c]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">{t.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-900 dark:text-white sm:text-3xl">{t.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{t.intro}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it, i) => {
            const body = (
              <article className="group flex h-full flex-col bg-white p-6 shadow-sm ring-1 ring-brand-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-white/10">
                <div className="flex h-14 items-center">
                  {it.logo ? (
                    <span className="relative h-12 w-28">
                      <Image src={it.logo} alt={`Logo ${it.name}`} fill sizes="112px" className="object-contain object-left" />
                    </span>
                  ) : (
                    <span className="grid size-12 place-items-center bg-brand-50 text-sm font-extrabold text-brand-700 dark:bg-white/10 dark:text-brand-200">PDH</span>
                  )}
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">{it.trade}</p>
                <h3 className="mt-1 text-lg font-extrabold tracking-tight text-brand-900 dark:text-white">{it.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{it.text}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-100 pt-3 text-xs dark:border-white/10">
                  <span className="font-semibold text-ink/70 dark:text-brand-100/70">{it.status}</span>
                  {it.slug && (
                    <span className="inline-flex items-center gap-1 font-bold text-brand-700 dark:text-brand-200">
                      {t.caseLink}
                      <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </article>
            );
            return (
              <Reveal key={it.name} delay={i * 80}>
                {it.slug ? <Link href={localePath(`/portfolio/${it.slug}`)} className="block h-full">{body}</Link> : body}
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <figure className="flex flex-col items-center gap-5 bg-white p-7 text-center shadow-sm ring-1 ring-brand-100 sm:flex-row sm:text-left dark:bg-slate-900 dark:ring-white/10">
            <span className="round-portrait relative size-20 shrink-0 overflow-hidden">
              <Image src="/Temoignages/Mme-paul-diane-himsta.png" alt="Paule Diane Himsta" fill sizes="80px" className="object-cover object-top" />
            </span>
            <div>
              <blockquote className="text-base leading-relaxed text-ink/85 dark:text-brand-100/85">{lang === "fr" ? `« ${t.quote} »` : `“${t.quote}”`}</blockquote>
              <figcaption className="mt-3 text-sm">
                <span className="font-bold text-brand-900 dark:text-white">Paule Diane Himsta</span>
                <span className="text-muted"> · {t.role}</span>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <Link href={localePath("/contact")}
            className="btn-cta group inline-flex items-center gap-2 bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand-800">
            {t.cta}
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
