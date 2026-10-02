"use client";

/*
 * 셸 C4: 64px 아이콘 레일 + 232px 섹션 리스트 + 본문 (ARCHETYPES.md, design.md "셸 레이아웃").
 * 헤더 60px는 본문 열 위에만 얹힌다. lg 미만은 하단 아이콘 바(불투명) + 가로 세그먼트, 드로어 없음.
 * 쓰지 않는 부품: 236px 라벨 레일, 전폭 h-14 헤더, 264px 드로어, 헤더 시계, backdrop-blur.
 */

import type { ReactNode } from "react";
import { Bell, CaretDown, CoatHanger, Gear, MagnifyingGlass, Moped, SquaresFour, Users } from "@phosphor-icons/react";
import {
  DELAYED,
  INSPECTION_PENDING,
  MONTH_REVENUE_TO_DATE,
  NOW,
  OPERATOR,
  RESERVATIONS,
  TODAY_JOBS,
  UNASSIGNED,
  UNITS,
  AUGUST_TO_18,
  CUSTOMERS,
} from "@/projects/platform/dressday/lib/admin-data";
import { num } from "@/projects/platform/dressday/lib/catalog";
import { Avatar } from "@/projects/platform/dressday/components/admin/admin-ui";

export const ADMIN_SCREENS = [
  "dashboard",
  "reservations",
  "dispatch",
  "riders",
  "products",
  "inventory",
  "inspection",
  "customers",
  "settlement",
] as const;
export type AdminScreen = (typeof ADMIN_SCREENS)[number];

/** 화면 이동. query는 슬라이드오버 같은 내부 상태 (예: { detail: "DD-0918-2471" }) */
export type Go = (screen: AdminScreen, query?: Record<string, string>) => void;

type SectionKey = "ops" | "delivery" | "goods" | "people";

interface Section {
  key: SectionKey;
  label: string;
  icon: typeof SquaresFour;
  views: { key: AdminScreen; label: string; count?: number }[];
}

const pct = (a: number, b: number) => `${a >= b ? "+" : "−"}${Math.abs(((a - b) / b) * 100).toFixed(1)}%`;

export const SECTIONS: Section[] = [
  {
    key: "ops",
    label: "운영",
    icon: SquaresFour,
    views: [
      { key: "dashboard", label: "관리자 대시보드" },
      { key: "reservations", label: "예약 관리", count: RESERVATIONS.length },
    ],
  },
  {
    key: "delivery",
    label: "배송",
    icon: Moped,
    views: [
      { key: "dispatch", label: "배송 및 회수 관리", count: TODAY_JOBS.length },
      { key: "riders", label: "라이더 관리" },
    ],
  },
  {
    key: "goods",
    label: "상품",
    icon: CoatHanger,
    views: [
      { key: "products", label: "상품 관리" },
      { key: "inventory", label: "재고 관리", count: UNITS.length },
      { key: "inspection", label: "반납 및 검수 관리", count: INSPECTION_PENDING.length },
    ],
  },
  {
    key: "people",
    label: "고객 / 정산",
    icon: Users,
    views: [
      { key: "customers", label: "고객 관리", count: CUSTOMERS.length },
      { key: "settlement", label: "정산 및 통계" },
    ],
  },
];

export function sectionOf(screen: AdminScreen) {
  return SECTIONS.find((s) => s.views.some((v) => v.key === screen)) ?? SECTIONS[0];
}

export function viewLabel(screen: AdminScreen) {
  return sectionOf(screen).views.find((v) => v.key === screen)?.label ?? "";
}

