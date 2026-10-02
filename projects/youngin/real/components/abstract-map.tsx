"use client";

/* 추상화 지도. spec.md 8절에 따라 실제 지도 타일/API 를 쓰지 않고 도로망과 건물 블록만
   남긴 정적 SVG 로 그린다. 지명, 행정구역 라벨, 실좌표는 어디에도 넣지 않는다.

   좌표계: 모든 데이터는 0~100 정규화 좌표를 쓴다.
   - 배경 지오메트리는 viewBox="0 0 100 100" + preserveAspectRatio="none" 로 컨테이너를
     꽉 채우고, 모든 선에 vector-effect="non-scaling-stroke" 를 걸어 비등방 스케일에도
     선 굵기가 일정하게 유지되도록 한다.
   - 마커/라벨은 SVG 가 아니라 HTML 을 left/top 퍼센트로 얹는다. 원과 글자가 눌리지 않고
     좌표가 배경과 정확히 일치한다. */

import type { ReactNode } from "react";
import { MapPin, NavigationArrow } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Point } from "@/projects/youngin/real/lib/types";

/* ── 배경 지오메트리 (한 번 정해두고 전 화면이 같은 지도를 쓴다) ── */

const BLOCKS: { x: number; y: number; w: number; h: number; alt?: boolean }[] = [
  { x: 4, y: 32, w: 13, h: 9 },
  { x: 4, y: 44, w: 13, h: 12, alt: true },
  { x: 4, y: 60, w: 13, h: 10 },
  { x: 5, y: 82, w: 12, h: 11, alt: true },
  { x: 29, y: 32, w: 13, h: 8, alt: true },
  { x: 29, y: 50, w: 11, h: 7 },
  { x: 29, y: 61, w: 11, h: 9, alt: true },
  { x: 30, y: 82, w: 12, h: 11 },
  { x: 50, y: 30, w: 12, h: 9 },
  { x: 51, y: 56, w: 10, h: 8, alt: true },
  { x: 50, y: 66, w: 11, h: 6 },
  { x: 50, y: 82, w: 13, h: 11, alt: true },
  { x: 73, y: 44, w: 12, h: 9, alt: true },
  { x: 73, y: 56, w: 14, h: 8 },
  { x: 74, y: 66, w: 12, h: 8, alt: true },
  { x: 73, y: 82, w: 14, h: 11 },
  { x: 88, y: 32, w: 9, h: 10 },
  { x: 88, y: 56, w: 9, h: 16, alt: true },
  { x: 20, y: 4, w: 11, h: 7, alt: true },
  { x: 52, y: 4, w: 12, h: 6 },
  { x: 78, y: 4, w: 11, h: 6, alt: true },
];

/** 주요 도로 — 굵은 흰 선 */
const MAJOR_ROADS = [
  "M -3 45 C 18 42, 34 41, 46 47 C 60 54, 80 52, 103 49",
  "M 46 -3 C 44 16, 43 30, 45 48 C 47 68, 46 84, 47 103",
  "M -3 77 C 20 74, 44 79, 66 75 C 82 72, 92 74, 103 72",
];

/** 보조 도로 — 얇은 흰 선 */
const MINOR_ROADS = [
  "M 22 -3 C 21 18, 20 40, 22 62 C 23 78, 22 90, 23 103",
  "M 68 -3 C 67 14, 66 30, 68 46 C 70 64, 68 84, 69 103",
  "M -3 28 C 16 25, 34 24, 50 27 C 68 30, 86 27, 103 25",
  "M -3 62 C 14 60, 28 63, 42 61 C 58 59, 78 63, 103 60",
  "M 30 47 C 34 53, 36 60, 34 70",
  "M 56 47 C 58 55, 60 62, 58 72",
];

/** 실개천 — B 상점가 산책로가 끼고 있는 물길 */
const STREAM = "M -3 14 C 14 20, 26 10, 42 16 C 58 22, 76 10, 103 15";

