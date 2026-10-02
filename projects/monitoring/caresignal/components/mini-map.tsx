"use client";

import { House, Buildings, Person, Warning, MapPin } from "@phosphor-icons/react";
import type { SafetyStatus } from "@/projects/monitoring/caresignal/lib/types";

/*
 * 위치 데이터를 읽기 위한 지도 캔버스. 실제 지도 SDK를 붙이지 않는 목업이므로
 * 도로망과 블록은 고정 좌표의 SVG로 그리고, 마커와 안심 구역은 HTML로 겹쳐
 * 올린다. SVG는 preserveAspectRatio="none"으로 늘어나기 때문에 컨테이너의
 * x%, y% 좌표와 마커 위치가 정확히 일치한다. 선 굵기는
 * vector-effect="non-scaling-stroke"로 고정한다.
 */

export type MapMarkerKind = "user" | "event" | "home" | "facility" | "pin";

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  kind: MapMarkerKind;
  label?: string;
  status?: SafetyStatus;
  pulse?: boolean;
  dim?: boolean;
}

export interface MapSafeZone {
  x: number;
  y: number;
  /** 컨테이너 너비 대비 지름 비율(%). */
  size: number;
  label?: string;
}

const H_ROADS = [
  { y: 64, w: 9 },
  { y: 146, w: 17 },
  { y: 226, w: 9 },
];

const V_ROADS = [
  { x: 78, w: 9 },
  { x: 176, w: 15 },
  { x: 304, w: 9 },
];

/** 도로 사이를 채우는 건물 블록. 손으로 배치해 격자가 기계적으로 보이지 않게 했다. */
const BLOCKS = [
  { x: 12, y: 12, w: 26, h: 18 },
  { x: 44, y: 12, w: 18, h: 30 },
  { x: 12, y: 36, w: 20, h: 16 },
  { x: 38, y: 48, w: 24, h: 8 },
  { x: 92, y: 10, w: 30, h: 22 },
  { x: 128, y: 14, w: 34, h: 14 },
  { x: 96, y: 38, w: 20, h: 16 },
  { x: 124, y: 36, w: 38, h: 18 },
  { x: 192, y: 12, w: 40, h: 26 },
  { x: 240, y: 16, w: 22, h: 14 },
  { x: 192, y: 44, w: 26, h: 10 },
  { x: 236, y: 38, w: 30, h: 16 },
  { x: 318, y: 14, w: 32, h: 20 },
  { x: 358, y: 12, w: 28, h: 32 },
  { x: 318, y: 42, w: 22, h: 12 },
  { x: 14, y: 82, w: 22, h: 26 },
  { x: 42, y: 84, w: 20, h: 18 },
  { x: 14, y: 116, w: 34, h: 18 },
  { x: 94, y: 78, w: 28, h: 20 },
  { x: 130, y: 80, w: 30, h: 34 },
  { x: 94, y: 106, w: 24, h: 28 },
  { x: 194, y: 76, w: 26, h: 22 },
  { x: 228, y: 78, w: 36, h: 16 },
  { x: 322, y: 76, w: 30, h: 26 },
  { x: 360, y: 80, w: 26, h: 18 },
  { x: 322, y: 110, w: 44, h: 22 },
  { x: 16, y: 168, w: 26, h: 20 },
  { x: 48, y: 172, w: 14, h: 32 },
  { x: 16, y: 196, w: 28, h: 16 },
  { x: 96, y: 166, w: 32, h: 24 },
  { x: 136, y: 170, w: 24, h: 18 },
  { x: 96, y: 198, w: 20, h: 16 },
  { x: 128, y: 196, w: 32, h: 20 },
  { x: 318, y: 168, w: 34, h: 20 },
  { x: 358, y: 172, w: 28, h: 26 },
  { x: 318, y: 196, w: 24, h: 18 },
  { x: 16, y: 244, w: 30, h: 20 },
  { x: 52, y: 248, w: 20, h: 16 },
  { x: 96, y: 244, w: 26, h: 22 },
  { x: 130, y: 246, w: 34, h: 18 },
  { x: 196, y: 246, w: 28, h: 20 },
  { x: 232, y: 244, w: 24, h: 24 },
  { x: 322, y: 242, w: 36, h: 24 },
  { x: 364, y: 246, w: 22, h: 18 },
];

/** 한빛근린공원. 지도에서 유일한 녹지라 위치 설명의 기준점이 된다. */
const PARK = "M192,164 L286,160 L296,196 L288,236 L226,240 L190,214 Z";

