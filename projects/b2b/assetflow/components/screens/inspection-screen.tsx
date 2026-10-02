"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Equals,
  Gavel,
  MapPin,
  SealCheck,
  Timer,
  UserFocus,
} from "@phosphor-icons/react";
import {
  AssetThumb,
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Row,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import { assets, biddingDeadlines, bidsOf, inspections } from "@/projects/b2b/assetflow/lib/mock-data";
import { remainLabel, won, type Navigate } from "@/projects/b2b/assetflow/lib/navigation";
import type { Bid } from "@/projects/b2b/assetflow/lib/types";

const DELTA_META = {
  better: { icon: ArrowUp, tone: "text-[var(--af-link-deep)]", label: "상향" },
  worse: { icon: ArrowDown, tone: "text-[var(--af-error-deep)]", label: "하향" },
  same: { icon: Equals, tone: "text-[var(--af-mute)]", label: "동일" },
} as const;

const GRADE_TONE = {
  플래티넘: "ink",
  골드: "warn",
  실버: "neutral",
} as const;

export function InspectionScreen({
  assetId,
  onNavigate,
}: {
  assetId?: string;
  onNavigate: Navigate;
}) {
  const available = inspections.map((i) => i.assetId);
  const [selected, setSelected] = useState(
    assetId && available.includes(assetId) ? assetId : available[0],
  );
  const [confirmTarget, setConfirmTarget] = useState<Bid | null>(null);
  const [confirmed, setConfirmed] = useState<string[]>([]);

  const inspection = inspections.find((i) => i.assetId === selected) ?? inspections[0];
  const asset = assets.find((a) => a.id === inspection.assetId) ?? assets[0];
  const finalBids = bidsOf(asset.id, 2);
  const firstBids = bidsOf(asset.id, 1);
  const deadline = biddingDeadlines[asset.id];
  const priceDelta =
    Math.round(((inspection.priceAfter - inspection.priceBefore) / inspection.priceBefore) * 1000) / 10;
  const gradeChanged = inspection.gradeBefore !== inspection.gradeAfter;
  const done = confirmed.includes(asset.id) || asset.status === "confirmed";

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="검수 결과 | 최종 입찰"
        title="검수 리포트와 2차 최종 입찰"
        desc="현장 검수로 확인된 실제 상태를 리셀러가 보고 최종 가격을 다시 제시합니다. 1차 입찰가와 나란히 비교한 뒤 거래를 확정하세요."
        actions={
          <Button variant="secondary" size="md" onClick={() => onNavigate("bidding", asset.id)}>
            1차 입찰 보기
          </Button>
        }
      />

      <Tabs
        value={selected}
        onChange={setSelected}
        items={inspections.map((i) => {
          const a = assets.find((x) => x.id === i.assetId);
          return { key: i.assetId, label: a?.name ?? i.assetId, count: bidsOf(i.assetId, 2).length };
        })}
      />

      {/* 검수 요약 */}
      <Card padded={false} className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--af-hairline)] bg-[var(--af-soft)] px-5 py-4">
          <div className="flex items-center gap-3">
            <AssetThumb
              category={asset.category}
              photo={asset.photo}
              name={asset.name}
              size={40}
            />
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--af-ink)]">
                {asset.name}
              </p>
              <p className="af-mono text-[12px] text-[var(--af-mute)]">
                {asset.code} | {asset.quantity}대 | {asset.maker} {asset.model}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <UserFocus size={13} weight="bold" />
              {inspection.inspector}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <MapPin size={13} weight="bold" />
              {inspection.site}
            </span>
            <span className="af-mono flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <Timer size={13} weight="bold" />
              {inspection.inspectedAt}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[var(--af-hairline)] sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">등급 변화</p>
            {/* 취소선을 친 모노 C 가 € 처럼 읽혀서 화살표 표기로 바꿨다. */}
            <p className="mt-2 flex items-center gap-2">
              <span className="af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-mute)]">
                {inspection.gradeBefore}
              </span>
              <ArrowRight size={15} weight="bold" className="text-[var(--af-hairline-strong)]" />
              <span className="af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
                {inspection.gradeAfter}
              </span>
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--af-body)]">
              {gradeChanged ? "검수 결과 등급 조정" : "신고 등급과 동일"}
            </p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">검수 전 자동 시세</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-mute)]">
              {won(inspection.priceBefore)}
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--af-body)]">대당 기준</p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">검수 후 조정가</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
              {won(inspection.priceAfter)}
            </p>
            <p
              className={`mt-1.5 af-mono text-[12px] ${
                priceDelta >= 0 ? "text-[var(--af-link-deep)]" : "text-[var(--af-error-deep)]"
              }`}
            >
              {priceDelta > 0 ? "+" : ""}
              {priceDelta}%
            </p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">최종 입찰 마감</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
              {deadline ? remainLabel(deadline.remainMinutes) : "진행 전"}
            </p>
            <p className="af-mono mt-1.5 text-[12px] text-[var(--af-body)]">
              {deadline?.closesAt ?? "검수 승인 후 시작"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
        {/* 검수 리포트 */}
        <Card>
          <CardHead
            title="검수 리포트"
            desc="신고한 상태와 현장에서 확인한 상태를 항목별로 비교합니다."
            action={<Badge tone={gradeChanged ? "info" : "neutral"}>{gradeChanged ? "등급 조정" : "신고 일치"}</Badge>}
          />

          <p className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] px-4 py-3.5 text-[13.5px] leading-6 text-[var(--af-body)]">
            {inspection.summary}
          </p>

          <div className="mt-5">
            <Table head={["항목", "신고 내용", "현장 확인", "변화"]} align={["left", "left", "left", "center"]} minWidth={460}>
              {inspection.items.map((item) => {
                const meta = DELTA_META[item.delta];
                const Icon = meta.icon;
                return (
                  <Row key={item.label}>
                    <Cell strong nowrap>
                      {item.label}
                    </Cell>
                    <Cell muted>{item.declared}</Cell>
                    <Cell>{item.observed}</Cell>
                    <Cell align="center">
                      <span className={`inline-flex items-center gap-1 text-[12px] ${meta.tone}`}>
                        <Icon size={12} weight="bold" />
                        {meta.label}
                      </span>
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-[13px] font-medium text-[var(--af-ink)]">현장 촬영 사진</p>
            {inspection.photos.length === 0 ? (
              <div className="rounded-[6px] border border-dashed border-[var(--af-hairline-strong)] bg-[var(--af-soft)] px-4 py-6 text-center">
                <p className="text-[13px] font-medium text-[var(--af-ink)]">
                  랙 장비는 전산실 촬영 제한으로 사진이 공개되지 않습니다
                </p>
                <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--af-mute)]">
                  일련번호와 베이 상태 사진 8장은 검수 리포트 PDF에만 포함됩니다.
                </p>
                <div className="mt-3 flex justify-center">
                  <Button variant="secondary" size="sm">
                    검수 리포트 PDF 받기
                  </Button>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-3">
              {inspection.photos.map((photo, index) => (
                <figure
                  key={photo}
                  className="overflow-hidden rounded-[6px] border border-[var(--af-hairline)]"
                >
                  <Image
                    src={`https://picsum.photos/id/${photo}/480/320`}
                    alt={`${asset.name} 현장 검수 사진 ${index + 1}`}
                    width={240}
                    height={160}
                    className="h-[132px] w-full object-cover"
                  />
                  <figcaption className="af-mono border-t border-[var(--af-hairline)] bg-[var(--af-soft)] px-2.5 py-1.5 text-[11px] text-[var(--af-mute)]">
                    inspect_{String(index + 1).padStart(2, "0")}.jpg | {inspection.inspectedAt.slice(-5)}
                  </figcaption>
                </figure>
              ))}
            </div>
            )}
          </div>
        </Card>

        {/* 2차 최종 입찰 */}
        <div className="space-y-6">
          <Card>
            <CardHead
              title="2차 최종 입찰"
              desc="검수 리포트를 확인한 리셀러가 다시 제시한 가격입니다."
              action={
                finalBids.length > 0 ? (
                  <Badge tone="info" dot>
                    진행 중
                  </Badge>
                ) : (
                  <Badge tone="warn">검수 승인 대기</Badge>
                )
              }
            />

            {finalBids.length > 0 ? (
              <>
                <ul className="space-y-3">
                  {finalBids.map((bid, index) => {
                    const before = firstBids.find((b) => b.reseller === bid.reseller);
                    const change = before
                      ? Math.round(((bid.unitPrice - before.unitPrice) / before.unitPrice) * 1000) / 10
                      : null;
                    return (
                      <li
                        key={bid.id}
                        className={`rounded-[8px] border p-4 ${
                          index === 0
                            ? "border-[var(--af-primary)] bg-[var(--af-soft)]"
                            : "border-[var(--af-hairline)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="af-mono text-[12px] text-[var(--af-mute)]">
                                {index + 1}위
                              </span>
                              <span className="text-[14px] font-medium text-[var(--af-ink)]">
                                {bid.reseller}
                              </span>
                              <Badge tone={GRADE_TONE[bid.resellerGrade]}>{bid.resellerGrade}</Badge>
                              {bid.certifiedWipe && (
                                <SealCheck
                                  size={14}
                                  weight="fill"
                                  className="text-[var(--af-link)]"
                                  aria-label="파기 증명서 발급"
                                />
                              )}
                            </div>
                            <p className="mt-1.5 text-[12.5px] leading-[18px] text-[var(--af-body)]">
                              {bid.note}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="af-mono text-[18px] font-semibold leading-6 tracking-[-0.02em] text-[var(--af-ink)]">
                              {won(bid.unitPrice)}
                            </p>
                            <p className="af-mono text-[11.5px] text-[var(--af-mute)]">
                              총 {won(bid.unitPrice * asset.quantity)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--af-hairline)] pt-3">
                          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--af-body)]">
                            {before && (
                              <span className="af-mono">
                                1차 {won(before.unitPrice)}
                                <span
                                  className={
                                    (change ?? 0) >= 0
                                      ? " text-[var(--af-link-deep)]"
                                      : " text-[var(--af-error-deep)]"
                                  }
                                >
                                  {" "}
                                  ({(change ?? 0) > 0 ? "+" : ""}
                                  {change}%)
                                </span>
                              </span>
                            )}
                            <span className="af-mono">회수 {bid.pickupDays}일</span>
                          </span>
                          <Button
                            variant={index === 0 ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => setConfirmTarget(bid)}
                            disabled={done}
                          >
                            거래 확정
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {done && (
                  <div className="mt-4 flex items-start gap-2 rounded-[6px] bg-[var(--af-soft)] px-3.5 py-3">
                    <CheckCircle size={14} weight="fill" className="mt-px shrink-0 text-[var(--af-link)]" />
                    <p className="text-[12px] leading-[18px] text-[var(--af-body)]">
                      이미 거래가 확정된 자산입니다. 진행 상황은 거래 관리에서 확인하세요.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-[8px] border border-dashed border-[var(--af-hairline-strong)] bg-[var(--af-soft)] px-5 py-10 text-center">
                <Gavel size={20} weight="bold" className="mx-auto text-[var(--af-mute)]" />
                <p className="mt-3 text-[13.5px] font-medium text-[var(--af-ink)]">
                  검수 리포트 승인 후 최종 입찰이 열립니다
                </p>
                <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--af-mute)]">
                  리포트 내용에 이의가 없으면 승인해 주세요. 승인 즉시 1차 참여 리셀러에게 알림이
                  발송되고 48시간 동안 최종 입찰이 진행됩니다.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button variant="secondary" size="sm">
                    이의 제기
                  </Button>
                  <Button size="sm">리포트 승인하고 최종 입찰 열기</Button>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHead title="1차 대비 변화" desc="검수 결과가 최종 가격에 반영된 정도" />
            <DefList
              columns={1}
              items={[
                {
                  label: "1차 최고가",
                  value: <span className="af-mono">{firstBids[0] ? won(firstBids[0].unitPrice) : "-"}</span>,
                },
                {
                  label: "최종 최고가",
                  value: <span className="af-mono">{finalBids[0] ? won(finalBids[0].unitPrice) : "진행 전"}</span>,
                },
                {
                  label: "상승분",
                  value:
                    finalBids[0] && firstBids[0] ? (
                      <span className="af-mono text-[var(--af-link-deep)]">
                        +{won(finalBids[0].unitPrice - firstBids[0].unitPrice)} (
                        {Math.round(
                          ((finalBids[0].unitPrice - firstBids[0].unitPrice) / firstBids[0].unitPrice) *
                            1000,
                        ) / 10}
                        %)
                      </span>
                    ) : (
                      "-"
                    ),
                },
                {
                  label: "총액 차이",
                  value:
                    finalBids[0] && firstBids[0] ? (
                      <span className="af-mono">
                        {won((finalBids[0].unitPrice - firstBids[0].unitPrice) * asset.quantity)}
                      </span>
                    ) : (
                      "-"
                    ),
                },
                { label: "참여 리셀러", value: `${finalBids.length}개사 / 1차 ${firstBids.length}개사` },
              ]}
            />
          </Card>
        </div>
      </div>

      <Drawer
        open={confirmTarget !== null}
        title="거래 확정"
        subtitle={confirmTarget ? `${confirmTarget.reseller} | ${asset.name}` : undefined}
        onClose={() => setConfirmTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setConfirmTarget(null)}>
              취소
            </Button>
            <Button
              full
              onClick={() => {
                setConfirmed((prev) => [...prev, asset.id]);
                setConfirmTarget(null);
                onNavigate("deals");
              }}
            >
              확정하고 계약 진행
            </Button>
          </div>
        }
      >
        {confirmTarget && (
          <div className="space-y-5">
            <div className="rounded-[8px] border border-[var(--af-primary)] bg-[var(--af-primary)] p-5 text-[var(--af-on-primary)]">
              <p className="text-[12.5px] text-white/70">최종 거래 금액</p>
              <p className="mt-2 af-mono text-[28px] font-semibold leading-9 tracking-[-0.04em]">
                {won(confirmTarget.unitPrice * asset.quantity)}
              </p>
              <p className="af-mono mt-1.5 text-[12.5px] text-white/70">
                대당 {won(confirmTarget.unitPrice)} × {asset.quantity}대
              </p>
            </div>

            <DefList
              columns={1}
              items={[
                { label: "리셀러", value: `${confirmTarget.reseller} (${confirmTarget.resellerGrade})` },
                { label: "회수 예정", value: `확정 후 ${confirmTarget.pickupDays}일 이내` },
                { label: "파기 증명서", value: confirmTarget.certifiedWipe ? "발급" : "미발급" },
                { label: "수수료 (2.4%)", value: <span className="af-mono">{won(Math.round(confirmTarget.unitPrice * asset.quantity * 0.024))}</span> },
                {
                  label: "정산 예정액",
                  value: (
                    <span className="af-mono">
                      {won(Math.round(confirmTarget.unitPrice * asset.quantity * 0.976))}
                    </span>
                  ),
                },
              ]}
            />

            <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
              <p className="text-[13px] font-medium text-[var(--af-ink)]">확정 이후 절차</p>
              <ol className="mt-2.5 space-y-1.5">
                {[
                  "전자 계약서 자동 생성 및 서명 요청",
                  "데이터 파기 일정 협의 (저장장치 포함 자산)",
                  "장비 회수 및 인수인계 확인서 서명",
                  "회수 확인 후 3영업일 내 정산",
                ].map((step, index) => (
                  <li key={step} className="flex gap-2 text-[12.5px] leading-5 text-[var(--af-body)]">
                    <span className="af-mono shrink-0 text-[var(--af-mute)]">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-[12px] leading-[18px] text-[var(--af-mute)]">
              확정 후에는 취소할 수 없습니다. 취소가 필요하면 거래 관리에서 취소 요청을 접수해
              운영팀 검토를 거쳐야 합니다.
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
