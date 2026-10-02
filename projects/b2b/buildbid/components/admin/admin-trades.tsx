"use client";

import { useState } from "react";
import { Badge, Button, Card, DefList, PageHead, Row, Table, Cell, Tabs, Timeline } from "@/projects/b2b/buildbid/components/ui";
import { deals, disputes } from "@/projects/b2b/buildbid/lib/mock-data";
import { STAGE_LABEL, STAGE_TONE, manwon, type Tone } from "@/projects/b2b/buildbid/lib/navigation";

type Tab = "deals" | "disputes";

const DISPUTE_LABEL: Record<string, string> = { open: "접수됨", reviewing: "검토 중", resolved: "해결됨" };
const DISPUTE_TONE: Record<string, Tone> = { open: "danger", reviewing: "warn", resolved: "ink" };

export function AdminTrades() {
  const [tab, setTab] = useState<Tab>("deals");
  const [selectedId, setSelectedId] = useState(deals[0]?.id);
  const [resolved, setResolved] = useState<Set<string>>(new Set(disputes.filter((d) => d.status === "resolved").map((d) => d.id)));
  const deal = deals.find((d) => d.id === selectedId);

  return (
    <div className="space-y-8">
      <PageHead eyebrow="검수와 거래 관리" title="거래 / 분쟁 관리" desc="계약부터 정산까지 거래 상태를 확인하고, 접수된 분쟁을 처리합니다." />

      <Card padded={false}>
        <div className="px-5 pt-4">
          <Tabs
            value={tab}
            items={[
              { key: "deals", label: "거래 관리", count: deals.length },
              { key: "disputes", label: "분쟁 / 거래 취소", count: disputes.filter((d) => !resolved.has(d.id)).length },
            ]}
            onChange={setTab}
          />
        </div>
        <div className="p-5">
          {tab === "deals" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
              <Table head={["거래 번호", "장비", "판매자", "바이어", "금액", "단계"]} align={["left", "left", "left", "left", "right", "left"]} minWidth={680}>
                {deals.map((d) => (
                  <Row key={d.id} onClick={() => setSelectedId(d.id)} active={d.id === selectedId}>
                    <Cell mono muted nowrap>{d.code}</Cell>
                    <Cell strong>{d.equipmentName}</Cell>
                    <Cell muted>{d.seller}</Cell>
                    <Cell muted>{d.buyer}</Cell>
                    <Cell align="right" mono strong>{manwon(d.amount)}</Cell>
                    <Cell><Badge tone={STAGE_TONE[d.stage]}>{STAGE_LABEL[d.stage]}</Badge></Cell>
                  </Row>
                ))}
              </Table>
              {deal && (
                <div className="space-y-4">
                  <div className="rounded-[18px] border border-[var(--bb-hairline)] p-4">
                    <DefList
                      columns={1}
                      items={[
                        { label: "장비", value: deal.equipmentName },
                        { label: "판매자", value: deal.seller },
                        { label: "바이어", value: deal.buyer },
                        { label: "금액", value: manwon(deal.amount) },
                      ]}
                    />
                  </div>
                  <div className="rounded-[18px] border border-[var(--bb-hairline)] p-4">
                    <p className="mb-3 text-[13px] font-semibold text-[var(--bb-ink)]">진행 단계</p>
                    <Timeline steps={deal.timeline} />
                  </div>
                  {deal.stage !== "done" && <Button full variant="secondary">다음 단계로 처리</Button>}
                </div>
              )}
            </div>
          ) : (
            <Table head={["거래 번호", "장비", "제기자", "사유", "접수일", "처리"]} align={["left", "left", "left", "left", "left", "center"]} minWidth={720}>
              {disputes.map((d) => {
                const isResolved = resolved.has(d.id);
                return (
                  <Row key={d.id}>
                    <Cell mono muted nowrap>{d.dealCode}</Cell>
                    <Cell strong>{d.equipmentName}</Cell>
                    <Cell muted>{d.raisedBy}</Cell>
                    <Cell muted>{d.reason}</Cell>
                    <Cell muted nowrap>{d.raisedAt}</Cell>
                    <Cell align="center">
                      {isResolved ? (
                        <Badge tone={DISPUTE_TONE.resolved}>{DISPUTE_LABEL.resolved}</Badge>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Badge tone={DISPUTE_TONE[d.status]}>{DISPUTE_LABEL[d.status]}</Badge>
                          <button
                            type="button"
                            onClick={() => setResolved((prev) => new Set(prev).add(d.id))}
                            className="text-[12px] font-semibold text-[var(--bb-primary)] hover:underline"
                          >
                            해결 처리
                          </button>
                        </div>
                      )}
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
