import Link from "next/link";
import { LocaleRedirect } from "@/components/locale-redirect";
import { localeHref, localeNames, locales } from "@/i18n/config";

export default function RootPage() {
  return (
    <>
      <LocaleRedirect />
      <noscript>
        <ul className="flex min-h-dvh flex-col items-center justify-center gap-4 font-display text-2xl">
          {locales.map((locale) => (
            <li key={locale} lang={locale}>
              <Link href={localeHref(locale)} className="transition-colors hover:text-accent">
                {localeNames[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </noscript>
    </>
  );
}
