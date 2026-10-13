import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { navSections } from "@/content/site";
import { hasLocale, localeHref, type Locale } from "./config";

const dictionaries = {
  ru: () => import("./dictionaries/ru").then((m) => m.ru),
  en: () => import("./dictionaries/en").then((m) => m.en),
  vi: () => import("./dictionaries/vi").then((m) => m.vi),
  es: () => import("./dictionaries/es").then((m) => m.es),
} satisfies Record<Locale, unknown>;

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary() {
  return dictionaries[await getLocale()]();
}

export type NavItem = { href: string; label: string };

export async function getNav(): Promise<NavItem[]> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return navSections.map((id) => ({ href: localeHref(locale, `#${id}`), label: dict.nav[id] }));
}
