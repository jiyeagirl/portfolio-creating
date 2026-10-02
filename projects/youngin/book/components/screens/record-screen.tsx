"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  BADGES,
  LIBRARIES,
  MONTH_STATS,
  READ_LOGS,
  THIS_MONTH,
  TIMELINE,
  USER,
  photo,
} from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import type { TimelineKind } from "@/projects/youngin/book/lib/types";
import { BadgeMark, Stamp } from "@/projects/youngin/book/components/stamp";
import {
  Card,
  Chip,
  ProgressBar,
  SectionTitle,
  Segmented,
  StatTile,
} from "@/projects/youngin/book/components/ui";

const TIMELINE_META: Record<TimelineKind, { icon: string; color: string; bg: string }> = {
  visit: { icon: "solar:map-point-bold", color: "var(--bk-visit)", bg: "var(--bk-visit-soft)" },
  read: { icon: "solar:book-2-bold", color: "var(--bk-read)", bg: "var(--bk-read-soft)" },
  badge: { icon: "solar:medal-star-bold", color: "var(--bk-gold)", bg: "var(--bk-gold-soft)" },
  mission: { icon: "solar:flag-2-bold", color: "var(--bk-accent)", bg: "var(--bk-accent-soft)" },
  reward: { icon: "solar:gift-bold", color: "var(--bk-gold)", bg: "var(--bk-gold-soft)" },
};

type View = "timeline" | "books";

