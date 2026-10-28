"use client";

// 관리자 웹 엔트리 (/monitoring/taxdesk-admin). 지우지 않는다: 라우트가 공유 컴파일 단위다.
// ?screen= 으로 첫 화면을 고르고, 화면 안 상태는 아래 파라미터로 연다.
//   review: ?queue=<큐 이름> ?row=<접수번호> ?tab=customer|poa|evidence|rag ?bulk=1
//   jobs: ?job=<작업 ID> ?step=1~8      auth: ?row=<작업 ID>
//   automation: ?stop=1 (긴급 정지 중) ?agent=off (에이전트 연결 끊김)
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/monitoring/taxdesk/styles/taxdesk.css";
import { AdminShell } from "@/projects/monitoring/taxdesk/components/admin/admin-shell";
import {
  ADMIN_SCREENS,
  REVIEW_QUEUES,
  type AdminScreen,
  type ReviewQueue,
} from "@/projects/monitoring/taxdesk/components/admin/admin-nav";
import { ReviewScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/review-screen";
import { JobsScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/jobs-screen";
import { AuthScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/auth-screen";
import { MappingScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/mapping-screen";
import { AutomationScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/automation-screen";
import { MembersScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/members-screen";
import { PaymentsScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/payments-screen";
import { KnowledgeScreen } from "@/projects/monitoring/taxdesk/components/admin/screens/knowledge-screen";

export function AdminApp() {
  const params = useSearchParams();
  const requested = params.get("screen");
  const requestedQueue = params.get("queue");
  const [screen, setScreen] = useState<AdminScreen>(
    ADMIN_SCREENS.includes(requested as AdminScreen) ? (requested as AdminScreen) : "review",
  );
  const [queue, setQueue] = useState<ReviewQueue>(
    REVIEW_QUEUES.includes(requestedQueue as ReviewQueue) ? (requestedQueue as ReviewQueue) : "전체 접수",
  );
  // 다른 화면으로 옮기면 URL로 받은 내부 상태는 버린다
  const [fromUrl, setFromUrl] = useState(true);

  function navigate(next: AdminScreen, q?: ReviewQueue) {
    if (q) setQueue(q);
    setScreen(next);
    setFromUrl(false);
  }

  const p = (key: string) => (fromUrl ? params.get(key) : null);

  return (
    <AdminShell screen={screen} queue={queue} onNavigate={navigate}>
      {screen === "review" && (
        <ReviewScreen
          key={queue}
          queue={queue}
          initialTab={p("tab")}
          initialRow={p("row")}
          initialBulk={p("bulk") === "1"}
          onNavigate={navigate}
        />
      )}
      {screen === "jobs" && <JobsScreen initialJob={p("job")} initialStep={p("step")} onNavigate={navigate} />}
      {screen === "auth" && <AuthScreen initialRow={p("row")} />}
      {screen === "mapping" && <MappingScreen />}
      {screen === "automation" && <AutomationScreen initialStop={p("stop") === "1"} agentDown={p("agent") === "off"} />}
      {screen === "members" && <MembersScreen />}
      {screen === "payments" && <PaymentsScreen />}
      {screen === "knowledge" && <KnowledgeScreen />}
    </AdminShell>
  );
}
