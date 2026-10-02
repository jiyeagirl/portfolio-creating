"use client";

import { useState } from "react";
import { CaretLeft, Check, Plus } from "@phosphor-icons/react";
import type { NavigateFn, Product } from "@/projects/platform/dressday/lib/types";
import { won } from "@/projects/platform/dressday/lib/catalog";
import { ADDRESSES, DELIVERY_SLOTS, ME, RETURN_SLOTS } from "@/projects/platform/dressday/lib/site-data";
import {
  CONTAINER,
  Field,
  INPUT,
  PrimaryButton,
  ProductImage,
  Steps,
  SummaryRow,
} from "@/projects/platform/dressday/components/site/ui";

export const BOOKING = { size: "S", days: 1, slot: "18:00~18:30", back: "20:00~21:00", delivery: 3500 };

export function amounts(product: Product) {
  const rent = product.price * BOOKING.days;
  const total = rent + BOOKING.delivery + product.deposit - ME.coupon.amount;
  return { rent, delivery: BOOKING.delivery, deposit: product.deposit, discount: ME.coupon.amount, total };
}

export function OrderSummary({ product, cta, onCta }: { product: Product; cta: string; onCta: () => void }) {
  const a = amounts(product);
  return (
    <div className="rounded-[14px] border border-[var(--dd-hairline)] p-6 lg:shadow-[var(--dd-float)]">
      <div className="flex gap-4">
        <ProductImage product={product} w={200} h={266} className="aspect-[3/4] w-20 shrink-0 rounded-[8px]" iconSize={24} />
        <div className="min-w-0">
          <p className="text-[13px] text-[var(--dd-muted)]">{product.label}</p>
          <p className="text-[16px] font-semibold leading-5">{product.name}</p>
          <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">
            {product.color}, {BOOKING.size}, {BOOKING.days}일
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-2.5 border-t border-[var(--dd-hairline)] pt-5">
        <SummaryRow label={`대여료 ${BOOKING.days}일`} value={a.rent} />
        <SummaryRow label="배송, 회수비" value={a.delivery} />
        <SummaryRow label="보증금 (반납 후 환불)" value={a.deposit} />
        <SummaryRow label="쿠폰 할인" value={a.discount} minus />
      </div>
      <div className="mt-5 border-t border-[var(--dd-ink)] pt-4">
        <SummaryRow label="결제 금액" value={a.total} strong />
        <p className="dd-num mt-1 text-right text-[13px] text-[var(--dd-muted)]">
          보증금 {won(a.deposit)}은 검수 후 2일 안에 환불돼요
        </p>
      </div>
      <div className="mt-6 hidden lg:block">
        <PrimaryButton onClick={onCta} className="w-full">
          <span className="dd-num">{cta}</span>
        </PrimaryButton>
      </div>
    </div>
  );
}

export function BookingScreen({ product, onNavigate }: { product: Product; onNavigate: NavigateFn }) {
  const [slot, setSlot] = useState(BOOKING.slot);
  const [back, setBack] = useState(BOOKING.back);
  const [addr, setAddr] = useState(ADDRESSES[0].id);
  const a = amounts(product);

  return (
    <div className={`${CONTAINER} dd-enter pt-4 lg:pt-8`}>
      <button type="button" onClick={() => onNavigate("product")} className="flex h-11 items-center gap-1 text-[14px] text-[var(--dd-muted)]">
        <CaretLeft size={16} />
        상품으로
      </button>
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">렌탈 예약</h1>
        <Steps items={["예약 확인", "결제", "완료"]} current={0} />
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="min-w-0 divide-y divide-[var(--dd-hairline)] border-t border-[var(--dd-hairline)]">
          <Section title="받는 시간" meta="오늘 9월 18일 (금)">
            <SlotGrid slots={DELIVERY_SLOTS} value={slot} onChange={setSlot} />
          </Section>

          <Section title="회수 시간" meta="9월 19일 (토), 이용 1일">
            <SlotGrid slots={RETURN_SLOTS} value={back} onChange={setBack} />
            <p className="mt-3 text-[13px] text-[var(--dd-muted)]">회수 전날 20:00에 알림을 보내요. 마이페이지에서 하루씩 연장할 수 있어요.</p>
          </Section>

          <Section title="받는 곳">
            <div className="grid gap-3 md:grid-cols-2">
              {ADDRESSES.map((ad) => {
                const on = addr === ad.id;
                return (
                  <button
                    key={ad.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAddr(ad.id)}
                    className={`dd-press relative rounded-[14px] border p-4 text-left ${on ? "border-2 border-[var(--dd-ink)] p-[15px]" : "border-[var(--dd-hairline)]"}`}
                  >
                    <span className="flex items-center gap-2 text-[15px] font-semibold">
                      {ad.label}
                      {ad.primary && <span className="text-[12px] font-medium text-[var(--dd-muted)]">기본</span>}
                    </span>
                    <span className="mt-1 block text-[15px]">{ad.line}</span>
                    <span className="block text-[14px] text-[var(--dd-muted)]">{ad.detail}</span>
                    {on && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--dd-ink)] text-white">
                        <Check size={14} weight="bold" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button type="button" className="mt-3 flex h-11 items-center gap-2 text-[14px] font-medium underline underline-offset-4">
              <Plus size={16} />
              새 주소
            </button>
          </Section>

          <Section title="받는 분">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="이름">
                <input className={INPUT} defaultValue={ME.name} />
              </Field>
              <Field label="휴대폰">
                <input className={`${INPUT} dd-num`} defaultValue={ME.phone} inputMode="tel" />
              </Field>
              <Field label="라이더 요청사항" className="md:col-span-2">
                <input className={INPUT} defaultValue="도착 전 문자 주세요. 공동현관 1847#" />
              </Field>
            </div>
          </Section>
        </div>

        <div className="lg:sticky lg:top-28">
          <OrderSummary product={product} cta={`${won(a.total)} 결제하기`} onCta={() => onNavigate("payment")} />
        </div>
      </div>

      <MobileCta label={`${won(a.total)} 결제하기`} onClick={() => onNavigate("payment")} />
    </div>
  );
}

export function Section({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) {
  return (
    <section className="py-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-[20px] font-semibold leading-6">{title}</h2>
        {meta && <span className="dd-num text-[14px] text-[var(--dd-muted)]">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

function SlotGrid({ slots, value, onChange }: { slots: { time: string; left: number }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {slots.map((s) => {
        const off = s.left === 0;
        const on = value === s.time;
        return (
          <button
            key={s.time}
            type="button"
            disabled={off}
            aria-pressed={on}
            onClick={() => onChange(s.time)}
            className={`dd-press flex h-14 flex-col items-center justify-center rounded-[8px] border text-center disabled:cursor-not-allowed ${
              on ? "border-2 border-[var(--dd-ink)]" : off ? "border-[var(--dd-hairline-soft)] bg-[var(--dd-soft)]" : "border-[var(--dd-hairline)]"
            }`}
          >
            <span className={`dd-num text-[15px] ${on ? "font-semibold" : off ? "text-[var(--dd-muted-soft)]" : ""}`}>{s.time}</span>
            <span className={`dd-num text-[12px] ${off ? "text-[var(--dd-muted-soft)]" : s.left <= 2 ? "text-[var(--dd-error)]" : "text-[var(--dd-muted)]"}`}>
              {off ? "마감" : `${s.left}자리 남음`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MobileCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="dd-bottom-bar fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dd-hairline)] bg-white px-6 py-3 lg:hidden">
      <PrimaryButton onClick={onClick} className="w-full">
        <span className="dd-num">{label}</span>
      </PrimaryButton>
    </div>
  );
}