export function MiniMap({
  markers = [],
  route,
  safeZone,
  showLabels = true,
  className = "",
  rounded = "rounded-[18px]",
}: {
  markers?: MapMarker[];
  route?: { x: number; y: number }[];
  safeZone?: MapSafeZone;
  showLabels?: boolean;
  className?: string;
  rounded?: string;
}) {
  const routePath = route?.length
    ? route
        .map((p, i) => `${i === 0 ? "M" : "L"}${(p.x / 100) * 400},${(p.y / 100) * 300}`)
        .join(" ")
    : null;

  return (
    <div className={`relative overflow-hidden bg-[#eceef1] ${rounded} ${className}`}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect width="400" height="300" fill="#eceef1" />

        {BLOCKS.map((b) => (
          <rect
            key={`${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="2"
            fill="#e0e2e6"
          />
        ))}

        <path d={PARK} fill="#dbe8d5" />
        <circle cx="212" cy="182" r="6" fill="#c8dcc0" />
        <circle cx="240" cy="176" r="8" fill="#c8dcc0" />
        <circle cx="268" cy="192" r="7" fill="#c8dcc0" />
        <circle cx="228" cy="212" r="9" fill="#c8dcc0" />
        <circle cx="262" cy="222" r="6" fill="#c8dcc0" />

        {/* 정릉천. 지도 오른쪽 위에서 아래로 흐른다. */}
        <path
          d="M400,96 C368,110 356,140 358,164 C360,196 344,220 320,300"
          stroke="#d3e3f0"
          strokeWidth="13"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        {H_ROADS.map((r) => (
          <line
            key={`h${r.y}`}
            x1="0"
            y1={r.y}
            x2="400"
            y2={r.y}
            stroke="#ffffff"
            strokeWidth={r.w}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {V_ROADS.map((r) => (
          <line
            key={`v${r.x}`}
            x1={r.x}
            y1="0"
            x2={r.x}
            y2="300"
            stroke="#ffffff"
            strokeWidth={r.w}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1="240"
          y1="300"
          x2="400"
          y2="196"
          stroke="#ffffff"
          strokeWidth="8"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="106"
          x2="400"
          y2="106"
          stroke="#f4f5f7"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="248"
          y1="0"
          x2="248"
          y2="300"
          stroke="#f4f5f7"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
        />

        {routePath && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={routePath}
              fill="none"
              stroke="#0066cc"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {safeZone && (
        <div
          className="pointer-events-none absolute rounded-full border-2 border-dashed border-[#0066cc]/55 bg-[#0066cc]/8"
          style={{
            left: `${safeZone.x}%`,
            top: `${safeZone.y}%`,
            width: `${safeZone.size}%`,
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {showLabels && (
        <>
          <MapLabel x={5} y={51} text="정릉로" />
          <MapLabel x={45} y={4} text="보국문로" />
          <MapLabel x={60} y={66} text="한빛근린공원" strong />
          <MapLabel x={26} y={83} text="정릉시장" />
        </>
      )}

      {markers.map((m) => (
        <Marker key={m.id} marker={m} />
      ))}
    </div>
  );
}

function MapLabel({
  x,
  y,
  text,
  strong = false,
}: {
  x: number;
  y: number;
  text: string;
  strong?: boolean;
}) {
  return (
    <span
      className={`pointer-events-none absolute whitespace-nowrap text-[10px] leading-none ${
        strong ? "font-semibold text-[#5d7a55]" : "font-normal text-[#8e9096]"
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {text}
    </span>
  );
}

const STATUS_FILL: Record<SafetyStatus, string> = {
  safe: "#0066cc",
  caution: "#ff9500",
  danger: "#ff3b30",
};

function Marker({ marker }: { marker: MapMarker }) {
  const status = marker.status ?? "safe";

  if (marker.kind === "home" || marker.kind === "facility" || marker.kind === "pin") {
    const Icon = marker.kind === "home" ? House : marker.kind === "facility" ? Buildings : MapPin;
    return (
      <div
        className="absolute flex flex-col items-center gap-1"
        style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#1d1d1f]">
          <Icon size={13} weight="fill" />
        </span>
        {marker.label && (
          <span className="whitespace-nowrap rounded-[5px] bg-white/95 px-1.5 py-0.5 text-[9.5px] font-semibold leading-none text-[#333333]">
            {marker.label}
          </span>
        )}
      </div>
    );
  }

  const fill = marker.kind === "event" ? STATUS_FILL[status] : STATUS_FILL[status];
  const Icon = marker.kind === "event" ? Warning : Person;

  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        transform: "translate(-50%, -50%)",
        opacity: marker.dim ? 0.45 : 1,
      }}
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        {marker.pulse && (
          <span
            className="cs-pulse absolute inset-0 rounded-full"
            style={{ background: fill }}
            aria-hidden="true"
          />
        )}
        <span
          className="relative flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-white text-white"
          style={{ background: fill }}
        >
          <Icon size={14} weight="fill" />
        </span>
      </span>
      {marker.label && (
        <span className="whitespace-nowrap rounded-[5px] bg-white/95 px-1.5 py-0.5 text-[9.5px] font-semibold leading-none text-[#1d1d1f]">
          {marker.label}
        </span>
      )}
    </div>
  );
}
