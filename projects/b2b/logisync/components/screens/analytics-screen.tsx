"use client";

import { useState } from "react";
import {
  Button,
  DualBars,
  Heatmap,
  LineChart,
  PageHead,
  Panel,
  Photo,
  RankBars,
  Segmented,
  SpecBand,
  SpecCell,
} from "@/projects/b2b/logisync/components/ui";
import {
  CENTERS,
  DAILY,
  HEATMAP,
  HEAT_DAYS,
  HEAT_HOURS,
  MAPPINGS,
  MONTHLY,
  TOP_PRODUCTS,
  WEEKLY,
} from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";

type Grain = "day" | "week" | "month";

const SERIES = {
  day: { ...DAILY, unit: "천 건", title: "일별 물류량", note: "04.02 ~ 04.15" },
  week: { ...WEEKLY, unit: "천 건", title: "주별 물류량", note: "W09 ~ W16, W16은 수요일까지" },
  month: { ...MONTHLY, unit: "천 건", title: "월별 물류량", note: "2026.01 ~ 2026.04, 4월은 15일까지" },
};

const PHOTO_BY_STD = Object.fromEntries(MAPPINGS.filter((m) => m.photo).map((m) => [m.std, m.photo as number]));

/* 센터별 7일 출고 추이 (천 건). 비교는 상위 2곳 + 전체 평균만 그린다. */
const CENTER_TREND = {
  labels: DAILY.labels.slice(-7),
  icn: [22.8, 12.4, 10.9, 23.6, 23.1, 22.4, 21.9],
  cgk: [15.9, 9.8, 9.1, 16.4, 16.2, 15.7, 15.4],
  avg: [12.1, 8.8, 8.2, 12.3, 12.0, 11.9, 11.4],
};

export function AnalyticsScreen() {
  const [grain, setGrain] = useState<Grain>("day");
  const s = SERIES[grain];
  const peak = s.inbound.indexOf(Math.max(...s.inbound));
  const centers = [...CENTERS]
    .map((c) => ({ label: c.name, value: c.todayIn + c.todayOut }))
    .sort((a, b) => b.value - a.value);
  const productMax = Math.max(...TOP_PRODUCTS.flatMap((p) => [p.inbound, p.outbound]));

  return (
    <div className="space-y-8">
      <PageHead
        title="통합 데이터 조회 및 통계"
        actions={
          <>
            <Segmented
              value={grain}
              onChange={setGrain}
              items={[
                { key: "day", label: "일별" },
                { key: "week", label: "주별" },
                { key: "month", label: "월별" },
              ]}
            />
            <Button icon="file-arrow-down">리포트 PDF</Button>
          </>
        }
      />

      <SpecBand cols={4}>
        <SpecCell label="4월 누적 입고" value="872" unit="천 건" sub="3월 같은 기간 대비 +3.8%" />
        <SpecCell label="4월 누적 출고" value="986" unit="천 건" sub="3월 같은 기간 대비 +5.2%" />
        <SpecCell label="출고 피크 시간대" value="16" unit="시" sub="금요일 16시 지수 97" />
        <SpecCell label="1위 센터 비중" value="31.5" unit="%" sub="이천 1센터" highlight />
      </SpecBand>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel title={s.title} action={<span className="text-[12px] text-[var(--ls-muted)]">{s.note}</span>}>
          <DualBars
            key={grain}
            labels={s.labels}
            a={s.inbound}
            b={s.outbound}
            legend={["입고", "출고"]}
            unit={s.unit}
            highlightIndex={peak}
          />
        </Panel>

        <Panel title="센터별 물류량 비교" action={<span className="text-[12px] text-[var(--ls-muted)]">오늘 입출고 합계 (건)</span>}>
          <RankBars items={centers} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="시간대별 물류량" action={<span className="text-[12px] text-[var(--ls-muted)]">최근 4주 평균 지수</span>}>
          <Heatmap rows={HEAT_DAYS} cols={HEAT_HOURS} data={HEATMAP} />
        </Panel>

        <Panel title="기간별 출고 추이" action={<span className="text-[12px] text-[var(--ls-muted)]">최근 7일, 천 건</span>}>
          <LineChart
            labels={CENTER_TREND.labels}
            height={260}
            series={[
              { name: "이천 1센터", data: CENTER_TREND.icn, color: "var(--ls-ink)" },
              { name: "칠곡 4센터", data: CENTER_TREND.cgk, color: "var(--ls-chart-2)" },
              { name: "6개 센터 평균", data: CENTER_TREND.avg, color: "var(--ls-chart-3)", dashed: true },
            ]}
          />
        </Panel>
      </div>

      <Panel title="상품별 입출고량 분석" flush action={<span className="text-[12px] text-[var(--ls-muted)]">4월 누적, 표준 상품코드 기준</span>}>
        <ul>
          {TOP_PRODUCTS.map((p, i) => {
            const photo = PHOTO_BY_STD[p.std];
            const gap = p.outbound - p.inbound;
            return (
              <li key={p.std} className="grid items-center gap-4 border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-4 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)_120px]">
                <div className="flex items-center gap-4">
                  <span className="ls-figure w-5 shrink-0 text-[18px]" style={{ color: i === 0 ? "var(--ls-primary)" : "var(--ls-disabled)" }}>
                    {i + 1}
                  </span>
                  {photo ? (
                    <Photo id={photo} alt={p.name} w={96} h={96} sizes="48px" className="h-12 w-12 shrink-0 rounded-[10px]" />
                  ) : (
                    <span className="h-12 w-12 shrink-0 rounded-[10px] bg-[var(--ls-elevated)]" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-[var(--ls-ink)]">{p.name}</p>
                    <p className="ls-code mt-0.5 text-[11px] text-[var(--ls-muted)]">{p.std}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {[
                    ["입고", p.inbound, "var(--ls-chart-1)"],
                    ["출고", p.outbound, "var(--ls-chart-2)"],
                  ].map(([l, v, color]) => (
                    <div key={l as string} className="flex items-center gap-3">
                      <span className="w-7 shrink-0 text-[11px] text-[var(--ls-muted)]">{l}</span>
                      <div className="h-[6px] flex-1 rounded-full bg-[var(--ls-canvas)]">
                        <div className="h-full rounded-full" style={{ width: `${((v as number) / productMax) * 100}%`, background: color as string }} />
                      </div>
                      <span className="ls-num w-14 shrink-0 text-right text-[12px] text-[var(--ls-body-strong)]">{fmt(v as number)}</span>
                    </div>
                  ))}
                </div>
                <div className="md:text-right">
                  <p className="text-[11px] text-[var(--ls-muted)]">출고 − 입고 (건)</p>
                  <p className="ls-figure text-[16px] text-[var(--ls-ink)]">
                    {gap > 0 ? "+" : gap < 0 ? "−" : ""}
                    {fmt(Math.abs(gap))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
