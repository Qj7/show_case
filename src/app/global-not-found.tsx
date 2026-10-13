import type { Metadata } from "next";
import { GlobalNotFoundContent } from "@/components/global-not-found-content";
import { site } from "@/content/site";
import { defaultLocale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { ru } from "@/i18n/dictionaries/ru";
import { vi } from "@/i18n/dictionaries/vi";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `404 — ${site.name}`,
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <GlobalNotFoundContent
          texts={{ ru: ru.notFound, en: en.notFound, vi: vi.notFound, es: es.notFound }}
        />
      </body>
    </html>
  );
}
