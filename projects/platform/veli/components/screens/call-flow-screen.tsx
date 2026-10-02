"use client";

import { useEffect, useState } from "react";
import {
  GridFour,
  Microphone,
  MicrophoneSlash,
  PhoneCall,
  PhoneDisconnect,
  PhoneX,
  Prohibit,
  QrCode,
  ShieldCheck,
  SpeakerHigh,
  SpeakerSimpleX,
  Warning,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import type { CallStage } from "@/projects/platform/veli/lib/types";
import { MY_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import { Badge, GhostButton, PrimaryButton } from "@/projects/platform/veli/components/ui";

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** 통화 연결 플로우(QR 스캔 → 안심번호 확인 → CTI 연결 → 통화 → 종료/실패/부재중/스팸 차단)를
 * 하나의 상태 기계로 다루는 화면. veli는 라이트 톤을 유지하는 유틸리티 제품이라 lumi의
 * 야간 통화 화면과 달리 밝은 --vl-* 토큰 위에서 시각적 초점만 중앙에 둔다. */
export function CallFlowScreen({
  scenario,
  onNavigate,
}: {
  scenario?: string;
  onNavigate: NavigateFn;
}) {
  const [stage, setStage] = useState<CallStage>("scan");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [keypad, setKeypad] = useState(false);

  const safeNumber = MY_SAFE_NUMBERS[0];

  useEffect(() => {
    if (stage !== "scan") return;
    const timer = window.setTimeout(() => setStage("requesting"), 1800);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "requesting") return;
    const timer = window.setTimeout(() => setStage("connecting"), 1200);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "connecting") return;
    const timer = window.setTimeout(() => {
      if (scenario === "missed") setStage("missed");
      else if (scenario === "failed") setStage("failed");
      else setStage("onCall");
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [stage, scenario]);

  useEffect(() => {
    if (stage !== "onCall") return;
    const timer = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  const cancelRow = (
    <div className="flex items-center justify-between px-5 pt-[59px]">
      <span className="text-[13px] font-semibold text-[var(--vl-muted)]">차량 통화 연결</span>
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className="text-[13px] font-semibold text-[var(--vl-muted)] transition-colors active:translate-y-[1px] active:opacity-70"
      >
        취소
      </button>
    </div>
  );

  if (stage === "scan") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
        {cancelRow}
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="relative mx-auto h-[220px] w-[220px] overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-surface)]">
            <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-[6px] border-l-2 border-t-2 border-[var(--vl-accent)]" />
            <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-[6px] border-r-2 border-t-2 border-[var(--vl-accent)]" />
            <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-[6px] border-b-2 border-l-2 border-[var(--vl-accent)]" />
            <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-[6px] border-b-2 border-r-2 border-[var(--vl-accent)]" />
            <span className="vl-scan-line absolute inset-x-3 top-3 h-[2px] rounded-full bg-[var(--vl-accent)]" />
            <QrCode
              size={64}
              weight="light"
              className="absolute inset-0 m-auto text-[var(--vl-muted-soft)]"
              aria-hidden
            />
          </div>
          <h1 className="mt-7 text-[18px] font-bold tracking-tight">
            차량 앞유리의 QR을 스캔하세요
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
            번호판 옆 안심번호 스티커의 QR 코드를 사각형 안에 맞추면
            <br />
            자동으로 인식됩니다
          </p>
        </div>
        <div className="px-5 pb-9">
          <PrimaryButton onClick={() => setStage("requesting")}>스캔 완료</PrimaryButton>
        </div>
      </div>
    );
  }

  if (stage === "requesting") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
        {cancelRow}
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="relative flex h-[128px] w-[128px] items-center justify-center">
            <span className="vl-pulse-ring absolute inset-0 rounded-full border-2 border-[var(--vl-accent)]/30" />
            <span
              className="vl-pulse-ring absolute inset-0 rounded-full border-2 border-[var(--vl-accent)]/20"
              style={{ animationDelay: "0.8s" }}
            />
            <span className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
              <ShieldCheck size={40} weight="fill" />
            </span>
          </div>
          <p className="vl-num mt-6 text-[22px] font-bold tracking-tight">{safeNumber.number}</p>
          <h1 className="mt-2 text-[16px] font-bold">안심번호 확인 중</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
            차량 소유주 확인을 위해 070 안심번호를
            <br />
            조회하고 있어요
          </p>
        </div>
      </div>
    );
  }

  if (stage === "connecting") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
        {cancelRow}
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="relative flex h-[128px] w-[128px] items-center justify-center">
            <span className="vl-pulse-ring absolute inset-0 rounded-full border-2 border-[var(--vl-accent)]/30" />
            <span
              className="vl-pulse-ring absolute inset-0 rounded-full border-2 border-[var(--vl-accent)]/20"
              style={{ animationDelay: "0.8s" }}
            />
            <span className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
              <PhoneCall size={40} weight="fill" />
            </span>
          </div>
          <h1 className="mt-6 text-[16px] font-bold">CTI 서버에 연결 요청 중</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
            안심번호와 상대방의 실제 휴대폰 회선을
            <br />
            연결하고 있어요
          </p>
        </div>
      </div>
    );
  }

  if (stage === "onCall") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
        <div className="flex flex-col items-center px-8 pt-[76px] text-center">
          <Badge tone="accent">통화 중</Badge>
          <p className="vl-num mt-4 text-[40px] font-bold leading-none tracking-tight">
            {formatClock(seconds)}
          </p>
          <p className="vl-num mt-3 text-[13px] text-[var(--vl-muted)]">
            {safeNumber.number}로 연결됨
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <span className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
            <ShieldCheck size={44} weight="fill" />
          </span>

          {keypad && (
            <div className="mt-6 grid w-full max-w-[240px] grid-cols-3 gap-2 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-3">
              {KEYPAD_KEYS.map((k) => (
                <span
                  key={k}
                  className="flex h-11 items-center justify-center rounded-[8px] bg-[var(--vl-surface)] text-[15px] font-semibold text-[var(--vl-ink)]"
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 pb-9">
          <div className="mb-7 flex items-center justify-center gap-8">
            <button
              type="button"
              aria-pressed={muted}
              onClick={() => setMuted((v) => !v)}
              className="flex flex-col items-center gap-2 text-[11.5px] font-semibold text-[var(--vl-muted)]"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  muted
                    ? "bg-[var(--vl-ink)] text-[var(--vl-canvas)]"
                    : "bg-[var(--vl-surface)] text-[var(--vl-ink)]"
                }`}
              >
                {muted ? <MicrophoneSlash size={22} weight="fill" /> : <Microphone size={22} />}
              </span>
              {muted ? "음소거 중" : "음소거"}
            </button>
            <button
              type="button"
              aria-pressed={speaker}
              onClick={() => setSpeaker((v) => !v)}
              className="flex flex-col items-center gap-2 text-[11.5px] font-semibold text-[var(--vl-muted)]"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  speaker
                    ? "bg-[var(--vl-ink)] text-[var(--vl-canvas)]"
                    : "bg-[var(--vl-surface)] text-[var(--vl-ink)]"
                }`}
              >
                {speaker ? <SpeakerHigh size={22} weight="fill" /> : <SpeakerSimpleX size={22} />}
              </span>
              스피커
            </button>
            <button
              type="button"
              aria-pressed={keypad}
              onClick={() => setKeypad((v) => !v)}
              className="flex flex-col items-center gap-2 text-[11.5px] font-semibold text-[var(--vl-muted)]"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  keypad
                    ? "bg-[var(--vl-ink)] text-[var(--vl-canvas)]"
                    : "bg-[var(--vl-surface)] text-[var(--vl-ink)]"
                }`}
              >
                <GridFour size={22} weight={keypad ? "fill" : "regular"} />
              </span>
              키패드
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStage("ended")}
            aria-label="통화 종료"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vl-danger)] text-white transition-transform active:translate-y-[1px] active:opacity-70"
          >
            <PhoneDisconnect size={26} weight="fill" />
          </button>
          <p className="mt-3 text-center text-[12px] text-[var(--vl-muted)]">종료</p>

          <button
            type="button"
            onClick={() => setStage("spamBlocked")}
            className="mx-auto mt-5 block text-[12.5px] font-semibold text-[var(--vl-danger)] underline underline-offset-2"
          >
            스팸으로 신고
          </button>
        </div>
      </div>
    );
  }

  if (stage === "ended") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-success-soft)] text-[var(--vl-success)]">
            <PhoneCall size={38} weight="fill" />
          </span>
          <h1 className="mt-6 text-[16px] font-bold">통화가 종료되었습니다</h1>
          <p className="vl-num mt-3 text-[32px] font-bold leading-none tracking-tight">
            {formatClock(seconds)}
          </p>
          <p className="vl-num mt-2 text-[13px] text-[var(--vl-muted)]">
            {safeNumber.number} 안심번호로 통화함
          </p>
        </div>
        <div className="space-y-2.5 px-5 pb-9">
          <PrimaryButton onClick={() => onNavigate("history")}>통화내역으로</PrimaryButton>
          <button
            type="button"
            onClick={() => setStage("spamBlocked")}
            className="w-full py-1 text-center text-[13px] font-semibold text-[var(--vl-danger)]"
          >
            스팸 신고하기
          </button>
        </div>
      </div>
    );
  }

  if (stage === "missed") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)] pt-[59px]">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-warning-soft)] text-[var(--vl-warning)]">
            <PhoneX size={38} weight="fill" />
          </span>
          <h1 className="mt-6 text-[16px] font-bold">상대방이 응답하지 않았습니다</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
            부재중 알림이 발송되었습니다
            <br />
            통화내역에서 다시 확인할 수 있어요
          </p>
        </div>
        <div className="px-5 pb-9">
          <PrimaryButton onClick={() => onNavigate("home")}>홈으로</PrimaryButton>
        </div>
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)] pt-[59px]">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-danger-soft)] text-[var(--vl-danger)]">
            <Warning size={38} weight="fill" />
          </span>
          <h1 className="mt-6 text-[16px] font-bold">연결에 실패했습니다</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
            CTI 서버 응답이 지연되고 있어요
            <br />
            잠시 후 다시 시도해 주세요
          </p>
        </div>
        <div className="space-y-2.5 px-5 pb-9">
          <PrimaryButton onClick={() => setStage("connecting")}>다시 시도</PrimaryButton>
          <GhostButton onClick={() => onNavigate("home")}>홈으로</GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div key={stage} className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)] pt-[59px]">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--vl-danger-soft)] text-[var(--vl-danger)]">
          <Prohibit size={38} weight="fill" />
        </span>
        <h1 className="mt-6 text-[16px] font-bold">이 번호를 차단했습니다</h1>
        <div className="mt-3">
          <Badge tone="danger">스팸 신고 접수</Badge>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--vl-muted)]">
          해당 번호로부터의 재연결이 제한되며
          <br />
          통화내역에 신고 표시가 남습니다
        </p>
      </div>
      <div className="px-5 pb-9">
        <PrimaryButton onClick={() => onNavigate("history")}>통화내역으로</PrimaryButton>
      </div>
    </div>
  );
}
