"use client";

import { useState } from "react";
import { DownloadSimple, FileText } from "@phosphor-icons/react";
import { Badge, Card, CardHead, DefList, PageHead, Row, Table, Cell, Timeline } from "@/projects/b2b/buildbid/components/ui";
import { deals } from "@/projects/b2b/buildbid/lib/mock-data";
import { STAGE_LABEL, STAGE_TONE, manwon, type Navigate } from "@/projects/b2b/buildbid/lib/navigation";

export function DealDoneScreen({ equipmentId }: { equipmentId?: string; onNavigate?: Navigate }) {
  const initial = deals.find((d) => d.equipmentId === equipmentId)?.id ?? deals[0]?.id;
  const [selectedId, setSelectedId] = useState(initial);
  const deal = deals.find((d) => d.id === selectedId) ?? deals[0];

  if (!deal) {
    return <PageHead eyebrow="거래 완료" title="거래 완료" desc="확정된 거래가 없습니다." />;
  }

  const settled = deal.stage === "done";

  return (
    <div className="space-y-8">
      <PageHead eyebrow="거래 완료" title="거래 관리" desc="계약, 운송, 정산까지 거래 전 과정을 추적합니다." />

      <Card>
        <CardHead title="거래 이력" desc="확정된 거래 목록입니다." />
        <Table head={["거래 번호", "장비", "바이어", "낙찰가", "확정일", "단계"]} align={["left", "left", "left", "right", "left", "left"]} minWidth={680}>
          {deals.map((d) => (
            <Row key={d.id} onClick={() => setSelectedId(d.id)} active={d.id === deal.id}>
              <Cell mono muted nowrap>{d.code}</Cell>
              <Cell strong>{d.equipmentName}</Cell>
              <Cell muted>{d.buyer}</Cell>
              <Cell align="right" mono strong>{manwon(d.amount)}</Cell>
              <Cell muted nowrap>{d.confirmedAt}</Cell>
              <Cell><Badge tone={STAGE_TONE[d.stage]}>{STAGE_LABEL[d.stage]}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="계약 정보" desc={deal.code} action={<Badge tone={STAGE_TONE[deal.stage]}>{STAGE_LABEL[deal.stage]}</Badge>} />
            <DefList
              items={[
                { label: "장비", value: deal.equipmentName },
                { label: "바이어", value: deal.buyer },
                { label: "판매자", value: deal.seller },
                { label: "낙찰가", value: manwon(deal.amount) },
                { label: "계약 확정일", value: deal.confirmedAt },
                { label: settled ? "거래 완료일" : "예상 완료일", value: deal.expectedAt },
              ]}
            />
          </Card>

          <Card>
            <CardHead title="거래 상태" desc="계약부터 정산까지의 진행 단계입니다." />
            <Timeline steps={deal.timeline} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHead title="정산 현황" />
            <div className="rounded-[18px] bg-[var(--bb-canvas-parchment)] p-4">
              <p className="text-[12px] text-[var(--bb-mute)]">정산 예정 금액</p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[var(--bb-ink)]">{manwon(deal.amount)}</p>
              <p className="mt-1 text-[12px] text-[var(--bb-mute)]">
                {settled ? "정산이 완료되었습니다." : "운송 완료 확인 후 정산이 진행됩니다."}
              </p>
            </div>
          </Card>

          <Card>
            <CardHead title="문서함" desc={`${deal.documents.length}건`} />
            <ul className="space-y-2">
              {deal.documents.map((doc) => (
                <li key={doc.name} className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--bb-hairline)] px-3.5 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText size={16} className="shrink-0 text-[var(--bb-mute)]" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[var(--bb-ink)]">{doc.name}</p>
                      <p className="bb-mono text-[11px] text-[var(--bb-mute)]">{doc.kind} | {doc.size} | {doc.issuedAt}</p>
                    </div>
                  </div>
                  <button type="button" aria-label={`${doc.name} 다운로드`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)]">
                    <DownloadSimple size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
