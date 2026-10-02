"use client";

import { MY_POSITION, STATUS_META } from "@/projects/youngin/street/lib/mock-data";
import type { HazardType, Report } from "@/projects/youngin/street/lib/types";

/*
 * 용인 처인구 김량장동 일대를 벡터로 옮긴 밝은 주간 지도.
 * 실제 측량이 아니라 금학로, 중부대로, 경안천의 관계와 중앙시장, 행정복지센터,
 * 초등학교, 버스터미널의 상대 위치를 유지한 스타일라이즈드 맵이다.
 *
 * 좌표계는 viewBox 0 0 393 852, 즉 기기 화면과 1:1이다. 제보 핀 좌표(lib/mock-data.ts)도
 * 같은 계에서 정의하므로 지도와 데이터가 어긋날 수 없고, 지도 화면에서 잘려 나가는
 * 영역이 없다. 제보 화면의 미니맵은 band prop으로 이 계의 부분 사각형만 잘라 쓴다.
 *
 * 확대는 SVG를 scale하지 않고 viewBox를 좁혀서 한다. 그래야 핀과 라벨의 물리적 크기가
 * 배율과 무관하게 일정해서 손가락으로 누를 수 있다.
 */

const W = 393;
const H = 852;

/** 건물 블록 [x, y, w, h, tone]. tone 0/1은 밀도 차이, 2는 랜드마크 건물. */
const BLOCKS: [number, number, number, number, number][] = [
  [8, 10, 72, 118, 0],
  [108, 10, 50, 118, 1],
  [182, 14, 56, 114, 0],
  [262, 10, 46, 118, 1],
  [332, 16, 26, 106, 0],

  [8, 165, 72, 112, 1],
  [108, 165, 50, 112, 0],
  [182, 205, 56, 100, 2],
  [262, 168, 46, 106, 0],
  [332, 172, 24, 96, 1],

  [108, 305, 50, 110, 0],
  [182, 305, 56, 110, 1],
  [262, 305, 46, 110, 0],

  [8, 445, 72, 100, 0],
  [108, 445, 50, 100, 1],
  [182, 445, 56, 100, 2],
  [262, 445, 46, 100, 1],

  [182, 575, 56, 100, 0],
  [254, 575, 58, 100, 2],

  [8, 705, 72, 70, 1],
  [108, 705, 50, 70, 0],
  [182, 705, 56, 70, 1],
  [262, 705, 46, 70, 0],

  [8, 805, 72, 42, 0],
  [108, 805, 50, 42, 1],
  [182, 805, 56, 42, 0],
  [262, 805, 46, 42, 1],
];

const BLOCK_FILL = [
  "var(--st-map-block)",
  "var(--st-map-block-alt)",
  "var(--st-map-landmark)",
];

const ROADS_MAJOR = [
  /* 금학로 */
  "M-40 432 L150 428 L300 424 L433 426",
  /* 중부대로 */
  "M244 -40 L250 300 L246 560 L240 890",
];

const ROADS_MINOR = [
  "M92 -40 L98 890",
  "M166 -40 L172 890",
  "M316 -40 L322 700",
  "M-40 148 L244 144",
  "M-40 292 L433 286",
  "M-40 562 L433 556",
  "M-40 692 L433 686",
  "M-40 792 L433 788",
];

