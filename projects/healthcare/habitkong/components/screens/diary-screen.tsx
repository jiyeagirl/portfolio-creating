"use client";

import { useState } from "react";
import { Check, FloppyDisk } from "@phosphor-icons/react";
import {
  TODAY,
  getMonthLog,
  monthCompletionRate,
  statusFor,
} from "@/projects/healthcare/habitkong/lib/habit";
import { dayMemos, getConditionScore, toKey } from "@/projects/healthcare/habitkong/lib/diary";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const STATUS_LABEL = { done: "루틴 완료", missed: "루틴 미완료", pending: "예정" } as const;

export function DiaryScreen() {
  const { leadingBlanks, days } = getMonthLog();
  const monthRate = monthCompletionRate();
  const [selected, setSelected] = useState(TODAY);
  const [memos, setMemos] = useState(dayMemos);
  const [justSaved, setJustSaved] = useState(false);

  const selectedKey = toKey(selected);
  const selectedStatus = statusFor(selected);
  const conditionScore = getConditionScore(selected);
  const memoDraft = memos[selectedKey] ?? "";

  function saveMemo() {
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">콩이 다이어리</h1>
          <p className="mt-1 text-[13px] text-[#8A8377]">2026년 7월</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-[#8A8377]">이번 달 루틴 실행률</p>
          <p className="text-[20px] font-bold tabular-nums text-[#17140F]">{monthRate}%</p>
        </div>
      </div>

      <div className="mt-5 rounded-[12px] border border-[#EAEAEA] bg-white p-4">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((label) => (
            <span key={label} className="pb-1 text-center text-[10.5px] font-medium text-[#B5AEA4]">
              {label}
            </span>
          ))}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const isSelected = toKey(day.date) === selectedKey;
            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelected(day.date)}
                className={`relative flex aspect-square items-center justify-center rounded-[8px] text-[11px] font-semibold tabular-nums transition-colors ${
                  isSelected
                    ? "bg-[#17140F] text-white"
                    : day.status === "done"
                      ? "bg-[#EDF3EC] text-[#346538]"
                      : day.status === "missed"
                        ? "bg-[#FDEBEC] text-[#9F2F2D]"
                        : "text-[#C9C0B8]"
                } ${day.isToday && !isSelected ? "ring-1 ring-[#17140F] ring-offset-1" : ""}`}
              >
                {day.day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-[#EAEAEA] pt-3 text-[10.5px] text-[#8A8377]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EDF3EC]" />
            완료
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FDEBEC]" />
            미완료
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-[#17140F]" />
            오늘
          </span>
        </div>
      </div>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13.5px] font-semibold text-[#17140F]">
            {selected.getMonth() + 1}월 {selected.getDate()}일 기록
          </h2>
          <span
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
              selectedStatus === "done"
                ? "bg-[#EDF3EC] text-[#346538]"
                : selectedStatus === "missed"
                  ? "bg-[#FDEBEC] text-[#9F2F2D]"
                  : "bg-[#F7F6F3] text-[#8A8377]"
            }`}
          >
            {STATUS_LABEL[selectedStatus]}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-4">
            <p className="text-[11px] font-medium text-[#8A8377]">건강 점수</p>
            <p className="mt-1 text-[20px] font-bold tabular-nums text-[#17140F]">
              {conditionScore ?? "—"}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-4">
            <p className="text-[11px] font-medium text-[#8A8377]">루틴 수행</p>
            <p className="mt-1 text-[20px] font-bold text-[#17140F]">
              {selectedStatus === "done" ? "O" : selectedStatus === "missed" ? "X" : "-"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="diary-memo" className="text-[12px] font-medium text-[#8A8377]">
            하루 메모
          </label>
          <textarea
            id="diary-memo"
            value={memoDraft}
            onChange={(e) => setMemos((prev) => ({ ...prev, [selectedKey]: e.target.value }))}
            rows={4}
            placeholder="오늘 컨디션이나 식사, 운동에 대해 가볍게 기록해보세요"
            className="mt-1.5 w-full resize-none rounded-[8px] border border-[#EAEAEA] bg-white p-3 text-[13px] leading-relaxed text-[#17140F] outline-none placeholder:text-[#B5AEA4]"
          />
          <button
            type="button"
            onClick={saveMemo}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#17140F] py-2.5 text-[13px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            {justSaved ? <Check size={14} weight="bold" /> : <FloppyDisk size={14} weight="bold" />}
            {justSaved ? "저장됨" : "메모 저장"}
          </button>
        </div>
      </section>
    </div>
  );
}