/** 섹션 리스트 칸 아래의 섹션 고유 요약 */
function SectionSummary({ section, onNavigate }: { section: SectionKey; onNavigate: (s: AdminScreen) => void }) {
  let label = "";
  let value = "";
  let sub: ReactNode = null;
  let action: { label: string; to: AdminScreen } | null = null;
  let alert = false;

  if (section === "ops") {
    label = "미배차 (건)";
    value = num(UNASSIGNED.length);
    alert = UNASSIGNED.length > 0;
    sub = `가장 이른 시간대 ${UNASSIGNED[0]?.window ?? "없음"}`;
    action = { label: "미배차 보기", to: "dispatch" };
  } else if (section === "delivery") {
    label = "지연 (건)";
    value = num(DELAYED.length);
    alert = DELAYED.length > 0;
    sub = DELAYED.map((j) => j.jobId).join(", ");
    action = { label: "지연 건 보기", to: "dispatch" };
  } else if (section === "goods") {
    label = "검수 대기 (벌)";
    value = num(INSPECTION_PENDING.length);
    alert = INSPECTION_PENDING.length > 0;
    sub = `가장 오래된 입고 ${INSPECTION_PENDING.map((i) => i.receivedAt).sort()[0]?.slice(-5) ?? ""}`;
    action = { label: "검수 시작", to: "inspection" };
  } else {
    label = "이번 달 매출 (원)";
    value = num(MONTH_REVENUE_TO_DATE);
    sub = `8월 같은 기간 대비 ${pct(MONTH_REVENUE_TO_DATE, AUGUST_TO_18)}`;
    action = { label: "정산 보기", to: "settlement" };
  }

  return (
    <div className="mx-3 mb-3 rounded-[14px] bg-white p-4">
      <p className="text-[12px] leading-4 text-[var(--dd-muted)]">{label}</p>
      <p className={`dd-num mt-1 font-semibold ${value.length > 7 ? "text-[22px] leading-8" : "text-[28px] leading-9"}`} style={{ color: alert ? "var(--dd-act-fg)" : "var(--dd-ink)" }}>
        {value}
      </p>
      <p className="dd-num mt-0.5 text-[12px] leading-4 text-[var(--dd-muted)]">{sub}</p>
      {action && (
        <button
          type="button"
          onClick={() => onNavigate(action.to)}
          className="dd-press mt-3 h-8 w-full rounded-[8px] border border-[var(--dd-hairline)] text-[13px] font-medium text-[var(--dd-ink)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (s: AdminScreen) => void;
  children: ReactNode;
}) {
  const section = sectionOf(screen);

  return (
    <div className="flex min-h-dvh bg-white">
      {/* 1열: 아이콘 레일 */}
      <div className="hidden w-16 shrink-0 border-r border-[var(--dd-hairline)] bg-white lg:block">
      <nav aria-label="관리 섹션" className="sticky top-0 flex h-dvh flex-col items-center py-3">
        <span aria-label="DRESSDAY" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dd-primary)] text-[15px] font-bold text-white">
          D
        </span>
        <ul className="mt-6 flex flex-1 flex-col items-center gap-2">
          {SECTIONS.map((s) => {
            const on = s.key === section.key;
            const Icon = s.icon;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  title={s.label}
                  aria-label={s.label}
                  aria-current={on ? "page" : undefined}
                  onClick={() => onNavigate(s.views[0].key)}
                  className={`dd-press flex h-10 w-10 items-center justify-center rounded-full ${on ? "bg-[var(--dd-ink)] text-white" : "text-[var(--dd-muted)]"}`}
                >
                  <Icon size={20} weight={on ? "fill" : "regular"} />
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" aria-label="환경 설정" title="환경 설정" className="dd-press flex h-10 w-10 items-center justify-center rounded-full text-[var(--dd-muted)]">
          <Gear size={20} />
        </button>
      </nav>
      </div>

      {/* 2열: 섹션 리스트 */}
      <div className="hidden w-[232px] shrink-0 bg-[var(--dd-soft)] lg:block">
      <aside className="sticky top-0 flex h-dvh flex-col">
        <div className="flex h-[60px] items-center px-5">
          <h2 className="text-[20px] font-bold leading-7 text-[var(--dd-ink)]">{section.label}</h2>
        </div>
        <ul className="flex-1 space-y-0.5 px-3 pt-2">
          {section.views.map((v) => {
            const on = v.key === screen;
            return (
              <li key={v.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(v.key)}
                  aria-current={on ? "page" : undefined}
                  className={`dd-press flex h-10 w-full items-center justify-between gap-2 rounded-[8px] px-3 text-left text-[14px] ${
                    on ? "bg-white font-bold text-[var(--dd-ink)] shadow-[0_0_0_1px_var(--dd-hairline)]" : "font-semibold text-[var(--dd-body)]"
                  }`}
                >
                  <span className="truncate">{v.label}</span>
                  {v.count !== undefined && <span className="dd-num shrink-0 text-[12px] font-normal text-[var(--dd-muted)]">{v.count}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <SectionSummary section={section.key} onNavigate={onNavigate} />
      </aside>
      </div>

      {/* 3열: 헤더 + 본문 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-4 border-b border-[var(--dd-hairline)] bg-white px-4 lg:px-8">
          <span aria-label="DRESSDAY" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--dd-primary)] text-[13px] font-bold text-white lg:hidden">
            D
          </span>
          <p className="flex min-w-0 items-center gap-2 text-[14px] leading-5">
            <span className="hidden text-[var(--dd-muted)] sm:inline">{section.label}</span>
            <span className="hidden text-[var(--dd-muted-soft)] sm:inline">/</span>
            <span className="truncate font-semibold text-[var(--dd-ink)]">{viewLabel(screen)}</span>
          </p>

          <label className="relative mx-auto hidden h-10 w-full max-w-[400px] items-center md:flex">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-4 text-[var(--dd-muted)]" />
            <input
              aria-label="통합 검색"
              placeholder="예약번호, 고객명, 재고 태그 검색"
              className="h-full w-full rounded-full border border-[var(--dd-hairline)] bg-white pl-10 pr-4 text-[14px] text-[var(--dd-ink)] outline-none placeholder:text-[var(--dd-muted-soft)] focus:border-2 focus:border-[var(--dd-ink)] focus:pl-[39px]"
            />
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            <button type="button" aria-label={`알림 ${DELAYED.length + UNASSIGNED.length}건`} className="dd-press relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--dd-ink)] active:bg-[var(--dd-strong)]">
              <Bell size={20} />
              <span aria-hidden className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[var(--dd-primary)]" />
            </button>
            <button type="button" className="dd-press flex h-10 items-center gap-2 rounded-full border border-[var(--dd-hairline)] pl-1 pr-3">
              <Avatar name={OPERATOR.name} size={30} dark />
              <span className="hidden text-left leading-4 sm:block">
                <span className="block text-[13px] font-semibold text-[var(--dd-ink)]">{OPERATOR.name}</span>
                <span className="block text-[11px] text-[var(--dd-muted)]">{OPERATOR.team}</span>
              </span>
              <CaretDown size={12} className="text-[var(--dd-muted)]" />
            </button>
          </div>
        </header>

        {/* lg 미만: 섹션 리스트 → 가로 세그먼트 */}
        <div className="border-b border-[var(--dd-hairline)] bg-[var(--dd-soft)] lg:hidden">
          <div className="dd-scroll-x flex gap-2 overflow-x-auto px-4 py-2.5">
            {section.views.map((v) => {
              const on = v.key === screen;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => onNavigate(v.key)}
                  aria-current={on ? "page" : undefined}
                  className={`h-8 shrink-0 whitespace-nowrap rounded-full px-3.5 text-[13px] ${on ? "bg-[var(--dd-ink)] font-bold text-white" : "bg-white font-semibold text-[var(--dd-body)]"}`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        <main key={screen} className="dd-enter flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
      </div>

      {/* lg 미만: 레일 → 하단 아이콘 바 (불투명, blur 없음) */}
      <nav aria-label="관리 섹션" className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t border-[var(--dd-hairline)] bg-white lg:hidden">
        {SECTIONS.map((s) => {
          const on = s.key === section.key;
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onNavigate(s.views[0].key)}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] leading-4 ${on ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"}`}
            >
              <Icon size={22} weight={on ? "fill" : "regular"} />
              {s.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export const NOW_LABEL = NOW.label;
