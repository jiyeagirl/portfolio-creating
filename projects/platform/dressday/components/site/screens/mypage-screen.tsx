"use client";

import { useState } from "react";
import { CaretRight, CreditCard, Plus } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import type { NavigateFn } from "@/projects/platform/dressday/lib/types";
import { getProduct, won } from "@/projects/platform/dressday/lib/catalog";
import { ADDRESSES, CANCELLED, HISTORY, ME, NOTIFY } from "@/projects/platform/dressday/lib/site-data";
import { Badge, CONTAINER, Field, INPUT, ProductImage, SecondaryButton } from "@/projects/platform/dressday/components/site/ui";

export const MY_TABS = [
  { key: "history", label: "예약, 렌탈 내역" },
  { key: "cancel", label: "취소 내역" },
  { key: "profile", label: "개인정보" },
  { key: "address", label: "배송지" },
  { key: "payment", label: "결제 정보" },
  { key: "notify", label: "알림 설정" },
] as const;
export type MyTab = (typeof MY_TABS)[number]["key"];

export function MypageScreen({ onNavigate, initialTab = "history" }: { onNavigate: NavigateFn; initialTab?: MyTab }) {
  const [tab, setTab] = useState<MyTab>(initialTab);

  return (
    <div className={`${CONTAINER} dd-enter pt-8 lg:pt-10`}>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--dd-ink)] text-[20px] font-semibold text-white">
          {ME.name.slice(1, 2)}
        </span>
        <div className="min-w-0">
          <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">{ME.name}</h1>
          <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">
            {ME.since}부터 이용, 대여 {ME.rentals}회
          </p>
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="마이페이지 메뉴" className="dd-scroll-x -mx-6 flex overflow-x-auto border-b border-[var(--dd-hairline)] px-6 lg:mx-0 lg:flex-col lg:border-b-0 lg:px-0">
          {MY_TABS.map((t) => {
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                aria-current={on ? "page" : undefined}
                onClick={() => setTab(t.key)}
                className={`relative flex h-12 shrink-0 items-center whitespace-nowrap px-3 text-[15px] lg:h-11 lg:rounded-[8px] lg:px-4 ${
                  on ? "font-semibold text-[var(--dd-ink)] lg:bg-[var(--dd-strong)]" : "text-[var(--dd-muted)]"
                }`}
              >
                {t.label}
                {on && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-[var(--dd-ink)] lg:hidden" />}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          {tab === "history" && <History onNavigate={onNavigate} />}
          {tab === "cancel" && <Cancelled />}
          {tab === "profile" && <Profile />}
          {tab === "address" && <Addresses />}
          {tab === "payment" && <Payment />}
          {tab === "notify" && <Notify />}
        </div>
      </div>
    </div>
  );
}

function Title({ children, meta }: { children: React.ReactNode; meta?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h2 className="text-[20px] font-semibold leading-6">{children}</h2>
      {meta && <span className="dd-num text-[14px] text-[var(--dd-muted)]">{meta}</span>}
    </div>
  );
}

function History({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <section>
      <Title meta={`${HISTORY.length}건`}>예약, 렌탈 내역</Title>
      <ul className="divide-y divide-[var(--dd-hairline)]">
        {HISTORY.map((h) => {
          const p = getProduct(h.productId);
          const live = h.tone === "live" || h.tone === "act";
          return (
            <li key={h.code}>
              <button
                type="button"
                onClick={() => live && onNavigate(h.code === "DD-0916-1983" ? "return" : "tracking")}
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                <ProductImage product={p} w={160} h={214} className="aspect-[3/4] w-16 shrink-0 rounded-[8px]" iconSize={20} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] font-semibold">{p.name}</span>
                    <Badge tone={h.tone}>{h.status}</Badge>
                  </span>
                  <span className="dd-num mt-1 block text-[14px] text-[var(--dd-muted)]">
                    {h.period}, {p.color} {h.size}
                  </span>
                  <span className="dd-code mt-0.5 block text-[12px] text-[var(--dd-muted-soft)]">{h.code}</span>
                </span>
                <span className="dd-num hidden shrink-0 text-right text-[15px] sm:block">{won(h.total)}</span>
                {live && <CaretRight size={18} className="shrink-0 text-[var(--dd-muted)]" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Cancelled() {
  return (
    <section>
      <Title meta={`${CANCELLED.length}건`}>취소 내역</Title>
      <ul className="divide-y divide-[var(--dd-hairline)]">
        {CANCELLED.map((c) => {
          const p = getProduct(c.productId);
          return (
            <li key={c.code} className="flex items-center gap-4 py-4">
              <ProductImage product={p} w={160} h={214} className="aspect-[3/4] w-16 shrink-0 rounded-[8px]" iconSize={20} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-[16px] font-semibold">{p.name}</span>
                  <Badge tone={c.tone}>취소</Badge>
                </p>
                <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">
                  {c.when}, {c.reason}
                </p>
              </div>
              <p className="dd-num shrink-0 text-right text-[14px]">
                <span className="block text-[var(--dd-muted)]">전액 환불</span>
                {won(c.refund)}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Profile() {
  return (
    <section className="max-w-[560px]">
      <Title>개인정보</Title>
      <div className="mt-4 space-y-5">
        <Field label="이름">
          <input className={INPUT} defaultValue={ME.name} />
        </Field>
        <Field label="휴대폰">
          <input className={`${INPUT} dd-num`} defaultValue={ME.phone} />
        </Field>
        <Field label="이메일">
          <input className={INPUT} defaultValue={ME.email} />
        </Field>
        <Field label="평소 사이즈">
          <input className={INPUT} defaultValue="상의 S (55), 하의 S (26)" />
        </Field>
      </div>
      <SecondaryButton className="mt-6">저장</SecondaryButton>
    </section>
  );
}

function Addresses() {
  return (
    <section>
      <Title meta={`${ADDRESSES.length}곳`}>배송지</Title>
      <ul className="mt-2 grid gap-3 md:grid-cols-2">
        {ADDRESSES.map((a) => (
          <li key={a.id} className="rounded-[14px] border border-[var(--dd-hairline)] p-5">
            <p className="flex items-center gap-2 text-[16px] font-semibold">
              {a.label}
              {a.primary && <Badge tone="wait">기본</Badge>}
            </p>
            <p className="mt-2 text-[15px]">{a.line}</p>
            <p className="text-[14px] text-[var(--dd-muted)]">{a.detail}</p>
            <p className="mt-3 text-[13px] text-[var(--dd-done-fg)]">당일 배송 지역</p>
          </li>
        ))}
        <li>
          <button type="button" className="dd-press flex h-full min-h-[140px] w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--dd-border-strong)] text-[15px] font-medium">
            <Plus size={18} />
            배송지 추가
          </button>
        </li>
      </ul>
    </section>
  );
}

function Payment() {
  return (
    <section className="max-w-[560px]">
      <Title>결제 정보</Title>
      <div className="mt-4 flex items-center gap-4 rounded-[14px] border border-[var(--dd-hairline)] p-5">
        <CreditCard size={32} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold">A카드 신용</p>
          <p className="dd-num text-[14px] text-[var(--dd-muted)]">5**1, 유효기간 08/29</p>
        </div>
        <Badge tone="wait">기본</Badge>
      </div>
      <p className="mt-4 text-[14px] text-[var(--dd-body)]">
        보증금은 결제한 수단으로 환불돼요. 추가 비용이 생기면 검수 결과를 먼저 알려 드려요.
      </p>
      <button type="button" className="mt-4 flex h-11 items-center gap-2 text-[14px] font-medium underline underline-offset-4">
        <Plus size={16} />
        결제 수단 추가
      </button>
    </section>
  );
}

function Notify() {
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(NOTIFY.map((n) => [n.key, n.on])));
  return (
    <section className="max-w-[640px]">
      <Title>알림 설정</Title>
      <ul className="divide-y divide-[var(--dd-hairline)]">
        {NOTIFY.map((n) => (
          <li key={n.key} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-[16px] font-medium">{n.label}</p>
              <p className="dd-num text-[14px] text-[var(--dd-muted)]">{n.sub}</p>
            </div>
            <Toggle
              checked={on[n.key]}
              onChange={(v) => setOn({ ...on, [n.key]: v })}
              label={n.label}
              size="lg"
              onClassName="bg-[var(--dd-ink)]"
              offClassName="bg-[var(--dd-border-strong)]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
