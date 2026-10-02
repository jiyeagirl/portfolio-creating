"use client";

import { useState } from "react";
import { ArrowClockwise, CaretDown, CheckCircle, Clock, Receipt, SignOut } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { BottomNav } from "@/projects/platform/studyspot/components/bottom-nav";
import { Badge, Button, Card, EmptyState, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { branchById, CURRENT_SESSION, RESERVATIONS } from "@/projects/platform/studyspot/lib/mock-data";
import {
  dateOnly,
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_TONE,
  timeOnly,
  won,
  type Navigate,
} from "@/projects/platform/studyspot/lib/navigation";

/**
 * 목업 스냅샷 시각 — Date.now() 대신 고정 리터럴 파싱으로 결정론적 계산.
 * CURRENT_SESSION 체크인 14:20, 예정 종료 18:20 기준으로 16:05 시점을 "지금"으로 가정한다.
 */
const MOCK_NOW = new Date("2025-06-15T16:05:00");

function diffMinutes(from: Date, to: Date) {
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
}

function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

export function SessionScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [extended, setExtended] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [openReceiptId, setOpenReceiptId] = useState<string | null>(null);

  const session = CURRENT_SESSION;
  const branch = session ? branchById(session.branchId) : undefined;
  const hasSession = Boolean(session && branch);

  const checkedInAt = session ? new Date(session.checkedInAt) : null;
  const plannedEndAt = session ? new Date(session.plannedEndAt) : null;
  const displayedEndAt = plannedEndAt && extended ? new Date(plannedEndAt.getTime() + 60 * 60000) : plannedEndAt;

  const elapsedMinutes = checkedInAt ? diffMinutes(checkedInAt, MOCK_NOW) : 0;
  const remainingMinutes = displayedEndAt ? diffMinutes(MOCK_NOW, displayedEndAt) : 0;

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="이용 현황"
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]"
      />

      <div className="flex-1 overflow-y-auto px-5 pb-[140px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hasSession && session && branch && checkedInAt && displayedEndAt && !checkedOut && (
          <Card className="ss-enter">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ss-ink)] text-[var(--ss-on-ink)]">
                  <Clock size={20} weight="bold" />
                </span>
                <div>
                  <p className="text-[13px] text-[var(--ss-mute)]">{branch.name}</p>
                  <p className="mt-0.5 text-[17px] font-bold text-[var(--ss-ink)]">{session.seatLabel} 좌석</p>
                </div>
              </div>
              <Badge tone="positive" dot live>
                이용 중
              </Badge>
            </div>

            <div className="mt-7 text-center">
              <p className="text-[13px] text-[var(--ss-mute)]">남은 이용 시간</p>
              <p className="ss-mono mt-1 text-[34px] font-extrabold leading-[40px] text-[var(--ss-ink)]">
                {formatDuration(remainingMinutes)} 남음
              </p>
              <p className="mt-1.5 text-[13px] text-[var(--ss-body)]">{timeOnly(displayedEndAt.toISOString())}까지 이용 예정</p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[8px] bg-[var(--ss-surface)] px-4 py-3">
              <span className="text-[13px] text-[var(--ss-mute)]">현재까지 이용 시간</span>
              <span className="ss-mono text-[13.5px] font-semibold text-[var(--ss-ink)]">{formatDuration(elapsedMinutes)}</span>
            </div>

            {extended && (
              <p className="mt-3 text-center text-[12.5px] font-medium text-[var(--ss-info)]">1시간 연장되었어요</p>
            )}

            <div className="mt-6 flex gap-2">
              <Button
                variant="secondary"
                full
                icon={<ArrowClockwise size={16} weight="bold" />}
                onClick={() => setExtended(true)}
                disabled={extended}
              >
                이용 연장
              </Button>
              <Button variant="danger" full icon={<SignOut size={16} weight="bold" />} onClick={() => setCheckedOut(true)}>
                퇴실하기
              </Button>
            </div>
          </Card>
        )}

        {hasSession && session && branch && checkedOut && (
          <Card className="ss-enter text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ss-positive-soft)] text-[var(--ss-positive)]">
              <CheckCircle size={26} weight="fill" />
            </span>
            <p className="mt-3 text-[16px] font-bold text-[var(--ss-ink)]">퇴실이 완료되었어요</p>
            <p className="mt-1 text-[13px] text-[var(--ss-mute)]">이용해주셔서 감사합니다</p>

            <div className="mt-5 space-y-2.5 rounded-[8px] bg-[var(--ss-surface)] p-4 text-left">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--ss-mute)]">이용 지점</span>
                <span className="font-medium text-[var(--ss-ink)]">{branch.name}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--ss-mute)]">이용 좌석</span>
                <span className="font-medium text-[var(--ss-ink)]">{session.seatLabel}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--ss-mute)]">총 이용 시간</span>
                <span className="ss-mono font-medium text-[var(--ss-ink)]">{formatDuration(elapsedMinutes)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--ss-hairline)] pt-2.5 text-[13.5px]">
                <span className="font-semibold text-[var(--ss-ink)]">정산 금액</span>
                <span className="ss-mono font-bold text-[var(--ss-ink)]">0원 (자유석 이용권 적용)</span>
              </div>
            </div>

            <div className="mt-5">
              <Button full onClick={() => onNavigate("home")}>
                홈으로 돌아가기
              </Button>
            </div>
          </Card>
        )}

        {!hasSession && (
          <EmptyState
            title="이용 중인 좌석이 없어요"
            desc="가까운 지점을 찾아 좌석을 예약하거나 바로 체크인해보세요"
            action={<Button onClick={() => onNavigate("home")}>지점 찾아보기</Button>}
          />
        )}

        {/* 이용 내역 */}
        <div className="mt-8">
          <SectionHead title="이용 내역" desc="최근 예약 및 이용 기록" />
          <div className="space-y-3">
            {RESERVATIONS.map((r) => {
              const b = branchById(r.branchId);
              const isOpen = openReceiptId === r.id;
              return (
                <Card key={r.id} padded={false}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-bold text-[var(--ss-ink)]">{r.label}</p>
                        <p className="mt-0.5 text-[12px] text-[var(--ss-mute)]">
                          {b?.name ?? "지점 정보 없음"} | {dateOnly(r.date)}
                        </p>
                      </div>
                      <Badge tone={RESERVATION_STATUS_TONE[r.status]}>{RESERVATION_STATUS_LABEL[r.status]}</Badge>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[12.5px] text-[var(--ss-mute)]">
                        {r.startTime} ~ {r.endTime}
                      </span>
                      <span className="ss-mono text-[13.5px] font-semibold text-[var(--ss-ink)]">
                        {r.price > 0 ? won(r.price) : "무료"}
                      </span>
                    </div>

                    {r.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => setOpenReceiptId(isOpen ? null : r.id)}
                        className="mt-3 flex items-center gap-1 text-[12.5px] font-medium text-[var(--ss-mute)]"
                      >
                        <Receipt size={13} />
                        영수증 보기
                        <CaretDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {isOpen && r.status === "completed" && (
                    <div className="space-y-2 border-t border-[var(--ss-hairline)] bg-[var(--ss-surface)] p-4">
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="text-[var(--ss-mute)]">이용 항목</span>
                        <span className="font-medium text-[var(--ss-ink)]">{r.label}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="text-[var(--ss-mute)]">이용 일시</span>
                        <span className="ss-mono font-medium text-[var(--ss-ink)]">
                          {dateOnly(r.date)} {r.startTime}~{r.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[13px] font-semibold">
                        <span className="text-[var(--ss-ink)]">결제 금액</span>
                        <span className="ss-mono text-[var(--ss-ink)]">{r.price > 0 ? won(r.price) : "무료"}</span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav screen="session" onNavigate={onNavigate} />
    </div>
  );
}
