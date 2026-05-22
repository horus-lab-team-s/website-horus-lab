import Image from "next/image";
import Link from "next/link";

// Rendu hors du provider de langue (route non localisée) -> texte bilingue figé.
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 via-white to-surface px-5">
      <div className="relative w-full max-w-lg text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50" />

        <Image
          src="/Logo-HORUS-LAB.jpeg"
          alt="Horus-Lab"
          width={72}
          height={72}
          priority
          className="mx-auto rounded-full ring-1 ring-brand-100"
        />

        <p className="mt-8 text-7xl font-extrabold tracking-tight text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-900">
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
            className="rounded-full border border-brand-200 bg-white px-7 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
