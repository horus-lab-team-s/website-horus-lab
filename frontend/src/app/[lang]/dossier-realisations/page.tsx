import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Lang } from "@/i18n/dictionaries";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { SITE_URL } from "@/lib/site";

/**
 * Dossier des réalisations, mis en page en A4 pour l'impression.
 * Le PDF téléchargeable (public/docs/dossier-realisations-<lang>.pdf) est
 * généré à partir de cette page : voir deploy/DOSSIER-REALISATIONS.md.
 */
type Params = { lang: string };

export const metadata: Metadata = { robots: { index: false, follow: false } };

const L = {
  fr: {
    title: "Dossier des réalisations",
    subtitle: "Nos solutions et les projets livrés à nos clients, du concept au déploiement.",
    summary: "Sommaire",
    solutions: "Solutions Zayra",
    clients: "Projets clients",
    client: "Client",
    sector: "Secteur",
    need: "Le besoin",
    answer: "Notre réponse",
    services: "Services livrés",
    features: "Fonctionnalités clés",
    results: "Résultats",
    stack: "Technologies",
    links: "Liens",
    caseStudy: "Étude de cas en ligne",
    contactTitle: "Parlons de votre projet",
    contactText: "Horus Lab, le laboratoire de Zayra Technologies, conçoit, développe, héberge et maintient vos applications web et mobiles.",
  },
  en: {
    title: "Portfolio dossier",
    subtitle: "Our solutions and the projects delivered to our clients, from concept to deployment.",
    summary: "Contents",
    solutions: "Zayra solutions",
    clients: "Client projects",
    client: "Client",
    sector: "Sector",
    need: "The need",
    answer: "Our answer",
    services: "Services delivered",
    features: "Key features",
    results: "Results",
    stack: "Technologies",
    links: "Links",
    caseStudy: "Online case study",
    contactTitle: "Let's talk about your project",
    contactText: "Horus Lab, the lab of Zayra Technologies, designs, builds, hosts and maintains your web and mobile applications.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default async function DossierPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = L[lang];
  const groups = [
    { label: t.solutions, items: CASE_STUDIES.filter((c) => c.kind === "solution") },
    { label: t.clients, items: CASE_STUDIES.filter((c) => c.kind === "client") },
  ];
  const date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });

  return (
    <main className="dossier bg-white text-ink">
      <style>{`
        @page { size: A4; margin: 0; }
        .dossier .sheet { width: 210mm; min-height: 297mm; padding: 15mm 15mm 12mm; box-sizing: border-box; page-break-after: always; break-after: page; position: relative; }
        @media screen { .dossier { background: #e5e9f2; padding: 24px 0; } .dossier .sheet { margin: 0 auto 24px; background: #fff; box-shadow: 0 6px 30px rgba(15,42,94,.15); } }
        @media print { body * { visibility: hidden !important; } .dossier, .dossier * { visibility: visible !important; } .dossier { position: absolute; inset: 0 auto auto 0; } }
      `}</style>

      {/* ═══ Couverture ═══ */}
      <section className="sheet flex flex-col justify-between bg-brand-900 text-white" style={{ background: "#0f2a5e" }}>
        <div className="flex items-center gap-6">
          <Image src="/zayra/brand/zayra-logo-white.png" alt="Zayra Technologies" width={700} height={243} className="h-12 w-auto" priority />
          <span className="h-10 w-px bg-white/30" />
          <Image src="/logo/logo-dark-bg-horizontal.png" alt="Horus-Lab" width={757} height={147} className="h-9 w-auto" priority />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky">Zayra Technologies · Horus Lab</p>
          <h1 className="mt-5 text-6xl font-extrabold leading-[1.02] tracking-tight">{t.title}</h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/85">{t.subtitle}</p>
          <div className="mt-12 grid grid-cols-4 gap-3">
            {CASE_STUDIES.filter((c) => c.kind === "solution").map((c) => (
              <div key={c.slug} className="flex h-24 items-center justify-center bg-white p-3">
                <div className="relative h-full w-full"><Image src={c.logo} alt={c.titles[lang]} fill sizes="160px" className="object-contain" loading="eager" /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between text-sm text-white/70">
          <span>Douala, Cameroun · contact@horus-lab.com</span>
          <span className="capitalize">{date}</span>
        </div>
      </section>

      {/* ═══ Sommaire ═══ */}
      <section className="sheet">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-900">{t.summary}</h2>
        {groups.map((g) => (
          <div key={g.label} className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{g.label}</p>
            <ul className="mt-4 divide-y divide-brand-100 border-y border-brand-100">
              {g.items.map((c) => (
                <li key={c.slug} className="flex items-center gap-5 py-4">
                  <div className="relative size-14 shrink-0 border border-brand-100 bg-white p-1.5">
                    <Image src={c.logo} alt="" fill sizes="56px" className="object-contain p-1" loading="eager" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-900">{c.titles[lang]}</p>
                    <p className="text-sm text-muted">{c.content[lang].sector} · {c.content[lang].tagline}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ═══ Une fiche par projet ═══ */}
      {CASE_STUDIES.map((cs) => {
        const c = cs.content[lang];
        const url = `${SITE_URL}/${lang}/portfolio/${cs.slug}`;
        return (
          <section key={cs.slug} className="sheet flex flex-col text-[11px] leading-[1.5]" style={{ height: "297mm", overflow: "hidden" }}>
            <div className="flex items-start justify-between gap-6 border-b border-brand-100 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">
                  {cs.kind === "solution" ? t.solutions : t.clients} · {c.sector}
                </p>
                <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-brand-900">{cs.titles[lang]}</h2>
                <p className="mt-1 text-sm font-semibold text-brand-700">{c.tagline}</p>
                <p className="mt-1 text-xs text-muted">{t.client} : {c.client}</p>
              </div>
              <div className="relative h-20 w-36 shrink-0 border border-brand-100 bg-white p-2">
                <Image src={cs.logo} alt="" fill sizes="144px" className="object-contain p-2" loading="eager" />
              </div>
            </div>

            {cs.cover && (
              <div className="relative mt-4 h-[46mm] shrink-0 overflow-hidden border border-brand-100">
                <Image src={cs.cover} alt="" fill sizes="800px" className="object-cover object-top" loading="eager" />
              </div>
            )}

            <p className="mt-4 text-[11.5px] text-ink/85">{c.intro}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-surface p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.need}</p>
                <p className="mt-1.5 text-ink/80">{c.challenge}</p>
              </div>
              <div className="bg-surface p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.answer}</p>
                <p className="mt-1.5 text-ink/80">{c.approach}</p>
              </div>
            </div>

            <div className="mt-4 grid flex-1 grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.features}</p>
                <ul className="mt-2 space-y-1">
                  {c.features.map((f) => (
                    <li key={f.title}><span className="font-semibold text-brand-900">{f.title}.</span> <span className="text-ink/75">{f.desc}</span></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.services}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-ink/80">
                    {c.services.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.results}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 font-semibold text-brand-900">
                    {c.results.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-brand-100 pt-3 text-[10px]">
              <p><span className="font-bold text-brand-900">{t.stack} : </span><span className="text-ink/75">{cs.stack.map((s) => s.name).join(" · ")}</span></p>
              <p className="mt-1">
                <span className="font-bold text-brand-900">{t.links} : </span>
                <span className="text-ink/75">{[...cs.links[lang].map((l) => l.href), url].join("  ·  ")}</span>
              </p>
            </div>
          </section>
        );
      })}

      {/* ═══ Contact ═══ */}
      <section className="sheet flex flex-col justify-center text-center" style={{ background: "#0f2a5e", color: "#fff" }}>
        <h2 className="text-4xl font-extrabold tracking-tight">{t.contactTitle}</h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">{t.contactText}</p>
        <div className="mt-10 space-y-1.5 text-lg font-semibold">
          <p>contact@horus-lab.com</p>
          <p>+237 659 90 21 91 · +237 696 90 20 54</p>
          <p>horus-lab.com · Douala, Cameroun</p>
        </div>
      </section>
    </main>
  );
}
