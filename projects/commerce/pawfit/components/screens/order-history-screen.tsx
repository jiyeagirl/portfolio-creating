"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Tag, Truck } from "@phosphor-icons/react";
import { AppBar, Badge, EmptyState } from "@/projects/commerce/pawfit/components/ui";
import { COUPONS, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import type { Order, OrderStatus } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

type StatusFilter = "전체" | OrderStatus;

const STATUS_FILTERS: StatusFilter[] = ["전체", "결제완료", "배송준비", "배송중", "배송완료", "취소"];

const STATUS_TONE: Record<OrderStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  결제완료: "accent",
  배송준비: "warning",
  배송중: "warning",
  배송완료: "success",
  취소: "danger",
};

export function OrderHistoryScreen({
  orders,
  onNavigate,
}: {
  orders: Order[];
  onNavigate: NavigateFn;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);

  const recentFirst = orders.slice().reverse();
  const filtered = recentFirst.filter((o) => statusFilter === "전체" || o.status === statusFilter);

  const countOf = (status: StatusFilter) =>
    status === "전체" ? orders.length : orders.filter((o) => o.status === status).length;

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="주문내역" onBack={() => onNavigate("mypage")} />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* 쿠폰함 진입점 */}
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={() => setShowCoupons((v) => !v)}
            className="flex w-full items-center gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-muted)]">
              <Tag size={16} weight="bold" />
            </span>
            <span className="flex-1 text-[14px] font-semibold text-[var(--pf-ink)]">쿠폰함</span>
            <span className="text-[12.5px] text-[var(--pf-muted)]">
              {COUPONS.filter((c) => !c.used).length}장 보유
            </span>
            {showCoupons ? (
              <CaretUp size={14} weight="bold" className="text-[var(--pf-muted)]" />
            ) : (
              <CaretDown size={14} weight="bold" className="text-[var(--pf-muted)]" />
            )}
          </button>

          {showCoupons && (
            <div className="mt-2 space-y-2">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`rounded-[16px] border border-[var(--pf-hairline)] p-3.5 ${
                    coupon.used ? "bg-[var(--pf-canvas)] opacity-60" : "bg-[var(--pf-surface-card)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-[var(--pf-ink)]">{coupon.label}</span>
                    <Badge tone={coupon.used ? "neutral" : "success"}>
                      {coupon.used ? "사용완료" : "사용가능"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-[var(--pf-muted)]">{coupon.expiresAt}까지 사용 가능</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 상태 필터 칩 */}
        <div className="pf-scroll-x mt-4 flex gap-1 overflow-x-auto px-5">
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                  active ? "bg-[var(--pf-surface-card)] text-[var(--pf-ink)]" : "text-[var(--pf-muted)]"
                }`}
              >
                {status} {countOf(status)}
              </button>
            );
          })}
        </div>

        {/* 주문 리스트 */}
        <div className="px-5 pt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Truck size={22} weight="bold" />}
              title="주문 내역이 없어요"
              body="아직 해당 상태의 주문이 없어요."
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => {
                const expanded = expandedId === order.id;
                const firstItem = order.items[0];
                const extraCount = order.items.length - 1;
                return (
                  <div
                    key={order.id}
                    className="rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="flex w-full flex-col gap-2 p-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[var(--pf-muted)]">
                          {order.orderedAt} | {order.id}
                        </span>
                        <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
                      </div>
                      <p className="text-[14px] font-semibold text-[var(--pf-ink)]">
                        {firstItem?.productName ?? "주문 상품"}
                        {extraCount > 0 ? ` 외 ${extraCount}건` : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="pf-num text-[15px] font-semibold text-[var(--pf-ink)]">
                          {formatWon(order.totalAmount)}원
                        </span>
                        {expanded ? (
                          <CaretUp size={14} weight="bold" className="text-[var(--pf-muted)]" />
                        ) : (
                          <CaretDown size={14} weight="bold" className="text-[var(--pf-muted)]" />
                        )}
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-[var(--pf-hairline)] px-4 pb-4 pt-3">
                        <div className="space-y-2.5">
                          {order.items.map((item, i) => (
                            <div key={`${item.productId}-${i}`} className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-[13px] text-[var(--pf-body)]">{item.productName}</p>
                                <p className="text-[11.5px] text-[var(--pf-muted)]">
                                  {item.color} | {item.size} | {item.quantity}개
                                </p>
                              </div>
                              <span className="pf-num shrink-0 text-[13px] font-semibold text-[var(--pf-ink)]">
                                {formatWon(item.price * item.quantity)}원
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-[12px] bg-[var(--pf-surface-card)] px-3 py-2.5 text-[12.5px]">
                          <span className="text-[var(--pf-muted)]">배송지</span>
                          <span className="text-[var(--pf-ink)]">{order.addressLabel}</span>
                        </div>

                        {order.trackingNo && (
                          <div className="mt-2 flex items-center gap-2 rounded-[12px] border border-[var(--pf-hairline)] px-3 py-2.5 text-[12.5px]">
                            <Truck size={15} weight="bold" className="shrink-0 text-[var(--pf-muted)]" />
                            <span className="text-[var(--pf-muted)]">배송 조회</span>
                            <span className="pf-num ml-auto font-semibold text-[var(--pf-ink)]">
                              {order.trackingNo}
                            </span>
                          </div>
                        )}

                        {order.status === "배송완료" && (
                          <button
                            type="button"
                            onClick={() => onNavigate("sizeFeedback", order.id)}
                            className="mt-3 w-full rounded-[12px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] py-2.5 text-[13px] font-semibold text-[var(--pf-ink)] transition-transform active:scale-[0.97]"
                          >
                            사이즈 피드백 남기기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
