"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, Scales, SlidersHorizontal, X } from "@phosphor-icons/react";
import { VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { VendorCategory } from "@/projects/community/wedit/lib/types";
import { EmptyState } from "@/projects/community/wedit/components/ui";
import { VendorCard } from "@/projects/community/wedit/components/vendor-card";

type CategoryFilter = "all" | VendorCategory;
type SortMode = "popular" | "rating" | "priceAsc" | "reviewCount";

const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "studio", label: "스튜디오" },
  { key: "dress", label: "드레스" },
  { key: "makeup", label: "메이크업" },
];

const SORT_LABEL: Record<SortMode, string> = {
  popular: "인기순",
  rating: "평점순",
  priceAsc: "실결제가 낮은 순",
  reviewCount: "리뷰 많은 순",
};

export function ExploreScreen({
  onNavigate,
  initialCategory,
  initialBookmarks,
}: {
  onNavigate: NavigateFn;
  initialCategory?: string;
  initialBookmarks?: Set<string>;
}) {
  const isRealCategory = (v?: string): v is VendorCategory =>
    v === "studio" || v === "dress" || v === "makeup";

  const [category, setCategory] = useState<CategoryFilter>(
    isRealCategory(initialCategory) ? initialCategory : "all",
  );
  const [sort, setSort] = useState<SortMode>(initialCategory === "budget" ? "priceAsc" : "popular");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(initialBookmarks ?? new Set());

  const results = useMemo(() => {
    let list = VENDORS.filter((v) => (category === "all" ? true : v.category === category));
    if (query.trim()) {
      const q = query.trim();
      list = list.filter((v) => v.name.includes(q) || v.region.includes(q));
    }
    if (minRating > 0) list = list.filter((v) => v.ratingAvg >= minRating);
    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.ratingAvg - a.ratingAvg;
      if (sort === "priceAsc") return a.avgPaidPrice - b.avgPaidPrice;
      if (sort === "reviewCount") return b.reviewCount - a.reviewCount;
      return b.verifiedCount - a.verifiedCount;
    });
    return list;
  }, [category, query, minRating, sort]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id],
    );
  };
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-full w-full flex-col pb-[108px] pt-[68px]">
      <div className="flex flex-col gap-3 px-5">
        <div className="flex h-11 items-center gap-2 rounded-full border border-[var(--wd-border)] bg-white px-4">
          <MagnifyingGlass size={17} className="text-[var(--wd-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="지역, 업체명으로 검색"
            className="h-full flex-1 bg-transparent text-[13.5px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="지우기">
              <X size={15} className="text-[var(--wd-muted)]" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCategory(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                category === tab.key
                  ? "bg-[var(--wd-ink)] text-white"
                  : "bg-white text-[var(--wd-body)] border border-[var(--wd-border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--wd-muted)]">
            <SlidersHorizontal size={13} />
            <span>평점</span>
            {[4.5, 4.8].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(minRating === r ? 0 : r)}
                className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                  minRating === r
                    ? "bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
                    : "bg-[var(--wd-surface-tint)] text-[var(--wd-body)]"
                }`}
              >
                {r}+
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-full border border-[var(--wd-border)] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[var(--wd-body)] outline-none"
          >
            {(Object.keys(SORT_LABEL) as SortMode[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="px-5 pt-4 text-[12px] text-[var(--wd-muted)]">
        총 <span className="font-semibold text-[var(--wd-ink)]">{results.length}</span>개 업체
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<MagnifyingGlass size={24} weight="duotone" />}
          title="조건에 맞는 업체가 없어요"
          body="검색어나 필터를 조정해서 다시 찾아보세요."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 px-5 pt-3">
          {results.map((v) => (
            <VendorCard
              key={v.id}
              vendor={v}
              onClick={() => onNavigate("vendorDetail", { id: v.id })}
              bookmarked={bookmarks.has(v.id)}
              onToggleBookmark={() => toggleBookmark(v.id)}
              compareSelected={compareIds.includes(v.id)}
              onToggleCompare={() => toggleCompare(v.id)}
            />
          ))}
        </div>
      )}

      {compareIds.length > 0 && (
        <div className="absolute inset-x-4 bottom-[100px] z-30 flex items-center gap-3 rounded-full bg-[var(--wd-ink)] py-2 pl-4 pr-2 shadow-[0_12px_30px_-10px_rgba(36,16,25,0.5)]">
          <Scales size={16} weight="fill" className="shrink-0 text-white" />
          <span className="flex-1 text-[12.5px] font-medium text-white">
            {compareIds.length}개 업체 선택됨
          </span>
          <button
            type="button"
            onClick={() => onNavigate("compare", { ids: compareIds })}
            className="shrink-0 rounded-full bg-[var(--wd-accent)] px-4 py-2 text-[12.5px] font-semibold text-white active:bg-[var(--wd-accent-strong)]"
          >
            비교하기
          </button>
        </div>
      )}
    </div>
  );
}
