"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Sparkle, Trophy } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  DefList,
  EquipmentThumb,
  Field,
  Input,
  Meter,
  PageHead,
  Row,
  Table,
  Cell,
  Tabs,
  Toggle,
} from "@/projects/b2b/buildbid/components/ui";
import { bids, buyerCompany, equipmentList, inspections } from "@/projects/b2b/buildbid/lib/mock-data";
import {
  CATEGORY_LABEL,
  GRADE_NOTE,
  STATUS_LABEL,
  STATUS_TONE,
  manwon,
  type Navigate,
} from "@/projects/b2b/buildbid/lib/navigation";

export function EquipmentDetailScreen({ equipmentId, onNavigate }: { equipmentId?: string; onNavigate: Navigate }) {
  const eligible = useMemo(() => equipmentList.filter((e) => e.status !== "draft"), []);
  const [pickedId, setPickedId] = useState<string | undefined>(equipmentId ?? eligible[0]?.id);
  const eq = equipmentList.find((e) => e.id === (equipmentId ?? pickedId)) ?? eligible[0];

  const [bid1, setBid1] = useState(String(eq?.autoPrice ?? 0));
  const [transportDays, setTransportDays] = useState("5");
  const [immediatePickup, setImmediatePickup] = useState(false);
  const [note, setNote] = useState("");
  const [submitted1, setSubmitted1] = useState(false);
  const [bid2, setBid2] = useState("");
  const [submitted2, setSubmitted2] = useState(false);

  if (!eq) return <PageHead eyebrow="장비 상세" title="장비 상세" desc="표시할 장비가 없습니다." />;

  const round1 = bids.filter((b) => b.equipmentId === eq.id && b.round === 1);
  const round2 = bids.filter((b) => b.equipmentId === eq.id && b.round === 2);
  const topRound1 = Math.max(0, ...round1.map((b) => b.unitPrice));
  const topRound2 = Math.max(0, ...round2.map((b) => b.unitPrice));
  const inspection = inspections.find((i) => i.equipmentId === eq.id);
  const myWin = round2.find((b) => b.selected && b.buyer === buyerCompany.name);

  const stage1Open = eq.status === "quoted" || eq.status === "bidding1";
  const stage1Closed = ["inspecting", "bidding2", "confirmed", "settled"].includes(eq.status);
  const stage2Open = eq.status === "bidding2";

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="장비 상세 / 입찰"
        title="장비 상세 정보"
        desc="상세 정보를 확인하고 1차, 최종 입찰에 참여하세요."
        actions={
          <button type="button" onClick={() => onNavigate("listings")} className="text-[13px] font-semibold text-[var(--bb-primary)] hover:underline">
            목록으로 돌아가기
          </button>
        }
      />

      <Card padded={false}>
        <div className="border-b border-[var(--bb-hairline)] px-5 pt-4">
          <Tabs value={eq.id} items={eligible.slice(0, 8).map((item) => ({ key: item.id, label: item.name }))} onChange={setPickedId} />
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <EquipmentThumb photo={eq.photo} alt={eq.name} size={56} rounded={16} />
            <div>
              <p className="text-[17px] font-semibold text-[var(--bb-ink)]">{eq.name}</p>
              <p className="bb-mono text-[12px] text-[var(--bb-mute)]">{eq.code} | {eq.maker} {eq.model}</p>
            </div>
          </div>
          <Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge>
        </div>
      </Card>

      {myWin && (
        <div className="flex items-center gap-3 rounded-[18px] border border-[var(--bb-primary)] bg-[var(--bb-info-soft)] p-4">
          <Trophy size={20} weight="fill" className="text-[var(--bb-info-deep)]" />
          <p className="text-[13px] text-[var(--bb-info-deep)]">
            <strong className="font-semibold">{manwon(myWin.unitPrice)}</strong>에 낙찰되었습니다. 거래 관리 화면에서 계약 진행 상황을 확인하세요.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="상세 정보" />
            <DefList
              items={[
                { label: "카테고리", value: CATEGORY_LABEL[eq.category] },
                { label: "연식", value: `${eq.manufacturedYear}년식` },
                { label: "가동시간", value: `${eq.usedHours.toLocaleString("ko-KR")}시간` },
                { label: "등급", value: `${eq.grade}등급 | ${GRADE_NOTE[eq.grade]}` },
                { label: "소재지", value: eq.region },
                { label: "판매자", value: eq.seller },
              ]}
              columns={1}
            />
            <p className="mt-4 rounded-[18px] bg-[var(--bb-canvas-parchment)] p-4 text-[13px] leading-6 text-[var(--bb-body)]">{eq.spec}</p>
          </Card>

          <Card>
            <CardHead title="1차 입찰 참여" desc={stage1Open ? "AI 예상 시세를 참고해 입찰가를 제출하세요." : "1차 입찰이 마감되었습니다."} />
            {stage1Closed ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <MiniStat label="참여 바이어" value={`${round1.length}곳`} />
                <MiniStat label="최고 입찰가" value={topRound1 ? manwon(topRound1) : "-"} />
                <MiniStat label="마감" value="완료" />
              </div>
            ) : submitted1 ? (
              <div className="flex items-center gap-3 rounded-[18px] bg-[var(--bb-info-soft)] p-4 text-[var(--bb-info-deep)]">
                <CheckCircle size={18} weight="fill" />
                <p className="text-[13px]">{manwon(Number(bid1))}로 1차 입찰을 제출했습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="입찰가" required>
                    <Input type="number" value={bid1} onChange={setBid1} suffix="원" />
                  </Field>
                  <Field label="운송 소요일">
                    <Input type="number" value={transportDays} onChange={setTransportDays} suffix="일" />
                  </Field>
                </div>
                <Field label="비고">
                  <Input value={note} onChange={setNote} placeholder="전달 사항이 있으면 입력하세요" />
                </Field>
                <Toggle on={immediatePickup} onChange={() => setImmediatePickup((v) => !v)} label="낙찰 시 즉시 인수 가능" />
                <div className="flex items-center justify-between rounded-[18px] bg-[var(--bb-canvas-parchment)] p-3.5">
                  <span className="text-[12px] text-[var(--bb-mute)]">현재 참여 {round1.length}곳 | 최고가 {topRound1 ? manwon(topRound1) : "-"}</span>
                  <Button size="sm" onClick={() => setSubmitted1(true)}>1차 입찰 제출</Button>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHead title="검수 리포트 확인" desc={inspection ? `검수원 ${inspection.inspector} | ${inspection.inspectedAt}` : "검수 대기 중입니다."} />
            {!inspection ? (
              <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-6 text-center text-[13px] text-[var(--bb-mute)]">
                1차 입찰 마감 후 현장 검수가 진행되며, 완료되면 리포트가 여기에 표시됩니다.
              </p>
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
            <CardHead title="최종(2차) 입찰 참여" desc={stage2Open ? "검수 리포트를 반영한 최종가를 제출하세요." : eq.status === "confirmed" || eq.status === "settled" ? "최종 입찰이 마감되었습니다." : "검수 완료 후 최종 입찰이 시작됩니다."} />
            {eq.status === "confirmed" || eq.status === "settled" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <MiniStat label="참여 바이어" value={`${round2.length}곳`} />
                <MiniStat label="낙찰가" value={topRound2 ? manwon(topRound2) : "-"} />
                <MiniStat label="결과" value={myWin ? "낙찰" : "유찰"} />
              </div>
            ) : !stage2Open ? (
              <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-6 text-center text-[13px] text-[var(--bb-mute)]">
                아직 최종 입찰 단계가 아닙니다.
              </p>
            ) : submitted2 ? (
              <div className="flex items-center gap-3 rounded-[18px] bg-[var(--bb-info-soft)] p-4 text-[var(--bb-info-deep)]">
                <CheckCircle size={18} weight="fill" />
                <p className="text-[13px]">{manwon(Number(bid2) || 0)}로 최종 입찰을 제출했습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="최종 입찰가" required hint={inspection ? `검수 반영가 ${manwon(inspection.priceAfter)} 참고` : undefined}>
                  <Input type="number" value={bid2} onChange={setBid2} suffix="원" placeholder={String(inspection?.priceAfter ?? eq.autoPrice)} />
                </Field>
                <div className="flex items-center justify-between rounded-[18px] bg-[var(--bb-canvas-parchment)] p-3.5">
                  <span className="text-[12px] text-[var(--bb-mute)]">현재 참여 {round2.length}곳 | 최고가 {topRound2 ? manwon(topRound2) : "-"}</span>
                  <Button size="sm" onClick={() => setSubmitted2(true)} disabled={!bid2}>최종 입찰 제출</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bb-info-soft)] text-[var(--bb-info-deep)]">
                <Sparkle size={15} weight="fill" />
              </span>
              <p className="text-[13px] font-semibold text-[var(--bb-ink)]">AI 예상 시세</p>
            </div>
            <p className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-[var(--bb-ink)]">{manwon(eq.autoPrice)}</p>
            <p className="mt-1 text-[13px] text-[var(--bb-mute)]">신품 참고가 {manwon(eq.listPrice)}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--bb-mute)]">신뢰도</span>
                <span className="font-semibold text-[var(--bb-ink)]">{eq.confidence}%</span>
              </div>
              <div className="mt-1.5"><Meter value={eq.confidence} tone="info" /></div>
            </div>
            <div className="mt-5 space-y-2 border-t border-[var(--bb-hairline)] pt-4">
              <p className="text-[12px] font-semibold text-[var(--bb-ink)]">감가 요인</p>
              {eq.factors.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-3 text-[12px]">
                  <span className="text-[var(--bb-body)]">{f.label}</span>
                  <span className={`shrink-0 font-semibold ${f.impact < 0 ? "text-[var(--bb-danger-deep)]" : "text-[var(--bb-info-deep)]"}`}>
                    {f.impact > 0 ? "+" : ""}{f.impact}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-[var(--bb-hairline)] pt-4">
              <p className="text-[12px] font-semibold text-[var(--bb-ink)]">산출 근거</p>
              {eq.basis.map((b) => (
                <div key={b.label} className="flex items-baseline justify-between gap-3 text-[12px]">
                  <span className="text-[var(--bb-mute)]">{b.label}</span>
                  <span className="bb-mono text-[var(--bb-body)]">{b.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[var(--bb-canvas-parchment)] p-4">
      <p className="text-[11px] text-[var(--bb-mute)]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[var(--bb-ink)]">{value}</p>
    </div>
  );
}
