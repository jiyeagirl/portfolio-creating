"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import {
  Badge,
  CategoryTab,
  EmptyState,
  PriceTag,
  ProductTile,
  Stars,
  inputClass,
} from "@/projects/commerce/pawfit/components/ui";
import { PRODUCTS } from "@/projects/commerce/pawfit/lib/mock-data";
import type { ProductCategory } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

const CATEGORIES: ProductCategory[] = ["니트", "레인코트", "하네스", "반다나", "부츠", "잠옷"];
type TabValue = "전체" | ProductCategory;

export function ProductListScreen({
  category,
  onNavigate,
}: {
  category?: string;
  onNavigate: NavigateFn;
}) {
  const initialTab: TabValue =
    category && (CATEGORIES as string[]).includes(category) ? (category as ProductCategory) : "전체";
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeTab === "전체" || p.category === activeTab;
      const matchesSearch = search.trim().length === 0 || p.name.includes(search.trim());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <div className="sticky top-0 z-20 border-b border-[var(--pf-hairline)] bg-[var(--pf-canvas)] pt-[59px]">
        <div className="px-5 pb-3">
          <h1 className="text-[20px] font-medium tracking-[-0.02em] text-[var(--pf-ink)]">쇼핑</h1>
          <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
            {activeTab === "전체" ? "전체 상품" : activeTab}
            {" "}
            {filtered.length}개
          </p>
        </div>

        <div className="px-5 pb-3">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="상품명으로 검색"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="pf-scroll-x flex gap-1 overflow-x-auto px-4 pb-3">
          <CategoryTab active={activeTab === "전체"} onClick={() => setActiveTab("전체")}>
            전체
          </CategoryTab>
          {CATEGORIES.map((cat) => (
            <CategoryTab key={cat} active={activeTab === cat} onClick={() => setActiveTab(cat)}>
              {cat}
            </CategoryTab>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass size={22} weight="bold" />}
            title="검색 결과가 없어요"
            body="다른 검색어나 카테고리로 다시 찾아보세요."
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {filtered.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onNavigate("productDetail", product.id)}
                className="flex flex-col items-start text-left transition-transform active:scale-[0.97]"
              >
                <div className="relative w-full">
                  <ProductTile
                    category={product.category}
                    tint={product.brandTint}
                    colorways={product.colorways}
                    image={product.image}
                    alt={product.name}
                    size={168}
                    className="w-full"
                  />
                  {(product.isNew || product.isPopular) && (
                    <span className="absolute left-2 top-2">
                      <Badge tone={product.isNew ? "accent" : "success"} onLight>
                        {product.isNew ? "신상품" : "베스트"}
                      </Badge>
                    </span>
                  )}
                </div>
                <p className="mt-2.5 line-clamp-1 text-[13.5px] font-semibold text-[var(--pf-ink)]">{product.name}</p>
                <div className="mt-1">
                  <PriceTag price={product.price} listPrice={product.listPrice} size="sm" />
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Stars rating={product.rating} size={10} />
                  <span className="text-[11.5px] text-[var(--pf-muted)]">({product.reviewCount})</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
