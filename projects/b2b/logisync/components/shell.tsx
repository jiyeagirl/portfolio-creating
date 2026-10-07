"use client";

import type { ReactNode } from "react";
import { Dot, I } from "@/projects/b2b/logisync/components/ui";
import { LAST_SYNC, NOW_LABEL, OPERATOR } from "@/projects/b2b/logisync/lib/mock-data";
import { SECTIONS, sectionOf, viewLabel, type View } from "@/projects/b2b/logisync/lib/navigation";

/* 셸: 아이콘과 이름이 함께 나오는 248px 단일 사이드바 + 본문 컬럼 위에만 얹는 헤더.
   메뉴는 파이프라인 단계(수집, 검증, 통합, 활용)로 묶는다. 어두운 면은 사이드바 하나(.ls-dark)뿐이다.
   쓰지 않는 부품: 전폭 h-14 헤더, 264px 모바일 드로어, max-w-[1400px], 헤더 우측 벽시계.
   모바일은 하단 아이콘 바 + 가로 세그먼트로 접는다. 엣지 고정 바에는 backdrop-blur 없이 불투명 표면만 쓴다. */

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
      {/* 사이드바: 파이프라인 단계별로 묶고, 모든 화면을 아이콘과 이름으로 나열한다 */}
      <aside
        aria-label="주 메뉴"
        className="ls-dark sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col overflow-y-auto bg-[var(--ls-canvas)] px-3 py-5 lg:flex"
      >
        <div className="flex items-center gap-2.5 px-3 pb-6">
          <BrandMark small />
          <p className="text-[15px] font-bold text-[var(--ls-ink)]">LogiSync</p>
        </div>

        <nav className="flex flex-col gap-6">
          {SECTIONS.map((s) => (
            <div key={s.key}>
              <p className="px-3 text-[12px] font-semibold text-[var(--ls-muted)]">{s.label}</p>
              <ul className="mt-1.5 space-y-0.5">
                {s.views.map((v) => {
                  const on = v.key === view;
                  return (
                    <li key={v.key}>
                      <button
                        type="button"
                        onClick={() => onNavigate(v.key)}
                        aria-current={on ? "page" : undefined}
                        className={`ls-swap flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] leading-5 ${
                          on
                            ? "bg-[var(--ls-elevated)] font-semibold text-[var(--ls-ink)]"
                            : "text-[var(--ls-body)] hover:bg-[var(--ls-pressed)] hover:text-[var(--ls-ink)]"
                        }`}
                      >
                        <I icon={v.icon} size={18} weight={on ? "fill" : "regular"} />
                        <span className="min-w-0 truncate">{v.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button
            type="button"
            className="ls-swap flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] text-[var(--ls-body)] hover:bg-[var(--ls-pressed)] hover:text-[var(--ls-ink)]"
          >
            <I icon="gear-six" size={18} />
            환경 설정
          </button>
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
            <I icon="magnifying-glass" size={16} className="pointer-events-none absolute left-3 text-[var(--ls-muted)]" />
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
            <I icon="bell" size={20} />
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
              <I icon={s.icon} size={20} weight={on ? "fill" : "regular"} />
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
