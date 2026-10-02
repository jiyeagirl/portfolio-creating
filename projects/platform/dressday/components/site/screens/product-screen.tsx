"use client";

import { useState } from "react";
import { CaretLeft, Moped, ShieldCheck, WashingMachine } from "@phosphor-icons/react";
import type { NavigateFn, Product, Size } from "@/projects/platform/dressday/lib/types";
import { SIZES, won } from "@/projects/platform/dressday/lib/catalog";
import { DELIVERY_SLOTS, MEASURES, SEPT_AVAILABILITY } from "@/projects/platform/dressday/lib/site-data";
import { CONTAINER, PrimaryButton, ProductImage, SaveButton } from "@/projects/platform/dressday/components/site/ui";

/** 같은 사진의 다른 크롭. 다른 상품 사진을 섞지 않는다 (web.md 사진) */
const CROPS = [
  { position: "50% 30%", zoom: undefined, label: "전체" },
  { position: "50% 52%", zoom: 3, label: "밑단 레이스" },
  { position: "52% 14%", zoom: 2.2, label: "허리선과 손" },
];

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export function ProductScreen({ product, onNavigate }: { product: Product; onNavigate: NavigateFn }) {
  const [size, setSize] = useState<Size>("S");
  const [slot, setSlot] = useState(DELIVERY_SLOTS.find((s) => s.left > 0)!.time);
  const [days, setDays] = useState(1);
  const [shot, setShot] = useState(0);
  const left = product.stock[size] ?? 0;
  const rent = product.price * days;

  return (
    <div className="dd-enter">
      <div className={`${CONTAINER} pt-4 lg:pt-8`}>
        <button type="button" onClick={() => onNavigate("browse")} className="flex h-11 items-center gap-1 text-[14px] text-[var(--dd-muted)]">
          <CaretLeft size={16} />
          옷 둘러보기
        </button>
      </div>

      <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[minmax(0,58fr)_minmax(0,36fr)] lg:gap-16`}>
        {/* 갤러리 */}
        <div className="min-w-0">
          <div className="hidden gap-2 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProductImage product={product} w={900} h={1200} position={CROPS[0].position} className="row-span-2 aspect-[3/4] w-full rounded-l-[14px]" />
            <ProductImage product={product} w={600} h={600} position={CROPS[1].position} zoom={CROPS[1].zoom} className="aspect-auto h-full w-full rounded-tr-[14px]" />
            <ProductImage product={product} w={600} h={600} position={CROPS[2].position} zoom={CROPS[2].zoom} className="aspect-auto h-full w-full rounded-br-[14px]" />
          </div>
          <div className="relative -mx-6 lg:hidden">
            <ProductImage product={product} w={800} h={1000} position={CROPS[shot].position} zoom={CROPS[shot].zoom} className="aspect-[4/5] w-full" />
            <SaveButton className="absolute right-3 top-3" />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {CROPS.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  aria-label={`${c.label} 사진`}
                  onClick={() => setShot(i)}
                  className={`h-1.5 rounded-full ${i === shot ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </div>

          {/* 상품 정보 (데스크톱은 갤러리 아래) */}
          <div className="mt-8 hidden lg:block">
            <Details product={product} />
          </div>
        </div>

        {/* 정보 + 예약 카드 */}
        <div className="min-w-0">
          <div className="lg:sticky lg:top-28">
            <p className="text-[14px] text-[var(--dd-muted)]">{product.label}</p>
            <div className="mt-1 flex items-start justify-between gap-3">
              <h1 className="text-[22px] font-medium leading-[30px] tracking-[-0.02em]">{product.name}</h1>
              <div className="-mr-2 -mt-2 hidden lg:block">
                <SaveButton saved />
              </div>
            </div>
            <p className="mt-1 text-[15px] text-[var(--dd-body)]">
              {product.color}, {product.occasions.join(", ")}
            </p>

            <div className="mt-6 rounded-[14px] border border-[var(--dd-hairline)] p-6 shadow-[var(--dd-float)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[13px] text-[var(--dd-muted)]">대여료 (1일)</p>
                  <p className="dd-num text-[21px] font-bold leading-[30px]">{won(product.price)}</p>
                </div>
                <p className="dd-num text-right text-[13px] text-[var(--dd-muted)]">
                  정가 {won(product.retail)}
                  <br />
                  보증금 {won(product.deposit)}
                </p>
              </div>

              <p className="mt-6 text-[14px] font-semibold">사이즈</p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {SIZES.map((s) => {
                  const n = product.stock[s];
                  const none = n === undefined;
                  const out = n === 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={none || out}
                      aria-pressed={size === s}
                      onClick={() => setSize(s)}
                      className={`dd-press flex h-12 flex-col items-center justify-center rounded-[8px] border text-[14px] font-medium disabled:cursor-not-allowed ${
                        size === s
                          ? "border-2 border-[var(--dd-ink)]"
                          : none || out
                            ? "border-[var(--dd-hairline-soft)] text-[var(--dd-muted-soft)] line-through"
                            : "border-[var(--dd-hairline)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className={`mt-2 text-[13px] ${left <= 1 ? "font-semibold text-[var(--dd-error)]" : "text-[var(--dd-muted)]"}`}>
                {left > 0 ? `${size} 오늘 대여 가능 ${left}벌 남음` : `${size} 오늘 대여 불가`}
              </p>

              <p className="mt-6 text-[14px] font-semibold">오늘 받을 시간</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DELIVERY_SLOTS.filter((s) => s.left > 0).map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    aria-pressed={slot === s.time}
                    onClick={() => setSlot(s.time)}
                    className={`dd-press dd-num h-10 whitespace-nowrap rounded-full border text-[14px] ${
                      slot === s.time ? "border-[var(--dd-ink)] bg-[var(--dd-ink)] font-medium text-white" : "border-[var(--dd-hairline)]"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold">이용 기간</p>
                  <p className="dd-num text-[13px] text-[var(--dd-muted)]">
                    회수 9월 {18 + days}일 {days === 1 ? "(토)" : days === 2 ? "(일)" : "(월)"} 저녁
                  </p>
                </div>
                <div className="flex items-center rounded-full border border-[var(--dd-hairline)]">
                  <button type="button" aria-label="하루 줄이기" disabled={days === 1} onClick={() => setDays(days - 1)} className="h-10 w-10 text-[18px] disabled:text-[var(--dd-muted-soft)]">
                    −
                  </button>
                  <span className="dd-num w-10 text-center text-[15px] font-medium">{days}일</span>
                  <button type="button" aria-label="하루 늘리기" disabled={days === 3} onClick={() => setDays(days + 1)} className="h-10 w-10 text-[18px] disabled:text-[var(--dd-muted-soft)]">
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 hidden lg:block">
                <PrimaryButton onClick={() => onNavigate("booking")} disabled={left === 0} className="w-full">
                  예약하기
                </PrimaryButton>
              </div>
              <div className="mt-4 hidden space-y-2 border-t border-[var(--dd-hairline)] pt-4 text-[15px] lg:block">
                <div className="flex justify-between">
                  <span className="text-[var(--dd-body)]">대여료 {days}일</span>
                  <span className="dd-num">{won(rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--dd-body)]">보증금 (반납 후 환불)</span>
                  <span className="dd-num">{won(product.deposit)}</span>
                </div>
              </div>
            </div>

            <AvailabilityCalendar />
          </div>
        </div>

        <div className="lg:hidden">
          <Details product={product} />
        </div>
      </div>

      {/* 모바일 하단 고정 바. 불투명, blur 없음 */}
      <div className="dd-bottom-bar fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dd-hairline)] bg-white lg:hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="min-w-0">
            <p className="dd-num text-[16px] font-semibold">
              {won(rent)} <span className="text-[14px] font-normal text-[var(--dd-muted)]">/ {days}일</span>
            </p>
            <p className="dd-num whitespace-nowrap text-[13px] text-[var(--dd-muted)]">보증금 {won(product.deposit)} 별도</p>
          </div>
          <PrimaryButton onClick={() => onNavigate("booking")} disabled={left === 0} className="shrink-0">
            예약하기
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function AvailabilityCalendar() {
  // 2026년 9월 1일은 화요일
  const offset = 2;
  const cells = [...Array(offset).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <p className="text-[16px] font-semibold">9월 대여 가능 일정</p>
        <p className="text-[13px] text-[var(--dd-muted)]">S 기준</p>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[12px] text-[var(--dd-muted)]">
        {WEEK.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} />;
          const st = SEPT_AVAILABILITY[d];
          const past = d < 18;
          const today = d === 18;
          return (
            <span key={d} className="flex justify-center">
              <span
                className={`dd-num relative flex h-10 w-10 items-center justify-center rounded-full text-[14px] ${
                  today
                    ? "bg-[var(--dd-ink)] font-semibold text-white"
                    : past
                      ? "text-[var(--dd-muted-soft)]"
                      : st === "full"
                        ? "text-[var(--dd-muted-soft)] line-through"
                        : "text-[var(--dd-ink)]"
                }`}
              >
                {d}
                {st === "few" && !today && <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[var(--dd-error)]" />}
              </span>
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-[12px] text-[var(--dd-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--dd-error)]" />1벌 남음
        </span>
        <span className="flex items-center gap-1.5">
          <span className="line-through">20</span> 예약 마감
        </span>
      </div>
    </div>
  );
}

function Details({ product }: { product: Product }) {
  return (
    <div className="divide-y divide-[var(--dd-hairline)] border-t border-[var(--dd-hairline)] lg:border-t-0">
      <section className="py-6 lg:pt-0">
        <h2 className="text-[20px] font-semibold leading-6">실측 (cm)</h2>
        <div className="dd-scroll-x mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-[14px]">
            <thead>
              <tr className="border-b border-[var(--dd-ink)] text-[13px] text-[var(--dd-muted)]">
                <th className="py-2.5 text-left font-medium">사이즈</th>
                <th className="py-2.5 text-right font-medium">총장</th>
                <th className="py-2.5 text-right font-medium">가슴 단면</th>
                <th className="py-2.5 text-right font-medium">허리 단면</th>
                <th className="py-2.5 text-right font-medium">밑단 단면</th>
              </tr>
            </thead>
            <tbody className="dd-num">
              {MEASURES.map((m) => (
                <tr key={m.size} className="border-b border-[var(--dd-hairline-soft)]">
                  <td className="py-2.5 font-medium">{m.size}</td>
                  <td className="py-2.5 text-right">{m.length}</td>
                  <td className="py-2.5 text-right">{m.chest}</td>
                  <td className="py-2.5 text-right">{m.waist}</td>
                  <td className="py-2.5 text-right">{m.hem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-[var(--dd-muted)]">모델 키 166, S 착용. 측정 방법에 따라 1~2cm 차이가 있을 수 있어요.</p>
      </section>

      <section className="py-6">
        <h2 className="text-[20px] font-semibold leading-6">상품 정보</h2>
        <dl className="mt-4 grid grid-cols-[88px_minmax(0,1fr)] gap-y-3 text-[15px]">
          <dt className="text-[var(--dd-muted)]">소재</dt>
          <dd>겉감 면 100%, 레이스 면 72% 나일론 28%, 안감 폴리 100%</dd>
          <dt className="text-[var(--dd-muted)]">두께, 비침</dt>
          <dd>얇음, 안감 있어 비침 없음</dd>
          <dt className="text-[var(--dd-muted)]">여밈</dt>
          <dd>뒤 지퍼</dd>
          <dt className="text-[var(--dd-muted)]">누적 대여</dt>
          <dd className="dd-num">{product.rentals}회, 마지막 검수 9월 17일</dd>
        </dl>
      </section>

      <section className="grid gap-5 py-6 sm:grid-cols-3">
        {[
          { icon: Moped, title: "오늘 저녁 도착", body: "18:00 전 예약" },
          { icon: WashingMachine, title: "세탁 포함", body: "드라이클리닝 후 발송" },
          { icon: ShieldCheck, title: "가벼운 오염 무상", body: "기준은 오염, 훼손 안내" },
        ].map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <b.icon size={28} className="shrink-0" />
            <div>
              <p className="text-[15px] font-semibold">{b.title}</p>
              <p className="text-[13px] text-[var(--dd-muted)]">{b.body}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
