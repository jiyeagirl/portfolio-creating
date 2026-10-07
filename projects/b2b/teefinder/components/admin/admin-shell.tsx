"use client";

import type { ReactNode } from "react";
import { Golf, GearSix, Pulse, PaperPlaneTilt, UserPlus, UsersThree } from "@phosphor-icons/react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import type { AdminScreenName } from "@/projects/b2b/teefinder/lib/navigation";

const NAV: Array<{ id: AdminScreenName; label: string; Icon: typeof UserPlus }> = [
  { id: "approvals", label: "가입 승인", Icon: UserPlus },
  { id: "members", label: "회원 관리", Icon: UsersThree },
  { id: "course-config", label: "골프장 설정", Icon: GearSix },
  { id: "monitoring", label: "수집 모니터링", Icon: Pulse },
  { id: "push", label: "푸시 발송", Icon: PaperPlaneTilt },
];

/* C2 라이트 워크벤치: 밝은 248px 레일, 56px 헤더, 풀블리드 본문. lg 미만에서는 레일 대신 가로 세그먼트. */
export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreenName;
  onNavigate: (s: AdminScreenName) => void;
  children: ReactNode;
}) {
  const { members } = useStore();
  const pending = members.filter((m) => m.status === "승인 대기").length;

  return (
    <div className="teefinder flex min-h-dvh bg-[var(--tf-canvas)] text-[var(--tf-ink)]">
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-[var(--tf-line)] bg-[var(--tf-rail)] lg:flex">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--tf-brand)] text-white">
            <Golf size={16} weight="fill" />
          </span>
          <span className="text-[15px] font-bold tracking-[-0.02em]">TeeFinder</span>
        </div>
        <nav aria-label="관리자 메뉴" className="flex flex-col gap-0.5 px-3 pt-2">
          {NAV.map(({ id, label, Icon }) => {
            const active = screen === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center gap-3 rounded-[6px] px-3 text-[13.5px] transition-colors ${
                  active
                    ? "bg-[var(--tf-surface)] font-semibold shadow-[0_1px_2px_rgba(24,35,29,0.06)]"
                    : "font-medium text-[var(--tf-ink-2)] hover:bg-[var(--tf-soft)]"
                }`}
              >
                <Icon size={18} weight={active ? "fill" : "regular"} />
                <span className="flex-1 text-left">{label}</span>
                {id === "approvals" && pending > 0 && (
                  <span className="rounded-[4px] bg-[var(--tf-orange-bg)] px-1.5 text-[12px] font-semibold tabular-nums text-[var(--tf-orange-fg)]">
                    {pending}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--tf-line)] bg-[var(--tf-canvas)] px-5 lg:px-8">
          <p className="text-[13.5px] font-medium">A회원권 운영</p>
          <p className="text-[13px] text-[var(--tf-ink-3)]">운영팀 계정</p>
        </header>

        <nav
          aria-label="관리자 메뉴"
          className="tf-scroll-x flex gap-1 overflow-x-auto border-b border-[var(--tf-line)] bg-[var(--tf-rail)] px-3 py-2 lg:hidden"
        >
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={screen === id ? "page" : undefined}
              className={`h-9 shrink-0 rounded-[6px] px-3 text-[13px] ${
                screen === id ? "bg-[var(--tf-surface)] font-semibold" : "font-medium text-[var(--tf-ink-2)]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <main key={screen} className="tf-enter min-w-0 flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
