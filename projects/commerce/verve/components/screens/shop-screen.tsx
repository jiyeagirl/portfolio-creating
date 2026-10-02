"use client";

import { useMemo, useState } from "react";
import { Heart, MagnifyingGlassPlus, SlidersHorizontal, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { products } from "@/projects/commerce/verve/lib/mock-data";
import type { Product, ProductCategory, WorkoutPurpose } from "@/projects/commerce/verve/lib/types";
import { Button, Divider, PriceTag, RatingStars, SectionHeading } from "@/projects/commerce/verve/components/ui";

const CATEGORIES: ProductCategory[] = ["러닝", "트레이닝", "요가", "아우터", "액세서리"];
const WORKOUTS: WorkoutPurpose[] = ["러닝", "웨이트", "요가/필라테스", "일상 착용"];
const PRICE_BANDS = [
  { id: "under5", label: "5만원 이하", test: (p: number) => p <= 50000 },
  { id: "5to10", label: "5-10만원", test: (p: number) => p > 50000 && p <= 100000 },
  { id: "over10", label: "10만원 이상", test: (p: number) => p > 100000 },
];
const SORTS = [
  { id: "popular", label: "인기순" },
  { id: "newest", label: "최신순" },
  { id: "priceAsc", label: "낮은 가격순" },
  { id: "priceDesc", label: "높은 가격순" },
] as const;

export function ShopScreen({ onNavigate, onAddToCart }: { onNavigate: NavigateFn; onAddToCart: (product: Product) => void }) {
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [workout, setWorkout] = useState<WorkoutPurpose | null>(null);
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickView, setQuickView] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (workout && !p.workoutTypes.includes(workout)) return false;
      if (priceBand) {
        const band = PRICE_BANDS.find((b) => b.id === priceBand);
        if (band && !band.test(p.price)) return false;
      }
      return true;
    });
    if (sort === "newest") list = [...list].filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [category, workout, priceBand, sort]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-muted)]">카테고리</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={category === null} onClick={() => setCategory(null)} label="전체" />
          {CATEGORIES.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)} label={c} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-muted)]">운동 종류</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {WORKOUTS.map((w) => (
            <FilterChip key={w} active={workout === w} onClick={() => setWorkout(workout === w ? null : w)} label={w} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-muted)]">가격대</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <FilterChip key={b.id} active={priceBand === b.id} onClick={() => setPriceBand(priceBand === b.id ? null : b.id)} label={b.label} />
          ))}
        </div>
      </div>
      {(category || workout || priceBand) && (
        <button
          type="button"
          onClick={() => {
            setCategory(null);
            setWorkout(null);
            setPriceBand(null);
          }}
          className="text-[12px] font-medium text-[var(--v-primary)] underline underline-offset-4"
        >
          필터 초기화
        </button>
      )}
    </div>
  );

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading title="Shop" tone="light" body={`${filtered.length}개의 상품`} />

        <div className="mt-10 grid gap-10 md:grid-cols-[220px_1fr]">
          <aside className="hidden md:block">{FilterPanel}</aside>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.65px] text-[var(--v-body-on-light)] md:hidden"
              >
                <SlidersHorizontal size={16} /> 필터
              </button>
              <div className="ml-auto flex items-center gap-1 text-[13px]">
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSort(s.id)}
                    className={`px-2 py-1 ${sort === s.id ? "font-semibold text-[var(--v-body-on-light)]" : "text-[var(--v-muted)]"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <p className="text-[16px] font-medium text-[var(--v-body-on-light)]">조건에 맞는 상품이 없어요</p>
                <p className="text-[13px] text-[var(--v-muted)]">필터를 조정해 다시 시도해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                {filtered.map((p) => (
                  <div key={p.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[var(--v-surface-strong-light)]">
                      <button type="button" onClick={() => onNavigate("productDetail", p.id)} className="block h-full w-full">
                        <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </button>
                      <div className="absolute right-3 top-3 flex flex-col gap-2">
                        <button
                          type="button"
                          aria-label="찜하기"
                          onClick={() => toggleWishlist(p.id)}
                          className="flex h-8 w-8 items-center justify-center bg-white/90 text-[var(--v-body-on-light)] hover:bg-white"
                        >
                          <Heart size={15} weight={wishlist.has(p.id) ? "fill" : "regular"} className={wishlist.has(p.id) ? "text-[var(--v-primary)]" : ""} />
                        </button>
                        <button
                          type="button"
                          aria-label="빠른보기"
                          onClick={() => setQuickView(p)}
                          className="flex h-8 w-8 items-center justify-center bg-white/90 text-[var(--v-body-on-light)] hover:bg-white"
                        >
                          <MagnifyingGlassPlus size={15} />
                        </button>
                      </div>
                      {(p.isNew || p.isBest) && (
                        <span className="absolute left-3 top-3 bg-[var(--v-canvas)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.65px] text-white">
                          {p.isNew ? "New" : "Best"}
                        </span>
                      )}
                    </div>
                    <button type="button" onClick={() => onNavigate("productDetail", p.id)} className="mt-3 block text-left">
                      <p className="text-[12px] text-[var(--v-muted)]">{p.category}</p>
                      <p className="text-[14px] font-medium text-[var(--v-body-on-light)] line-clamp-1">{p.name}</p>
                      <div className="mt-1"><PriceTag price={p.price} originalPrice={p.originalPrice} tone="light" size="sm" /></div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 필터 시트 */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setFiltersOpen(false)}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="verve-light absolute bottom-0 left-0 right-0 max-h-[80dvh] overflow-y-auto p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-[var(--v-body-on-light)]">필터</p>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="닫기"><X size={20} className="text-[var(--v-body-on-light)]" /></button>
              </div>
              {FilterPanel}
              <Button tone="light" className="mt-8 w-full" onClick={() => setFiltersOpen(false)}>
                상품 보기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 빠른보기 모달 */}
      <AnimatePresence>
        {quickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setQuickView(null)}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="verve-light grid w-full max-w-[720px] gap-0 overflow-hidden md:grid-cols-2"
            >
              <div className="aspect-square overflow-hidden bg-[var(--v-surface-strong-light)]">
                <img src={quickView.gallery[0]} alt={quickView.name} className="h-full w-full object-cover" />
              </div>
              <div className="relative p-6">
                <button type="button" onClick={() => setQuickView(null)} aria-label="닫기" className="absolute right-4 top-4">
                  <X size={18} className="text-[var(--v-body-on-light)]" />
                </button>
                <p className="text-[12px] text-[var(--v-muted)]">{quickView.category}</p>
                <p className="mt-1 text-[18px] font-medium text-[var(--v-body-on-light)]">{quickView.name}</p>
                <div className="mt-2"><PriceTag price={quickView.price} originalPrice={quickView.originalPrice} tone="light" /></div>
                <div className="mt-2"><RatingStars rating={quickView.rating} tone="light" /></div>
                <Divider tone="light" className="my-5" />
                <p className="text-[13px] leading-relaxed text-[var(--v-muted)] line-clamp-3">{quickView.description}</p>
                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    tone="light"
                    onClick={() => {
                      onAddToCart(quickView);
                      setQuickView(null);
                    }}
                  >
                    바로 담기
                  </Button>
                  <Button
                    tone="light"
                    variant="outline"
                    onClick={() => {
                      onNavigate("productDetail", quickView.id);
                      setQuickView(null);
                    }}
                  >
                    상세보기
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
        active ? "bg-[var(--v-body-on-light)] text-white" : "bg-[var(--v-surface-strong-light)] text-[var(--v-body-on-light)] hover:bg-[var(--v-hairline-on-light)]"
      }`}
    >
      {label}
    </button>
  );
}
