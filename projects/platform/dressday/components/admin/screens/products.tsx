"use client";

import { useState } from "react";
import { ImageSquare, Plus, UploadSimple } from "@phosphor-icons/react";
import { PRODUCT_TONE, countBy, productStatus, unitsOf, type ProductStatus } from "@/projects/platform/dressday/lib/admin-data";
import { CATEGORIES, PRODUCTS, SIZES, getProduct, num, totalStock } from "@/projects/platform/dressday/lib/catalog";
import type { Product, Size } from "@/projects/platform/dressday/lib/types";
import {
  Badge,
  Button,
  ChipToggle,
  Drawer,
  Field,
  PageHead,
  ProductThumb,
  SelectInput,
  Segmented,
  TableWrap,
  Tabs,
  Td,
  TextInput,
  Th,
  rowClass,
} from "@/projects/platform/dressday/components/admin/admin-ui";

type TabKey = "전체" | ProductStatus;
const STATUSES: ProductStatus[] = ["노출 중", "재고 부족", "숨김"];

function EditDrawer({ p, onClose }: { p: Product; onClose: () => void }) {
  const [sizes, setSizes] = useState<Size[]>(Object.keys(p.stock) as Size[]);
  const [status, setStatus] = useState<ProductStatus>(productStatus(p));
  const units = unitsOf(p.id);
  const toggle = (s: Size) => setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Drawer
      open
      onClose={onClose}
      width={560}
      title="상품 수정"
      meta={
        <>
          {p.label} | 누적 대여 {num(p.rentals)}회 | 개별 재고 {units.length}벌
        </>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary">저장</Button>
        </>
      }
    >
      <div className="space-y-6">
        <section>
          <p className="text-[13px] font-medium text-[var(--dd-ink)]">상품 이미지</p>
          <div className="mt-2 flex gap-3">
            <ProductThumb product={p} size={132} />
            <div className="flex flex-col gap-3">
              {[0, 1].map((i) => (
                <span key={i} className="flex h-[82px] w-[62px] items-center justify-center rounded-[8px] border border-dashed border-[var(--dd-border-strong)] text-[var(--dd-muted)]">
                  <ImageSquare size={20} />
                </span>
              ))}
            </div>
            <div className="ml-auto self-end">
              <Button size="sm" variant="secondary" icon={<UploadSimple size={14} />}>
                이미지 추가
              </Button>
            </div>
          </div>
        </section>

        <Field label="상품명" required>
          <TextInput defaultValue={p.name} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="카테고리" required>
            <SelectInput defaultValue={p.category} options={CATEGORIES} />
          </Field>
          <Field label="색상" required>
            <TextInput defaultValue={p.color} />
          </Field>
        </div>

        <Field label="사이즈" required>
          <span className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <ChipToggle key={s} label={s} on={sizes.includes(s)} onClick={() => toggle(s)} />
            ))}
          </span>
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="대여료 1일 (원)" required>
            <TextInput defaultValue={num(p.price)} align="right" />
          </Field>
          <Field label="보증금 (원)" required>
            <TextInput defaultValue={num(p.deposit)} align="right" />
          </Field>
          <Field label="정가 (원)">
            <TextInput defaultValue={num(p.retail)} align="right" />
          </Field>
        </div>

        <Field label="상품 상태">
          <Segmented<ProductStatus> value={status} onChange={setStatus} items={STATUSES.map((s) => ({ key: s, label: s }))} />
        </Field>

        <section>
          <p className="text-[13px] font-medium text-[var(--dd-ink)]">사이즈별 대여 가능 (벌)</p>
          <div className="mt-2 grid grid-cols-5 divide-x divide-[var(--dd-hairline)] rounded-[8px] border border-[var(--dd-hairline)]">
            {SIZES.map((s) => (
              <div key={s} className="py-2 text-center">
                <p className="text-[12px] text-[var(--dd-muted)]">{s}</p>
                <p className={`dd-num text-[15px] font-semibold ${p.stock[s] === undefined ? "text-[var(--dd-muted-soft)]" : "text-[var(--dd-ink)]"}`}>
                  {p.stock[s] ?? "없음"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

export function Products({ edit }: { edit?: string }) {
  const [tab, setTab] = useState<TabKey>("전체");
  const [editId, setEditId] = useState<string | null>(edit && PRODUCTS.some((p) => p.id === edit) ? edit : null);
  const counts = countBy(PRODUCTS, (p) => productStatus(p));
  const rows = tab === "전체" ? PRODUCTS : PRODUCTS.filter((p) => productStatus(p) === tab);

  return (
    <div className="space-y-6">
      <PageHead
        title="상품 관리"
        actions={
          <Button variant="ink" icon={<Plus size={16} />}>
            상품 등록
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[180px]">
          <SelectInput defaultValue="전체 카테고리" options={["전체 카테고리", ...CATEGORIES]} />
        </div>
        <div className="w-[140px]">
          <SelectInput defaultValue="대여 많은 순" options={["대여 많은 순", "최근 등록 순", "대여료 높은 순"]} />
        </div>
      </div>

      <div>
        <Tabs<TabKey>
          value={tab}
          onChange={setTab}
          items={[{ key: "전체", label: "전체", count: PRODUCTS.length }, ...STATUSES.map((s) => ({ key: s as TabKey, label: s, count: counts[s] ?? 0 }))]}
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>상품</Th>
              <Th>카테고리</Th>
              <Th>사이즈</Th>
              <Th>색상</Th>
              <Th align="right">대여료 (원)</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort((a, b) => b.rentals - a.rentals)
              .map((p) => {
                const st = productStatus(p);
                return (
                  <tr key={p.id} className={rowClass(p.id === editId)} onClick={() => setEditId(p.id)}>
                    <Td>
                      <span className="flex min-w-0 items-center gap-3">
                        <ProductThumb product={p} size={36} />
                        <span className="min-w-0">
                          <button type="button" onClick={() => setEditId(p.id)} className="block max-w-[260px] truncate text-left font-medium text-[var(--dd-ink)]" title={p.name}>
                            {p.name}
                          </button>
                          <span className="dd-num block text-[12px] text-[var(--dd-muted)]">
                            {p.label} | 누적 {num(p.rentals)}회
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>{p.category}</Td>
                    <Td>
                      <span className="flex gap-1">
                        {SIZES.map((s) => {
                          const n = p.stock[s];
                          if (n === undefined) return null;
                          return (
                            <span
                              key={s}
                              title={`${s} 대여 가능 ${n}`}
                              className={`dd-num rounded-[6px] px-1.5 py-0.5 text-[12px] ${n > 0 ? "bg-[var(--dd-strong)] text-[var(--dd-ink)]" : "text-[var(--dd-muted-soft)] line-through"}`}
                            >
                              {s}
                            </span>
                          );
                        })}
                      </span>
                      <span className="dd-num mt-0.5 block text-[12px] text-[var(--dd-muted)]">대여 가능 {totalStock(p)}벌</span>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-[rgba(0,0,0,0.12)]" style={{ background: p.tone }} />
                        {p.color}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="text-[var(--dd-ink)]">{num(p.price)}</span>
                      <span className="block text-[12px] text-[var(--dd-muted)]">보증금 {num(p.deposit)}</span>
                    </Td>
                    <Td>
                      <Badge tone={PRODUCT_TONE[st]}>{st}</Badge>
                    </Td>
                  </tr>
                );
              })}
          </tbody>
        </TableWrap>
        <p className="dd-num pt-4 text-[13px] text-[var(--dd-muted)]">
          1–{rows.length} / {rows.length}
        </p>
      </div>

      {editId && <EditDrawer key={editId} p={getProduct(editId)} onClose={() => setEditId(null)} />}
    </div>
  );
}
