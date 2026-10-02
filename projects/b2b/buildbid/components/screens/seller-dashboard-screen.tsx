"use client";

import { ArrowRight, Bell, Plus } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  EquipmentThumb,
  PageHead,
  Row,
  Stat,
  Table,
  Cell,
} from "@/projects/b2b/buildbid/components/ui";
import { bids, deals, equipmentList, notices, sellerCompany } from "@/projects/b2b/buildbid/lib/mock-data";
import {
  CATEGORY_LABEL,
  STAGE_LABEL,
  STAGE_TONE,
  STATUS_LABEL,
  STATUS_TONE,
  manwon,
  type Navigate,
} from "@/projects/b2b/buildbid/lib/navigation";

export function SellerDashboardScreen({ onNavigate }: { onNavigate: Navigate }) {
  const active = equipmentList.filter((e) => !["settled", "canceled", "draft"].includes(e.status));
  const inBidding = equipmentList.filter((e) => e.status === "bidding1" || e.status === "bidding2");
  const recent = [...equipmentList].sort((a, b) => (a.registeredAt < b.registeredAt ? 1 : -1)).slice(0, 5);
  const settled = equipmentList.filter((e) => e.status === "settled");
  const pendingSettlement = deals.filter((d) => d.stage === "transport" || d.stage === "settlement").length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="판매자 대시보드"
        title={`안녕하세요, ${sellerCompany.manager.name}님`}
        desc={`${sellerCompany.name} 소속으로 로그인되어 있습니다. 오늘도 등록 장비의 입찰 현황을 확인해 보세요.`}
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => onNavigate("register")}>
            장비 등록
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="진행 중 거래" value={`${active.length}건`} note="입찰, 검수 포함" />
        <Stat label="입찰 진행 중" value={`${inBidding.length}건`} delta={`+${bids.filter((b) => b.round === 1).length}`} note="누적 입찰 참여" />
        <Stat label="거래 완료" value={`${settled.length}건`} note="이번 분기 누적" emphasis />
        <Stat label="정산 대기" value={`${pendingSettlement}건`} note="운송, 정산 단계" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <Card>
          <CardHead title="최근 등록 장비" desc="최근 등록 순으로 5건을 표시합니다." action={<button type="button" onClick={() => onNavigate("bidding")} className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-primary)]">전체 보기<ArrowRight size={13} weight="bold" /></button>} />
          <Table head={["장비", "카테고리", "등록일", "AI 예상가", "상태"]} align={["left", "left", "left", "right", "left"]} minWidth={620}>
            {recent.map((eq) => (
              <Row key={eq.id} onClick={() => onNavigate("bidding", eq.id)}>
                <Cell strong>
                  <div className="flex items-center gap-2.5">
                    <EquipmentThumb photo={eq.photo} alt={eq.name} size={36} />
                    <div className="min-w-0">
                      <p className="truncate">{eq.name}</p>
                      <p className="bb-mono text-[11px] font-normal text-[var(--bb-mute)]">{eq.code}</p>
                    </div>
                  </div>
                </Cell>
                <Cell muted>{CATEGORY_LABEL[eq.category]}</Cell>
                <Cell muted nowrap>{eq.registeredAt}</Cell>
                <Cell align="right" mono strong>{manwon(eq.autoPrice)}</Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge>
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead title="알림" desc={`읽지 않음 ${notices.filter((n) => n.unread).length}건`} action={<Bell size={16} className="text-[var(--bb-mute)]" />} />
          <ul className="space-y-3">
            {notices.slice(0, 5).map((notice) => (
              <li key={notice.id} className="flex items-start gap-2.5 border-b border-[var(--bb-hairline)] pb-3 last:border-b-0 last:pb-0">
                {notice.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bb-info)]" />}
                <div className={notice.unread ? "" : "pl-3.5"}>
                  <p className="text-[13px] font-semibold leading-5 text-[var(--bb-ink)]">{notice.title}</p>
                  <p className="mt-0.5 text-[12px] leading-4 text-[var(--bb-body)]">{notice.detail}</p>
                  <p className="mt-1 bb-mono text-[11px] text-[var(--bb-mute)]">{notice.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHead title="입찰 진행 현황" desc="1차, 최종 입찰이 진행 중인 장비의 현재 최고가입니다." />
        <Table head={["장비", "회차", "참여 바이어", "현재 최고가", "AI 예상가", "상태"]} align={["left", "center", "right", "right", "right", "left"]} minWidth={680}>
          {inBidding.map((eq) => {
            const roundBids = bids.filter((b) => b.equipmentId === eq.id && b.round === (eq.status === "bidding2" ? 2 : 1));
            const top = roundBids.reduce((max, b) => (b.unitPrice > max ? b.unitPrice : max), 0);
            return (
              <Row key={eq.id} onClick={() => onNavigate("bidding", eq.id)}>
                <Cell strong>{eq.name}</Cell>
                <Cell align="center">{eq.status === "bidding2" ? "최종" : "1차"}</Cell>
                <Cell align="right" mono>{roundBids.length}곳</Cell>
                <Cell align="right" mono strong>{top ? manwon(top) : "입찰 없음"}</Cell>
                <Cell align="right" mono muted>{manwon(eq.autoPrice)}</Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </Card>

      <Card>
        <CardHead title="거래 완료 내역" desc="정산 상태를 포함한 최근 확정 거래입니다." action={<button type="button" onClick={() => onNavigate("dealDone")} className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-primary)]">전체 보기<ArrowRight size={13} weight="bold" /></button>} />
        <Table head={["거래 번호", "장비", "바이어", "낙찰가", "확정일", "진행 단계"]} align={["left", "left", "left", "right", "left", "left"]} minWidth={680}>
          {deals.map((deal) => (
            <Row key={deal.id} onClick={() => onNavigate("dealDone", deal.equipmentId)}>
              <Cell mono muted nowrap>{deal.code}</Cell>
              <Cell strong>{deal.equipmentName}</Cell>
              <Cell muted>{deal.buyer}</Cell>
              <Cell align="right" mono strong>{manwon(deal.amount)}</Cell>
              <Cell muted nowrap>{deal.confirmedAt}</Cell>
              <Cell>
                <Badge tone={STAGE_TONE[deal.stage]}>{STAGE_LABEL[deal.stage]}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
