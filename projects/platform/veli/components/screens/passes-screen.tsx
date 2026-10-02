"use client";

import { useState } from "react";
import { Check, CreditCard, ShieldCheck } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import type { PassTier } from "@/projects/platform/veli/lib/types";
import {
  MY_SUBSCRIPTION,
  PASS_BY_TIER,
  PASS_PRODUCTS,
  formatWon,
} from "@/projects/platform/veli/lib/mock-data";
import { Badge, ListRow, SectionHead } from "@/projects/platform/veli/components/ui";

/* 이 환경에서는 Date.now()/new Date()를 인자 없이 호출하지 않는다. 고정 기준일을
   문자열로 두고 new Date(string) 생성자만 사용해 만료까지 남은 일수를 계산한다. */
const TODAY = new Date("2026-07-30");

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const diffMs = target.getTime() - TODAY.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/* 이용권 등급 타일: 등급별 accent 명도 단계 배경 + 아이콘 (design.md 사진 매핑 참고). */
const TIER_TILE_BG: Record<PassTier, string> = {
  lite: "var(--vl-chart-soft)",
  standard: "var(--vl-chart-base)",
  premium: "var(--vl-chart-strong)",
};

export function PassesScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [autoRenew, setAutoRenew] = useState(MY_SUBSCRIPTION.autoRenew);

  const currentPass = PASS_BY_TIER[MY_SUBSCRIPTION.tier];
  const daysLeft = Math.max(daysUntil(MY_SUBSCRIPTION.expiresAt), 0);

  const statusBadge =
    MY_SUBSCRIPTION.status === "active" ? (
      <Badge tone="success">이용중</Badge>
    ) : MY_SUBSCRIPTION.status === "expiring" ? (
      <Badge tone="warning">
        <span className="vl-num">D-{daysLeft}</span>
      </Badge>
    ) : (
      <Badge tone="danger">만료됨</Badge>
    );

  return (
    <div className="vl-enter pb-10">

      <section className="px-5 pt-5">
        <div className="rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--vl-muted)]">
              현재 이용권
            </p>
            {statusBadge}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
              style={{ background: TIER_TILE_BG[MY_SUBSCRIPTION.tier] }}
            >
              <ShieldCheck size={22} weight="fill" className="text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-[19px] font-bold tracking-tight">{currentPass.name}</p>
              <p className="vl-num mt-0.5 text-[12.5px] text-[var(--vl-muted)]">
                안심번호 {currentPass.safeNumberCount}개 이용 중 | {MY_SUBSCRIPTION.expiresAt}까지
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--vl-divider)] pt-4">
            <div className="pr-3">
              <p className="text-[13.5px] font-semibold">자동 연장</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-[var(--vl-muted)]">
                {autoRenew
                  ? "만료일에 자동으로 결제되어 이어서 이용됩니다"
                  : "만료일 이후 안심번호가 회수됩니다"}
              </p>
            </div>
            <Toggle
              checked={autoRenew}
              onChange={setAutoRenew}
              label="자동 연장"
              onClassName="bg-[var(--vl-accent)]"
              offClassName="bg-[var(--vl-border)]"
            />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="이용권 비교" note="필요한 안심번호 개수에 맞춰 선택하세요" />
        <div className="space-y-3 px-5">
          {PASS_PRODUCTS.map((p) => {
            const isCurrent = p.tier === MY_SUBSCRIPTION.tier;
            const highlight = Boolean(p.recommended) && !isCurrent;
            return (
              <article
                key={p.tier}
                className={`rounded-[12px] border p-5 ${
                  isCurrent || highlight
                    ? "border-[var(--vl-accent)] bg-[var(--vl-elevated)]"
                    : "border-[var(--vl-border)] bg-[var(--vl-elevated)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
                    style={{ background: TIER_TILE_BG[p.tier] }}
                  >
                    <ShieldCheck size={22} weight="fill" className="text-white" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-[16px] font-bold tracking-tight">{p.name}</h3>
                      {isCurrent && <Badge tone="accent">이용중</Badge>}
                      {highlight && <Badge tone="accent">추천</Badge>}
                    </div>
                    <p className="vl-num mt-0.5 text-[12px] text-[var(--vl-muted)]">
                      안심번호 {p.safeNumberCount}개
                    </p>
                  </div>
                  <p className="vl-num shrink-0 text-right text-[17px] font-bold leading-tight">
                    {formatWon(p.priceMonthly)}
                    <span className="ml-0.5 text-[11.5px] font-semibold text-[var(--vl-muted)]">
                      원/월
                    </span>
                  </p>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-[var(--vl-divider)] pt-3.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[12.5px] text-[var(--vl-muted)]"
                    >
                      <Check size={13} weight="bold" className="shrink-0 text-[var(--vl-accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 rounded-[12px] bg-[var(--vl-surface)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--vl-muted)]">
                  {p.bestFor}
                </p>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => onNavigate("purchase", p.tier)}
                    className="mt-3.5 w-full rounded-full bg-[var(--vl-accent)] py-3 text-[14px] font-bold text-[var(--vl-accent-fg)] transition-transform active:translate-y-[1px] active:opacity-70"
                  >
                    {p.name}로 변경
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]">
          <ListRow
            icon={<CreditCard size={16} />}
            label="결제 수단과 내역 보기"
            onClick={() => onNavigate("purchase")}
          />
        </div>
      </section>
    </div>
  );
}
