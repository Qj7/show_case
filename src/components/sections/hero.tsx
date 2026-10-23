import Link from "next/link";
import { Galaxy } from "@/components/galaxy";
import { site } from "@/content/site";
import { format, localeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

const platforms = [
  {
    id: "web",
    label: "Web",
    icon: <path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
  },
  {
    id: "mobile",
    label: "iOS · Android",
    icon: <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />,
  },
  {
    id: "desktop",
    label: "macOS · Windows",
    icon: <path d="M2 4h20v12H2zM8 20h8M12 16v4" />,
  },
  {
    id: "bots",
    label: "Telegram",
    icon: <path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15zM9 13l8-6" />,
  },
] as const;

export async function Hero() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.hero;
  const years = site.copyrightYear - site.since;

  return (
    <section className="relative bg-black">
      <div id="hero-orbit" className="relative min-h-svh overflow-hidden">
        <Galaxy hints={dict.galaxy} variant="hero" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black via-black/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[74%] bg-[linear-gradient(to_top,#000_0%,rgb(0_0_0/0.82)_28%,rgb(0_0_0/0.4)_58%,transparent_100%)] md:h-[64%]"
        />

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col px-6 pt-28 pb-6 md:pb-8">
          <div aria-hidden className="flex-[1.15]" />
          <div className="pointer-events-auto max-w-4xl">
            <h1 className="max-w-5xl font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance [text-shadow:0_10px_40px_rgb(0_0_0/0.85)]">
              {t.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted [text-shadow:0_8px_28px_rgb(0_0_0/0.9)] md:mt-8 md:text-xl">
              {t.lead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <Link
                href={localeHref(locale, "#contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
              >
                {t.cta}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href={localeHref(locale, "#work")}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 font-semibold backdrop-blur transition-colors hover:bg-white/[0.1]"
              >
                {t.secondary}
              </Link>
            </div>
          </div>

          <a
            href="#platforms"
            className="pointer-events-auto mt-6 self-center p-2 text-white/80 transition-colors hover:text-white md:mt-8"
          >
            <span className="sr-only">{t.scroll}</span>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="animate-scroll-cue"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <div aria-hidden className="flex-[0.55]" />
        </div>
      </div>

      <div id="platforms" className="relative z-10 mx-auto max-w-6xl px-6 pt-4 pb-20">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {platforms.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-line bg-white/[0.02] p-5 backdrop-blur transition-colors hover:border-white/20"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
                aria-hidden
              >
                {p.icon}
              </svg>
              <p className="mt-5 font-semibold">{p.label}</p>
              <p className="mt-1 text-sm text-muted">{t.platforms[p.id]}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-8">
          {[
            { value: format(t.stats.years, { n: years }), label: t.stats.yearsLabel },
            { value: String(platforms.length), label: t.stats.platformsLabel },
            { value: t.stats.turnkey, label: t.stats.turnkeyLabel },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <dt className="text-xs text-muted sm:text-sm">{s.label}</dt>
              <dd className="order-first font-display text-xl font-semibold sm:text-3xl md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
