"use client";

import { Icon } from "@iconify/react";
import { ProgressBar } from "@/projects/youngin/festival/components/ui";
import {
  BADGES,
  FESTIVAL,
  MISSIONS,
  getFacility,
  getMission,
} from "@/projects/youngin/festival/lib/mock-data";
import type { FestivalNavigate } from "@/projects/youngin/festival/lib/navigation";

export function MissionDoneScreen({
  missionId,
  doneIds,
  onNavigate,
}: {
  missionId?: string;
  doneIds: string[];
  onNavigate: FestivalNavigate;
}) {
  const mission = getMission(missionId ?? "m-medical");
  const facility = getFacility(mission.facilityId);
  const doneCount = doneIds.length;
  const percent = Math.round((doneCount / MISSIONS.length) * 100);
  const earned = BADGES.filter((b) => b.require === doneCount);
  const nextBadge = BADGES.find((b) => b.require > doneCount);
  const nextMission = MISSIONS.find((m) => !doneIds.includes(m.id));

  return (
    <div
      className="relative flex h-full w-full flex-col px-6 pb-[46px] pt-[104px]"
      style={{ background: "var(--fs-dark)" }}
    >
      <div className="flex flex-1 flex-col items-center text-center">
        <div
          className="fs-stamp flex h-[104px] w-[104px] items-center justify-center rounded-full"
          style={{
            background: "var(--fs-accent)",
            color: "var(--fs-on-accent)",
            boxShadow: "0 0 0 10px rgba(179,51,43,0.18)",
          }}
        >
          <Icon icon="solar:check-read-bold" width="52" height="52" />
        </div>

        <p
          className="mt-6 text-[12.5px] font-bold tracking-[0.06em]"
          style={{ color: "var(--fs-accent)" }}
        >
          MISSION COMPLETE
        </p>
        <h1
          className="mt-2 text-[24px] font-bold leading-[31px]"
          style={{ color: "var(--fs-on-dark)" }}
        >
          {mission.title}
        </h1>
        <p
          className="festival-num mt-2 text-[13px]"
          style={{ color: "var(--fs-on-dark-muted)" }}
        >
          {facility.zone}구역 {facility.name} | {FESTIVAL.today} {FESTIVAL.now}
        </p>

        {earned.length > 0 && (
          <div
            className="mt-6 w-full rounded-[14px] px-4 py-4"
            style={{ background: "var(--fs-gold)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.22)", color: "#ffffff" }}
              >
                <Icon icon={earned[0].icon} width="24" height="24" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11.5px] font-bold text-white opacity-80">새 배지 획득</p>
                <p className="mt-0.5 truncate text-[16px] font-bold text-white">
                  {earned[0].name}
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className="mt-6 w-full rounded-[14px] px-4 py-4 text-left"
          style={{ background: "var(--fs-dark-soft)" }}
        >
          <div className="flex items-end justify-between">
            <p className="text-[12.5px] font-semibold" style={{ color: "var(--fs-on-dark-muted)" }}>
              오늘의 미션 진행률
            </p>
            <p
              className="festival-num text-[15px] font-bold"
              style={{ color: "var(--fs-on-dark)" }}
            >
              {doneCount} / {MISSIONS.length}
            </p>
          </div>
          <div className="mt-2.5">
            <ProgressBar percent={percent} />
          </div>
          <p
            className="mt-2.5 text-[12px] leading-[17px]"
            style={{ color: "var(--fs-on-dark-muted)" }}
          >
            {nextBadge
              ? `${nextBadge.require - doneCount}개 더 완료하면 ${nextBadge.name} 배지를 받습니다.`
              : "모든 미션을 완료했습니다. 종합안내소에서 기념품을 받아 가세요."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {nextMission && (
          <button
            type="button"
            onClick={() => onNavigate("map", nextMission.facilityId)}
            className="flex min-h-[50px] w-full items-center justify-center gap-1.5 rounded-[12px] text-[15px] font-bold transition-transform duration-150 active:scale-[0.98]"
            style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
          >
            <Icon icon="solar:route-bold" width="19" height="19" />
            다음 미션 위치 보기
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate("mission")}
          className="flex min-h-[50px] w-full items-center justify-center rounded-[12px] text-[15px] font-bold transition-transform duration-150 active:scale-[0.98]"
          style={{ background: "var(--fs-dark-soft)", color: "var(--fs-on-dark)" }}
        >
          미션 목록으로
        </button>
      </div>
    </div>
  );
}
