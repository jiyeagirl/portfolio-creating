"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Phone,
  ShieldWarning,
  SpinnerGap,
  ThumbsUp,
  Warning,
} from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import { Card, PrimaryButton, StatusBadge } from "@/projects/monitoring/caresignal/components/app/ui";
import { fallEvent, guardians, user } from "@/projects/monitoring/caresignal/lib/app-data";
import type { AppNavigate } from "@/projects/monitoring/caresignal/lib/navigation";

type Phase = "countdown" | "reported" | "dismissed";

const RING_RADIUS = 88;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const TIMELINE = [
  { at: "오후 2시 22분 04초", label: "낙상 의심 신호 감지", done: true },
  { at: "오후 2시 22분 06초", label: "본인 확인 요청 시작", done: true },
  { at: "오후 2시 22분 31초", label: "도움 요청 접수", done: true },
  { at: "오후 2시 22분 34초", label: "보호자 2명에게 알림 발송", done: true },
  { at: "오후 2시 23분 12초", label: "장녀 김미경 알림 확인", done: true },
  { at: "오후 2시 24분 02초", label: "복지관 담당자 현장 이동 중", done: false },
];

export function FallScreen({
  onNavigate,
  onDarkChange,
}: {
  onNavigate: AppNavigate;
  onDarkChange?: (dark: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [remaining, setRemaining] = useState(fallEvent.countdownSeconds);

  useEffect(() => {
    onDarkChange?.(phase === "countdown");
  }, [phase, onDarkChange]);

  useEffect(() => {
    if (phase !== "countdown") return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setPhase("reported");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  if (phase === "countdown") {
    return (
      <div className="flex min-h-full w-full flex-col bg-[#1d1d1f] px-6 pb-10 pt-[92px] text-white">
        <div className="flex items-center gap-2 self-start rounded-full bg-[#ff3b30] px-3 py-1.5">
          <Warning size={15} weight="fill" />
          <span className="text-[13px] font-semibold leading-none">낙상 감지</span>
        </div>

        <h1 className="mt-6 text-[32px] font-bold leading-[1.2] tracking-[-0.03em]">
          넘어지신 것 같습니다
        </h1>
        <p className="mt-2.5 text-[16px] font-normal leading-[1.5] text-[#cccccc]">
          {remaining}초 안에 응답이 없으면 보호자와 복지기관에 자동으로 도움을 요청합니다.
        </p>

        <div className="relative mx-auto mt-9 flex h-[204px] w-[204px] items-center justify-center">
          <svg viewBox="0 0 204 204" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="102"
              cy="102"
              r={RING_RADIUS}
              fill="none"
              stroke="#3a3a3c"
              strokeWidth="10"
            />
            <circle
              cx="102"
              cy="102"
              r={RING_RADIUS}
              fill="none"
              stroke="#ff3b30"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              className="cs-ring-drain"
              style={
                {
                  "--cs-ring-length": `${RING_LENGTH}`,
                  "--cs-ring-duration": `${fallEvent.countdownSeconds}s`,
                } as React.CSSProperties
              }
            />
          </svg>
          <div className="text-center">
            <p className="text-[68px] font-bold leading-none tabular-nums">{remaining}</p>
            <p className="mt-1.5 text-[14px] font-normal text-[#cccccc]">초 남음</p>
          </div>
        </div>

        <dl className="mt-8 space-y-2.5 rounded-[18px] bg-[#272729] p-4">
          <Detail term="감지 시각" value={fallEvent.detectedAt} />
          <Detail term="감지 위치" value={`${fallEvent.place} · ${fallEvent.detail}`} />
          <Detail term="감지 근거" value={fallEvent.impact} />
        </dl>

        <div className="mt-auto space-y-2.5 pt-8">
          <PrimaryButton
            tone="danger"
            className="w-full"
            onClick={() => {
              setRemaining(0);
              setPhase("reported");
            }}
          >
            지금 도움이 필요합니다
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setPhase("dismissed")}
            className="cs-press cs-focusable flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white/12 text-[17px] font-semibold text-white"
          >
            <ThumbsUp size={19} weight="fill" />
            괜찮습니다, 잘못 감지되었습니다
          </button>
        </div>
      </div>
    );
  }

  if (phase === "dismissed") {
    return (
      <div className="flex min-h-full w-full flex-col px-6 pb-10 pt-[112px]">
        <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#eaf6ee]">
          <CheckCircle size={38} weight="fill" className="text-[#248a3d]" />
        </span>
        <h1 className="mt-6 text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1d1d1f]">
          오감지로 종료했습니다
        </h1>
        <p className="mt-2.5 text-[16px] font-normal leading-[1.55] text-[#333333]">
          보호자와 복지기관에는 알림이 발송되지 않았습니다. 이번 신호는 감지 정확도를 높이는 데만
          사용됩니다.
        </p>

        <Card className="mt-7 p-4">
          <p className="text-[13px] font-normal text-[#7a7a7a]">기록된 내용</p>
          <p className="mt-2 text-[15px] font-semibold text-[#1d1d1f]">
            {fallEvent.detectedAt} · {fallEvent.place}
          </p>
          <p className="mt-1.5 text-[14px] font-normal leading-[1.5] text-[#333333]">
            {fallEvent.impact}
          </p>
          <p className="mt-3 border-t border-[#f0f0f0] pt-3 text-[13.5px] font-normal leading-[1.5] text-[#7a7a7a]">
            같은 자리에서 오감지가 반복되면 휴대 위치 설정을 다시 확인해 보세요. 현재 설정은
            {" "}
            {user.carryPosition}입니다.
          </p>
        </Card>

        <div className="mt-auto space-y-2.5 pt-8">
          <PrimaryButton className="w-full" onClick={() => onNavigate("home")}>
            홈으로 돌아가기
          </PrimaryButton>
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            className="cs-focusable w-full py-2 text-[15px] font-normal text-[#0066cc]"
          >
            감지 기록 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-10 pt-[76px]">
      <div className="flex items-center justify-between">
        <StatusBadge status="danger">도움 요청 진행 중</StatusBadge>
        <span className="text-[13px] font-normal text-[#7a7a7a]">2분 12초 경과</span>
      </div>

      <h1 className="mt-4 px-1 text-[28px] font-bold leading-[1.25] tracking-[-0.03em] text-[#1d1d1f]">
        보호자와 복지기관에
        <br />
        도움을 요청했습니다
      </h1>
      <p className="mt-2.5 px-1 text-[15px] font-normal leading-[1.55] text-[#333333]">
        {guardians[0].name} 님이 알림을 확인했고, {user.agency} 담당자가 현장으로 이동하고 있습니다.
      </p>

      <MiniMap
        className="cs-image-shadow mt-5 h-[168px] w-full"
        markers={[
          { id: "event", x: 56, y: 58, kind: "event", status: "danger", pulse: true, label: "감지 지점" },
          { id: "home", x: 40, y: 44, kind: "home", label: "자택" },
        ]}
        showLabels={false}
      />
      <div className="mt-3 flex items-center gap-2 px-1">
        <ShieldWarning size={17} weight="fill" className="text-[#d70015]" />
        <p className="text-[14px] font-normal text-[#333333]">
          {fallEvent.place} · {fallEvent.detail}
        </p>
      </div>

      <h2 className="mt-7 px-1 text-[19px] font-semibold leading-none tracking-[-0.02em] text-[#1d1d1f]">
        처리 상태
      </h2>
      <ol className="mt-4 px-1">
        {TIMELINE.map((step, index) => (
          <li key={step.at} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                  step.done ? "bg-[#248a3d]" : "bg-[#eef4fb]"
                }`}
              >
                {step.done ? (
                  <CheckCircle size={12} weight="fill" className="text-white" />
                ) : (
                  <SpinnerGap size={12} weight="bold" className="text-[#0066cc]" />
                )}
              </span>
              {index < TIMELINE.length - 1 && <span className="h-full w-[2px] bg-[#f0f0f0]" />}
            </div>
            <div className="pb-4">
              <p
                className={`text-[15px] leading-[1.35] ${
                  step.done ? "font-normal text-[#333333]" : "font-semibold text-[#0066cc]"
                }`}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-[12.5px] font-normal text-[#7a7a7a]">{step.at}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-auto space-y-2.5 pt-6">
        <button
          type="button"
          className="cs-press cs-focusable flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] text-[17px] font-semibold text-white"
        >
          <Phone size={20} weight="fill" />
          {guardians[0].name} 님과 통화하기
        </button>
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="cs-press cs-focusable min-h-[52px] w-full rounded-full border border-[#0066cc] text-[16px] font-semibold text-[#0066cc]"
        >
          괜찮아졌습니다, 상황 종료 알리기
        </button>
      </div>
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-[68px] shrink-0 text-[13px] font-normal text-[#cccccc]">{term}</dt>
      <dd className="flex-1 text-[13.5px] font-normal leading-[1.45] text-white">{value}</dd>
    </div>
  );
}
