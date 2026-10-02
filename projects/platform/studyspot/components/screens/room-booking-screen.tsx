"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Users } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, Button, Card, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { STUDY_ROOMS } from "@/projects/platform/studyspot/lib/mock-data";
import { won, type Navigate } from "@/projects/platform/studyspot/lib/navigation";

/* 고정 "오늘" 기준일 — new Date()를 쓰지 않아 화면이 항상 결정적으로 렌더된다. */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const BOOKING_DATES = Array.from({ length: 7 }, (_, i) => new Date(2025, 5, 15 + i));

/* 09시 ~ 21시, 1시간 단위 시작 시각 */
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => 9 + i);
const UNAVAILABLE_START_HOUR = 14;

const MIN_DURATION_HOURS = 1;
const MAX_DURATION_HOURS = 4;

const pad = (n: number) => String(n).padStart(2, "0");

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[13px] text-[var(--ss-mute)]">{label}</p>
      <p className="text-[13.5px] font-semibold text-[var(--ss-ink)]">{value}</p>
    </div>
  );
}

export function RoomBookingScreen({ roomId, onNavigate }: { roomId?: string; onNavigate: Navigate }) {
  const room = STUDY_ROOMS.find((r) => r.id === roomId) ?? STUDY_ROOMS[0];

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedStartHour, setSelectedStartHour] = useState(TIME_SLOTS[0]);
  const [durationHours, setDurationHours] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  const selectedDate = BOOKING_DATES[selectedDateIndex];
  const endHour = selectedStartHour + durationHours;
  const totalPrice = room.hourlyPrice * durationHours;

  const dateLabel = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${WEEKDAYS[selectedDate.getDay()]})`;
  const timeLabel = `${pad(selectedStartHour)}:00 ~ ${pad(endHour)}:00`;

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="스터디룸 예약"
        subtitle={room.name}
        onBack={() => onNavigate("branchDetail")}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]"
        subtitleClassName="text-[11px] text-[var(--ss-mute)]"
      />

      <div className="ss-enter flex-1 overflow-y-auto px-5 pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 룸 사진 배너 */}
        <div className="relative h-[140px] w-full overflow-hidden rounded-[12px]">
          <Image src={room.photo} alt={`${room.name} 사진`} fill sizes="440px" className="object-cover" priority />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13px] text-[var(--ss-mute)]">
            <Users size={14} />
            {room.capacity}인실
          </p>
          <p className="text-[15px] font-bold text-[var(--ss-ink)]">시간당 {won(room.hourlyPrice)}</p>
        </div>

        {/* 날짜 선택 */}
        <div className="mt-7">
          <SectionHead title="날짜 선택" />
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {BOOKING_DATES.map((date, index) => {
              const selected = index === selectedDateIndex;
              return (
                <button
                  key={date.getTime()}
                  type="button"
                  onClick={() => setSelectedDateIndex(index)}
                  className={`flex h-[64px] w-[52px] shrink-0 flex-col items-center justify-center gap-1 rounded-[10px] border transition-colors ${
                    selected
                      ? "border-[var(--ss-ink)] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]"
                      : "border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] text-[var(--ss-body)]"
                  }`}
                >
                  <span className="text-[11px] font-medium opacity-80">{WEEKDAYS[date.getDay()]}</span>
                  <span className="ss-mono text-[15px] font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 시간 선택 */}
        <div className="mt-7">
          <SectionHead title="시간 선택" />
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((hour) => {
              const disabled = hour === UNAVAILABLE_START_HOUR;
              const selected = hour === selectedStartHour;
              return (
                <button
                  key={hour}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedStartHour(hour)}
                  className={`ss-mono flex h-11 items-center justify-center rounded-[6px] border text-[13px] font-semibold transition-colors disabled:cursor-not-allowed ${
                    disabled
                      ? "border-transparent bg-[var(--ss-surface)] text-[var(--ss-mute-soft)] line-through"
                      : selected
                        ? "border-[var(--ss-ink)] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]"
                        : "border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] text-[var(--ss-body)]"
                  }`}
                >
                  {pad(hour)}:00
                </button>
              );
            })}
          </div>

          {/* 이용 시간 스테퍼 */}
          <div className="mt-3 flex items-center justify-between rounded-[12px] border border-[var(--ss-hairline)] px-4 py-3">
            <p className="text-[13px] font-medium text-[var(--ss-ink)]">이용 시간</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="이용 시간 줄이기"
                disabled={durationHours <= MIN_DURATION_HOURS}
                onClick={() => setDurationHours((h) => Math.max(MIN_DURATION_HOURS, h - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={14} weight="bold" />
              </button>
              <span className="ss-mono w-14 text-center text-[15px] font-bold text-[var(--ss-ink)]">
                {durationHours}시간
              </span>
              <button
                type="button"
                aria-label="이용 시간 늘리기"
                disabled={durationHours >= MAX_DURATION_HOURS}
                onClick={() => setDurationHours((h) => Math.min(MAX_DURATION_HOURS, h + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* 인원 선택 */}
        <div className="mt-7">
          <SectionHead title="인원 선택" />
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--ss-hairline)] px-4 py-3">
            <p className="flex items-center gap-1.5 text-[13px] text-[var(--ss-body)]">
              <Users size={14} />
              최대 {room.capacity}명
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="인원 줄이기"
                disabled={guestCount <= 1}
                onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={14} weight="bold" />
              </button>
              <span className="ss-mono w-10 text-center text-[15px] font-bold text-[var(--ss-ink)]">
                {guestCount}명
              </span>
              <button
                type="button"
                aria-label="인원 늘리기"
                disabled={guestCount >= room.capacity}
                onClick={() => setGuestCount((g) => Math.min(room.capacity, g + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* 예약 가능 여부 확인 */}
        <div className="mt-7 flex items-center justify-between rounded-[12px] bg-[var(--ss-positive-soft)] px-4 py-3.5">
          <p className="text-[13px] font-medium text-[var(--ss-positive)]">선택하신 일정에 예약이 가능해요</p>
          <Badge tone="positive" dot>
            예약 가능
          </Badge>
        </div>

        {/* 예약 정보 확인 */}
        <div className="mt-7">
          <SectionHead title="예약 정보 확인" />
          <Card padded>
            <div className="space-y-3">
              <SummaryRow label="룸" value={room.name} />
              <SummaryRow label="날짜" value={dateLabel} />
              <SummaryRow label="시간" value={timeLabel} />
              <SummaryRow label="인원" value={`${guestCount}명`} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--ss-hairline)] pt-4">
              <p className="text-[14px] font-semibold text-[var(--ss-ink)]">결제 금액</p>
              <p className="ss-mono text-[18px] font-extrabold text-[var(--ss-ink)]">{won(totalPrice)}</p>
            </div>
          </Card>
        </div>

        <div className="mt-7">
          <Button full size="lg" onClick={() => onNavigate("payment", room.branchId)} ariaLabel="예약하고 결제하기">
            예약하고 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
