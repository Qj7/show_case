"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { site } from "@/content/site";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ru";
import type { NavItem } from "@/i18n/get-dictionary";

const MENU_ID = "mobile-menu";

type Props = {
  locale: Locale;
  nav: NavItem[];
  labels: Dictionary["header"];
  homeLabel: string;
};

export function Header({ locale, nav, labels, homeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [pastOrbit, setPastOrbit] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const orbit = document.getElementById("hero-orbit");

    const update = () => {
      if (!orbit) {
        setPastOrbit(window.scrollY > 8);
        return;
      }
      setPastOrbit(orbit.getBoundingClientRect().bottom <= 72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest("a")) setOpen(false);
  };

  const solid = pastOrbit || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4" onClick={closeOnLink}>
      <div
        className={`relative z-10 mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pr-2 pl-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
          solid
            ? "border-white/10 bg-bg/85 shadow-lg shadow-black/40 backdrop-blur-xl"
            : "border-white/15 bg-transparent shadow-none backdrop-blur-none"
        }`}
      >
        <Logo href={localeHref(locale)} label={homeLabel} />

        <nav aria-label={labels.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-2 transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={labels.language} />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-white/5 md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-[18px]">
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  open ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  open ? "top-[5px] -rotate-45" : "top-2.5"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id={MENU_ID}
        inert={!open}
        className={`fixed inset-0 flex flex-col bg-bg/95 px-6 pt-32 pb-10 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label={labels.mobileNav}>
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${60 + i * 50}ms` : "0ms" }}
                className={`transition-[opacity,translate] duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              >
                <Link href={item.href} className="block py-2 font-display text-4xl font-semibold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6 text-muted">
          <a href={site.contacts.telegram} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg">
            Telegram
          </a>
          <a href={`mailto:${site.contacts.email}`} className="transition-colors hover:text-fg">
            {site.contacts.email}
          </a>
        </div>
      </div>
    </header>
  );
}
