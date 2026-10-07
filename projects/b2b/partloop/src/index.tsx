"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/partloop/styles/partloop.css";
import { TopBar } from "@/projects/b2b/partloop/components/layout/top-bar";
import { OrdersScreen } from "@/projects/b2b/partloop/components/screens/orders-screen";
import {
  NewOrderScreen,
  type OrderDraft,
} from "@/projects/b2b/partloop/components/screens/new-order-screen";
import { OrderDetailScreen } from "@/projects/b2b/partloop/components/screens/order-detail-screen";
import { NOW_STAMP, TODAY, initialOrders } from "@/projects/b2b/partloop/lib/mock-data";
import { SCREENS, type Navigate, type Screen } from "@/projects/b2b/partloop/lib/navigation";
import type { Order } from "@/projects/b2b/partloop/lib/types";

const DEFAULT_DETAIL_ID = "PO-2610-0419";

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

/* 승인 대기는 승인하면 공급사가 수락한 것으로 보고 진행 중으로 넘긴다(목업).
   진행 중과 지연은 납품 확인으로 완료 처리한다. */
function advance(order: Order): Order {
  if (order.status === "승인 대기") {
    return { ...order, status: "진행 중", events: { ...order.events, accepted: NOW_STAMP } };
  }
  if (order.status === "진행 중" || order.status === "지연") {
    return {
      ...order,
      status: "납품 완료",
      events: { ...order.events, shipped: order.events.shipped ?? NOW_STAMP, delivered: NOW_STAMP },
    };
  }
  return order;
}

function nextOrderId(orders: Order[]): string {
  const last = orders.reduce((max, order) => Math.max(max, Number(order.id.slice(-4))), 0);
  return `PO-${TODAY.slice(2, 4)}${TODAY.slice(5, 7)}-${String(last + 1).padStart(4, "0")}`;
}

export default function PartLoop() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const requested = params.get("screen");
    return {
      screen: SCREENS.includes(requested as Screen) ? (requested as Screen) : ("orders" as Screen),
      orderId: params.get("id") ?? DEFAULT_DETAIL_ID,
    };
  }, [search]);

  const [nav, setNav] = useState<{ screen: Screen; orderId: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [notice, setNotice] = useState<string | null>(null);

  const screen = nav?.screen ?? initial.screen;
  const orderId = nav?.orderId ?? initial.orderId;

  const onNavigate: Navigate = (next, id) => {
    setNav({ screen: next, orderId: id ?? orderId });
    window.scrollTo({ top: 0 });
  };

  const onAdvance = (id: string) =>
    setOrders((current) => current.map((order) => (order.id === id ? advance(order) : order)));

  const onSubmit = (draft: OrderDraft) => {
    const id = nextOrderId(orders);
    const created: Order = {
      ...draft,
      id,
      status: "승인 대기",
      requestedOn: TODAY,
      events: { requested: NOW_STAMP },
    };
    setOrders((current) => [created, ...current]);
    setNotice(`${id} 발주를 요청했습니다.`);
    onNavigate("orders", id);
  };

  return (
    <div className="partloop min-h-dvh">
      <TopBar screen={screen} onNavigate={onNavigate} />
      <main>
        {screen === "orders" && (
          <OrdersScreen
            orders={orders}
            notice={notice}
            onDismissNotice={() => setNotice(null)}
            onNavigate={onNavigate}
          />
        )}
        {screen === "new-order" && <NewOrderScreen onSubmit={onSubmit} onNavigate={onNavigate} />}
        {screen === "order-detail" && (
          <OrderDetailScreen
            order={orders.find((order) => order.id === orderId)}
            onAdvance={onAdvance}
            onNavigate={onNavigate}
          />
        )}
      </main>
    </div>
  );
}
