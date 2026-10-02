"use client";

import { useState } from "react";
import {
  Buildings,
  CalendarCheck,
  ChartBar,
  ChatsCircle,
  Gauge,
  IdentificationBadge,
  MagnifyingGlass,
  SignOut,
  Users,
} from "@phosphor-icons/react";
import "@/projects/community/linkon/styles/linkon.css";
import { CERT_REQUESTS } from "@/projects/community/linkon/lib/mock-data";
import {
  AdminDashboard,
  AdminStats,
} from "@/projects/community/linkon-admin/components/admin-overview";
import {
  AdminCerts,
  AdminMembers,
} from "@/projects/community/linkon-admin/components/admin-members";
import {
  AdminCommunity,
  AdminEvents,
  AdminNetwork,
} from "@/projects/community/linkon-admin/components/admin-operations";

type AdminTab = "dashboard" | "members" | "certs" | "events" | "network" | "community" | "stats";

const TABS: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "대시보드", icon: Gauge },
  { key: "members", label: "회원·기업 관리", icon: Users },
  { key: "certs", label: "인증 서류 관리", icon: IdentificationBadge },
  { key: "events", label: "행사·프로그램", icon: CalendarCheck },
  { key: "network", label: "기업 네트워크", icon: Buildings },
  { key: "community", label: "커뮤니티 관리", icon: ChatsCircle },
  { key: "stats", label: "운영 통계", icon: ChartBar },
];

const TAB_DESCRIPTION: Record<AdminTab, string> = {
  dashboard: "회원 승인, 인증 심사, 커뮤니티 활동 현황을 한눈에 확인합니다.",
  members: "회원 계정을 검색하고 승인, 권한 변경, 비활성화를 처리합니다.",
  certs: "제출된 사업자등록증과 선정 증빙을 확인해 인증 여부를 결정합니다.",
  events: "행사와 장기 프로그램의 일정, 정원, 신청자를 관리합니다.",
  network: "기업 간 협업 요청 진행 상태와 매칭 현황을 추적합니다.",
  community: "게시글과 댓글을 관리하고 접수된 신고를 처리합니다.",
  stats: "활성 사용자, 산업 분야별 가입, 인기 콘텐츠 지표를 확인합니다.",
};

export default function LinkOnAdmin() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const pending = CERT_REQUESTS.filter((c) => c.status === "심사대기").length;

  return (
    <div className="linkon flex min-h-dvh flex-col bg-[var(--lk-bg)] text-[var(--lk-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--lk-border)] bg-[var(--lk-elevated)]">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-4 px-6 lg:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--lk-ink)] text-[15px] font-extrabold text-[var(--lk-bg)]">
              L
            </span>
            <span className="text-[17px] font-bold tracking-tight">
              LinkON
              <span className="ml-1.5 rounded-full bg-[var(--lk-surface)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--lk-muted)]">
                운영 콘솔
              </span>
            </span>
          </div>

          <div className="ml-6 hidden min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3.5 py-2 md:flex lg:max-w-[320px]">
            <MagnifyingGlass size={15} className="shrink-0 text-[var(--lk-muted)]" />
            <input
              placeholder="기업명, 담당자, 게시글 검색"
              aria-label="관리자 통합 검색"
              className="w-full bg-transparent text-[13px] text-[var(--lk-ink)] outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-bold leading-tight text-[var(--lk-ink)]">
                나인창업지원재단
              </span>
              <span className="block text-[11.5px] leading-tight text-[var(--lk-muted)]">
                심유라 기관 운영자
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lk-surface)] text-[13px] font-bold text-[var(--lk-ink)]">
              심
            </span>
            <button
              aria-label="로그아웃"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--lk-muted)] transition-colors hover:bg-[var(--lk-surface)] hover:text-[var(--lk-ink)]"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-6 py-8 lg:flex-row lg:px-10">
        <nav className="lg:sticky lg:top-[88px] lg:h-fit lg:w-[228px] lg:shrink-0">
          <ul className="lk-scroll-x flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((item) => (
              <li key={item.key} className="shrink-0">
                <button
                  onClick={() => setTab(item.key)}
                  className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors lg:rounded-xl ${
                    tab === item.key
                      ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                      : "border border-[var(--lk-border)] bg-[var(--lk-elevated)] text-[var(--lk-muted)] hover:text-[var(--lk-ink)] lg:border-transparent lg:bg-transparent"
                  }`}
                >
                  <item.icon size={16} weight={tab === item.key ? "fill" : "regular"} />
                  {item.label}
                  {item.key === "certs" && pending > 0 && (
                    <span
                      className={`lk-num ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        tab === item.key
                          ? "bg-[var(--lk-accent-fg)]/20 text-[var(--lk-accent-fg)]"
                          : "bg-[var(--lk-warning-soft)] text-[var(--lk-warning)]"
                      }`}
                    >
                      {pending}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <header className="mb-7">
            <h1 className="text-[26px] font-bold tracking-tight text-[var(--lk-ink)]">
              {TABS.find((item) => item.key === tab)!.label}
            </h1>
            <p className="mt-2 text-[14px] text-[var(--lk-muted)]">{TAB_DESCRIPTION[tab]}</p>
          </header>

          {tab === "dashboard" && <AdminDashboard onOpenCerts={() => setTab("certs")} />}
          {tab === "members" && <AdminMembers />}
          {tab === "certs" && <AdminCerts />}
          {tab === "events" && <AdminEvents />}
          {tab === "network" && <AdminNetwork />}
          {tab === "community" && <AdminCommunity />}
          {tab === "stats" && <AdminStats />}
        </main>
      </div>
    </div>
  );
}
