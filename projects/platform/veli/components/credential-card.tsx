"use client";

import { ShieldCheck } from "@phosphor-icons/react";
import type { SafeNumber } from "@/projects/platform/veli/lib/types";
import { SafeNumberStatusBadge } from "@/projects/platform/veli/components/ui";

/* 아키타입 A2(크리덴셜 월렛)의 중심 요소.
   이 프로젝트에서 색을 가진 유일한 표면이고(--vl-card-*), 화면의 시각적 무게를
   전부 여기에 몰아준다. 나머지 UI는 잉크와 종이만 쓴다.

   지갑 카드는 리스트 아이템이 아니다 — 실물 카드의 비율(1.586:1 근사)과 두께감을
   유지하고, 번호는 카드 표면에 각인된 것처럼 큰 tabular 숫자로 놓는다. */

export function CredentialCard({
  safeNumber,
  onOpen,
}: {
  safeNumber: SafeNumber;
  onOpen?: () => void;
}) {
  const { number, vehicle, status } = safeNumber;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full text-left transition-transform duration-200 active:translate-y-[1px]"
    >
      <div
        className="relative flex h-[214px] flex-col overflow-hidden rounded-[20px] px-6 pb-6 pt-5"
        style={{
          background:
            "linear-gradient(152deg, var(--vl-card-edge) 0%, var(--vl-card) 58%, var(--vl-card) 100%)",
          boxShadow: "var(--vl-shadow-card)",
        }}
      >
        <ShieldCheck
          size={168}
          weight="fill"
          className="pointer-events-none absolute -right-10 -top-12 text-[var(--vl-card-ink)] opacity-[0.05]"
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--vl-card-muted)]">
              Veli 안심번호
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--vl-card-muted)]">
              실제 번호는 공개되지 않습니다
            </p>
          </div>
          <SafeNumberStatusBadge status={status} onDark />
        </div>

        <p className="vl-num relative mt-auto text-[32px] font-bold leading-none tracking-[-0.02em] text-[var(--vl-card-ink)]">
          {number}
        </p>

        <div className="relative mt-4 flex items-end justify-between gap-3 border-t border-[var(--vl-card-ink)]/[0.12] pt-3.5">
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--vl-card-muted)]">
              연결 차량
            </p>
            <p className="vl-num mt-1 truncate text-[16px] font-semibold text-[var(--vl-card-ink)]">
              {vehicle.number}
            </p>
          </div>
          <p className="shrink-0 truncate text-[12px] text-[var(--vl-card-muted)]">
            {vehicle.model} | {vehicle.color}
          </p>
        </div>
      </div>
    </button>
  );
}

/* 카드가 여러 장일 때만 쓰는 페이지 인디케이터. 덱은 가로 스냅 스크롤이라
   현재 위치를 알려줄 표시가 필요하다. 한 장이면 렌더하지 않는다. */
export function DeckDots({ count, active }: { count: number; active: number }) {
  if (count < 2) return null;
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-[5px] rounded-full transition-all duration-200 ${
            i === active ? "w-[18px] bg-[var(--vl-ink)]" : "w-[5px] bg-[var(--vl-border-strong)]"
          }`}
        />
      ))}
    </div>
  );
}
