"use client";

import { useState } from "react";
import { CalendarBlank, Phone, PlayCircle, Star } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { ConsultStatus } from "@/projects/platform/lumi/lib/types";
import { CONSULTATIONS, PASS_BY_TIER, expertById } from "@/projects/platform/lumi/lib/mock-data";
import { Badge, EmptyState, ExpertAvatar } from "@/projects/platform/lumi/components/ui";

const TABS: { key: "upcoming" | "done" | "closed"; label: string }[] = [
  { key: "upcoming", label: "예정" },
  { key: "done", label: "완료" },
  { key: "closed", label: "취소·노쇼" },
];

const STATUS_LABEL: Record<ConsultStatus, string> = {
  upcoming: "예약 확정",
  done: "상담 완료",
  canceled: "취소됨",
  noshow: "노쇼 처리",
};

export function HistoryScreen({
  onNavigate,
  reviewedIds,
}: {
  onNavigate: NavigateFn;
  reviewedIds: string[];
}) {
  const [tab, setTab] = useState<"upcoming" | "done" | "closed">("upcoming");
  const [canceledIds, setCanceledIds] = useState<string[]>([]);

  const list = CONSULTATIONS.filter((c) => {
    if (tab === "upcoming") return c.status === "upcoming";
    if (tab === "done") return c.status === "done";
    return c.status === "canceled" || c.status === "noshow";
  });

  return (
    <div className="lm-enter pb-28">
      <header className="sticky top-0 z-20 border-b border-[var(--lm-border)] bg-[var(--lm-elevated)] pt-[71px]">
        <h1 className="px-5 text-[22px] font-bold tracking-tight">내 상담</h1>
        <div className="mt-3 flex px-5">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`relative flex-1 pb-3 text-[14px] font-bold transition-colors ${
                tab === item.key ? "text-[var(--lm-ink)]" : "text-[var(--lm-muted)]"
              }`}
            >
              {item.label}
              {tab === item.key && (
                <span className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-[var(--lm-accent)]" />
              )}
            </button>
          ))}
        </div>
      </header>

      {list.length === 0 ? (
        <EmptyState
          icon={<CalendarBlank size={26} />}
          title={tab === "upcoming" ? "예정된 상담이 없어요" : "해당하는 상담이 없어요"}
          body="상담사를 골라 예약하거나 지금 통화 가능한 상담사와 바로 연결할 수 있습니다."
          action="상담사 보러 가기"
          onAction={() => onNavigate("experts")}
        />
      ) : (
        <div className="space-y-2.5 p-5">
          {list.map((item) => {
            const expert = expertById(item.expertId);
            const pass = PASS_BY_TIER[item.tier];
            const isToday = item.dateLabel.startsWith("오늘");
            const reviewed = item.reviewed || reviewedIds.includes(item.expertId);

            return (
              <article
                key={item.id}
                className="rounded-2xl bg-[var(--lm-elevated)] p-4 shadow-[var(--lm-shadow)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="lm-num text-[12.5px] font-semibold text-[var(--lm-muted)]">
                    {item.dateLabel} {item.timeLabel}
                  </span>
                  <Badge
                    tone={
                      item.status === "upcoming"
                        ? "accent"
                        : item.status === "done"
                          ? "success"
                          : item.status === "noshow"
                            ? "danger"
                            : "neutral"
                    }
                  >
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("expertDetail", expert.id)}
                  className="mt-3 flex w-full items-center gap-3 text-left"
                >
                  <ExpertAvatar expert={expert} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold">{expert.name}</span>
                    <span className="lm-num mt-0.5 block truncate text-[12px] text-[var(--lm-muted)]">
                      {pass.name} {pass.minutes}분 · {item.topic}
                    </span>
                  </span>
                </button>

                {item.memo && (
                  <p className="mt-3 rounded-xl bg-[var(--lm-surface)] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                    {item.memo}
                  </p>
                )}

                {item.canceledReason && (
                  <p className="mt-3 rounded-xl bg-[var(--lm-surface)] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                    {item.canceledReason}
                  </p>
                )}

                {item.status === "upcoming" && canceledIds.includes(item.id) && (
                  <p className="mt-3.5 rounded-xl bg-[var(--lm-surface)] px-3.5 py-2.5 text-[12.5px] font-semibold text-[var(--lm-success)]">
                    예약이 취소되었습니다. {PASS_BY_TIER[item.tier].name} 상담권 1장이
                    복구되었습니다.
                  </p>
                )}

                {item.status === "upcoming" && !canceledIds.includes(item.id) && (
                  <div className="mt-3.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate("booking", expert.id)}
                      className="flex-1 rounded-xl border border-[var(--lm-border)] py-2.5 text-[13px] font-bold text-[var(--lm-ink)]"
                    >
                      시간 변경
                    </button>
                    <button
                      type="button"
                      disabled={!isToday}
                      onClick={() => onNavigate("call", expert.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--lm-accent)] py-2.5 text-[13px] font-bold text-[var(--lm-accent-fg)] disabled:bg-[var(--lm-surface)] disabled:text-[var(--lm-muted)]"
                    >
                      <Phone size={13} weight="fill" />
                      {isToday ? "전화 연결" : "당일에 열려요"}
                    </button>
                  </div>
                )}

                {item.status === "upcoming" && !canceledIds.includes(item.id) && (
                  <button
                    type="button"
                    onClick={() => setCanceledIds((prev) => [...prev, item.id])}
                    className="mt-2.5 w-full py-1 text-[12.5px] font-semibold text-[var(--lm-muted)] underline underline-offset-2"
                  >
                    예약 취소
                  </button>
                )}

                {item.status === "done" && (
                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--lm-border)] py-2.5 text-[13px] font-bold text-[var(--lm-ink)]"
                    >
                      <PlayCircle size={14} />
                      녹취 듣기
                    </button>
                    <button
                      type="button"
                      disabled={reviewed}
                      onClick={() => onNavigate("reviewWrite", expert.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--lm-accent)] py-2.5 text-[13px] font-bold text-[var(--lm-accent-fg)] disabled:bg-[var(--lm-surface)] disabled:text-[var(--lm-muted)]"
                    >
                      <Star size={13} weight="fill" />
                      {reviewed ? "후기 작성 완료" : "후기 작성"}
                    </button>
                  </div>
                )}

                {item.status === "done" && (
                  <p className="lm-num mt-2.5 text-[11.5px] text-[var(--lm-muted)]">
                    사용 {item.usedMinutes}분 · 상담 번호 {item.id}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
