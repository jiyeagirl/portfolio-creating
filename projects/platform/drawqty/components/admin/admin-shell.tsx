"use client";

import { Files, ListChecks } from "@phosphor-icons/react";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import type { AdminScreenName } from "@/projects/platform/drawqty/lib/navigation";

const NAV: Array<{ key: AdminScreenName; label: string; Icon: typeof ListChecks }> = [
  { key: "quotes", label: "견적 요청", Icon: ListChecks },
  { key: "drawings", label: "업로드 도면", Icon: Files },
];

/**
 * 관리자 셸, 아키타입 C2(워크벤치). 좌측 사이드바가 항상 있다 (사용자 지정).
 * 업체 한 곳(단일 테넌트)이 접수 건을 처리하는 콘솔이라 IA는 두 개이고 본문은 풀블리드다.
 * 색은 사이드바 면만 브랜드 짙은 색이고 본문은 흰색이다. lg 미만에서는 사이드바가
 * 상단 짙은 띠로 접히고 메뉴는 가로 탭이 된다(드로어 없음).
 */
export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreenName;
  onNavigate: (next: AdminScreenName) => void;
  children: React.ReactNode;
}) {
  const { quotes } = useStore();
  const fresh = quotes.filter((q) => q.status === "신규").length;

  const items = (layout: "side" | "top") =>
    NAV.map(({ key, label, Icon }) => {
      const active = key === screen;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onNavigate(key)}
          aria-current={active ? "page" : undefined}
          className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[6px] px-3 text-[13px] transition-colors ${
            layout === "side" ? "h-10 w-full" : "h-9"
          } ${
            active
              ? "bg-[var(--dq-bar-active)] font-semibold text-white"
              : "font-medium text-[var(--dq-bar-ink-2)] hover:bg-[var(--dq-bar-hover)] hover:text-white"
          }`}
        >
          <Icon size={18} weight={active ? "fill" : "regular"} />
          {label}
          {key === "quotes" && fresh > 0 && (
            <span
              className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--dq-blue)] px-1.5 text-[11px] font-semibold text-white ${
                layout === "side" ? "ml-auto" : ""
              }`}
            >
              {fresh}
            </span>
          )}
        </button>
      );
    });

  const brand = (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--dq-bar-active)] text-[13px] font-bold text-white">
        DQ
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-semibold tracking-[-0.01em] text-white">DrawQty 관리</span>
        <span className="block text-[12px] text-[var(--dq-bar-ink-2)]">한결시스템</span>
      </span>
    </span>
  );

  return (
    <div className="drawqty dq-admin min-h-dvh bg-[var(--dq-surface)] text-[var(--dq-ink)] lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col bg-[var(--dq-bar)] lg:flex">
        <div className="flex h-16 items-center border-b border-[var(--dq-bar-line)] px-4">{brand}</div>
        <nav aria-label="관리자 메뉴" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {items("side")}
        </nav>
        <div className="flex items-center gap-2.5 border-t border-[var(--dq-bar-line)] px-4 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dq-bar-hover)] text-[12px] font-semibold text-[var(--dq-bar-ink)]">
            운
          </span>
          <span className="text-[13px] text-[var(--dq-bar-ink-2)]">운영자</span>
        </div>
      </aside>

      <header className="sticky top-0 z-30 bg-[var(--dq-bar)] lg:hidden">
        <div className="flex h-14 items-center px-4 sm:px-6">{brand}</div>
        <nav aria-label="관리자 메뉴" className="flex gap-1 border-t border-[var(--dq-bar-line)] px-3 py-1.5">
          {items("top")}
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
