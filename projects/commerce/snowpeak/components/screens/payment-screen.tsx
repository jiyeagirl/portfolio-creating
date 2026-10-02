"use client";

import { useState } from "react";
import { Bank, CreditCard, Wallet } from "@phosphor-icons/react";
import {
  AppBar,
  Card,
  Field,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/commerce/snowpeak/components/ui";
import { USER_PROFILE, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem, CartItemKind, PaymentMethodOption, Reservation, ReservationLine } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

const KIND_LABEL: Record<CartItemKind, string> = {
  room: "객실",
  lift: "리프트권",
  season: "시즌권",
  rental: "장비 렌탈",
  package: "패키지",
};

const PAYMENT_METHODS: { value: PaymentMethodOption; icon: typeof CreditCard }[] = [
  { value: "신용카드", icon: CreditCard },
  { value: "카카오페이", icon: Wallet },
  { value: "네이버페이", icon: Wallet },
  { value: "무통장입금", icon: Bank },
];

function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        active ? "border-[var(--sp-ink)]" : "border-[var(--sp-border-strong)]"
      }`}
    >
      {active && <span className="h-2 w-2 rounded-full bg-[var(--sp-ink)]" />}
    </span>
  );
}

export function PaymentScreen({
  cart,
  onNavigate,
  onPlaceReservation,
}: {
  cart: CartItem[];
  onNavigate: NavigateFn;
  onPlaceReservation: (reservation: Reservation) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodOption>("신용카드");
  const [cardNumber, setCardNumber] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  function handlePay() {
    const lines: ReservationLine[] = cart.map((item) => ({
      kind: item.kind,
      name: item.name,
      detail: item.detail,
      quantity: item.quantity,
      amount: item.unitPrice * item.quantity,
    }));
    const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0);
    const withDates = cart.find((item) => item.checkIn && item.checkOut);

    const reservation: Reservation = {
      id: `res-${crypto.randomUUID()}`,
      confirmationNo: `SP-231015-${crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()}`,
      lines,
      totalAmount,
      status: "확정",
      checkIn: withDates?.checkIn ?? "2023-12-24",
      checkOut: withDates?.checkOut ?? "2023-12-26",
      createdAt: "2023-10-15",
      paymentMethod: selectedMethod,
      guestName: USER_PROFILE.name,
    };

    onPlaceReservation(reservation);
    onNavigate("bookingComplete", reservation.id);
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="결제" subtitle="결제 전 예약 내용을 확인해주세요" onBack={() => onNavigate("cart")} />

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="mt-5">
          <SectionHead title="주문 상품" note={`${cart.length}개`} />
          <div className="space-y-2 px-5">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[var(--sp-ink)]">
                    {KIND_LABEL[item.kind]} | {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-[var(--sp-mute)]">
                    {item.detail} | {item.quantity}개
                  </p>
                </div>
                <span className="sp-num shrink-0 text-[13.5px] font-semibold text-[var(--sp-ink)]">
                  {formatWon(item.unitPrice * item.quantity)}원
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <SectionHead title="결제 수단" />
          <div className="space-y-2 px-5">
            {PAYMENT_METHODS.map((method) => {
              const active = selectedMethod === method.value;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setSelectedMethod(method.value)}
                  className={`flex w-full items-center gap-3 rounded-[12px] border p-4 text-left transition-colors ${
                    active
                      ? "border-[var(--sp-ink)] bg-[var(--sp-surface-soft)]"
                      : "border-[var(--sp-border)] bg-[var(--sp-surface)]"
                  }`}
                >
                  <RadioDot active={active} />
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-ink)]">
                    <method.icon size={15} weight="bold" />
                  </span>
                  <span className="flex-1 text-[14px] font-semibold text-[var(--sp-ink)]">{method.value}</span>
                </button>
              );
            })}

            {selectedMethod === "신용카드" && (
              <div className="rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface-soft)] p-4">
                <Field label="카드 번호" helper="포트폴리오 목업 화면으로 실제 결제는 처리되지 않아요">
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000-0000-0000-0000"
                    className={`${inputClass} sp-num`}
                  />
                </Field>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 px-5">
          <Card className="space-y-2.5">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-[var(--sp-mute)]">상품 금액</span>
              <span className="sp-num text-[var(--sp-ink)]">{formatWon(subtotal)}원</span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--sp-border)] pt-2.5">
              <span className="text-[14px] font-semibold text-[var(--sp-ink)]">결제 금액</span>
              <span className="sp-num text-[18px] font-semibold text-[var(--sp-ink)]">
                {formatWon(subtotal)}원
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-4">
        <PrimaryButton disabled={cart.length === 0} onClick={handlePay}>
          {formatWon(subtotal)}원 결제하기
        </PrimaryButton>
      </div>
    </div>
  );
}
