import Link from "next/link";
import { Logo } from "@/components/logo";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
        </div>
        <nav aria-label="Навигация в подвале">
          <p className="mb-4 text-xs tracking-widest text-muted uppercase">Разделы</p>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs tracking-widest text-muted uppercase">Связь</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={site.contacts.telegram} className="transition-colors hover:text-accent" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contacts.email}`} className="transition-colors hover:text-accent">
                {site.contacts.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-line px-6 py-6 text-xs text-muted">
        <span>
          © {site.copyrightYear} {site.name}
        </span>
        <span>{site.tagline}</span>
      </div>
    </footer>
  );
}
