"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, CaretLeft, CaretRight, CaretUp, CornersOut, MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { BLD, FLOOR_NAME } from "@/projects/platform/drawqty/lib/plan-data";
import { CONFIDENCE_COLOR } from "@/projects/platform/drawqty/components/site/ui";
import type { Confidence, FloorId, PlanItem, SlabItem, WallItem } from "@/projects/platform/drawqty/lib/types";

/* 평면도를 SVG로 그린 목업. 외벽 구간은 굵은 선, 슬래브 구획은 해치 면. 색은 인식 신뢰도. */

const S = 11; /* 1m = 11 단위 */
const OX = 58;
const OY = 46;
const OFF = 6;
const VB_W = 700;
const VB_H = 392;
const ZOOMS = [1, 1.5, 2, 2.6];

const CONFS: Confidence[] = ["높음", "확인 필요", "수동 수정됨"];

function wallPoints(w: WallItem) {
  const bw = BLD.w * S;
  const bd = BLD.d * S;
  switch (w.side) {
    case "N":
      return { x1: OX + w.from * S, y1: OY - OFF, x2: OX + w.to * S, y2: OY - OFF };
    case "S":
      return { x1: OX + w.from * S, y1: OY + bd + OFF, x2: OX + w.to * S, y2: OY + bd + OFF };
    case "W":
      return { x1: OX - OFF, y1: OY + w.from * S, x2: OX - OFF, y2: OY + w.to * S };
    default:
      return { x1: OX + bw + OFF, y1: OY + w.from * S, x2: OX + bw + OFF, y2: OY + w.to * S };
  }
}