/* 유형 글리프. 핀 안에서 흰 선으로만 그린다 — 색은 처리 상태가 이미 쓰고 있다. */
function Glyph({ type }: { type: HazardType }) {
  const line = {
    stroke: "#ffffff",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  if (type === "sidewalk") {
    /* 보도블록 두 줄, 오른쪽 아래 한 장이 들려 있다. */
    return (
      <g {...line}>
        <path d="M-5.4 -4 H-0.6 V-1 H-5.4 Z" />
        <path d="M0.6 -4 H5.4 V-1 H0.6 Z" />
        <path d="M-5.4 0.2 H-1.4 V3.2 H-5.4 Z" />
        <path d="M-0.2 1.4 L4.6 0.2 L5.4 3.1 L0.6 4.3 Z" />
      </g>
    );
  }
  if (type === "walkway") {
    /* 울퉁불퉁한 노면 단면. */
    return (
      <g {...line}>
        <path d="M-5.6 1.4 L-2.6 -2.4 L0.2 0.8 L3 -3 L5.6 -0.4" />
        <path d="M-5.6 4.2 H5.6" />
      </g>
    );
  }
  if (type === "mobility") {
    /* 휠체어 바퀴와 등받이. */
    return (
      <g {...line}>
        <circle cx="0.6" cy="1.6" r="3.4" />
        <path d="M-3 -4 H-1.4 V-1 H2.4" />
      </g>
    );
  }
  if (type === "obstruction") {
    /* 쌓인 적치물 더미. */
    return (
      <g {...line}>
        <path d="M-5.4 4 L-3.6 -0.6 H3.6 L5.4 4 Z" />
        <path d="M-1.6 -0.6 L-0.6 -4 H2.4 L3 -0.6" />
      </g>
    );
  }
  if (type === "streetlight") {
    /* 가로등 기둥과 등기구. */
    return (
      <g {...line}>
        <path d="M-1.6 4.4 V-2.6 H1.6" />
        <path d="M1.6 -4.2 H5.2 L4.2 -1.6 H0.6 Z" />
      </g>
    );
  }
  if (type === "schoolzone") {
    /* 어린이보호구역 경고 삼각형. */
    return (
      <g {...line}>
        <path d="M0 -4.4 L5.2 4.2 H-5.2 Z" />
        <path d="M0 -0.6 V1.2" />
        <path d="M0 3 V3.1" />
      </g>
    );
  }
  return (
    <g fill="#ffffff" stroke="none">
      <circle cx="-3.6" cy="0" r="1.2" />
      <circle cx="0" cy="0" r="1.2" />
      <circle cx="3.6" cy="0" r="1.2" />
    </g>
  );
}

function ReportPin({
  report,
  selected,
  onSelect,
}: {
  report: Report;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const ink = STATUS_META[report.status].ink;
  const scale = selected ? 1.25 : 1;

  return (
    <g
      transform={`translate(${report.x} ${report.y}) scale(${scale})`}
      onClick={onSelect ? () => onSelect(report.id) : undefined}
      style={{ cursor: onSelect ? "pointer" : "default", transition: "transform 200ms" }}
      role={onSelect ? "button" : undefined}
      aria-label={onSelect ? `${report.title} 상세 보기` : undefined}
    >
      {/* 핀 꼬리를 먼저 깔아 원 아래로 들어가게 한다. */}
      <path d="M0 15 L-5 6 H5 Z" fill={ink} />
      <circle r="14.5" fill="#ffffff" />
      <circle r="12.5" fill={ink} stroke={selected ? "#ffffff" : "none"} strokeWidth="2" />
      <Glyph type={report.type} />
      {report.mine && (
        <circle cx="10" cy="-10" r="4" fill="var(--st-accent)" stroke="#ffffff" strokeWidth="1.6" />
      )}
      {onSelect && <circle r="24" fill="transparent" />}
    </g>
  );
}

export function CityMap({
  reports,
  selectedId = null,
  onSelect,
  /** 이 계의 부분 사각형만 보여 준다 [x, y, w, h]. 제보 화면 미니맵용. */
  band,
  /** 1 / 1.6 / 2.2. viewBox를 좁혀서 확대한다. */
  zoom = 1,
  /** 확대의 중심. 기본은 내 현재 위치다. */
  center = MY_POSITION,
  showMe = true,
  /** 현재 위치 마커를 찍을 지점. 제보 화면 미니맵은 제보 지점을 넘긴다. */
  mePosition = MY_POSITION,
  showLabels = true,
}: {
  reports: Report[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  band?: [number, number, number, number];
  zoom?: number;
  center?: { x: number; y: number };
  showMe?: boolean;
  mePosition?: { x: number; y: number };
  showLabels?: boolean;
}) {
  let view: [number, number, number, number];
  if (band) {
    view = band;
  } else {
    const vw = W / zoom;
    const vh = H / zoom;
    const vx = Math.min(Math.max(center.x - vw / 2, 0), W - vw);
    const vy = Math.min(Math.max(center.y - vh / 2, 0), H - vh);
    view = [vx, vy, vw, vh];
  }

  return (
    <svg
      viewBox={view.join(" ")}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="용인시 처인구 김량장동 일대 보행 위험 제보 지도"
    >
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="var(--st-map-land)" />

      {/* 경안천 */}
      <path
        d="M360 -40 C352 120 394 250 374 390 C356 530 400 660 386 890 L473 890 L473 -40 Z"
        fill="var(--st-map-water)"
      />

      {/* 김량장근린공원 + 용인초등학교 운동장 */}
      <rect x="8" y="305" width="72" height="110" rx="10" fill="var(--st-map-park)" />
      <rect x="8" y="575" width="150" height="84" rx="10" fill="var(--st-map-park)" />
      <ellipse
        cx="83"
        cy="628"
        rx="44"
        ry="18"
        fill="none"
        stroke="rgba(120,150,110,0.45)"
        strokeWidth="1.4"
      />

      {/* 도로. 케이싱을 먼저 깔고 흰 노면을 덮어 Apple Maps식 2겹 도로를 만든다. */}
      {ROADS_MINOR.map((d) => (
        <path key={`c-${d}`} d={d} stroke="var(--st-map-road-casing)" strokeWidth="12" fill="none" strokeLinecap="round" />
      ))}
      {ROADS_MAJOR.map((d) => (
        <path key={`c-${d}`} d={d} stroke="var(--st-map-road-casing)" strokeWidth="24" fill="none" strokeLinecap="round" />
      ))}
      {ROADS_MINOR.map((d) => (
        <path key={`r-${d}`} d={d} stroke="var(--st-map-road)" strokeWidth="9" fill="none" strokeLinecap="round" />
      ))}
      {ROADS_MAJOR.map((d) => (
        <path key={`r-${d}`} d={d} stroke="var(--st-map-road)" strokeWidth="20" fill="none" strokeLinecap="round" />
      ))}

      {/* 건물 블록 */}
      {BLOCKS.map(([x, y, w, h, tone]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={tone === 2 ? 7 : 4}
          fill={BLOCK_FILL[tone]}
          stroke="rgba(0,0,0,0.045)"
          strokeWidth="1"
        />
      ))}

      {showLabels && (
        <g
          fill="var(--st-map-label)"
          fontWeight="600"
          style={{ paintOrder: "stroke", stroke: "var(--st-map-land)", strokeWidth: 3.5 }}
        >
          <text x="210" y="286" textAnchor="middle" fontSize="11">
            용인공용버스터미널
          </text>
          <text x="44" y="364" textAnchor="middle" fontSize="11">
            김량장근린공원
          </text>
          <text x="210" y="500" textAnchor="middle" fontSize="11.5" fontWeight="700">
            용인중앙시장
          </text>
          <text x="283" y="650" textAnchor="middle" fontSize="10">
            행정복지센터
          </text>
          <text x="83" y="598" textAnchor="middle" fontSize="11">
            용인초등학교
          </text>
          <text x="128" y="422" fontSize="10.5">
            금학로
          </text>
          <text
            x="247"
            y="380"
            fontSize="10.5"
            textAnchor="middle"
            transform="rotate(90 247 380)"
          >
            중부대로
          </text>
          <text
            x="382"
            y="300"
            fontSize="10.5"
            textAnchor="middle"
            fill="#6f93a4"
            transform="rotate(80 382 300)"
            style={{ paintOrder: "stroke", stroke: "var(--st-map-water)", strokeWidth: 3.5 }}
          >
            경안천
          </text>
        </g>
      )}

      {/* 제보 핀. 필터에서 빠진 핀은 흐리지 않고 아예 지운다 — 반투명 핀은 행정 지도에서
          "확인 안 됨"으로 오독된다. 선택된 핀은 마지막에 그려 위로 올린다. */}
      {reports
        .filter((r) => r.id !== selectedId)
        .map((r) => (
          <ReportPin key={r.id} report={r} selected={false} onSelect={onSelect} />
        ))}
      {reports
        .filter((r) => r.id === selectedId)
        .map((r) => (
          <ReportPin key={r.id} report={r} selected onSelect={onSelect} />
        ))}

      {/* 내 현재 위치 */}
      {showMe && (
        <g transform={`translate(${mePosition.x} ${mePosition.y})`}>
          <circle className="st-ping" r="9" fill="var(--st-accent)" opacity="0.35" />
          <circle r="9" fill="var(--st-accent)" opacity="0.18" />
          <circle r="5.5" fill="var(--st-accent)" stroke="#ffffff" strokeWidth="2.2" />
        </g>
      )}
    </svg>
  );
}
