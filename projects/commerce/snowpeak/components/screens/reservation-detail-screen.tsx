"use client";

import { useState } from "react";
import { CheckCircle, Info, Warning } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  BottomSheet,
  Card,
  DangerGhostButton,
  Field,
  GhostButton,
  SectionHead,
  SelectField,
} from "@/projects/commerce/snowpeak/components/ui";
import { formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { Reservation, ReservationStatus } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";

const STATUS_TONE: Record<ReservationStatus, Tone> = {
  확정: "success",
  예약대기: "warn",
  체크인: "info",
  체크아웃: "info",
  취소: "danger",
  환불완료: "neutral",
};

const CANCEL_REASONS = ["일정 변경", "단순 변심", "가격 및 비용 부담", "기타"];

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}.${m}.${d}`;
}

export function ReservationDetailScreen({
  reservationId,
  reservations,
  onNavigate,
  onCancelReservation,
}: {
  reservationId?: string;
  reservations: Reservation[];
  onNavigate: NavigateFn;
  onCancelReservation: (id: string) => void;
}) {
  const reservation = reservations.find((r) => r.id === reservationId) ?? reservations[0];

  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [cancelled, setCancelled] = useState(false);

  const cancellable = reservation.status === "확정" || reservation.status === "예약대기";
  const alreadyCancelled = reservation.status === "취소" || reservation.status === "환불완료";

  function handleConfirmCancel() {
    onCancelReservation(reservation.id);
    setCancelled(true);
    setTimeout(() => {
      setCancelOpen(false);
    }, 900);
  }

  return (
    <div className="snowpeak relative flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="예약 상세" onBack={() => onNavigate("reservationList")} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        <Card>
          <div className="flex items-center justify-between gap-2">
            <span className="sp-num text-[12.5px] text-[var(--sp-mute)]">{reservation.confirmationNo}</span>
            <Badge tone={STATUS_TONE[reservation.status]}>{reservation.status}</Badge>
          </div>
          <p className="mt-3 text-[18px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">
            {reservation.lines[0]?.name ?? "예약 상품"}
            {reservation.lines.length > 1 ? ` 외 ${reservation.lines.length - 1}건` : ""}
          </p>
          <div className="mt-4 flex items-center justify-between rounded-[12px] bg-[var(--sp-surface-soft)] px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold text-[var(--sp-mute)]">체크인</p>
              <p className="sp-num mt-0.5 text-[14px] font-semibold text-[var(--sp-ink)]">
                {formatFullDate(reservation.checkIn)}
              </p>
            </div>
            <div className="h-8 w-px bg-[var(--sp-border-strong)]" />
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[var(--sp-mute)]">체크아웃</p>
              <p className="sp-num mt-0.5 text-[14px] font-semibold text-[var(--sp-ink)]">
                {formatFullDate(reservation.checkOut)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12.5px] text-[var(--sp-mute)]">
            <span>예약자</span>
            <span className="text-[var(--sp-ink)]">{reservation.guestName}</span>
          </div>
        </Card>

        <div className="mt-6">
          <SectionHead title="예약 상품" />
          <Card className="divide-y divide-[var(--sp-border)]" padded={false}>
            {reservation.lines.map((line, i) => (
              <div key={`${line.name}-${i}`} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[var(--sp-ink)]">{line.name}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">
                    {line.detail} | {line.quantity}건
                  </p>
                </div>
                <span className="sp-num shrink-0 text-[14px] font-semibold text-[var(--sp-ink)]">
                  {formatWon(line.amount)}원
                </span>
              </div>
            ))}
          </Card>
        </div>

        <div className="mt-6">
          <SectionHead title="결제 정보" />
          <Card>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--sp-mute)]">결제 수단</span>
              <span className="font-medium text-[var(--sp-ink)]">{reservation.paymentMethod}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--sp-border)] pt-3">
              <span className="text-[14px] font-semibold text-[var(--sp-ink)]">총 결제금액</span>
              <span className="sp-num text-[18px] font-semibold text-[var(--sp-accent)]">
                {formatWon(reservation.totalAmount)}원
              </span>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          {cancellable && (
            <DangerGhostButton onClick={() => setCancelOpen(true)}>예약 취소</DangerGhostButton>
          )}
          {alreadyCancelled && (
            <div className="flex items-center gap-2.5 rounded-[12px] bg-[var(--sp-surface-soft)] px-4 py-3.5">
              <Info size={17} weight="bold" className="shrink-0 text-[var(--sp-mute)]" />
              <p className="text-[12.5px] leading-relaxed text-[var(--sp-body)]">
                {reservation.status === "환불완료"
                  ? "환불 처리가 완료된 예약입니다."
                  : "취소된 예약입니다."}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        open={cancelOpen}
        title="예약 취소"
        onClose={() => {
          setCancelOpen(false);
          setCancelled(false);
        }}
      >
        {cancelled ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle size={30} weight="fill" className="text-[var(--sp-success)]" />
            <p className="text-[14px] font-semibold text-[var(--sp-ink)]">취소 신청이 접수되었습니다</p>
            <p className="text-[12.5px] text-[var(--sp-mute)]">환불 규정에 따라 순차 처리됩니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2.5 rounded-[12px] bg-[var(--sp-warn-soft)] px-4 py-3">
              <Warning size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--sp-warn)]" />
              <p className="text-[12.5px] leading-relaxed text-[var(--sp-body)]">
                취소 시 환불 규정에 따라 처리되며, 상품 및 취소 시점에 따라 수수료가 발생할 수 있습니다.
              </p>
            </div>
            <Field label="취소 사유">
              <SelectField value={reason} options={CANCEL_REASONS} onChange={setReason} />
            </Field>
            <div className="flex gap-2 pt-2">
              <div className="flex-1">
                <GhostButton onClick={() => setCancelOpen(false)}>닫기</GhostButton>
              </div>
              <div className="flex-1">
                <DangerGhostButton onClick={handleConfirmCancel}>취소 신청</DangerGhostButton>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
