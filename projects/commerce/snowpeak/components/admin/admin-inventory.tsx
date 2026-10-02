"use client";

import { useMemo, useState } from "react";
import { WarningCircle, Wrench } from "@phosphor-icons/react";
import { ADMIN_INVENTORY } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { AdminInventoryCategory, AdminInventoryRow } from "@/projects/commerce/snowpeak/lib/types";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  Drawer,
  Field,
  Input,
  Meter,
  PageHead,
  Row,
  Stat,
  Table,
  Tabs,
  Toggle,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";

type CategoryFilter = "전체" | AdminInventoryCategory;

const CATEGORIES: AdminInventoryCategory[] = ["객실", "장비", "리프트권"];

function meterTone(row: AdminInventoryRow): "ink" | "warn" | "danger" {
  if (row.available <= row.lowStockThreshold) return "danger";
  if (row.available / row.totalStock < 0.5) return "warn";
  return "ink";
}

export function AdminInventory() {
  const [rows, setRows] = useState<AdminInventoryRow[]>(ADMIN_INVENTORY);
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [openId, setOpenId] = useState<string | null>(null);

  const [draftAvailable, setDraftAvailable] = useState("");
  const [draftTotal, setDraftTotal] = useState("");
  const [draftMaintenance, setDraftMaintenance] = useState(false);

  const filtered = useMemo(
    () => (category === "전체" ? rows : rows.filter((r) => r.category === category)),
    [rows, category],
  );

  const counts = (key: CategoryFilter) =>
    key === "전체" ? rows.length : rows.filter((r) => r.category === key).length;

  const totalAvailable = rows.reduce((sum, r) => sum + r.available, 0);
  const lowStockItems = rows.filter((r) => r.available <= r.lowStockThreshold);
  const maintenanceCount = rows.filter((r) => r.underMaintenance).length;

  const openRow = rows.find((r) => r.id === openId) ?? null;

  const openEdit = (row: AdminInventoryRow) => {
    setOpenId(row.id);
    setDraftAvailable(String(row.available));
    setDraftTotal(String(row.totalStock));
    setDraftMaintenance(row.underMaintenance);
  };

  const closeEdit = () => setOpenId(null);

  const saveEdit = () => {
    if (!openId) return;
    const available = parseInt(draftAvailable.replace(/[^0-9]/g, ""), 10) || 0;
    const totalStock = parseInt(draftTotal.replace(/[^0-9]/g, ""), 10) || 0;
    setRows((prev) =>
      prev.map((r) =>
        r.id === openId
          ? {
              ...r,
              available,
              totalStock,
              underMaintenance: draftMaintenance,
              updatedAt: "2023-10-15",
            }
          : r,
      ),
    );
    closeEdit();
  };

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="재고 관리"
        title="객실 / 장비 / 리프트권 재고 현황"
        desc="전 재고군의 가용 수량과 가동률을 실시간으로 확인하고, 점검 상태와 사용 불가 여부를 직접 제어합니다."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="전체 가용 수량" value={`${totalAvailable.toLocaleString("ko-KR")}`} note="전 품목 합산" />
        <Stat label="재고 부족 품목" value={`${lowStockItems.length}건`} note="임계치 이하" />
        <Stat label="점검중 품목" value={`${maintenanceCount}건`} note="사용 불가 처리" />
      </div>

      <Card>
        <CardHead
          title="재고 부족 알림"
          desc={
            lowStockItems.length > 0
              ? `가용 수량이 임계치 이하로 떨어진 품목 ${lowStockItems.length}건`
              : "임계치 이하로 떨어진 품목이 없습니다"
          }
        />
        {lowStockItems.length > 0 ? (
          <ul className="space-y-2">
            {lowStockItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-[6px] bg-[var(--sp-danger-soft)] px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--sp-ink)]">
                  <WarningCircle size={14} weight="fill" className="text-[var(--sp-danger)]" />
                  {item.itemName}
                  <span className="text-[12px] font-normal text-[var(--sp-mute)]">{item.category}</span>
                </span>
                <span className="sp-num text-[13px] font-medium text-[var(--sp-danger)]">
                  {item.available} / {item.totalStock}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-[var(--sp-mute)]">현재 재고 부족으로 표시된 품목이 없습니다.</p>
        )}
      </Card>

      <div>
        <Tabs<CategoryFilter>
          value={category}
          onChange={setCategory}
          items={[
            { key: "전체", label: "전체", count: counts("전체") },
            ...CATEGORIES.map((c) => ({ key: c as CategoryFilter, label: c, count: counts(c) })),
          ]}
        />

        <div className="mt-4">
          <Table
            head={["품목명", "카테고리", "전체수량", "가용수량", "가동률", "상태"]}
            align={["left", "left", "right", "right", "left", "left"]}
            minWidth={680}
          >
            {filtered.map((row) => {
              const rate = Math.round((row.available / row.totalStock) * 100);
              const low = row.available <= row.lowStockThreshold;
              return (
                <Row key={row.id} onClick={() => openEdit(row)} active={row.id === openId}>
                  <Cell strong>{row.itemName}</Cell>
                  <Cell>
                    <Badge tone="neutral">{row.category}</Badge>
                  </Cell>
                  <Cell align="right" mono>
                    {row.totalStock}
                  </Cell>
                  <Cell align="right" mono>
                    {row.available}
                  </Cell>
                  <Cell>
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Meter value={rate} tone={meterTone(row)} />
                      </div>
                      <span className="sp-num text-[12px] text-[var(--sp-mute)]">{rate}%</span>
                    </div>
                  </Cell>
                  <Cell>
                    {row.underMaintenance ? (
                      <Badge tone="warn">점검중</Badge>
                    ) : low ? (
                      <Badge tone="danger">부족</Badge>
                    ) : (
                      <Badge tone="success">정상</Badge>
                    )}
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </div>
      </div>

      <Drawer
        open={openRow !== null}
        title={openRow?.itemName ?? ""}
        subtitle={openRow ? `${openRow.category} | ${openRow.id}` : undefined}
        onClose={closeEdit}
        footer={
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={saveEdit}>
              저장
            </Button>
            <Button variant="secondary" onClick={closeEdit}>
              취소
            </Button>
          </div>
        }
      >
        {openRow && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="전체 수량">
                <Input value={draftTotal} onChange={setDraftTotal} type="number" />
              </Field>
              <Field label="가용 수량" hint={`임계치 ${openRow.lowStockThreshold}`}>
                <Input value={draftAvailable} onChange={setDraftAvailable} type="number" />
              </Field>
            </div>

            <Field label="점검 / 사용 불가">
              <Toggle on={draftMaintenance} onChange={() => setDraftMaintenance((v) => !v)} label="점검중으로 표시" />
            </Field>

            {draftMaintenance && (
              <div className="flex items-start gap-2 rounded-[6px] border border-[var(--sp-warn-soft)] bg-[var(--sp-warn-soft)] px-3 py-2.5">
                <Wrench size={14} weight="bold" className="mt-0.5 shrink-0 text-[var(--sp-warn)]" />
                <p className="text-[12.5px] leading-5 text-[var(--sp-ink)]">
                  점검중으로 설정하면 판매 페이지에서 해당 품목의 예약이 일시 중단됩니다.
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
