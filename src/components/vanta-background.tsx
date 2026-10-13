"use client";

import { useEffect, useRef } from "react";

export function VantaBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let effect: { destroy(): void } | undefined;

    Promise.all([import("three"), import("vanta/dist/vanta.net.min")])
      .then(([THREE, { default: NET }]) => {
        if (cancelled) return;
        const net = NET({
          el,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x7c5cff,
          backgroundColor: 0x2d1b69,
          backgroundAlpha: 0,
          points: 9,
          maxDistance: 22,
          spacing: 18,
          showDots: true,
        });
        // With a background darker than `color`, NET fades lines to black via additive
        // blending, which shows up as black lines on a transparent canvas. Force it to
        // fade from backgroundColor to color with normal blending instead.
        net.blending = "subtractive";
        net.linesMesh.material.blending = THREE.NormalBlending;
        net.linesMesh.material.needsUpdate = true;
        effect = net;
        el.dataset.ready = "";
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
    />
  );
}
