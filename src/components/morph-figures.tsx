"use client";

import { useEffect, useRef } from "react";

export function MorphFigures() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let unmount: (() => void) | undefined;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("@/components/morph-scene")
      .then(({ mountMorphScene }) => {
        if (cancelled) return;
        unmount = mountMorphScene(el, { animate });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, []);

  return (
    <div className="pointer-events-none relative z-10 h-[80svh] min-h-[32rem] lg:absolute lg:inset-y-0 lg:right-0 lg:z-10 lg:h-auto lg:min-h-0 lg:w-[70%]">
      <div
        ref={ref}
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
      />
    </div>
  );
}
