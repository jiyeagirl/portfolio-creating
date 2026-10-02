"use client";

import { useState } from "react";
import { Check, FloppyDisk, Footprints, ForkKnife, Moon, Timer } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import {
  TODAY,
  getMonthLog,
  monthCompletionRate,
  statusFor,
} from "@/projects/healthcare/habitkong/lib/habit";
import {
  dayMemos,
  getConditionScore,
  getDayRecord,
  toKey,
} from "@/projects/healthcare/habitkong/lib/diary";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import type { Mood } from "@/projects/healthcare/habitkong/lib/health";
import { Card, ScreenHeader, SectionTitle, Tag } from "@/projects/healthcare/habitkong/components/ui";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const STATUS_LABEL = { done: "루틴 완료", missed: "루틴 미완료", pending: "예정" } as const;

function moodOf(score: number | null): Mood {
  if (score === null) return "tired";
  if (score >= 85) return "great";
  if (score >= 72) return "good";
  return "tired";
}

export function DiaryScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const { leadingBlanks, days } = getMonthLog();
  const monthRate = monthCompletionRate();
  const [selected, setSelected] = useState(TODAY);
  const [memos, setMemos] = useState(dayMemos);
  const [justSaved, setJustSaved] = useState(false);

  const selectedKey = toKey(selected);
  const selectedStatus = statusFor(selected);
  const conditionScore = getConditionScore(selected);
  const record = getDayRecord(selected);
  const memoDraft = memos[selectedKey] ?? "";
  const recorded = days.filter((d) => getConditionScore(d.date) !== null).length;

  function saveMemo() {
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1500);
  }

  return (
    <div className="min-h-full w-full pb-10">
      <ScreenHeader
        title="콩이 다이어리"
        subtitle="2026년 7월"
        onBack={() => onNavigate("report")}
        right={
          <span className="shrink-0 text-right">
            <span className="block text-[10.5px] text-[#8A8377]">이번 달 실행률</span>
            <span className="block text-[14px] font-bold tabular-nums text-[#17140F]">
              {monthRate}%
            </span>
          </span>
        }
      />

      <div className="px-5 pt-5">
        <Card className="p-4">
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
            <span className="ml-auto tabular-nums">기록 {recorded}일</span>
          </div>
        </Card>
      </div>

      <section className="mt-5 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13.5px] font-semibold text-[#17140F]">
            {selected.getMonth() + 1}월 {selected.getDate()}일 기록
          </h2>
          <Tag
            tone={
              selectedStatus === "done" ? "green" : selectedStatus === "missed" ? "red" : "neutral"
            }
          >
            {STATUS_LABEL[selectedStatus]}
          </Tag>
        </div>

        <Card className="mt-3 flex items-center gap-4 p-4">
          <Mascot size={54} mood={moodOf(conditionScore)} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[#8A8377]">그날의 건강 점수</p>
            <p className="mt-0.5 text-[26px] font-bold leading-none tabular-nums text-[#17140F]">
              {conditionScore ?? "-"}
            </p>
            <p className="mt-2 text-[11.5px] text-[#8A8377]">
              {conditionScore === null
                ? "아직 기록이 없는 날이에요."
                : conditionScore >= 85
                  ? "콩이도 기운이 넘쳤던 날이에요."
                  : conditionScore >= 72
                    ? "무난하게 잘 보낸 하루였어요."
                    : "조금 지쳐 보였던 날이에요."}
            </p>
          </div>
        </Card>

        {record ? (
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <RecordTile
              icon={<Footprints size={14} weight="bold" />}
              label="걸음"
              value={record.steps.toLocaleString()}
              unit="보"
            />
            <RecordTile
              icon={<Moon size={14} weight="bold" />}
              label="수면"
              value={`${record.sleepHours}`}
              unit="시간"
            />
            <RecordTile
              icon={<Timer size={14} weight="bold" />}
              label="운동"
              value={`${record.exerciseMinutes}`}
              unit="분"
            />
            <RecordTile
              icon={<ForkKnife size={14} weight="bold" />}
              label="섭취"
              value={record.kcal.toLocaleString()}
              unit="kcal"
            />
          </div>
        ) : (
          <p className="mt-2.5 rounded-[12px] border border-dashed border-[#EAEAEA] px-4 py-6 text-center text-[12px] text-[#B5AEA4]">
            이 날짜에는 저장된 건강 기록이 없어요
          </p>
        )}

        {record && record.meals.length > 0 && (
          <div className="mt-2.5">
            <SectionTitle title="그날의 식단" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {record.meals.map((meal) => (
                <span
                  key={meal}
                  className="rounded-full border border-[#EAEAEA] bg-white px-2.5 py-1 text-[11.5px] text-[#4A443C]"
                >
                  {meal}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="diary-memo" className="text-[12px] font-medium text-[#8A8377]">
            하루 메모
          </label>
          <textarea
            id="diary-memo"
            value={memoDraft}
            onChange={(e) => setMemos((prev) => ({ ...prev, [selectedKey]: e.target.value }))}
            rows={4}
            placeholder="오늘 컨디션이나 식사, 운동에 대해 가볍게 기록해보세요"
            className="mt-1.5 w-full resize-none rounded-[8px] border border-[#EAEAEA] bg-white p-3 text-[13px] leading-relaxed text-[#17140F] outline-none placeholder:text-[#B5AEA4] focus:border-[#17140F]"
          />
          <button
            type="button"
            onClick={saveMemo}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#17140F] py-2.5 text-[13px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            {justSaved ? <Check size={14} weight="bold" /> : <FloppyDisk size={14} weight="bold" />}
            {justSaved ? "저장됨" : "메모 저장"}
          </button>
        </div>
      </section>

      <section className="mt-6 px-5">
        <SectionTitle title="지난 기록" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {[...days]
            .filter((d) => getConditionScore(d.date) !== null)
            .reverse()
            .map((day, index) => {
              const score = getConditionScore(day.date);
              const memo = memos[toKey(day.date)];
              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setSelected(day.date)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FBFBFA] ${
                    index > 0 ? "border-t border-[#EAEAEA]" : ""
                  }`}
                >
                  <span className="w-12 shrink-0 text-[11.5px] font-medium tabular-nums text-[#8A8377]">
                    7월 {day.day}일
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-[#4A443C]">
                    {memo || "메모 없음"}
                  </span>
                  <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-[#17140F]">
                    {score}
                  </span>
                </button>
              );
            })}
        </div>
      </section>
    </div>
  );
}

function RecordTile({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-3.5">
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8377]">
        {icon}
        {label}
      </span>
      <p className="mt-1.5 text-[17px] font-bold tabular-nums text-[#17140F]">
        {value}
        <span className="ml-0.5 text-[11px] font-medium text-[#8A8377]">{unit}</span>
      </p>
    </div>
  );
}
