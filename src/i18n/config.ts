export const locales = ["ru", "en", "vi", "es"] as const;

export type Locale = (typeof locales)[number];

export type Localized<T = string> = Record<Locale, T>;

export const defaultLocale: Locale = "en";

export const localeNames: Localized = {
  ru: "Русский",
  en: "English",
  vi: "Tiếng Việt",
  es: "Español",
};

export const ogLocales: Localized = {
  ru: "ru_RU",
  en: "en_US",
  vi: "vi_VN",
  es: "es_ES",
};

export const LOCALE_STORAGE_KEY = "locale";

export function hasLocale(value: string | null | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

function matchLocale(tag: string | null | undefined): Locale | null {
  const base = tag?.toLowerCase().split("-")[0];
  return hasLocale(base) ? base : null;
}

/** Browser-only: saved choice first, then the browser's preferred languages, then the default. */
export function detectLocale(): Locale {
  const saved = matchLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  if (saved) return saved;

  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const match = matchLocale(tag);
    if (match) return match;
  }

  return defaultLocale;
}

/** `path` is relative to the locale root and should start with `/` or `#`. */
export function localeHref(locale: Locale, path = "/") {
  return `/${locale}${path.startsWith("#") ? `/${path}` : path}`;
}

export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
