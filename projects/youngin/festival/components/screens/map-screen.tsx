"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { GlyphTile, PrimaryButton, StatusDot } from "@/projects/youngin/festival/components/ui";
import { VenueMap } from "@/projects/youngin/festival/components/venue-map";
import {
  CATEGORY_LABEL,
  FACILITIES,
  FACILITY_ICON,
  FACILITY_LABEL,
  PROGRAMS,
  STATUS_LABEL,
  getFacility,
  searchFacilities,
} from "@/projects/youngin/festival/lib/mock-data";
import type { FacilityCategory } from "@/projects/youngin/festival/lib/types";
import type { FestivalNavigate } from "@/projects/youngin/festival/lib/navigation";

/* 탭바 높이(pt-2 + min-h-48 + pb-30). 시트와 지도 컨트롤이 탭바를 덮지 않도록 기준으로 쓴다. */
const TAB_H = 86;

/* 시트 높이는 고정값이다. 내용에 맞춰 auto로 두면 지도 컨트롤을 띄울 기준 높이가 없고,
   전개 트랜지션도 안 걸린다. 상세는 프로그램 블록 유무로 두 단계만 쓴다. */
const SHEET_H = { peek: 118, detail: 268, detailWithPrograms: 340, list: 438 } as const;
type SheetMode = "peek" | "detail" | "list";

const FILTERS: { key: FacilityCategory; icon: string; color: string }[] = [
  { key: "program", icon: "solar:confetti-minimalistic-bold", color: "var(--fs-cat-program)" },
  { key: "convenience", icon: "solar:bath-bold", color: "var(--fs-cat-conv)" },
  { key: "safety", icon: "solar:health-bold", color: "var(--fs-cat-safety)" },
];

