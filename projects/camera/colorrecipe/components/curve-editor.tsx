"use client";

import { useRef, useState } from "react";
import type { CurvePoint } from "@/projects/camera/colorrecipe/lib/types";

const SIZE = 240;
const PAD = 12;
const PLOT = SIZE - PAD * 2;

function toSvg(point: CurvePoint) {
  return {
    x: PAD + (point.x / 100) * PLOT,
    y: PAD + ((100 - point.y) / 100) * PLOT,
  };
}

export function CurveEditor({
  points,
  onChange,
  accent = "var(--cr-accent)",
}: {
  points: CurvePoint[];
  onChange: (points: CurvePoint[]) => void;
  accent?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const svgPoints = points.map(toSvg);
  const path = `M ${svgPoints[0].x} ${svgPoints[0].y} Q ${svgPoints[1].x} ${svgPoints[1].y} ${svgPoints[2].x} ${svgPoints[2].y}`;

  function updateFromPointer(index: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = 1 - (clientY - rect.top - PAD) / PLOT;
    const y = Math.round(Math.min(100, Math.max(0, ratio * 100)));
    const next = points.map((p, i) => (i === index ? { ...p, y } : p));
    onChange(next);
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full touch-none select-none rounded-2xl bg-[var(--cr-surface)]"
      onPointerMove={(e) => {
        if (dragIndex === null) return;
        updateFromPointer(dragIndex, e.clientY);
      }}
      onPointerUp={() => setDragIndex(null)}
      onPointerLeave={() => setDragIndex(null)}
    >
      {[0, 25, 50, 75, 100].map((g) => (
        <line
          key={`h-${g}`}
          x1={PAD}
          x2={SIZE - PAD}
          y1={PAD + (g / 100) * PLOT}
          y2={PAD + (g / 100) * PLOT}
          stroke="var(--cr-border)"
          strokeWidth={1}
        />
      ))}
      {[0, 25, 50, 75, 100].map((g) => (
        <line
          key={`v-${g}`}
          y1={PAD}
          y2={SIZE - PAD}
          x1={PAD + (g / 100) * PLOT}
          x2={PAD + (g / 100) * PLOT}
          stroke="var(--cr-border)"
          strokeWidth={1}
        />
      ))}
      <line
        x1={PAD}
        y1={SIZE - PAD}
        x2={SIZE - PAD}
        y2={PAD}
        stroke="var(--cr-cool-gray-soft)"
        strokeDasharray="3 4"
        strokeWidth={1}
      />
      <path d={path} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
      {svgPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={7}
          fill="var(--cr-bg)"
          stroke={accent}
          strokeWidth={2.5}
          className="cursor-grab"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragIndex(i);
          }}
        />
      ))}
    </svg>
  );
}
