"use client";

import { useEffect, useMemo, useState } from "react";
import { Lightning, MagnifyingGlass, SmileySad, X } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { CategoryKey, PassTier } from "@/projects/platform/lumi/lib/types";
import { CATEGORY_META, EXPERTS, PASS_PRODUCTS } from "@/projects/platform/lumi/lib/mock-data";
import { ExpertRow } from "@/projects/platform/lumi/components/expert-card";
import { CardSkeleton, EmptyState } from "@/projects/platform/lumi/components/ui";

type SortKey = "popular" | "rating" | "review" | "new";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "rating", label: "평점순" },
  { key: "review", label: "후기순" },
  { key: "new", label: "신규순" },
];

const THEME_QUERY: Record<string, string> = {
  love: "연애",
  career: "이직",
  year: "신년",
  daily: "단답",
};

export function ExpertsScreen({
  onNavigate,
  initialFilter,
  favorites,
  onToggleFavorite,
}: {
  onNavigate: NavigateFn;
  initialFilter?: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const isCategory = (v?: string): v is CategoryKey =>
    v === "saju" || v === "tarot" || v === "sinjeom";

  const [query, setQueryValue] = useState(
    initialFilter && THEME_QUERY[initialFilter] ? THEME_QUERY[initialFilter] : "",
  );
  const [category, setCategoryValue] = useState<CategoryKey | "all">(
    isCategory(initialFilter) ? initialFilter : "all",
  );
  const [onlyAvailable, setOnlyAvailable] = useState(initialFilter === "available");
  const [tier, setTierValue] = useState<PassTier | "all">("all");
  const [sort, setSortValue] = useState<SortKey>("popular");
  const [loading, setLoading] = useState(false);

  /* 필터를 바꾸면 목록을 다시 불러오는 동안 스켈레톤을 보여 준다. */
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const setQuery = (value: string) => {
    setQueryValue(value);
    setLoading(true);
  };
  const setCategory = (value: CategoryKey | "all") => {
    setCategoryValue(value);
    setLoading(true);
  };
  const setTier = (value: PassTier | "all") => {
    setTierValue(value);
    setLoading(true);
  };
  const setSort = (value: SortKey) => {
    setSortValue(value);
    setLoading(true);
  };
  const toggleAvailable = () => {
    setOnlyAvailable((v) => !v);
    setLoading(true);
  };

  const results = useMemo(() => {
    const q = query.trim();
    const list = EXPERTS.filter((e) => {
      if (category !== "all" && e.category !== category && !e.alsoHandles.includes(category))
        return false;
      if (onlyAvailable && e.status !== "available") return false;
      if (tier !== "all" && !e.tiers.includes(tier)) return false;
      if (!q) return true;
      return (
        e.name.includes(q) ||
        e.headline.includes(q) ||
        e.specialties.some((s) => s.includes(q)) ||
        e.styleTags.some((s) => s.includes(q))
      );
    });

    return list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "review") return b.reviewCount - a.reviewCount;
      if (sort === "new") return b.joinedAt.localeCompare(a.joinedAt);
      return b.sessionCount - a.sessionCount;
    });
  }, [query, category, onlyAvailable, tier, sort]);

  const resetAll = () => {
    setQueryValue("");
    setCategoryValue("all");
    setOnlyAvailable(false);
    setTierValue("all");
    setLoading(true);
  };

  return (
    <div className="lm-enter pb-28">
      <header className="sticky top-0 z-20 border-b border-[var(--lm-border)] bg-[var(--lm-elevated)] pt-[71px]">
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--lm-border)] bg-[var(--lm-canvas)] px-4 py-3">
            <MagnifyingGlass size={17} className="shrink-0 text-[var(--lm-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="상담사 이름, 고민 키워드"
              aria-label="상담사 검색"
              className="w-full bg-transparent text-[14px] text-[var(--lm-ink)] outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="검색어 지우기"
                className="text-[var(--lm-muted)]"
              >
                <X size={15} weight="bold" />
              </button>
            )}
          </div>
        </div>

        <div className="lm-scroll-x flex gap-1.5 overflow-x-auto px-5 pb-3">
          {(["all", "saju", "tarot", "sinjeom"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                category === key
                  ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                  : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
              }`}
            >
              {key === "all" ? "전체" : CATEGORY_META[key].label}
            </button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-[var(--lm-border)]" aria-hidden />
          <button
            type="button"
            onClick={toggleAvailable}
            aria-pressed={onlyAvailable}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              onlyAvailable
                ? "bg-[var(--lm-live-soft)] text-[var(--lm-live)]"
                : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
            }`}
          >
            <Lightning size={12} weight="fill" />
            즉시 상담
          </button>
          {PASS_PRODUCTS.map((pass) => (
            <button
              key={pass.tier}
              type="button"
              onClick={() => setTier(tier === pass.tier ? "all" : pass.tier)}
              aria-pressed={tier === pass.tier}
              className={`lm-num shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                tier === pass.tier
                  ? "bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]"
                  : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
              }`}
            >
              {pass.minutes}분
            </button>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between px-5 py-3.5">
        <p className="lm-num text-[13px] text-[var(--lm-muted)]">
          상담사 <span className="font-bold text-[var(--lm-ink)]">{results.length}</span>명
        </p>
        <div className="flex items-center gap-3">
          {SORTS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSort(item.key)}
              className={`text-[12.5px] font-semibold transition-colors ${
                sort === item.key ? "text-[var(--lm-ink)]" : "text-[var(--lm-muted)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 px-5">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SmileySad size={26} />}
            title="조건에 맞는 상담사가 없어요"
            body="필터를 하나만 풀어도 상담사가 다시 나타납니다."
            action="필터 초기화"
            onAction={resetAll}
          />
        ) : (
          results.map((expert) => (
            <ExpertRow
              key={expert.id}
              expert={expert}
              liked={favorites.includes(expert.id)}
              onOpen={() => onNavigate("expertDetail", expert.id)}
              onToggleLike={() => onToggleFavorite(expert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
