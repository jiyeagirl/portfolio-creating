"use client";

import { ChatCircle, ClockCounterClockwise, PencilSimpleLine, ThumbsUp } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { ACTIVITY } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { ActivityItem } from "@/projects/community/wedit/lib/types";
import { EmptyState } from "@/projects/community/wedit/components/ui";

const ICON: Record<ActivityItem["type"], typeof PencilSimpleLine> = {
  post: PencilSimpleLine,
  comment: ChatCircle,
  like: ThumbsUp,
};

export function ActivityScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="활동 내역"
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
      />

      {ACTIVITY.length === 0 ? (
        <EmptyState icon={<ClockCounterClockwise size={24} weight="duotone" />} title="활동 내역이 없어요" body="커뮤니티에서 글을 쓰거나 댓글을 남겨보세요." />
      ) : (
        <div className="flex flex-col divide-y divide-[var(--wd-border)] px-5 pt-2">
          {ACTIVITY.map((a) => {
            const Icon = ICON[a.type];
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate("community")}
                className="flex items-center gap-3 py-4 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wd-surface-tint)] text-[var(--wd-accent)]">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-[var(--wd-muted)]">{a.label}</p>
                  <p className="truncate text-[13.5px] font-medium text-[var(--wd-ink)]">{a.targetTitle}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[var(--wd-muted)]">{a.createdAt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
