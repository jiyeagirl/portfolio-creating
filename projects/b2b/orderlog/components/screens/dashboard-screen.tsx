"use client";

import { ArrowRight, Robot, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Card,
  CardHead,
  InitialAvatar,
  Row,
  Stat,
  Table,
  Cell,
  Timeline,
} from "@/projects/b2b/orderlog/components/ui";
import { anomalies, notifications, orders, statHighlights } from "@/projects/b2b/orderlog/lib/mock-data";
import {
  RISK_LABEL,
  RISK_TONE,
  ROLE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  SEVERITY_TONE,
  type Navigate,
  won,
} from "@/projects/b2b/orderlog/lib/navigation";
import type { Role } from "@/projects/b2b/orderlog/lib/types";

export function DashboardScreen({ role, onNavigate }: { role: Role; onNavigate: Navigate }) {
  const inProgress = orders.filter((o) => o.status === "in_progress" || o.status === "review");
  const urgent = notifications.filter((n) => n.severity === "urgent");
  const unreviewed = anomalies.filter((a) => !a.reviewed);
  const monthAmount = statHighlights[0];
  const top5 = [...anomalies].sort((a, b) => (b.riskLevel > a.riskLevel ? 1 : -1)).slice(0, 5);
  const recentThreads = [...orders].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 6);

  const activity = [
    { label: "정하윤 님이 ORD-2024-0512 최종 승인을 요청했습니다", at: "13:50", done: true },
    { label: "AI가 ORD-2024-0489에서 권한 초과 확정 시도를 차단했습니다", at: "11:02", done: true },
    { label: "이도현 님이 ORD-2024-0512 납기 변경을 요청했습니다", at: "10/31", done: true },
    { label: "박서준 님이 ORD-2024-0489 단가 스냅샷을 생성했습니다", at: "11/04", done: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ot-hairline)] pb-6">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--ot-accent)]">
            {ROLE_LABEL[role]} 통합 대시보드
          </p>
          <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--ot-ink)]">
            오늘 발주 현황과 위험 신호를 한눈에 확인하세요
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-[var(--ot-body)]">
            2024년 11월 10일 기준. 진행중 발주 {inProgress.length}건, 미검토 AI 이상 {unreviewed.length}건이
            있습니다.
          </p>
        </div>
        {urgent.length > 0 && (
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            className="flex items-center gap-2 rounded-[10px] border border-[var(--ot-danger-soft)] bg-[var(--ot-danger-soft)] px-4 py-2.5 text-[13px] font-medium text-[var(--ot-danger-deep)] transition-colors hover:bg-[var(--ot-danger)] hover:text-white"
          >
            <WarningCircle size={15} weight="fill" />
            긴급 알림 {urgent.length}건 확인
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="오늘 등록된 발주" value="3건" delta="+1건" note="어제 대비" />
        <Stat label="진행중 발주" value={`${inProgress.length}건`} note="승인대기 포함" />
        <Stat
          label="AI 이상 발주"
          value={`${unreviewed.length}건`}
          delta={unreviewed.length > 0 ? `+${unreviewed.length}건` : undefined}
          note="미검토"
          emphasis
        />
        <Stat label={monthAmount.label} value={monthAmount.value} delta={monthAmount.delta} note={monthAmount.note} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        <div className="space-y-6">
          <Card padded={false} className="p-5">
            <CardHead
              title="최근 발주 스레드"
              desc="클릭하면 타임라인 상세로 이동합니다"
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("items")}
                  className="flex items-center gap-1 text-[12.5px] text-[var(--ot-accent)]"
                >
                  품목/단가로 <ArrowRight size={12} />
                </button>
              }
            />
            <Table head={["발주", "품목", "거래처", "금액", "상태", "AI 위험"]} align={["left", "left", "left", "right", "left", "left"]} minWidth={620}>
              {recentThreads.map((o) => (
                <Row key={o.id} onClick={() => onNavigate("thread", o.id)}>
                  <Cell strong>
                    <span className="ot-mono">{o.code}</span>
                    {o.unreadEvents > 0 && (
                      <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ot-accent)] px-1 text-[10px] font-medium text-white">
                        {o.unreadEvents}
                      </span>
                    )}
                  </Cell>
                  <Cell nowrap>{o.itemName}</Cell>
                  <Cell muted>{o.supplier}</Cell>
                  <Cell align="right" mono>
                    {won(o.amount)}
                  </Cell>
                  <Cell>
                    <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                  </Cell>
                  <Cell>
                    <Badge tone={RISK_TONE[o.riskLevel]}>{RISK_LABEL[o.riskLevel]}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>

          <Card>
            <CardHead title="최근 활동" desc="전체 거래처 기준 최신 이벤트" />
            <Timeline steps={activity} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead
              title="AI 위험 TOP 5"
              desc="위험도 높은 순"
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("anomaly")}
                  className="text-[12.5px] text-[var(--ot-accent)]"
                >
                  전체 보기
                </button>
              }
            />
            <ul className="space-y-3">
              {top5.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("thread", a.orderId)}
                    className="flex w-full items-start gap-3 rounded-[8px] p-2 text-left transition-colors hover:bg-[var(--ot-surface-soft)]"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--ot-surface-soft)] text-[var(--ot-body)]">
                      <Robot size={15} weight="bold" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-medium text-[var(--ot-ink)]">{a.title}</span>
                        <Badge tone={RISK_TONE[a.riskLevel]}>{RISK_LABEL[a.riskLevel]}</Badge>
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[var(--ot-mute)]">
                        {a.orderCode} / {a.companyName}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead
              title="금일 알림"
              desc="스마트 알림 센터"
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("notifications")}
                  className="text-[12.5px] text-[var(--ot-accent)]"
                >
                  전체 보기
                </button>
              }
            />
            <ul className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[var(--ot-ink)]">{n.title}</p>
                    <p className="ot-mono mt-0.5 text-[11px] text-[var(--ot-mute)]">{n.sentAt}</p>
                  </div>
                  <Badge tone={SEVERITY_TONE[n.severity]}>
                    {n.severity === "urgent" ? "긴급" : n.severity === "caution" ? "주의" : "일반"}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card soft>
            <div className="flex items-center gap-3">
              <InitialAvatar name="한" tone="accent" />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[var(--ot-ink)]">한지민 / E상사</p>
                <p className="text-[12px] text-[var(--ot-mute)]">ORD-2024-0512 정산 조건 확인 완료</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
