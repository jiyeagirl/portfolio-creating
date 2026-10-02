"use client";

/* 02 주변 정보 지도 — QR 지점을 중심으로 안전시설, 편의시설, 상점가를 한 화면에서 훑는다.
   지도는 실제 타일이 아니라 도로망과 블록만 남긴 추상 SVG(components/abstract-map.tsx). */

import { useMemo, useState } from "react";
import { Crosshair, PersonSimpleWalk, Stack, Storefront, WarningCircle } from "@phosphor-icons/react";
import { AbstractMap, type MapMarker } from "@/projects/youngin/real/components/abstract-map";
import {
  Badge,
  FACILITY_TONE,
  FacilityIcon,
  FilterChip,
  Notice,
  QrContextStrip,
  SheetHandle,
} from "@/projects/youngin/real/components/ui";
import {
  DISTRICTS,
  FACILITIES,
  QR_POINT,
  formatDistance,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";
import type { FacilityType } from "@/projects/youngin/real/lib/types";

type Filter = "전체" | FacilityType | "상점가";

const FILTERS: Filter[] = ["전체", "AED", "대피소", "쉼터", "화장실", "상점가"];

export function MapScreen({
  onNavigate,
  focusId,
}: {
  onNavigate: (route: Route) => void;
  focusId?: string;
}) {
  const [filter, setFilter] = useState<Filter>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(focusId ?? null);
  const [noticeOpen, setNoticeOpen] = useState(true);

  const visible = useMemo(() => {
    if (filter === "전체" || filter === "상점가") return FACILITIES;
    return FACILITIES.filter((f) => f.type === filter);
  }, [filter]);

  const sorted = useMemo(() => [...visible].sort((a, b) => a.distance - b.distance), [visible]);
  const selected = sorted.find((f) => f.id === selectedId) ?? null;
  const showDistricts = filter === "전체" || filter === "상점가";

  const counts = useMemo(() => {
    const map: Record<string, number> = { 전체: FACILITIES.length, 상점가: DISTRICTS.length };
    for (const f of FACILITIES) map[f.type] = (map[f.type] ?? 0) + 1;
    return map;
  }, []);

  const markers: MapMarker[] = [
    ...(filter === "상점가" ? [] : visible).map((f) => ({
      id: f.id,
      point: f.coordinates,
      fg: FACILITY_TONE[f.type].fg,
      icon: FACILITY_TONE[f.type].icon,
      active: f.id === selectedId,
      label: f.id === selectedId ? f.displayName : undefined,
      onClick: () => setSelectedId(f.id === selectedId ? null : f.id),
    })),
    ...(showDistricts
      ? DISTRICTS.map((d) => ({
          id: d.id,
          point: d.center,
          count: d.storeCount,
          bg: "var(--cp-accent)",
          fg: "var(--cp-on-accent)",
          label: d.zoneCode,
          onClick: () => onNavigate({ name: "districtDetail", districtId: d.id }),
        }))
      : []),
  ];

  /* 대피소는 반경 500m 안에 하나도 없다. 필터 결과가 비어 보이는 대신 가장 가까운
     대안을 알려주는 안내를 띄운다(빈 지도가 고장처럼 읽히는 것을 막는다). */
  const farthestNotice =
    filter === "대피소" && noticeOpen
      ? `가까운 곳에 대피소가 없습니다. 가장 가까운 대피소는 ${formatDistance(
          Math.min(...FACILITIES.filter((f) => f.type === "대피소").map((f) => f.distance)),
        )} 떨어져 있습니다.`
      : null;

  return (
    <div className="relative h-full overflow-hidden bg-[var(--cp-canvas)]">
      {/* 하단 시트가 화면의 40%가량을 덮는다. QR 지점(정규화 y 58)이 노출 영역 가운데로
          오도록 지도를 위로 당겨 얹는다. 루트의 overflow-hidden 안에서만 잘린다. */}
      <div className="absolute inset-x-0 -top-[132px] bottom-[92px]">
        <AbstractMap
        className="h-full w-full"
        qrPoint={QR_POINT.coordinates}
        qrLabel="현재 위치"
        markers={markers}
        polygons={
          showDistricts
            ? DISTRICTS.map((d) => ({
                id: `poly-${d.id}`,
                points: d.polygon,
                label: undefined,
              }))
            : []
        }
        />
      </div>

      {/* 상단 고정 영역 — 프레임 상단 모서리에 닿으므로 불투명 표면만 쓴다 */}
      <div className="absolute inset-x-0 top-0 z-30 bg-[var(--cp-surface)] pt-[59px]">
        <QrContextStrip code={QR_POINT.code} label={QR_POINT.label} />
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((key) => (
            <FilterChip
              key={key}
              label={key}
              count={counts[key]}
              active={filter === key}
              onClick={() => {
                setFilter(key);
                setSelectedId(null);
                setNoticeOpen(true);
              }}
              icon={
                key === "상점가"
                  ? Storefront
                  : key === "전체"
                    ? Stack
                    : FACILITY_TONE[key as FacilityType].icon
              }
              tone={
                key === "전체" || key === "상점가"
                  ? "var(--cp-accent)"
                  : FACILITY_TONE[key as FacilityType].fg
              }
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="현재 위치로 이동"
        className="absolute bottom-[352px] right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cp-surface)] text-[var(--cp-accent)] shadow-[var(--cp-shadow-pop)] transition-transform active:scale-95"
      >
        <Crosshair size={20} weight="bold" />
      </button>

      {/* 하단 시트 — 탭바 위에 얹히므로 프레임 모서리에 닿지 않는다 */}
      <div className="absolute inset-x-0 bottom-[92px] z-20 max-h-[340px] overflow-hidden rounded-t-[24px] bg-[var(--cp-surface)] shadow-[var(--cp-shadow-pop)]">
        <SheetHandle />

        {selected ? (
          <div className="px-5 pb-6">
            <div className="flex items-start gap-3">
              <FacilityIcon type={selected.type} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Badge tone="neutral">{selected.type}</Badge>
                  {selected.alwaysOpen && <Badge tone="ok">24시간 개방</Badge>}
                </div>
                <h2 className="mt-1.5 text-[18px] font-extrabold leading-6 tracking-[-0.02em] text-[var(--cp-ink)]">
                  {selected.displayName}
                </h2>
                <p className="cp-num mt-1 flex items-center gap-1 text-[12.5px] font-semibold text-[var(--cp-accent)]">
                  <PersonSimpleWalk size={13} weight="fill" />
                  {formatDistance(selected.distance)} / 도보 {selected.walkMinutes}분
                </p>
              </div>
            </div>

            <p className="mt-3 text-[13px] leading-[19px] text-[var(--cp-body)]">{selected.detail}</p>
            {/* 위치는 도로명 주소를 먼저 쓰고, 건물 안 위치를 보조 줄로 붙인다 */}
            <p className="mt-2 text-[12.5px] font-semibold text-[var(--cp-body)]">
              {selected.address}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--cp-mute)]">{selected.relativeLocation}</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="h-12 flex-1 rounded-full border border-[var(--cp-hairline)] text-[14.5px] font-bold text-[var(--cp-body)] transition-colors active:bg-[var(--cp-sunken)]"
              >
                목록으로
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: "directions", targetId: selected.id })}
                className="h-12 flex-[1.4] rounded-full bg-[var(--cp-accent)] text-[14.5px] font-bold text-[var(--cp-on-accent)] transition-transform active:scale-[0.98]"
              >
                길찾기
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-[300px] flex-col">
            <div className="px-5 pb-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                  {filter === "전체" ? "주변 공공시설" : `${filter} ${sorted.length}곳`}
                </h2>
                <span className="cp-num shrink-0 text-[12px] font-semibold text-[var(--cp-mute)]">
                  가까운 순
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[var(--cp-mute)]">
                {QR_POINT.code} 지점 기준 직선거리
              </p>
              {farthestNotice && (
                <div className="mt-3">
                  <Notice
                    tone="warn"
                    icon={<WarningCircle size={15} weight="fill" />}
                    onDismiss={() => setNoticeOpen(false)}
                  >
                    {farthestNotice}
                  </Notice>
                </div>
              )}
            </div>

            <ul className="flex-1 overflow-y-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sorted.map((facility, index) => (
                <li key={facility.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(facility.id)}
                    className={`flex w-full items-center gap-3 py-3 text-left ${
                      index > 0 ? "border-t border-[var(--cp-hairline)]" : ""
                    }`}
                  >
                    <FacilityIcon type={facility.type} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                        {facility.displayName}
                      </span>
                      <span className="cp-num mt-0.5 block truncate text-[12px] text-[var(--cp-mute)]">
                        {formatDistance(facility.distance)} | 도보 {facility.walkMinutes}분 |{" "}
                        {facility.address}
                      </span>
                    </span>
                    <span className="cp-num shrink-0 rounded-full bg-[var(--cp-sunken)] px-2 py-1 text-[11px] font-bold text-[var(--cp-body)]">
                      {facility.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
