"use client";

import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageProvider";

const TEXT = {
  fr: {
    title: "Une erreur est survenue",
    body: "Quelque chose s'est mal passé de notre côté. Vous pouvez réessayer.",
    retry: "Réessayer",
    home: "Accueil",
  },
  en: {
    title: "Something went wrong",
    body: "An unexpected error occurred on our side. You can try again.",
    retry: "Try again",
    home: "Home",
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLang();
  const t = TEXT[lang];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 via-white to-surface px-5">
      <div className="w-full max-w-md text-center">
        <p className="text-6xl font-extrabold tracking-tight text-gradient">!</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-900">{t.title}</h1>
        <p className="mt-3 text-muted">{t.body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-brand-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition-colors hover:bg-brand-800"
          >
            {t.retry}
          </button>
          <a
            href={`/${lang}`}
            className="rounded-full border border-brand-200 bg-white px-7 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            {t.home}
          </a>
        </div>
      </div>
    </main>
  );
}
