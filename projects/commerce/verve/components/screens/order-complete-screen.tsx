"use client";

import { CheckCircle } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import type { Order } from "@/projects/commerce/verve/lib/types";
import { Button, Divider, formatPrice } from "@/projects/commerce/verve/components/ui";

export function OrderCompleteScreen({ orderId, orders, onNavigate }: { orderId?: string; orders: Order[]; onNavigate: NavigateFn }) {
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  if (!order) {
    return (
      <div className="verve-light flex min-h-[70dvh] items-center justify-center">
        <Button tone="light" onClick={() => onNavigate("shop")}>쇼핑하러 가기</Button>
      </div>
    );
  }

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[640px] px-4 py-16 text-center md:px-8 md:py-24">
        <CheckCircle size={48} weight="fill" className="mx-auto text-[var(--v-primary)]" />
        <h1 className="mt-6 text-[26px] font-medium tracking-[-0.3px] text-[var(--v-body-on-light)]">주문이 완료되었어요</h1>
        <p className="mt-3 text-[14px] text-[var(--v-muted)]">주문번호 {order.id}</p>

        <div className="mt-10 border border-[var(--v-hairline-on-light)] p-6 text-left">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-16 w-14 object-cover" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[var(--v-body-on-light)]">{item.name}</p>
                  <p className="text-[12px] text-[var(--v-muted)]">
                    {item.color} / {item.size} / {item.quantity}개
                  </p>
                </div>
                <span className="v-number text-[13px] text-[var(--v-body-on-light)]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Divider tone="light" className="my-5" />
          <div className="flex justify-between text-[13px] text-[var(--v-muted)]">
            <span>배송 예정</span>
            <span className="text-[var(--v-body-on-light)]">{order.estimatedDelivery}</span>
          </div>
          <div className="mt-2 flex justify-between text-[13px] text-[var(--v-muted)]">
            <span>배송지</span>
            <span className="text-right text-[var(--v-body-on-light)]">
              {order.recipient} · {order.address}
            </span>
          </div>
          <Divider tone="light" className="my-5" />
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-medium text-[var(--v-body-on-light)]">총 결제금액</span>
            <span className="v-number text-[20px] font-medium text-[var(--v-body-on-light)]">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button tone="light" variant="outline" className="flex-1" onClick={() => onNavigate("mypage")}>
            주문 상세 보기
          </Button>
          <Button tone="light" className="flex-1" onClick={() => onNavigate("shop")}>
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    </div>
  );
}
