"use client";

import type { ReactNode } from "react";
import {
  ChartPieSlice,
  MagnifyingGlass,
  Megaphone,
  SignOut,
  Storefront,
  UsersThree,
} from "@phosphor-icons/react";
import { Avatar } from "@/projects/commerce/baseballmarket/components/ui";
import { ADMIN_ME } from "@/projects/commerce/baseballmarket/lib/mock-data";
import {
  ADMIN_SECTIONS,
  sectionOf,
  viewLabel,
  type AdminSection,
  type AdminView,
} from "@/projects/commerce/baseballmarket/lib/navigation";

/* 셸 아키타입 C4 — 아이콘 레일 + 섹션 리스트 (3-column). ARCHETYPES.md 참조.

   왜 C1이 아닌가: projects/commerce/ 안에서 pawfit-admin과 snowpeak-admin이 이미 C1이고
   (같은 카테고리 중복 금지), 236px 레일 하나에 이 콘솔의 15개 뷰를 평면 나열하면
   스캔이 무너진다.
   왜 C3가 아닌가: C3의 수평 주내비는 상한이 5개라 2단계 IA를 담을 자리가 없다.

   이 셸에서 쓰지 않는 부품:
   - 236px 라벨 레일
   - 전폭 h-14 헤더 (헤더는 본문 컬럼 위에만 얹힌다)
   - fixed inset-0 z-50 lg:hidden + 264px 드로어 (모바일은 하단 아이콘 바로 접힌다)
   - max-w-[1400px]
   - 헤더 우측 시계 */

const SECTION_ICON: Record<AdminSection, typeof ChartPieSlice> = {
  dashboard: ChartPieSlice,
  listings: Storefront,
  members: UsersThree,
  community: Megaphone,
};

export function AdminShell({
  view,
  onNavigate,
  children,
}: {
  view: AdminView;
  onNavigate: (v: AdminView) => void;
  children: ReactNode;
}) {
  const section = sectionOf(view);

  return (
    <div className="baseballmarket flex min-h-dvh bg-[var(--bm-canvas)]">
      {/* 1열 — 64px 아이콘 전용 레일. 라벨 없음. */}
      <nav
        aria-label="주 메뉴"
        className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center border-r border-[var(--bm-hairline)] bg-[var(--bm-surface)] py-4 lg:flex"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--bm-ink)] text-[15px] font-semibold text-[var(--bm-on-ink)]"
        >
          B
        </span>

        <ul className="mt-6 flex flex-1 flex-col gap-1.5">
          {ADMIN_SECTIONS.map((s) => {
            const Icon = SECTION_ICON[s.key];
            const on = s.key === section.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(s.views[0].key)}
                  title={s.label}
                  aria-label={s.label}
                  aria-current={on ? "page" : undefined}
                  className={`bm-swap flex h-11 w-11 items-center justify-center rounded-[8px] ${
                    on
                      ? "bg-[var(--bm-surface-strong)] text-[var(--bm-ink)]"
                      : "text-[var(--bm-muted)] bm-press"
                  }`}
                >
                  <Icon size={20} weight={on ? "fill" : "regular"} />
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label="로그아웃"
          title="로그아웃"
          className="bm-press flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--bm-muted)]"
        >
          <SignOut size={19} />
        </button>
      </nav>

      {/* 2열 — 섹션 리스트. 하위 뷰 + 섹션 고유 요약 블록. */}
      <div className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-[var(--bm-hairline)] bg-[var(--bm-surface)] lg:flex">
        <div className="px-5 pb-4 pt-5">
          <p className="text-[12px] font-semibold uppercase leading-[17px] tracking-[0.12em] text-[var(--bm-muted)]">
            섹션
          </p>
          <h2 className="mt-1.5 text-[17px] font-semibold leading-[24px] text-[var(--bm-ink)]">
            {section.label}
          </h2>
        </div>

        <ul className="flex-1 space-y-0.5 px-3">
          {section.views.map((v) => {
            const on = v.key === view;
            return (
              <li key={v.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(v.key)}
                  aria-current={on ? "page" : undefined}
                  className={`bm-swap w-full rounded-[6px] px-3 py-2 text-left text-[13.5px] leading-[20px] ${
                    on
                      ? "bg-[var(--bm-canvas)] font-semibold text-[var(--bm-ink)]"
                      : "font-medium text-[var(--bm-muted)] bm-press"
                  }`}
                >
                  {v.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* 섹션 고유 요약. C4가 "C1 레일을 둘로 쪼갠 것"으로 퇴화하지 않게 하는 장치다. */}
        <div className="px-3 pb-3">
          <div className="rounded-[8px] bg-[var(--bm-canvas)] p-4">
            <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">
              {section.summary.label}
            </p>
            <p
              className="bm-num mt-1 text-[20px] font-medium leading-[26px]"
              style={{
                color:
                  section.summary.tone === "danger"
                    ? "var(--bm-error)"
                    : section.summary.tone === "warn"
                      ? "var(--bm-warning-deep)"
                      : "var(--bm-ink)",
              }}
            >
              {section.summary.value}
            </p>
          </div>
        </div>
      </div>

      {/* 3열 — 헤더 + 본문. 헤더는 이 컬럼 위에만 얹힌다. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-[var(--bm-hairline)] bg-[var(--bm-canvas)] px-5 lg:px-8">
          <h1 className="shrink-0 text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
            {viewLabel(view)}
          </h1>

          <div className="ml-auto hidden w-[280px] items-center gap-2 rounded-[6px] bg-[var(--bm-surface-card)] px-3 py-2 md:flex">
            <MagnifyingGlass size={15} className="shrink-0 text-[var(--bm-muted)]" />
            <span className="truncate text-[13px] text-[var(--bm-muted)]">
              매물, 회원, 신고 통합 검색
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2.5 md:ml-0">
            <Avatar name={ADMIN_ME.name} size={30} />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[13px] font-semibold leading-[18px] text-[var(--bm-ink)]">
                {ADMIN_ME.name}
              </p>
              <p className="truncate text-[11px] leading-[15px] text-[var(--bm-muted)]">
                {ADMIN_ME.role}
              </p>
            </div>
          </div>
        </header>

        {/* 모바일 — 섹션 리스트가 가로스크롤 세그먼트로 접힌다. 드로어 없음. */}
        <div className="border-b border-[var(--bm-hairline)] bg-[var(--bm-surface)] lg:hidden">
          <div className="bm-noscroll flex gap-1.5 overflow-x-auto px-5 py-2.5">
            {section.views.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => onNavigate(v.key)}
                className={`bm-swap shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                  v.key === view
                    ? "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
                    : "bg-[var(--bm-canvas)] text-[var(--bm-muted)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 px-5 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>

      {/* 모바일 — 레일이 하단 아이콘 바로 내려온다 */}
      <nav
        aria-label="주 메뉴"
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[var(--bm-hairline)] bg-[var(--bm-surface)] lg:hidden"
      >
        {ADMIN_SECTIONS.map((s) => {
          const Icon = SECTION_ICON[s.key];
          const on = s.key === section.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onNavigate(s.views[0].key)}
              aria-label={s.label}
              aria-current={on ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
              style={{ color: on ? "var(--bm-ink)" : "var(--bm-muted)" }}
            >
              <Icon size={19} weight={on ? "fill" : "regular"} />
              <span className="text-[11px] font-medium leading-[15px]">{s.label.split(" / ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
