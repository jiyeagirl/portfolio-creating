"use client";

import { useState } from "react";
import { Trophy } from "@phosphor-icons/react";
import { Badge, Button, Card, PageHead, Row, Table, Cell, Tabs } from "@/projects/b2b/buildbid/components/ui";
import { bids, equipmentList } from "@/projects/b2b/buildbid/lib/mock-data";
import { STATUS_LABEL, STATUS_TONE, manwon } from "@/projects/b2b/buildbid/lib/navigation";

type Tab = "round1" | "award";

export function AdminBidding() {
  const [tab, setTab] = useState<Tab>("round1");
  const [confirmed, setConfirmed] = useState<Record<string, string>>({});

  const bidding1 = equipmentList.filter((e) => e.status === "bidding1");
  const bidding2 = equipmentList.filter((e) => e.status === "bidding2");

  return (
    <div className="space-y-8">
      <PageHead eyebrow="검수와 거래 관리" title="입찰 진행 / 낙찰 처리" desc="1차 입찰 진행 상황을 모니터링하고, 최종 입찰의 낙찰자를 확정합니다." />

      <Card padded={false}>
        <div className="px-5 pt-4">
          <Tabs
            value={tab}
            items={[
              { key: "round1", label: "1차 입찰 진행", count: bidding1.length },
              { key: "award", label: "낙찰 처리", count: bidding2.length },
            ]}
            onChange={setTab}
          />
        </div>
        <div className="p-5">
          {tab === "round1" ? (
            bidding1.length === 0 ? (
              <EmptyState text="1차 입찰 진행 중인 장비가 없습니다." />
            ) : (
              <Table head={["장비", "판매자", "참여 바이어", "최고가", "AI 예상가", "상태"]} align={["left", "left", "right", "right", "right", "left"]} minWidth={680}>
                {bidding1.map((eq) => {
                  const round1Bids = bids.filter((b) => b.equipmentId === eq.id && b.round === 1);
                  const top = Math.max(0, ...round1Bids.map((b) => b.unitPrice));
                  return (
                    <Row key={eq.id}>
                      <Cell strong>{eq.name}</Cell>
                      <Cell muted>{eq.seller}</Cell>
                      <Cell align="right" mono>{round1Bids.length}곳</Cell>
                      <Cell align="right" mono strong>{top ? manwon(top) : "-"}</Cell>
                      <Cell align="right" mono muted>{manwon(eq.autoPrice)}</Cell>
                      <Cell><Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge></Cell>
                    </Row>
                  );
                })}
              </Table>
            )
          ) : bidding2.length === 0 ? (
            <EmptyState text="낙찰 처리가 필요한 장비가 없습니다." />
          ) : (
            <div className="space-y-6">
              {bidding2.map((eq) => {
                const round2 = bids.filter((b) => b.equipmentId === eq.id && b.round === 2).sort((a, b) => b.unitPrice - a.unitPrice);
                const winnerId = confirmed[eq.id];
                return (
                  <div key={eq.id} className="rounded-[18px] border border-[var(--bb-hairline)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[14px] font-semibold text-[var(--bb-ink)]">{eq.name}</p>
                      <span className="text-[12px] text-[var(--bb-mute)]">판매자 {eq.seller}</span>
                    </div>
                    <Table head={["바이어", "최종 입찰가", "즉시 인수", "처리"]} align={["left", "right", "center", "center"]} minWidth={480}>
                      {round2.map((bid) => (
                        <Row key={bid.id} active={winnerId === bid.id}>
                          <Cell strong>{bid.buyer}</Cell>
                          <Cell align="right" mono strong>{manwon(bid.unitPrice)}</Cell>
                          <Cell align="center">{bid.immediatePickup ? "가능" : "-"}</Cell>
                          <Cell align="center">
                            {winnerId === bid.id ? (
                              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--bb-primary)]">
                                <Trophy size={14} weight="fill" /> 낙찰 확정
                              </span>
                            ) : winnerId ? (
                              <span className="text-[12px] text-[var(--bb-mute)]">-</span>
                            ) : (
                              <Button size="sm" variant="secondary" onClick={() => setConfirmed((prev) => ({ ...prev, [eq.id]: bid.id }))}>
                                낙찰 확정
                              </Button>
                            )}
                          </Cell>
                        </Row>
                      ))}
                    </Table>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-8 text-center text-[13px] text-[var(--bb-mute)]">{text}</p>;
}
