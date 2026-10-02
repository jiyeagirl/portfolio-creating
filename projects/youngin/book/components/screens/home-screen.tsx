"use client";

import { Icon } from "@iconify/react";
import {
  LIBRARIES,
  MISSIONS,
  READ_LOGS,
  REWARDS,
  THIS_MONTH,
  USER,
  photo,
} from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import { Card, Chip, ProgressBar, SectionTitle, StatTile } from "@/projects/youngin/book/components/ui";

const MISSION_ICON: Record<string, string> = {
  recommend: "solar:book-2-bold",
  theme: "solar:moon-stars-bold",
  branch: "solar:map-point-wave-bold",
  event: "solar:confetti-minimalistic-bold",
};

export function HomeScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const nextReward = REWARDS.find((r) => r.status === "진행중");
  const recent = READ_LOGS.slice(0, 3);
  const visitedRatio = Math.round((THIS_MONTH.visitedLibraries / THIS_MONTH.visitedGoal) * 100);

  return (
    <div className="book-enter min-h-full pb-[104px] pt-[59px]">
      {/* 상단 인사 */}
      <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--bk-muted)]">
            <Icon icon="solar:map-point-linear" width="14" height="14" />
            용인시 {USER.homeDistrict}
          </p>
          <h1 className="mt-1 text-[22px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--bk-ink)]">
            {USER.nickname}님, 이번 달
            <br />
            <span className="text-[var(--bk-accent)]">4곳</span>을 다녀오셨어요
          </h1>
        </div>
        <button
          type="button"
          aria-label="알림"
          className="relative -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-[var(--bk-surface-soft)]"
        >
          <Icon icon="solar:bell-linear" width="23" height="23" color="var(--bk-ink)" />
          <span
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full"
            style={{ background: "var(--bk-event)" }}
          />
        </button>
      </header>

      {/* 이번 달 챌린지 현황 */}
      <section className="px-5">
        <div
          className="relative overflow-hidden rounded-[20px]"
          style={{ background: "var(--bk-dark)" }}
        >
          <img
            src={photo(1073, 786, 420)}
            alt="펼쳐진 책들이 벽면을 가득 채운 모습"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
          />
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-semibold text-[var(--bk-on-dark-muted)]">
                {THIS_MONTH.label} 독서 챌린지
              </p>
              <span className="book-num text-[11.5px] font-semibold text-[var(--bk-on-dark-muted)]">
                {THIS_MONTH.daysLeft}일 남음
              </span>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <p className="book-num text-[30px] font-bold leading-none tracking-[-0.02em] text-[var(--bk-on-dark)]">
                {THIS_MONTH.visitedLibraries}
              </p>
              <p className="book-num pb-0.5 text-[15px] font-semibold text-[var(--bk-on-dark-muted)]">
                / {THIS_MONTH.visitedGoal}곳 방문
              </p>
              <p className="ml-auto pb-1 text-[12.5px] font-semibold text-[var(--bk-on-dark-muted)]">
                상위 <span className="book-num">{THIS_MONTH.rankPercent}%</span>
              </p>
            </div>

            <div className="mt-3">
              <ProgressBar
                value={visitedRatio}
                goal={100}
                height={7}
                track="rgba(240,238,228,0.16)"
                fill="#5FA47F"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <StatTile value={THIS_MONTH.reads} unit="권" label="완독 인증" tone="dark" />
              <StatTile value={THIS_MONTH.badges} unit="개" label="획득 배지" tone="dark" />
              <StatTile value={USER.totalStamps} unit="개" label="누적 스탬프" tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* QR 인증 바로가기 */}
      <section className="px-5 pt-3">
        <button
          type="button"
          onClick={() => onNavigate("scan")}
          className="flex w-full items-center gap-3.5 rounded-[14px] px-4 py-4 text-left transition-transform duration-150 active:scale-[0.98]"
          style={{ background: "var(--bk-accent)" }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]"
            style={{ background: "rgba(246,243,236,0.16)" }}
          >
            <Icon icon="solar:qr-code-bold" width="26" height="26" color="var(--bk-on-accent)" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-bold text-[var(--bk-on-accent)]">
              QR로 방문 인증하기
            </span>
            <span className="mt-0.5 block text-[12.5px] font-medium text-[rgba(246,243,236,0.72)]">
              도서관 입구 QR을 찍으면 스탬프가 바로 적립됩니다
            </span>
          </span>
          <Icon
            icon="solar:alt-arrow-right-linear"
            width="20"
            height="20"
            color="rgba(246,243,236,0.72)"
          />
        </button>
      </section>

      {/* 이번 달 미션 */}
      <section className="pt-7">
        <div className="px-5">
          <SectionTitle
            title="이번 달 미션"
            caption="매달 1일에 추천도서와 테마가 새로 바뀝니다"
          />
        </div>
        <div className="book-scroll-x flex gap-3 overflow-x-auto px-5 pb-1">
          {MISSIONS.map((mission, index) => {
            const done = mission.progress >= mission.goal;
            return (
              <button
                key={mission.id}
                type="button"
                onClick={() => onNavigate("missionDetail", mission.id)}
                className="book-enter flex w-[248px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-[var(--bk-line)] bg-[var(--bk-surface)] text-left transition-transform duration-150 active:scale-[0.98]"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {mission.photoId ? (
                  <div className="relative h-[104px] w-full">
                    <img
                      src={photo(mission.photoId, 496, 208)}
                      alt={mission.photoAlt ?? ""}
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-14"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(22,33,28,0.72), rgba(22,33,28,0))",
                      }}
                    />
                    <span className="absolute bottom-2.5 left-3">
                      <Chip tone="accent">{mission.label}</Chip>
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex h-[104px] w-full items-center justify-between px-4"
                    style={{ background: "var(--bk-surface-soft)" }}
                  >
                    <Chip tone={mission.kind === "event" ? "event" : "visit"}>{mission.label}</Chip>
                    <Icon
                      icon={MISSION_ICON[mission.kind]}
                      width="40"
                      height="40"
                      color="var(--bk-line)"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[15.5px] font-bold leading-[1.35] tracking-[-0.01em] text-[var(--bk-ink)]">
                    {mission.title}
                  </p>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-[1.5] text-[var(--bk-muted)]">
                    {mission.summary}
                  </p>

                  <div className="mt-3.5 flex items-center gap-2">
                    <ProgressBar value={mission.progress} goal={mission.goal} height={6} />
                    <span className="book-num shrink-0 text-[11.5px] font-bold text-[var(--bk-ink)]">
                      {mission.progress}/{mission.goal}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-[11.5px] font-semibold"
                    style={{ color: done ? "var(--bk-accent)" : "var(--bk-faint)" }}
                  >
                    {done ? "달성 완료" : `${mission.daysLeft}일 남음`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 최근 인증 내역 */}
      <section className="px-5 pt-7">
        <SectionTitle
          title="최근 인증 내역"
          action="전체보기"
          onAction={() => onNavigate("record")}
        />
        <Card>
          {recent.map((log, index) => {
            const library = LIBRARIES.find((l) => l.id === log.libraryId);
            return (
              <div key={log.id}>
                {index > 0 && (
                  <div className="ml-[76px] h-px" style={{ background: "var(--bk-line-soft)" }} />
                )}
                <div className="flex items-center gap-3 p-3.5">
                  <img
                    src={photo(log.photoId, 120, 120)}
                    alt={log.photoAlt}
                    className="h-14 w-14 shrink-0 rounded-[10px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-[var(--bk-ink)]">
                      {log.title}
                    </p>
                    <p className="book-num mt-0.5 truncate text-[12px] text-[var(--bk-muted)]">
                      {log.finishedAt} | {library ? library.name : "자택"}
                    </p>
                  </div>
                  <Chip tone="read" icon="solar:verified-check-bold">
                    완독
                  </Chip>
                </div>
              </div>
            );
          })}
        </Card>
      </section>

      {/* 다음 달성 목표 */}
      <section className="px-5 pt-7">
        <SectionTitle title="다음 달성 목표" caption="조금만 더 모으면 받을 수 있어요" />
        <div className="grid gap-2.5">
          <Card onClick={() => onNavigate("rewards")} label="리워드 보기">
            <div className="flex items-center gap-3.5 p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: "var(--bk-gold-soft)" }}
              >
                <Icon icon="solar:gift-bold" width="22" height="22" color="var(--bk-gold)" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-[var(--bk-ink)]">
                  {USER.nextLevel}까지 <span className="book-num">{USER.nextLevelNeed}</span>권
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--bk-muted)]">
                  등급이 오르면 지역서점 도서교환권을 드립니다
                </p>
                <div className="mt-2.5">
                  <ProgressBar value={USER.levelStep} goal={USER.levelTotal} height={6} />
                </div>
              </div>
            </div>
          </Card>

          {nextReward && (
            <Card onClick={() => onNavigate("missionDetail", "m-event")} label="독서주간 이벤트 보기">
              <div className="flex items-center gap-3.5 p-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: "var(--bk-event-soft)" }}
                >
                  <Icon
                    icon="solar:calendar-mark-bold"
                    width="22"
                    height="22"
                    color="var(--bk-event)"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-[var(--bk-ink)]">
                    {nextReward.name}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[var(--bk-muted)]">
                    8월 24일 독서주간에 스탬프 랠리가 열립니다
                  </p>
                </div>
                <Chip tone="event">D-17</Chip>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
