"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { defaultLocale, detectLocale, localeHref, type Locale } from "@/i18n/config";

const subscribe = () => () => {};

export function useDetectedLocale(): Locale {
  return useSyncExternalStore(subscribe, detectLocale, () => defaultLocale);
}

export function LocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${localeHref(detectLocale())}${window.location.hash}`);
  }, [router]);

  return null;
}