export function MapScreen({
  facilityId,
  onNavigate,
}: {
  facilityId?: string;
  onNavigate: FestivalNavigate;
}) {
  const [active, setActive] = useState<Set<FacilityCategory>>(
    () => new Set<FacilityCategory>(["program", "convenience", "safety"]),
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(facilityId);
  const [mode, setMode] = useState<SheetMode>(facilityId ? "detail" : "peek");
  const [query, setQuery] = useState("");
  const [routeOn, setRouteOn] = useState(false);

  const visible = useMemo(
    () => FACILITIES.filter((f) => active.has(f.category)),
    [active],
  );
  const results = useMemo(() => searchFacilities(query), [query]);
  const selected = selectedId ? getFacility(selectedId) : undefined;

  const relatedPrograms = useMemo(
    () => (selected ? PROGRAMS.filter((p) => p.facilityId === selected.id) : []),
    [selected],
  );

  const toggle = (key: FacilityCategory) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const select = (id: string) => {
    setSelectedId(id);
    setMode("detail");
    setRouteOn(false);
    setQuery("");
  };

  const sheetH =
    mode === "detail"
      ? relatedPrograms.length > 0
        ? SHEET_H.detailWithPrograms
        : SHEET_H.detail
      : SHEET_H[mode];

  return (
    <div className="fs-screen-in relative h-full w-full overflow-hidden">
      <VenueMap
        facilities={visible}
        selectedId={selectedId}
        onSelect={select}
        controlsBottom={sheetH + TAB_H + 12}
        routeTo={routeOn && selected ? selected : null}
      />

      {/* 상단 검색 + 필터. 불투명 면만 쓴다 (기기 프레임 안쪽 규칙). */}
      <header
        className="absolute inset-x-0 top-0 z-20 pb-3 pt-[59px]"
        style={{ background: "var(--fs-surface)", boxShadow: "0 1px 0 var(--fs-line)" }}
      >
        <div className="flex items-center gap-2 px-4 pt-2.5">
          <button
            type="button"
            aria-label="행사 홈으로"
            onClick={() => onNavigate("home")}
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--fs-ink)] transition-transform duration-150 active:scale-[0.94]"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="21" height="21" />
          </button>
          <div
            className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] px-3"
            style={{ background: "var(--fs-surface-soft)", height: 42 }}
          >
            <Icon
              icon="solar:magnifer-linear"
              width="17"
              height="17"
              style={{ color: "var(--fs-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="시설, 부스 검색"
              aria-label="시설, 부스 검색"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--fs-ink)] outline-none placeholder:text-[var(--fs-faint)]"
            />
            {query && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setQuery("")}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ color: "var(--fs-muted)" }}
              >
                <Icon icon="solar:close-circle-bold" width="17" height="17" />
              </button>
            )}
          </div>
        </div>

        <div className="festival-scroll-x mt-2.5 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => {
            const on = active.has(f.key);
            const count = FACILITIES.filter((x) => x.category === f.key).length;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(f.key)}
                className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-bold transition-transform duration-150 active:scale-[0.96]"
                style={
                  on
                    ? { background: f.color, color: "#ffffff" }
                    : {
                        background: "var(--fs-surface)",
                        color: "var(--fs-muted)",
                        boxShadow: "inset 0 0 0 1px var(--fs-line)",
                      }
                }
              >
                <Icon icon={f.icon} width="15" height="15" />
                {CATEGORY_LABEL[f.key]}
                <span className="festival-num opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 검색 결과 */}
      {query.trim().length > 0 && (
        <div
          className="absolute inset-x-0 z-20 overflow-y-auto"
          style={{
            top: 168,
            bottom: TAB_H,
            background: "var(--fs-canvas)",
          }}
        >
          {results.length === 0 ? (
            <div className="flex flex-col items-center px-8 pt-16 text-center">
              <GlyphTile icon="solar:magnifer-linear" tone="convenience" size={52} radius={16} />
              <p className="mt-3 text-[15px] font-bold text-[var(--fs-ink)]">
                검색 결과가 없습니다
              </p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--fs-muted)]">
                시설명 대신 화장실, 안내소, 체험처럼 종류로 찾아 보세요.
              </p>
            </div>
          ) : (
            <>
              <p className="festival-num px-5 py-3 text-[12px] font-semibold text-[var(--fs-muted)]">
                검색 결과 {results.length}곳
              </p>
              {results.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => select(f.id)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left"
                  style={{ borderTop: "1px solid var(--fs-line-soft)" }}
                >
                  <GlyphTile
                    icon={FACILITY_ICON[f.kind]}
                    tone={
                      f.category === "program"
                        ? "program"
                        : f.category === "safety"
                          ? "safety"
                          : "convenience"
                    }
                    size={40}
                    radius={11}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-bold text-[var(--fs-ink)]">
                      {f.name}
                    </p>
                    <p className="festival-num truncate text-[12px] text-[var(--fs-muted)]">
                      {FACILITY_LABEL[f.kind]} | {f.zone}구역 | 도보 {f.walkMin}분
                    </p>
                  </div>
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    width="17"
                    height="17"
                    style={{ color: "var(--fs-faint)" }}
                  />
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Bottom Sheet */}
      <section
        className="absolute inset-x-0 z-20 overflow-hidden rounded-t-[20px]"
        style={{
          bottom: TAB_H,
          height: sheetH,
          background: "var(--fs-surface)",
          boxShadow: "0 -8px 32px -12px rgba(28,26,23,0.28)",
          transition: "height 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          type="button"
          aria-label={mode === "list" ? "목록 접기" : "시설 목록 펼치기"}
          onClick={() => {
            if (mode === "detail") {
              setSelectedId(undefined);
              setRouteOn(false);
              setMode("peek");
            } else {
              setMode(mode === "list" ? "peek" : "list");
            }
          }}
          className="flex h-8 w-full items-center justify-center"
        >
          <span
            className="h-[5px] w-[38px] rounded-full"
            style={{ background: "var(--fs-surface-sunk)" }}
          />
        </button>

        {mode === "detail" && selected ? (
          <div className="h-[calc(100%-32px)] overflow-y-auto px-5 pb-5">
            <div className="flex items-start gap-3">
              <GlyphTile
                icon={FACILITY_ICON[selected.kind]}
                tone={
                  selected.category === "program"
                    ? "program"
                    : selected.category === "safety"
                      ? "safety"
                      : "convenience"
                }
                size={48}
                radius={14}
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[19px] font-bold leading-[25px] text-[var(--fs-ink)]">
                  {selected.name}
                </h2>
                <p className="festival-num mt-0.5 text-[12.5px] text-[var(--fs-muted)]">
                  {FACILITY_LABEL[selected.kind]} | {selected.zone}구역 | 도보 {selected.walkMin}분
                </p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => {
                  setSelectedId(undefined);
                  setRouteOn(false);
                  setMode("peek");
                }}
                className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ color: "var(--fs-faint)" }}
              >
                <Icon icon="solar:close-circle-bold" width="20" height="20" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <StatusDot status={selected.status} label={STATUS_LABEL[selected.status]} />
              <span className="festival-num text-[12.5px] text-[var(--fs-muted)]">
                운영 {selected.hours}
              </span>
            </div>

            <p className="mt-3 text-[13.5px] leading-[20px] text-[var(--fs-body)]">
              {selected.desc}
            </p>

            {relatedPrograms.length > 0 && (
              <div
                className="mt-3.5 rounded-[14px] px-3.5 py-3"
                style={{ background: "var(--fs-surface-soft)" }}
              >
                <p className="text-[11.5px] font-bold text-[var(--fs-muted)]">
                  이곳에서 열리는 프로그램
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {relatedPrograms.map((p) => (
                    <li key={p.id} className="flex items-baseline gap-2">
                      <span className="festival-num shrink-0 text-[12.5px] font-bold text-[var(--fs-accent)]">
                        {p.start}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--fs-body)]">
                        {p.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <PrimaryButton
                  icon={routeOn ? "solar:close-circle-bold" : "solar:route-bold"}
                  onClick={() => setRouteOn((v) => !v)}
                >
                  {routeOn ? "길찾기 끄기" : "길찾기"}
                </PrimaryButton>
              </div>
              <div className="w-[124px]">
                <PrimaryButton
                  variant="outline"
                  icon="solar:flag-2-bold"
                  onClick={() => onNavigate("mission")}
                >
                  미션
                </PrimaryButton>
              </div>
            </div>
          </div>
        ) : mode === "list" ? (
          <div className="h-[calc(100%-32px)] overflow-y-auto pb-4">
            <p className="festival-num px-5 pb-2 text-[12px] font-semibold text-[var(--fs-muted)]">
              지도에 표시된 시설 {visible.length}곳
            </p>
            {visible.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => select(f.id)}
                className="flex w-full items-center gap-3 px-5 py-2.5 text-left"
                style={{ borderTop: "1px solid var(--fs-line-soft)" }}
              >
                <GlyphTile
                  icon={FACILITY_ICON[f.kind]}
                  tone={
                    f.category === "program"
                      ? "program"
                      : f.category === "safety"
                        ? "safety"
                        : "convenience"
                  }
                  size={38}
                  radius={11}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[var(--fs-ink)]">{f.name}</p>
                  <p className="festival-num truncate text-[11.5px] text-[var(--fs-muted)]">
                    {f.zone}구역 | 도보 {f.walkMin}분 | {STATUS_LABEL[f.status]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMode("list")}
            className="flex w-full items-center gap-3 px-5 pb-5 text-left"
          >
            <GlyphTile icon="solar:list-bold" tone="program" size={44} radius={13} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-[var(--fs-ink)]">
                핀을 눌러 시설을 확인하세요
              </p>
              <p className="festival-num mt-0.5 text-[12.5px] text-[var(--fs-muted)]">
                표시 중 {visible.length}곳 | 목록으로 보려면 위로 올리세요
              </p>
            </div>
            <Icon
              icon="solar:alt-arrow-up-linear"
              width="19"
              height="19"
              style={{ color: "var(--fs-faint)" }}
            />
          </button>
        )}
      </section>
    </div>
  );
}
