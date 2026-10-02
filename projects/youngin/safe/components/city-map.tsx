"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYER_POSITION, ROUTE_PATH } from "@/projects/youngin/safe/lib/mission-data";
import type { Facility, FacilityKind } from "@/projects/youngin/safe/lib/types";

/*
 * 용인 처인구 김량장동 일대를 벡터로 옮긴 게임 맵.
 * 실제 지형을 측량한 것이 아니라, 금학로/중부대로/경안천의 관계와 시청, 중앙시장,
 * 행정복지센터, 초등학교의 상대 위치를 유지한 스타일라이즈드 맵이다.
 *
 * 좌표계는 viewBox 0 0 393 300 하나로 고정한다. 이 비율은 게임 화면에서 HUD와 액션 패널을
 * 뺀 실제 지도 밴드(393 x 약 300)에 맞춘 값이라 slice로 잘려 나가는 영역이 거의 없다.
 * 밴드보다 세로가 길어지면 핀이 잘리므로, 액션 패널 높이를 바꿀 때 이 값도 같이 본다.
 */

const VIEW_W = 393;
const VIEW_H = 300;

/** 건물 블록 [x, y, w, h, tone]. tone 0/1은 밀도 차이, 2는 랜드마크 건물. */
const BLOCKS: [number, number, number, number, number][] = [
  [8, 8, 70, 40, 0],
  [110, 3, 44, 44, 1],
  [176, 9, 54, 38, 0],
  [262, 14, 36, 33, 1],
  [10, 72, 72, 40, 1],
  [108, 75, 48, 39, 0],
  [178, 74, 52, 42, 1],
  [262, 77, 40, 38, 0],
  [108, 135, 50, 46, 1],
  [176, 134, 56, 48, 0],
  [262, 126, 46, 56, 2],
  [8, 209, 76, 38, 1],
  [110, 207, 48, 40, 0],
  [176, 206, 54, 42, 2],
  [262, 207, 36, 38, 1],
  [8, 267, 78, 45, 0],
  [110, 264, 48, 48, 1],
  [180, 269, 50, 44, 0],
  [264, 267, 36, 42, 1],
  [8, 321, 74, 30, 1],
  [110, 321, 50, 30, 0],
  [180, 321, 52, 30, 1],
];

const BLOCK_FILL = ["var(--sf-map-block)", "var(--sf-map-block-alt)", "#2c4539"];

const ROADS_MAJOR = [
  "M-40 200 L150 195 L300 189 L433 188",
  "M244 -40 L250 113 L246 195 L240 370",
];

const ROADS_MINOR = [
  "M96 -40 L100 370",
  "M168 183 L172 370",
  "M306 189 L312 370",
  "M-40 126 L244 122",
  "M96 258 L433 252",
  "M-40 65 L200 60 L340 69",
  "M-40 285 L120 279 L250 294 L433 288",
];

const KIND_STYLE: Record<FacilityKind, { fill: string; ring: string }> = {
  aed: { fill: "#34c48a", ring: "rgba(52,196,138,0.22)" },
  heatShelter: { fill: "#e0a03c", ring: "rgba(224,160,60,0.2)" },
  coldShelter: { fill: "#6ba8d8", ring: "rgba(107,168,216,0.2)" },
  evacuation: { fill: "#b9c4cd", ring: "rgba(185,196,205,0.18)" },
};

