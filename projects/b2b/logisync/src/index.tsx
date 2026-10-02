"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/logisync/styles/logisync.css";
import { Shell } from "@/projects/b2b/logisync/components/shell";
import { IngestScreen } from "@/projects/b2b/logisync/components/screens/ingest-screen";
import { MonitorScreen } from "@/projects/b2b/logisync/components/screens/monitor-screen";
import { VerifyScreen } from "@/projects/b2b/logisync/components/screens/verify-screen";
import { StandardizeScreen } from "@/projects/b2b/logisync/components/screens/standardize-screen";
import { UnifiedScreen } from "@/projects/b2b/logisync/components/screens/unified-screen";
import { SettlementScreen } from "@/projects/b2b/logisync/components/screens/settlement-screen";
import { InventoryScreen } from "@/projects/b2b/logisync/components/screens/inventory-screen";
import { AnalyticsScreen } from "@/projects/b2b/logisync/components/screens/analytics-screen";
import { ApiScreen } from "@/projects/b2b/logisync/components/screens/api-screen";
import { VIEWS, type View } from "@/projects/b2b/logisync/lib/navigation";

/* `?screen=` 값은 스크린샷 도구용. 서버 스냅샷을 빈 값으로 둬서 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

export default function LogiSync() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo<View>(() => {
    const requested = new URLSearchParams(search).get("screen");
    // 대표 화면은 통합 물류 데이터
    return VIEWS.includes(requested as View) ? (requested as View) : "unified";
  }, [search]);

  const [picked, setPicked] = useState<View | null>(null);
  const view = picked ?? initial;

  const onNavigate = (next: View) => {
    setPicked(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <Shell view={view} onNavigate={onNavigate}>
      {view === "ingest" && <IngestScreen onNavigate={onNavigate} />}
      {view === "monitor" && <MonitorScreen />}
      {view === "verify" && <VerifyScreen />}
      {view === "standardize" && <StandardizeScreen />}
      {view === "unified" && <UnifiedScreen />}
      {view === "settlement" && <SettlementScreen />}
      {view === "inventory" && <InventoryScreen />}
      {view === "analytics" && <AnalyticsScreen />}
      {view === "api" && <ApiScreen />}
    </Shell>
  );
}
