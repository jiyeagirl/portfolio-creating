"use client";

import { CheckCircle, Mountains } from "@phosphor-icons/react";
import { Card, GhostButton, PrimaryButton } from "@/projects/commerce/snowpeak/components/ui";
import { formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItemKind, Reservation } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

const KIND_LABEL: Record<CartItemKind, string> = {
  room: "객실",
  lift: "리프트권",
  season: "시즌권",
  rental: "장비 렌탈",
  package: "패키지",
};

export function BookingCompleteScreen({
  reservationId,
  reservations,
  onNavigate,
}: {
  reservationId?: string;
  reservations: Reservation[];
  onNavigate: NavigateFn;
}) {
  const reservation = reservations.find((r) => r.id === reservationId);

  if (!reservation) {
    return (
      <div className="snowpeak flex h-full flex-col items-center justify-center gap-4 bg-[var(--sp-bg)] px-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-mute)]">
          <Mountains size={24} weight="bold" />
        </span>
        <p className="text-[15px] font-semibold text-[var(--sp-ink)]">예약 정보를 찾을 수 없어요</p>
        <GhostButton onClick={() => onNavigate("home")}>홈으로</GhostButton>
      </div>
    );
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-[calc(env(safe-area-inset-top)+40px)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
            <CheckCircle size={32} weight="fill" />
          </span>
          <div>
            <p className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--sp-ink)]">
              예약이 완료되었습니다
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--sp-mute)]">
              결제가 정상적으로 처리됐어요. 예약 확인서는 마이페이지에서 언제든 다시 확인할 수 있어요.
            </p>
          </div>
        </div>

        <Card className="mt-7 overflow-hidden" padded={false}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--sp-mute)]">
                예약 확인서
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-accent)]">
                <Mountains size={15} weight="bold" />
              </span>
            </div>
            <p className="sp-num mt-2 text-[17px] font-semibold text-[var(--sp-ink)]">
              {reservation.confirmationNo}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-y-3 text-[13px]">
              <div>
                <p className="text-[var(--sp-mute)]">예약자</p>
                <p className="mt-0.5 font-semibold text-[var(--sp-ink)]">{reservation.guestName}</p>
              </div>
              <div>
                <p className="text-[var(--sp-mute)]">결제 수단</p>
                <p className="mt-0.5 font-semibold text-[var(--sp-ink)]">{reservation.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[var(--sp-mute)]">체크인</p>
                <p className="sp-num mt-0.5 font-semibold text-[var(--sp-ink)]">{reservation.checkIn}</p>
              </div>
              <div>
                <p className="text-[var(--sp-mute)]">체크아웃</p>
                <p className="sp-num mt-0.5 font-semibold text-[var(--sp-ink)]">{reservation.checkOut}</p>
              </div>
            </div>
          </div>

          <div className="relative border-t border-dashed border-[var(--sp-border-strong)]">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-[var(--sp-bg)]" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-[var(--sp-bg)]" />
          </div>

          <div className="space-y-3 p-5">
            {reservation.lines.map((line, index) => (
              <div key={`${line.name}-${index}`} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--sp-mute)]">{KIND_LABEL[line.kind]}</p>
                  <p className="mt-0.5 truncate text-[13.5px] font-semibold text-[var(--sp-ink)]">{line.name}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">
                    {line.detail} | {line.quantity}개
                  </p>
                </div>
                <span className="sp-num shrink-0 text-[13.5px] font-semibold text-[var(--sp-ink)]">
                  {formatWon(line.amount)}원
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-[var(--sp-border)] pt-3">
              <span className="text-[14px] font-semibold text-[var(--sp-ink)]">총 결제 금액</span>
              <span className="sp-num text-[18px] font-semibold text-[var(--sp-ink)]">
                {formatWon(reservation.totalAmount)}원
              </span>
            </div>
            <p className="text-right text-[11.5px] text-[var(--sp-mute)]">발급일 {reservation.createdAt}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-2.5 border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-4">
        <PrimaryButton onClick={() => onNavigate("reservationDetail", reservation.id)}>
          예약 내역 보기
        </PrimaryButton>
        <GhostButton onClick={() => onNavigate("home")}>홈으로</GhostButton>
      </div>
    </div>
  );
}
