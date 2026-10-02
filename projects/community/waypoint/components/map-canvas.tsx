"use client";

import type { ReactNode } from "react";
import { Briefcase, House, MapPinLine } from "@phosphor-icons/react";

/* 아키타입 A4(맵 캔버스)의 지도 표면.

   워크스페이스 규칙대로 지도 라이브러리를 쓰지 않고 SVG로 직접 그린다(차트와 같은 원칙).
   목표는 실제 지리 정확도가 아니라 "집과 직장 사이의 동선 위에 매물이 흩어져 있다"는
   제품 개념이 한눈에 읽히는 것이다.

   뷰박스는 PhoneFrame 화면과 정확히 같은 393×852를 쓴다. 1:1로 매핑되므로 어떤 시트
   단계에서도 지도가 잘리거나 늘어나지 않는다. 대신 동선과 핀은 **y 150~400 구간**에
   모아 둔다 — 시트가 `half`(상단 426px)일 때 집과 직장 양 끝이 모두 보여야 듀오톤이
   뜻을 갖기 때문이다. 시트를 `peek`으로 내리면 아래쪽 도시 조직이 더 드러난다.

   핀 위치는 lib/mock-data의 값이 아니라 이 파일이 소유한 고정 좌표표(PIN_SLOTS)에서
   가져온다 — 매물 순서가 바뀌어도 지도가 흔들리지 않게 하기 위해서다. */

export const MAP_VIEW = { w: 393, h: 852 };

/* 집(좌상단) → 직장(우하단)으로 흐르는 동선. 듀오톤 두 색이 이 선의 양 끝이다.
   시트 half 단계(상단 426px) 안에 양 끝이 들어오도록 y를 158~392로 잡았다. */
export const ROUTE_PATH =
  "M 62 168 C 104 196, 124 224, 138 258 C 154 296, 188 314, 224 330 C 262 340, 294 356, 320 372";

export const HOME_POINT = { x: 62, y: 168 };
export const WORK_POINT = { x: 320, y: 372 };

/* 매물 핀이 앉는 고정 슬롯. 동선을 따라 흩어지되 서로 겹치지 않게 손으로 배치했다. */
export const PIN_SLOTS: { x: number; y: number }[] = [
  { x: 126, y: 202 },
  { x: 232, y: 244 },
  { x: 74, y: 252 },
  { x: 306, y: 284 },
  { x: 170, y: 300 },
  { x: 268, y: 356 },
  { x: 96, y: 340 },
  { x: 208, y: 396 },
  { x: 330, y: 218 },
  { x: 148, y: 372 },
];

/* 웨이스팟(안전 거래 장소) 마커 슬롯. 매물 핀과 다른 형태라 겹쳐도 구분된다. */
export const SPOT_SLOTS: { x: number; y: number }[] = [
  { x: 104, y: 224 },
  { x: 196, y: 318 },
  { x: 274, y: 322 },
  { x: 258, y: 412 },
];

/** SVG 베이스맵. 블록, 도로, 하천, 공원만으로 도시 조직을 표현한다. */
function BaseMap() {
  const blocks = [
    [14, 26, 88, 74], [124, 18, 70, 56], [212, 34, 92, 66], [322, 24, 62, 82],
    [18, 128, 70, 82], [126, 106, 56, 74], [222, 118, 82, 62], [330, 128, 56, 68],
    [16, 244, 62, 70], [230, 220, 62, 66], [318, 236, 66, 58],
    [22, 340, 74, 62], [188, 344, 58, 60], [292, 348, 82, 52],
    [26, 452, 84, 70], [148, 448, 76, 74], [268, 462, 92, 58],
    [20, 566, 92, 66], [156, 574, 68, 58], [286, 560, 84, 72],
    [30, 676, 76, 62], [172, 668, 88, 70], [300, 684, 70, 54],
    [24, 784, 96, 50], [186, 790, 74, 46], [296, 776, 82, 58],
  ];
  const roadsH = [16, 100, 214, 330, 440, 552, 660, 768];
  const roadsV = [110, 202, 306];

  return (
    <g aria-hidden>
      <rect width={MAP_VIEW.w} height={MAP_VIEW.h} fill="var(--wp-map-land)" />

      {/* 하천 — 지도에 방향감을 주는 유일한 곡선 요소 */}
      <path
        d="M -10 496 C 70 476, 120 524, 200 508 C 268 494, 320 536, 403 520 L 403 558 C 320 574, 268 532, 200 546 C 120 562, 70 514, -10 534 Z"
        fill="var(--wp-map-water)"
        opacity="0.85"
      />
      {/* 공원 */}
      <rect x="112" y="238" width="60" height="76" rx="10" fill="var(--wp-map-park)" />
      <rect x="316" y="616" width="66" height="58" rx="10" fill="var(--wp-map-park)" />

      {roadsH.map((y) => (
        <rect key={`h${y}`} x="0" y={y} width={MAP_VIEW.w} height="9" fill="var(--wp-map-road)" />
      ))}
      {roadsV.map((x) => (
        <rect key={`v${x}`} x={x} y="0" width="9" height={MAP_VIEW.h} fill="var(--wp-map-road)" />
      ))}
      <rect x="0" y="330" width={MAP_VIEW.w} height="13" fill="var(--wp-map-road-major)" />
      <rect x="202" y="0" width="13" height={MAP_VIEW.h} fill="var(--wp-map-road-major)" />

      {blocks.map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="4"
          fill={i % 3 === 0 ? "var(--wp-map-block-alt)" : "var(--wp-map-block)"}
        />
      ))}
    </g>
  );
}

