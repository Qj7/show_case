"use client";

import Link from "next/link";
import { nav } from "@/content/site";

export function MobileNav({ menuId }: { menuId: string }) {
  return (
    <ul className="space-y-2">
      {nav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => document.getElementById(menuId)?.hidePopover()}
            className="block py-2 font-display text-4xl font-semibold"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
