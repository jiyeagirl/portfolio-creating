"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { FACILITY_ICON } from "@/projects/youngin/festival/lib/mock-data";
import type { Facility, FacilityCategory } from "@/projects/youngin/festival/lib/types";
import {
  CURRENT_POSITION,
  INITIAL_PAN,
  MAP_INK,
  MAP_VIEWBOX,
  ZONES,
  ZOOM,
} from "@/projects/youngin/festival/lib/venue";

/* 직접 그린 SVG 부지도. 항공사진 위에 핀을 얹으면 사진과 핀 위치가 실제로 맞지 않아
   어색해지므로 지면을 그린다 (design.md "행사장 지도"). 확대/축소와 이동은 transform만
   건드리고 width/height/top/left는 애니메이션하지 않는다. */

/** 지면 레이어의 기준 픽셀 크기. viewBox 720×980의 비율을 유지한다. */
const BASE_W = 520;
const BASE_H = Math.round((BASE_W * MAP_VIEWBOX.h) / MAP_VIEWBOX.w);

const PIN_COLOR: Record<FacilityCategory, string> = {
  program: "var(--fs-cat-program)",
  convenience: "var(--fs-cat-conv)",
  safety: "var(--fs-cat-safety)",
};

function VenueGround() {
  const tree = (cx: number, cy: number, r: number) => (
    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={MAP_INK.forestDeep} />
  );

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
      width={BASE_W}
      height={BASE_H}
      role="img"
      aria-label="포은문화제 행사장 부지도"
      className="block select-none"
    >
      {/* 바닥 */}
      <rect x="0" y="0" width="720" height="980" fill={MAP_INK.ground} />

      {/* 경안천 (동측) */}
      <path
        d="M720 0 L720 980 L646 980 C 616 858 700 726 650 604 C 604 492 692 384 648 254 C 614 152 702 72 672 0 Z"
        fill={MAP_INK.water}
      />
      <path
        d="M672 0 C 702 72 614 152 648 254 C 692 384 604 492 650 604 C 700 726 616 858 646 980"
        fill="none"
        stroke={MAP_INK.waterEdge}
        strokeWidth="3"
      />

      {/* 북측 숲 */}
      <path
        d="M0 0 H668 C 656 96 606 158 556 214 C 496 252 380 268 258 258 C 152 249 62 216 0 238 Z"
        fill={MAP_INK.forest}
      />
      {[
        [46, 52, 21],
        [104, 116, 17],
        [166, 46, 24],
        [232, 118, 16],
        [96, 196, 19],
        [522, 60, 22],
        [578, 132, 18],
        [604, 44, 15],
        [498, 176, 17],
        [438, 226, 14],
        [176, 214, 15],
        [268, 62, 16],
      ].map(([cx, cy, r]) => tree(cx, cy, r))}

      {/* 묘역 언덕 (E) */}
      <ellipse cx="355" cy="140" rx="128" ry="84" fill={MAP_INK.forestDeep} />
      <ellipse cx="355" cy="140" rx="82" ry="52" fill={MAP_INK.lawnDeep} />
      <rect x="330" y="118" width="50" height="42" rx="6" fill={MAP_INK.roof} />
      <path d="M326 120 L355 100 L384 120 Z" fill={MAP_INK.outline} />

      {/* 어울마당 잔디 (A) */}
      <rect x="130" y="430" width="430" height="212" rx="26" fill={MAP_INK.lawn} />
      {[476, 522, 568, 614].map((y) => (
        <line
          key={y}
          x1="146"
          y1={y}
          x2="544"
          y2={y}
          stroke={MAP_INK.lawnDeep}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      {/* 메인무대 */}
      <rect x="256" y="434" width="178" height="52" rx="8" fill={MAP_INK.roof} />
      <path
        d="M248 434 C 300 404 390 404 442 434 Z"
        fill={MAP_INK.outline}
        opacity="0.55"
      />
      <line x1="272" y1="446" x2="418" y2="446" stroke={MAP_INK.outline} strokeWidth="3" />

      {/* 전시마당 (D) */}
      <rect x="428" y="266" width="204" height="156" rx="18" fill={MAP_INK.plaza} />
      {[
        [462, 300],
        [530, 300],
        [598, 300],
        [462, 372],
        [530, 372],
        [598, 372],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <path
            d={`M${cx - 26} ${cy + 20} L${cx} ${cy - 16} L${cx + 26} ${cy + 20} Z`}
            fill={MAP_INK.roof}
          />
          <line
            x1={cx - 26}
            y1={cy + 20}
            x2={cx + 26}
            y2={cy + 20}
            stroke={MAP_INK.outline}
            strokeWidth="3"
          />
        </g>
      ))}

      {/* 포은아트홀 */}
      <rect x="56" y="266" width="190" height="134" rx="10" fill={MAP_INK.building} />
      <rect x="56" y="266" width="190" height="26" rx="10" fill={MAP_INK.roof} />
      <rect x="82" y="316" width="46" height="62" rx="4" fill={MAP_INK.roof} opacity="0.7" />
      <rect x="146" y="316" width="72" height="30" rx="4" fill={MAP_INK.roof} opacity="0.55" />

      {/* 전통체험마당 (B) */}
      <rect x="46" y="674" width="236" height="160" rx="18" fill={MAP_INK.plaza} />
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`b-${col}-${row}`}
            x={64 + col * 54}
            y={696 + row * 46}
            width="40"
            height="32"
            rx="5"
            fill={MAP_INK.roof}
            opacity={0.8}
          />
        )),
      )}

      {/* 먹거리장터 (C) */}
      <rect x="336" y="674" width="286" height="160" rx="18" fill={MAP_INK.plaza} />
      {[0, 1, 2, 3, 4].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`c-${col}-${row}`}
            x={352 + col * 54}
            y={696 + row * 46}
            width="40"
            height="32"
            rx="5"
            fill={MAP_INK.roof}
            opacity={0.8}
          />
        )),
      )}

      {/* 임시주차장 (P) */}
      <rect x="86" y="854" width="516" height="108" rx="12" fill={MAP_INK.plaza} />
      {Array.from({ length: 17 }, (_, i) => (
        <line
          key={`slot-${i}`}
          x1={110 + i * 29}
          y1="866"
          x2={110 + i * 29}
          y2="908"
          stroke={MAP_INK.outline}
          strokeWidth="2.5"
          opacity="0.5"
        />
      ))}
      {Array.from({ length: 17 }, (_, i) => (
        <line
          key={`slot-b-${i}`}
          x1={110 + i * 29}
          y1="918"
          x2={110 + i * 29}
          y2="950"
          stroke={MAP_INK.outline}
          strokeWidth="2.5"
          opacity="0.5"
        />
      ))}

      {/* 포장로 */}
      <g strokeLinecap="round" fill="none">
        {[
          { d: "M345 980 L345 648", w: 50 },
          { d: "M200 706 L200 656 L490 656 L490 706", w: 40 },
          { d: "M345 648 L345 632", w: 50 },
          { d: "M240 430 L240 404", w: 34 },
          { d: "M520 430 L520 420", w: 34 },
          { d: "M348 430 C 342 356 356 300 353 232", w: 30 },
        ].map((seg) => (
          <path key={seg.d} d={seg.d} stroke={MAP_INK.roadEdge} strokeWidth={seg.w + 8} />
        ))}
        {[
          { d: "M345 980 L345 648", w: 50 },
          { d: "M200 706 L200 656 L490 656 L490 706", w: 40 },
          { d: "M345 648 L345 632", w: 50 },
          { d: "M240 430 L240 404", w: 34 },
          { d: "M520 430 L520 420", w: 34 },
          { d: "M348 430 C 342 356 356 300 353 232", w: 30 },
        ].map((seg) => (
          <path key={`fill-${seg.d}`} d={seg.d} stroke={MAP_INK.road} strokeWidth={seg.w} />
        ))}
      </g>

      {/* 구역 라벨 */}
      {ZONES.map((zone) => (
        <g key={zone.code}>
          <circle
            cx={zone.x}
            cy={zone.y}
            r="17"
            fill="#ffffff"
            stroke={MAP_INK.outline}
            strokeWidth="1.5"
          />
          <text
            x={zone.x}
            y={zone.y + 6}
            textAnchor="middle"
            fontSize="17"
            fontWeight="700"
            fill={MAP_INK.label}
          >
            {zone.code}
          </text>
          <text
            x={zone.x + 24}
            y={zone.y + 6}
            fontSize="16"
            fontWeight="600"
            fill={MAP_INK.labelSoft}
          >
            {zone.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 현재 위치에서 목적지까지, 포장로를 따라가는 3구간 경로. */
function routePath(target: Facility) {
  const junction = 656;
  return `M${CURRENT_POSITION.x} ${CURRENT_POSITION.y} L${CURRENT_POSITION.x} ${junction} L${target.x} ${junction} L${target.x} ${target.y}`;
}

export function VenueMap({
  facilities,
  selectedId,
  onSelect,
  controlsBottom,
  routeTo,
}: {
  facilities: Facility[];
  selectedId?: string;
  onSelect: (id: string) => void;
  /** 확대 축소 컨트롤이 시트에 가리지 않도록 아래에서 띄우는 px. */
  controlsBottom: number;
  /** 길찾기가 켜진 목적지. 없으면 경로를 그리지 않는다. */
  routeTo?: Facility | null;
}) {
  const [scale, setScale] = useState<number>(ZOOM.initial);
  const [pan, setPan] = useState<{ x: number; y: number }>({ ...INITIAL_PAN });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  const clamp = useCallback((v: number, limit: number) => Math.max(-limit, Math.min(limit, v)), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: pan.x, oy: pan.y };
    moved.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    setPan({ x: clamp(d.ox + dx, 260 * scale), y: clamp(d.oy + dy, 320 * scale) });
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
    setDragging(false);
  };

  const zoom = (dir: 1 | -1) => {
    setScale((s) => Math.min(ZOOM.max, Math.max(ZOOM.min, Number((s + dir * ZOOM.step).toFixed(2)))));
  };

  const recenter = () => {
    setScale(ZOOM.initial);
    setPan({ ...INITIAL_PAN });
  };

  const transform = `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${scale})`;
  /* 핀은 확대해도 크기가 변하지 않아야 읽힌다. 레이어 배율을 핀에서 되돌린다. */
  const pinScale = 1 / scale;

  return (
    <div
      className="absolute inset-0 touch-none overflow-hidden"
      style={{ background: MAP_INK.ground }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: BASE_W,
          height: BASE_H,
          transform,
          transformOrigin: "center center",
          transition: dragging ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <VenueGround />

        {/* 길찾기 경로 */}
        {routeTo && (
          <svg
            viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
            width={BASE_W}
            height={BASE_H}
            className="pointer-events-none absolute left-0 top-0"
            aria-hidden
          >
            <path
              d={routePath(routeTo)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
            <path
              d={routePath(routeTo)}
              fill="none"
              stroke="var(--fs-accent)"
              strokeWidth="7"
              strokeDasharray="18 13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* 현재 위치 */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${(CURRENT_POSITION.x / MAP_VIEWBOX.w) * 100}%`,
            top: `${(CURRENT_POSITION.y / MAP_VIEWBOX.h) * 100}%`,
            transform: `translate(-50%, -50%) scale(${pinScale})`,
          }}
        >
          <span
            className="fs-pulse absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "var(--fs-cat-safety)" }}
          />
          <span
            className="relative block h-4 w-4 rounded-full border-[3px] border-white"
            style={{ background: "var(--fs-cat-safety)" }}
          />
        </div>

        {/* 시설 핀. 필터로 꺼진 핀은 반투명하게 남기지 않고 DOM에서 뺀다. */}
        {facilities.map((f) => {
          const selected = f.id === selectedId;
          return (
            <button
              key={f.id}
              type="button"
              aria-label={f.name}
              aria-pressed={selected}
              onClick={() => {
                if (!moved.current) onSelect(f.id);
              }}
              className="absolute flex h-11 w-11 items-end justify-center"
              style={{
                left: `${(f.x / MAP_VIEWBOX.w) * 100}%`,
                top: `${(f.y / MAP_VIEWBOX.h) * 100}%`,
                transform: `translate(-50%, -100%) scale(${pinScale * (selected ? 1.15 : 1)})`,
                transformOrigin: "bottom center",
                transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                zIndex: selected ? 3 : 2,
              }}
            >
              <span className="relative flex flex-col items-center">
                <span
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white text-white"
                  style={{
                    background: selected ? "var(--fs-accent)" : PIN_COLOR[f.category],
                    boxShadow: selected
                      ? "0 4px 12px -2px rgba(179,51,43,0.45)"
                      : "0 1px 3px rgba(28,26,23,0.28)",
                  }}
                >
                  <Icon icon={FACILITY_ICON[f.kind]} width="16" height="16" />
                </span>
                <span
                  className="-mt-[3px] h-[7px] w-[7px] rotate-45 rounded-[1px] border-b-2 border-r-2 border-white"
                  style={{ background: selected ? "var(--fs-accent)" : PIN_COLOR[f.category] }}
                />
                {selected && (
                  <span
                    className="mt-0.5 whitespace-nowrap rounded-full px-2 py-[3px] text-[10.5px] font-bold text-white"
                    style={{ background: "var(--fs-accent)" }}
                  >
                    {f.name}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 지도 위 떠 있는 컨트롤. 불투명 면만 쓰고 backdrop-blur는 쓰지 않는다. */}
      <div
        className="absolute right-4 z-10 flex flex-col gap-2"
        style={{ bottom: controlsBottom }}
      >
        <div
          className="overflow-hidden rounded-[12px]"
          style={{
            background: "var(--fs-surface)",
            boxShadow: "0 2px 10px -2px rgba(28,26,23,0.18)",
          }}
        >
          <button
            type="button"
            aria-label="확대"
            onClick={() => zoom(1)}
            disabled={scale >= ZOOM.max}
            className="flex h-11 w-11 items-center justify-center text-[var(--fs-ink)] transition-colors disabled:text-[var(--fs-faint)]"
          >
            <Icon icon="solar:add-square-linear" width="21" height="21" />
          </button>
          <div className="h-px w-full" style={{ background: "var(--fs-line-soft)" }} />
          <button
            type="button"
            aria-label="축소"
            onClick={() => zoom(-1)}
            disabled={scale <= ZOOM.min}
            className="flex h-11 w-11 items-center justify-center text-[var(--fs-ink)] transition-colors disabled:text-[var(--fs-faint)]"
          >
            <Icon icon="solar:minus-square-linear" width="21" height="21" />
          </button>
        </div>
        <button
          type="button"
          aria-label="현재 위치로 이동"
          onClick={recenter}
          className="flex h-11 w-11 items-center justify-center rounded-[12px] transition-transform duration-150 active:scale-[0.95]"
          style={{
            background: "var(--fs-surface)",
            color: "var(--fs-cat-safety)",
            boxShadow: "0 2px 10px -2px rgba(28,26,23,0.18)",
          }}
        >
          <Icon icon="solar:gps-bold" width="21" height="21" />
        </button>
      </div>

      {/* 배율 표시 */}
      <div
        className="festival-num absolute left-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{
          bottom: controlsBottom,
          background: "var(--fs-surface)",
          color: "var(--fs-muted)",
          boxShadow: "0 2px 10px -2px rgba(28,26,23,0.18)",
        }}
      >
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
