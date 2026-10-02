"use client";

import { useState } from "react";
import { DownloadSimple, FileText, Trophy } from "@phosphor-icons/react";
import { Badge, Card, CardHead, DefList, PageHead, Row, Stat, Table, Cell, Timeline } from "@/projects/b2b/buildbid/components/ui";
import { buyerCompany, deals } from "@/projects/b2b/buildbid/lib/mock-data";
import { STAGE_LABEL, STAGE_TONE, manwon, type Navigate } from "@/projects/b2b/buildbid/lib/navigation";

export function DealManageScreen({ onNavigate }: { onNavigate?: Navigate }) {
  const myDeals = deals.filter((d) => d.buyer === buyerCompany.name);
  const [selectedId, setSelectedId] = useState(myDeals[0]?.id);
  const deal = myDeals.find((d) => d.id === selectedId) ?? myDeals[0];
  const totalAmount = myDeals.reduce((sum, d) => sum + d.amount, 0);
  const done = myDeals.filter((d) => d.stage === "done").length;

  return (
    <div className="space-y-8">
      <PageHead eyebrow="낙찰 / 거래 관리" title="낙찰 결과와 거래 관리" desc={`${buyerCompany.name}이(가) 낙찰받은 거래를 계약부터 정산까지 추적합니다.`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="누적 낙찰" value={`${myDeals.length}건`} note="전체 낙찰 건수" />
        <Stat label="누적 낙찰가" value={manwon(totalAmount)} note="합계" emphasis />
        <Stat label="거래 완료" value={`${done}건`} note="정산 완료" />
        <Stat label="진행 중" value={`${myDeals.length - done}건`} note="계약, 운송 단계" />
      </div>

      <Card>
        <CardHead title="낙찰 결과 및 거래 내역" desc="낙찰받은 거래 목록입니다." />
        {myDeals.length === 0 ? (
          <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-8 text-center text-[13px] text-[var(--bb-mute)]">아직 낙찰받은 거래가 없습니다.</p>
        ) : (
          <Table head={["거래 번호", "장비", "판매자", "낙찰가", "확정일", "단계"]} align={["left", "left", "left", "right", "left", "left"]} minWidth={680}>
            {myDeals.map((d) => (
              <Row key={d.id} onClick={() => setSelectedId(d.id)} active={d.id === deal?.id}>
                <Cell mono muted nowrap>{d.code}</Cell>
                <Cell strong>{d.equipmentName}</Cell>
                <Cell muted>{d.seller}</Cell>
                <Cell align="right" mono strong>{manwon(d.amount)}</Cell>
                <Cell muted nowrap>{d.confirmedAt}</Cell>
                <Cell><Badge tone={STAGE_TONE[d.stage]}>{STAGE_LABEL[d.stage]}</Badge></Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      {deal && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <Card>
              <CardHead
                title="계약 진행"
                desc={deal.code}
                action={
                  deal.stage === "done" ? (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--bb-primary)]">
                      <Trophy size={14} weight="fill" /> 거래 완료
                    </span>
                  ) : (
                    <Badge tone={STAGE_TONE[deal.stage]}>{STAGE_LABEL[deal.stage]}</Badge>
                  )
                }
              />
              <DefList
                items={[
                  { label: "장비", value: deal.equipmentName },
                  { label: "판매자", value: deal.seller },
                  { label: "낙찰가", value: manwon(deal.amount) },
                  { label: "계약 확정일", value: deal.confirmedAt },
                  { label: deal.stage === "done" ? "거래 완료일" : "예상 완료일", value: deal.expectedAt },
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
            {onNavigate && (
              <button type="button" onClick={() => onNavigate("listings")} className="text-[13px] font-semibold text-[var(--bb-primary)] hover:underline">
                다른 장비 더 둘러보기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
