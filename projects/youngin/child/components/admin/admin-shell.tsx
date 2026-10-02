"use client";

import { useState } from "react";
import {
  Buildings,
  ChartBar,
  Flag,
  List,
  MagnifyingGlass,
  Megaphone,
  SquaresFour,
  Tree,
  X,
} from "@phosphor-icons/react";

/** 이번 목업에서는 대시보드 한 화면만 구현한다. 나머지 항목은 IA를 보여주는
 *  내비게이션 라벨로만 두고 이동시키지 않는다(빈 화면이나 "준비 중"을 만들지 않는다). */
const NAV = [
  { key: "dashboard", label: "대시보드", icon: SquaresFour },
  { key: "banners", label: "복지 배너", icon: Megaphone },
  { key: "missions", label: "시즌 미션", icon: Flag },
  { key: "facilities", label: "시설 관리", icon: Buildings },
  { key: "stats", label: "이용 통계", icon: ChartBar },
] as const;

const PENDING = [
  { label: "배너 승인 대기", count: 2 },
  { label: "시설 정보 확인", count: 3 },
  { label: "QR 재발급 요청", count: 1 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <ul className="space-y-px">
      {NAV.map((item) => {
        const active = item.key === "dashboard";
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[13.5px] transition-colors ${
                active
                  ? "bg-[var(--yc-rail-soft)] font-medium text-white"
                  : "text-[var(--yc-rail-mute)] hover:bg-[var(--yc-rail-soft)] hover:text-white"
              }`}
            >
              <item.icon size={15} weight={active ? "fill" : "bold"} />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const sideFoot = (
    <div className="mt-8 rounded-[8px] yc-b-rail border bg-[var(--yc-rail-soft)] p-4">
      <p className="text-[12.5px] font-medium text-white">확인이 필요한 항목</p>
      <ul className="mt-2.5 space-y-1.5">
        {PENDING.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-[12px]">
            <span className="text-[var(--yc-rail-mute)]">{item.label}</span>
            <span className="yc-num font-medium text-white">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const brand = (size: number) => (
    <span className="flex items-center gap-2">
      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-[var(--yc-accent)] text-white">
        <Tree size={size} weight="fill" />
      </span>
      <span>
        <span className="block text-[14px] font-semibold leading-4 tracking-[-0.03em] text-white">
          용인 아이놀이터
        </span>
        <span className="block text-[10.5px] uppercase tracking-[0.12em] text-[var(--yc-rail-mute)]">
          Admin Console
        </span>
      </span>
    </span>
  );

  return (
    <div className="yongin-child flex min-h-dvh bg-[var(--yc-canvas)]">
      {/* 데스크탑 사이드바 */}
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[var(--yc-rail)] px-3 py-5 lg:flex">
        <div className="px-3 pb-6">{brand(15)}</div>
        {nav}
        {sideFoot}
        <div className="yc-b-rail mt-auto flex items-center gap-2.5 border-t px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--yc-rail-soft)] text-[12px] font-medium text-white">
            민서
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-white">정민서</p>
            <p className="truncate text-[11px] text-[var(--yc-rail-mute)]">
              아동청소년과 | 배너 운영
            </p>
          </div>
        </div>
      </aside>

      {/* 모바일 사이드바 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(28,32,28,0.5)]"
          />
          <div className="yc-enter relative h-full w-[264px] overflow-y-auto bg-[var(--yc-rail)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              {brand(14)}
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="yc-b-rail flex h-8 w-8 items-center justify-center rounded-[6px] border text-white"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
            {sideFoot}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--yc-hairline)] bg-[var(--yc-surface)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--yc-hairline)] text-[var(--yc-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--yc-ink)]">대시보드</p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yc-mute)]"
            />
            <input
              placeholder="시설, 배너, 담당 부서 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--yc-hairline)] bg-[var(--yc-canvas)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--yc-mute)] focus:border-[var(--yc-hairline-strong)] focus:bg-[var(--yc-surface)]"
            />
          </div>

          <span className="yc-num ml-auto shrink-0 text-[12px] text-[var(--yc-mute)] md:ml-0">
            2026. 08. 07 10:15 KST
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
