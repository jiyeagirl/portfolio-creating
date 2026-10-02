"use client";

import { ArrowRight, Info, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  PageHead,
  Row,
  Stat,
  Table,
} from "@/projects/b2b/assetflow/components/ui";
import {
  adminAlerts,
  adminDailyVolume,
  adminFunnel,
  adminInspectionStatus,
  adminKpis,
  adminTrades,
} from "@/projects/b2b/assetflow/lib/admin-data";
import { manwon, won, type Tone } from "@/projects/b2b/assetflow/lib/navigation";
import type { AdminScreen } from "@/projects/b2b/assetflow/lib/navigation";

const ALERT_META: Record<"danger" | "warn" | "info", { tone: Tone; icon: React.ElementType }> = {
  danger: { tone: "danger", icon: ShieldWarning },
  warn: { tone: "warn", icon: WarningCircle },
  info: { tone: "neutral", icon: Info },
};


export function AdminDashboard({ onNavigate }: { onNavigate: (next: AdminScreen) => void }) {
  const totalWeek = adminDailyVolume.reduce((sum, d) => sum + d.amount, 0);
  const peak = adminDailyVolume.reduce((top, d) => (d.amount > top.amount ? d : top), adminDailyVolume[0]);
  const live = adminTrades.filter((t) => t.state === "입찰 진행");

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="운영 현황"
        title="전체 거래 현황"
        desc="플랫폼 전체의 거래, 입찰, 검수 진행 상황과 즉시 조치가 필요한 항목을 확인합니다."
        actions={
          <Button variant="secondary" size="md" onClick={() => onNavigate("trades")}>
            거래 모니터링
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map((kpi, index) => (
          <Stat
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            note={kpi.note}
            emphasis={index === 3}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
        <div className="space-y-6">
          <Card>
            <CardHead
              title="일별 거래 금액"
              desc={`최근 7일 합계 ${manwon(totalWeek)} | 최고 ${peak.day} ${manwon(peak.amount)}`}
            />
            <BarChart
              data={adminDailyVolume.map((d) => ({
                label: d.day.slice(4),
                value: d.amount,
                emphasis: d.day === peak.day,
              }))}
              format={manwon}
              height={180}
            />
          </Card>

          <Card>
            <CardHead
              title="진행 중 입찰"
              desc="마감이 임박한 입찰은 종료 후 자동으로 최종 입찰 대상에 오릅니다."
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate("trades")}>
                  전체 보기
                  <ArrowRight size={12} />
                </Button>
              }
            />
            <Table
              head={["자산", "수량", "예상 금액", "마감", "비고"]}
              align={["left", "right", "right", "right", "left"]}
            >
              {live.map((trade) => (
                <Row key={trade.id}>
                  <Cell>
                    <span className="block text-[13px] font-medium text-[var(--af-ink)]">
                      {trade.asset}
                    </span>
                    <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                      {trade.code} | {trade.company}
                    </span>
                  </Cell>
                  <Cell align="right" mono nowrap>
                    {trade.qty}대
                  </Cell>
                  <Cell align="right" mono strong nowrap>
                    {won(trade.amount)}
                  </Cell>
                  <Cell align="right" mono muted nowrap>
                    {trade.closesAt}
                  </Cell>
                  <Cell>
                    {trade.flag ? (
                      <Badge tone="warn">{trade.flag}</Badge>
                    ) : (
                      <span className="text-[var(--af-mute)]">-</span>
                    )}
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>

          <Card>
            <CardHead
              title="거래 단계별 전환"
              desc="이번 분기 등록된 자산 412건이 어느 단계까지 진행됐는지 보여줍니다."
            />
            <ul className="space-y-3">
              {adminFunnel.map((step, index) => (
                <li key={step.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-[var(--af-ink)]">{step.label}</span>
                    <span className="af-mono text-[13px] text-[var(--af-body)]">
                      {step.count}건 | {step.share}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--af-soft-2)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${step.share}%`,
                        background: `var(--af-chart-${Math.min(index + 1, 5)})`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-[var(--af-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--af-body)]">
              1차 입찰에서 검수로 넘어가는 구간의 이탈이 가장 큽니다(70.6% → 51.9%). 검수 배정
              지연 건을 우선 처리하면 전환이 개선됩니다.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead
              title="조치 필요"
              desc="운영자가 직접 개입해야 하는 항목"
              action={<Badge tone="danger">{adminAlerts.filter((a) => a.level === "danger").length}건 긴급</Badge>}
            />
            <ul className="space-y-3">
              {adminAlerts.map((alert) => {
                const meta = ALERT_META[alert.level];
                const Icon = meta.icon;
                return (
                  <li
                    key={alert.id}
                    className="flex gap-3 rounded-[6px] border border-[var(--af-hairline)] p-3.5"
                  >
                    <span
                      className={`mt-px shrink-0 ${
                        alert.level === "danger"
                          ? "text-[var(--af-error)]"
                          : alert.level === "warn"
                            ? "text-[var(--af-warn-deep)]"
                            : "text-[var(--af-mute)]"
                      }`}
                    >
                      <Icon size={15} weight="fill" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium leading-5 text-[var(--af-ink)]">
                        {alert.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-[18px] text-[var(--af-body)]">
                        {alert.detail}
                      </p>
                      <p className="mt-1 af-mono text-[11.5px] text-[var(--af-mute)]">{alert.at}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="md" full onClick={() => onNavigate("inspections")}>
                검수 배정
              </Button>
              <Button size="md" full onClick={() => onNavigate("trades")}>
                분쟁 처리
              </Button>
            </div>
          </Card>

          <Card>
            <CardHead
              title="검수 진행 현황"
              desc="배정부터 승인까지"
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate("inspections")}>
                  관리
                </Button>
              }
            />
            <ul className="space-y-2.5">
              {adminInspectionStatus.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-2.5"
                >
                  <span className="text-[13px] text-[var(--af-body)]">{item.label}</span>
                  <span className="flex items-center gap-2.5">
                    <span className="af-mono text-[14px] font-semibold text-[var(--af-ink)]">
                      {item.count}
                    </span>
                    <Badge tone={item.tone}>{item.tone === "warn" ? "조치" : item.tone === "ink" ? "완료" : "진행"}</Badge>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
