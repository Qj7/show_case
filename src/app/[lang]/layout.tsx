import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
import { format, localeHref, locales, ogLocales } from "@/i18n/config";
import { getDictionary, getLocale, getNav } from "@/i18n/get-dictionary";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.title,
      template: `%s — ${site.name}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `${site.url}${localeHref(locale)}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${site.url}${localeHref(l)}`])),
        "x-default": `${site.url}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale],
      siteName: site.name,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict, nav] = await Promise.all([getLocale(), getDictionary(), getNav()]);

  return (
    <html lang={locale} className={`${fontVariables} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
        >
          {dict.common.skipToContent}
        </a>
        <Header
          locale={locale}
          nav={nav}
          labels={dict.header}
          homeLabel={format(dict.common.logoHome, { name: site.name })}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
