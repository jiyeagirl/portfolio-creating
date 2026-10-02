"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, ShieldCheck, SlidersHorizontal, X } from "@phosphor-icons/react";
import { BottomNav } from "@/projects/community/enclave/components/bottom-nav";
import { Badge, Chip, EmptyState, ProductCard } from "@/projects/community/enclave/components/ui";
import { MY_COMPLEX, PRODUCTS } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/enclave/lib/navigation";
import type { ProductCategory } from "@/projects/community/enclave/lib/types";

type SortKey = "최신순" | "가격높은순" | "가격낮은순";
const PRICE_PRESETS: { label: string; max: number | null }[] = [
  { label: "전체", max: null },
  { label: "5만원 이하", max: 50000 },
  { label: "30만원 이하", max: 300000 },
  { label: "100만원 이하", max: 1000000 },
];

export function ExploreScreen({
  onOpenProduct,
  onNavigate,
  likedIds,
  onToggleLike,
}: {
  onOpenProduct: (id: string) => void;
  onNavigate: (key: BottomNavKey) => void;
  likedIds: string[];
  onToggleLike: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "전체">("전체");
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("최신순");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => (query ? p.title.includes(query) : true))
      .filter((p) => (category === "전체" ? true : p.category === category))
      .filter((p) => (priceMax === null ? true : p.price <= priceMax));
    if (sort === "가격높은순") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "가격낮은순") list = [...list].sort((a, b) => a.price - b.price);
    else list = [...list].reverse();
    return list;
  }, [query, category, priceMax, sort]);

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-canvas)]">
      <div className="flex-1 overflow-y-auto ec-scroll pb-[92px]">
        <div className="px-5 pb-3 pt-[59px]">
          <div className="relative">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${MY_COMPLEX.name} 상품 검색`}
              className="h-[46px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] pl-10 pr-10 text-[14px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
            />
            {query && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <Badge tone="accent" icon={<ShieldCheck size={12} weight="fill" />}>
            {MY_COMPLEX.name} 인증회원 게시글만
          </Badge>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--ec-body)]"
          >
            <SlidersHorizontal size={14} />
            필터
          </button>
        </div>

        {filtersOpen && (
          <div className="space-y-4 border-y border-[var(--ec-border)] bg-[var(--ec-surface)] px-5 py-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--ec-muted)]">카테고리</p>
              <div className="flex flex-wrap gap-1.5">
                {(["전체", "전자기기", "가구/인테리어", "패션/잡화", "취미/악기", "생활가전", "스포츠/레저"] as const).map((c) => (
                  <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--ec-muted)]">가격대</p>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_PRESETS.map((preset) => (
                  <Chip key={preset.label} label={preset.label} active={priceMax === preset.max} onClick={() => setPriceMax(preset.max)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--ec-muted)]">정렬</p>
              <div className="flex gap-1.5">
                {(["최신순", "가격낮은순", "가격높은순"] as SortKey[]).map((s) => (
                  <Chip key={s} label={s} active={sort === s} onClick={() => setSort(s)} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1 px-3 pt-3">
          {results.length === 0 ? (
            <div className="px-2 pt-6">
              <EmptyState title="검색 결과가 없어요" body="다른 검색어나 필터로 다시 찾아보세요" />
            </div>
          ) : (
            results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onOpenProduct(p.id)}
                liked={likedIds.includes(p.id)}
                onToggleLike={() => onToggleLike(p.id)}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav active="explore" onNavigate={onNavigate} />
    </div>
  );
}