function Glyph({ kind }: { kind: FacilityKind }) {
  if (kind === "aed") {
    /* 번개. AED 표지의 심장 + 번개에서 번개만 남겼다. */
    return <path d="M1.6 0.2 L-2.6 5.4 L-0.2 5.4 L-1.2 9.6 L2.8 4.2 L0.4 4.2 Z" fill="#0b1a14" />;
  }
  if (kind === "heatShelter") {
    return (
      <g stroke="#231703" strokeWidth="1.1" strokeLinecap="round">
        <circle cx="0" cy="4.6" r="2" fill="#231703" stroke="none" />
        <path d="M0 0.6 V1.7 M0 7.5 V8.6 M-4 4.6 H-2.9 M2.9 4.6 H4 M-2.8 1.8 L-2 2.6 M2 6.6 L2.8 7.4 M2.8 1.8 L2 2.6 M-2 6.6 L-2.8 7.4" />
      </g>
    );
  }
  if (kind === "coldShelter") {
    return (
      <g stroke="#0b1c26" strokeWidth="1.1" strokeLinecap="round">
        <path d="M0 0.6 V8.6 M-3.4 2.6 L3.4 6.6 M3.4 2.6 L-3.4 6.6" />
      </g>
    );
  }
  return (
    <path
      d="M-3.6 4.6 L0 1 L3.6 4.6 V8.6 H-3.6 Z"
      fill="none"
      stroke="#101a20"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

function FacilityPin({
  facility,
  selected,
  dimmed,
  onSelect,
}: {
  facility: Facility;
  selected: boolean;
  dimmed: boolean;
  onSelect?: (id: string) => void;
}) {
  const style = KIND_STYLE[facility.kind];
  const interactive = Boolean(onSelect && facility.selectable);
  const r = facility.selectable ? 12 : 9;

  return (
    <g
      transform={`translate(${facility.x} ${facility.y})`}
      opacity={dimmed ? 0.4 : 1}
      onClick={interactive ? () => onSelect?.(facility.id) : undefined}
      style={{ cursor: interactive ? "pointer" : "default" }}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `${facility.name} 선택` : undefined}
    >
      {selected && <circle r={r + 9} fill={style.ring} />}
      <circle r={r + 3} fill="var(--sf-deep)" opacity={0.85} />
      <circle
        r={r}
        fill={style.fill}
        stroke={selected ? "#ffffff" : "rgba(255,255,255,0.28)"}
        strokeWidth={selected ? 2 : 1}
      />
      <g transform="translate(0 -4.6)">
        <Glyph kind={facility.kind} />
      </g>
      {interactive && <circle r={24} fill="transparent" />}
    </g>
  );
}

export function CityMap({
  facilities,
  selectedId,
  onSelect,
  showRoute = false,
  routeProgress = 0,
  showPlayer = true,
  focusKind,
}: {
  facilities: Facility[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  showRoute?: boolean;
  routeProgress?: number;
  showPlayer?: boolean;
  /** 이 종류만 또렷하게 보이고 나머지는 맵 컨텍스트로 흐려진다. */
  focusKind?: FacilityKind;
}) {
  const routeRef = useRef<SVGPathElement>(null);
  const [traveler, setTraveler] = useState(PLAYER_POSITION);

  useEffect(() => {
    const path = routeRef.current;
    if (!path || !showRoute) {
      setTraveler(PLAYER_POSITION);
      return;
    }
    const total = path.getTotalLength();
    const point = path.getPointAtLength(total * Math.min(1, Math.max(0, routeProgress)));
    setTraveler({ x: point.x, y: point.y });
  }, [routeProgress, showRoute]);

  const markerAt = showRoute ? traveler : PLAYER_POSITION;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="용인시 처인구 김량장동 일대 안전시설 지도"
    >
      <defs>
        <linearGradient id="sf-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c3a49" />
          <stop offset="100%" stopColor="#16303c" />
        </linearGradient>
        <radialGradient id="sf-vignette" cx="50%" cy="46%" r="74%">
          <stop offset="52%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.46)" />
        </radialGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill="var(--sf-map-land)" />

      {/* 경안천 */}
      <path
        d="M336 -40 C328 53 370 99 350 161 C332 215 378 252 364 370 L433 370 L433 -40 Z"
        fill="url(#sf-water)"
      />
      <path
        d="M336 -40 C328 53 370 99 350 161 C332 215 378 252 364 370"
        fill="none"
        stroke="rgba(120,190,215,0.22)"
        strokeWidth="1"
      />

      {/* 김량장근린공원 + 용인초등학교 운동장 */}
      <rect x="8" y="132" width="74" height="50" rx="9" fill="var(--sf-map-park)" />
      <rect x="278" y="212" width="66" height="41" rx="8" fill="var(--sf-map-park)" />
      <ellipse
        cx="311"
        cy="232"
        rx="20"
        ry="10"
        fill="none"
        stroke="rgba(140,190,160,0.3)"
        strokeWidth="1.2"
      />

      {/* 도로 */}
      {ROADS_MINOR.map((d) => (
        <path
          key={d}
          d={d}
          stroke="var(--sf-map-road)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {ROADS_MAJOR.map((d) => (
        <g key={d}>
          <path
            d={d}
            stroke="var(--sf-map-road-major)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={d}
            stroke="rgba(190,215,200,0.16)"
            strokeWidth="1"
            strokeDasharray="6 8"
            fill="none"
          />
        </g>
      ))}

      {/* 건물 블록. 그림자 사각형을 살짝 밀어 2.5D 두께를 준다. */}
      {BLOCKS.map(([x, y, w, h, tone]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 2} y={y + 3} width={w} height={h} rx={tone === 2 ? 6 : 3} fill="#0e1814" />
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={tone === 2 ? 6 : 3}
            fill={BLOCK_FILL[tone]}
            stroke={tone === 2 ? "rgba(120,200,165,0.24)" : "rgba(255,255,255,0.04)"}
            strokeWidth="1"
          />
        </g>
      ))}

      {/* 지물 이름 */}
      <text x="45" y="160" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(140,190,160,0.7)">
        김량장근린공원
      </text>
      <text x="56" y="191" fontSize="9" fontWeight="600" fill="rgba(160,190,175,0.55)">
        금학로
      </text>
      <text
        x="236"
        y="86"
        fontSize="9"
        fontWeight="600"
        fill="rgba(160,190,175,0.55)"
        transform="rotate(-88 236 86)"
        textAnchor="middle"
      >
        중부대로
      </text>
      <text
        x="356"
        y="118"
        fontSize="9"
        fontWeight="600"
        fill="rgba(140,195,215,0.65)"
        transform="rotate(78 356 118)"
        textAnchor="middle"
      >
        경안천
      </text>
      <text x="203" y="232" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="rgba(200,215,205,0.6)">
        용인중앙시장
      </text>

      {/* 경로. 진행 위치를 재기 위해 보이지 않는 기준 path를 따로 둔다. */}
      <path ref={routeRef} d={ROUTE_PATH} fill="none" stroke="transparent" strokeWidth="1" />
      {showRoute && (
        <>
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke="rgba(52,196,138,0.22)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="sf-route-flow"
            d={ROUTE_PATH}
            fill="none"
            stroke="var(--sf-accent-bright)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* 시설 핀 */}
      {facilities.map((f) => (
        <FacilityPin
          key={f.id}
          facility={f}
          selected={selectedId === f.id}
          dimmed={Boolean(focusKind) && f.kind !== focusKind}
          onSelect={onSelect}
        />
      ))}
      {/* 라벨은 지도 아래쪽 핀일수록 위로 올려 단다. 아래에 달면 범례 스트립에 가린다. */}
      {facilities.map((f) => (
        <text
          key={`${f.id}-label`}
          x={f.x}
          y={f.y > 200 ? f.y - 18 : f.y + (f.selectable ? 26 : 22)}
          textAnchor="middle"
          fontSize={f.selectable ? 10 : 9}
          fontWeight={f.selectable ? 700 : 500}
          fill={f.selectable ? "var(--sf-on-dark)" : "rgba(143,167,156,0.9)"}
          opacity={Boolean(focusKind) && f.kind !== focusKind ? 0.4 : 1}
          style={{ paintOrder: "stroke", stroke: "var(--sf-deep)", strokeWidth: 3.5 }}
        >
          {f.mapLabel}
        </text>
      ))}

      {/* 현재 위치 */}
      {showPlayer && (
        <g transform={`translate(${markerAt.x} ${markerAt.y})`}>
          <circle className="sf-ping" r="9" fill="rgba(255,255,255,0.5)" />
          <circle r="8" fill="rgba(255,255,255,0.16)" />
          <circle r="5.5" fill="#ffffff" stroke="var(--sf-deep)" strokeWidth="2" />
        </g>
      )}

      <rect width={VIEW_W} height={VIEW_H} fill="url(#sf-vignette)" pointerEvents="none" />
    </svg>
  );
}
