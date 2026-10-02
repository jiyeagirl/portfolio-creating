"use client";

import { useState } from "react";
import { DownloadSimple, TrendUp } from "@phosphor-icons/react";
import {
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  DonutChart,
  LineChart,
  PageHead,
  RankBars,
  Row,
  Segmented,
  Stat,
  Table,
} from "@/projects/b2b/orderlog/components/ui";
import { aiTrend, itemShare, monthlyOrders, revenueByClient, statHighlights } from "@/projects/b2b/orderlog/lib/mock-data";
import { manwon, won } from "@/projects/b2b/orderlog/lib/navigation";

type Metric = "amount" | "count";

export function StatsScreen() {
  const [metric, setMetric] = useState<Metric>("amount");
  const totalAmount = monthlyOrders.reduce((sum, m) => sum + m.amount, 0);
  const totalCount = monthlyOrders.reduce((sum, m) => sum + m.count, 0);
  const bestMonth = monthlyOrders.reduce((top, m) => (m.amount > top.amount ? m : top), monthlyOrders[0]);
  const aiGrowth = Math.round(((aiTrend[aiTrend.length - 1].count - aiTrend[0].count) / aiTrend[0].count) * 100);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="거래 분석"
        title="거래 통계 대시보드"
        desc="거래처별 매출, 월별 발주, 품목 비율, 미해결 건, AI 이상 발생 추이를 한 화면에서 확인합니다."
        actions={
          <Button variant="secondary" size="md" icon={<DownloadSimple size={14} />}>
            리포트 다운로드
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statHighlights.map((s, i) => (
          <Stat key={s.label} label={s.label} value={s.value} delta={s.delta} note={s.note} emphasis={i === 1} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead
            title="월별 발주"
            desc={`최근 6개월 합계 ${manwon(totalAmount)} / ${totalCount}건`}
            action={
              <Segmented
                value={metric}
                onChange={setMetric}
                items={[
                  { key: "amount" as Metric, label: "금액" },
                  { key: "count" as Metric, label: "건수" },
                ]}
              />
            }
          />
          <BarChart
            data={monthlyOrders.map((m) => ({
              label: m.month,
              value: metric === "amount" ? m.amount : m.count,
              emphasis: m.month === bestMonth.month,
            }))}
            format={metric === "amount" ? manwon : (v) => `${v}건`}
            height={200}
          />
          <p className="mt-4 border-t border-[var(--ot-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--ot-body)]">
            {bestMonth.month}이 {manwon(bestMonth.amount)}으로 가장 높았습니다. 정기 발주 마감이 몰린 영향입니다.
          </p>
        </Card>

        <Card>
          <CardHead title="품목 비율" desc="이번 분기 누적 거래 금액 기준" />
          <DonutChart data={itemShare} centerLabel="품목 카테고리" centerValue={`${itemShare.length}종`} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead title="거래처별 매출" desc="최근 6개월 누적 발주 금액 기준" />
          <RankBars
            data={revenueByClient.map((c) => ({ label: c.label, value: c.value, caption: manwon(c.value) }))}
          />
        </Card>

        <Card>
          <CardHead
            title="AI 이상 발생 추이"
            desc="월별 탐지 건수"
            action={
              <span className="flex items-center gap-1.5 ot-mono text-[13px] font-medium text-[var(--ot-danger-deep)]">
                <TrendUp size={13} weight="bold" />
                {aiGrowth > 0 ? "+" : ""}
                {aiGrowth}%
              </span>
            }
          />
          <LineChart data={aiTrend.map((t) => ({ label: t.month, value: t.count }))} formatValue={(v) => `${v}건`} />
          <p className="mt-4 border-t border-[var(--ot-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--ot-body)]">
            7월 탐지 건이 전월 대비 늘었지만, 대부분 단가 급변 규칙이 정상적으로 선반영된 계약을
            잡아낸 경우입니다.
          </p>
        </Card>
      </div>

      <Card>
        <CardHead title="거래처별 상세" desc="미해결 AI 이상 건과 재구매율을 함께 확인합니다" />
        <Table
          head={["거래처", "역할", "누적 금액", "발주 건수", "미해결 AI 건", "재구매율"]}
          align={["left", "left", "right", "right", "right", "right"]}
        >
          {[
            { name: "B소재", role: "납품처", amount: 214_800_000, count: 24, unresolved: 1, repeat: 91.2 },
            { name: "C금속", role: "납품처", amount: 187_300_000, count: 19, unresolved: 1, repeat: 82.4 },
            { name: "D패키징", role: "납품처", amount: 156_400_000, count: 31, unresolved: 0, repeat: 88.6 },
            { name: "E상사", role: "거래처", amount: 98_200_000, count: 17, unresolved: 1, repeat: 79.3 },
            { name: "F물류", role: "거래처", amount: 62_900_000, count: 9, unresolved: 0, repeat: 64.8 },
          ].map((row) => (
            <Row key={row.name}>
              <Cell strong>{row.name}</Cell>
              <Cell muted>{row.role}</Cell>
              <Cell align="right" mono>
                {won(row.amount)}
              </Cell>
              <Cell align="right" mono>
                {row.count}건
              </Cell>
              <Cell align="right" mono>
                <span className={row.unresolved > 0 ? "text-[var(--ot-danger-deep)]" : "text-[var(--ot-mute)]"}>
                  {row.unresolved}건
                </span>
              </Cell>
              <Cell align="right" mono strong>
                {row.repeat}%
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
