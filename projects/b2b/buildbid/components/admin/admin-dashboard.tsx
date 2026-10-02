"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { Badge, BarChart, Card, CardHead, PageHead, RankBars, Row, Stat, Table, Cell } from "@/projects/b2b/buildbid/components/ui";
import { adminStats, deals, disputes, equipmentList, notices } from "@/projects/b2b/buildbid/lib/mock-data";
import { STATUS_LABEL, STATUS_TONE, manwon, type AdminScreen } from "@/projects/b2b/buildbid/lib/navigation";

const MONTHLY_VOLUME = [
  { label: "5월", value: 61_200_000 },
  { label: "6월", value: 79_600_000 },
  { label: "7월", value: 128_900_000, emphasis: true },
];

export function AdminDashboard({ onNavigate }: { onNavigate: (screen: AdminScreen) => void }) {
  const activeDeals = deals.filter((d) => d.stage !== "done");
  const inBidding = equipmentList.filter((e) => e.status === "bidding1" || e.status === "bidding2");
  const openDisputes = disputes.filter((d) => d.status !== "resolved");

  return (
    <div className="space-y-8">
      <PageHead eyebrow="관리자 콘솔" title="운영 대시보드" desc="등록 승인부터 검수, 낙찰, 정산, 분쟁까지 거래 전 과정을 관리합니다." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="등록 승인 대기" value={`${adminStats.pendingApprovals}건`} note="장비 등록 검토 필요" />
        <Stat label="검수원 배정 대기" value={`${adminStats.pendingInspectorAssign}건`} note="1차 입찰 마감 장비" />
        <Stat label="진행 중 입찰" value={`${adminStats.activeBidding}건`} note="1차, 최종 합계" emphasis />
        <Stat label="분쟁 처리 중" value={`${openDisputes.length}건`} note="검토 및 접수" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card>
          <CardHead title="거래 통계" desc="월별 확정 거래 금액입니다." />
          <BarChart data={MONTHLY_VOLUME} format={manwon} />
        </Card>
        <Card>
          <CardHead title="회원 현황" desc={`전체 ${adminStats.membersTotal}개사`} />
          <RankBars
            data={[
              { label: "판매자", value: adminStats.membersSeller, caption: `${adminStats.membersSeller}개사` },
              { label: "바이어", value: adminStats.membersBuyer, caption: `${adminStats.membersBuyer}개사` },
            ]}
          />
        </Card>
      </div>

      <Card>
        <CardHead
          title="진행 중 입찰"
          desc="1차, 최종 입찰이 진행 중인 장비입니다."
          action={
            <button type="button" onClick={() => onNavigate("bidding")} className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-primary)]">
              전체 보기<ArrowRight size={13} weight="bold" />
            </button>
          }
        />
        <Table head={["장비", "판매자", "AI 예상가", "상태"]} align={["left", "left", "right", "left"]} minWidth={560}>
          {inBidding.map((eq) => (
            <Row key={eq.id}>
              <Cell strong>{eq.name}</Cell>
              <Cell muted>{eq.seller}</Cell>
              <Cell align="right" mono>{manwon(eq.autoPrice)}</Cell>
              <Cell><Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHead
            title="거래 현황"
            desc="정산 진행 중인 거래입니다."
            action={
              <button type="button" onClick={() => onNavigate("trades")} className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-primary)]">
                전체 보기<ArrowRight size={13} weight="bold" />
              </button>
            }
          />
          <ul className="space-y-3">
            {activeDeals.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 border-b border-[var(--bb-hairline)] pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--bb-ink)]">{d.equipmentName}</p>
                  <p className="bb-mono text-[11px] text-[var(--bb-mute)]">{d.code} | {d.buyer} ← {d.seller}</p>
                </div>
                <span className="bb-mono shrink-0 text-[13px] font-semibold text-[var(--bb-ink)]">{manwon(d.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead title="최근 알림" desc={`읽지 않음 ${notices.filter((n) => n.unread).length}건`} />
          <ul className="space-y-3">
            {notices.slice(0, 5).map((notice) => (
              <li key={notice.id} className="flex items-start gap-2.5 border-b border-[var(--bb-hairline)] pb-3 last:border-b-0 last:pb-0">
                {notice.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bb-info)]" />}
                <div className={notice.unread ? "" : "pl-3.5"}>
                  <p className="text-[13px] font-semibold leading-5 text-[var(--bb-ink)]">{notice.title}</p>
                  <p className="mt-0.5 text-[12px] leading-4 text-[var(--bb-body)]">{notice.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
