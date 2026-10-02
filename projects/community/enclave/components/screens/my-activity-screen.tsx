"use client";

import { useState } from "react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { EmptyState, ProductCard } from "@/projects/community/enclave/components/ui";
import { PRODUCTS } from "@/projects/community/enclave/lib/mock-data";

type ActivityTab = "판매내역" | "구매내역" | "찜목록";
const TABS: ActivityTab[] = ["판매내역", "구매내역", "찜목록"];
const PURCHASED_IDS = ["p8"];

export function MyActivityScreen({
  initialTab,
  onBack,
  onOpenProduct,
  likedIds,
  onToggleLike,
}: {
  initialTab: ActivityTab;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
  likedIds: string[];
  onToggleLike: (id: string) => void;
}) {
  const [tab, setTab] = useState<ActivityTab>(initialTab);

  const list =
    tab === "판매내역"
      ? PRODUCTS.filter((p) => p.sellerId === "me")
      : tab === "구매내역"
        ? PRODUCTS.filter((p) => PURCHASED_IDS.includes(p.id))
        : PRODUCTS.filter((p) => likedIds.includes(p.id));

  const emptyCopy: Record<ActivityTab, { title: string; body: string }> = {
    판매내역: { title: "판매한 상품이 없어요", body: "홈 화면에서 첫 상품을 등록해보세요" },
    구매내역: { title: "구매한 상품이 없어요", body: "탐색 탭에서 마음에 드는 상품을 찾아보세요" },
    찜목록: { title: "찜한 상품이 없어요", body: "관심있는 상품에 하트를 눌러보세요" },
  };

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-surface)]">
      <ScreenHeader
        title="내 활동"
        onBack={onBack}
        className="bg-[var(--ec-surface)] border-[var(--ec-border)]"
        backButtonClassName="text-[var(--ec-ink)] hover:bg-[var(--ec-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--ec-ink)]"
      />

      <div className="flex border-b border-[var(--ec-border)] px-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`relative flex-1 px-2 py-3 text-[13.5px] transition-colors ${
              tab === t ? "font-semibold text-[var(--ec-ink)]" : "text-[var(--ec-muted)]"
            }`}
          >
            {t}
            {tab === t && <span className="absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-[var(--ec-accent)]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto ec-scroll px-2 pb-8 pt-2">
        {list.length === 0 ? (
          <div className="px-4 pt-8">
            <EmptyState title={emptyCopy[tab].title} body={emptyCopy[tab].body} />
          </div>
        ) : (
          <div className="space-y-1">
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onOpenProduct(p.id)}
                liked={likedIds.includes(p.id)}
                onToggleLike={() => onToggleLike(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
