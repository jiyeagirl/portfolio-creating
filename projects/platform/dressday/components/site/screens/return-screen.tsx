"use client";

import { useState } from "react";
import { CheckCircle, Package, Tag, DoorOpen } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/dressday/lib/types";
import { getProduct, won } from "@/projects/platform/dressday/lib/catalog";
import { ADDRESSES, RETURN_SLOTS, RETURNING } from "@/projects/platform/dressday/lib/site-data";
import { Badge, CONTAINER, PrimaryButton, ProductImage, Timeline } from "@/projects/platform/dressday/components/site/ui";

const PACKING = [
  { icon: Package, text: "받은 가방에 옷과 옷걸이를 함께 넣어요" },
  { icon: Tag, text: "옷에 달린 드레스데이 태그는 떼지 않아요" },
  { icon: DoorOpen, text: "회수 시간에 문 앞에 두면 라이더가 가져가요" },
];

/** 지난 반납 (반납 완료 확인) */
const LAST_RETURN = {
  code: "DD-0831-0746",
  productId: "wrap-midi",
  returnedAt: "9월 1일 (화) 20:42 회수",
  inspection: "오염, 훼손 없음",
  refund: 60000,
  refundedAt: "9월 2일 환불 완료",
};

export function ReturnScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [slot, setSlot] = useState(RETURNING.requestedWindow);
  const product = getProduct(RETURNING.productId);
  const last = getProduct(LAST_RETURN.productId);
  const changed = slot !== RETURNING.requestedWindow;

  return (
    <div className={`${CONTAINER} dd-enter pt-8 lg:pt-10`}>
      <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">반납 신청</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0">
          {/* 현재 단계: 가장 크게 (tracking과 같은 문법) */}
          <section className="mb-6 rounded-[14px] bg-[var(--dd-soft)] p-6 lg:p-8">
            <p className="text-[15px] font-semibold text-[var(--dd-live-fg)]">라이더 배정 대기</p>
            <p className="mt-3 text-[15px] text-[var(--dd-body)]">오늘 회수</p>
            <p className="dd-num text-[40px] font-bold leading-[48px] tracking-[-0.02em] lg:text-[48px] lg:leading-[56px]">{RETURNING.requestedWindow}</p>
            <p className="dd-num mt-1 text-[15px] text-[var(--dd-muted)]">18:00에 라이더가 배정돼요</p>
          </section>

          {/* 이용 중인 옷 */}
          <section className="flex gap-5 border-b border-[var(--dd-hairline)] pb-6">
            <ProductImage product={product} w={300} h={400} className="aspect-[3/4] w-24 shrink-0 rounded-[14px] lg:w-28" iconSize={28} />
            <div className="min-w-0 flex-1">
              <Badge tone="wait">회수 요청</Badge>
              <p className="mt-2 text-[18px] font-semibold leading-6">{product.name}</p>
              <p className="dd-num text-[14px] text-[var(--dd-muted)]">
                {product.color}, {RETURNING.size}
                <span className="block whitespace-nowrap">{RETURNING.period}</span>
              </p>
              <p className="dd-num mt-2 text-[15px] font-semibold">{RETURNING.endsAt}</p>
            </div>
          </section>

          <section className="py-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-[20px] font-semibold leading-6">회수 시간</h2>
              <span className="dd-num text-[14px] text-[var(--dd-muted)]">오늘 9월 18일 (금)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {RETURN_SLOTS.map((s) => {
                const on = slot === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSlot(s.time)}
                    className={`dd-press flex h-14 flex-col items-center justify-center rounded-[8px] border ${on ? "border-2 border-[var(--dd-ink)]" : "border-[var(--dd-hairline)]"}`}
                  >
                    <span className={`dd-num text-[15px] ${on ? "font-semibold" : ""}`}>{s.time}</span>
                    <span className="dd-num text-[12px] text-[var(--dd-muted)]">{s.left}자리 남음</span>
                  </button>
                );
              })}
            </div>
            {changed ? (
              <div className="mt-4 hidden lg:block">
                <PrimaryButton className="w-full max-w-[320px]">회수 시간 변경</PrimaryButton>
              </div>
            ) : (
              <p className="dd-num mt-3 text-[14px] text-[var(--dd-muted)]">현재 {RETURNING.requestedWindow}로 요청됨</p>
            )}
            <p className="mt-4 text-[15px]">
              {ADDRESSES[0].line}
              <span className="text-[var(--dd-muted)]">, {ADDRESSES[0].detail}</span>
            </p>
          </section>

          <section className="border-t border-[var(--dd-hairline)] py-6">
            <h2 className="text-[20px] font-semibold leading-6">내놓기 전에</h2>
            <ul className="mt-4 space-y-3">
              {PACKING.map((p) => (
                <li key={p.text} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--dd-strong)]">
                    <p.icon size={20} />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </section>

        </div>

        <aside className="min-w-0 lg:sticky lg:top-28">
          <div className="rounded-[14px] border border-[var(--dd-hairline)] p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[16px] font-semibold">회수 진행</h2>
              <span className="dd-code text-[13px] text-[var(--dd-muted)]">{RETURNING.code}</span>
            </div>
            <div className="mt-5">
              <Timeline steps={RETURNING.steps} />
            </div>
            <p className="dd-num mt-5 border-t border-[var(--dd-hairline)] pt-4 text-[14px] text-[var(--dd-body)]">
              라이더는 회수 2시간 전인 18:00에 배정돼요
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between rounded-[14px] border border-[var(--dd-hairline)] px-6 py-4">
            <span className="text-[15px]">환불 예정 보증금</span>
            <span className="dd-num text-[18px] font-semibold">{won(RETURNING.deposit)}</span>
          </div>
          <button type="button" onClick={() => onNavigate("tracking")} className="mt-4 w-full text-center text-[14px] underline underline-offset-4">
            배송 중인 예약 보기
          </button>
        </aside>

          {/* 반납 완료 확인 */}
          <section className="border-t border-[var(--dd-hairline)] pt-6 lg:col-start-1">
            <h2 className="text-[20px] font-semibold leading-6">지난 반납</h2>
            <div className="mt-4 flex items-start gap-4 rounded-[14px] bg-[var(--dd-soft)] p-5">
              <ProductImage product={last} w={120} h={160} className="aspect-[3/4] w-12 shrink-0 rounded-[8px]" iconSize={18} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                  {last.name}
                  <Badge tone="done">반납 완료</Badge>
                </p>
                <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">
                  {LAST_RETURN.returnedAt}, 검수 결과 {LAST_RETURN.inspection}
                </p>
                <p className="dd-num mt-1 flex items-center gap-1.5 text-[14px]">
                  <CheckCircle size={16} weight="fill" className="text-[var(--dd-done-fg)]" />
                  보증금 {won(LAST_RETURN.refund)} {LAST_RETURN.refundedAt}
                </p>
              </div>
            </div>
          </section>
      </div>

      {changed && (
        <div className="dd-bottom-bar fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dd-hairline)] bg-white px-6 py-3 lg:hidden">
          <PrimaryButton className="w-full">회수 시간 변경</PrimaryButton>
        </div>
      )}
    </div>
  );
}
