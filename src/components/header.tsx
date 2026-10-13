import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { nav } from "@/content/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-line bg-bg/70 pr-2 pl-4 backdrop-blur-xl">
        <Logo />

        <nav aria-label="Основная навигация" className="hidden md:block">
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
          <Link
            href="/#contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:block"
          >
            Обсудить проект
          </Link>
          <button
            type="button"
            popoverTarget="mobile-menu"
            aria-label="Открыть меню"
            className="grid size-10 place-items-center rounded-full border border-line md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" popover="auto" className="menu bg-bg/95 p-6 text-fg backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            popoverTarget="mobile-menu"
            popoverTargetAction="hide"
            aria-label="Закрыть меню"
            className="grid size-10 place-items-center rounded-full border border-line"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Мобильная навигация" className="mt-16">
          <MobileNav menuId="mobile-menu" />
        </nav>
      </div>
    </header>
  );
}
