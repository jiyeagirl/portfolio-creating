"use client";

import { useState } from "react";
import { CaretRight, CheckCircle, LockSimple, SealCheck } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { getFacility, MISSIONS } from "@/projects/youngin/child/lib/mock-data";
import {
  BAND_LABEL,
  formatDuration,
  MISSION_KIND_LABEL,
  withSubject,
} from "@/projects/youngin/child/lib/navigation";
import type { ChildNavigate } from "@/projects/youngin/child/lib/navigation";
import type { Child, MissionKind } from "@/projects/youngin/child/lib/types";
import { Card, Chip, FilterChips, Progress } from "@/projects/youngin/child/components/ui";

type Filter = "all" | MissionKind;

export function MissionScreen({
  child,
  onNavigate,
}: {
  child: Child;
  onNavigate: ChildNavigate;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  // 열린 미션은 현재 밴드 기준, 잠금 미션은 "다음 밴드에 열리는 것"만 예고로 보여준다.
  // 완주가 아니라 연령대가 바뀔 때마다 새로 열리는 구조라는 걸 화면으로 드러내는 부분이다.
  const open = MISSIONS.filter(
    (mission) => mission.bands.includes(child.band) && mission.state !== "locked",
  );
  const locked = MISSIONS.filter(
    (mission) => mission.state === "locked" && mission.unlockBand === child.nextBand,
  );

  const done = open.filter((mission) => mission.state === "done");
  const active = open.filter((mission) => mission.state === "active");
  const pendingStamps = active.reduce((sum, mission) => sum + mission.stamps, 0);
  const visible = filter === "all" ? open : open.filter((mission) => mission.kind === filter);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "전체", count: open.length },
    { key: "visit", label: "방문", count: open.filter((m) => m.kind === "visit").length },
    { key: "season", label: "시즌", count: open.filter((m) => m.kind === "season").length },
    { key: "age", label: "연령별", count: open.filter((m) => m.kind === "age").length },
  ];

  return (
    <div className="min-h-full bg-[var(--yc-canvas)] pb-[104px]">
      <ScreenHeader
        title="미션"
        subtitle={`${child.name} | ${BAND_LABEL[child.band]} 기준`}
        className="bg-[var(--yc-surface)] border-[var(--yc-hairline)]"
        titleClassName="text-[16px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]"
        subtitleClassName="text-[11px] text-[var(--yc-mute)]"
      />

      {/* ── 완료 현황 ── */}
      <section className="px-5 pt-5">
        <div className="rounded-[20px] bg-[var(--yc-accent)] p-5 text-[var(--yc-on-accent)]">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold text-white/80">이번 연령대 진행률</p>
            <p className="yc-num text-[13px] font-bold">
              {done.length} / {open.length}
            </p>
          </div>
          <p className="mt-2 text-[24px] font-bold leading-7 tracking-[-0.03em]">
            {Math.round((done.length / Math.max(1, open.length)) * 100)}% 완료
          </p>
          <div className="mt-3">
            <Progress
              value={(done.length / Math.max(1, open.length)) * 100}
              tone="onAccent"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
            <div>
              <p className="text-[11.5px] text-white/60">남은 미션</p>
              <p className="yc-num mt-0.5 text-[19px] font-bold leading-6">
                {active.length}
                <span className="ml-0.5 text-[13px] font-semibold">개</span>
              </p>
            </div>
            <div className="border-l border-white/15 pl-3">
              <p className="text-[11.5px] text-white/60">완료 예정 리워드</p>
              <p className="yc-num mt-0.5 text-[19px] font-bold leading-6">
                도장 {pendingStamps}
                <span className="ml-0.5 text-[13px] font-semibold">개</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 필터 ── */}
      <div className="mt-6">
        <FilterChips value={filter} items={filters} onChange={setFilter} />
      </div>

      {/* ── 미션 목록 ── */}
      <ul className="mt-4 space-y-2 px-5">
        {visible.map((mission) => {
          const isDone = mission.state === "done";
          const facility = mission.facilityId ? getFacility(mission.facilityId) : undefined;
          return (
            <li key={mission.id}>
              <button
                type="button"
                onClick={() =>
                  facility ? onNavigate("facility", { facilityId: facility.id }) : undefined
                }
                className="w-full rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] p-4 text-left transition-colors active:bg-[var(--yc-surface-soft)]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-[var(--yc-accent-soft)] text-[var(--yc-accent)]"
                        : "bg-[var(--yc-stamp-soft)] text-[var(--yc-stamp)]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle size={17} weight="fill" />
                    ) : (
                      <SealCheck size={16} weight="bold" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Chip tone={mission.kind === "season" ? "stamp" : "accent"}>
                        {MISSION_KIND_LABEL[mission.kind]}
                      </Chip>
                      {mission.dueLabel && <Chip tone="soft">{mission.dueLabel}</Chip>}
                      {isDone && mission.completedAt && (
                        <span className="yc-num text-[11.5px] font-semibold text-[var(--yc-mute)]">
                          {mission.completedAt} 완료
                        </span>
                      )}
                    </div>

                    <h3
                      className={`mt-2 text-[15px] font-bold leading-5 tracking-[-0.02em] ${
                        isDone ? "text-[var(--yc-mute)] line-through" : "text-[var(--yc-ink)]"
                      }`}
                    >
                      {mission.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--yc-body)]">
                      {mission.detail}
                    </p>

                    {mission.progress && !isDone && (
                      <div className="mt-2.5">
                        <Progress
                          value={(mission.progress.done / mission.progress.goal) * 100}
                          height={5}
                          tone={mission.kind === "season" ? "stamp" : "accent"}
                        />
                        <p className="yc-num mt-1.5 text-[11.5px] text-[var(--yc-mute)]">
                          {mission.progress.done} / {mission.progress.goal}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--yc-hairline)] pt-2.5">
                      <span className="min-w-0 truncate text-[12px] text-[var(--yc-mute)]">
                        {facility ? facility.name : "시설 상관없이 참여"}
                      </span>
                      <span className="flex shrink-0 items-center gap-0.5 text-[12px] font-bold text-[var(--yc-stamp)]">
                        {mission.reward}
                        {facility && <CaretRight size={11} weight="bold" />}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── 잠금 미션 ── */}
      {locked.length > 0 && child.nextBand && (
        <section className="mt-8 px-5">
          <h2 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
            {formatDuration(child.monthsToNextBand)} 뒤에 열리는 미션
          </h2>
          <p className="mt-1 text-[12.5px] leading-5 text-[var(--yc-mute)]">
            {withSubject(child.name)} {withSubject(BAND_LABEL[child.nextBand])} 되면 아래 미션이 자동으로 열립니다.
          </p>
          <ul className="mt-3 space-y-2">
            {locked.map((mission) => (
              <li key={mission.id}>
                <Card tone="dashed" className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--yc-lock-soft)] text-[var(--yc-lock)]">
                    <LockSimple size={15} weight="bold" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Chip tone="lock">{BAND_LABEL[mission.unlockBand ?? child.band]} 미션</Chip>
                      <Chip tone="lock">{mission.reward}</Chip>
                    </div>
                    <h3 className="mt-2 text-[15px] font-bold leading-5 tracking-[-0.02em] text-[var(--yc-body)]">
                      {mission.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--yc-mute)]">
                      {mission.detail}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 px-5 text-[11.5px] leading-4 text-[var(--yc-mute)]">
        미션은 완주형이 아닙니다. 연령대가 바뀌면 지난 미션은 기록으로 남고 새 미션이 열립니다.
      </p>
    </div>
  );
}
