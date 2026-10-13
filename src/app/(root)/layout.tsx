import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import { defaultLocale, localeHref, locales } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: en.meta.title,
  description: en.meta.description,
  alternates: {
    canonical: `${site.url}${localeHref(defaultLocale)}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${site.url}${localeHref(l)}`])),
      "x-default": `${site.url}/`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={defaultLocale} className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
