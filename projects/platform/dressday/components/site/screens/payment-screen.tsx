"use client";

import { useState } from "react";
import { CaretLeft, CheckCircle, CreditCard, Bank, Wallet } from "@phosphor-icons/react";
import type { NavigateFn, Product } from "@/projects/platform/dressday/lib/types";
import { won } from "@/projects/platform/dressday/lib/catalog";
import { ADDRESSES, ME, PAY_METHODS } from "@/projects/platform/dressday/lib/site-data";
import { CONTAINER, PrimaryButton, ProductImage, SecondaryButton, Steps } from "@/projects/platform/dressday/components/site/ui";
import { BOOKING, MobileCta, OrderSummary, Section, amounts } from "@/projects/platform/dressday/components/site/screens/booking-screen";

const METHOD_ICON = { card: CreditCard, easy: Wallet, bank: Bank } as const;

export function PaymentScreen({ product, onNavigate, done: initialDone = false }: { product: Product; onNavigate: NavigateFn; done?: boolean }) {
  const [method, setMethod] = useState("card");
  const [agree, setAgree] = useState(true);
  const [done, setDone] = useState(initialDone);
  const a = amounts(product);

  if (done) return <Done product={product} onNavigate={onNavigate} />;

  return (
    <div className={`${CONTAINER} dd-enter pt-4 lg:pt-8`}>
      <button type="button" onClick={() => onNavigate("booking")} className="flex h-11 items-center gap-1 text-[14px] text-[var(--dd-muted)]">
        <CaretLeft size={16} />
        예약 확인으로
      </button>
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">결제</h1>
        <Steps items={["예약 확인", "결제", "완료"]} current={1} />
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="min-w-0 divide-y divide-[var(--dd-hairline)] border-t border-[var(--dd-hairline)]">
          <Section title="예약 정보">
            <dl className="grid grid-cols-[72px_minmax(0,1fr)] gap-y-3 text-[15px]">
              <dt className="text-[var(--dd-muted)]">받는 시간</dt>
              <dd className="dd-num">9월 18일 (금) {BOOKING.slot}</dd>
              <dt className="text-[var(--dd-muted)]">회수 시간</dt>
              <dd className="dd-num">9월 19일 (토) {BOOKING.back}</dd>
              <dt className="text-[var(--dd-muted)]">받는 곳</dt>
              <dd>
                {ADDRESSES[0].line}
                <span className="block text-[14px] text-[var(--dd-muted)]">{ADDRESSES[0].detail}</span>
              </dd>
              <dt className="text-[var(--dd-muted)]">받는 분</dt>
              <dd className="dd-num">
                {ME.name}, {ME.phone}
              </dd>
            </dl>
          </Section>

          <Section title="결제 수단">
            <div className="grid gap-3 md:grid-cols-3">
              {PAY_METHODS.map((m) => {
                const Icon = METHOD_ICON[m.id as keyof typeof METHOD_ICON];
                const on = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setMethod(m.id)}
                    className={`dd-press flex items-center gap-3 rounded-[14px] border p-4 text-left md:flex-col md:items-start ${
                      on ? "border-2 border-[var(--dd-ink)] p-[15px]" : "border-[var(--dd-hairline)]"
                    }`}
                  >
                    <Icon size={28} weight={on ? "fill" : "regular"} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold">{m.label}</span>
                      <span className="block text-[13px] text-[var(--dd-muted)]">{m.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="쿠폰">
            <div className="flex items-center justify-between gap-4 rounded-[8px] bg-[var(--dd-soft)] px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[15px] font-medium">{ME.coupon.name}</p>
                <p className="text-[13px] text-[var(--dd-muted)]">{ME.coupon.until}까지</p>
              </div>
              <span className="dd-num shrink-0 text-[15px] font-semibold">−{won(ME.coupon.amount)}</span>
            </div>
          </Section>

          <section className="py-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--dd-ink)]"
              />
              <span className="text-[15px]">
                대여 약관, 오염, 훼손 보상 기준, 개인정보 제3자 제공(라이더 배송)에 동의해요
              </span>
            </label>
          </section>
        </div>

        <div className="lg:sticky lg:top-28">
          <OrderSummary product={product} cta={`${won(a.total)} 결제하기`} onCta={() => agree && setDone(true)} />
          {!agree && <p className="mt-3 text-[14px] text-[var(--dd-error)]">약관에 동의해야 결제할 수 있어요</p>}
        </div>
      </div>

      <MobileCta label={`${won(a.total)} 결제하기`} onClick={() => agree && setDone(true)} />
    </div>
  );
}

function Done({ product, onNavigate }: { product: Product; onNavigate: NavigateFn }) {
  const a = amounts(product);
  return (
    <div className={`${CONTAINER} dd-enter flex flex-col items-center pb-8 pt-12 text-center lg:pt-20`}>
      <CheckCircle size={56} weight="fill" className="text-[var(--dd-ink)]" />
      <h1 className="mt-5 text-[28px] font-bold leading-10 tracking-[-0.02em]">예약이 확정됐어요</h1>
      <p className="dd-num mt-2 text-[16px] text-[var(--dd-body)]">오늘 {BOOKING.slot}에 성수이로 118로 가져갈게요</p>

      <div className="mt-10 w-full max-w-[520px] rounded-[14px] border border-[var(--dd-hairline)] p-6 text-left">
        <div className="flex gap-4">
          <ProductImage product={product} w={200} h={266} className="aspect-[3/4] w-16 shrink-0 rounded-[8px]" iconSize={20} />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold">{product.name}</p>
            <p className="dd-num text-[14px] text-[var(--dd-muted)]">
              {product.color}, {BOOKING.size}, {BOOKING.days}일
            </p>
          </div>
        </div>
        <dl className="dd-num mt-5 grid grid-cols-[88px_minmax(0,1fr)] gap-y-2.5 border-t border-[var(--dd-hairline)] pt-5 text-[15px]">
          <dt className="text-[var(--dd-muted)]">예약번호</dt>
          <dd className="dd-code">DD-0918-2583</dd>
          <dt className="text-[var(--dd-muted)]">회수</dt>
          <dd>9월 19일 (토) {BOOKING.back}</dd>
          <dt className="text-[var(--dd-muted)]">결제</dt>
          <dd>
            {won(a.total)} <span className="text-[var(--dd-muted)]">(신용카드)</span>
          </dd>
        </dl>
      </div>

      <div className="mt-8 flex w-full max-w-[520px] flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={() => onNavigate("tracking")} className="flex-1">
          배송 조회
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate("browse")} className="flex-1">
          더 둘러보기
        </SecondaryButton>
      </div>
    </div>
  );
}
