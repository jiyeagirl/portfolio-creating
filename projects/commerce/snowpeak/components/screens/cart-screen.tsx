"use client";

import { useState } from "react";
import { CaretRight, ShoppingBagOpen, Tag, TrashSimple } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  BottomSheet,
  Card,
  EmptyState,
  PriceTag,
  PrimaryButton,
  SectionHead,
  Stepper,
  inputClass,
} from "@/projects/commerce/snowpeak/components/ui";
import { COUPONS, USER_PROFILE, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem, CartItemKind, Coupon } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

const KIND_LABEL: Record<CartItemKind, string> = {
  room: "객실",
  lift: "리프트권",
  season: "시즌권",
  rental: "장비 렌탈",
  package: "패키지",
};

function couponDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minAmount) return 0;
  return coupon.discountType === "정액" ? coupon.discount : Math.round((subtotal * coupon.discount) / 100);
}

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
  const [couponSheetOpen, setCouponSheetOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [pointsInput, setPointsInput] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = selectedCoupon ? couponDiscount(selectedCoupon, subtotal) : 0;
  const afterCoupon = Math.max(0, subtotal - discountAmount);
  const maxUsablePoints = Math.min(USER_PROFILE.pointBalance, afterCoupon);
  const pointsUsed = Math.min(pointsInput, maxUsablePoints);
  const total = Math.max(0, afterCoupon - pointsUsed);

  const eligibleCoupons = COUPONS.filter((c) => !c.used && c.minAmount <= subtotal);

  function handlePointsChange(raw: string) {
    const parsed = Number(raw.replace(/[^0-9]/g, ""));
    if (Number.isNaN(parsed)) {
      setPointsInput(0);
      return;
    }
    setPointsInput(Math.max(0, Math.min(parsed, maxUsablePoints)));
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      {cart.length === 0 ? (
        <>
          <AppBar title="장바구니" onBack={() => onNavigate("bookHub")} />
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<ShoppingBagOpen size={22} weight="bold" />}
              title="장바구니가 비어있어요"
              body="객실, 리프트권, 렌탈 상품을 담으면 이곳에서 한 번에 결제할 수 있어요."
              action="예약 상품 담으러 가기"
              onAction={() => onNavigate("bookHub")}
            />
          </div>
        </>
      ) : (
        <>
          <AppBar
            title="장바구니"
            subtitle={`${cart.length}개 상품 담김`}
            onBack={() => onNavigate("bookHub")}
          />

          <div className="flex-1 overflow-y-auto pb-6">
            <div className="mt-5">
              <SectionHead
                title="예약 상품"
                note={`객실, 리프트권, 렌탈을 하나의 장바구니에서 통합 예약해요 (${cart.length}개)`}
              />
              <div className="space-y-2.5 px-5">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Badge tone="neutral">{KIND_LABEL[item.kind]}</Badge>
                        <p className="mt-1.5 truncate text-[14.5px] font-semibold text-[var(--sp-ink)]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-[var(--sp-mute)]">
                          {item.detail}
                          {item.size ? ` | ${item.size}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.cartId)}
                        aria-label="상품 삭제"
                        className="shrink-0 rounded-full p-1.5 text-[var(--sp-mute)] transition-transform active:scale-[0.9]"
                      >
                        <TrashSimple size={16} weight="bold" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Stepper
                        value={item.quantity}
                        onChange={(next) => onUpdateQuantity(item.cartId, next)}
                        min={1}
                        max={20}
                      />
                      <span className="sp-num text-[14.5px] font-semibold text-[var(--sp-ink)]">
                        {formatWon(item.unitPrice * item.quantity)}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SectionHead title="쿠폰 및 포인트" />
              <div className="space-y-2.5 px-5">
                <button
                  type="button"
                  onClick={() => setCouponSheetOpen(true)}
                  className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-4 text-left transition-colors active:bg-[var(--sp-surface-soft)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
                    <Tag size={15} weight="bold" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-semibold text-[var(--sp-ink)]">
                      {selectedCoupon ? selectedCoupon.label : "쿠폰 선택"}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--sp-mute)]">
                      {eligibleCoupons.length > 0
                        ? `사용 가능 쿠폰 ${eligibleCoupons.length}장`
                        : "사용 가능한 쿠폰이 없어요"}
                    </span>
                  </span>
                  {selectedCoupon ? (
                    <span className="sp-num shrink-0 text-[13.5px] font-semibold text-[var(--sp-accent)]">
                      -{formatWon(discountAmount)}원
                    </span>
                  ) : (
                    <CaretRight size={14} className="shrink-0 text-[var(--sp-mute)]" />
                  )}
                </button>

                <div className="rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--sp-ink)]">포인트 사용</span>
                    <span className="text-[12px] text-[var(--sp-mute)]">
                      보유 {formatWon(USER_PROFILE.pointBalance)}P
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      inputMode="numeric"
                      value={pointsInput === 0 ? "" : String(pointsInput)}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      placeholder="0"
                      className={`${inputClass} sp-num`}
                    />
                    <button
                      type="button"
                      onClick={() => setPointsInput(maxUsablePoints)}
                      className="shrink-0 rounded-[12px] border border-[var(--sp-border-strong)] px-3.5 py-3 text-[13px] font-semibold text-[var(--sp-ink)] transition-colors active:bg-[var(--sp-surface-soft)]"
                    >
                      모두 사용
                    </button>
                  </div>
                  <p className="mt-2 text-[11.5px] text-[var(--sp-mute)]">
                    최대 {formatWon(maxUsablePoints)}P까지 사용할 수 있어요
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 px-5">
              <Card className="space-y-2.5">
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-[var(--sp-mute)]">상품 금액</span>
                  <span className="sp-num text-[var(--sp-ink)]">{formatWon(subtotal)}원</span>
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-[var(--sp-mute)]">쿠폰 할인</span>
                  <span className="sp-num text-[var(--sp-ink)]">
                    {discountAmount > 0 ? `-${formatWon(discountAmount)}원` : `${formatWon(0)}원`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-[var(--sp-mute)]">포인트 사용</span>
                  <span className="sp-num text-[var(--sp-ink)]">
                    {pointsUsed > 0 ? `-${formatWon(pointsUsed)}원` : `${formatWon(0)}원`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--sp-border)] pt-2.5">
                  <span className="text-[14px] font-semibold text-[var(--sp-ink)]">결제 예정 금액</span>
                  <span className="sp-num text-[18px] font-semibold text-[var(--sp-ink)]">
                    {formatWon(total)}원
                  </span>
                </div>
              </Card>
            </div>
          </div>

          <div className="border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] text-[var(--sp-mute)]">총 결제 금액</span>
              <PriceTag price={total} size="lg" />
            </div>
            <PrimaryButton onClick={() => onNavigate("payment")}>결제하기</PrimaryButton>
          </div>

          <BottomSheet open={couponSheetOpen} title="쿠폰 선택" onClose={() => setCouponSheetOpen(false)}>
            <div className="space-y-2 pb-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCoupon(null);
                  setCouponSheetOpen(false);
                }}
                className={`w-full rounded-[12px] border p-4 text-left transition-colors ${
                  selectedCoupon === null
                    ? "border-[var(--sp-ink)] bg-[var(--sp-surface-soft)]"
                    : "border-[var(--sp-border)] bg-[var(--sp-surface)]"
                }`}
              >
                <span className="text-[14px] font-semibold text-[var(--sp-ink)]">쿠폰 사용 안 함</span>
              </button>

              {eligibleCoupons.length === 0 ? (
                <p className="px-1 py-6 text-center text-[13px] text-[var(--sp-mute)]">
                  현재 담긴 상품에 적용 가능한 쿠폰이 없어요.
                </p>
              ) : (
                eligibleCoupons.map((coupon) => {
                  const active = selectedCoupon?.id === coupon.id;
                  const amount = couponDiscount(coupon, subtotal);
                  return (
                    <button
                      key={coupon.id}
                      type="button"
                      onClick={() => {
                        setSelectedCoupon(coupon);
                        setCouponSheetOpen(false);
                      }}
                      className={`w-full rounded-[12px] border p-4 text-left transition-colors ${
                        active
                          ? "border-[var(--sp-ink)] bg-[var(--sp-surface-soft)]"
                          : "border-[var(--sp-border)] bg-[var(--sp-surface)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[14px] font-semibold text-[var(--sp-ink)]">{coupon.label}</span>
                        <span className="sp-num text-[13.5px] font-semibold text-[var(--sp-accent)]">
                          -{formatWon(amount)}원
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-[var(--sp-mute)]">
                        {formatWon(coupon.minAmount)}원 이상 구매 시, {coupon.expiresAt}까지
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </BottomSheet>
        </>
      )}
    </div>
  );
}
