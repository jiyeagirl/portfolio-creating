"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, List, Stamp as StampIcon, X } from "@phosphor-icons/react";
import { CUSTOMER } from "@/projects/monitoring/taxdesk/lib/mock-data";
import { FLOW, type SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { Container, Monogram } from "@/projects/monitoring/taxdesk/components/site/ui";

const MENU: { id: SiteScreen; label: string }[] = [
  { id: "apply", label: "신고 신청" },
  { id: "status", label: "신고 현황" },
];

function menuActive(screen: SiteScreen, id: SiteScreen) {
  if (id === "status") return screen === "status";
  return screen !== "status";
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--td-blue)] text-white">
        <StampIcon size={16} weight="fill" />
      </span>
      <span className="text-[17px] font-bold tracking-[-0.02em]">TaxDesk</span>
    </span>
  );
}

export function SiteHeader({
  screen,
  signedIn,
  onNavigate,
  onSignIn,
}: {
  screen: SiteScreen;
  signedIn: boolean;
  onNavigate: (s: SiteScreen) => void;
  onSignIn: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--td-line)] bg-white">
      <Container className="flex h-[52px] items-center gap-8">
        <button type="button" onClick={() => onNavigate("apply")} aria-label="TaxDesk 처음으로">
          <Logo />
        </button>
        <nav aria-label="주 메뉴" className="hidden h-full items-center gap-7 md:flex">
          {MENU.map((m) => {
            const active = menuActive(screen, m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigate(m.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center text-[14px] ${
                  active ? "font-semibold text-[var(--td-ink)]" : "text-[var(--td-ink-3)] hover:text-[var(--td-ink)]"
                }`}
              >
                {m.label}
                {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--td-ink)]" />}
              </button>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {signedIn ? (
            <span className="hidden items-center gap-2 text-[14px] md:flex">
              <Monogram text={CUSTOMER.owner.slice(1, 2)} size={28} />
              {CUSTOMER.owner} 님
            </span>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="hidden h-8 rounded-full px-3 text-[14px] font-semibold text-[var(--td-blue)] hover:bg-[var(--td-blue-tint)] md:block"
            >
              로그인
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          >
            <List size={22} />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-white md:hidden"
            initial={{ y: "-4%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-4%", opacity: 0 }}
            transition={{ type: "spring", visualDuration: 0.3, bounce: 0 }}
          >
            <div className="flex h-[52px] items-center justify-between px-6">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex items-center gap-3 border-b border-[var(--td-line)] px-6 pb-5 pt-3">
              <Monogram text={CUSTOMER.owner.slice(1, 2)} size={40} />
              <div className="min-w-0">
                <p className="text-[17px] font-semibold">{signedIn ? `${CUSTOMER.owner} 님` : "로그인이 필요해요"}</p>
                <p className="truncate text-[14px] text-[var(--td-ink-3)]">{CUSTOMER.business}</p>
              </div>
            </div>
            <nav aria-label="주 메뉴" className="flex flex-col px-6 pt-2">
              {MENU.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onNavigate(m.id);
                  }}
                  className={`flex h-14 items-center border-b border-[var(--td-line-soft)] text-left text-[21px] ${
                    menuActive(screen, m.id) ? "font-semibold" : "text-[var(--td-ink-2)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** 신청 흐름 위치. 단계 이름 자체가 라벨이다 */
export function FlowSteps({ screen, onNavigate }: { screen: SiteScreen; onNavigate: (s: SiteScreen) => void }) {
  const current = FLOW.findIndex((f) => f.screen === screen);
  return (
    <ol className="flex items-center gap-2 text-[14px]">
      {FLOW.map((f, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={f.screen} className="flex min-w-0 items-center gap-2">
            {i > 0 && <span className="h-px w-4 shrink-0 bg-[var(--td-line)] sm:w-8" />}
            <button
              type="button"
              disabled={i > current}
              onClick={() => onNavigate(f.screen)}
              className={`flex items-center gap-1.5 whitespace-nowrap ${
                active ? "font-semibold text-[var(--td-ink)]" : done ? "text-[var(--td-ink-2)]" : "text-[var(--td-ink-3)]"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done
                    ? "bg-[var(--td-ink)] text-white"
                    : active
                      ? "bg-[var(--td-blue)] text-white"
                      : "border border-[var(--td-line)] text-[var(--td-ink-3)]"
                }`}
              >
                {done ? <Check size={11} weight="bold" /> : i + 1}
              </span>
              <span className={active ? "" : "hidden sm:inline"}>{f.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** 신청 흐름 세로 레일 (데스크톱 왼쪽 열). 현재 단계 아래에 children(세부 단계)을 펼친다.
    세부 단계는 ml-[11px] + border-l-2 로 그려 단계 연결선과 같은 x에 놓인다 */
export function FlowRail({
  screen,
  onNavigate,
  children,
}: {
  screen: SiteScreen;
  onNavigate: (s: SiteScreen) => void;
  children?: React.ReactNode;
}) {
  const current = FLOW.findIndex((f) => f.screen === screen);
  return (
    <ol className="flex flex-col">
      {FLOW.map((f, i) => {
        const done = i < current;
        const active = i === current;
        const open = active && children;
        return (
          <li key={f.screen} className="relative pb-6 last:pb-0">
            {i < FLOW.length - 1 && (
              <span
                className={`absolute bottom-0 left-[11px] w-0.5 ${open ? "h-6" : "top-7"} ${
                  done ? "bg-[var(--td-ink)]" : "bg-[var(--td-line)]"
                }`}
              />
            )}
            <button
              type="button"
              disabled={!done}
              onClick={() => onNavigate(f.screen)}
              className="flex h-6 items-center gap-3 text-left disabled:cursor-default"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                  done
                    ? "bg-[var(--td-ink)] text-white"
                    : active
                      ? "bg-[var(--td-blue)] text-white"
                      : "border border-[var(--td-line)] text-[var(--td-ink-3)]"
                }`}
              >
                {done ? <Check size={12} weight="bold" /> : i + 1}
              </span>
              <span
                className={`text-[15px] ${
                  active ? "font-semibold text-[var(--td-ink)]" : done ? "text-[var(--td-ink-2)]" : "text-[var(--td-ink-3)]"
                }`}
              >
                {f.label}
              </span>
            </button>
            {open && <div className="ml-[11px] mt-3">{children}</div>}
          </li>
        );
      })}
    </ol>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--td-line)] bg-[var(--td-parch)]">
      <Container className="flex flex-col gap-1 py-6 text-[12px] leading-[18px] text-[var(--td-ink-3)] md:flex-row md:items-center md:gap-4">
        <span className="font-semibold text-[var(--td-ink-2)]">TaxDesk</span>
        <span>세무대리 E세무회계 | 대표세무사 문지후 | 사업자등록번호 105-87-22391</span>
        <span>고객센터 1661-4827 (평일 09:00 ~ 18:00)</span>
      </Container>
    </footer>
  );
}
