"use client";

import { useRef, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import {
  Button,
  Field,
  PageBand,
  PageBody,
  PageHeader,
  SelectShell,
  inputClass,
  selectClass,
} from "@/projects/b2b/partloop/components/ui";
import { formatWon, vatOf } from "@/projects/b2b/partloop/lib/format";
import { DESTINATIONS, TODAY, suppliers } from "@/projects/b2b/partloop/lib/mock-data";
import type { Navigate } from "@/projects/b2b/partloop/lib/navigation";
import type { Order } from "@/projects/b2b/partloop/lib/types";

export type OrderDraft = Pick<Order, "supplierId" | "dueDate" | "destination" | "memo" | "items">;

type Row = { id: string; name: string; spec: string; qty: string; unitPrice: string };

const emptyRow = (id: string): Row => ({ id, name: "", spec: "", qty: "", unitPrice: "" });

/* 작성 중인 임시 발주서. 처음 열면 이미 채워진 상태라 바로 요청해 볼 수 있다. */
const INITIAL_ROWS: Row[] = [
  { id: "r1", name: "골판지 박스 중", spec: "360 × 280 × 220 mm", qty: "1800", unitPrice: "980" },
  { id: "r2", name: "박스 테이프", spec: "48 mm × 100 m", qty: "300", unitPrice: "1940" },
];

const toNumber = (value: string) => Number(value.replace(/[^0-9]/g, ""));

const GRID =
  "grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)_88px_112px_112px_44px] md:items-center";

export function NewOrderScreen({
  onSubmit,
  onNavigate,
}: {
  onSubmit: (draft: OrderDraft) => void;
  onNavigate: Navigate;
}) {
  const [supplierId, setSupplierId] = useState("sup-d");
  const [dueDate, setDueDate] = useState("2026-11-06");
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [memo, setMemo] = useState("");
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [submitted, setSubmitted] = useState(false);
  const nextRowId = useRef(3);

  const supplier = suppliers.find((s) => s.id === supplierId);
  const amountOf = (row: Row) => toNumber(row.qty) * toNumber(row.unitPrice);
  const supply = rows.reduce((sum, row) => sum + amountOf(row), 0);
  const vat = vatOf(supply);
  const filledCount = rows.filter((row) => row.name.trim() !== "").length;

  const rowComplete = (row: Row) => row.name.trim() !== "" && toNumber(row.qty) > 0 && toNumber(row.unitPrice) > 0;

  const errors = {
    supplier: supplierId === "" ? "공급사를 선택해 주세요." : "",
    dueDate:
      dueDate === "" ? "납기일을 입력해 주세요." : dueDate < TODAY ? "납기일은 오늘 이후로 입력해 주세요." : "",
    items: rows.every(rowComplete) ? "" : "품목명, 수량, 단가를 모두 입력해 주세요.",
  };
  const hasError = Boolean(errors.supplier || errors.dueDate || errors.items);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () => {
    setRows((current) => [...current, emptyRow(`r${nextRowId.current++}`)]);
  };

  const removeRow = (id: string) => setRows((current) => current.filter((row) => row.id !== id));

  const submit = () => {
    setSubmitted(true);
    if (hasError) return;
    onSubmit({
      supplierId,
      dueDate,
      destination,
      memo: memo.trim(),
      items: rows.map((row) => ({
        id: row.id,
        name: row.name.trim(),
        spec: row.spec.trim(),
        qty: toNumber(row.qty),
        unitPrice: toNumber(row.unitPrice),
      })),
    });
  };

  return (
    <div className="pl-enter">
      <PageBand>
        <PageHeader title="발주 작성" />
      </PageBand>

      <PageBody>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="order-basic">
              <h2 id="order-basic" className="text-[21px] font-semibold leading-[25px]">
                기본 정보
              </h2>
              <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Field label="공급사" htmlFor="supplier" required error={submitted ? errors.supplier : ""}>
                  <SelectShell>
                    <select
                      id="supplier"
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      aria-invalid={submitted && Boolean(errors.supplier)}
                      className={selectClass}
                    >
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </SelectShell>
                </Field>
                <Field label="납기일" htmlFor="due-date" required error={submitted ? errors.dueDate : ""}>
                  <input
                    id="due-date"
                    type="date"
                    min={TODAY}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    aria-invalid={submitted && Boolean(errors.dueDate)}
                    className={`${inputClass} pl-num`}
                  />
                </Field>
                <Field label="납품 장소" htmlFor="destination" className="sm:col-span-2">
                  <SelectShell>
                    <select
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className={selectClass}
                    >
                      {DESTINATIONS.map((place) => (
                        <option key={place} value={place}>
                          {place}
                        </option>
                      ))}
                    </select>
                  </SelectShell>
                </Field>
                <Field label="메모" htmlFor="memo" className="sm:col-span-2">
                  <textarea
                    id="memo"
                    rows={3}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="공급사에 전달할 내용"
                    className={`${inputClass} h-auto resize-none rounded-[18px] py-3 leading-5`}
                  />
                </Field>
              </div>
            </section>

            <section aria-labelledby="order-items">
              <div className="flex items-center justify-between gap-4">
                <h2 id="order-items" className="text-[21px] font-semibold leading-[25px]">
                  품목
                </h2>
                <Button variant="secondary" onClick={addRow}>
                  <Plus size={14} weight="bold" />
                  품목 추가
                </Button>
              </div>

              <div
                className={`${GRID} mt-5 hidden border-b border-[var(--pl-hairline)] pb-2 text-[12px] font-semibold text-[var(--pl-mute)] md:grid`}
              >
                <span>품목명</span>
                <span>규격</span>
                <span className="text-right">수량</span>
                <span className="text-right">단가 (원)</span>
                <span className="text-right">금액 (원)</span>
                <span />
              </div>

              <ul className="divide-y divide-[var(--pl-hairline)]">
                {rows.map((row, index) => {
                  const missing = submitted && !rowComplete(row);
                  return (
                    <li key={row.id} className={`${GRID} py-3`}>
                      <RowCell label="품목명" className="col-span-2 md:col-span-1">
                        <input
                          aria-label={`품목 ${index + 1} 품목명`}
                          value={row.name}
                          onChange={(e) => updateRow(row.id, { name: e.target.value })}
                          aria-invalid={missing && row.name.trim() === ""}
                          className={inputClass}
                        />
                      </RowCell>
                      <RowCell label="규격" className="col-span-2 md:col-span-1">
                        <input
                          aria-label={`품목 ${index + 1} 규격`}
                          title={row.spec}
                          value={row.spec}
                          onChange={(e) => updateRow(row.id, { spec: e.target.value })}
                          className={inputClass}
                        />
                      </RowCell>
                      <RowCell label="수량">
                        <input
                          aria-label={`품목 ${index + 1} 수량`}
                          inputMode="numeric"
                          value={row.qty === "" ? "" : formatWon(toNumber(row.qty))}
                          onChange={(e) => updateRow(row.id, { qty: String(toNumber(e.target.value) || "") })}
                          aria-invalid={missing && toNumber(row.qty) <= 0}
                          className={`${inputClass} pl-num px-4 text-right`}
                        />
                      </RowCell>
                      <RowCell label="단가 (원)">
                        <input
                          aria-label={`품목 ${index + 1} 단가`}
                          inputMode="numeric"
                          value={row.unitPrice === "" ? "" : formatWon(toNumber(row.unitPrice))}
                          onChange={(e) => updateRow(row.id, { unitPrice: String(toNumber(e.target.value) || "") })}
                          aria-invalid={missing && toNumber(row.unitPrice) <= 0}
                          className={`${inputClass} pl-num px-4 text-right`}
                        />
                      </RowCell>
                      <RowCell label="금액 (원)">
                        <p className="pl-num flex h-11 items-center justify-end whitespace-nowrap">
                          {formatWon(amountOf(row))}
                        </p>
                      </RowCell>
                      <div className="flex justify-end md:justify-center">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          aria-label={`품목 ${index + 1} 삭제`}
                          className="pl-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--pl-mute)] transition-colors hover:bg-[var(--pl-parchment)] hover:text-[var(--pl-ink)] disabled:opacity-30"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {submitted && errors.items && (
                <p role="alert" className="mt-2 text-[12px]" style={{ color: "var(--pl-action-fg)" }}>
                  {errors.items}
                </p>
              )}
            </section>
          </div>

          <aside className="min-w-0 rounded-[18px] border border-[var(--pl-hairline)] p-6 lg:sticky lg:top-[68px]">
            <h2 className="text-[21px] font-semibold leading-[25px]">발주 요약</h2>
            <div className="mt-4 border-b border-[var(--pl-hairline)] pb-4">
              <p className="font-semibold">{supplier?.name}</p>
              <p className="text-[12px] text-[var(--pl-mute)]">{supplier?.category}</p>
              <p className="pl-num mt-1 text-[12px] text-[var(--pl-mute)]">
                {supplier?.contact} | {supplier?.phone}
              </p>
            </div>
            <dl className="space-y-2.5 py-4">
              <SummaryLine label="품목 수 (건)" value={String(filledCount)} />
              <SummaryLine label="공급가액 (원)" value={formatWon(supply)} />
              <SummaryLine label="부가세 (원)" value={formatWon(vat)} />
            </dl>
            <div className="border-t border-[var(--pl-hairline)] pt-4">
              <p className="text-[12px] text-[var(--pl-mute)]">총액 (원)</p>
              <p className="pl-num mt-1 text-[28px] font-semibold leading-9">{formatWon(supply + vat)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={submit} className="w-full">
                발주 요청
              </Button>
              <Button variant="secondary" onClick={() => onNavigate("orders")} className="w-full">
                취소
              </Button>
            </div>
          </aside>
        </div>
      </PageBody>
    </div>
  );
}

function RowCell({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <span className="mb-1 block text-[12px] text-[var(--pl-mute)] md:sr-only">{label}</span>
      {children}
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[var(--pl-mute)]">{label}</dt>
      <dd className="pl-num whitespace-nowrap">{value}</dd>
    </div>
  );
}
