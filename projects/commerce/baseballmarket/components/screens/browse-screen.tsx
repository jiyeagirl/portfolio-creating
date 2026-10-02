"use client";

import { useMemo, useState } from "react";
import { Bell, SlidersHorizontal } from "@phosphor-icons/react";
import {
  Badge,
  Chip,
  EmptyState,
  Eyebrow,
  SearchInput,
  Segmented,
  Select,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import { ListingCard } from "@/projects/commerce/baseballmarket/components/listing-card";
import { Toggle } from "@/components/shared/toggle";
import {
  LISTINGS,
  SAVED_SEARCHES,
  TEAMS,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type {
  Category,
  Condition,
  TeamId,
  UniformKind,
} from "@/projects/commerce/baseballmarket/lib/types";

/* 탐색. 야구 특화 속성(구단, 시즌, 선수, 등번호, 사이즈, 실측)을 필터 전면에 둔다 —
   spec Key Focus 1번. 일반 중고거래 필터(가격, 지역)는 그 아래다. */

const SORTS = ["최신순", "낮은 가격순", "높은 가격순", "인기순", "가까운 순"];
const SIZES = ["전체", "95", "100", "105", "110"];
const KINDS: (UniformKind | "전체")[] = ["전체", "홈", "원정", "서드", "올드"];
const CONDITIONS: (Condition | "전체")[] = ["전체", "미착용", "최상", "상", "중"];
const SEASONS = ["전체", "2026", "2025", "2024", "2023", "복각 / 올드"];

export function BrowseScreen({
  onOpenListing,
  liked,
  onToggleLike,
}: {
  onOpenListing: (id: string) => void;
  liked: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "전체">("전체");
  const [teamFilter, setTeamFilter] = useState<string>("전체");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("전체");
  const [size, setSize] = useState("전체");
  const [season, setSeason] = useState("전체");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("전체");
  const [sort, setSort] = useState("최신순");
  const [safeOnly, setSafeOnly] = useState(false);
  const [hideSold, setHideSold] = useState(true);
  const [alarm, setAlarm] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let out = LISTINGS.slice();
    if (hideSold) out = out.filter((l) => l.status !== "거래완료");
    if (cat !== "전체") out = out.filter((l) => l.category === cat);
    if (teamFilter !== "전체") out = out.filter((l) => l.team === teamFilter);
    if (kind !== "전체") out = out.filter((l) => l.uniform?.kind === kind);
    if (size !== "전체") out = out.filter((l) => l.uniform?.size === size);
    if (condition !== "전체") out = out.filter((l) => l.condition === condition);
    if (season !== "전체") {
      out = out.filter((l) =>
        season === "복각 / 올드"
          ? l.uniform?.kind === "올드"
          : String(l.uniform?.season ?? "") === season,
      );
    }
    if (safeOnly) out = out.filter((l) => l.method.includes("안전거래"));
    if (q.trim()) {
      const needle = q.trim();
      out = out.filter(
        (l) =>
          l.title.includes(needle) ||
          l.uniform?.player.includes(needle) ||
          l.ticket?.zone.includes(needle),
      );
    }
    const sorted = out.slice();
    if (sort === "낮은 가격순") sorted.sort((a, b) => a.price - b.price);
    if (sort === "높은 가격순") sorted.sort((a, b) => b.price - a.price);
    if (sort === "인기순") sorted.sort((a, b) => b.likes - a.likes);
    if (sort === "가까운 순") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === "최신순") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [q, cat, teamFilter, kind, size, season, condition, sort, safeOnly, hideSold]);

  const uniformFilters = cat === "전체" || cat === "유니폼";

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8 lg:py-14">
      <Eyebrow>매물 탐색</Eyebrow>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[32px] font-medium leading-[38px] tracking-[-0.03em] text-[var(--bm-ink)]">
          매물 {list.length}건
        </h1>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="bm-press inline-flex h-11 items-center gap-2 rounded-[8px] border border-[var(--bm-hairline-strong)] px-4 text-[14px] font-semibold text-[var(--bm-ink)] lg:hidden"
          >
            <SlidersHorizontal size={15} />
            필터
          </button>
          <div className="w-[168px]">
            <Select value={sort} onChange={setSort} options={SORTS} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* 필터 레일 */}
        <aside className={`lg:col-span-3 ${filtersOpen ? "block" : "hidden lg:block"}`}>
          <div className="space-y-7 rounded-[12px] bg-[var(--bm-surface)] p-5">
            <div>
              <SearchInput value={q} onChange={setQ} placeholder="선수, 등번호, 좌석" />
            </div>

            <FilterGroup label="카테고리">
              <div className="flex flex-wrap gap-2">
                {(["전체", "유니폼", "굿즈", "티켓"] as const).map((c) => (
                  <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="구단">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTeamFilter("전체")}
                  className={`bm-swap rounded-[6px] px-2.5 py-2 text-left text-[13px] font-medium ${
                    teamFilter === "전체"
                      ? "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
                      : "bg-[var(--bm-surface-card)] text-[var(--bm-body)] bm-press"
                  }`}
                >
                  전체
                </button>
                {TEAMS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTeamFilter(t.id)}
                    className={`bm-swap flex items-center gap-1.5 rounded-[6px] px-2.5 py-2 text-left text-[13px] font-medium ${
                      teamFilter === t.id
                        ? "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
                        : "bg-[var(--bm-surface-card)] text-[var(--bm-body)] bm-press"
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </FilterGroup>

            {uniformFilters && (
              <>
                <FilterGroup label="유니폼 종류">
                  <div className="flex flex-wrap gap-2">
                    {KINDS.map((k) => (
                      <Chip key={k} label={k} active={kind === k} onClick={() => setKind(k)} />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup label="시즌">
                  <Select value={season} onChange={setSeason} options={SEASONS} />
                </FilterGroup>

                <FilterGroup label="사이즈">
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <Chip key={s} label={s} active={size === s} onClick={() => setSize(s)} />
                    ))}
                  </div>
                </FilterGroup>
              </>
            )}

            <FilterGroup label="상태 등급">
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    active={condition === c}
                    onClick={() => setCondition(c)}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="거래 방식">
              <div className="space-y-3">
                <SwitchRow label="안전거래 가능만" checked={safeOnly} onChange={setSafeOnly} />
                <SwitchRow label="거래완료 숨기기" checked={hideSold} onChange={setHideSold} />
              </div>
            </FilterGroup>

            <div className="rounded-[8px] bg-[var(--bm-canvas)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-ink)]">
                    이 조건 알림 받기
                  </p>
                  <p className="mt-1 text-[12px] leading-[17px] text-[var(--bm-muted)]">
                    조건에 맞는 매물이 올라오면 알려드립니다
                  </p>
                </div>
                <Toggle
                  checked={alarm}
                  onChange={setAlarm}
                  label="검색 조건 알림"
                  size="sm"
                  onClassName="bg-[var(--bm-ink)]"
                  offClassName="bg-[var(--bm-surface-strong)]"
                />
              </div>
              {alarm && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--bm-team-ink)]">
                  <Bell size={12} weight="fill" />
                  저장된 검색 {SAVED_SEARCHES.length + 1}개
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* 결과 */}
        <div className="lg:col-span-9">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Segmented
              options={[
                { key: "전체" as const, label: "전체" },
                { key: "유니폼" as const, label: "유니폼" },
                { key: "굿즈" as const, label: "굿즈" },
                { key: "티켓" as const, label: "티켓" },
              ]}
              value={cat}
              onChange={setCat}
            />
            {teamFilter !== "전체" && (
              <span className="inline-flex items-center gap-1.5">
                <TeamMark id={teamFilter as TeamId} size={22} />
                <Badge tone="neutral">구단 필터 적용</Badge>
              </span>
            )}
            {safeOnly && <Badge tone="success">안전거래만</Badge>}
          </div>

          {list.length === 0 ? (
            <EmptyState
              title="조건에 맞는 매물이 없습니다"
              desc="구단이나 시즌 조건을 넓혀 보세요. 조건 알림을 켜두면 새 매물이 올라올 때 알려드립니다."
            />
          ) : (
            <div className="bm-stagger grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onOpen={() => onOpenListing(l.id)}
                  liked={liked.has(l.id)}
                  onToggleLike={() => onToggleLike(l.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[12px] font-semibold uppercase leading-[17px] tracking-[0.12em] text-[var(--bm-muted)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] leading-[20px] text-[var(--bm-body)]">{label}</span>
      <Toggle
        checked={checked}
        onChange={onChange}
        label={label}
        size="sm"
        onClassName="bg-[var(--bm-ink)]"
        offClassName="bg-[var(--bm-surface-strong)]"
      />
    </div>
  );
}
