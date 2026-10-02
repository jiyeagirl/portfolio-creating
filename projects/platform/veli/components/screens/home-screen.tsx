"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ClockCounterClockwise,
  Gear,
  QrCode,
  Ticket,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import {
  CALL_LOGS,
  CURRENT_USER,
  MY_SAFE_NUMBERS,
  MY_SUBSCRIPTION,
  PASS_BY_TIER,
} from "@/projects/platform/veli/lib/mock-data";
import { InitialAvatar } from "@/projects/platform/veli/components/ui";
import {
  CredentialCard,
  DeckDots,
} from "@/projects/platform/veli/components/credential-card";

/* 아키타입 A2 — 크리덴셜 월렛.

   홈은 리스트가 아니다. 사용자가 가진 안심번호는 1~3개뿐이라 섹션을 쌓을 대상이
   없다 (예전 구현은 6개 섹션을 쌓아 객체 3개를 보여줬다). 대신 카드가 곧 제품이고,
   화면은 1.2화면 안에서 끝난다.

   - 하단 탭바 없음. 나머지 화면은 전부 `Sheet`로 올라온다.
   - 카드가 여러 장이면 세로로 쌓지 않고 가로 스냅 덱(`.vl-deck`)으로 넘긴다.
   - 주 액션(QR 연결)은 카드 바로 아래 하나. 보조 진입점은 그 아래 3열 한 줄뿐이다.
   - `SectionHead`를 쓰지 않는다 — 이 아키타입에 섹션 반복이 없다. */

/* 이용권 만료까지 남은 일수. 목업 데이터 기준일(2026-07-30)에 고정해 계산한다.
   실제 시계로 계산하면 시간이 지날수록 "만료예정" 상태와 어긋난다. */
const TODAY = new Date("2026-07-30");

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - TODAY.getTime()) / 86400000);
}

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const passDaysLeft = daysUntil(MY_SUBSCRIPTION.expiresAt);
  const lastCall = CALL_LOGS[0];

  /* 스냅 덱의 현재 페이지는 스크롤 위치에서 역산한다. 카드 폭이 컨테이너 폭과
     같으므로 scrollLeft / clientWidth 반올림이 곧 인덱스다. */
  const handleDeckScroll = () => {
    const el = deckRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== activeCard) setActiveCard(next);
  };

  return (
    <div className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
      <header className="flex items-center justify-between gap-3 px-5 pb-5 pt-[71px]">
        <div className="min-w-0">
          <p className="text-[13px] text-[var(--vl-muted)]">2026년 7월 30일</p>
          <h1 className="mt-0.5 truncate text-[24px] font-bold leading-tight tracking-[-0.02em]">
            {CURRENT_USER.name}님의 지갑
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("mypage")}
          aria-label="내 정보"
          className="shrink-0 transition-opacity active:opacity-60"
        >
          <InitialAvatar name={CURRENT_USER.name} size={38} />
        </button>
      </header>

      <div ref={deckRef} onScroll={handleDeckScroll} className="vl-deck flex overflow-x-auto">
        {MY_SAFE_NUMBERS.map((safeNumber) => (
          <div key={safeNumber.id} className="w-full shrink-0 px-5">
            <CredentialCard
              safeNumber={safeNumber}
              onOpen={() => onNavigate("numberDetail", safeNumber.id)}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <DeckDots count={MY_SAFE_NUMBERS.length} active={activeCard} />
      </div>

      <div className="mt-6 px-5">
        <button
          type="button"
          onClick={() => onNavigate("callFlow")}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--vl-ink)] px-5 py-4 text-[16px] font-bold text-[var(--vl-canvas)] transition-all duration-200 active:translate-y-[1px] active:opacity-70"
        >
          <QrCode size={19} weight="fill" />
          차량 QR 스캔해서 연결
        </button>
        <p className="mt-2.5 text-center text-[13px] leading-[20px] text-[var(--vl-muted)]">
          상대가 QR을 스캔하면 실제 번호 노출 없이 070으로 연결됩니다
        </p>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-2 px-5">
        <ShortcutTile
          icon={<ClockCounterClockwise size={18} weight="bold" />}
          label="통화 기록"
          value={`${CALL_LOGS.length}건`}
          onClick={() => onNavigate("history")}
        />
        <ShortcutTile
          icon={<Ticket size={18} weight="bold" />}
          label={PASS_BY_TIER[MY_SUBSCRIPTION.tier].name}
          value={passDaysLeft >= 0 ? `D-${passDaysLeft}` : `D+${Math.abs(passDaysLeft)}`}
          onClick={() => onNavigate("passes")}
        />
        <ShortcutTile
          icon={<Gear size={18} weight="bold" />}
          label="설정"
          value="알림 켬"
          onClick={() => onNavigate("settings")}
        />
      </div>

      {lastCall && (
        <div className="mt-7 px-5 pb-10">
          <button
            type="button"
            onClick={() => onNavigate("callDetail", lastCall.id)}
            className="flex w-full items-center gap-3 rounded-[14px] border border-[var(--vl-border)] px-4 py-3.5 text-left transition-all duration-200 active:translate-y-[1px] active:opacity-70"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                lastCall.result === "connected"
                  ? "bg-[var(--vl-success-soft)] text-[var(--vl-success)]"
                  : "bg-[var(--vl-surface)] text-[var(--vl-muted)]"
              }`}
            >
              {lastCall.direction === "incoming" ? (
                <ArrowDownLeft size={16} weight="bold" />
              ) : (
                <ArrowUpRight size={16} weight="bold" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--vl-muted)]">
                마지막 연결
              </p>
              <p className="mt-1 truncate text-[16px] font-semibold leading-[24px]">
                {lastCall.counterpartLabel}
              </p>
            </div>
            <p className="vl-num shrink-0 text-[13px] text-[var(--vl-muted)]">{lastCall.time}</p>
          </button>
        </div>
      )}
    </div>
  );
}

/* 보조 진입점. 카드 아래 한 줄에 3개만 둔다 — 홈이 목록으로 자라나는 것을 막는
   지점이라, 항목을 늘려야 하면 시트 안으로 넣는다. */
function ShortcutTile({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2 rounded-[14px] bg-[var(--vl-surface)] px-3.5 py-3.5 text-left transition-all duration-200 active:translate-y-[1px] active:opacity-70"
    >
      <span className="text-[var(--vl-ink)]">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] text-[var(--vl-muted)]">{label}</span>
        <span className="vl-num mt-0.5 block truncate text-[15px] font-semibold">{value}</span>
      </span>
    </button>
  );
}
