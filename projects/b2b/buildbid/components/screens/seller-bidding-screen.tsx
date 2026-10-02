"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Trophy } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  DefList,
  EquipmentThumb,
  PageHead,
  Row,
  Table,
  Cell,
  Tabs,
} from "@/projects/b2b/buildbid/components/ui";
import { bids, equipmentList, inspections } from "@/projects/b2b/buildbid/lib/mock-data";
import {
  CATEGORY_LABEL,
  GRADE_NOTE,
  STATUS_LABEL,
  STATUS_TONE,
  manwon,
  type Navigate,
} from "@/projects/b2b/buildbid/lib/navigation";

const ELIGIBLE = ["bidding1", "inspecting", "bidding2", "confirmed"] as const;

export function BiddingScreen({ equipmentId, onNavigate }: { equipmentId?: string; onNavigate: Navigate }) {
  const eligible = useMemo(() => equipmentList.filter((e) => (ELIGIBLE as readonly string[]).includes(e.status)), []);
  const [pickedId, setPickedId] = useState<string | undefined>(equipmentId ?? eligible[0]?.id);
  const [winner, setWinner] = useState<string | null>(null);

  const eq = equipmentList.find((e) => e.id === (equipmentId ?? pickedId));

  if (!eq) {
    return (
      <div className="space-y-8">
        <PageHead eyebrow="입찰 관리" title="입찰 관리" desc="현재 진행 중인 입찰이 없습니다." />
      </div>
    );
  }

  const round1 = bids.filter((b) => b.equipmentId === eq.id && b.round === 1).sort((a, b) => b.unitPrice - a.unitPrice);
  const round2 = bids.filter((b) => b.equipmentId === eq.id && b.round === 2).sort((a, b) => b.unitPrice - a.unitPrice);
  const inspection = inspections.find((i) => i.equipmentId === eq.id);
  const topRound1 = round1[0];
  const canSelectWinner = eq.status === "bidding2" && round2.length > 0;
  const alreadySelected = round2.find((b) => b.selected) ?? (winner ? round2.find((b) => b.id === winner) : undefined);

  return (
    <div className="space-y-8">
      <PageHead eyebrow="입찰 관리" title="입찰 관리" desc="1차 입찰, 검수, 최종 입찰 결과를 확인하고 낙찰자를 선택합니다." />

      <Card padded={false} className="overflow-hidden">
        <div className="border-b border-[var(--bb-hairline)] px-5 pt-4">
          <Tabs
            value={eq.id}
            items={eligible.map((item) => ({ key: item.id, label: item.name }))}
            onChange={(next) => setPickedId(next)}
          />
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <EquipmentThumb photo={eq.photo} alt={eq.name} size={48} />
            <div>
              <p className="text-[16px] font-semibold text-[var(--bb-ink)]">{eq.name}</p>
              <p className="bb-mono text-[12px] text-[var(--bb-mute)]">
                {eq.code} | {CATEGORY_LABEL[eq.category]} | {eq.region}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] text-[var(--bb-mute)]">AI 예상 거래가</p>
              <p className="bb-mono text-[16px] font-semibold text-[var(--bb-ink)]">{manwon(eq.autoPrice)}</p>
            </div>
            <Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="1차 입찰 현황" desc={`참여 바이어 ${round1.length}곳 | 최고가 ${topRound1 ? manwon(topRound1.unitPrice) : "-"}`} />
        {round1.length === 0 ? (
          <EmptyRow text="아직 1차 입찰 참여가 없습니다." />
        ) : (
          <Table head={["바이어", "등급", "입찰가", "제출 시각", "운송 소요", "비고"]} align={["left", "left", "right", "left", "right", "left"]} minWidth={680}>
            {round1.map((bid) => (
              <Row key={bid.id} active={bid.id === topRound1?.id}>
                <Cell strong>{bid.buyer}</Cell>
                <Cell><Badge tone={bid.buyerTier === "공식파트너" ? "info" : "neutral"}>{bid.buyerTier}</Badge></Cell>
                <Cell align="right" mono strong>{manwon(bid.unitPrice)}</Cell>
                <Cell muted nowrap>{bid.submittedAt}</Cell>
                <Cell align="right" mono muted>{bid.transportDays}일</Cell>
                <Cell muted>{bid.note || "-"}</Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      <Card>
        <CardHead title="검수 진행 상태 및 결과" desc={inspection ? `검수원 ${inspection.inspector} | ${inspection.inspectedAt}` : "1차 입찰 마감 후 현장 검수가 진행됩니다."} />
        {!inspection ? (
          <EmptyRow text={eq.status === "bidding1" ? "1차 입찰 마감 대기 중입니다. 검수는 마감 이후 배정됩니다." : "검수원 배정 대기 중입니다."} />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MiniStat label="검수 현장" value={inspection.site} />
              <MiniStat label="등급 변화" value={`${inspection.gradeBefore} → ${inspection.gradeAfter}`} />
              <MiniStat label="예상가 조정" value={`${manwon(inspection.priceBefore)} → ${manwon(inspection.priceAfter)}`} />
            </div>
            <p className="rounded-[18px] bg-[var(--bb-canvas-parchment)] p-4 text-[13px] leading-6 text-[var(--bb-body)]">{inspection.summary}</p>
            <Table head={["점검 항목", "신고 내용", "실측 결과", "판정"]} minWidth={520}>
              {inspection.items.map((item) => (
                <Row key={item.label}>
                  <Cell strong>{item.label}</Cell>
                  <Cell muted>{item.declared}</Cell>
                  <Cell muted>{item.observed}</Cell>
                  <Cell>
                    <Badge tone={item.delta === "worse" ? "danger" : item.delta === "better" ? "info" : "neutral"}>
                      {item.delta === "worse" ? "감가 요인" : item.delta === "better" ? "신고보다 양호" : "신고와 일치"}
                    </Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        )}
      </Card>

      <Card>
        <CardHead
          title="최종(2차) 입찰 결과"
          desc={round2.length > 0 ? `참여 바이어 ${round2.length}곳 | 검수 리포트 반영가 기준` : "최종 입찰이 아직 시작되지 않았습니다."}
        />
        {round2.length === 0 ? (
          <EmptyRow text="검수 완료 후 최종 입찰이 시작됩니다." />
        ) : (
          <div className="space-y-3">
            <Table head={["바이어", "등급", "최종 입찰가", "제출 시각", "즉시 인수", "낙찰"]} align={["left", "left", "right", "left", "center", "center"]} minWidth={680}>
              {round2.map((bid) => {
                const isWinner = alreadySelected?.id === bid.id;
                return (
                  <Row key={bid.id} active={isWinner}>
                    <Cell strong>{bid.buyer}</Cell>
                    <Cell><Badge tone={bid.buyerTier === "공식파트너" ? "info" : "neutral"}>{bid.buyerTier}</Badge></Cell>
                    <Cell align="right" mono strong>{manwon(bid.unitPrice)}</Cell>
                    <Cell muted nowrap>{bid.submittedAt}</Cell>
                    <Cell align="center">{bid.immediatePickup ? <CheckCircle size={15} weight="fill" className="mx-auto text-[var(--bb-info)]" /> : <span className="text-[var(--bb-mute)]">-</span>}</Cell>
                    <Cell align="center">
                      {isWinner ? (
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--bb-primary)]">
                          <Trophy size={14} weight="fill" /> 낙찰
                        </span>
                      ) : canSelectWinner && !alreadySelected ? (
                        <button type="button" onClick={() => setWinner(bid.id)} className="text-[12px] font-semibold text-[var(--bb-primary)] hover:underline">
                          선택
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--bb-mute)]">-</span>
                      )}
                    </Cell>
                  </Row>
                );
              })}
            </Table>
            {canSelectWinner && !alreadySelected && (
              <p className="text-[12px] text-[var(--bb-mute)]">낙찰자를 선택하면 계약이 진행되고 거래 완료 화면에서 진행 상황을 추적할 수 있습니다.</p>
            )}
            {alreadySelected && (
              <div className="flex flex-col gap-3 rounded-[18px] border border-[var(--bb-primary)] bg-[var(--bb-info-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-[var(--bb-info-deep)]">
                  <strong className="font-semibold">{alreadySelected.buyer}</strong>이(가) {manwon(alreadySelected.unitPrice)}에 낙찰되었습니다.
                </p>
                <Button size="sm" onClick={() => onNavigate("dealDone", eq.id)}>거래 완료 화면 보기</Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card soft>
        <CardHead title="장비 상태 참고" />
        <DefList
          items={[
            { label: "등급", value: `${eq.grade}등급 | ${GRADE_NOTE[eq.grade]}` },
            { label: "연식", value: `${eq.manufacturedYear}년식` },
            { label: "가동시간", value: `${eq.usedHours.toLocaleString("ko-KR")}시간` },
            { label: "신뢰도", value: `${eq.confidence}%` },
          ]}
        />
      </Card>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-6 text-center text-[13px] text-[var(--bb-mute)]">{text}</p>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[var(--bb-canvas-parchment)] p-4">
      <p className="text-[11px] text-[var(--bb-mute)]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[var(--bb-ink)]">{value}</p>
    </div>
  );
}
