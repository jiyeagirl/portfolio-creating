"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import {
  Button,
  EmptyState,
  MetricStrip,
  PageBand,
  PageBody,
  PageHeader,
  StatusBadge,
  inputClass,
} from "@/projects/b2b/partloop/components/ui";
import {
  daysLate,
  formatDate,
  formatWon,
  itemsSummary,
  orderTotal,
} from "@/projects/b2b/partloop/lib/format";
import { THIS_MONTH, supplierOf } from "@/projects/b2b/partloop/lib/mock-data";
import type { Navigate } from "@/projects/b2b/partloop/lib/navigation";
import type { Order, OrderStatus } from "@/projects/b2b/partloop/lib/types";

const PAGE_SIZE = 8;

type TabKey = "all" | "approval" | "open" | "done";

/* 진행 중 탭은 승인 이후 납품 전인 건 전체(수락 대기, 진행 중, 지연)를 묶는다. */
const TABS: { key: TabKey; label: string; match: (status: OrderStatus) => boolean }[] = [
  { key: "all", label: "전체", match: () => true },
  { key: "approval", label: "승인 대기", match: (s) => s === "승인 대기" },
  { key: "open", label: "진행 중", match: (s) => s === "수락 대기" || s === "진행 중" || s === "지연" },
  { key: "done", label: "납품 완료", match: (s) => s === "납품 완료" },
];

export function OrdersScreen({
  orders,
  notice,
  onDismissNotice,
  onNavigate,
}: {
  orders: Order[];
  notice: string | null;
  onDismissNotice: () => void;
  onNavigate: Navigate;
}) {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const metrics = useMemo(() => {
    const thisMonth = orders.filter((o) => o.requestedOn.startsWith(THIS_MONTH));
    const waiting = orders.filter((o) => ["수락 대기", "진행 중", "지연"].includes(o.status));
    const late = orders.filter((o) => o.status === "지연");
    const amount = thisMonth.reduce((sum, o) => sum + orderTotal(o), 0);
    return [
      { label: "이번 달 발주 (건)", value: String(thisMonth.length) },
      { label: "납품 대기 (건)", value: String(waiting.length) },
      { label: "지연 (건)", value: String(late.length), tone: late.length > 0 ? ("alert" as const) : undefined },
      { label: "이번 달 발주 금액 (만원)", value: formatWon(Math.floor(amount / 10_000)) },
    ];
  }, [orders]);

  const needle = query.trim().toLowerCase();
  const searched = orders.filter(
    (o) =>
      needle === "" ||
      o.id.toLowerCase().includes(needle) ||
      supplierOf(o.supplierId).name.toLowerCase().includes(needle),
  );
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0];
  const filtered = searched.filter((o) => activeTab.match(o.status));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const resetFilters = () => {
    setQuery("");
    setTab("all");
    setPage(1);
  };

  return (
    <div className="pl-enter">
      <PageBand>
        <PageHeader
          title="발주 현황"
          actions={
            <Button onClick={() => onNavigate("new-order")}>
              <Plus size={14} weight="bold" />
              발주 작성
            </Button>
          }
        />
        <div className="mt-6">
          <MetricStrip metrics={metrics} />
        </div>
      </PageBand>

      <PageBody>
        {notice && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[18px] border border-[var(--pl-hairline)] px-6 py-3">
            <p className="min-w-0 truncate">{notice}</p>
            <button
              type="button"
              onClick={onDismissNotice}
              aria-label="알림 닫기"
              className="shrink-0 text-[var(--pl-mute)] hover:text-[var(--pl-ink)]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div role="tablist" className="flex gap-2 overflow-x-auto py-0.5">
            {TABS.map((t) => {
              const count = searched.filter((o) => t.match(o.status)).length;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(t.key);
                    setPage(1);
                  }}
                  className={`pl-press flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] transition-colors ${
                    active
                      ? "border-2 border-[var(--pl-primary-focus)] px-[15px] py-[9px] font-semibold"
                      : "border border-[var(--pl-hairline-strong)] text-[var(--pl-ink)] hover:bg-[var(--pl-parchment)]"
                  }`}
                >
                  {t.label}
                  <span className="pl-num text-[12px] font-normal text-[var(--pl-mute)]">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-[280px]">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pl-mute)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="발주번호, 공급사 검색"
              aria-label="발주번호 또는 공급사 검색"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            message="조건에 맞는 발주가 없습니다."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                필터 초기화
              </Button>
            }
          />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left" style={{ minWidth: 760 }}>
              <thead>
                <tr className="border-b border-[var(--pl-hairline)] text-[12px] font-semibold text-[var(--pl-mute)]">
                  <th className="w-[148px] py-3 pr-4 font-semibold">발주번호</th>
                  <th className="min-w-[240px] py-3 pr-4 font-semibold">공급사</th>
                  <th className="w-[128px] py-3 pr-4 text-right font-semibold">금액 (원)</th>
                  <th className="w-[128px] py-3 pl-8 pr-4 font-semibold">납기일</th>
                  <th className="w-[112px] py-3 font-semibold">상태</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => {
                  const supplier = supplierOf(order.supplierId);
                  const late = order.status === "지연" ? daysLate(order.dueDate) : 0;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => onNavigate("order-detail", order.id)}
                      className="cursor-pointer border-b border-[var(--pl-hairline)] transition-colors hover:bg-[var(--pl-parchment)]"
                    >
                      <td className="py-3.5 pr-4 align-top">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("order-detail", order.id);
                          }}
                          className="pl-num font-semibold text-[var(--pl-primary)] hover:underline"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="max-w-[320px] py-3.5 pr-4 align-top">
                        <p className="truncate font-semibold" title={supplier.name}>
                          {supplier.name}
                        </p>
                        <p className="truncate text-[12px] text-[var(--pl-mute)]" title={itemsSummary(order)}>
                          {itemsSummary(order)}
                        </p>
                      </td>
                      <td className="pl-num whitespace-nowrap py-3.5 pr-4 text-right align-top">
                        {formatWon(orderTotal(order))}
                      </td>
                      <td className="pl-num whitespace-nowrap py-3.5 pl-8 pr-4 align-top">
                        <p>{formatDate(order.dueDate)}</p>
                        {late > 0 && (
                          <p className="text-[12px]" style={{ color: "var(--pl-action-fg)" }}>
                            {late}일 지연
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 align-top">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-end gap-3 pt-5">
            <Button
              variant="icon"
              aria-label="이전 페이지"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              <CaretLeft size={14} />
            </Button>
            <span className="pl-num w-14 text-center text-[12px]">
              {safePage} / {pageCount}
            </span>
            <Button
              variant="icon"
              aria-label="다음 페이지"
              disabled={safePage >= pageCount}
              onClick={() => setPage(safePage + 1)}
            >
              <CaretRight size={14} />
            </Button>
          </div>
        )}
      </PageBody>
    </div>
  );
}
