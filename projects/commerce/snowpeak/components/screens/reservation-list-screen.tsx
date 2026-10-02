"use client";

import { useState } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import { AppBar, Badge, Chip, EmptyState, PriceTag } from "@/projects/commerce/snowpeak/components/ui";
import type { Reservation, ReservationStatus } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";

type StatusFilter = "전체" | ReservationStatus;

const STATUS_TONE: Record<ReservationStatus, Tone> = {
  확정: "success",
  예약대기: "warn",
  체크인: "info",
  체크아웃: "info",
  취소: "danger",
  환불완료: "neutral",
};

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}.${d}`;
}

export function ReservationListScreen({
  reservations,
  onNavigate,
}: {
  reservations: Reservation[];
  onNavigate: NavigateFn;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");

  const presentStatuses = Array.from(new Set(reservations.map((r) => r.status)));
  const filters: StatusFilter[] = ["전체", ...presentStatuses];

  const recentFirst = reservations.slice().reverse();
  const filtered = recentFirst.filter((r) => statusFilter === "전체" || r.status === statusFilter);

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="예약 내역" onBack={() => onNavigate("mypage")} />

      <div className="sp-scroll-x flex gap-2 overflow-x-auto px-5 pb-3 pt-4">
        {filters.map((status) => (
          <Chip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
            {status}
          </Chip>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarBlank size={22} weight="bold" />}
            title="예약 내역이 없어요"
            body="해당 상태의 예약이 아직 없습니다."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((res) => {
              const firstLine = res.lines[0];
              const extraCount = res.lines.length - 1;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onNavigate("reservationDetail", res.id)}
                  className="flex w-full flex-col gap-2.5 rounded-[16px] bg-[var(--sp-surface)] p-4 text-left transition-transform active:scale-[0.98]"
                  style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="sp-num text-[11.5px] text-[var(--sp-mute)]">{res.confirmationNo}</span>
                    <Badge tone={STATUS_TONE[res.status]}>{res.status}</Badge>
                  </div>
                  <p className="text-[15px] font-semibold text-[var(--sp-ink)]">
                    {firstLine?.name ?? "예약 상품"}
                    {extraCount > 0 ? ` 외 ${extraCount}건` : ""}
                  </p>
                  <p className="sp-num text-[12.5px] text-[var(--sp-mute)]">
                    {formatShortDate(res.checkIn)} ~ {formatShortDate(res.checkOut)}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] text-[var(--sp-mute)]">{res.paymentMethod}</span>
                    <PriceTag price={res.totalAmount} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
