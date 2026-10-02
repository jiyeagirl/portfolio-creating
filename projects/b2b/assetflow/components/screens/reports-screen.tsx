"use client";

import { useState } from "react";
import { DownloadSimple, TrendUp } from "@phosphor-icons/react";
import {
  BarChart,
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  CompareChart,
  PageHead,
  RankBars,
  Row,
  Segmented,
  Stat,
  Table,
} from "@/projects/b2b/assetflow/components/ui";
import {
  categoryShare,
  monthlyTrade,
  reportHighlights,
  resellerPerformance,
  winRateSeries,
} from "@/projects/b2b/assetflow/lib/mock-data";
import { manwon, won, type Navigate } from "@/projects/b2b/assetflow/lib/navigation";

type Period = "6m" | "12m";

const GRADE_TONE = {
  플래티넘: "ink",
  골드: "warn",
  실버: "neutral",
} as const;

/** 12개월 보기용 앞쪽 6개월. mock. */
const EARLIER = [
  { month: "8월", amount: 12600000, count: 3 },
  { month: "9월", amount: 19800000, count: 4 },
  { month: "10월", amount: 22400000, count: 5 },
  { month: "11월", amount: 17100000, count: 4 },
  { month: "12월", amount: 29500000, count: 6 },
  { month: "1월", amount: 14200000, count: 3 },
];

export function ReportsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [period, setPeriod] = useState<Period>("6m");
  const series = period === "6m" ? monthlyTrade : [...EARLIER, ...monthlyTrade];

  const totalAmount = series.reduce((sum, m) => sum + m.amount, 0);
  const totalCount = series.reduce((sum, m) => sum + m.count, 0);
  const best = series.reduce((top, m) => (m.amount > top.amount ? m : top), series[0]);
  const avgPremium =
    Math.round(
      (winRateSeries.reduce((sum, w) => sum + (w.won / w.auto - 1), 0) / winRateSeries.length) * 1000,
    ) / 10;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="리포트 | 거래 분석"
        title="매각 실적 분석"
        desc="월별 거래 금액, 자산 유형별 비율, 자동 시세 대비 실제 낙찰가를 비교해 다음 처분 계획을 세웁니다."
        actions={
          <>
            <Segmented
              value={period}
              onChange={setPeriod}
              items={[
                { key: "6m" as Period, label: "최근 6개월" },
                { key: "12m" as Period, label: "최근 12개월" },
              ]}
            />
            <Button variant="secondary" size="md" icon={<DownloadSimple size={14} />}>
              PDF 리포트
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportHighlights.map((item, index) => (
          <Stat
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            note={item.note}
            emphasis={index === 1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead
            title="월별 매각 금액"
            desc={`${period === "6m" ? "최근 6개월" : "최근 12개월"} 합계 ${manwon(totalAmount)} | ${totalCount}건`}
            action={<Badge tone="neutral">정산 완료 기준</Badge>}
          />
          <BarChart
            data={series.map((m) => ({
              label: m.month,
              value: m.amount,
              emphasis: m.month === best.month,
            }))}
            format={manwon}
            height={200}
          />
          <p className="mt-4 border-t border-[var(--af-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--af-body)]">
            {best.month}이 {manwon(best.amount)}으로 가장 높았습니다. 노트북 대량 물량 2건이
            같은 달에 마감된 영향입니다.
          </p>
        </Card>

        <Card>
          <CardHead title="자산 유형별 비율" desc="누적 매각 금액 기준" />
          <RankBars
            data={categoryShare.map((c) => ({
              label: c.label,
              value: c.share,
              caption: `${c.share}% | ${manwon(c.amount)}`,
            }))}
          />
          <div className="mt-5 border-t border-[var(--af-hairline)] pt-4">
            <Table head={["유형", "수량", "금액"]} align={["left", "right", "right"]} minWidth={0}>
              {categoryShare.map((c) => (
                <Row key={c.label}>
                  <Cell strong>{c.label}</Cell>
                  <Cell align="right" mono>
                    {c.count}대
                  </Cell>
                  <Cell align="right" mono>
                    {manwon(c.amount)}
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead
            title="자동 시세 대비 평균 낙찰가"
            desc="같은 단위(대당 원)라 축을 하나만 씁니다."
            action={
              <span className="flex items-center gap-1.5 af-mono text-[13px] font-medium text-[var(--af-link-deep)]">
                <TrendUp size={13} weight="bold" />+{avgPremium}%
              </span>
            }
          />
          <CompareChart data={winRateSeries} />
          <p className="mt-4 text-[12.5px] leading-5 text-[var(--af-body)]">
            2단계 역경매를 거친 거래는 자동 시세보다 평균 {avgPremium}% 높게 낙찰됐습니다.
            검수를 신청한 건에서 격차가 더 컸습니다.
          </p>
        </Card>

        <Card>
          <CardHead title="평균 낙찰가 분석" desc="월별 자동 시세와 실제 낙찰가 차이" />
          <Table
            head={["월", "자동 시세", "낙찰가", "차이", "낙찰률"]}
            align={["left", "right", "right", "right", "right"]}
            minWidth={460}
          >
            {winRateSeries.map((w) => {
              const diff = w.won - w.auto;
              const rate = Math.round((w.won / w.auto) * 1000) / 10;
              return (
                <Row key={w.month}>
                  <Cell strong>{w.month}</Cell>
                  <Cell align="right" mono muted>
                    {won(w.auto)}
                  </Cell>
                  <Cell align="right" mono strong>
                    {won(w.won)}
                  </Cell>
                  <Cell align="right" mono>
                    <span className={diff >= 0 ? "text-[var(--af-link-deep)]" : "text-[var(--af-error-deep)]"}>
                      {diff > 0 ? "+" : ""}
                      {won(diff)}
                    </span>
                  </Cell>
                  <Cell align="right" mono strong>
                    {rate}%
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </Card>
      </div>

      <Card>
        <CardHead
          title="리셀러별 거래 실적"
          desc="낙찰률은 자동 시세 대비 실제 낙찰가 비율입니다. 반복 거래 리셀러일수록 안정적으로 높은 값을 제시합니다."
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate("deals")}>
              거래 관리로
            </Button>
          }
        />
        <Table
          head={["리셀러", "등급", "거래 건수", "누적 금액", "평균 낙찰률", "비중"]}
          align={["left", "left", "right", "right", "right", "left"]}
        >
          {resellerPerformance.map((r) => {
            const maxAmount = Math.max(...resellerPerformance.map((x) => x.amount));
            return (
              <Row key={r.name}>
                <Cell strong>{r.name}</Cell>
                <Cell>
                  <Badge tone={GRADE_TONE[r.grade as keyof typeof GRADE_TONE]}>{r.grade}</Badge>
                </Cell>
                <Cell align="right" mono>
                  {r.deals}건
                </Cell>
                <Cell align="right" mono strong>
                  {manwon(r.amount)}
                </Cell>
                <Cell align="right" mono>
                  <span
                    className={
                      r.avgRate >= 100 ? "text-[var(--af-link-deep)]" : "text-[var(--af-error-deep)]"
                    }
                  >
                    {r.avgRate}%
                  </span>
                </Cell>
                <Cell>
                  <span className="block h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-[var(--af-soft-2)]">
                    <span
                      className="block h-full rounded-full bg-[var(--af-primary)]"
                      style={{ width: `${(r.amount / maxAmount) * 100}%` }}
                    />
                  </span>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
