"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CaretLeft,
  Microphone,
  MicrophoneSlash,
  Phone,
  PhoneDisconnect,
  ShieldCheck,
  SpeakerHigh,
  SpeakerSimpleX,
  Star,
  Warning,
} from "@phosphor-icons/react";
import tunnel from "@/projects/platform/lumi/assets/call-tunnel-light.jpg";
import phoneMood from "@/projects/platform/lumi/assets/mood-phone-sunset.jpg";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import { PASS_BY_TIER, expertById } from "@/projects/platform/lumi/lib/mock-data";
import { ExpertAvatar } from "@/projects/platform/lumi/components/ui";

type Phase = "ready" | "connecting" | "inCall" | "ended";

function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CallScreen({
  expertId,
  tier,
  onNavigate,
  onDarkPhaseChange,
}: {
  expertId: string;
  tier: PassTier;
  onNavigate: NavigateFn;
  /** 통화 화면은 어두운 배경이라 상태바 색을 바꿔야 한다. */
  onDarkPhaseChange: (dark: boolean) => void;
}) {
  const expert = expertById(expertId);
  const pass = PASS_BY_TIER[expert.tiers.includes(tier) ? tier : expert.tiers[0]];
  const total = pass.minutes * 60;

  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(total);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);

  useEffect(() => {
    onDarkPhaseChange(phase === "connecting" || phase === "inCall");
  }, [phase, onDarkPhaseChange]);

  useEffect(() => {
    if (phase !== "connecting") return;
    const timer = window.setTimeout(() => setPhase("inCall"), 2600);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "inCall") return;
    const timer = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(timer);
          setPhase("ended");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const used = total - left;
  const progress = Math.min(100, (used / total) * 100);

  if (phase === "ready") {
    return (
      <div className="lm-enter flex min-h-full flex-col bg-[var(--lm-canvas)]">
        <header className="sticky top-0 z-20 border-b border-[var(--lm-border)] bg-[var(--lm-elevated)] pt-[59px]">
          <div className="flex h-[52px] items-center gap-2 px-4">
            <button
              type="button"
              onClick={() => onNavigate("history")}
              aria-label="뒤로"
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <h1 className="text-[16px] font-bold tracking-tight">상담 준비</h1>
          </div>
        </header>

        <section className="px-5 pt-5">
          <div className="rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-5">
            <div className="flex items-center gap-3.5">
              <ExpertAvatar expert={expert} size={56} />
              <div>
                <p className="text-[16px] font-bold">{expert.name}</p>
                <p className="lm-num mt-0.5 text-[12.5px] text-[var(--lm-muted)]">
                  {pass.name} {pass.minutes}분 상담권 사용
                </p>
              </div>
            </div>
            <dl className="lm-num mt-4 space-y-2 border-t border-[var(--lm-border)] pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-[var(--lm-muted)]">예약 시간</dt>
                <dd className="font-semibold">오늘 오후 8:00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--lm-muted)]">상담 주제</dt>
                <dd className="font-semibold">하반기 이직 시기</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--lm-muted)]">연결 방식</dt>
                <dd className="font-semibold">안심번호 자동 연결</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mt-4 px-5">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={phoneMood}
              alt="노을을 배경으로 휴대폰을 들고 있는 손"
              placeholder="blur"
              className="h-[150px] w-full object-cover"
              sizes="353px"
            />
          </div>
          <ul className="mt-4 space-y-2">
            {[
              "조용한 곳에서 이어폰을 끼면 잘 들립니다.",
              "연결 후부터 시간이 흐르고, 3분 남으면 안내음이 들립니다.",
              "5분 이내에 끊으면 상담권이 복구됩니다.",
            ].map((line) => (
              <li key={line} className="flex gap-2 text-[13px] leading-relaxed text-[var(--lm-muted)]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--lm-border)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-auto px-5 pb-8 pt-6">
          <p className="mb-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-[var(--lm-muted)]">
            <ShieldCheck size={13} weight="fill" />
            내 번호는 상담사에게 표시되지 않습니다
          </p>
          <button
            type="button"
            onClick={() => setPhase("connecting")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lm-accent)] py-4 text-[15.5px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
          >
            <Phone size={17} weight="fill" />
            전화 연결하기
          </button>
        </div>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div className="lm-enter flex min-h-full flex-col bg-[var(--lm-canvas)] pt-[59px]">
        <section className="px-6 pt-10 text-center">
          <p className="text-[13px] font-semibold text-[var(--lm-muted)]">상담이 종료되었습니다</p>
          <p className="lm-num mt-2 text-[32px] font-bold leading-none">{clock(used)}</p>
          <p className="lm-num mt-2 text-[13px] text-[var(--lm-muted)]">
            {pass.name} {pass.minutes}분 중 {Math.max(1, Math.round(used / 60))}분 사용
          </p>
        </section>

        <section className="mt-7 px-5">
          <div className="rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-5">
            <div className="flex items-center gap-3.5">
              <ExpertAvatar expert={expert} size={48} />
              <div>
                <p className="text-[15px] font-bold">{expert.name}</p>
                <p className="text-[12.5px] text-[var(--lm-muted)]">오늘 오후 8:00 상담</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-[var(--lm-surface)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
              상담 기록이 내 상담 내역에 저장되었습니다. 녹취는 90일 동안 보관되며 마이페이지에서
              들을 수 있습니다.
            </p>
          </div>
        </section>

        <div className="mt-auto space-y-2 px-5 pb-8 pt-8">
          <button
            type="button"
            onClick={() => onNavigate("reviewWrite", expert.id)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--lm-accent)] py-3.5 text-[15px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
          >
            <Star size={15} weight="fill" />
            후기 작성하기
          </button>
          <button
            type="button"
            onClick={() => onNavigate("history")}
            className="w-full rounded-xl border border-[var(--lm-border)] py-3.5 text-[15px] font-bold text-[var(--lm-ink)]"
          >
            상담 내역으로
          </button>
        </div>
      </div>
    );
  }

  const connecting = phase === "connecting";

  return (
    <div className="lm-enter relative flex min-h-full flex-col bg-[var(--lm-night)] text-white">
      <Image
        src={tunnel}
        alt=""
        aria-hidden
        placeholder="blur"
        fill
        className="object-cover opacity-25"
        sizes="393px"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,11,28,0.75)] via-[rgba(13,11,28,0.88)] to-[var(--lm-night)]" />

      <div className="relative flex flex-1 flex-col px-6 pb-10 pt-[100px]">
        <div className="text-center">
          <p className="text-[13px] font-semibold text-white/60">
            {connecting ? "안심번호로 연결하고 있습니다" : "통화 중"}
          </p>
          <h1 className="mt-2 text-[24px] font-bold tracking-tight">{expert.name}</h1>
          <p className="lm-num mt-1 text-[13px] text-white/60">
            {pass.name} {pass.minutes}분 상담권
          </p>
        </div>

        <div className="relative mx-auto mt-10 flex h-[168px] w-[168px] items-center justify-center">
          {connecting && (
            <>
              <span className="lm-pulse-ring absolute inset-0 rounded-full border border-white/25" />
              <span
                className="lm-pulse-ring absolute inset-0 rounded-full border border-white/15"
                style={{ animationDelay: "0.8s" }}
              />
            </>
          )}
          {!connecting && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 168 168" aria-hidden>
              <circle cx="84" cy="84" r="78" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="3" />
              <circle
                cx="84"
                cy="84"
                r="78"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 78}
                strokeDashoffset={(2 * Math.PI * 78 * progress) / 100}
              />
            </svg>
          )}
          <span className="rounded-full bg-white/10 p-1">
            <ExpertAvatar expert={expert} size={112} />
          </span>
        </div>

        <div className="mt-8 text-center">
          {connecting ? (
            <p className="text-[15px] font-semibold text-white/80">잠시만 기다려 주세요</p>
          ) : (
            <>
              <p className="text-[12.5px] text-white/55">남은 시간</p>
              <p className="lm-num mt-1 text-[40px] font-bold leading-none tabular-nums">
                {clock(left)}
              </p>
              <p className="lm-num mt-2 text-[12.5px] text-white/55">
                사용 {clock(used)} / 전체 {pass.minutes}분
              </p>
            </>
          )}
        </div>

        {!connecting && left <= 180 && (
          <p className="mx-auto mt-5 flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 text-[12px] font-semibold text-white">
            <Warning size={13} weight="fill" />
            3분 뒤 상담이 종료됩니다
          </p>
        )}

        <div className="mt-auto">
          {!connecting && (
            <div className="mb-7 flex items-center justify-center gap-10">
              <button
                type="button"
                onClick={() => setMuted((v) => !v)}
                aria-pressed={muted}
                className="flex flex-col items-center gap-2 text-[11.5px] font-semibold text-white/75"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    muted ? "bg-white text-[var(--lm-night)]" : "bg-white/12"
                  }`}
                >
                  {muted ? <MicrophoneSlash size={22} weight="fill" /> : <Microphone size={22} />}
                </span>
                {muted ? "음소거 중" : "음소거"}
              </button>
              <button
                type="button"
                onClick={() => setSpeaker((v) => !v)}
                aria-pressed={speaker}
                className="flex flex-col items-center gap-2 text-[11.5px] font-semibold text-white/75"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    speaker ? "bg-white text-[var(--lm-night)]" : "bg-white/12"
                  }`}
                >
                  {speaker ? <SpeakerHigh size={22} weight="fill" /> : <SpeakerSimpleX size={22} />}
                </span>
                스피커
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => (connecting ? onNavigate("history") : setPhase("ended"))}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c0392f] text-white active:translate-y-[1px]"
            aria-label={connecting ? "연결 취소" : "상담 종료"}
          >
            <PhoneDisconnect size={26} weight="fill" />
          </button>
          <p className="mt-3 text-center text-[12px] text-white/55">
            {connecting ? "연결 취소" : "상담 종료"}
          </p>
        </div>
      </div>
    </div>
  );
}
