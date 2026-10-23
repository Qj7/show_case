"use client";

import { useEffect, useRef, useState } from "react";
import type { GalaxyHint, GalaxyVariant } from "@/components/galaxy-scene";

const HINT_MS = 1500;

export function Galaxy({
  hints,
  variant = "section",
}: {
  hints: Record<GalaxyHint, string>;
  variant?: GalaxyVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState<GalaxyHint>("wheel");
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let unmount: (() => void) | undefined;
    let hintTimeout: ReturnType<typeof setTimeout> | undefined;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onHint = (next: GalaxyHint) => {
      setHint(next);
      setHintVisible(true);
      clearTimeout(hintTimeout);
      hintTimeout = setTimeout(() => setHintVisible(false), HINT_MS);
    };

    import("@/components/galaxy-scene")
      .then(({ mountGalaxyScene }) => {
        if (cancelled) return;
        unmount = mountGalaxyScene(el, { animate, onHint, variant });
        el.dataset.ready = "";
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearTimeout(hintTimeout);
      unmount?.();
    };
  }, [variant]);

  const hero = variant === "hero";

  return (
    <div
      aria-hidden
      className={
        hero
          ? "absolute inset-0"
          : "relative h-[80svh] min-h-[28rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]"
      }
    >
      <div
        ref={ref}
        className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-ready:opacity-100 pointer-fine:cursor-grab pointer-fine:active:cursor-grabbing"
      />
      {hero ? null : (
        <p
          data-visible={hintVisible ? "" : undefined}
          className="pointer-events-none absolute inset-x-6 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-full border border-line bg-black/60 px-5 py-2.5 text-center text-sm text-fg opacity-0 backdrop-blur transition-opacity duration-300 data-visible:opacity-100"
        >
          {hints[hint]}
        </p>
      )}
    </div>
  );
}
