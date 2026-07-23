import Image from "next/image";
import Link from "next/link";

// Rendu hors du provider de langue (route non localisée) -> texte bilingue figé.
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 via-white to-surface px-5 dark:from-slate-950 dark:via-[#0a1326] dark:to-[#070e1c]">
      <div className="relative w-full max-w-lg text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50" />

        <Image
          src="/logo/logo-light-bg-full.png"
          alt="Horus-Lab"
          width={160}
          height={116}
          priority
          className="mx-auto h-auto w-32 object-contain dark:hidden"
        />
        <Image
          src="/logo/logo-dark-bg-full.png"
          alt="Horus-Lab"
          width={160}
          height={116}
          priority
          className="mx-auto hidden h-auto w-32 object-contain dark:block"
        />

        <p className="mt-8 text-7xl font-extrabold tracking-tight text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-900 dark:text-white">
          Page introuvable
        </h1>
        <p className="mt-2 text-sm text-muted">Page not found</p>
        <p className="mx-auto mt-4 max-w-sm text-muted">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          <br />
          <span className="text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/fr"
            className="rounded-full bg-brand-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-colors hover:bg-brand-800"
          >
            Accueil
          </Link>
          <Link
            href="/en"
            className="rounded-full border border-brand-200 bg-white px-7 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:bg-slate-900 dark:text-brand-200 dark:hover:bg-white/5"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
