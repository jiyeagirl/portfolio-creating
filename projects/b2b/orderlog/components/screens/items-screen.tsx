"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretRight, Cube, PencilSimple, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Cell,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  Table,
  Tabs,
} from "@/projects/b2b/orderlog/components/ui";
import { items as mockItems, priceSnapshots } from "@/projects/b2b/orderlog/lib/mock-data";
import { won } from "@/projects/b2b/orderlog/lib/navigation";
import type { Item } from "@/projects/b2b/orderlog/lib/types";

const SNAPSHOT_TONE = {
  예약됨: "info",
  적용됨: "success",
  취소됨: "neutral",
} as const;

export function ItemsScreen() {
  const [tab, setTab] = useState<"items" | "snapshots">("items");
  const [editing, setEditing] = useState<Item | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  const openEdit = (item: Item) => {
    setEditing(item);
    setNewPrice(String(item.scheduledPrice ?? item.currentPrice));
    setEffectiveDate(item.effectiveDate ?? "");
  };

  const priceDiff = editing && newPrice ? Number(newPrice) - editing.currentPrice : 0;
  const priceDiffPct = editing && editing.currentPrice > 0 ? (priceDiff / editing.currentPrice) * 100 : 0;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="품목 관리"
        title="품목/단가 스냅샷"
        desc="3단계 품목 분류와 단가를 관리합니다. 단가를 변경하면 예약 적용일까지 기존 스냅샷 단가로 발주가 그대로 정산됩니다."
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "items", label: "품목 목록", count: mockItems.length },
          { key: "snapshots", label: "스냅샷 이력", count: priceSnapshots.length },
        ]}
      />

      {tab === "items" ? (
        <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
          <div className="p-5">
            <Table
              head={["품목", "분류", "현재가", "예약가 / 적용일", "영향 발주", ""]}
              align={["left", "left", "right", "left", "center", "right"]}
              minWidth={720}
            >
              {mockItems.map((item) => (
                <Row key={item.id}>
                  <Cell strong>
                    <span className="flex items-center gap-2.5">
                      {item.photo !== undefined ? (
                        <Image
                          src={`https://picsum.photos/id/${item.photo}/64/64`}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="rounded-[6px] object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--ot-surface-soft)] text-[var(--ot-body)]">
                          <Cube size={14} />
                        </span>
                      )}
                      <span>
                        <span className="block">{item.name}</span>
                        <span className="ot-mono block text-[11px] font-normal text-[var(--ot-mute)]">{item.code}</span>
                      </span>
                    </span>
                  </Cell>
                  <Cell muted nowrap>
                    <span className="flex items-center gap-1 text-[12px]">
                      {item.category.large}
                      <CaretRight size={9} />
                      {item.category.medium}
                      <CaretRight size={9} />
                      {item.category.small}
                    </span>
                  </Cell>
                  <Cell align="right" mono strong>
                    {won(item.currentPrice)}/{item.unit}
                  </Cell>
                  <Cell nowrap>
                    {item.scheduledPrice ? (
                      <span className="flex flex-col text-[12.5px]">
                        <span className="ot-mono font-medium text-[var(--ot-accent-deep)]">{won(item.scheduledPrice)}</span>
                        <span className="text-[11px] text-[var(--ot-mute)]">{item.effectiveDate} 적용</span>
                      </span>
                    ) : (
                      <span className="text-[12.5px] text-[var(--ot-mute)]">예약 없음</span>
                    )}
                  </Cell>
                  <Cell align="center" mono>
                    {item.affectedOrders}건
                  </Cell>
                  <Cell align="right">
                    <Button variant="secondary" size="sm" icon={<PencilSimple size={12} />} onClick={() => openEdit(item)}>
                      단가 수정
                    </Button>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
          <div className="p-5">
            <Table
              head={["품목", "단가 변경", "적용일", "생성자", "영향 발주", "상태"]}
              align={["left", "left", "left", "left", "center", "left"]}
              minWidth={680}
            >
              {priceSnapshots.map((s) => (
                <Row key={s.id}>
                  <Cell strong>{s.itemName}</Cell>
                  <Cell mono nowrap>
                    {won(s.fromPrice)} → {won(s.toPrice)}
                  </Cell>
                  <Cell nowrap>{s.effectiveDate}</Cell>
                  <Cell muted nowrap>
                    {s.createdBy}
                  </Cell>
                  <Cell align="center" mono>
                    {s.affectedOrders}건
                  </Cell>
                  <Cell>
                    <Badge tone={SNAPSHOT_TONE[s.status]}>{s.status}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </div>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? `${editing.name} 단가 수정` : ""}
        subtitle={editing ? `${editing.code} / ${editing.category.large} > ${editing.category.medium} > ${editing.category.small}` : ""}
        footer={
          editing && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                취소
              </Button>
              <Button icon={<Sparkle size={14} weight="bold" />} onClick={() => setEditing(null)}>
                스냅샷 생성
              </Button>
            </div>
          )
        }
      >
        {editing && (
          <div className="space-y-5">
            <div className="rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface-soft)] p-4">
              <p className="text-[12px] text-[var(--ot-mute)]">현재가</p>
              <p className="ot-mono mt-1 text-[20px] font-semibold text-[var(--ot-ink)]">
                {won(editing.currentPrice)} <span className="text-[13px] font-normal text-[var(--ot-mute)]">/{editing.unit}</span>
              </p>
            </div>

            <Field label="신규 단가" required>
              <Input value={newPrice} onChange={setNewPrice} type="number" suffix={`원/${editing.unit}`} />
            </Field>

            <Field label="예약 적용일" hint="이 날짜 이전에 등록된 발주는 기존 스냅샷 단가로 정산됩니다." required>
              <Input value={effectiveDate} onChange={setEffectiveDate} type="date" />
            </Field>

            <div className="rounded-[10px] border border-[var(--ot-accent-soft)] bg-[var(--ot-accent-soft)] p-4">
              <p className="text-[13px] font-medium text-[var(--ot-accent-deep)]">영향도 미리보기</p>
              <dl className="mt-2.5 space-y-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="text-[var(--ot-body)]">변동률</dt>
                  <dd className={`ot-mono font-medium ${priceDiff >= 0 ? "text-[var(--ot-danger-deep)]" : "text-[var(--ot-success-deep)]"}`}>
                    {priceDiff > 0 ? "+" : ""}
                    {priceDiffPct.toFixed(1)}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--ot-body)]">영향받는 진행중 발주</dt>
                  <dd className="ot-mono font-medium text-[var(--ot-ink)]">{editing.affectedOrders}건</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--ot-body)]">적용 전 발주</dt>
                  <dd className="text-[var(--ot-ink)]">기존 스냅샷 단가로 정산 (영향 없음)</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
