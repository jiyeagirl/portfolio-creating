"use client";

import { useState } from "react";
import { Trash } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { coupons, mostReviewed } from "@/projects/commerce/verve/lib/mock-data";
import type { CartItem } from "@/projects/commerce/verve/lib/types";
import { Button, Divider, EmptyState, PriceTag, QuantityStepper, SectionHeading, formatPrice } from "@/projects/commerce/verve/components/ui";

export function CartScreen({
  cart,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: {
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
  onNavigate: NavigateFn;
}) {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 3500;
  const couponDiscount = appliedCoupon === "cp-1" ? Math.round(subtotal * 0.15) : appliedCoupon === "cp-2" ? 5000 : 0;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="verve-light min-h-[70dvh]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
          <EmptyState
            tone="light"
            title="장바구니가 비어있어요"
            body="마음에 드는 상품을 담고 AI 사이즈 추천으로 딱 맞는 사이즈를 확인해보세요."
            action={<Button tone="light" onClick={() => onNavigate("shop")}>쇼핑하러 가기</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading title="장바구니" tone="light" body={`${cart.length}개의 상품`} />

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 border-b border-[var(--v-hairline-on-light)] pb-6">
                <div className="h-28 w-24 shrink-0 overflow-hidden bg-[var(--v-surface-strong-light)]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-[var(--v-body-on-light)]">{item.name}</p>
                      <p className="mt-1 text-[12px] text-[var(--v-muted)]">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <button type="button" aria-label="삭제" onClick={() => onRemove(item.cartId)}>
                      <Trash size={16} className="text-[var(--v-muted)] hover:text-[var(--v-primary)] transition-colors" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityStepper tone="light" value={item.quantity} onChange={(q) => onUpdateQuantity(item.cartId, q)} />
                    <PriceTag tone="light" price={item.price * item.quantity} />
                  </div>
                </div>
              </div>
            ))}

            <div>
              <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">이런 상품은 어때요</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {mostReviewed.slice(0, 4).map((p) => (
                  <button key={p.id} type="button" onClick={() => onNavigate("productDetail", p.id)} className="text-left">
                    <div className="aspect-[3/4] overflow-hidden bg-[var(--v-surface-strong-light)]">
                      <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 text-[12px] font-medium text-[var(--v-body-on-light)] line-clamp-1">{p.name}</p>
                    <PriceTag tone="light" price={p.price} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit border border-[var(--v-hairline-on-light)] p-6">
            <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">쿠폰</p>
            <div className="mt-3 space-y-2">
              {coupons.slice(0, 2).map((c) => (
                <label key={c.id} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-[var(--v-muted)]">
                    <input
                      type="checkbox"
                      checked={appliedCoupon === c.id}
                      onChange={() => setAppliedCoupon(appliedCoupon === c.id ? null : c.id)}
                    />
                    {c.title}
                  </span>
                  <span className="text-[var(--v-body-on-light)]">{c.discount}</span>
                </label>
              ))}
            </div>

            <Divider tone="light" className="my-5" />

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between text-[var(--v-muted)]">
                <span>상품 금액</span>
                <span className="text-[var(--v-body-on-light)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--v-muted)]">
                <span>예상 배송비</span>
                <span className="text-[var(--v-body-on-light)]">{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[var(--v-primary)]">
                  <span>쿠폰 할인</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
            </div>

            <Divider tone="light" className="my-5" />

            <div className="flex items-baseline justify-between">
              <span className="text-[14px] font-medium text-[var(--v-body-on-light)]">총 결제금액</span>
              <span className="v-number text-[22px] font-medium text-[var(--v-body-on-light)]">{formatPrice(total)}</span>
            </div>

            <Button tone="light" className="mt-6 w-full" onClick={() => onNavigate("checkout")}>
              주문하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
