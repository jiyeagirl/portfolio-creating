"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  CheckCircle,
  Drop,
  HeartStraight,
  Moon,
  PersonSimpleWalk,
  SneakerMove,
  Sparkle,
} from "@phosphor-icons/react";
import { Button, Chip } from "@/projects/healthcare/welllog/components/ui";
import { AppleHealthMark } from "@/projects/healthcare/welllog/components/health-marks";
import { currentUser } from "@/projects/healthcare/welllog/lib/mock-data";

const GOALS = [
  { key: "weight", label: "체중 관리", icon: SneakerMove },
  { key: "sleep", label: "수면 개선", icon: Moon },
  { key: "walk", label: "걷기 습관", icon: PersonSimpleWalk },
  { key: "stress", label: "스트레스 관리", icon: HeartStraight },
];

const STEP_COUNT = 5;

export function OnboardingScreen({
  onComplete,
  initialStep = 0,
}: {
  onComplete: () => void;
  initialStep?: number;
}) {
  const [step, setStep] = useState(initialStep);
  const [healthConnected, setHealthConnected] = useState(false);
  const [notifAllowed, setNotifAllowed] = useState(false);
  const [goal, setGoal] = useState("sleep");
  const [nickname, setNickname] = useState(currentUser.nickname);
  const reduce = useReducedMotion();

  const next = () => setStep((s) => Math.min(STEP_COUNT - 1, s + 1));

  return (
    <div className="relative flex h-full flex-col bg-[var(--wl-canvas)] pt-[59px]">
      <div className="flex items-center gap-1.5 px-6 pt-4">
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i <= step ? "var(--wl-accent)" : "var(--wl-hairline)" }}
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-6"
      >
        {step === 0 && (
          <div className="flex flex-1 flex-col">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[20px]">
              <Image src="https://picsum.photos/id/338/700/900" alt="해변에서 하루를 시작하는 사람" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[13px] font-medium text-white/80">welllog와 함께</p>
                <p className="mt-1 text-[24px] font-bold leading-8 text-white">
                  오늘부터
                  <br />
                  건강을 기록해보세요
                </p>
              </div>
            </div>
            <p className="mt-6 text-[14.5px] leading-6 text-[var(--wl-body)]">
              매일 아침 만들어지는 리듬 카드로 수면, 걸음, 활동을 가볍게 확인하고, 오늘
              컨디션을 한 줄로 남겨보세요. 진단이 아니라 저널에 가까운 습관 기록이에요.
            </p>
            <div className="mt-auto pt-6">
              <Button full size="lg" onClick={next}>
                시작하기
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-1 flex-col">
            <Sparkle size={28} weight="fill" color="var(--wl-accent)" />
            <h1 className="mt-4 text-[22px] font-bold leading-7 text-[var(--wl-ink)]">
              건강 데이터를 연동해주세요
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[var(--wl-body)]">
              Apple Health, Google Fit에서 수면과 걸음 데이터를 자동으로 가져와요.
              연동하지 않아도 직접 기록할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => setHealthConnected((v) => !v)}
              className={`mt-6 flex items-center gap-3 rounded-[20px] border p-4 text-left transition-colors ${
                healthConnected ? "border-[var(--wl-accent)] bg-[var(--wl-accent-soft)]" : "border-[var(--wl-hairline)] bg-[var(--wl-surface)]"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--wl-surface-soft)]">
                <AppleHealthMark size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium text-[var(--wl-ink)]">Apple Health 연동</span>
                <span className="block text-[12.5px] text-[var(--wl-mute)]">수면, 걸음, 활동 데이터 자동 동기화</span>
              </span>
              {healthConnected && <CheckCircle size={20} weight="fill" color="var(--wl-accent)" />}
            </button>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Button full size="lg" onClick={next}>
                {healthConnected ? "연동 완료, 계속하기" : "다음에 연동하기"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col">
            <Bell size={28} weight="fill" color="var(--wl-accent)" />
            <h1 className="mt-4 text-[22px] font-bold leading-7 text-[var(--wl-ink)]">
              알림을 받아보시겠어요?
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[var(--wl-body)]">
              경고 알림이 아니라 따뜻한 제안형 알림이에요. 운동 리마인드, 수분 섭취,
              챌린지 응원 소식을 보내드려요.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: Sparkle, label: "AI 제안 알림" },
                { icon: Drop, label: "수분 섭취 리마인드" },
                { icon: SneakerMove, label: "챌린지 응원 알림" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[20px] bg-[var(--wl-surface-soft)] p-3.5">
                  <item.icon size={17} color="var(--wl-accent-deep)" />
                  <span className="text-[13.5px] text-[var(--wl-ink)]">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Button
                full
                size="lg"
                onClick={() => {
                  setNotifAllowed(true);
                  next();
                }}
              >
                알림 허용하기
              </Button>
              <Button full variant="ghost" size="md" onClick={next}>
                나중에 하기
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-1 flex-col">
            <h1 className="text-[22px] font-bold leading-7 text-[var(--wl-ink)]">
              어떤 목표로 시작할까요?
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[var(--wl-body)]">
              선택한 목표에 맞춰 AI 제안과 리듬 카드 구성이 달라져요.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {GOALS.map((g) => {
                const Icon = g.icon;
                const active = g.key === goal;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGoal(g.key)}
                    className={`flex flex-col items-start gap-3 rounded-[20px] border p-4 text-left transition-colors ${
                      active ? "border-[var(--wl-accent)] bg-[var(--wl-accent-soft)]" : "border-[var(--wl-hairline)] bg-[var(--wl-surface)]"
                    }`}
                  >
                    <Icon size={20} weight={active ? "fill" : "regular"} color={active ? "var(--wl-accent-deep)" : "var(--wl-mute)"} />
                    <span className={`text-[13.5px] font-medium ${active ? "text-[var(--wl-accent-deep)]" : "text-[var(--wl-ink)]"}`}>
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-6">
              <Button full size="lg" onClick={next}>
                다음
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-1 flex-col">
            <h1 className="text-[22px] font-bold leading-7 text-[var(--wl-ink)]">
              마지막으로, 뭐라고 부를까요?
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[var(--wl-body)]">
              리듬 카드와 알림에서 이 이름으로 인사할게요.
            </p>
            <div className="mt-6">
              <label className="text-[13px] font-medium text-[var(--wl-ink)]">닉네임</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-[14px] border border-[var(--wl-hairline)] bg-[var(--wl-surface)] px-4 text-[15px] text-[var(--wl-ink)] outline-none focus:border-[var(--wl-accent)]"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-[20px] bg-[var(--wl-surface-soft)] p-3.5">
              <Chip tone="sage">목표: {GOALS.find((g) => g.key === goal)?.label}</Chip>
              {healthConnected && <Chip tone="periwinkle">Health 연동됨</Chip>}
              {notifAllowed && <Chip tone="amber">알림 허용</Chip>}
            </div>
            <div className="mt-auto pt-6">
              <Button full size="lg" onClick={onComplete}>
                {nickname || currentUser.nickname}님, 시작할게요
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
