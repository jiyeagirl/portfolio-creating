"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Bell, CaretRight, Plus } from "@phosphor-icons/react";
import { BottomNav } from "@/projects/community/enclave/components/bottom-nav";
import { Chip, ProductCard, SectionTitle, formatWon } from "@/projects/community/enclave/components/ui";
import { MY_COMPLEX, PRODUCTS, picsumId } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/enclave/lib/navigation";
import type { ProductCategory } from "@/projects/community/enclave/lib/types";

const CATEGORIES: (ProductCategory | "전체")[] = ["전체", "전자기기", "가구/인테리어", "패션/잡화", "취미/악기", "생활가전", "스포츠/레저"];

export function HomeScreen({
  onOpenProduct,
  onNavigate,
  onCreatePost,
  likedIds,
  onToggleLike,
}: {
  onOpenProduct: (id: string) => void;
  onNavigate: (key: BottomNavKey) => void;
  onCreatePost: () => void;
  likedIds: string[];
  onToggleLike: (id: string) => void;
}) {
  const [category, setCategory] = useState<ProductCategory | "전체">("전체");

  const popular = useMemo(() => [...PRODUCTS].sort((a, b) => b.likeCount - a.likeCount).slice(0, 6), []);
  const feed = useMemo(
    () => PRODUCTS.filter((p) => (category === "전체" ? true : p.category === category)).slice().reverse(),
    [category],
  );

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-canvas)]">
      <div className="flex-1 overflow-y-auto ec-scroll pb-[110px]">
        <header className="flex items-center justify-between px-5 pb-3 pt-[59px]">
          <div>
            <p className="text-[12px] font-medium text-[var(--ec-muted)]">내 단지</p>
            <p className="text-[17px] font-bold tracking-[-0.01em] text-[var(--ec-ink)]">{MY_COMPLEX.name}</p>
          </div>
          <button
            type="button"
            aria-label="알림"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ec-surface)] text-[var(--ec-body)] transition-colors active:bg-[var(--ec-surface-soft)]"
          >
            <Bell size={18} />
          </button>
        </header>

        <div className="flex gap-1.5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
          ))}
        </div>

        <section className="px-5 pb-6">
          <SectionTitle
            title="지금 인기있는 물건"
            action={
              <button
                type="button"
                onClick={() => onNavigate("explore")}
                className="flex items-center gap-0.5 text-[12.5px] font-medium text-[var(--ec-muted)]"
              >
                더보기
                <CaretRight size={12} />
              </button>
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popular.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProduct(p.id)}
                className="w-[132px] shrink-0 text-left"
              >
                <span className="relative block h-[132px] w-[132px] overflow-hidden rounded-[14px] bg-[var(--ec-surface-sunken)]">
                  <Image src={picsumId(p.photoId, 280, 280)} alt={p.title} fill sizes="132px" className="object-cover" />
                </span>
                <p className="mt-2 truncate text-[13px] font-medium text-[var(--ec-ink)]">{p.title}</p>
                <p className="tabular-nums text-[13.5px] font-semibold text-[var(--ec-ink)]">{formatWon(p.price)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="px-3 pb-8">
          <div className="px-2">
            <SectionTitle title="최신 게시글" />
          </div>
          <div className="space-y-1">
            {feed.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onOpenProduct(p.id)}
                liked={likedIds.includes(p.id)}
                onToggleLike={() => onToggleLike(p.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={onCreatePost}
        aria-label="상품 등록"
        className="absolute bottom-[102px] right-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ec-accent)] text-white shadow-[var(--ec-shadow-pop)] transition-transform active:scale-95"
      >
        <Plus size={24} weight="bold" />
      </button>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
