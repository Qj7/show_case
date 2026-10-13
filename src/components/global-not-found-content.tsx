"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDetectedLocale } from "@/components/locale-redirect";
import { localeHref, type Localized } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ru";

export function GlobalNotFoundContent({ texts }: { texts: Localized<Dictionary["notFound"]> }) {
  const locale = useDetectedLocale();
  const t = texts[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <section className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[clamp(6rem,20vw,12rem)] leading-none font-bold tracking-tighter text-gradient">404</p>
      <h1 className="mt-6 font-display text-2xl font-semibold">{t.title}</h1>
      <p className="mt-3 text-muted">{t.text}</p>
      <Link
        href={localeHref(locale)}
        className="mt-10 rounded-full bg-accent px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03]"
      >
        {t.home}
      </Link>
    </section>
  );
}
