"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  Field,
  GhostButton,
  PrimaryButton,
  ProductTile,
  SectionHead,
  inputClass,
} from "@/projects/commerce/pawfit/components/ui";
import {
  ADDRESSES,
  COUPONS,
  PAYMENT_METHODS_PF,
  PRODUCT_BY_ID,
  formatWon,
} from "@/projects/commerce/pawfit/lib/mock-data";
import type { CartItem, Coupon, Order, OrderItem } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

/** 반경 있는 라디오 인디케이터. 배송지/쿠폰/결제수단 선택 리스트 공용. */
function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        active ? "border-[var(--pf-ink)]" : "border-[var(--pf-hairline)]"
      }`}
    >
      {active && <span className="h-2 w-2 rounded-full bg-[var(--pf-ink)]" />}
    </span>
  );
}

function couponDiscountAmount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minAmount) return 0;
  return coupon.discount <= 1 ? Math.round(subtotal * coupon.discount) : coupon.discount;
}

export function CheckoutScreen({
  cart,
  onNavigate,
  onPlaceOrder,
}: {
  cart: CartItem[];
  onNavigate: NavigateFn;
  onPlaceOrder: (order: Order) => void;
}) {
  const defaultAddress = ADDRESSES.find((a) => a.isDefault) ?? ADDRESSES[0];
  const defaultPayment = PAYMENT_METHODS_PF.find((p) => p.isDefault) ?? PAYMENT_METHODS_PF[0];

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? "");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addAddressSaved, setAddAddressSaved] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");

  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(defaultPayment?.id ?? "");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const availableCoupons = COUPONS.filter((c) => !c.used);
  const selectedAddress = ADDRESSES.find((a) => a.id === selectedAddressId);
  const selectedCoupon = selectedCouponId
    ? availableCoupons.find((c) => c.id === selectedCouponId) ?? null
    : null;

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCT_BY_ID[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const discountAmount = selectedCoupon ? couponDiscountAmount(selectedCoupon, subtotal) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  function handlePlaceOrder() {
    const orderItems: OrderItem[] = cart.map((item) => {
      const product = PRODUCT_BY_ID[item.productId];
      return {
        productId: item.productId,
        productName: product?.name ?? "상품",
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: product?.price ?? 0,
      };
    });
    const order: Order = {
      id: `ord-new-${cart[0]?.productId ?? "checkout"}`,
      items: orderItems,
      totalAmount: finalTotal,
      status: "결제완료",
      orderedAt: "2026-07-30",
      addressLabel: selectedAddress?.label ?? "",
    };
    onPlaceOrder(order);
    setOrderPlaced(true);
  }

  if (orderPlaced) {
    return (
      <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
        <AppBar title="주문서" onBack={() => onNavigate("cart")} />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-ink)]">
            <CheckCircle size={30} weight="fill" />
          </span>
          <div>
            <p className="text-[18px] font-semibold text-[var(--pf-ink)]">주문이 완료되었습니다</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--pf-muted)]">
              결제가 정상적으로 처리됐어요. 주문내역에서 배송 상태를 확인할 수 있어요.
            </p>
          </div>
          <div className="mt-1 w-full rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4 text-left">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--pf-muted)]">결제 금액</span>
              <span className="pf-num font-semibold text-[var(--pf-ink)]">{formatWon(finalTotal)}원</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-[var(--pf-muted)]">배송지</span>
              <span className="text-[var(--pf-ink)]">{selectedAddress?.label ?? "-"}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
          <PrimaryButton onClick={() => onNavigate("orderHistory")}>주문내역 보기</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="주문서" subtitle="결제 전 내용을 확인해주세요" onBack={() => onNavigate("cart")} />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* 주문 상품 확인 */}
        <SectionHead title="주문 상품" note={`${cart.length}개`} />
        <div className="px-5">
          <div className="space-y-2.5">
            {cart.map((item) => {
              const product = PRODUCT_BY_ID[item.productId];
              if (!product) return null;
              return (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-3"
                >
                  <ProductTile
                    category={product.category}
                    tint={product.brandTint}
                    colorways={product.colorways}
                    image={product.image}
                    alt={product.name}
                    size={64}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="truncate text-[14px] font-semibold text-[var(--pf-ink)]">{product.name}</p>
                    <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                      {item.color} | {item.size} | {item.quantity}개
                    </p>
                    <p className="pf-num mt-1.5 text-[14px] font-semibold text-[var(--pf-ink)]">
                      {formatWon(product.price * item.quantity)}원
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 배송지 관리 */}
        <div className="mt-6">
          <SectionHead title="배송지" />
          <div className="px-5 space-y-2">
            {ADDRESSES.map((addr) => {
              const active = selectedAddressId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`w-full rounded-[16px] border p-4 text-left transition-colors ${
                    active
                      ? "border-[var(--pf-ink)] bg-[var(--pf-surface-soft)]"
                      : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioDot active={active} />
                    <span className="text-[14px] font-semibold text-[var(--pf-ink)]">{addr.label}</span>
                    {addr.isDefault && <Badge tone="neutral">기본 배송지</Badge>}
                  </div>
                  <p className="mt-1.5 pl-6 text-[13px] text-[var(--pf-body)]">
                    {addr.recipient} | {addr.phone}
                  </p>
                  <p className="mt-0.5 pl-6 text-[13px] text-[var(--pf-muted)]">{addr.address}</p>
                </button>
              );
            })}

            <GhostButton onClick={() => setShowAddAddress((v) => !v)}>새 배송지 추가</GhostButton>

            {showAddAddress && (
              <div className="rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
                {addAddressSaved ? (
                  <p className="text-[13.5px] font-semibold text-[var(--pf-success)]">저장되었습니다</p>
                ) : (
                  <div className="space-y-3">
                    <Field label="받는 사람">
                      <input
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        placeholder="이름을 입력하세요"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="연락처">
                      <input
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="배송지 주소">
                      <input
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        placeholder="도로명 주소를 입력하세요"
                        className={inputClass}
                      />
                    </Field>
                    <PrimaryButton onClick={() => setAddAddressSaved(true)}>저장</PrimaryButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 쿠폰 적용 */}
        <div className="mt-6">
          <SectionHead title="쿠폰" note={`사용 가능 쿠폰 ${availableCoupons.length}장`} />
          <div className="px-5 space-y-2">
            <button
              type="button"
              onClick={() => setSelectedCouponId(null)}
              className={`flex w-full items-center gap-2 rounded-[16px] border p-4 text-left transition-colors ${
                selectedCouponId === null
                  ? "border-[var(--pf-ink)] bg-[var(--pf-surface-soft)]"
                  : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
              }`}
            >
              <RadioDot active={selectedCouponId === null} />
              <span className="text-[14px] font-semibold text-[var(--pf-ink)]">쿠폰 사용 안 함</span>
            </button>

            {availableCoupons.map((coupon) => {
              const eligible = subtotal >= coupon.minAmount;
              const active = selectedCouponId === coupon.id;
              const amount = couponDiscountAmount(coupon, subtotal);
              return (
                <button
                  key={coupon.id}
                  type="button"
                  disabled={!eligible}
                  onClick={() => setSelectedCouponId(coupon.id)}
                  className={`w-full rounded-[16px] border p-4 text-left transition-colors disabled:opacity-50 ${
                    active
                      ? "border-[var(--pf-ink)] bg-[var(--pf-surface-soft)]"
                      : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioDot active={active} />
                    <span className="flex-1 text-[14px] font-semibold text-[var(--pf-ink)]">{coupon.label}</span>
                    <span className="pf-num text-[13.5px] font-semibold text-[var(--pf-ink)]">
                      {eligible ? `-${formatWon(amount)}원` : "적용 불가"}
                    </span>
                  </div>
                  <p className="mt-1 pl-6 text-[12px] text-[var(--pf-muted)]">
                    {eligible
                      ? `${formatWon(coupon.minAmount)}원 이상 구매 시, ${coupon.expiresAt}까지`
                      : `최소 주문금액 ${formatWon(coupon.minAmount)}원 이상부터 사용 가능해요`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 결제수단 선택 */}
        <div className="mt-6">
          <SectionHead title="결제 수단" />
          <div className="px-5 space-y-2">
            {PAYMENT_METHODS_PF.map((pm) => {
              const active = selectedPaymentId === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedPaymentId(pm.id)}
                  className={`flex w-full items-center gap-2 rounded-[16px] border p-4 text-left transition-colors ${
                    active
                      ? "border-[var(--pf-ink)] bg-[var(--pf-surface-soft)]"
                      : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
                  }`}
                >
                  <RadioDot active={active} />
                  <span className="flex-1 text-[14px] font-semibold text-[var(--pf-ink)]">{pm.brand}</span>
                  <span className="pf-num text-[13px] text-[var(--pf-muted)]">**** {pm.last4}</span>
                  {pm.isDefault && <Badge tone="neutral">기본</Badge>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="mt-6 px-5">
          <div className="space-y-2 rounded-[16px] bg-[var(--pf-surface-card)] p-4">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-[var(--pf-muted)]">상품 금액</span>
              <span className="pf-num text-[var(--pf-ink)]">{formatWon(subtotal)}원</span>
            </div>
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-[var(--pf-muted)]">쿠폰 할인</span>
              <span className="pf-num text-[var(--pf-ink)]">
                {discountAmount > 0 ? `-${formatWon(discountAmount)}원` : `${formatWon(0)}원`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--pf-hairline)] pt-2.5">
              <span className="text-[14px] font-semibold text-[var(--pf-ink)]">최종 결제 금액</span>
              <span className="pf-num text-[18px] font-semibold text-[var(--pf-ink)]">
                {formatWon(finalTotal)}원
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
        <PrimaryButton disabled={cart.length === 0} onClick={handlePlaceOrder}>
          {formatWon(finalTotal)}원 결제하기
        </PrimaryButton>
      </div>
    </div>
  );
}
