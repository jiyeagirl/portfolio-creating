"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/platform/dressday/styles/dressday.css";
import { ADMIN_SCREENS, AdminShell, type AdminScreen, type Go } from "@/projects/platform/dressday/components/admin/admin-shell";
import { Dashboard } from "@/projects/platform/dressday/components/admin/screens/dashboard";
import { Reservations } from "@/projects/platform/dressday/components/admin/screens/reservations";
import { Dispatch } from "@/projects/platform/dressday/components/admin/screens/dispatch";
import { Riders } from "@/projects/platform/dressday/components/admin/screens/riders";
import { Products } from "@/projects/platform/dressday/components/admin/screens/products";
import { Inventory } from "@/projects/platform/dressday/components/admin/screens/inventory";
import { Inspection } from "@/projects/platform/dressday/components/admin/screens/inspection";
import { Customers } from "@/projects/platform/dressday/components/admin/screens/customers";
import { Settlement } from "@/projects/platform/dressday/components/admin/screens/settlement";

/*
 * 관리자 콘솔 엔트리. 초기 화면과 내부 상태는 ?screen= 과 보조 쿼리에서 읽는다 (시각 검증 캡처용):
 *   ?screen=reservations&detail=DD-0918-2471   예약 상세 슬라이드오버
 *   ?screen=dispatch&assign=J-1712             라이더 배정 슬라이드오버
 *   ?screen=products&edit=lace-mini            상품 수정 슬라이드오버
 *   ?screen=riders&rider=r1 | inspection&item=RT-0918-01 | customers&customer=c1
 * 이후 이동은 내부 state가 맡는다.
 */

const QUERY_KEYS = ["detail", "assign", "edit", "rider", "item", "customer"] as const;

function initialScreen(v: string | null): AdminScreen {
  return ADMIN_SCREENS.includes(v as AdminScreen) ? (v as AdminScreen) : "dashboard";
}

export function AdminApp() {
  const params = useSearchParams();
  const [state, setState] = useState<{ screen: AdminScreen; query: Record<string, string>; n: number }>(() => {
    const query: Record<string, string> = {};
    for (const k of QUERY_KEYS) {
      const v = params.get(k);
      if (v) query[k] = v;
    }
    return { screen: initialScreen(params.get("screen")), query, n: 0 };
  });

  const go: Go = (screen, query = {}) => setState((s) => ({ screen, query, n: s.n + 1 }));
  const { screen, query } = state;
  const key = `${screen}-${state.n}`;

  return (
    <div className="dressday min-h-dvh">
      <AdminShell screen={screen} onNavigate={(s) => go(s)}>
        {screen === "dashboard" && <Dashboard key={key} go={go} />}
        {screen === "reservations" && <Reservations key={key} detail={query.detail} />}
        {screen === "dispatch" && <Dispatch key={key} assign={query.assign} />}
        {screen === "riders" && <Riders key={key} rider={query.rider} />}
        {screen === "products" && <Products key={key} edit={query.edit} />}
        {screen === "inventory" && <Inventory key={key} />}
        {screen === "inspection" && <Inspection key={key} item={query.item} />}
        {screen === "customers" && <Customers key={key} customer={query.customer} />}
        {screen === "settlement" && <Settlement key={key} />}
      </AdminShell>
    </div>
  );
}