export function PlanViewer({
  floor,
  items,
  selectedId,
  onSelect,
  fileName,
  showControls = true,
  showValues = true,
}: {
  floor: FloorId;
  items: PlanItem[];
  selectedId: string | null;
  onSelect?: (id: string | null) => void;
  fileName?: string;
  showControls?: boolean;
  showValues?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(640);
  const [zoomIdx, setZoomIdx] = useState(0);
  const [center, setCenter] = useState({ x: VB_W / 2, y: VB_H / 2 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const zoom = ZOOMS[zoomIdx];
  const vw = VB_W / zoom;
  const vh = VB_H / zoom;
  const cx = Math.min(Math.max(center.x, vw / 2), VB_W - vw / 2);
  const cy = Math.min(Math.max(center.y, vh / 2), VB_H - vh / 2);
  const scale = boxW / vw; /* 도면 단위 1이 화면 몇 px인가 */
  const px = (n: number) => n / scale;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth || 640));
    ro.observe(el);
    setBoxW(el.clientWidth || 640);
    return () => ro.disconnect();
  }, []);

  function pan(dx: number, dy: number) {
    setCenter({ x: cx + dx * (vw / 4), y: cy + dy * (vh / 4) });
  }

  const walls = items.filter((i): i is WallItem => i.kind === "wall");
  const slabs = items.filter((i): i is SlabItem => i.kind === "slab");
  const dim = selectedId !== null;

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--dq-line)] bg-[var(--dq-paper)]">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[var(--dq-line)] bg-[var(--dq-surface)] px-3.5 py-2 text-[12px] text-[var(--dq-ink-2)]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[13px] font-semibold text-[var(--dq-ink)]">{FLOOR_NAME[floor]} 평면도</span>
          {fileName && <span className="hidden min-w-0 max-w-[260px] truncate sm:block">{fileName}</span>}
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {CONFS.map((c) => (
            <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CONFIDENCE_COLOR[c] }} />
              {c}
            </span>
          ))}
        </span>
      </div>
      <div ref={boxRef} className="relative aspect-[700/392] w-full">
      <svg
        viewBox={`${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`}
        className={`block h-full w-full select-none ${zoom > 1 ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
        role="img"
        aria-label={`${FLOOR_NAME[floor]} 평면도 인식 결과`}
        onPointerDown={(e) => {
          if (zoom <= 1) return;
          drag.current = { x: e.clientX, y: e.clientY };
          (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const k = 1 / scale;
          setCenter({ x: cx - (e.clientX - drag.current.x) * k, y: cy - (e.clientY - drag.current.y) * k });
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onClick={() => onSelect?.(null)}
      >
        <defs>
          {CONFS.map((c) => (
            <g key={c}>
              <pattern id={`${uid}-rc-${CONFS.indexOf(c)}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" stroke={CONFIDENCE_COLOR[c]} strokeWidth="1.6" opacity="0.38" />
              </pattern>
              <pattern id={`${uid}-deck-${CONFS.indexOf(c)}`} width="9" height="9" patternUnits="userSpaceOnUse">
                <path d="M0 4.5H9M4.5 0V9" stroke={CONFIDENCE_COLOR[c]} strokeWidth="1" opacity="0.34" fill="none" />
              </pattern>
            </g>
          ))}
        </defs>

        <rect x="0" y="0" width={VB_W} height={VB_H} fill="var(--dq-paper)" />

        {/* 구조 그리드와 축 번호 */}
        {[0, 23, 46].map((m, i) => (
          <g key={`gx${m}`}>
            <line x1={OX + m * S} y1={OY - 24} x2={OX + m * S} y2={OY + BLD.d * S + 30} stroke="var(--dq-grid)" strokeWidth="0.8" strokeDasharray="6 4" />
            <circle cx={OX + m * S} cy={14} r={px(10)} fill="var(--dq-surface)" stroke="var(--dq-line-strong)" strokeWidth="0.8" />
            <text x={OX + m * S} y={14} textAnchor="middle" dominantBaseline="central" fontSize={px(11)} fill="var(--dq-ink-3)">
              {i + 1}
            </text>
          </g>
        ))}
        {[0, 12.6, 25.2].map((m, i) => (
          <g key={`gy${m}`}>
            <line x1={OX - 30} y1={OY + m * S} x2={OX + BLD.w * S + 30} y2={OY + m * S} stroke="var(--dq-grid)" strokeWidth="0.8" strokeDasharray="6 4" />
            <circle cx={22} cy={OY + m * S} r={px(10)} fill="var(--dq-surface)" stroke="var(--dq-line-strong)" strokeWidth="0.8" />
            <text x={22} y={OY + m * S} textAnchor="middle" dominantBaseline="central" fontSize={px(11)} fill="var(--dq-ink-3)">
              {["가", "나", "다"][i]}
            </text>
          </g>
        ))}

        {/* 슬래브 구획 */}
        {slabs.map((s) => {
          const ci = CONFS.indexOf(s.confidence);
          const color = CONFIDENCE_COLOR[s.confidence];
          const x = OX + s.rect.x * S;
          const y = OY + s.rect.y * S;
          const w = s.rect.w * S;
          const h = s.rect.h * S;
          const active = selectedId === s.id;
          const wide = w * scale >= 96;
          const letter = s.label.replace("슬래브 ", "");
          return (
            <g
              key={s.id}
              className="dq-seg cursor-pointer"
              opacity={dim && !active ? 0.42 : 1}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(s.id);
              }}
            >
              <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.06" />
              <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-${s.slabType === "RC" ? "rc" : "deck"}-${ci})`} />
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={active ? "var(--dq-ink)" : color}
                strokeWidth={active ? 2.4 : 1.2}
                strokeDasharray={s.slabType === "DECK" ? "7 4" : undefined}
              />
              <text x={x + w / 2} y={y + h / 2 - (wide && showValues ? px(8) : 0)} textAnchor="middle" dominantBaseline="central" fontSize={px(wide ? 15 : 14)} fontWeight="700" fill="var(--dq-ink)">
                {letter}
              </text>
              {wide && showValues && (
                <text x={x + w / 2} y={y + h / 2 + px(10)} textAnchor="middle" dominantBaseline="central" fontSize={px(12)} fill="var(--dq-ink-2)">
                  {s.slabType} {s.areaM2.toLocaleString("ko-KR", { minimumFractionDigits: 1 })}㎡
                </text>
              )}
            </g>
          );
        })}

        {/* 건물 외곽 */}
        <rect x={OX} y={OY} width={BLD.w * S} height={BLD.d * S} fill="none" stroke="var(--dq-wall)" strokeWidth="1.6" />
        <rect x={OX + 4} y={OY + 4} width={BLD.w * S - 8} height={BLD.d * S - 8} fill="none" stroke="var(--dq-wall)" strokeWidth="1" />
        {/* 창 개구부: 북측과 남측 벽에 얇은 틈 */}
        {[7, 15, 30, 38].map((m) => (
          <g key={`wn${m}`}>
            <rect x={OX + m * S - 14} y={OY - 1.5} width="28" height="7" fill="var(--dq-paper)" stroke="var(--dq-wall)" strokeWidth="0.8" />
            <rect x={OX + m * S - 14} y={OY + BLD.d * S - 5.5} width="28" height="7" fill="var(--dq-paper)" stroke="var(--dq-wall)" strokeWidth="0.8" />
          </g>
        ))}
        {/* 기둥: 구조 그리드 교차점과 경간 중앙 */}
        {[0, 11.5, 23, 34.5, 46].flatMap((mx) =>
          [0, 12.6, 25.2].map((my) => (
            <rect
              key={`c${mx}-${my}`}
              x={OX + mx * S - 3.5 + (mx === 0 ? 3.5 : mx === 46 ? -3.5 : 0)}
              y={OY + my * S - 3.5 + (my === 0 ? 3.5 : my === 25.2 ? -3.5 : 0)}
              width="7"
              height="7"
              fill="var(--dq-wall)"
              opacity="0.7"
            />
          )),
        )}
        {/* 계단실 돌출부 윤곽(남측) */}
        <rect x={OX + 30 * S} y={OY + BLD.d * S} width={6.4 * S} height={2.4 * S} fill="none" stroke="var(--dq-line-strong)" strokeWidth="1" strokeDasharray="4 3" />

        {/* 수동 지정 영역 */}
        {walls
          .filter((w) => w.region)
          .map((w) => {
            const r = w.region!;
            const active = selectedId === w.id;
            return (
              <g
                key={w.id}
                className="dq-seg cursor-pointer"
                opacity={dim && !active ? 0.42 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(w.id);
                }}
              >
                <rect
                  x={OX + r.x * S}
                  y={OY + r.y * S}
                  width={r.w * S}
                  height={r.h * S}
                  fill={CONFIDENCE_COLOR["수동 수정됨"]}
                  fillOpacity="0.14"
                  stroke={active ? "var(--dq-ink)" : CONFIDENCE_COLOR["수동 수정됨"]}
                  strokeWidth={active ? 2.4 : 1.6}
                  strokeDasharray="5 3"
                />
                <text x={OX + (r.x + r.w / 2) * S} y={OY + (r.y + r.h / 2) * S} textAnchor="middle" dominantBaseline="central" fontSize={px(11)} fontWeight="600" fill="var(--dq-blue-fg)">
                  수동 지정
                </text>
              </g>
            );
          })}

        {/* 외벽 구간 */}
        {walls
          .filter((w) => !w.region)
          .map((w) => {
            const p = wallPoints(w);
            const color = CONFIDENCE_COLOR[w.confidence];
            const active = selectedId === w.id;
            const mx = (p.x1 + p.x2) / 2;
            const my = (p.y1 + p.y2) / 2;
            const vertical = w.side === "E" || w.side === "W";
            return (
              <g
                key={w.id}
                className="dq-seg cursor-pointer"
                opacity={dim && !active ? 0.42 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(w.id);
                }}
              >
                {active && <line {...p} stroke="var(--dq-ink)" strokeWidth="12" strokeLinecap="butt" />}
                <line {...p} stroke={color} strokeWidth={active ? 8 : 6} strokeLinecap="butt" />
                <line {...p} stroke="transparent" strokeWidth="18" />
                {active && (
                  <g>
                    <rect
                      x={mx - (vertical ? px(46) : px(42)) / 2 + (vertical ? (w.side === "E" ? px(34) : -px(34)) : 0)}
                      y={my - px(11) + (vertical ? 0 : w.side === "N" ? -px(20) : px(20))}
                      width={vertical ? px(46) : px(42)}
                      height={px(22)}
                      rx={px(5)}
                      fill="var(--dq-ink)"
                    />
                    <text
                      x={mx + (vertical ? (w.side === "E" ? px(34) : -px(34)) : 0)}
                      y={my + (vertical ? 0 : w.side === "N" ? -px(20) : px(20))}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={px(12)}
                      fontWeight="600"
                      fill="#fff"
                    >
                      {w.lengthM.toLocaleString("ko-KR", { minimumFractionDigits: 1 })} m
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* 치수선 */}
        <g stroke="var(--dq-ink-3)" strokeWidth="0.8" fill="none">
          <line x1={OX} y1={366} x2={OX + BLD.w * S} y2={366} />
          <line x1={OX} y1={361} x2={OX} y2={371} />
          <line x1={OX + BLD.w * S} y1={361} x2={OX + BLD.w * S} y2={371} />
        </g>
        <rect x={OX + (BLD.w * S) / 2 - px(24)} y={358} width={px(48)} height={px(16)} fill="var(--dq-paper)" />
        <text x={OX + (BLD.w * S) / 2} y={366} textAnchor="middle" dominantBaseline="central" fontSize={px(11)} fill="var(--dq-ink-3)">
          46,000
        </text>
        <g stroke="var(--dq-ink-3)" strokeWidth="0.8" fill="none">
          <line x1={OX + BLD.w * S + 30} y1={OY} x2={OX + BLD.w * S + 30} y2={OY + BLD.d * S} />
          <line x1={OX + BLD.w * S + 25} y1={OY} x2={OX + BLD.w * S + 35} y2={OY} />
          <line x1={OX + BLD.w * S + 25} y1={OY + BLD.d * S} x2={OX + BLD.w * S + 35} y2={OY + BLD.d * S} />
        </g>
        <text
          x={OX + BLD.w * S + 44}
          y={OY + (BLD.d * S) / 2}
          textAnchor="middle"
          fontSize={px(11)}
          fill="var(--dq-ink-3)"
          transform={`rotate(90 ${OX + BLD.w * S + 44} ${OY + (BLD.d * S) / 2})`}
        >
          25,200
        </text>
      </svg>

      {showControls && (
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-[8px] bg-[var(--dq-surface)] shadow-[0_0_0_1px_var(--dq-line)]">
            <CtrlButton label="확대" onClick={() => setZoomIdx((z) => Math.min(z + 1, ZOOMS.length - 1))} disabled={zoomIdx === ZOOMS.length - 1}>
              <MagnifyingGlassPlus size={18} />
            </CtrlButton>
            <CtrlButton label="축소" onClick={() => setZoomIdx((z) => Math.max(z - 1, 0))} disabled={zoomIdx === 0}>
              <MagnifyingGlassMinus size={18} />
            </CtrlButton>
            <CtrlButton
              label="화면에 맞춤"
              onClick={() => {
                setZoomIdx(0);
                setCenter({ x: VB_W / 2, y: VB_H / 2 });
              }}
            >
              <CornersOut size={18} />
            </CtrlButton>
          </div>
          <div className={`grid-cols-3 overflow-hidden rounded-[8px] bg-[var(--dq-surface)] shadow-[0_0_0_1px_var(--dq-line)] ${zoom > 1 ? "grid" : "hidden"}`}>
            <span />
            <CtrlButton label="위로 이동" onClick={() => pan(0, -1)} disabled={zoom === 1} small>
              <CaretUp size={14} weight="bold" />
            </CtrlButton>
            <span />
            <CtrlButton label="왼쪽으로 이동" onClick={() => pan(-1, 0)} disabled={zoom === 1} small>
              <CaretLeft size={14} weight="bold" />
            </CtrlButton>
            <CtrlButton label="아래로 이동" onClick={() => pan(0, 1)} disabled={zoom === 1} small>
              <CaretDown size={14} weight="bold" />
            </CtrlButton>
            <CtrlButton label="오른쪽으로 이동" onClick={() => pan(1, 0)} disabled={zoom === 1} small>
              <CaretRight size={14} weight="bold" />
            </CtrlButton>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function CtrlButton({
  label,
  onClick,
  disabled,
  children,
  small,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`flex items-center justify-center text-[var(--dq-ink-2)] hover:bg-[var(--dq-soft)] disabled:text-[var(--dq-disabled)] disabled:hover:bg-transparent ${
        small ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      {children}
    </button>
  );
}
