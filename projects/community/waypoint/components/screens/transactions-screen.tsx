"use client";

import { useState } from "react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { EmptyState, ProductCard } from "@/projects/community/waypoint/components/ui";
import { PRODUCTS } from "@/projects/community/waypoint/lib/mock-data";

const LIKED_IDS = ["p1", "p5", "p10"];

const TABS: { key: "liked" | "selling" | "buying"; label: string }[] = [
  { key: "liked", label: "관심상품" },
  { key: "selling", label: "판매내역" },
  { key: "buying", label: "구매내역" },
];

export function TransactionsScreen({
  initialTab,
  onBack,
  onOpenProduct,
}: {
  initialTab: "liked" | "selling" | "buying";
  onBack: () => void;
  onOpenProduct: (id: string) => void;
}) {
  const [tab, setTab] = useState(initialTab);

  const list =
    tab === "liked"
      ? PRODUCTS.filter((p) => LIKED_IDS.includes(p.id))
      : tab === "selling"
        ? PRODUCTS.filter((p) => p.sellerId === "me")
        : PRODUCTS.filter((p) => p.id === "p8");

  return (
    <div className="waypoint flex h-full flex-col bg-[var(--wp-surface)]">
      <ScreenHeader
        title="거래 내역"
        onBack={onBack}
        className="bg-[var(--wp-surface)] border-[var(--wp-border)]"
        backButtonClassName="text-[var(--wp-ink)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wp-ink)]"
      />
      <div className="flex gap-1 border-b border-[var(--wp-border)] px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key}
            className={`relative px-3 pb-3 pt-3 text-[13.5px] transition-colors ${
              tab === t.key ? "font-semibold text-[var(--wp-ink)]" : "text-[var(--wp-muted)]"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--wp-accent)]" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {list.length === 0 ? (
          <div className="px-3 pt-6">
            <EmptyState title="아직 내역이 없어요" body="상품을 둘러보고 관심상품을 등록해보세요" />
          </div>
        ) : (
          <div className="divide-y divide-[var(--wp-border)]">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => onOpenProduct(p.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