export type MapMarker = {
  id: string;
  point: Point;
  /** 마커 표면 색 */
  fg?: string;
  bg?: string;
  icon?: Icon;
  /** 숫자 클러스터 마커 */
  count?: number;
  label?: string;
  active?: boolean;
  onClick?: () => void;
};

/** 0~100 좌표계에서 잘라낼 창. 지정하면 그만큼 확대되어 보인다. */
export type MapView = { x: number; y: number; w: number; h: number };

/**
 * 관심 지점들이 화면의 `fill` 비율을 차지하도록 뷰 창을 계산한다.
 * 전체(0~100)를 그대로 보여주면 가까운 두 지점이 몇 퍼센트 안에 몰려 붙어 보이므로,
 * 경로/구역처럼 대상이 좁은 지도는 이 창으로 잘라 쓴다.
 */
export function fitView(
  points: Point[],
  { aspect, fill = 0.52, min = 22 }: { aspect: number; fill?: number; min?: number },
): MapView {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const w = Math.max((maxX - minX) / fill, ((maxY - minY) / fill) * aspect, min);
  const h = w / aspect;

  /* 블록과 도로가 정의된 범위(약 0~100) 밖으로 창이 나가면 빈 지면만 보인다.
     중심을 안쪽으로 물려 창이 지도 위에 남게 한다. */
  const clamp = (center: number, size: number) =>
    Math.min(Math.max(center, size / 2 - 4), 104 - size / 2);

  const cx = clamp((minX + maxX) / 2, w);
  const cy = clamp((minY + maxY) / 2, h);

  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export type MapPolygon = {
  id: string;
  points: Point[];
  stroke?: string;
  fill?: string;
  label?: string;
  labelAt?: Point;
};

export function AbstractMap({
  markers = [],
  polygons = [],
  route,
  showQrPin = true,
  qrPoint,
  qrLabel,
  view,
  className = "",
  children,
}: {
  markers?: MapMarker[];
  polygons?: MapPolygon[];
  route?: Point[];
  showQrPin?: boolean;
  qrPoint: Point;
  qrLabel?: string;
  /** 잘라낼 창. 생략하면 0~100 전체를 보여준다. `fitView`로 계산해 넘긴다. */
  view?: MapView;
  className?: string;
  children?: ReactNode;
}) {
  const v = view ?? { x: 0, y: 0, w: 100, h: 100 };

  /* SVG 는 viewBox 로, HTML 마커는 퍼센트 재계산으로 같은 창을 적용한다. */
  const at = (p: Point) => ({
    left: `${((p.x - v.x) / v.w) * 100}%`,
    top: `${((p.y - v.y) / v.h) * 100}%`,
  });
  /* `relative` 는 마커의 좌표 기준이라 빼면 안 된다. 화면을 꽉 채워야 하는 곳에서는
     호출부가 `absolute inset-0` 래퍼를 두고 여기엔 `h-full w-full` 을 넘긴다
     (같은 엘리먼트에 relative 와 absolute 를 같이 주면 relative 가 이겨서 높이가 0이 된다). */
  return (
    <div className={`relative overflow-hidden bg-[var(--cp-map-land)] ${className}`}>
      <svg
        viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* 녹지 */}
        <ellipse cx="80" cy="34" rx="13" ry="9" fill="var(--cp-map-green)" />
        <ellipse cx="12" cy="20" rx="10" ry="7" fill="var(--cp-map-green)" />

        {/* 물길 */}
        <path
          d={STREAM}
          stroke="var(--cp-map-water)"
          strokeWidth="7"
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />

        {/* 건물 블록 */}
        {BLOCKS.map((b) => (
          <rect
            key={`${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="1.2"
            fill={b.alt ? "var(--cp-map-block-alt)" : "var(--cp-map-block)"}
          />
        ))}

        {/* 도로 — 블록 위에 얹어 골목을 깎아낸다 */}
        {MINOR_ROADS.map((d) => (
          <path
            key={d}
            d={d}
            stroke="var(--cp-map-road)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {MAJOR_ROADS.map((d) => (
          <path
            key={d}
            d={d}
            stroke="var(--cp-map-road)"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {MAJOR_ROADS.map((d) => (
          <path
            key={`${d}-line`}
            d={d}
            stroke="var(--cp-map-road-line)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 7"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* 상점가 구역 경계 폴리곤 */}
        {polygons.map((p) => (
          <polygon
            key={p.id}
            points={p.points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill={p.fill ?? "rgba(29,78,137,0.10)"}
            stroke={p.stroke ?? "var(--cp-accent)"}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* 도보 경로 폴리라인 */}
        {route && route.length > 1 && (
          <>
            <polyline
              points={route.map((pt) => `${pt.x},${pt.y}`).join(" ")}
              fill="none"
              stroke="var(--cp-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.22"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={route.map((pt) => `${pt.x},${pt.y}`).join(" ")}
              fill="none"
              stroke="var(--cp-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              className="cp-route-flow"
              points={route.map((pt) => `${pt.x},${pt.y}`).join(" ")}
              fill="none"
              stroke="var(--cp-on-accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {/* 구역 라벨 — 지명이 아니라 구역 코드만 노출한다 */}
      {polygons
        .filter((p) => p.label)
        .map((p) => {
          const labelPoint = p.labelAt ?? p.points[0];
          return (
            <span
              key={`${p.id}-label`}
              className="cp-num pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] border border-[var(--cp-accent-line)] bg-[var(--cp-surface)] px-1.5 py-[2px] text-[10px] font-bold text-[var(--cp-accent)]"
              style={at(labelPoint)}
            >
              {p.label}
            </span>
          );
        })}

      {/* 시설 / 매장 마커 */}
      {markers.map((m) => {
        const Icon = m.icon;
        const content =
          m.count !== undefined ? (
            <span
              className={`cp-num flex items-center justify-center rounded-full border-2 border-white text-[12px] font-bold shadow-[var(--cp-shadow)] ${
                m.active ? "h-11 w-11 text-[14px]" : "h-9 w-9"
              }`}
              style={{ background: m.bg ?? "var(--cp-accent)", color: m.fg ?? "var(--cp-on-accent)" }}
            >
              {m.count}
            </span>
          ) : (
            <span
              className="flex items-center justify-center rounded-full border-2 border-white shadow-[var(--cp-shadow)]"
              style={{
                width: m.active ? 34 : 28,
                height: m.active ? 34 : 28,
                background: m.fg ?? "var(--cp-accent)",
                color: "#ffffff",
              }}
            >
              {Icon ? <Icon size={m.active ? 17 : 14} weight="fill" /> : <MapPin size={14} weight="fill" />}
            </span>
          );

        const node = (
          <span className="flex flex-col items-center">
            {content}
            {m.label && (
              <span className="mt-1 max-w-[112px] truncate rounded-[6px] bg-[var(--cp-surface)] px-1.5 py-[2px] text-[10px] font-semibold text-[var(--cp-ink)] shadow-[var(--cp-shadow)]">
                {m.label}
              </span>
            )}
          </span>
        );

        const style = { ...at(m.point), zIndex: m.active ? 12 : 10 };

        return m.onClick ? (
          <button
            key={m.id}
            type="button"
            onClick={m.onClick}
            aria-label={m.label ?? "지도 마커"}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95"
            style={style}
          >
            {node}
          </button>
        ) : (
          <span
            key={m.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={style}
          >
            {node}
          </span>
        );
      })}

      {/* QR 스캔 지점 — 항상 지도 위 기준점 */}
      {showQrPin && (
        <span
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={at(qrPoint)}
        >
          <span className="flex flex-col items-center">
            <span className="cp-pulse relative block h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[var(--cp-accent)] text-[var(--cp-accent)] shadow-[var(--cp-shadow)]" />
            {qrLabel && (
              <span className="mt-1.5 flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--cp-ink)] px-2 py-[3px] text-[10px] font-semibold text-white">
                <NavigationArrow size={10} weight="fill" />
                {qrLabel}
              </span>
            )}
          </span>
        </span>
      )}

      {children}
    </div>
  );
}
