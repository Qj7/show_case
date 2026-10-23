import Link from "next/link";
import type { ReactNode } from "react";
import { NetBackground } from "./NetBackground";
import type { VioletGeoHeroPlatformId, VioletGeoHeroProps } from "./types";

const platformIcons: Record<VioletGeoHeroPlatformId, ReactNode> = {
  web: <path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
  mobile: <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />,
  desktop: <path d="M2 4h20v12H2zM8 20h8M12 16v4" />,
  bots: <path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15zM9 13l8-6" />,
};

export function VioletGeoHero({
  title,
  lead,
  cta,
  secondary,
  platforms,
  stats,
}: VioletGeoHeroProps) {
  return (
    <section className="noise relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[10%] size-[42rem] animate-aurora rounded-full bg-violet/30 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] size-[32rem] animate-aurora rounded-full bg-blue-600/25 blur-[120px] [animation-delay:-6s]" />
        <NetBackground />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <h1 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,5.6rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
          {title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{lead}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={cta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            {cta.label}
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
            href={secondary.href}
            className="inline-flex items-center rounded-full border border-line bg-white/[0.03] px-7 py-4 font-semibold backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            {secondary.label}
          </Link>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-4">
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
                {platformIcons[p.id]}
              </svg>
              <p className="mt-5 font-semibold">{p.label}</p>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-8">
          {stats.map((s) => (
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
