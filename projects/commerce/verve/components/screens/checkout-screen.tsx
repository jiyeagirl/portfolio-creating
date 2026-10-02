"use client";

import { useState } from "react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { addresses, currentUser } from "@/projects/commerce/verve/lib/mock-data";
import type { CartItem } from "@/projects/commerce/verve/lib/types";
import { Button, Checkbox, Divider, Field, Select, SectionHeading, TextArea, formatPrice } from "@/projects/commerce/verve/components/ui";

const DELIVERY_MEMOS = ["문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락해주세요", "직접 입력"];
const PAYMENT_METHODS = ["신용/체크카드", "카카오페이", "네이버페이", "무통장입금"];

export function CheckoutScreen({
  cart,
  onNavigate,
  onPlaceOrder,
}: {
  cart: CartItem[];
  onNavigate: NavigateFn;
  onPlaceOrder: () => string;
}) {
  const [addressId, setAddressId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [memo, setMemo] = useState(DELIVERY_MEMOS[0]);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [usePoints, setUsePoints] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === addressId);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 3500;
  const maxPoints = Math.min(currentUser.points, subtotal);
  const total = Math.max(0, subtotal + shipping - usePoints);

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading title="주문 / 결제" tone="light" />

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <section>
              <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">배송지</p>
              <div className="mt-4 space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 border p-4 ${addressId === addr.id ? "border-[var(--v-body-on-light)]" : "border-[var(--v-hairline-on-light)]"}`}
                  >
                    <input type="radio" className="mt-1" checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} />
                    <div className="text-[13px]">
                      <p className="font-medium text-[var(--v-body-on-light)]">
                        {addr.label} {addr.isDefault && <span className="ml-1 text-[11px] text-[var(--v-muted)]">기본 배송지</span>}
                      </p>
                      <p className="mt-1 text-[var(--v-muted)]">
                        {addr.recipient} · {addr.phone}
                      </p>
                      <p className="text-[var(--v-muted)]">{addr.address}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <Field label="배송 메모" tone="light">
                  <Select tone="light" value={memo} onChange={(e) => setMemo(e.target.value)}>
                    {DELIVERY_MEMOS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Select>
                </Field>
                {memo === "직접 입력" && <TextArea tone="light" className="mt-3" placeholder="배송 메모를 입력해주세요" />}
              </div>
            </section>

            <section>
              <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">주문 상품</p>
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center gap-4 border-b border-[var(--v-hairline-on-light)] pb-3">
                    <img src={item.image} alt={item.name} className="h-16 w-14 object-cover" />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[var(--v-body-on-light)]">{item.name}</p>
                      <p className="text-[12px] text-[var(--v-muted)]">
                        {item.color} / {item.size} / {item.quantity}개
                      </p>
                    </div>
                    <span className="v-number text-[13px] text-[var(--v-body-on-light)]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">포인트</p>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={maxPoints}
                  value={usePoints}
                  onChange={(e) => setUsePoints(Math.min(maxPoints, Math.max(0, Number(e.target.value))))}
                  className="h-12 w-full border border-[var(--v-hairline-on-light)] bg-white px-4 text-[14px] text-[var(--v-body-on-light)] focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--v-primary)]"
                />
                <button type="button" onClick={() => setUsePoints(maxPoints)} className="shrink-0 text-[12px] font-medium text-[var(--v-primary)] underline underline-offset-4">
                  전액 사용
                </button>
              </div>
              <p className="mt-2 text-[12px] text-[var(--v-muted)]">보유 포인트 {formatPrice(currentUser.points)}</p>
            </section>

            <section>
              <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">결제수단</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayment(m)}
                    className={`h-12 border text-[13px] font-medium ${payment === m ? "border-[var(--v-body-on-light)] bg-[var(--v-body-on-light)] text-white" : "border-[var(--v-hairline-on-light)] text-[var(--v-body-on-light)]"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <Checkbox tone="light" checked={agreed} onChange={setAgreed} label="주문 내용을 확인했으며, 결제 진행에 동의합니다 (필수)" />
            </section>
          </div>

          <div className="h-fit border border-[var(--v-hairline-on-light)] p-6">
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between text-[var(--v-muted)]">
                <span>상품 금액</span>
                <span className="text-[var(--v-body-on-light)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--v-muted)]">
                <span>배송비</span>
                <span className="text-[var(--v-body-on-light)]">{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
              </div>
              {usePoints > 0 && (
                <div className="flex justify-between text-[var(--v-primary)]">
                  <span>포인트 사용</span>
                  <span>-{formatPrice(usePoints)}</span>
                </div>
              )}
            </div>
            <Divider tone="light" className="my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] font-medium text-[var(--v-body-on-light)]">총 결제금액</span>
              <span className="v-number text-[22px] font-medium text-[var(--v-body-on-light)]">{formatPrice(total)}</span>
            </div>
            <Button
              tone="light"
              className="mt-6 w-full"
              disabled={!agreed || !selectedAddress}
              onClick={() => {
                const orderId = onPlaceOrder();
                onNavigate("orderComplete", orderId);
              }}
            >
              {formatPrice(total)} 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
