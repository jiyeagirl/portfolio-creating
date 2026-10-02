"use client";

import { useState } from "react";
import { Check, CheckCircle, Minus, Plus, Receipt, Ticket } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import { PASS_BY_TIER, PASS_PRODUCTS, formatWon } from "@/projects/platform/lumi/lib/mock-data";
import { AppBar, PrimaryButton } from "@/projects/platform/lumi/components/ui";

const COUPONS = [
  { id: "none", label: "쿠폰 사용 안 함", discount: 0 },
  { id: "welcome", label: "첫 상담 12,000원 할인", discount: 12000 },
  { id: "repeat", label: "재상담 5,000원 할인", discount: 5000 },
];

const METHODS = [
  { id: "apay", label: "A페이 간편결제", note: "최근 사용" },
  { id: "card", label: "B카드 5*** 4412", note: "등록된 카드" },
  { id: "phone", label: "휴대폰 결제", note: "월 한도 30만원" },
];

export function PurchaseScreen({
  tier,
  onNavigate,
  onPurchase,
}: {
  tier: PassTier;
  onNavigate: NavigateFn;
  onPurchase: (tier: PassTier, quantity: number) => void;
}) {
  const [selected, setSelected] = useState<PassTier>(tier);
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState(COUPONS[1]);
  const [method, setMethod] = useState(METHODS[0]);
  const [done, setDone] = useState(false);

  const pass = PASS_BY_TIER[selected];
  const listTotal = pass.listPrice * quantity;
  const productTotal = pass.price * quantity;
  const discount = Math.min(coupon.discount, productTotal);
  const total = productTotal - discount;

  if (done) {
    return (
      <div className="lm-enter flex min-h-full flex-col">
        <AppBar title="결제 완료" onBack={() => onNavigate("passes")} />
        <div className="flex flex-1 flex-col items-center px-6 pt-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]">
            <CheckCircle size={32} weight="fill" />
          </span>
          <h2 className="mt-4 text-[20px] font-bold tracking-tight">상담권을 받았습니다</h2>
          <p className="lm-num mt-2 text-[13.5px] leading-relaxed text-[var(--lm-muted)]">
            {pass.name} {pass.minutes}분 {quantity}장이 충전되었습니다.
            <br />
            구매일로부터 90일 안에 사용해 주세요.
          </p>

          <div className="mt-6 w-full rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4 text-left">
            <div className="lm-num flex items-center justify-between text-[13px]">
              <span className="text-[var(--lm-muted)]">결제 금액</span>
              <span className="font-bold">{formatWon(total)}원</span>
            </div>
            <div className="lm-num mt-2 flex items-center justify-between text-[13px]">
              <span className="text-[var(--lm-muted)]">결제 수단</span>
              <span className="font-semibold">{method.label}</span>
            </div>
            <div className="lm-num mt-2 flex items-center justify-between text-[13px]">
              <span className="text-[var(--lm-muted)]">주문번호</span>
              <span className="font-semibold">pay-9847</span>
            </div>
          </div>

          <div className="mt-6 w-full space-y-2">
            <PrimaryButton onClick={() => onNavigate("experts", "available")}>
              지금 상담할 상담사 보기
            </PrimaryButton>
            <button
              type="button"
              onClick={() => onNavigate("passes")}
              className="w-full rounded-xl border border-[var(--lm-border)] py-3.5 text-[15px] font-bold text-[var(--lm-ink)]"
            >
              상담권 화면으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lm-enter flex min-h-full flex-col">
      <AppBar title="상담권 구매" onBack={() => onNavigate("passes")} />

      <section className="px-5 pt-5">
        <h2 className="text-[15px] font-bold">상담권 종류</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {PASS_PRODUCTS.map((item) => {
            const active = selected === item.tier;
            return (
              <button
                key={item.tier}
                type="button"
                onClick={() => setSelected(item.tier)}
                aria-pressed={active}
                className={`rounded-2xl border px-2 py-3.5 text-center transition-colors ${
                  active
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <span className="block text-[13.5px] font-bold">{item.name}</span>
                <span className="lm-num mt-0.5 block text-[11.5px] text-[var(--lm-muted)]">
                  {item.minutes}분
                </span>
                <span className="lm-num mt-2 block text-[13px] font-bold">
                  {formatWon(item.price)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-4 py-3.5">
          <div>
            <p className="text-[14px] font-bold">수량</p>
            <p className="lm-num mt-0.5 text-[12px] text-[var(--lm-muted)]">
              총 {pass.minutes * quantity}분 사용 가능
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="수량 줄이기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lm-border)] text-[var(--lm-ink)] disabled:text-[var(--lm-border)]"
            >
              <Minus size={13} weight="bold" />
            </button>
            <span className="lm-num w-5 text-center text-[15px] font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(9, q + 1))}
              aria-label="수량 늘리기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lm-border)] text-[var(--lm-ink)]"
            >
              <Plus size={13} weight="bold" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-bold">쿠폰</h2>
        <div className="mt-3 space-y-2">
          {COUPONS.map((item) => {
            const active = coupon.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCoupon(item)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                    active
                      ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border-[var(--lm-border)]"
                  }`}
                >
                  {active && <Check size={10} weight="bold" />}
                </span>
                <span className="flex-1 text-[13.5px] font-semibold">{item.label}</span>
                {item.discount > 0 && (
                  <span className="lm-num text-[12.5px] font-bold text-[var(--lm-accent)]">
                    -{formatWon(item.discount)}원
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-bold">결제 수단</h2>
        <div className="mt-3 space-y-2">
          {METHODS.map((item) => {
            const active = method.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                    active
                      ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border-[var(--lm-border)]"
                  }`}
                >
                  {active && <Check size={10} weight="bold" />}
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-semibold">{item.label}</span>
                  <span className="block text-[11.5px] text-[var(--lm-muted)]">{item.note}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-[var(--lm-surface)] p-4">
          <p className="flex items-center gap-1.5 text-[13.5px] font-bold">
            <Receipt size={14} weight="fill" className="text-[var(--lm-muted)]" />
            결제 금액
          </p>
          <dl className="lm-num mt-3 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-[var(--lm-muted)]">
                {pass.name} {pass.minutes}분 x {quantity}
              </dt>
              <dd>{formatWon(listTotal)}원</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--lm-muted)]">상시 할인</dt>
              <dd>-{formatWon(listTotal - productTotal)}원</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--lm-muted)]">쿠폰 할인</dt>
              <dd>-{formatWon(discount)}원</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--lm-border)] pt-2.5 text-[15px] font-bold">
              <dt>총 결제 금액</dt>
              <dd>{formatWon(total)}원</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="h-6" />

      <div className="sticky bottom-0 mt-auto border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 pb-7 pt-3">
        <p className="mb-2.5 flex items-center gap-1.5 text-[11.5px] text-[var(--lm-muted)]">
          <Ticket size={12} />
          결제 즉시 충전되며 사용하지 않은 상담권은 90일 안에 환불할 수 있습니다.
        </p>
        <PrimaryButton
          onClick={() => {
            onPurchase(selected, quantity);
            setDone(true);
          }}
        >
          {formatWon(total)}원 결제하기
        </PrimaryButton>
      </div>
    </div>
  );
}
