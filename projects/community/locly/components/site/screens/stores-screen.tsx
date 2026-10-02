"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Heart, MapPin, Tag } from "@phosphor-icons/react";
import { STORES } from "@/projects/community/locly/lib/mock-data";
import type { StoreCategory } from "@/projects/community/locly/lib/types";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { CONTAINER, PageHeader, StarRating } from "@/projects/community/locly/components/site/ui";

const CATEGORIES: StoreCategory[] = ["맛집", "카페", "병원", "약국", "미용실", "학원", "생활서비스"];

export function StoresScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [category, setCategory] = useState<StoreCategory | "all">("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const stores = useMemo(
    () => (category === "all" ? STORES : STORES.filter((s) => s.category === category)),
    [category],
  );

  function toggleFavorite(id: string, e: MouseEvent) {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <PageHeader
        title="동네 가게"
        lead="나인동 소상공인과 주민을 잇는 공간입니다. 이웃들이 남긴 후기로 좋은 가게를 찾아보세요."
      />

      <div className="locly-scrollbar-none mt-8 flex items-center gap-1 overflow-x-auto">
        {[{ key: "all" as const, label: "전체" }, ...CATEGORIES.map((c) => ({ key: c, label: c }))].map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
              category === c.key ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate("storeDetail", store.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigate("storeDetail", store.id);
            }}
            className="group flex cursor-pointer flex-col text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
              <Image
                src={store.image}
                alt={store.name}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover"
              />
              <button
                onClick={(e) => toggleFavorite(store.id, e)}
                aria-label={`${store.name} 즐겨찾기`}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lc-canvas)]/90 text-[var(--lc-ink)]"
              >
                <Heart
                  size={15}
                  weight={favorites.has(store.id) ? "fill" : "regular"}
                  className={favorites.has(store.id) ? "text-[var(--lc-primary)]" : ""}
                />
              </button>
              {store.promo && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--lc-primary)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--lc-on-primary)]">
                  <Tag size={10} weight="fill" />
                  이벤트
                </span>
              )}
            </div>

            <div className="mt-5">
              <p className="text-[13px] text-[var(--lc-muted)]">{store.category}</p>
              <p className="mt-1.5 text-[18px] font-medium text-[var(--lc-ink)]">{store.name}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[13px] text-[var(--lc-muted)]">
                <StarRating rating={store.rating} />
                <span className="font-medium text-[var(--lc-ink)]">{store.rating.toFixed(1)}</span>
                <span>후기 {store.reviewCount}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[var(--lc-muted-soft)]">
                <MapPin size={13} />
                {store.distance}
                <span className="text-[var(--lc-hairline)]">·</span>
                {store.tags[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
