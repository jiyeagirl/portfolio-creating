"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { Badge, Card, CardHead, EquipmentThumb, PageHead, Row, Select, Table, Cell, Tabs } from "@/projects/b2b/buildbid/components/ui";
import { equipmentList } from "@/projects/b2b/buildbid/lib/mock-data";
import { CATEGORY_LABEL, STATUS_LABEL, STATUS_TONE, manwon } from "@/projects/b2b/buildbid/lib/navigation";

const INSPECTORS = ["정민석 검수원", "한지훈 검수원", "오세영 검수원", "배지훈 검수원"];

type Tab = "approval" | "assign";

export function AdminApprovals() {
  const [tab, setTab] = useState<Tab>("approval");
  const [decided, setDecided] = useState<Record<string, "approved" | "rejected">>({});
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const pendingApproval = equipmentList.filter((e) => e.status === "draft");
  const pendingAssign = equipmentList.filter((e) => e.status === "inspecting");

  return (
    <div className="space-y-8">
      <PageHead eyebrow="검수와 거래 관리" title="등록 승인 / 검수원 배정" desc="새로 등록된 장비를 승인하고, 1차 입찰이 마감된 장비에 검수원을 배정합니다." />

      <Card padded={false}>
        <div className="px-5 pt-4">
          <Tabs
            value={tab}
            items={[
              { key: "approval", label: "등록 승인 대기", count: pendingApproval.length },
              { key: "assign", label: "검수원 배정 대기", count: pendingAssign.length },
            ]}
            onChange={setTab}
          />
        </div>
        <div className="p-5">
          {tab === "approval" ? (
            pendingApproval.length === 0 ? (
              <EmptyState text="승인 대기 중인 장비가 없습니다." />
            ) : (
              <Table head={["장비", "판매자", "AI 예상가", "등록일", "처리"]} align={["left", "left", "right", "left", "center"]} minWidth={680}>
                {pendingApproval.map((eq) => {
                  const decision = decided[eq.id];
                  return (
                    <Row key={eq.id}>
                      <Cell strong>
                        <div className="flex items-center gap-2.5">
                          <EquipmentThumb photo={eq.photo} alt={eq.name} size={36} />
                          <div className="min-w-0">
                            <p className="truncate">{eq.name}</p>
                            <p className="bb-mono text-[11px] font-normal text-[var(--bb-mute)]">{eq.code} | {CATEGORY_LABEL[eq.category]}</p>
                          </div>
                        </div>
                      </Cell>
                      <Cell muted>{eq.seller}</Cell>
                      <Cell align="right" mono strong>{manwon(eq.autoPrice)}</Cell>
                      <Cell muted nowrap>{eq.registeredAt}</Cell>
                      <Cell align="center">
                        {decision ? (
                          <Badge tone={decision === "approved" ? "ink" : "danger"}>{decision === "approved" ? "승인됨" : "반려됨"}</Badge>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              aria-label="승인"
                              onClick={() => setDecided((prev) => ({ ...prev, [eq.id]: "approved" }))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-info-deep)] transition-colors hover:bg-[var(--bb-info-soft)]"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              type="button"
                              aria-label="반려"
                              onClick={() => setDecided((prev) => ({ ...prev, [eq.id]: "rejected" }))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-danger-deep)] transition-colors hover:bg-[var(--bb-danger-soft)]"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </Cell>
                    </Row>
                  );
                })}
              </Table>
            )
          ) : pendingAssign.length === 0 ? (
            <EmptyState text="검수원 배정이 필요한 장비가 없습니다." />
          ) : (
            <Table head={["장비", "판매자", "1차 입찰 최고가", "검수원 배정"]} align={["left", "left", "right", "left"]} minWidth={620}>
              {pendingAssign.map((eq) => (
                <Row key={eq.id}>
                  <Cell strong>{eq.name}</Cell>
                  <Cell muted>{eq.seller}</Cell>
                  <Cell align="right" mono strong>{manwon(eq.autoPrice)}</Cell>
                  <Cell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={assigned[eq.id] ?? "선택"}
                        options={["선택", ...INSPECTORS]}
                        onChange={(next) => setAssigned((prev) => ({ ...prev, [eq.id]: next }))}
                      />
                      {assigned[eq.id] && assigned[eq.id] !== "선택" && <Badge tone="info">배정 완료</Badge>}
                    </div>
                  </Cell>
                </Row>
              ))}
            </Table>
          )}
        </div>
      </Card>

      <Card soft>
        <CardHead title="전체 장비 현황" desc="상태별 전체 장비 목록입니다." />
        <Table head={["장비", "카테고리", "판매자", "상태"]} align={["left", "left", "left", "left"]} minWidth={560}>
          {equipmentList.map((eq) => (
            <Row key={eq.id}>
              <Cell strong>{eq.name}</Cell>
              <Cell muted>{CATEGORY_LABEL[eq.category]}</Cell>
              <Cell muted>{eq.seller}</Cell>
              <Cell><Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-8 text-center text-[13px] text-[var(--bb-mute)]">{text}</p>;
}
