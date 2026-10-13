import Link from "next/link";
import { useId } from "react";
import { site } from "@/content/site";

export function Logo() {
  const uid = useId().replace(/:/g, "");
  const grad = `orbita-grad-${uid}`;
  const mask = `orbita-mask-${uid}`;

  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — на главную`}>
      <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden className="shrink-0">
        <defs>
          <linearGradient id={grad} x1="32%" y1="100%" x2="68%" y2="0%">
            <stop offset="0%" stopColor="#6A47FF" />
            <stop offset="55%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#B4A2FF" />
          </linearGradient>
          <mask id={mask}>
            <circle cx="24" cy="24" r="22" fill="white" />
            <rect x="22.2" y="0" width="3.6" height="48" fill="black" />
            <rect x="0" y="22.2" width="48" height="3.6" fill="black" />
            <circle cx="24" cy="24" r="8.4" fill="black" />
            <circle cx="24" cy="24" r="3.5" fill="white" />
          </mask>
        </defs>
        <circle cx="24" cy="24" r="22" fill={`url(#${grad})`} mask={`url(#${mask})`} />
      </svg>
      <span className="font-display text-[15px] font-semibold tracking-tight">{site.name}</span>
    </Link>
  );
}
