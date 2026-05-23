import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/dictionaries";

// La racine redirige vers la langue par défaut (/fr).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
