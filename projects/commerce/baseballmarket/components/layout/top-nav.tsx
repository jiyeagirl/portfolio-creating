"use client";

import { useState } from "react";
import { Bell, List, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { TeamMark } from "@/projects/commerce/baseballmarket/components/ui";
import { ME, teamLabel } from "@/projects/commerce/baseballmarket/lib/mock-data";
import { TOP_NAV, type UserView } from "@/projects/commerce/baseballmarket/lib/navigation";

/* vercel_compact이 규정한 사이트 셸의 상단 내비 — 64px, 캔버스 배경, border-b.

   스킬(high-end-visual-design)은 "떠 있는 글래스 필 내비 + backdrop-blur-3xl 오버레이"를
   요구하지만 vercel이 nav-bar를 canvas 배경 64px로 규정했고 Precedence상 디자인 시스템이
   이긴다. 모바일 메뉴도 글래스가 아니라 불투명 패널이다.
   내비 버튼은 6px radius다 — 마케팅 pill CTA와 한 화면에서 섞지 않는다(vercel 규칙). */

export function TopNav({
  view,
  onNavigate,
  onSell,
}: {
  view: UserView;
  onNavigate: (v: UserView) => void;
  onSell: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--bm-hairline)] bg-[var(--bm-canvas)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-5 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex shrink-0 items-center gap-2"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--bm-ink)] text-[15px] font-semibold text-[var(--bm-on-ink)]"
          >
            B
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--bm-ink)]">
            베이스볼마켓
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {TOP_NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`bm-swap rounded-[6px] px-3 py-2 text-[14px] font-medium leading-[20px] ${
                view === item.key
                  ? "bg-[var(--bm-surface-card)] text-[var(--bm-ink)]"
                  : "text-[var(--bm-muted)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("browse")}
            aria-label="통합 검색"
            className="bm-press hidden h-10 w-10 items-center justify-center rounded-full text-[var(--bm-body)] sm:flex"
          >
            <MagnifyingGlass size={18} />
          </button>
          <button
            type="button"
            aria-label="알림"
            className="bm-press relative hidden h-10 w-10 items-center justify-center rounded-full text-[var(--bm-body)] sm:flex"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--bm-error)]" />
          </button>

          <button
            type="button"
            onClick={onSell}
            className="bm-press-ink hidden h-10 items-center gap-1.5 rounded-[8px] bg-[var(--bm-ink)] px-4 text-[14px] font-semibold text-[var(--bm-on-ink)] sm:inline-flex"
          >
            <Plus size={15} weight="bold" />
            판매하기
          </button>

          <button
            type="button"
            onClick={() => onNavigate("mypage")}
            aria-label="마이페이지"
            className="hidden sm:block"
          >
            <TeamMark id={ME.team} size={36} accent />
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            className="bm-press flex h-10 w-10 items-center justify-center rounded-full text-[var(--bm-body)] md:hidden"
          >
            {open ? <X size={19} /> : <List size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--bm-hairline)] bg-[var(--bm-surface)] md:hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-4">
            <div className="mb-3 flex items-center gap-2.5">
              <TeamMark id={ME.team} size={36} accent />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                  {ME.nickname}
                </p>
                <p className="truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
                  {teamLabel(ME.team)} 팬
                </p>
              </div>
            </div>
            <nav className="grid gap-1">
              {TOP_NAV.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onNavigate(item.key);
                    setOpen(false);
                  }}
                  className="bm-press rounded-[6px] px-3 py-2.5 text-left text-[15px] font-medium text-[var(--bm-body-strong)]"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onSell();
                  setOpen(false);
                }}
                className="bm-press-ink mt-2 rounded-[6px] bg-[var(--bm-ink)] px-3 py-2.5 text-left text-[15px] font-semibold text-[var(--bm-on-ink)]"
              >
                판매하기
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
