"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import {
  CHECK_KEYS,
  INSPECTIONS,
  INSPECTION_PENDING,
  INSPECTION_TONE,
  getCustomer,
  getInspection,
  getReservation,
  getRider,
  short,
  type CheckKey,
  type CheckValue,
  type Inspection as InspectionItem,
} from "@/projects/platform/dressday/lib/admin-data";
import { getProduct, num } from "@/projects/platform/dressday/lib/catalog";
import { Badge, Button, PageHead, Panel, ProductThumb, SectionTitle } from "@/projects/platform/dressday/components/admin/admin-ui";

const CHECK_LABEL: Record<CheckKey, string> = {
  오염: "오염 (얼룩, 냄새)",
  훼손: "훼손 (찢김, 올 풀림)",
  분실: "분실 (구성품 포함)",
  수선: "수선 필요",
};

function CheckRow({ k, value, note, onChange }: { k: CheckKey; value: CheckValue; note?: string; onChange: (v: CheckValue) => void }) {
  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[14px] text-[var(--dd-ink)]">{CHECK_LABEL[k]}</span>
        <span className="inline-flex shrink-0 rounded-full bg-[var(--dd-strong)] p-1" role="radiogroup" aria-label={k}>
          {(["없음", "있음"] as CheckValue[]).map((v) => {
            const on = value === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange(v)}
                className={`h-7 min-w-14 rounded-full px-3 text-[12px] ${
                  on ? (v === "있음" ? "bg-[var(--dd-act-fg)] font-semibold text-white" : "bg-white font-semibold text-[var(--dd-ink)] shadow-[0_0_0_1px_var(--dd-hairline)]") : "text-[var(--dd-muted)]"
                }`}
              >
                {v}
              </button>
            );
          })}
        </span>
      </div>
      {note && <p className="mt-2 rounded-[8px] bg-[var(--dd-act-bg)] px-3 py-2 text-[13px] leading-5 text-[var(--dd-act-fg)]">{note}</p>}
    </li>
  );
}

