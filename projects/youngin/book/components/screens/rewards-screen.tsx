"use client";

import { Icon } from "@iconify/react";
import { REWARDS, USER } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import type { RewardStatus } from "@/projects/youngin/book/lib/types";
import {
  Card,
  Chip,
  Divider,
  InfoNote,
  ProgressBar,
  ScreenHeader,
  SectionTitle,
} from "@/projects/youngin/book/components/ui";

const STATUS_TONE: Record<RewardStatus, "read" | "neutral" | "gold"> = {
  사용가능: "read",
  사용완료: "neutral",
  진행중: "gold",
};

const LEVELS = [
  { name: "새싹 독서가", need: "완독 1권", done: true },
  { name: "잎사귀 독서가", need: "완독 5권", done: true },
  { name: "은잎 독서가", need: "완독 20권", done: true, current: true },
  { name: "금잎 독서가", need: "완독 35권", done: false },
  { name: "고목 독서가", need: "완독 60권", done: false },
];

export function RewardsScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const available = REWARDS.filter((r) => r.status === "사용가능");
  const others = REWARDS.filter((r) => r.status !== "사용가능");

  return (
    <div className="book-enter min-h-full pb-[104px]">
      <ScreenHeader
        title="리워드"
        subtitle={`${USER.level} | 누적 스탬프 ${USER.totalStamps}개`}
        onBack={() => onNavigate("record")}
      />

      {/* 등급 카드 */}
      <section className="px-5 pt-5">
        <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--bk-dark)" }}>
          <div className="p-5">
            <p className="text-[12.5px] font-semibold text-[var(--bk-on-dark-muted)]">
              현재 등급
            </p>
            <p className="mt-1.5 text-[26px] font-bold tracking-[-0.02em] text-[var(--bk-on-dark)]">
              {USER.level}
            </p>
            <p className="book-num mt-1.5 text-[13px] text-[var(--bk-on-dark-muted)]">
              {USER.nextLevel}까지 완독 {USER.nextLevelNeed}권 남았습니다
            </p>
            <div className="mt-4">
              <ProgressBar
                value={USER.totalReads}
                goal={35}
                height={8}
                track="rgba(240,238,228,0.16)"
                fill="#6FB891"
              />
            </div>
            <div className="book-num mt-2 flex justify-between text-[11px] font-medium text-[var(--bk-on-dark-muted)]">
              <span>완독 {USER.totalReads}권</span>
              <span>35권</span>
            </div>
          </div>

          <div
            className="grid grid-cols-5 border-t"
            style={{ borderColor: "rgba(240,238,228,0.1)" }}
          >
            {LEVELS.map((level) => (
              <div key={level.name} className="px-1 py-3 text-center">
                <span
                  className="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background: level.current
                      ? "#6FB891"
                      : level.done
                        ? "rgba(111,184,145,0.2)"
                        : "rgba(240,238,228,0.08)",
                  }}
                >
                  <Icon
                    icon={level.done ? "solar:check-circle-bold" : "solar:lock-keyhole-linear"}
                    width="15"
                    height="15"
                    color={level.current ? "#0F1A15" : level.done ? "#6FB891" : "#6E7A72"}
                  />
                </span>
                <p
                  className="mt-1.5 text-[9.5px] font-semibold leading-[1.3]"
                  style={{
                    color: level.current ? "var(--bk-on-dark)" : "var(--bk-on-dark-muted)",
                  }}
                >
                  {level.name.replace(" 독서가", "")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 가능 */}
      <section className="px-5 pt-7">
        <SectionTitle title="받을 수 있는 리워드" caption={`${available.length}건`} />
        <div className="grid gap-2.5">
          {available.map((reward, index) => (
            <Card
              key={reward.id}
              className="book-enter"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: "var(--bk-gold-soft)" }}
                  >
                    <Icon icon="solar:gift-bold" width="22" height="22" color="var(--bk-gold)" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="min-w-0 flex-1 text-[15px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                        {reward.name}
                      </p>
                      <Chip tone={STATUS_TONE[reward.status]}>{reward.status}</Chip>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--bk-muted)]">
                      {reward.detail}
                    </p>
                    <p className="book-num mt-1.5 text-[11.5px] font-medium text-[var(--bk-faint)]">
                      {reward.condition} | {reward.date}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3.5 h-11 w-full rounded-[10px] text-[14px] font-semibold transition-transform duration-150 active:scale-[0.97]"
                  style={{ background: "var(--bk-accent)", color: "var(--bk-on-accent)" }}
                >
                  수령 방법 확인
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 내역 */}
      <section className="px-5 pt-7">
        <SectionTitle title="리워드 내역" caption={`${others.length}건`} />
        <Card>
          {others.map((reward, index) => (
            <div key={reward.id}>
              {index > 0 && <Divider />}
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <p className="min-w-0 flex-1 text-[14.5px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                    {reward.name}
                  </p>
                  <Chip tone={STATUS_TONE[reward.status]}>{reward.status}</Chip>
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--bk-muted)]">
                  {reward.detail}
                </p>
                {reward.progress ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <ProgressBar
                      value={reward.progress.current}
                      goal={reward.progress.goal}
                      height={6}
                      fill="var(--bk-gold)"
                    />
                    <span className="book-num shrink-0 text-[11.5px] font-bold text-[var(--bk-muted)]">
                      {reward.progress.current}/{reward.progress.goal}
                    </span>
                  </div>
                ) : (
                  <p className="book-num mt-1.5 text-[11.5px] font-medium text-[var(--bk-faint)]">
                    {reward.condition} | {reward.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Card>
      </section>

      <section className="px-5 pt-5">
        <InfoNote icon="solar:map-point-linear">
          굿즈와 교환권은 용인중앙도서관 1층 안내데스크에서 회원증을 제시하면 받을 수 있습니다.
          발급일로부터 60일간 유효합니다.
        </InfoNote>
      </section>
    </div>
  );
}
