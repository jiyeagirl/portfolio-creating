"use client";

import { useState } from "react";
import Image from "next/image";
import { DownloadSimple, Link as LinkIcon, ShareNetwork } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { MONTHLY_STATS, VISITS } from "@/projects/youngin/child/lib/mock-data";
import { CATEGORY_LABEL, withCompanion } from "@/projects/youngin/child/lib/navigation";
import type { ChildNavigate } from "@/projects/youngin/child/lib/navigation";
import type { Child } from "@/projects/youngin/child/lib/types";
import { Card, FacilityThumb, FilterChips } from "@/projects/youngin/child/components/ui";

export function RecordScreen({
  child,
  onNavigate,
}: {
  child: Child;
  onNavigate: ChildNavigate;
}) {
  const [month, setMonth] = useState<string>("all");

  const visits = VISITS[child.id] ?? [];
  const stats = MONTHLY_STATS[child.id] ?? [];
  const shown = month === "all" ? visits : visits.filter((visit) => visit.month === month);
  const shownStats = month === "all" ? stats : stats.filter((stat) => stat.month === month);

  const totals = shownStats.reduce(
    (acc, stat) => ({
      visits: acc.visits + stat.visits,
      stamps: acc.stamps + stat.stamps,
    }),
    { visits: 0, stamps: 0 },
  );
  const facilityCount = new Set(shown.map((visit) => visit.facilityId)).size;

  // 월 묶음 헤더는 타임라인을 훑을 때 시간 감각을 준다. 전체 보기일 때만 나눈다.
  const groups =
    month === "all"
      ? stats
          .map((stat) => ({
            stat,
            items: visits.filter((visit) => visit.month === stat.month),
          }))
          .filter((group) => group.items.length > 0)
      : [{ stat: shownStats[0], items: shown }];

  const photos = shown.filter((visit) => visit.photo !== undefined);

  return (
    <div className="min-h-full bg-[var(--yc-canvas)] pb-[104px]">
      <ScreenHeader
        title="나들이 기록"
        subtitle={`${withCompanion(child.name)} 다녀온 ${visits.length}번의 나들이`}
        className="bg-[var(--yc-surface)] border-[var(--yc-hairline)]"
        titleClassName="text-[16px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]"
        subtitleClassName="text-[11px] text-[var(--yc-mute)]"
      />

      <div className="pt-5">
        <FilterChips
          value={month}
          onChange={setMonth}
          items={[
            { key: "all", label: "전체", count: visits.length },
            ...stats.map((stat) => ({
              key: stat.month,
              label: stat.label,
              count: stat.visits,
            })),
          ]}
        />
      </div>

      {/* ── 요약 ── */}
      <section className="mt-4 px-5">
        <Card className="flex items-stretch p-1.5">
          {[
            { label: "방문 횟수", value: totals.visits, unit: "회" },
            { label: "방문 시설", value: facilityCount, unit: "곳" },
            { label: "획득 도장", value: totals.stamps, unit: "개" },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`flex-1 px-3 py-3 text-center ${
                index === 1 ? "border-x border-[var(--yc-hairline)]" : ""
              }`}
            >
              <p className="text-[11.5px] text-[var(--yc-mute)]">{item.label}</p>
              <p className="yc-num mt-1 text-[20px] font-bold leading-6 text-[var(--yc-ink)]">
                {item.value}
                <span className="ml-0.5 text-[12px] font-semibold text-[var(--yc-body)]">
                  {item.unit}
                </span>
              </p>
            </div>
          ))}
        </Card>
      </section>

      {/* ── 타임라인 ── */}
      <section className="mt-8">
        <h2 className="px-5 text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
          방문 타임라인
        </h2>

        {groups.map((group) => (
          <div key={group.stat.month} className="mt-4">
            <div className="flex items-baseline justify-between gap-3 px-5">
              <h3 className="yc-num text-[14px] font-bold text-[var(--yc-ink)]">
                {group.stat.label}
              </h3>
              <p className="yc-num text-[11.5px] text-[var(--yc-mute)]">
                방문 {group.stat.visits}회 | 시설 {group.stat.facilities}곳 | 도장{" "}
                {group.stat.stamps}개
              </p>
            </div>

            <ol className="relative mt-3 px-5">
              {group.items.map((visit, index) => {
                const last = index === group.items.length - 1;
                return (
                  <li key={visit.id} className="relative flex gap-3 pb-3 last:pb-0">
                    {!last && (
                      <span className="absolute bottom-0 left-[5px] top-5 w-px bg-[var(--yc-hairline)]" />
                    )}
                    <span className="yc-b-accent relative z-10 mt-[7px] h-[11px] w-[11px] shrink-0 rounded-full border-[2.5px] bg-[var(--yc-surface)]" />
                    <button
                      type="button"
                      onClick={() => onNavigate("facility", { facilityId: visit.facilityId })}
                      className="flex flex-1 items-center gap-3 rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] p-2.5 text-left transition-colors active:bg-[var(--yc-surface-soft)]"
                    >
                      <FacilityThumb
                        category={visit.category}
                        photo={visit.photo}
                        name={visit.facilityName}
                        width={56}
                        height={56}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="yc-num text-[11.5px] font-semibold text-[var(--yc-mute)]">
                          {visit.date} | {CATEGORY_LABEL[visit.category]}
                        </p>
                        <p className="mt-0.5 truncate text-[14px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]">
                          {visit.facilityName}
                        </p>
                        <p className="truncate text-[12px] text-[var(--yc-body)]">{visit.note}</p>
                      </div>
                      <span className="yc-num shrink-0 rounded-full bg-[var(--yc-stamp-soft)] px-2 py-1 text-[11.5px] font-bold text-[var(--yc-stamp)]">
                        도장 {visit.stamps}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>

      {/* ── 추억 보기 ── */}
      <section className="mt-9 px-5">
        <h2 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
          추억 보기
        </h2>
        <p className="mt-1 text-[12.5px] text-[var(--yc-mute)]">
          인증할 때 올린 사진만 모았습니다. 사진 없이 인증한 방문은 빠져 있어요.
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {photos.map((visit) => (
            <button
              key={visit.id}
              type="button"
              className="relative aspect-square overflow-hidden rounded-[12px] transition-transform active:scale-[0.98]"
            >
              <Image
                src={`https://picsum.photos/id/${visit.photo}/240/240`}
                alt={`${visit.date} ${visit.facilityName} 인증 사진`}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
              <span className="yc-num absolute bottom-1 left-1 rounded-full bg-[rgba(28,32,28,0.6)] px-1.5 py-0.5 text-[9.5px] font-semibold text-white">
                {visit.date.slice(0, 5)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {[
            { icon: ShareNetwork, label: "가족 공유" },
            { icon: LinkIcon, label: "링크 복사" },
            { icon: DownloadSimple, label: "이미지 저장" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--yc-hairline)] bg-[var(--yc-surface)] text-[12.5px] font-bold text-[var(--yc-body)] transition-colors active:bg-[var(--yc-surface-soft)]"
            >
              <item.icon size={15} weight="bold" />
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11.5px] leading-4 text-[var(--yc-mute)]">
          공유 링크는 7일 뒤 자동으로 만료됩니다.
        </p>
      </section>
    </div>
  );
}
