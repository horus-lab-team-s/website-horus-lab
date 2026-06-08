import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/dictionaries";

type Params = { lang: string };

// La page Actualités est supprimée — redirection permanente vers le blog.
export default async function NewsPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "fr";
  redirect(`/${locale}/blog`);
}
