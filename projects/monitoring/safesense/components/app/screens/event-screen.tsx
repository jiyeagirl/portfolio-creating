"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ThumbsUp, Warning } from "@phosphor-icons/react";
import { PrimaryButton } from "@/projects/monitoring/safesense/components/app/ui";
import { currentWorker, sites } from "@/projects/monitoring/safesense/lib/mock-data";
import type { AppNavigate } from "@/projects/monitoring/safesense/lib/navigation";

type Phase = "countdown" | "reported" | "dismissed";

const RING_RADIUS = 84;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const COUNTDOWN_SECONDS = 15;

const DETECTED_AT = "14:22:04";
const LOCATION = "3층 철골 구조부 / B동 인근";
const IMPACT = "충격 4.3G 감지, 이후 9초간 움직임 없음";

export function EventScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const site = sites.find((s) => s.id === currentWorker.siteId)!;

  useEffect(() => {
    if (phase !== "countdown") return;
    const timer = window.setInterval(() => {
      setRemaining((v) => {
        if (v <= 1) {
          window.clearInterval(timer);
          setPhase("reported");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  if (phase === "countdown") {
    return (
      <div className="flex min-h-full w-full flex-col px-5 pb-10 pt-[92px]">
        <div className="flex items-center gap-2 self-start rounded-full border border-[var(--ss-accent)] px-3 py-1.5">
          <Warning size={15} weight="fill" className="text-[var(--ss-accent)]" />
          <span className="ss-mono text-[11px] font-bold text-[var(--ss-accent)]">낙상 감지</span>
        </div>

        <h1 className="ss-display mt-5 text-[26px] text-[var(--ss-foreground)]">
          넘어지신 것 같습니다
        </h1>
        <p className="ss-mono mt-2 text-[10.5px] leading-[1.7] text-[var(--ss-muted)]">
          {remaining}초 안에 응답이 없으면 관리자에게 자동으로 SOS가 전송됩니다.
        </p>

        <div className="relative mx-auto mt-8 flex h-[188px] w-[188px] items-center justify-center">
          <svg viewBox="0 0 188 188" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="94" cy="94" r={RING_RADIUS} fill="none" stroke="var(--ss-border)" strokeWidth="4" />
            <circle
              cx="94"
              cy="94"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--ss-accent)"
              strokeWidth="4"
              strokeDasharray={RING_LENGTH}
              className="ss-ring-drain"
              style={{ "--ss-ring-length": `${RING_LENGTH}`, "--ss-ring-duration": `${COUNTDOWN_SECONDS}s` } as React.CSSProperties}
            />
          </svg>
          <div className="ss-mono text-center">
            <p className="text-[56px] font-bold leading-none text-[var(--ss-foreground)]">{remaining}</p>
            <p className="mt-1.5 text-[10px] text-[var(--ss-muted)]">초 남음</p>
          </div>
        </div>

        <dl className="ss-mono mt-8 space-y-2 rounded-[10px] border border-[var(--ss-border)] bg-[var(--ss-panel)] p-4 text-[10.5px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--ss-muted)]">감지 시각</dt>
            <dd className="text-right text-[var(--ss-foreground)]">{DETECTED_AT}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-[var(--ss-muted)]">감지 위치</dt>
            <dd className="text-right text-[var(--ss-foreground)]">{LOCATION}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-[var(--ss-muted)]">감지 근거</dt>
            <dd className="text-right text-[var(--ss-foreground)]">{IMPACT}</dd>
          </div>
        </dl>

        <div className="mt-auto space-y-2 pt-8">
          <PrimaryButton
            tone="accent"
            className="w-full"
            onClick={() => {
              setRemaining(0);
              setPhase("reported");
            }}
          >
            <Warning size={18} weight="fill" />
            지금 도움이 필요합니다
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setPhase("dismissed")}
            className="ss-press ss-focusable flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--ss-border-strong)] text-[13.5px] font-bold text-[var(--ss-foreground)]"
          >
            <ThumbsUp size={17} weight="fill" />
            괜찮습니다, 잘못 감지되었습니다
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center px-6 pb-10 pt-[140px] text-center">
      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[var(--ss-safe)]">
        <CheckCircle size={34} weight="fill" className="text-[var(--ss-safe)]" />
      </span>
      <h1 className="ss-display mt-6 text-[22px] text-[var(--ss-foreground)]">
        {phase === "reported" ? "SOS가 전송되었습니다" : "오감지로 처리되었습니다"}
      </h1>
      <p className="ss-mono mt-2 text-[10.5px] leading-[1.7] text-[var(--ss-muted)]">
        {phase === "reported"
          ? `${site.name} 관리자 ${site.managerName} 님에게 위치와 함께 즉시 통보되었습니다.`
          : "이벤트가 종료되었습니다. 계속 작업을 진행하셔도 됩니다."}
      </p>
      <PrimaryButton tone="outline" className="mt-8 w-full" onClick={() => onNavigate("home")}>
        홈으로 돌아가기
      </PrimaryButton>
    </div>
  );
}
