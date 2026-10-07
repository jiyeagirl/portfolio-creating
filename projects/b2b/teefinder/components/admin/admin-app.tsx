"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/b2b/teefinder/styles/teefinder.css";
import { StoreProvider } from "@/projects/b2b/teefinder/lib/store";
import { isAdminScreen, type AdminScreenName } from "@/projects/b2b/teefinder/lib/navigation";
import { AdminShell } from "@/projects/b2b/teefinder/components/admin/admin-shell";
import { ApprovalsScreen } from "@/projects/b2b/teefinder/components/admin/approvals-screen";
import { MembersScreen } from "@/projects/b2b/teefinder/components/admin/members-screen";
import { CourseConfigScreen } from "@/projects/b2b/teefinder/components/admin/course-config-screen";
import { MonitoringScreen } from "@/projects/b2b/teefinder/components/admin/monitoring-screen";
import { PushScreen } from "@/projects/b2b/teefinder/components/admin/push-screen";

/* 상태는 부모의 StoreProvider를 쓴다. 앱과 같은 provider 아래에 두면 승인이 앱에 바로 반영된다.
   초기 화면은 ?screen=, 골프장 설정의 초기 선택은 ?course= (스크린샷 도구용). */
export function AdminApp() {
  const params = useSearchParams();
  const requested = params.get("screen");
  const [screen, setScreen] = useState<AdminScreenName>(isAdminScreen(requested) ? requested : "approvals");
  const [configId, setConfigId] = useState<string>(params.get("course") ?? "c01");

  return (
    <AdminShell screen={screen} onNavigate={setScreen}>
      {screen === "approvals" && <ApprovalsScreen />}
      {screen === "members" && <MembersScreen />}
      {screen === "course-config" && <CourseConfigScreen selectedId={configId} onSelect={setConfigId} autoRun={params.get("test") === "run"} />}
      {screen === "monitoring" && (
        <MonitoringScreen
          onEditConfig={(id) => {
            setConfigId(id);
            setScreen("course-config");
          }}
        />
      )}
      {screen === "push" && <PushScreen />}
    </AdminShell>
  );
}

/* 관리자 단독 URL(/b2b/teefinder-admin)용: 자체 상태를 가진다. */
export function AdminStandalone() {
  return (
    <StoreProvider>
      <AdminApp />
    </StoreProvider>
  );
}
