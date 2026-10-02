"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarBlank, Sparkle, TrendUp } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import {
  aiReport,
  habitSeries,
  healthLevel,
  improvements,
  scoreSeries,
  scoreSummary,
  streakAnalysis,
  type Range,
} from "@/projects/healthcare/habitkong/lib/report";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import {
  BarChart,
  Card,
  ProgressBar,
  SectionTitle,
  Segmented,
  Tag,
} from "@/projects/healthcare/habitkong/components/ui";

export function ReportScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const [range, setRange] = useState<Range>("week");

  const series = scoreSeries[range];
  const summary = scoreSummary[range];
  const habits = habitSeries[range];
  const levelProgress = healthLevel.exp / healthLevel.nextExp;

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">건강 리포트</h1>
          <p className="mt-1 text-[13px] text-[#8A8377]">{aiReport.updatedAt}</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("diary")}
          className="flex items-center gap-1 text-[11.5px] font-medium text-[#8A8377] transition-colors hover:text-[#17140F]"
        >
          <CalendarBlank size={13} weight="bold" />
          다이어리
        </button>
      </div>

      <div className="mt-4">
        <Segmented<Range>
          value={range}
          onChange={setRange}
          options={[
            { key: "week", label: "주간" },
            { key: "month", label: "월간" },
          ]}
        />
      </div>

      <Card className="mt-4 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11.5px] font-medium text-[#8A8377]">
              {range === "week" ? "이번 주" : "이번 달"} 평균 건강 점수
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-[32px] font-bold leading-none tabular-nums text-[#17140F]">
                {summary.average}
              </p>
              <span className="flex items-center gap-0.5 text-[11.5px] font-semibold tabular-nums text-[#346538]">
                <TrendUp size={12} weight="bold" />
                {summary.delta}
              </span>
            </div>
          </div>
          <Tag tone="green">최고 {summary.best}</Tag>
        </div>

        <div className="mt-4">
          <BarChart data={series.map((d) => ({ label: d.label, value: d.score }))} max={100} height={104} />
        </div>
      </Card>

      <section className="mt-5">
        <SectionTitle title="수면 · 운동 · 식단 변화" />
        <div className="mt-2.5 flex flex-col gap-2">
          {habits.map((item) => {
            const latest = item.points[item.points.length - 1];
            const first = item.points[0];
            const diff = Math.round((latest - first) * 10) / 10;
            const max = Math.max(item.goal, ...item.points);
            return (
              <Card key={item.key} className="p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[12.5px] font-semibold text-[#17140F]">{item.label}</p>
                  <p className="text-[11.5px] tabular-nums text-[#8A8377]">
                    최근 {latest}
                    {item.unit} · 목표 {item.goal}
                    {item.unit}
                  </p>
                </div>

                {/* 한 계열짜리 라인. 목표선은 점선 한 줄로만 표시한다. */}
                <div className="relative mt-3 h-[52px]">
                  <div
                    className="absolute inset-x-0 border-t border-dashed border-[#EAEAEA]"
                    style={{ bottom: `${(item.goal / max) * 100}%` }}
                  />
                  <div className="flex h-full items-end gap-[3px]">
                    {item.points.map((point, i) => (
                      <span
                        key={i}
                        title={`${point}${item.unit}`}
                        className={`flex-1 rounded-t-[3px] ${
                          i === item.points.length - 1 ? "bg-[#17140F]" : "bg-[#EAEAEA]"
                        }`}
                        style={{ height: `${Math.max(6, (point / max) * 100)}%` }}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-[11.5px] tabular-nums text-[#8A8377]">
                  {range === "week" ? "주 시작 대비" : "월 시작 대비"}{" "}
                  <span className={diff >= 0 ? "text-[#346538]" : "text-[#9F2F2D]"}>
                    {diff >= 0 ? "+" : ""}
                    {diff}
                    {item.unit}
                  </span>
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="루틴 달성률" />
        <Card className="mt-2.5 p-4">
          <div className="grid grid-cols-3 divide-x divide-[#EAEAEA]">
            <div className="px-1 text-center">
              <p className="text-[10.5px] text-[#8A8377]">현재 연속</p>
              <p className="mt-1 text-[17px] font-bold tabular-nums text-[#17140F]">
                {streakAnalysis.current}일
              </p>
            </div>
            <div className="px-1 text-center">
              <p className="text-[10.5px] text-[#8A8377]">최고 기록</p>
              <p className="mt-1 text-[17px] font-bold tabular-nums text-[#17140F]">
                {streakAnalysis.best}일
              </p>
            </div>
            <div className="px-1 text-center">
              <p className="text-[10.5px] text-[#8A8377]">이번 달</p>
              <p className="mt-1 text-[17px] font-bold tabular-nums text-[#17140F]">
                {streakAnalysis.monthRate}%
              </p>
            </div>
          </div>
          <div className="mt-3.5 border-t border-[#EAEAEA] pt-3">
            <p className="text-[12px] leading-relaxed text-[#4A443C]">{streakAnalysis.pattern}</p>
            <p className="mt-1.5 text-[11px] text-[#B5AEA4]">
              놓친 날 {streakAnalysis.missedDays.join(", ")}
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <SectionTitle title="AI 컨디션 분석" />
        <Card className="mt-2.5 p-4">
          <Tag tone="blue">
            <Sparkle size={11} weight="fill" />
            주간 분석
          </Tag>
          <p className="mt-2.5 text-[14px] font-semibold leading-snug text-[#17140F]">
            {aiReport.headline}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[#4A443C]">{aiReport.body}</p>
        </Card>
      </section>

      <section className="mt-5">
        <SectionTitle title="개선 포인트" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {improvements.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-start gap-3 px-4 py-3.5 ${
                index > 0 ? "border-t border-[#EAEAEA]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[#17140F]">{item.title}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#8A8377]">{item.detail}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[#346538]">
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="건강 레벨" />
        <Card className="mt-2.5 flex items-center gap-4 p-4">
          <Mascot size={56} mood="great" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between">
              <p className="text-[14px] font-semibold text-[#17140F]">
                Lv.{healthLevel.level} {healthLevel.name}
              </p>
              <span className="text-[11px] tabular-nums text-[#8A8377]">
                {healthLevel.exp}/{healthLevel.nextExp}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={levelProgress} height={5} />
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11.5px] text-[#8A8377]">
              <ArrowUpRight size={12} weight="bold" />
              이번 주 경험치 +{healthLevel.gainedThisWeek} · 다음 단계 {healthLevel.nextName}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
