"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Export, Sparkle } from "@phosphor-icons/react";
import {
  Card,
  ScreenHeader,
  SectionTitle,
  SegmentedControl,
} from "@/projects/monitoring/caresignal/components/app/ui";
import { PHOTO, photoUrl } from "@/projects/monitoring/caresignal/lib/photos";
import { guardians, report, user } from "@/projects/monitoring/caresignal/lib/app-data";

type Range = "weekly" | "monthly";

const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
];

const EVENT_TONE = {
  safe: { wash: "bg-[#eaf6ee]", text: "text-[#248a3d]" },
  caution: { wash: "bg-[#fdf2e3]", text: "text-[#9a5b00]" },
  danger: { wash: "bg-[#fdecea]", text: "text-[#d70015]" },
} as const;

export function ReportScreen() {
  const [range, setRange] = useState<Range>("weekly");
  const data = report[range];
  const trendMax = Math.max(...data.trend.map((t) => t.value));
  const down = data.scoreDelta < 0;

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px]">
      <ScreenHeader
        title="건강 리포트"
        description={`${user.name} 님 · ${data.rangeLabel}`}
      />

      <SegmentedControl className="mt-5" value={range} options={RANGE_OPTIONS} onChange={setRange} />

      {/* 종합 점수. 리포트에서 유일한 다크 서피스라 시선이 먼저 닿는다. */}
      <Card tone="dark" className="mt-4 p-5">
        <p className="text-[13px] font-normal leading-none text-[#cccccc]">종합 안전 점수</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="flex items-baseline gap-2">
            <span className="text-[52px] font-bold leading-none tracking-[-0.04em] tabular-nums">
              {data.score}
            </span>
            <span className="text-[17px] font-normal text-[#cccccc]">점</span>
          </p>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-semibold leading-none ${
              down ? "bg-[#3a3a3c] text-white" : "bg-[#2997ff] text-white"
            }`}
          >
            {down ? <ArrowDown size={12} weight="bold" /> : <ArrowUp size={12} weight="bold" />}
            {Math.abs(data.scoreDelta)}점
          </span>
        </div>
        <p className="mt-4 border-t border-[#3a3a3c] pt-3.5 text-[14px] font-normal leading-[1.6] text-[#e5e5e7]">
          {data.summary}
        </p>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.stats.map((stat) => (
          <div key={stat.label} className="rounded-[11px] bg-[#f5f5f7] px-3.5 py-3.5">
            <p className="text-[12px] font-normal leading-none text-[#7a7a7a]">{stat.label}</p>
            <p className="mt-2.5 flex items-baseline gap-1">
              <span className="text-[21px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[#1d1d1f]">
                {stat.value}
              </span>
              {stat.unit && <span className="text-[13px] font-normal text-[#333333]">{stat.unit}</span>}
            </p>
            <p
              className={`mt-2 text-[12px] font-semibold leading-none tabular-nums ${
                stat.delta.startsWith("-") ? "text-[#9a5b00]" : "text-[#248a3d]"
              }`}
            >
              {stat.delta}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle className="mt-8">활동량 추이</SectionTitle>
      <div className="mt-3 rounded-[18px] border border-[#e0e0e0] p-4">
        <p className="text-[12.5px] font-normal leading-none text-[#7a7a7a]">
          {range === "weekly" ? "주간 총 걸음 수 (천 보)" : "월간 하루 평균 걸음 수 (백 보)"}
        </p>
        <div className="mt-4 flex h-[116px] gap-2.5">
          {data.trend.map((point, index) => {
            const ratio = Math.round((point.value / trendMax) * 100);
            const isLast = index === data.trend.length - 1;
            return (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className={`text-[11px] font-semibold leading-none tabular-nums ${
                    isLast ? "text-[#0066cc]" : "text-[#7a7a7a]"
                  }`}
                >
                  {point.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-[4px] ${isLast ? "bg-[#0066cc]" : "bg-[#d2d2d7]"}`}
                    style={{ height: `${ratio}%` }}
                  />
                </div>
                <span className="text-[10.5px] font-normal leading-none text-[#7a7a7a]">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <SectionTitle className="mt-8">위험 이벤트 통계</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.events.map((event) => {
          const tone = EVENT_TONE[event.tone];
          return (
            <div
              key={event.label}
              className="flex items-center justify-between rounded-[11px] border border-[#e0e0e0] px-3.5 py-3"
            >
              <span className="text-[13.5px] font-normal text-[#333333]">{event.label}</span>
              <span
                className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[14px] font-semibold tabular-nums ${tone.wash} ${tone.text}`}
              >
                {event.count}
              </span>
            </div>
          );
        })}
      </div>

      <SectionTitle className="mt-8">활동 패턴 변화</SectionTitle>
      <div className="mt-3 space-y-4">
        {data.pattern.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-[14.5px] font-semibold text-[#1d1d1f]">{row.label}</span>
              <span className="text-[13px] font-semibold tabular-nums text-[#333333]">
                {row.ratio}%
              </span>
            </div>
            <div className="mt-2 h-[8px] w-full overflow-hidden rounded-full bg-[#f0f0f0]">
              <div className="h-full rounded-full bg-[#0066cc]" style={{ width: `${row.ratio}%` }} />
            </div>
            <p className="mt-1.5 text-[12.5px] font-normal text-[#7a7a7a]">{row.note}</p>
          </div>
        ))}
      </div>

      <SectionTitle className="mt-8">가장 오래 머문 곳</SectionTitle>
      <article className="mt-3 overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white">
        <div className="relative h-[120px] w-full">
          <Image
            src={photoUrl(PHOTO.parkBench, 700, 300)}
            alt="나무 그늘 아래 벤치 두 개가 놓인 쉼터"
            fill
            sizes="353px"
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1">
            <p className="text-[16px] font-semibold leading-none text-[#1d1d1f]">
              정릉2동 경로당
            </p>
            <p className="mt-2 text-[13px] font-normal leading-[1.5] text-[#7a7a7a]">
              {range === "weekly" ? "이번 주 3회 방문 · 누적 3시간 41분" : "7월 12회 방문 · 누적 14시간 08분"}
            </p>
          </div>
          <span className="text-[13px] font-semibold text-[#0066cc]">자택에서 240m</span>
        </div>
      </article>

      <SectionTitle className="mt-8">건강 코멘트</SectionTitle>
      <Card className="mt-3 border-[#0066cc]/20 bg-[#eef4fb] p-4">
        <div className="flex items-center gap-2">
          <Sparkle size={17} weight="fill" className="text-[#0066cc]" />
          <span className="text-[13px] font-semibold leading-none text-[#0066cc]">
            활동 데이터 분석
          </span>
        </div>
        <p className="mt-3 text-[14.5px] font-normal leading-[1.65] text-[#333333]">
          {data.comment}
        </p>
      </Card>

      <div className="mt-8 rounded-[18px] bg-[#f5f5f7] p-4">
        <p className="text-[15px] font-semibold leading-none text-[#1d1d1f]">
          보호자에게 리포트 보내기
        </p>
        <p className="mt-2 text-[13.5px] font-normal leading-[1.55] text-[#7a7a7a]">
          {guardians
            .filter((g) => g.sharing)
            .map((g) => `${g.name}(${g.relation})`)
            .join(", ")}
          에게 {range === "weekly" ? "주간" : "월간"} 요약본이 전달됩니다.
        </p>
        <button
          type="button"
          className="cs-press cs-focusable mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] text-[16px] font-semibold text-white"
        >
          <Export size={19} weight="bold" />
          리포트 공유하기
        </button>
      </div>
    </div>
  );
}
