"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Heart, MapPin, Tag } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { STORES } from "@/projects/community/locly/lib/mock-data";
import type { StoreCategory } from "@/projects/community/locly/lib/types";
import { Badge, StarRating } from "@/projects/community/locly/components/layout/ui";

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-8 lg:px-10">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">동네 가게</h1>
        <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
          OO동 소상공인과 주민을 잇는 공간이에요
        </p>
      </div>

      <div className="locly-scrollbar-none mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            category === "all" ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              category === c ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate("storeDetail", store.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigate("storeDetail", store.id);
            }}
            className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
          >
            <div className="relative h-[150px] w-full">
              <Image src={store.image} alt={store.name} fill className="object-cover" />
              <button
                onClick={(e) => toggleFavorite(store.id, e)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
              >
                <Heart size={15} weight={favorites.has(store.id) ? "fill" : "regular"} className={favorites.has(store.id) ? "text-[var(--locly-danger)]" : ""} />
              </button>
              {store.promo && (
                <span className="absolute left-3 top-3">
                  <Badge tone="warning">
                    <Tag size={11} />
                    이벤트
                  </Badge>
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <Badge tone="neutral">{store.category}</Badge>
              <p className="mt-1 text-[15px] font-semibold text-[var(--locly-ink)]">{store.name}</p>
              <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--locly-muted)]">
                <StarRating rating={store.rating} />
                {store.rating.toFixed(1)} ({store.reviewCount})
              </div>
              <div className="mt-auto flex items-center justify-between pt-1 text-[12px] text-[var(--locly-muted)]">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {store.distance}
                </span>
                <span>{store.tags[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
