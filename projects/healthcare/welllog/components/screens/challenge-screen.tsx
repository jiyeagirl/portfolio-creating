"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Circle, Drop, Fire, Sun, UserPlus } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Chip, InitialAvatar, ProgressBar } from "@/projects/healthcare/welllog/components/ui";
import { challenges as initialChallenges } from "@/projects/healthcare/welllog/lib/mock-data";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; weight?: "fill" }>> = {
  Sun,
  Drop,
};

export function ChallengeScreen() {
  const [challenges, setChallenges] = useState(initialChallenges);

  const toggleToday = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              todayDone: !c.todayDone,
              myStreak: !c.todayDone ? c.myStreak + 1 : Math.max(0, c.myStreak - 1),
            }
          : c,
      ),
    );
  };

  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-[110px]">
      <ScreenHeader
        title="리듬 챌린지"
        subtitle="순위 대신 완주율로 함께 채워가요"
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
        subtitleClassName="text-[11px] text-[var(--wl-mute)]"
      />

      <div className="space-y-4 px-5 pt-4">
        {challenges.map((challenge) => {
          const Icon = ICON_MAP[challenge.icon] ?? Sun;
          const daysLeft = challenge.daysTotal - challenge.daysElapsed;
          return (
            <div key={challenge.id} className="rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--wl-accent-soft)]">
                    <Icon size={19} weight="fill" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[var(--wl-ink)]">{challenge.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-4 text-[var(--wl-mute)]">{challenge.description}</p>
                  </div>
                </div>
                {challenge.myStreak > 0 && (
                  <Chip tone="coral" icon={<Fire size={11} weight="fill" />}>
                    {challenge.myStreak}일 연속
                  </Chip>
                )}
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-[var(--wl-body)]">내 완주율</span>
                  <span className="wl-num font-semibold text-[var(--wl-ink)]">{challenge.myCompletionRate}%</span>
                </div>
                <ProgressBar value={challenge.myCompletionRate} tone="sage" />
                <p className="mt-1.5 text-[11.5px] text-[var(--wl-mute)]">
                  {challenge.daysElapsed}/{challenge.daysTotal}일 진행 / {daysLeft}일 남음
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleToday(challenge.id)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13.5px] font-semibold transition-colors ${
                  challenge.todayDone ? "bg-[var(--wl-accent-soft)] text-[var(--wl-accent-deep)]" : "bg-[var(--wl-accent)] text-white"
                }`}
              >
                {challenge.todayDone ? <CheckCircle size={16} weight="fill" /> : <Circle size={16} />}
                {challenge.todayDone ? "오늘 체크 완료" : "오늘 체크하기"}
              </button>

              <div className="mt-4 border-t border-[var(--wl-hairline)] pt-3.5">
                <p className="mb-2.5 text-[12.5px] font-medium text-[var(--wl-mute)]">함께하는 친구</p>
                <div className="space-y-2.5">
                  {challenge.friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-2.5">
                      <InitialAvatar name={friend.name} size={30} tone={friend.todayDone ? "sage" : "neutral"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-[var(--wl-ink)]">{friend.name}</span>
                          <span className="wl-num text-[12px] text-[var(--wl-mute)]">{friend.completionRate}%</span>
                        </div>
                        <div className="mt-1">
                          <ProgressBar value={friend.completionRate} tone={friend.todayDone ? "sage" : "neutral"} />
                        </div>
                      </div>
                      {friend.todayDone && <CheckCircle size={15} weight="fill" color="var(--wl-accent)" />}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-[var(--wl-hairline)] py-2 text-[12.5px] text-[var(--wl-body)]"
                >
                  <UserPlus size={14} />
                  친구 초대하기
                </button>
              </div>
            </div>
          );
        })}

        <div className="relative overflow-hidden rounded-[20px]">
          <div className="relative h-[150px] w-full">
            <Image src="https://picsum.photos/id/633/700/500" alt="숲속에서 명상하는 사람" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[13.5px] font-medium text-white">완주보다 꾸준함이 먼저예요</p>
            <p className="mt-1 text-[11.5px] text-white/80">
              하루를 놓쳐도 괜찮아요. 다시 오늘 체크하는 것부터 시작해요.
            </p>
          </div>
        </div>

        <Button full variant="outline" size="md">
          새 챌린지 둘러보기
        </Button>
      </div>
    </div>
  );
}
