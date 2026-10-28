"use client";

import { LockSimple } from "@phosphor-icons/react";
import type { Scope } from "@/projects/platform/eduon/lib/access";

/*
 * 이용 범위 표시는 홈, 상세, 회차 목록, 내 학습, 관리자 목록에서 같은 모양이다 (spec Key Focus).
 * 디자인시스템 jobright: 필 형태, 고대비(민트 위 블랙, 블랙 위 화이트). 크기는 64px 고정.
 * tone은 예전 호출부 호환용이고 모양과 색은 같다.
 */

const SHAPE = "inline-flex h-[22px] w-[64px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold leading-none";

export function AccessBadge({ scope }: { scope: Scope; tone?: "dark" | "light" }) {
  const cls = scope === "무료 공개" ? "bg-[#00f0a0] text-black" : "bg-black text-white";
  return <span className={`${SHAPE} ${cls}`}>{scope}</span>;
}

/** 회차 단위 표시: 미리보기 칩 또는 잠금 아이콘 */
export function PreviewChip() {
  return (
    <span className="inline-flex h-[20px] shrink-0 items-center rounded-full border border-current px-2 text-[11px] font-semibold leading-none text-[var(--eo-brand-ink)]">
      미리보기
    </span>
  );
}

export function LockMark({ size = 16 }: { tone?: "dark" | "light"; size?: number }) {
  return <LockSimple size={size} weight="bold" aria-label="구독 전용 회차" className="shrink-0 text-[var(--eo-fg-3)]" />;
}
