"use client";

/* CIVICPIN 운영 콘솔 루트. /youngin/real-admin 이 이 컴포넌트만 렌더링한다.
   사용자 앱과 주소도 계정도 분리돼 있어 사용자 화면에는 이 콘솔로 가는 링크가 없다.
   로그인은 목업이다 — 실제 인증, 세션, 권한 검사는 spec.md 2절 Non-goals 로 빠져 있다. */

import { useState } from "react";
import { Lock, ShieldCheck, SignIn } from "@phosphor-icons/react";
import "@/projects/youngin/real/styles/civicpin.css";
import { Emblem } from "@/projects/youngin/real/components/emblem";
import { AdminShell } from "@/projects/youngin/real/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/youngin/real/components/admin/screens/dashboard-screen";
import { DataScreen } from "@/projects/youngin/real/components/admin/screens/data-screen";
import { ReportsScreen } from "@/projects/youngin/real/components/admin/screens/reports-screen";
import { ADMIN_SUMMARY } from "@/projects/youngin/real/lib/mock-data";
import type { AdminScreen } from "@/projects/youngin/real/lib/navigation";

const ROLES = [
  { id: "ops", name: "정하윤", team: "운영팀", role: "데이터 관리자" },
  { id: "data", name: "남기헌", team: "데이터팀", role: "공공데이터 담당" },
  { id: "content", name: "서지완", team: "콘텐츠팀", role: "축제, 배너 담당" },
];

export function AdminApp() {
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState(ROLES[0].id);
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  if (!signedIn) {
    return (
      <main className="civicpin flex min-h-dvh items-center justify-center bg-[var(--cp-canvas)] px-5 py-12">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2.5">
            <Emblem size={30} />
            <div>
              <p className="text-[17px] font-bold tracking-[-0.03em] text-[var(--cp-ink)]">
                CIVICPIN
              </p>
              <p className="cp-num text-[11px] uppercase tracking-[0.1em] text-[var(--cp-mute)]">
                Operator Console
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[8px] border border-[var(--cp-hairline)] bg-[var(--cp-surface)] p-6">
            <h1 className="text-[20px] font-bold tracking-[-0.03em] text-[var(--cp-ink)]">
              운영자 로그인
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--cp-body)]">
              시설, 상점, 축제 데이터와 사용자 오류 신고를 관리합니다. 사용자 앱과 계정 체계가
              분리되어 있습니다.
            </p>

            <fieldset className="mt-5">
              <legend className="text-[13px] font-medium text-[var(--cp-ink)]">계정 선택</legend>
              <div className="mt-2 space-y-2">
                {ROLES.map((r) => {
                  const active = r.id === role;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-[6px] border px-3.5 py-3 text-left transition-colors ${
                        active
                          ? "border-[var(--cp-accent)] bg-[var(--cp-accent-soft)]"
                          : "border-[var(--cp-hairline)] bg-[var(--cp-surface)] hover:bg-[var(--cp-soft)]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-medium ${
                          active
                            ? "bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
                            : "bg-[var(--cp-sunken)] text-[var(--cp-body)]"
                        }`}
                      >
                        {r.name.slice(1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium text-[var(--cp-ink)]">
                          {r.name}
                        </span>
                        <span className="block text-[12px] text-[var(--cp-mute)]">
                          {r.team} | {r.role}
                        </span>
                      </span>
                      {active && (
                        <ShieldCheck
                          size={16}
                          weight="fill"
                          className="shrink-0 text-[var(--cp-accent)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => setSignedIn(true)}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--cp-accent)] text-[14.5px] font-medium text-[var(--cp-on-accent)] transition-colors hover:bg-[var(--cp-accent-strong)]"
            >
              <SignIn size={15} weight="bold" />
              콘솔 열기
            </button>

            <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-[18px] text-[var(--cp-mute)]">
              <Lock size={13} weight="fill" className="mt-[2px] shrink-0" />
              포트폴리오 목업입니다. 실제 인증과 권한 검사는 구현하지 않았고, 화면에 보이는
              데이터는 모두 가상 값입니다.
            </p>
          </div>

          <p className="cp-num mt-4 text-center text-[11.5px] text-[var(--cp-faint)]">
            공공데이터 기준일 {ADMIN_SUMMARY.baseDate} / 마지막 대조 {ADMIN_SUMMARY.syncedAt}
          </p>
        </div>
      </main>
    );
  }

  return (
    <AdminShell screen={screen} onNavigate={setScreen} onSignOut={() => setSignedIn(false)}>
      {screen === "dashboard" && <DashboardScreen onNavigate={setScreen} />}
      {screen === "data" && <DataScreen />}
      {screen === "reports" && <ReportsScreen />}
    </AdminShell>
  );
}
