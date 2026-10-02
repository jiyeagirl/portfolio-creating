"use client";

import { useState } from "react";
import Image from "next/image";
import { Bed, Sparkle, Timer, Warning } from "@phosphor-icons/react";
import {
  Card,
  ScreenHeader,
  SectionTitle,
  SegmentedControl,
  StatTile,
  Tag,
} from "@/projects/monitoring/caresignal/components/app/ui";
import { PHOTO, photoUrl } from "@/projects/monitoring/caresignal/lib/photos";
import {
  monthSteps,
  todayActivity,
  weekSteps,
} from "@/projects/monitoring/caresignal/lib/app-data";

type Range = "day" | "week" | "month";

const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: "day", label: "일" },
  { key: "week", label: "주" },
  { key: "month", label: "월" },
];

export function ActivityScreen() {
  const [range, setRange] = useState<Range>("week");

  const series =
    range === "day"
      ? todayActivity.hourly.map((h) => ({ label: `${h.hour}`, value: h.steps, sub: "" }))
      : range === "week"
        ? weekSteps.map((d) => ({ label: d.day, value: d.steps, sub: d.date }))
        : monthSteps.map((m) => ({ label: m.label.replace("월 ", "/"), value: m.steps, sub: "" }));

  const max = Math.max(...series.map((s) => s.value), 1);
  const total = series.reduce((sum, s) => sum + s.value, 0);
  const average = Math.round(total / series.length);

  const headline =
    range === "day"
      ? { value: todayActivity.steps.toLocaleString(), label: "오늘 걸음 수" }
      : range === "week"
        ? { value: average.toLocaleString(), label: "이번 주 하루 평균" }
        : { value: Math.round(average / 7).toLocaleString(), label: "최근 8주 하루 평균" };

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px]">
      <ScreenHeader title="활동" description="걸음 수와 활동 시간을 매일 자동으로 기록합니다" />

      <SegmentedControl className="mt-5" value={range} options={RANGE_OPTIONS} onChange={setRange} />

      <Card className="mt-4 p-4">
        <p className="text-[12.5px] font-normal leading-none text-[#7a7a7a]">{headline.label}</p>
        <p className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[38px] font-bold leading-none tracking-[-0.03em] tabular-nums text-[#1d1d1f]">
            {headline.value}
          </span>
          <span className="text-[15px] font-normal text-[#333333]">보</span>
        </p>

        <div className="mt-5 flex h-[132px] gap-[5px]">
          {series.map((item, index) => {
            const ratio = Math.round((item.value / max) * 100);
            const isLast = index === series.length - 1;
            return (
              <div key={`${item.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-[4px] ${
                      isLast && range !== "day" ? "bg-[#0066cc]" : "bg-[#d2d2d7]"
                    }`}
                    style={{ height: `${Math.max(ratio, 2)}%` }}
                  />
                </div>
                <span className="text-[10.5px] font-normal leading-none text-[#7a7a7a]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 border-t border-[#f0f0f0] pt-3 text-[13px] font-normal text-[#7a7a7a]">
          {range === "day"
            ? "오전 9시대에 가장 많이 걸었고, 오후 2시부터 4시까지는 움직임이 없었습니다."
            : range === "week"
              ? "금요일이 가장 활동적이었고 일요일이 가장 낮았습니다."
              : "6월 대비 7월 평균 걸음 수가 96보 늘었습니다."}
        </p>
      </Card>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <StatTile label="이동 거리" value={todayActivity.distanceKm.toFixed(1)} unit="km" />
        <StatTile
          label="활동 시간"
          value={`${Math.floor(todayActivity.activeMinutes / 60)}:${String(todayActivity.activeMinutes % 60).padStart(2, "0")}`}
          sub="시간:분"
        />
        <StatTile
          label="휴식 시간"
          value={`${Math.floor(todayActivity.restMinutes / 60)}:${String(todayActivity.restMinutes % 60).padStart(2, "0")}`}
          sub="시간:분"
        />
      </div>

      <Card tone="parchment" className="mt-3 flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fdf2e3]">
          <Warning size={19} weight="fill" className="text-[#ff9500]" />
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold leading-none text-[#1d1d1f]">
            2시간째 움직임이 없습니다
          </p>
          <p className="mt-2 text-[13.5px] font-normal leading-[1.5] text-[#333333]">
            오후 1시 이후 걸음이 기록되지 않았습니다. 4시간이 지나면 보호자에게 안부 확인 알림이
            발송됩니다.
          </p>
        </div>
      </Card>

      <SectionTitle className="mt-8">시간대별 활동 패턴</SectionTitle>
      <div className="mt-3 rounded-[18px] border border-[#e0e0e0] p-4">
        <div className="flex items-end gap-[3px]">
          {todayActivity.hourly.map((hour) => {
            const ratio = Math.round((hour.steps / 900) * 100);
            return (
              <div key={hour.hour} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-[64px] w-full items-end">
                  <div
                    className={`w-full rounded-[3px] ${
                      hour.steps === 0
                        ? "bg-[#f0f0f0]"
                        : hour.steps > 500
                          ? "bg-[#0066cc]"
                          : "bg-[#a8c8ea]"
                    }`}
                    style={{ height: `${Math.max(ratio, 6)}%` }}
                  />
                </div>
                {hour.hour % 3 === 0 && (
                  <span className="text-[9.5px] font-normal leading-none text-[#7a7a7a]">
                    {hour.hour}시
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#f0f0f0] pt-3.5">
          <LegendItem color="bg-[#0066cc]" label="활발함" />
          <LegendItem color="bg-[#a8c8ea]" label="가벼운 활동" />
          <LegendItem color="bg-[#f0f0f0]" label="움직임 없음" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Card className="p-4">
          <Timer size={20} weight="regular" className="text-[#7a7a7a]" />
          <p className="mt-3 text-[13px] font-normal leading-none text-[#7a7a7a]">
            가장 활발한 시간
          </p>
          <p className="mt-2 text-[19px] font-semibold leading-none text-[#1d1d1f]">오전 9시</p>
          <p className="mt-2 text-[12.5px] font-normal text-[#7a7a7a]">812보 · 산책 시간</p>
        </Card>
        <Card className="p-4">
          <Bed size={20} weight="regular" className="text-[#7a7a7a]" />
          <p className="mt-3 text-[13px] font-normal leading-none text-[#7a7a7a]">
            가장 긴 휴식 구간
          </p>
          <p className="mt-2 text-[19px] font-semibold leading-none text-[#1d1d1f]">2시간 4분</p>
          <p className="mt-2 text-[12.5px] font-normal text-[#7a7a7a]">오후 1시 - 3시</p>
        </Card>
      </div>

      <SectionTitle className="mt-8">활동 제안</SectionTitle>
      <article className="mt-3 overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white">
        <div className="relative h-[128px] w-full">
          <Image
            src={photoUrl(PHOTO.walking, 700, 320)}
            alt="포장된 보도를 걷고 있는 사람의 발과 다리"
            fill
            sizes="353px"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Sparkle size={16} weight="fill" className="text-[#0066cc]" />
            <Tag tone="primary">활동 분석</Tag>
          </div>
          <p className="mt-3 text-[16px] font-semibold leading-[1.4] text-[#1d1d1f]">
            오후에 15분만 더 걸으면 지난주 평균을 넘습니다
          </p>
          <p className="mt-2 text-[14px] font-normal leading-[1.55] text-[#333333]">
            최근 나흘 동안 오후 활동이 계속 줄고 있습니다. 해가 낮은 4시 무렵 경로당까지 다녀오는
            240m 구간이 가장 부담이 적습니다.
          </p>
        </div>
      </article>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-normal text-[#7a7a7a]">
      <span className={`h-[8px] w-[8px] rounded-[2px] ${color}`} />
      {label}
    </span>
  );
}
