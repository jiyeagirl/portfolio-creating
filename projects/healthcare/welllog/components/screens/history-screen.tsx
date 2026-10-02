"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, ForkKnife } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { EmptyState } from "@/projects/healthcare/welllog/components/ui";
import { historyDays } from "@/projects/healthcare/welllog/lib/mock-data";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function HistoryScreen({ onBack }: { onBack: () => void }) {
  const recordedCount = historyDays.filter((d) => d.hasEntry).length;
  const [selectedDay, setSelectedDay] = useState(historyDays.find((d) => d.note)?.day ?? historyDays[historyDays.length - 1].day);

  const leadingBlanks = new Date(`${historyDays[0].date}T00:00:00`).getDay();
  const selected = historyDays.find((d) => d.day === selectedDay);

  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-10">
      <ScreenHeader
        title="리듬 히스토리"
        subtitle="날짜별 기록을 모아봐요"
        onBack={onBack}
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        backButtonClassName="text-[var(--wl-ink)] hover:bg-[var(--wl-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
        subtitleClassName="text-[11px] text-[var(--wl-mute)]"
      />

      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="relative h-[104px] w-full">
            <Image src="https://picsum.photos/id/190/700/320" alt="낙엽 숲길 산책로" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-4">
            <p className="text-[12px] text-white/80">7월</p>
            <p className="text-[16px] font-semibold text-white">{recordedCount}일 기록했어요</p>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-[11px] font-medium text-[var(--wl-mute)]">
                {w}
              </span>
            ))}
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {historyDays.map((d) => {
              const active = d.day === selectedDay;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDay(d.day)}
                  disabled={!d.hasEntry}
                  className="flex flex-col items-center gap-0.5 py-0.5"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[12.5px] transition-colors ${
                      active
                        ? "bg-[var(--wl-accent)] font-semibold text-white"
                        : d.hasEntry
                          ? "text-[var(--wl-ink)]"
                          : "text-[var(--wl-mute)]/50"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span className="text-[11px] leading-none">{!active && d.moodEmoji ? d.moodEmoji : " "}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          {selected?.hasEntry ? (
            <div className="rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[var(--wl-ink)]">7월 {selected.day}일</p>
                <span className="text-[22px]">{selected.moodEmoji}</span>
              </div>
              {selected.note ? (
                <p className="mt-2 flex items-start gap-1.5 text-[13.5px] leading-5 text-[var(--wl-body)]">
                  <BookOpen size={14} className="mt-0.5 shrink-0" color="var(--wl-mute)" />
                  {selected.note}
                </p>
              ) : (
                <p className="mt-2 text-[13px] text-[var(--wl-mute)]">이 날은 리듬 카드만 가볍게 기록했어요.</p>
              )}
              {selected.hasMeal && (
                <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[var(--wl-mute)]">
                  <ForkKnife size={13} />
                  식단 기록 있음
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen size={20} />}
              title="이 날은 기록이 없어요"
              desc="기록이 있는 날짜를 눌러 그날의 리듬을 다시 볼 수 있어요."
            />
          )}
        </div>
      </div>
    </div>
  );
}
