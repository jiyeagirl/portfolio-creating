"use client";

import { useState } from "react";
import { ChatCircle, Moped, Phone, Warehouse, House } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/dressday/lib/types";
import { getProduct, won } from "@/projects/platform/dressday/lib/catalog";
import { LIVE, RETURNING } from "@/projects/platform/dressday/lib/site-data";
import { Badge, CONTAINER, ProductImage, SecondaryButton, Timeline } from "@/projects/platform/dressday/components/site/ui";

const ORDERS = [
  { code: LIVE.code, productId: LIVE.productId, size: LIVE.size, status: "배송 중", tone: "live" as const, sub: `오늘 ${LIVE.receive.window} 수령` },
  { code: RETURNING.code, productId: RETURNING.productId, size: RETURNING.size, status: "회수 요청", tone: "wait" as const, sub: `오늘 ${RETURNING.requestedWindow} 회수` },
];

export function TrackingScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [code, setCode] = useState(LIVE.code);
  const product = getProduct(LIVE.productId);
  const pay = LIVE.pay;
  const total = pay.rent + pay.delivery + pay.deposit - pay.discount;

  return (
    <div className={`${CONTAINER} dd-enter pt-8 lg:pt-10`}>
      <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">예약, 배송 조회</h1>

      {/* 진행 중 예약 선택 */}
      <div className="dd-scroll-x -mx-6 mt-6 flex gap-3 overflow-x-auto px-6 lg:mx-0 lg:px-0">
        {ORDERS.map((o) => {
          const p = getProduct(o.productId);
          const on = code === o.code;
          return (
            <button
              key={o.code}
              type="button"
              aria-pressed={on}
              onClick={() => (o.code === RETURNING.code ? onNavigate("return") : setCode(o.code))}
              className={`dd-press flex w-[300px] shrink-0 items-center gap-3 rounded-[14px] border p-3 text-left ${on ? "border-2 border-[var(--dd-ink)] p-[11px]" : "border-[var(--dd-hairline)]"}`}
            >
              <ProductImage product={p} w={120} h={160} className="aspect-[3/4] w-12 shrink-0 rounded-[8px]" iconSize={18} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold">{p.name}</span>
                <span className="dd-num block truncate text-[13px] text-[var(--dd-muted)]">{o.sub}</span>
              </span>
              <Badge tone={o.tone}>{o.status}</Badge>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0">
          {/* 현재 단계: 가장 크게 */}
          <section className="rounded-[14px] bg-[var(--dd-soft)] p-6 lg:p-8">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[var(--dd-live-fg)]">
              <span className="dd-live-dot h-2 w-2 rounded-full bg-[var(--dd-live-fg)]" />
              배송 중
            </div>
            <p className="mt-3 text-[15px] text-[var(--dd-body)]">도착 예정</p>
            <p className="dd-num text-[40px] font-bold leading-[48px] tracking-[-0.02em] lg:text-[48px] lg:leading-[56px]">{LIVE.eta}</p>
            <p className="dd-num mt-1 text-[15px] text-[var(--dd-muted)]">예약한 시간 {LIVE.receive.window} 안에 도착해요</p>

            {/* 구간 진행: 픽업 → 현재 → 도착 */}
            <div className="mt-8">
              <div className="relative h-1 rounded-full bg-[var(--dd-hairline)]">
                <div className="absolute inset-y-0 left-0 w-[58%] rounded-full bg-[var(--dd-ink)]" />
                <span className="absolute left-[58%] top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--dd-ink)] text-white shadow-[var(--dd-float)]">
                  <Moped size={18} weight="fill" />
                </span>
              </div>
              <div className="mt-4 flex justify-between gap-3 whitespace-nowrap text-[13px]">
                <span className="flex items-center gap-1.5 text-[var(--dd-muted)]">
                  <Warehouse size={16} className="shrink-0" />
                  <span className="hidden sm:inline">성수</span> 물류센터 <span className="dd-num">16:31</span>
                </span>
                <span className="dd-num font-semibold">1.8km 남음</span>
                <span className="flex items-center gap-1.5 text-[var(--dd-muted)]">
                  <House size={16} className="shrink-0" />
                  성수이로 118
                </span>
              </div>
            </div>
          </section>

          {/* 라이더 */}
          <section className="mt-6 rounded-[14px] border border-[var(--dd-hairline)] p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--dd-strong)] text-[17px] font-semibold">
                {LIVE.rider.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-semibold">라이더 {LIVE.rider.name}</p>
                <p className="dd-num truncate text-[14px] text-[var(--dd-muted)]">
                  {LIVE.rider.vehicle}, 누적 배송 {LIVE.rider.done.toLocaleString("ko-KR")}건
                </p>
              </div>
              <div className="hidden shrink-0 gap-2 md:flex">
                <RiderActions />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
              <RiderActions />
            </div>
          </section>

          {/* 예약 정보 */}
          <section className="mt-8">
            <h2 className="text-[20px] font-semibold leading-6">예약 정보</h2>
            <div className="mt-4 flex gap-4 border-b border-[var(--dd-hairline)] pb-5">
              <ProductImage product={product} w={200} h={266} className="aspect-[3/4] w-16 shrink-0 rounded-[8px]" iconSize={20} />
              <div className="min-w-0">
                <p className="text-[16px] font-semibold">{product.name}</p>
                <p className="dd-num text-[14px] text-[var(--dd-muted)]">
                  {product.color}, {LIVE.size}, 1일
                </p>
                <p className="dd-code mt-1 text-[13px] text-[var(--dd-muted)]">{LIVE.code}</p>
              </div>
            </div>
            <dl className="grid grid-cols-[80px_minmax(0,1fr)] gap-y-3 pt-5 text-[15px]">
              <dt className="text-[var(--dd-muted)]">배송지</dt>
              <dd>
                {LIVE.address.line}
                <span className="block text-[14px] text-[var(--dd-muted)]">{LIVE.address.detail}</span>
              </dd>
              <dt className="text-[var(--dd-muted)]">수령</dt>
              <dd className="dd-num">
                {LIVE.receive.date} {LIVE.receive.window}
              </dd>
              <dt className="text-[var(--dd-muted)]">회수</dt>
              <dd className="dd-num">
                {LIVE.giveBack.date} {LIVE.giveBack.window}
                <span className="block text-[14px] text-[var(--dd-muted)]">라이더 배정은 회수 2시간 전</span>
              </dd>
              <dt className="text-[var(--dd-muted)]">결제</dt>
              <dd className="dd-num">
                {won(total)}
                <span className="block text-[14px] text-[var(--dd-muted)]">
                  {pay.method}, 보증금 {won(pay.deposit)} 포함
                </span>
              </dd>
            </dl>
          </section>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-28">
          <div className="rounded-[14px] border border-[var(--dd-hairline)] p-6">
            <h2 className="text-[16px] font-semibold">진행 상황</h2>
            <div className="mt-5">
              <Timeline steps={LIVE.steps} />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <SecondaryButton className="w-full">회수 시간 변경</SecondaryButton>
            <p className="text-center text-[13px] text-[var(--dd-muted)]">배송이 시작돼 지금은 취소할 수 없어요</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RiderActions() {
  return (
    <>
      <button type="button" className="dd-press flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--dd-hairline)] px-4 text-[14px] font-medium">
        <ChatCircle size={18} />
        문자
      </button>
      <button type="button" className="dd-press flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--dd-hairline)] px-4 text-[14px] font-medium">
        <Phone size={18} />
        안심번호 통화
      </button>
    </>
  );
}
