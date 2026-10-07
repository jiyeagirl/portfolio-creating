"use client";

import { CaretLeft, Check } from "@phosphor-icons/react";
import {
  Button,
  EmptyState,
  PageBand,
  PageBody,
  PageHeader,
  StatusBadge,
} from "@/projects/b2b/partloop/components/ui";
import {
  daysLate,
  formatDate,
  formatStamp,
  formatWon,
  itemAmount,
  orderSupply,
  vatOf,
} from "@/projects/b2b/partloop/lib/format";
import { supplierOf } from "@/projects/b2b/partloop/lib/mock-data";
import type { Navigate } from "@/projects/b2b/partloop/lib/navigation";
import type { Order, OrderEvents } from "@/projects/b2b/partloop/lib/types";

const STEPS: { key: keyof OrderEvents; label: string }[] = [
  { key: "requested", label: "발주 요청" },
  { key: "accepted", label: "공급사 수락" },
  { key: "shipped", label: "출고" },
  { key: "delivered", label: "납품 완료" },
];

/* 상태별 액션은 하나만. 승인 대기는 승인, 납품 전 단계는 납품 확인, 완료는 없다. */
function actionLabel(order: Order): string | null {
  if (order.status === "승인 대기") return "발주 승인";
  if (order.status === "진행 중" || order.status === "지연") return "납품 확인";
  return null;
}

export function OrderDetailScreen({
  order,
  onAdvance,
  onNavigate,
}: {
  order: Order | undefined;
  onAdvance: (id: string) => void;
  onNavigate: Navigate;
}) {
  if (!order) {
    return (
      <PageBody>
        <EmptyState
          message="발주를 찾을 수 없습니다."
          action={<Button onClick={() => onNavigate("orders")}>발주 현황</Button>}
        />
      </PageBody>
    );
  }

  const supplier = supplierOf(order.supplierId);
  const supply = orderSupply(order);
  const vat = vatOf(supply);
  const action = actionLabel(order);
  const currentStep = STEPS.findIndex((step) => !order.events[step.key]);

  return (
    <div className="pl-enter">
      <PageBand>
        <button
          type="button"
          onClick={() => onNavigate("orders")}
          className="mb-2 inline-flex items-center gap-1 text-[var(--pl-primary)] hover:underline"
        >
          <CaretLeft size={14} />
          발주 현황
        </button>

        <PageHeader
          title={order.id}
          badge={<StatusBadge status={order.status} />}
          meta={`${supplier.name} | 요청일 ${formatDate(order.requestedOn)}`}
          actions={action ? <Button onClick={() => onAdvance(order.id)}>{action}</Button> : undefined}
        />

        <ol className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4" aria-label="진행 단계">
          {STEPS.map((step, index) => {
            const stamp = order.events[step.key];
            const done = Boolean(stamp);
            const current = index === currentStep;
            return (
              <li
                key={step.key}
                aria-current={current ? "step" : undefined}
                className={`min-w-0 border-t-2 pt-3 ${
                  done
                    ? "border-[var(--pl-ink)]"
                    : current
                      ? "border-[var(--pl-primary-focus)]"
                      : "border-[var(--pl-hairline-strong)]"
                }`}
              >
                <p className={`flex items-center gap-1.5 ${done || current ? "font-semibold" : "text-[var(--pl-mute)]"}`}>
                  {done && <Check size={14} weight="bold" className="shrink-0" />}
                  {step.label}
                </p>
                <p className="pl-num mt-0.5 text-[12px] text-[var(--pl-mute)]">
                  {stamp ? formatStamp(stamp) : current ? "처리 대기" : "예정"}
                </p>
              </li>
            );
          })}
        </ol>
      </PageBand>

      <PageBody>
        <dl className="grid gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-4">
          <InfoItem label="공급사" value={supplier.name} sub={supplier.category} />
          <InfoItem label="담당자" value={supplier.contact} sub={supplier.phone} numeric />
          <InfoItem
            label="납기일"
            value={formatDate(order.dueDate)}
            sub={order.status === "지연" ? `${daysLate(order.dueDate)}일 지연` : undefined}
            subAlert
            numeric
          />
          <InfoItem label="납품 장소" value={order.destination} />
          {order.memo && (
            <div className="sm:col-span-2 md:col-span-4">
              <dt className="text-[12px] text-[var(--pl-mute)]">메모</dt>
              <dd className="mt-1 max-w-[640px]">{order.memo}</dd>
            </div>
          )}
        </dl>

        <section className="mt-12" aria-labelledby="detail-items">
          <h2 id="detail-items" className="text-[21px] font-semibold leading-[25px]">
            품목
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left" style={{ minWidth: 560 }}>
              <thead>
                <tr className="border-b border-[var(--pl-hairline)] text-[12px] text-[var(--pl-mute)]">
                  <th className="min-w-[200px] py-3 pr-4 font-semibold">품목</th>
                  <th className="w-[96px] py-3 pr-4 text-right font-semibold">수량</th>
                  <th className="w-[120px] py-3 pr-4 text-right font-semibold">단가 (원)</th>
                  <th className="w-[128px] py-3 text-right font-semibold">금액 (원)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--pl-hairline)]">
                    <td className="max-w-[360px] py-3.5 pr-4 align-top">
                      <p className="truncate font-semibold" title={item.name}>
                        {item.name}
                      </p>
                      <p className="truncate text-[12px] text-[var(--pl-mute)]" title={item.spec}>
                        {item.spec}
                      </p>
                    </td>
                    <td className="pl-num py-3.5 pr-4 text-right align-top">{formatWon(item.qty)}</td>
                    <td className="pl-num py-3.5 pr-4 text-right align-top">{formatWon(item.unitPrice)}</td>
                    <td className="pl-num py-3.5 text-right align-top">{formatWon(itemAmount(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="ml-auto mt-6 w-full max-w-[320px] space-y-2.5">
            <TotalLine label="공급가액 (원)" value={formatWon(supply)} />
            <TotalLine label="부가세 (원)" value={formatWon(vat)} />
            <div className="border-t border-[var(--pl-ink)] pt-3">
              <dt className="text-[12px] text-[var(--pl-mute)]">총액 (원)</dt>
              <dd className="pl-num mt-1 text-[28px] font-semibold leading-9">{formatWon(supply + vat)}</dd>
            </div>
          </dl>
        </section>
      </PageBody>
    </div>
  );
}

function InfoItem({
  label,
  value,
  sub,
  subAlert,
  numeric,
}: {
  label: string;
  value: string;
  sub?: string;
  subAlert?: boolean;
  numeric?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] text-[var(--pl-mute)]">{label}</dt>
      <dd className={`mt-1 font-semibold ${numeric ? "pl-num" : ""}`}>{value}</dd>
      {sub && (
        <dd
          className={`text-[12px] ${numeric ? "pl-num" : ""} ${subAlert ? "" : "text-[var(--pl-mute)]"}`}
          style={subAlert ? { color: "var(--pl-action-fg)" } : undefined}
        >
          {sub}
        </dd>
      )}
    </div>
  );
}

function TotalLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[var(--pl-mute)]">{label}</dt>
      <dd className="pl-num whitespace-nowrap">{value}</dd>
    </div>
  );
}
