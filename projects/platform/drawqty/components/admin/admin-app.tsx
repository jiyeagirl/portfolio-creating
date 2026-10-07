"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/platform/drawqty/styles/drawqty.css";
import { StoreProvider } from "@/projects/platform/drawqty/lib/store";
import { isAdminScreen, type AdminScreenName } from "@/projects/platform/drawqty/lib/navigation";
import { AdminShell } from "@/projects/platform/drawqty/components/admin/admin-shell";
import { QuotesScreen } from "@/projects/platform/drawqty/components/admin/quotes-screen";
import { DrawingsScreen } from "@/projects/platform/drawqty/components/admin/drawings-screen";

/* ?screen=quotes|drawings 로 첫 화면을, ?select=<접수번호 또는 도면 id> 로 우측 패널이 열린 상태를 고른다. */
export function AdminApp() {
  const params = useSearchParams();
  const requested = params.get("screen");
  const [screen, setScreen] = useState<AdminScreenName>(isAdminScreen(requested) ? requested : "quotes");
  const select = params.get("select");

  return (
    <StoreProvider>
      <AdminShell screen={screen} onNavigate={setScreen}>
        {screen === "quotes" && <QuotesScreen key="quotes" initialSelected={select} />}
        {screen === "drawings" && <DrawingsScreen key="drawings" initialSelected={select} />}
      </AdminShell>
    </StoreProvider>
  );
}
