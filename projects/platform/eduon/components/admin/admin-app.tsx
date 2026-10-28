"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/platform/eduon/styles/eduon.css";
import { StoreProvider, useStore } from "@/projects/platform/eduon/lib/store";
import { NOW } from "@/projects/platform/eduon/lib/mock-data";
import { ADMIN_SCREENS, pick, type AdminScreen } from "@/projects/platform/eduon/lib/navigation";
import { HIGH_RISK_REQUESTS, SECURITY_FINDINGS, VENDOR_ACCESS, type AccessLogEntry, type AdminRole } from "@/projects/platform/eduon/lib/admin-data";
import { useToast } from "@/projects/platform/eduon/components/console/console-ui";
import { AdminShell } from "@/projects/platform/eduon/components/admin/admin-shell";
import { NoAccess } from "@/projects/platform/eduon/components/admin/admin-ui";
import { CONTENT_TABS, ContentScreen } from "@/projects/platform/eduon/components/admin/content-screen";
import { BILLING_TABS, BillingScreen } from "@/projects/platform/eduon/components/admin/billing-screen";
import { SECURITY_TABS, SecurityScreen } from "@/projects/platform/eduon/components/admin/security-screen";

/*
 * EduOn 통합관리시스템 (/platform/eduon-admin).
 * ?screen=content|billing|security  첫 화면 (기본 content)
 * ?select=<id>   상세 패널 (강좌 id c01.., 구독 id SUB-.., 점검 항목 id SF-..)
 * ?tab=<key>     content: info|access|transcode|protect (패널 탭), billing: subs|events, security: roles|logs|verify
 * ?role=operator 콘텐츠 운영자 역할로 시작 (구독 운영, 보안 검증은 접근 불가)
 */

const TITLE: Record<AdminScreen, string> = { content: "콘텐츠 검수", billing: "구독 운영", security: "보안 검증" };
const PLACEHOLDER: Record<AdminScreen, string> = {
  content: "강좌, 강사, 제작사 검색",
  billing: "계정, 구독 ID, 이벤트 ID 검색",
  security: "수행자, 대상, 항목 검색",
};

const restricted = (s: AdminScreen) => s !== "content";

function blockedLog(screen: AdminScreen, n: number): AccessLogEntry {
  return {
    id: `AL-904${String(20 + n)}`,
    at: NOW,
    actor: "남궁현",
    actorRole: "콘텐츠 운영자",
    target: `${TITLE[screen]} 화면`,
    action: "조회",
    result: "차단",
  };
}

export function AdminApp() {
  return (
    <StoreProvider>
      <AdminInner />
    </StoreProvider>
  );
}

function AdminInner() {
  const params = useSearchParams();
  const initialScreen = pick(ADMIN_SCREENS, params.get("screen")) ?? "content";
  const initialRole: AdminRole = params.get("role") === "operator" ? "operator" : "super";
  const select = params.get("select");
  const tabParam = params.get("tab");

  const { courses, adminSubs, events, resetDemo } = useStore();
  const toast = useToast();
  const [screen, setScreen] = useState<AdminScreen>(initialScreen);
  const [role, setRoleState] = useState<AdminRole>(initialRole);
  const [query, setQuery] = useState("");
  const [extraLogs, setExtraLogs] = useState<AccessLogEntry[]>(() =>
    initialRole === "operator" && restricted(initialScreen) ? [blockedLog(initialScreen, 0)] : [],
  );
  const [requested, setRequested] = useState<AdminScreen[]>([]);
  /* URL의 select, tab은 첫 화면에만 적용한다 */
  const [firstScreen] = useState(initialScreen);

  const logBlocked = (s: AdminScreen) => setExtraLogs((list) => [blockedLog(s, list.length), ...list]);

  const navigate = (next: AdminScreen) => {
    if (next === screen) return;
    setScreen(next);
    setQuery("");
    if (role === "operator" && restricted(next)) logBlocked(next);
  };

  const setRole = (r: AdminRole) => {
    setRoleState(r);
    if (r === "operator" && restricted(screen)) logBlocked(screen);
    toast.show(r === "operator" ? "콘텐츠 운영자 역할로 전환했습니다" : "최고관리자 역할로 전환했습니다");
  };

  const blocked = role === "operator" && restricted(screen);
  const listed = courses.filter((c) => c.review !== "작성 중");

  const meta = blocked
    ? "접근 제한"
    : screen === "content"
      ? `검수 대기 ${listed.filter((c) => c.review === "검수 대기").length} | 보완 요청 ${listed.filter((c) => c.review === "보완 요청").length} | 사용자 노출 ${
          listed.filter((c) => c.review === "승인" && c.publish === "공개").length
        } | 전체 ${listed.length}`
      : screen === "billing"
        ? `구독 ${adminSubs.length} | 결제 이벤트 ${events.length}`
        : `이중 승인 대기 ${HIGH_RISK_REQUESTS.filter((r) => r.status === "이중 승인 대기").length} | 열린 점검 항목 ${
            SECURITY_FINDINGS.filter((f) => f.stage !== "종료").length
          } | 개발사 접근 사용 중 ${VENDOR_ACCESS.filter((v) => v.status === "사용 중").length}`;

  const first = screen === firstScreen;
  const sel = first ? select : null;
  const tab = first ? tabParam : null;
  const latestBlock = extraLogs.find((l) => l.target === `${TITLE[screen]} 화면`);

  return (
    <AdminShell
      screen={screen}
      onNavigate={navigate}
      role={role}
      onRole={setRole}
      title={TITLE[screen]}
      meta={meta}
      query={query}
      onQuery={setQuery}
      placeholder={PLACEHOLDER[screen]}
      onReset={() => {
        resetDemo();
        setExtraLogs([]);
        setRequested([]);
        toast.show("데모 데이터를 처음 상태로 되돌렸습니다");
      }}
    >
      {blocked ? (
        <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
          <NoAccess
            area={TITLE[screen]}
            log={latestBlock}
            requested={requested.includes(screen)}
            onRequest={() => {
              setRequested((r) => [...r, screen]);
              toast.show("권한 요청을 보냈습니다. 최고관리자 승인 후 열립니다.");
            }}
          />
        </div>
      ) : screen === "content" ? (
        <ContentScreen query={query} role={role} initialSelected={sel} initialTab={pick(CONTENT_TABS, tab)} notify={toast.show} />
      ) : screen === "billing" ? (
        <BillingScreen query={query} initialSelected={sel} initialTab={pick(BILLING_TABS, tab)} notify={toast.show} />
      ) : (
        <SecurityScreen query={query} initialSelected={sel} initialTab={pick(SECURITY_TABS, tab)} extraLogs={extraLogs} notify={toast.show} />
      )}
      {toast.node}
    </AdminShell>
  );
}
