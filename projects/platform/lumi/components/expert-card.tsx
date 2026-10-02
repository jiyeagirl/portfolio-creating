"use client";

import { Heart, Lightning } from "@phosphor-icons/react";
import type { Expert } from "@/projects/platform/lumi/lib/types";
import { CATEGORY_META, PASS_BY_TIER } from "@/projects/platform/lumi/lib/mock-data";
import { ExpertAvatar, StatusPill } from "@/projects/platform/lumi/components/ui";

/** 리스트용 상담사 카드. 홈 추천, 탐색, 찜 목록에서 같은 모양을 쓴다. */
export function ExpertRow({
  expert,
  liked = false,
  onOpen,
  onToggleLike,
}: {
  expert: Expert;
  liked?: boolean;
  onOpen: () => void;
  onToggleLike?: () => void;
}) {
  const cheapest = PASS_BY_TIER[expert.tiers[0]];

  return (
    <div className="relative rounded-2xl bg-[var(--lm-elevated)] p-4 shadow-[var(--lm-shadow)]">
      <button type="button" onClick={onOpen} className="flex w-full items-start gap-3.5 text-left">
        <ExpertAvatar expert={expert} size={54} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[15.5px] font-bold tracking-tight">{expert.name}</span>
            <span className="text-[11.5px] font-semibold text-[var(--lm-muted)]">
              {CATEGORY_META[expert.category].label}
            </span>
            {expert.isNew && (
              <span className="rounded-full bg-[var(--lm-accent-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lm-accent)]">
                신규
              </span>
            )}
          </span>
          <span className="mt-1 block truncate pr-6 text-[13px] text-[var(--lm-muted)]">
            {expert.headline}
          </span>
          <span className="lm-num mt-2 flex items-center gap-1.5 text-[12px] text-[var(--lm-muted)]">
            <span className="font-bold text-[var(--lm-ink)]">{expert.rating.toFixed(2)}</span>
            <span>후기 {expert.reviewCount.toLocaleString("ko-KR")}</span>
            <span aria-hidden>·</span>
            <span>상담 {expert.sessionCount.toLocaleString("ko-KR")}</span>
          </span>
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <StatusPill status={expert.status} waitMinutes={expert.waitMinutes} compact />
            <span className="lm-num rounded-full bg-[var(--lm-surface)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--lm-muted)]">
              {cheapest.name} {cheapest.minutes}분 {cheapest.price.toLocaleString("ko-KR")}원
            </span>
          </span>
        </span>
      </button>

      {onToggleLike && (
        <button
          type="button"
          onClick={onToggleLike}
          aria-label={liked ? `${expert.name} 찜 해제` : `${expert.name} 찜하기`}
          aria-pressed={liked}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--lm-muted)] transition-colors hover:bg-[var(--lm-surface)]"
        >
          <Heart size={18} weight={liked ? "fill" : "regular"} className={liked ? "text-[var(--lm-danger)]" : ""} />
        </button>
      )}
    </div>
  );
}

/** 가로 스크롤용 좁은 카드. 즉시 상담, 신규 상담사 줄에서 쓴다. */
export function ExpertTile({ expert, onOpen }: { expert: Expert; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-[152px] shrink-0 flex-col items-start gap-2 rounded-2xl bg-[var(--lm-elevated)] p-3.5 text-left shadow-[var(--lm-shadow)]"
    >
      <span className="flex w-full items-start justify-between">
        <ExpertAvatar expert={expert} size={46} />
        {expert.status === "available" && (
          <span className="flex items-center gap-0.5 rounded-full bg-[var(--lm-live-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lm-live)]">
            <Lightning size={10} weight="fill" />
            지금
          </span>
        )}
      </span>
      <span>
        <span className="block text-[14.5px] font-bold tracking-tight">{expert.name}</span>
        <span className="mt-0.5 block text-[11.5px] text-[var(--lm-muted)]">
          {CATEGORY_META[expert.category].label} · {expert.years}년차
        </span>
      </span>
      <span className="line-clamp-2 text-[12px] leading-snug text-[var(--lm-muted)]">
        {expert.specialties.slice(0, 3).join(", ")}
      </span>
      <span className="lm-num mt-auto text-[12px] font-bold text-[var(--lm-ink)]">
        {expert.rating.toFixed(2)}
        <span className="ml-1 font-normal text-[var(--lm-muted)]">
          ({expert.reviewCount.toLocaleString("ko-KR")})
        </span>
      </span>
    </button>
  );
}
