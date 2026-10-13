import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/content/site";
import { format, localeHref } from "@/i18n/config";
import { getDictionary, getLocale, getNav } from "@/i18n/get-dictionary";

export async function Footer() {
  const [locale, dict, nav] = await Promise.all([getLocale(), getDictionary(), getNav()]);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo href={localeHref(locale)} label={format(dict.common.logoHome, { name: site.name })} />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{dict.meta.description}</p>
        </div>
        <nav aria-label={dict.footer.nav}>
          <p className="mb-4 text-xs tracking-widest text-muted uppercase">{dict.footer.sections}</p>
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
          <p className="mb-4 text-xs tracking-widest text-muted uppercase">{dict.footer.contact}</p>
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
