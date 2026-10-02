"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  CaretRight,
  Minus,
  NavigationArrow,
  Plus,
  X,
} from "@phosphor-icons/react";

import { CityMap } from "@/projects/youngin/street/components/city-map";
import { FilterChip, MapControlButton, StatusBadge } from "@/projects/youngin/street/components/ui";
import {
  DISTRICT_SUMMARY,
  HAZARD_BY_KEY,
  HAZARD_TYPES,
  MY_POSITION,
  REPORTS,
  STATUS_META,
} from "@/projects/youngin/street/lib/mock-data";
import { STATUS_ORDER } from "@/projects/youngin/street/lib/types";
import type { HazardType, ReportStatus } from "@/projects/youngin/street/lib/types";

const ZOOM_STEPS = [1, 1.6, 2.2];

export function MapScreen({ onReport }: { onReport: () => void }) {
  const [typeFilter, setTypeFilter] = useState<HazardType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);

  const visible = useMemo(
    () =>
      REPORTS.filter(
        (r) =>
          (typeFilter === "all" || r.type === typeFilter) &&
          (statusFilter === "all" || r.status === statusFilter),
      ),
    [typeFilter, statusFilter],
  );

  const selected = visible.find((r) => r.id === selectedId) ?? null;
  const center = selected ? { x: selected.x, y: selected.y } : MY_POSITION;

  return (
    <div className="relative h-[852px] w-full overflow-hidden bg-[var(--st-map-land)]">
      <div className="absolute inset-0">
        <CityMap
          reports={visible}
          selectedId={selected?.id ?? null}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          zoom={ZOOM_STEPS[zoomIndex]}
          center={center}
        />
      </div>

      {/* 상단 부유 헤더 + 필터. 지도 위에 뜨므로 그림자 토큰을 쓴다. */}
      <div className="st-enter absolute inset-x-0 top-0 z-20 pt-[67px]">
        <div
          className="mx-4 rounded-[18px] bg-[var(--st-surface)] px-4 py-3"
          style={{ boxShadow: "var(--st-shadow-float)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-[16px] text-[var(--st-accent)]">
                우리 동네 보행 위험 지도
              </p>
              <h1 className="mt-0.5 text-[21px] font-semibold leading-[25px] tracking-[-0.3px] text-[var(--st-ink)]">
                {DISTRICT_SUMMARY.name}
              </h1>
            </div>
            <div className="shrink-0 text-right">
              <p className="st-num text-[21px] font-semibold leading-[25px] tracking-[-0.3px] text-[var(--st-ink)]">
                {visible.length}
                <span className="ml-0.5 text-[13px] font-normal text-[var(--st-ink-48)]">건</span>
              </p>
              <p className="text-[11px] font-semibold leading-[14px] text-[var(--st-ink-48)]">
                지금 보이는 제보
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 border-t border-[var(--st-divider)] pt-2.5">
            {(
              [
                ["미처리", DISTRICT_SUMMARY.open, "var(--st-reviewing)"],
                ["처리 완료", DISTRICT_SUMMARY.done, "var(--st-done)"],
              ] as const
            ).map(([label, count, tone]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: tone }} />
                <span className="text-[12px] leading-[16px] text-[var(--st-ink-48)]">{label}</span>
                <span className="st-num text-[12px] font-semibold leading-[16px] text-[var(--st-ink-80)]">
                  {count}
                </span>
              </span>
            ))}
            <span className="st-num ml-auto text-[11px] leading-[14px] text-[var(--st-ink-48)]">
              {DISTRICT_SUMMARY.updatedAt}
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip floating selected={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            전체 유형
          </FilterChip>
          {HAZARD_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <FilterChip
                key={t.key}
                floating
                selected={typeFilter === t.key}
                onClick={() => setTypeFilter((prev) => (prev === t.key ? "all" : t.key))}
                icon={<Icon size={14} weight={typeFilter === t.key ? "fill" : "regular"} />}
              >
                {t.short}
              </FilterChip>
            );
          })}
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip floating selected={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            전체 상태
          </FilterChip>
          {STATUS_ORDER.map((s) => (
            <FilterChip
              key={s}
              floating
              selected={statusFilter === s}
              onClick={() => setStatusFilter((prev) => (prev === s ? "all" : s))}
              icon={
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ background: statusFilter === s ? "#ffffff" : STATUS_META[s].ink }}
                />
              }
            >
              {STATUS_META[s].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* 지도 컨트롤 */}
      <div className="absolute right-4 z-20 flex flex-col gap-2" style={{ bottom: selected ? 366 : 340 }}>
        <MapControlButton
          label="지도 확대"
          onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1))}
        >
          <Plus size={19} weight="bold" />
        </MapControlButton>
        <MapControlButton label="지도 축소" onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}>
          <Minus size={19} weight="bold" />
        </MapControlButton>
        <MapControlButton
          label="현재 위치로 이동"
          active={!selected}
          onClick={() => {
            setSelectedId(null);
            setZoomIndex(1);
          }}
        >
          <NavigationArrow size={19} weight="fill" />
        </MapControlButton>
      </div>

      {/* 하단 시트. 마커를 고르면 상세, 아니면 제보 유도 카드다. */}
      <div className="absolute inset-x-0 bottom-[83px] z-20 px-4">
        {selected ? (
          <div
            key={selected.id}
            className="st-sheet-in overflow-hidden rounded-[18px] bg-[var(--st-surface)]"
            style={{ boxShadow: "var(--st-shadow-float)" }}
          >
            <div className="flex gap-3 p-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.photo}
                alt={selected.title}
                className="h-[92px] w-[92px] shrink-0 rounded-[11px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status={selected.status} size="sm" />
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="상세 닫기"
                    className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[var(--st-ink-48)] transition-transform duration-200 active:scale-95"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
                <h2 className="mt-1.5 text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
                  {selected.title}
                </h2>
                <p className="st-num mt-1 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                  {HAZARD_BY_KEY[selected.type].label} | {selected.reportedAt} 제보
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--st-divider)] px-3.5 py-3">
              <p className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-80)]">
                {selected.address}
              </p>
              <p className="mt-0.5 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                {selected.landmark}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <p className="st-num text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                  같은 불편을 겪었어요 {selected.agrees}명
                </p>
                <span className="flex items-center gap-1 text-[13px] font-semibold text-[var(--st-accent)]">
                  담당 {selected.department}
                  <CaretRight size={13} weight="bold" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="st-sheet-in rounded-[18px] bg-[var(--st-surface)] p-4"
            style={{ boxShadow: "var(--st-shadow-float)" }}
          >
            <h2 className="text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
              걷다가 위험한 곳을 보셨나요
            </h2>
            <p className="mt-1 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
              사진 한 장과 현재 위치면 제보가 끝납니다.
            </p>
            <button
              type="button"
              onClick={onReport}
              className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--st-accent)] text-[17px] font-semibold tracking-[-0.374px] text-[var(--st-on-accent)] transition-transform duration-200 active:scale-95"
            >
              <Camera size={20} weight="fill" />
              위험 제보하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
