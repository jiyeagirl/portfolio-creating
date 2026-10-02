"use client";

import {
  FileMagnifyingGlass,
  Flag,
  MagnifyingGlass,
  MapPinLine,
  Megaphone,
  SquaresFour,
  Users,
} from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/community/waypoint/lib/navigation";
import { REPORTS } from "@/projects/community/waypoint/lib/mock-data";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  members: Users,
  posts: FileMagnifyingGlass,
  reports: Flag,
  ops: Megaphone,
};

/**
 * 관리자 백오피스 셸 — **아키타입 C3(상단 커맨드 바)**. `ARCHETYPES.md` 참조.
 *
 * 이 콘솔의 하루는 신고 처리와 게시글 검수로 끝난다. 네비게이션보다 처리(triage)가
 * 압도적인 워크로드라, 상시 236px 다크 레일은 낭비된 픽셀이다. 워크스페이스의 다른
 * 관리자 콘솔 10개가 전부 C1(다크 레일)이므로 여기서 갈라 둔다.
 *
 * C1과 다른 점:
 * - 사이드바 없음. 56px 상단 바에 브랜드 + 수평 주내비(5개) + 전역 검색.
 * - 모바일에서 상단 내비가 가로스크롤 세그먼트로 접힌다 — **드로어 자체가 없다.**
 *   264px 드로어와 햄버거 버튼, `menuOpen` state가 전부 사라졌다.
 * - 본문 `max-w-[1120px]` 좁은 단일 컬럼. C1의 `max-w-[1400px]`보다 좁은 이유는
 *   triage 화면이 한 건씩 읽는 화면이라 행 길이가 짧아야 하기 때문이다.
 * - 헤더 우측 시계를 두지 않는다. 대신 **처리 대기 건수**를 둔다 — 이 콘솔에서
 *   실제로 상시 확인해야 하는 값이다.
 */
export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (next: AdminScreen) => void;
  children: React.ReactNode;
}) {
  const pending = REPORTS.filter((r) => r.status !== "완료").length;

  return (
    <div className="waypoint flex min-h-dvh flex-col bg-[var(--wp-canvas)]">
      <header className="sticky top-0 z-30 border-b border-[var(--wp-border)] bg-[var(--wp-surface)]">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-3 px-4 lg:px-6">
          <span className="flex shrink-0 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--wp-accent)] text-white">
              <MapPinLine size={15} weight="fill" />
            </span>
            <span className="hidden text-[14px] font-semibold tracking-[-0.02em] text-[var(--wp-ink)] sm:block">
              Waypoint
            </span>
          </span>

          {/* 수평 주내비 — md 이상에서만 헤더에 붙고, 그 아래에서는 두 번째 줄로 접힌다. */}
          <nav className="ml-2 hidden md:block">
            <ul className="flex items-center gap-0.5">
              {ADMIN_NAV.map((item) => (
                <li key={item.key}>
                  <NavButton
                    label={item.label}
                    icon={NAV_ICON[item.key]}
                    active={item.key === screen}
                    onClick={() => onNavigate(item.key)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative ml-auto hidden w-[240px] lg:block">
            <MagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--wp-muted)]"
            />
            <input
              placeholder="회원, 게시글, 신고 번호 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--wp-border)] bg-[var(--wp-surface-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--wp-muted)] focus:border-[var(--wp-border-strong)] focus:bg-[var(--wp-surface)]"
            />
          </div>

          {/* C1의 헤더 시계 자리. 이 콘솔에서 상시 봐야 하는 값은 시각이 아니라 대기 건수다. */}
          <span className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <span className="hidden items-center gap-1.5 rounded-full bg-[var(--wp-danger-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--wp-danger)] sm:inline-flex">
              <span className="h-[5px] w-[5px] rounded-full bg-current" aria-hidden />
              처리 대기 {pending}건
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--wp-surface-soft)] text-[11.5px] font-semibold text-[var(--wp-body)]">
              운
            </span>
          </span>
        </div>

        {/* 모바일 — 드로어 대신 가로스크롤 세그먼트. 이 콘솔에는 드로어가 없다. */}
        <div className="border-t border-[var(--wp-border)] md:hidden">
          <div className="flex gap-0.5 overflow-x-auto px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ADMIN_NAV.map((item) => (
              <NavButton
                key={item.key}
                label={item.label}
                icon={NAV_ICON[item.key]}
                active={item.key === screen}
                onClick={() => onNavigate(item.key)}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </main>
    </div>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "bg-[var(--wp-surface-soft)] font-semibold text-[var(--wp-ink)]"
          : "text-[var(--wp-muted)] hover:bg-[var(--wp-surface-soft)] hover:text-[var(--wp-body)]"
      }`}
    >
      <Icon size={14} weight={active ? "fill" : "bold"} />
      {label}
    </button>
  );
}
