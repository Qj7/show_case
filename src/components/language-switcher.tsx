"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LOCALE_STORAGE_KEY, localeNames, locales, type Locale } from "@/i18n/config";

function Flag({ locale }: { locale: Locale }) {
  const uid = useId().replace(/:/g, "");

  return (
    <span className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/20 ring-inset" aria-hidden>
      {locale === "ru" ? (
        <svg viewBox="0 0 3 2" className="h-full w-full" preserveAspectRatio="none">
          <rect width="3" height="2" fill="#fff" />
          <rect width="3" height="0.667" y="0.667" fill="#0039A6" />
          <rect width="3" height="0.667" y="1.333" fill="#D52B1E" />
        </svg>
      ) : null}
      {locale === "en" ? (
        <svg viewBox="0 0 60 30" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <clipPath id={`${uid}-uk`}>
            <rect width="60" height="30" />
          </clipPath>
          <g clipPath={`url(#${uid}-uk)`}>
            <rect width="60" height="30" fill="#012169" />
            <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
            <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4" />
            <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      ) : null}
      {locale === "vi" ? (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="20" fill="#DA251D" />
          <polygon
            fill="#FF0"
            points="15,4.2 16.6,8.6 21.3,8.8 17.6,11.6 18.9,16.1 15,13.6 11.1,16.1 12.4,11.6 8.7,8.8 13.4,8.6"
          />
        </svg>
      ) : null}
      {locale === "es" ? (
        <svg viewBox="0 0 3 2" className="h-full w-full" preserveAspectRatio="none">
          <rect width="3" height="2" fill="#AA151B" />
          <rect width="3" height="1" y="0.5" fill="#F1BF00" />
        </svg>
      ) : null}
    </span>
  );
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    setOpen(false);
    if (next === locale) return;

    const segments = pathname.split("/");
    segments[1] = next;
    router.push(`${segments.join("/")}${window.location.hash}`, { scroll: false });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${localeNames[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm text-fg transition-colors hover:bg-white/5 sm:px-4"
      >
        <Flag locale={locale} />
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-2 min-w-48 overflow-hidden rounded-2xl border border-line bg-bg/95 p-1 shadow-xl backdrop-blur-xl"
        >
          {locales.map((item) => {
            const selected = item === locale;
            return (
              <li key={item} role="option" aria-selected={selected} lang={item}>
                <button
                  type="button"
                  onClick={() => select(item)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    selected ? "bg-white/10 text-fg" : "text-muted hover:bg-white/5 hover:text-fg"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Flag locale={item} />
                    {localeNames[item]}
                  </span>
                  {selected ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
