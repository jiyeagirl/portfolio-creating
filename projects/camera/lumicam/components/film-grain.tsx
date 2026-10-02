"use client";

import { useId } from "react";

export function FilmGrain({
  intensity = 0.3,
  className = "",
}: {
  intensity?: number;
  className?: string;
}) {
  const filterId = useId();

  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay ${className}`}
      style={{ opacity: intensity }}
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