export function RecordScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const [view, setView] = useState<View>("timeline");

  const visitedLibraries = LIBRARIES.filter((l) => l.visited);
  const earnedBadges = BADGES.filter((b) => b.earned);
  const maxReads = Math.max(...MONTH_STATS.map((s) => s.reads));

  return (
    <div className="book-enter min-h-full pb-[104px] pt-[59px]">
      {/* 프로필 */}
      <header className="flex items-start gap-3.5 px-5 pb-5 pt-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[20px] font-bold"
          style={{ background: "var(--bk-accent)", color: "var(--bk-on-accent)" }}
        >
          {USER.name.slice(1, 2)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--bk-ink)]">
              {USER.name}
            </h1>
            <Chip tone="gold" icon="solar:medal-star-bold">
              {USER.level}
            </Chip>
          </div>
          <p className="book-num mt-1 truncate text-[12.5px] text-[var(--bk-muted)]">
            {USER.joinedShort} 가입 | {USER.cardNo}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("share")}
          aria-label="독서기록 공유"
          className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-[var(--bk-surface-soft)]"
        >
          <Icon icon="solar:share-linear" width="21" height="21" color="var(--bk-ink)" />
        </button>
      </header>

      {/* 누적 스탯 */}
      <section className="px-5">
        <div className="flex gap-2">
          <StatTile value={USER.totalVisits} unit="회" label="누적 방문" />
          <StatTile value={USER.totalReads} unit="권" label="누적 완독" />
          <StatTile value={USER.totalStamps} unit="개" label="누적 스탬프" />
        </div>
      </section>

      {/* 등급 */}
      <section className="px-5 pt-3">
        <Card onClick={() => onNavigate("rewards")} label="리워드 보기">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-[var(--bk-ink)]">
                {USER.level}
                <span className="mx-1.5 text-[var(--bk-faint)]">/</span>
                <span className="text-[var(--bk-muted)]">{USER.nextLevel}까지</span>
                <span className="book-num ml-1 text-[var(--bk-accent)]">
                  {USER.nextLevelNeed}권
                </span>
              </p>
              <Icon
                icon="solar:alt-arrow-right-linear"
                width="18"
                height="18"
                color="var(--bk-faint)"
              />
            </div>
            <div className="mt-3">
              <ProgressBar value={USER.levelStep} goal={USER.levelTotal} height={8} />
            </div>
            <div className="book-num mt-2 flex justify-between text-[11px] font-medium text-[var(--bk-faint)]">
              <span>새싹</span>
              <span>잎사귀</span>
              <span style={{ color: "var(--bk-accent)" }}>은잎</span>
              <span>금잎</span>
              <span>고목</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 월별 활동 통계 */}
      <section className="px-5 pt-7">
        <SectionTitle title="월별 활동" caption="최근 6개월 방문과 완독" />
        <Card>
          <div className="p-4">
            <div className="flex items-end justify-between gap-2">
              {MONTH_STATS.map((stat) => {
                const isCurrent = stat.month === THIS_MONTH.short;
                return (
                  <div key={stat.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="book-num text-[11px] font-bold text-[var(--bk-muted)]">
                      {stat.reads}
                    </span>
                    <div className="flex h-[92px] w-full items-end justify-center gap-1">
                      <span
                        className="w-[9px] rounded-t-[3px]"
                        style={{
                          height: `${(stat.visits / maxReads) * 92}px`,
                          background: isCurrent ? "var(--bk-visit)" : "var(--bk-visit-soft)",
                        }}
                      />
                      <span
                        className="w-[9px] rounded-t-[3px]"
                        style={{
                          height: `${(stat.reads / maxReads) * 92}px`,
                          background: isCurrent ? "var(--bk-accent)" : "var(--bk-accent-soft)",
                        }}
                      />
                    </div>
                    <span
                      className="book-num text-[11px] font-semibold"
                      style={{
                        color: isCurrent ? "var(--bk-ink)" : "var(--bk-faint)",
                      }}
                    >
                      {stat.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-4 flex items-center gap-4 border-t pt-3"
              style={{ borderColor: "var(--bk-line-soft)" }}
            >
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--bk-muted)]">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: "var(--bk-visit)" }}
                />
                방문
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--bk-muted)]">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: "var(--bk-accent)" }}
                />
                완독
              </span>
              <span className="book-num ml-auto text-[11.5px] font-semibold text-[var(--bk-ink)]">
                8월 미션 달성률 {MONTH_STATS[5].missionRate}%
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* 방문한 도서관 */}
      <section className="pt-7">
        <div className="px-5">
          <SectionTitle
            title="방문한 도서관"
            caption={`${visitedLibraries.length}곳 / 전체 ${LIBRARIES.length}곳`}
            action="스탬프판"
            onAction={() => onNavigate("collection")}
          />
        </div>
        <div className="book-scroll-x flex gap-3 overflow-x-auto px-5">
          {visitedLibraries.map((library) => (
            <button
              key={library.id}
              type="button"
              onClick={() => onNavigate("libraryDetail", library.id)}
              className="flex w-[124px] shrink-0 flex-col items-center gap-2 rounded-[14px] border border-[var(--bk-line)] bg-[var(--bk-surface)] p-3 transition-transform duration-150 active:scale-[0.97]"
            >
              <Stamp
                label={library.short}
                date={library.lastVisitedAt}
                seed={library.id}
                size={72}
              />
              <span className="mt-1 line-clamp-1 text-[12.5px] font-semibold text-[var(--bk-ink)]">
                {library.name}
              </span>
              <span className="book-num text-[11px] text-[var(--bk-muted)]">
                {library.visitCount}회 방문
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 획득 배지 */}
      <section className="px-5 pt-7">
        <SectionTitle
          title="획득한 배지"
          caption={`${earnedBadges.length}개 / 전체 ${BADGES.length}개`}
          action="전체보기"
          onAction={() => onNavigate("collection")}
        />
        <div className="book-scroll-x flex gap-2.5 overflow-x-auto">
          {BADGES.map((badge) => (
            <div key={badge.id} className="flex w-[74px] shrink-0 flex-col items-center gap-1.5">
              <BadgeMark tier={badge.tier} icon={badge.icon} earned={badge.earned} size={54} />
              <span
                className="text-center text-[11px] font-semibold leading-[1.35]"
                style={{ color: badge.earned ? "var(--bk-body)" : "var(--bk-faint)" }}
              >
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 타임라인 / 완독 도서 */}
      <section className="px-5 pt-7">
        <SectionTitle title="독서 타임라인" />
        <div className="mb-3.5">
          <Segmented
            options={[
              { key: "timeline" as View, label: "전체 활동" },
              { key: "books" as View, label: `완독 도서 ${READ_LOGS.length}권` },
            ]}
            value={view}
            onChange={setView}
          />
        </div>

        {view === "timeline" ? (
          <div className="relative pl-[30px]">
            <span
              className="absolute bottom-3 left-[13px] top-3 w-px"
              style={{ background: "var(--bk-line)" }}
              aria-hidden
            />
            <div className="grid gap-3">
              {TIMELINE.map((entry, index) => {
                const meta = TIMELINE_META[entry.kind];
                return (
                  <div
                    key={entry.id}
                    className="book-enter relative"
                    style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
                  >
                    <span
                      className="absolute -left-[30px] top-3.5 flex h-[27px] w-[27px] items-center justify-center rounded-full border-2"
                      style={{ background: meta.bg, borderColor: "var(--bk-canvas)" }}
                    >
                      <Icon icon={meta.icon} width="14" height="14" color={meta.color} />
                    </span>
                    <Card>
                      <div className="flex items-center gap-3 p-3.5">
                        <div className="min-w-0 flex-1">
                          <p className="book-num text-[11.5px] font-semibold text-[var(--bk-faint)]">
                            {entry.date}
                          </p>
                          <p className="mt-1 text-[14.5px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                            {entry.title}
                          </p>
                          <p className="book-num mt-1 text-[12.5px] text-[var(--bk-muted)]">
                            {entry.detail}
                          </p>
                        </div>
                        {entry.photoId && (
                          <img
                            src={photo(entry.photoId, 120, 120)}
                            alt={entry.photoAlt ?? ""}
                            className="h-[52px] w-[52px] shrink-0 rounded-[8px] object-cover"
                          />
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {READ_LOGS.map((log, index) => {
              const library = LIBRARIES.find((l) => l.id === log.libraryId);
              return (
                <Card
                  key={log.id}
                  className="book-enter"
                  style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
                >
                  <img
                    src={photo(log.photoId, 360, 240)}
                    alt={log.photoAlt}
                    className="h-[104px] w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                      {log.title}
                    </p>
                    <p className="mt-1 truncate text-[11.5px] text-[var(--bk-muted)]">
                      {log.author}
                    </p>
                    <p className="book-num mt-2 truncate text-[11px] text-[var(--bk-faint)]">
                      {log.finishedAt} | {library ? library.short : "자택"}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* 바로가기 */}
      <section className="grid gap-2.5 px-5 pt-7">
        {[
          {
            id: "collection",
            title: "스탬프 / 배지 모음",
            detail: "지점 스탬프판과 배지 도감",
            icon: "solar:verified-check-linear",
          },
          {
            id: "rewards",
            title: "리워드 내역",
            detail: "받은 리워드와 사용 기록",
            icon: "solar:gift-linear",
          },
          {
            id: "share",
            title: "가족, 친구와 공유",
            detail: "독서기록 카드로 만들어 보내기",
            icon: "solar:users-group-rounded-linear",
          },
        ].map((row) => (
          <Card
            key={row.id}
            onClick={() => onNavigate(row.id as "collection" | "rewards" | "share")}
            label={row.title}
          >
            <div className="flex min-h-[60px] items-center gap-3 px-4 py-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: "var(--bk-surface-soft)" }}
              >
                <Icon icon={row.icon} width="19" height="19" color="var(--bk-accent)" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold text-[var(--bk-ink)]">
                  {row.title}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-[var(--bk-muted)]">
                  {row.detail}
                </span>
              </span>
              <Icon
                icon="solar:alt-arrow-right-linear"
                width="18"
                height="18"
                color="var(--bk-faint)"
              />
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
