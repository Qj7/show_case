import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { localeHref, locales } from "@/i18n/config";

export const dynamic = "force-static";

function entry(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}${localeHref(l, path)}`]));
  return locales.map((locale) => ({
    url: `${site.url}${localeHref(locale, path)}`,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...entry("/", 1), ...projects.flatMap((p) => entry(`/work/${p.slug}/`, 0.8))];
}
