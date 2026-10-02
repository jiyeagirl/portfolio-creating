"use client";

import type { ReactNode } from "react";
import { Dot, I, toneColor } from "@/projects/b2b/logisync/components/ui";
import { LAST_SYNC, NOW_LABEL, OPERATOR } from "@/projects/b2b/logisync/lib/mock-data";
import { SECTIONS, sectionOf, viewLabel, type View } from "@/projects/b2b/logisync/lib/navigation";

/* 셸 아키타입 C4: 아이콘 레일 + 섹션 리스트 (3-column). ARCHETYPES.md 참조.
   섹션은 파이프라인 단계(수집 → 검증 → 통합 → 활용)다.

   쓰지 않는 부품: 236px 라벨 레일, 전폭 h-14 헤더, 264px 모바일 드로어,
   max-w-[1400px], 헤더 우측 벽시계. 모바일은 하단 아이콘 바 + 가로 세그먼트로 접는다.
   엣지 고정 바에는 backdrop-blur를 쓰지 않고 불투명 표면만 쓴다.
   어두운 면은 아이콘 레일 하나(.ls-dark)뿐이고, 나머지는 선 대신 면의 명도 차로 나눈다. */

export function Shell({
  view,
  onNavigate,
  children,
}: {
  view: View;
  onNavigate: (v: View) => void;
  children: ReactNode;
}) {
  const section = sectionOf(view);

  return (
    <div className="logisync flex min-h-dvh">
      {/* 1열: 64px 아이콘 레일 */}
      <nav
        aria-label="파이프라인 단계"
        className="ls-dark sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center bg-[var(--ls-canvas)] py-4 lg:flex"
      >
        <BrandMark />
        <ul className="mt-8 flex flex-1 flex-col items-center gap-1">
          {SECTIONS.map((s, i) => {
            const on = s.key === section.key;
            return (
              <li key={s.key} className="flex flex-col items-center">
                {i > 0 && <span aria-hidden className="mb-1 h-3 w-px bg-[var(--ls-elevated)]" />}
                <button
                  type="button"
                  onClick={() => onNavigate(s.views[0].key)}
                  title={`${s.step} ${s.label}`}
                  aria-label={`${s.step} ${s.label}`}
                  aria-current={on ? "page" : undefined}
                  className={`ls-swap flex h-11 w-11 items-center justify-center rounded-xl ${
                    on ? "bg-[var(--ls-ink)] text-[var(--ls-canvas)]" : "text-[var(--ls-muted)] hover:bg-[var(--ls-elevated)] hover:text-[var(--ls-ink)]"
                  }`}
                >
                  <I icon={on ? s.icon.replace("-linear", "-bold") : s.icon} size={20} />
                </button>
                <span aria-hidden className="ls-num mt-1 text-[9px] font-semibold leading-3 text-[var(--ls-disabled)]">
                  {s.step}
                </span>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          aria-label="환경 설정"
          title="환경 설정"
          className="ls-swap flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ls-muted)] hover:bg-[var(--ls-elevated)]"
        >
          <I icon="solar:settings-linear" size={20} />
        </button>
      </nav>

      {/* 2열: 섹션 리스트 + 섹션 고유 요약 */}
      <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col bg-[var(--ls-surface)] lg:flex">
        <div className="flex h-16 items-center px-5">
          <p className="text-[15px] font-bold tracking-[0.2px] text-[var(--ls-ink)]">LogiSync</p>
        </div>

        <div className="px-5 pb-3 pt-4">
          <p className="ls-num text-[12px] font-semibold text-[var(--ls-muted)]">{section.step}</p>
          <h2 className="mt-1 text-[19px] font-bold leading-[26px] text-[var(--ls-ink)]">{section.label}</h2>
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
                  className={`ls-swap relative w-full rounded-xl px-3 py-2.5 text-left ${
                    on ? "bg-[var(--ls-canvas)]" : "hover:bg-[var(--ls-canvas)]"
                  }`}
                >
                  <span className={`block text-[14px] leading-5 ${on ? "font-bold text-[var(--ls-ink)]" : "text-[var(--ls-body-strong)]"}`}>
                    {v.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-4 text-[var(--ls-muted)]">{v.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="m-3 rounded-2xl bg-[var(--ls-canvas)] p-4">
          <p className="text-[12px] text-[var(--ls-muted)]">{section.summary.label}</p>
          <p className="ls-figure mt-1 text-[28px] leading-9 text-[var(--ls-ink)]">{section.summary.value}</p>
          <p className="mt-1 flex items-center gap-2 text-[12px]" style={{ color: section.summary.tone === "neutral" ? "var(--ls-body)" : toneColor(section.summary.tone) }}>
            {section.summary.tone !== "neutral" && <Dot tone={section.summary.tone} size={6} />}
            {section.summary.sub}
          </p>
        </div>
      </aside>

      {/* 3열: 헤더는 이 컬럼 위에만 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-[var(--ls-canvas)] px-5 lg:px-10">
          <span className="lg:hidden">
            <BrandMark small />
          </span>
          <p className="flex min-w-0 items-center gap-2 text-[13px]">
            <span className="hidden text-[var(--ls-muted)] sm:inline">{section.label}</span>
            <span className="hidden text-[var(--ls-disabled)] sm:inline">/</span>
            <span className="truncate font-bold text-[var(--ls-ink)]">{viewLabel(view)}</span>
          </p>

          <label className="relative ml-auto hidden h-10 w-[320px] items-center xl:flex">
            <I icon="solar:magnifer-linear" size={16} className="pointer-events-none absolute left-3 text-[var(--ls-muted)]" />
            <input
              placeholder="통합 ID, 상품코드, 원천 문서번호 검색"
              className="h-full w-full rounded-xl bg-[var(--ls-surface)] pl-9 pr-12 text-[13px] text-[var(--ls-ink)] shadow-[var(--ls-shadow)] outline-none placeholder:text-[var(--ls-muted)]"
            />
            <kbd className="ls-code absolute right-2 rounded-[6px] bg-[var(--ls-elevated)] px-1.5 text-[10px] text-[var(--ls-muted)]">/</kbd>
          </label>

          <span className="ml-auto hidden items-center gap-2 rounded-full bg-[var(--ls-surface)] px-3.5 py-2 text-[12px] text-[var(--ls-body-strong)] shadow-[var(--ls-shadow)] md:flex xl:ml-0" title={NOW_LABEL}>
            <Dot tone="ok" live size={6} />
            <span>동기화</span>
            <span className="ls-num text-[var(--ls-muted)]">{LAST_SYNC}</span>
          </span>

          <button type="button" aria-label="알림 3건" className="ls-swap relative ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-[var(--ls-body-strong)] hover:bg-[var(--ls-elevated)] md:ml-0">
            <I icon="solar:bell-linear" size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--ls-primary)]" />
          </button>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ls-ink)] text-[11px] font-bold text-[var(--ls-surface)]">
              {OPERATOR.initials}
            </span>
            <div className="hidden leading-4 sm:block">
              <p className="text-[13px] font-bold text-[var(--ls-ink)]">{OPERATOR.name}</p>
              <p className="mt-0.5 text-[11px] text-[var(--ls-muted)]">{OPERATOR.role}</p>
            </div>
          </div>
        </header>

        {/* 모바일: 하위 뷰는 가로 세그먼트로 */}
        <div className="bg-[var(--ls-canvas)] lg:hidden">
          <div className="ls-noscroll flex overflow-x-auto px-5">
            {section.views.map((v) => {
              const on = v.key === view;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => onNavigate(v.key)}
                  aria-current={on ? "page" : undefined}
                  className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-[13px] ${on ? "font-bold text-[var(--ls-ink)]" : "text-[var(--ls-muted)]"}`}
                >
                  {v.label}
                  {on && <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[var(--ls-ink)]" />}
                </button>
              );
            })}
          </div>
        </div>

        <main key={view} className="ls-enter flex-1 px-5 pb-28 pt-6 lg:px-10 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>

      {/* 모바일: 섹션은 하단 아이콘 바 (불투명, blur 없음) */}
      <nav aria-label="파이프라인 단계" className="fixed inset-x-0 bottom-0 z-40 grid h-[60px] grid-cols-4 bg-[var(--ls-surface)] shadow-[0_-1px_8px_rgba(40,36,30,0.06)] lg:hidden">
        {SECTIONS.map((s) => {
          const on = s.key === section.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onNavigate(s.views[0].key)}
              aria-current={on ? "page" : undefined}
              aria-label={s.label}
              className={`relative flex flex-col items-center justify-center gap-0.5 ${on ? "text-[var(--ls-ink)]" : "text-[var(--ls-muted)]"}`}
            >
              {on && <span aria-hidden className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-[var(--ls-primary)]" />}
              <I icon={on ? s.icon.replace("-linear", "-bold") : s.icon} size={20} />
              <span className="text-[10px] font-semibold leading-3">{s.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-label="LogiSync"
      className={`flex shrink-0 items-center justify-center rounded-xl bg-[var(--ls-primary)] ${small ? "h-8 w-8" : "h-10 w-10"}`}
    >
      <svg viewBox="0 0 24 24" width={small ? 16 : 20} height={small ? 16 : 20} aria-hidden>
        {/* 세 갈래 원천이 한 줄로 합쳐지는 마크 */}
        <path d="M4 5h6l4 7h6M4 12h10M4 19h6l4-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="square" />
      </svg>
    </span>
  );
}
