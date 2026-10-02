"use client";

import { useState } from "react";
import { Check, Moon } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  Card,
  PhotoTile,
  PriceTag,
  PrimaryButton,
} from "@/projects/commerce/snowpeak/components/ui";
import { PACKAGES } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

export function PackageScreen({
  packageId,
  onNavigate,
  onAddToCart,
}: {
  packageId?: string;
  onNavigate: NavigateFn;
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(packageId);
  const selectedPkg = selectedId ? PACKAGES.find((pkg) => pkg.id === selectedId) : undefined;

  function handleBack() {
    // 내부 리스트에서 눌러 상세로 넘어온 경우 리스트로, 그 외에는 예약 허브로.
    if (selectedPkg && !packageId) {
      setSelectedId(undefined);
      return;
    }
    onNavigate("bookHub");
  }

  function handleReserve() {
    if (!selectedPkg) return;
    onAddToCart({
      cartId: crypto.randomUUID(),
      kind: "package",
      refId: selectedPkg.id,
      name: selectedPkg.name,
      detail: `${selectedPkg.nights}박 패키지`,
      quantity: 1,
      unitPrice: selectedPkg.price,
    });
    onNavigate("cart");
  }

  if (selectedPkg) {
    const lowStock = selectedPkg.stock <= 10;
    return (
      <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
        <AppBar title={selectedPkg.name} onBack={handleBack} />

        <div className="flex-1 overflow-y-auto pb-6">
          <PhotoTile id={selectedPkg.photo} alt={selectedPkg.name} className="h-[220px] w-full" />

          <div className="px-5 pt-5">
            <div className="flex items-center gap-1.5">
              <Badge tone="ink">{selectedPkg.tag}</Badge>
              <Badge tone={lowStock ? "warn" : "success"}>
                {lowStock ? `잔여 ${selectedPkg.stock}건` : "예약 가능"}
              </Badge>
            </div>

            <h1 className="mt-2.5 text-[22px] font-semibold tracking-[-0.02em] text-[var(--sp-ink)]">
              {selectedPkg.name}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--sp-mute)]">
              <Moon size={13} weight="bold" />
              {selectedPkg.nights}박 구성
            </p>

            <div className="mt-4">
              <PriceTag price={selectedPkg.price} listPrice={selectedPkg.listPrice} size="lg" />
            </div>

            <Card className="mt-5 border border-[var(--sp-border)]">
              <p className="text-[13px] font-semibold text-[var(--sp-ink)]">포함 구성</p>
              <ul className="mt-3 flex flex-col gap-2">
                {selectedPkg.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13.5px] text-[var(--sp-body)]">
                    <Check size={13} weight="bold" className="shrink-0 text-[var(--sp-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="mt-6">
              <p className="text-[13px] font-semibold text-[var(--sp-ink)]">상품 안내</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sp-body)]">{selectedPkg.description}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 pb-6 pt-3.5">
          <div className="mb-3 flex items-center justify-between text-[13px]">
            <span className="text-[var(--sp-mute)]">총 결제 예정 금액</span>
            <PriceTag price={selectedPkg.price} size="md" />
          </div>
          <PrimaryButton onClick={handleReserve}>패키지 예약하기</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="패키지" subtitle="숙박부터 리프트권까지 한번에" onBack={handleBack} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        <div className="flex flex-col gap-4">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setSelectedId(pkg.id)}
              className="text-left transition-transform active:scale-[0.98]"
            >
              <Card padded={false} className="overflow-hidden border border-[var(--sp-border)]">
                <PhotoTile id={pkg.photo} alt={pkg.name} className="h-[160px] w-full" />
                <div className="p-4">
                  <div className="flex items-center gap-1.5">
                    <Badge tone="ink">{pkg.tag}</Badge>
                    <span className="flex items-center gap-1 text-[11.5px] text-[var(--sp-mute)]">
                      <Moon size={12} weight="bold" />
                      {pkg.nights}박
                    </span>
                  </div>
                  <h3 className="mt-2 text-[16px] font-semibold text-[var(--sp-ink)]">{pkg.name}</h3>
                  <p className="mt-1 line-clamp-1 text-[12.5px] text-[var(--sp-mute)]">
                    {pkg.includes.join(", ")}
                  </p>
                  <div className="mt-2.5">
                    <PriceTag price={pkg.price} listPrice={pkg.listPrice} size="md" />
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