function Detail({ item }: { item: InspectionItem }) {
  const r = getReservation(item.reservationId)!;
  const p = getProduct(r.productId);
  const c = getCustomer(r.customerId);
  const [checks, setChecks] = useState(item.checks);
  const extra = item.costs.reduce((a, b) => a + b.amount, 0);
  const pending = item.status === "검수 대기";
  const unchecked = CHECK_KEYS.filter((k) => checks[k] === "미확인").length;

  return (
    <Panel className="p-6">
      <div className="flex gap-5">
        <ProductThumb product={p} size={96} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="dd-code text-[13px] text-[var(--dd-muted)]">{item.id}</span>
            <Badge tone={INSPECTION_TONE[item.status]}>{item.status}</Badge>
          </div>
          <h2 className="mt-1 text-[18px] font-semibold leading-7 text-[var(--dd-ink)]">
            {p.name} <span className="font-normal text-[var(--dd-muted)]">{r.size}</span>
          </h2>
          <dl className="mt-2 grid grid-cols-[88px_1fr] gap-x-3 gap-y-1 text-[13px] leading-5">
            <dt className="text-[var(--dd-muted)]">재고 태그</dt>
            <dd className="dd-code text-[var(--dd-ink)]">{r.unit}</dd>
            <dt className="text-[var(--dd-muted)]">예약</dt>
            <dd className="text-[var(--dd-ink)]">
              <span className="dd-code">{r.id}</span> | {c?.name} | {short(r.start)} ~ {short(r.end)}
            </dd>
            <dt className="text-[var(--dd-muted)]">회수</dt>
            <dd className="dd-num text-[var(--dd-ink)]">
              {r.pickup.doneAt} {getRider(r.pickup.riderId)?.name} | 입고 {item.receivedAt}
            </dd>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <section>
          <SectionTitle aside={pending ? <span className="dd-num text-[12px] text-[var(--dd-muted)]">미확인 {unchecked}</span> : null}>검수 항목</SectionTitle>
          <ul className="mt-1 divide-y divide-[var(--dd-hairline-soft)]">
            {CHECK_KEYS.map((k) => (
              <CheckRow key={k} k={k} value={checks[k]} note={item.notes[k]} onChange={(v) => setChecks((prev) => ({ ...prev, [k]: v }))} />
            ))}
          </ul>
        </section>

        <section className="rounded-[14px] bg-[var(--dd-soft)] p-5">
          <SectionTitle
            aside={
              <Button size="sm" variant="ghost" icon={<Plus size={14} />}>
                비용 추가
              </Button>
            }
          >
            추가 비용 (원)
          </SectionTitle>
          <dl className="mt-3 space-y-2 text-[14px] leading-5">
            {item.costs.length === 0 ? (
              <div className="flex justify-between">
                <dt className="text-[var(--dd-muted)]">청구 항목 없음</dt>
                <dd className="dd-num text-[var(--dd-ink)]">0</dd>
              </div>
            ) : (
              item.costs.map((cost) => (
                <div key={cost.label} className="flex justify-between gap-4">
                  <dt className="text-[var(--dd-body)]">{cost.label}</dt>
                  <dd className="dd-num text-[var(--dd-ink)]">{num(cost.amount)}</dd>
                </div>
              ))
            )}
            <div className="flex justify-between gap-4 border-t border-[var(--dd-hairline)] pt-3">
              <dt className="text-[var(--dd-muted)]">보증금</dt>
              <dd className="dd-num text-[var(--dd-ink)]">{num(r.deposit)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--dd-muted)]">차감</dt>
              <dd className="dd-num text-[var(--dd-ink)]">{extra > 0 ? `−${num(extra)}` : "0"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[var(--dd-hairline)] pt-3">
              <dt className="font-semibold text-[var(--dd-ink)]">보증금 환불 (원)</dt>
              <dd className="dd-num text-[16px] font-semibold text-[var(--dd-ink)]">{pending ? "검수 후 확정" : num(r.deposit - extra)}</dd>
            </div>
          </dl>
          {!pending && (
            <p className="mt-3 text-[12px] leading-4 text-[var(--dd-muted)]">
              {item.closedAt} | {item.inspector} 처리 | {r.method}
            </p>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--dd-hairline)] pt-5">
        {pending ? (
          <>
            <Button variant="secondary">수선 이관</Button>
            <Button variant="secondary">세탁 이관</Button>
            <Button variant="ink" disabled={unchecked > 0}>
              검수 완료
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary">고객 안내 내역</Button>
            <Button variant="secondary">처리 되돌리기</Button>
          </>
        )}
      </div>
    </Panel>
  );
}

export function Inspection({ item }: { item?: string }) {
  const [selected, setSelected] = useState(getInspection(item)?.id ?? "RT-0918-04");
  const done = INSPECTIONS.filter((i) => i.status !== "검수 대기");
  const current = getInspection(selected) ?? INSPECTIONS[0];

  const group = (title: string, list: InspectionItem[]) => (
    <section>
      <p className="px-1 pb-2 text-[13px] font-semibold text-[var(--dd-ink)]">
        {title} <span className="dd-num font-normal text-[var(--dd-muted)]">{list.length}</span>
      </p>
      <ul className="space-y-1">
        {list.map((i) => {
          const r = getReservation(i.reservationId)!;
          const p = getProduct(r.productId);
          const on = i.id === selected;
          return (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => setSelected(i.id)}
                aria-current={on ? "true" : undefined}
                className={`dd-press flex w-full items-center gap-3 rounded-[12px] p-2.5 text-left ${on ? "bg-white shadow-[0_0_0_1px_var(--dd-hairline)]" : ""}`}
              >
                <ProductThumb product={p} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium leading-5 text-[var(--dd-ink)]">{p.name}</span>
                  <span className="dd-num block truncate text-[12px] leading-4 text-[var(--dd-muted)]">
                    {r.size} | {getCustomer(r.customerId)?.name} | 입고 {i.receivedAt.slice(-5)}
                  </span>
                </span>
                <Badge tone={INSPECTION_TONE[i.status]}>{i.status === "검수 대기" ? "대기" : i.status}</Badge>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <div className="space-y-6">
      <PageHead title="반납 및 검수 관리" />

      <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5 rounded-[14px] bg-[var(--dd-soft)] p-3">
          {group("검수 대기", INSPECTION_PENDING)}
          {group("처리 완료", done)}
        </aside>
        <Detail key={current.id} item={current} />
      </div>
    </div>
  );
}