/** 동선 폴리라인. 듀오톤 두 색을 잇는 그라디언트로 출발과 도착을 표현한다. */
function RouteLine() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="wp-route" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--wp-accent)" />
          <stop offset="100%" stopColor="var(--wp-accent-2)" />
        </linearGradient>
      </defs>
      <path d={ROUTE_PATH} fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="url(#wp-route)"
        strokeWidth="4"
        strokeLinecap="round"
        className="wp-route-draw"
      />
    </g>
  );
}

/** 집 / 직장 앵커. 듀오톤이 의미를 갖는 지점이라 아이콘까지 다르게 둔다. */
function Anchor({
  x,
  y,
  kind,
  label,
}: {
  x: number;
  y: number;
  kind: "home" | "work";
  label: string;
}) {
  const color = kind === "home" ? "var(--wp-accent)" : "var(--wp-accent-2)";
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="17" fill="#ffffff" />
      <circle r="14" fill={color} />
      <foreignObject x="-8" y="-8" width="16" height="16">
        <span className="flex h-4 w-4 items-center justify-center text-white">
          {kind === "home" ? <House size={11} weight="fill" /> : <Briefcase size={11} weight="fill" />}
        </span>
      </foreignObject>
      <foreignObject x="-46" y="20" width="92" height="20">
        <span className="flex justify-center">
          <span
            className="rounded-full bg-white px-2 py-[3px] text-[10.5px] font-semibold"
            style={{ color, boxShadow: "var(--wp-shadow)" }}
          >
            {label}
          </span>
        </span>
      </foreignObject>
    </g>
  );
}

/** 현재 위치. 화면당 하나뿐인 무한 루프 모션이 여기 붙는다. */
function HerePuck({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden>
      <circle r="11" fill="var(--wp-accent)" className="wp-here" opacity="0.35" />
      <circle r="7" fill="#ffffff" />
      <circle r="5" fill="var(--wp-accent)" />
    </g>
  );
}

export function MapCanvas({
  pins,
  spots,
  homeLabel,
  workLabel,
  overlay,
}: {
  /** 매물 가격 핀. 지도 위에서 값을 읽는 것이 A4의 목적이므로 가격을 그대로 노출한다. */
  pins: { id: string; price: string; active: boolean; onSelect: () => void }[];
  spots: { id: string; name: string }[];
  homeLabel: string;
  workLabel: string;
  /** 지도 위에 얹히는 플로팅 컨트롤 (필터 칩 등) */
  overlay?: ReactNode;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--wp-map-land)]">
      <svg
        viewBox={`0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={`${homeLabel}에서 ${workLabel}까지의 동선 지도`}
      >
        <BaseMap />
        <RouteLine />

        {spots.slice(0, SPOT_SLOTS.length).map((spot, i) => (
          <g key={spot.id} transform={`translate(${SPOT_SLOTS[i].x} ${SPOT_SLOTS[i].y})`}>
            <circle r="11" fill="#ffffff" />
            <circle r="9" fill="var(--wp-accent-2-soft)" stroke="var(--wp-accent-2)" strokeWidth="1.5" />
            <foreignObject x="-6" y="-6" width="12" height="12">
              <span className="flex h-3 w-3 items-center justify-center text-[var(--wp-accent-2-ink)]">
                <MapPinLine size={9} weight="fill" />
              </span>
            </foreignObject>
          </g>
        ))}

        <Anchor x={HOME_POINT.x} y={HOME_POINT.y} kind="home" label={homeLabel} />
        <Anchor x={WORK_POINT.x} y={WORK_POINT.y} kind="work" label={workLabel} />
        <HerePuck x={138} y={258} />
      </svg>

      {/* 가격 핀은 SVG 밖에 두어 터치 타깃과 타이포를 일반 DOM으로 다룬다. */}
      <div className="pointer-events-none absolute inset-0">
        {pins.slice(0, PIN_SLOTS.length).map((pin, i) => {
          const slot = PIN_SLOTS[i];
          return (
            <button
              key={pin.id}
              type="button"
              onClick={pin.onSelect}
              style={{
                left: `${(slot.x / MAP_VIEW.w) * 100}%`,
                top: `${(slot.y / MAP_VIEW.h) * 100}%`,
                animationDelay: `${i * 45}ms`,
              }}
              className={`wp-pin-drop pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-bold tabular-nums transition-colors ${
                pin.active
                  ? "bg-[var(--wp-ink)] text-white"
                  : "bg-white text-[var(--wp-accent-ink)]"
              }`}
              aria-pressed={pin.active}
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ boxShadow: "var(--wp-shadow)" }}
                aria-hidden
              />
              <span className="relative">{pin.price}</span>
            </button>
          );
        })}
      </div>

      {overlay}
    </div>
  );
}
