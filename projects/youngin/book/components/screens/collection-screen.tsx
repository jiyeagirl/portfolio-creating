"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { BADGES, LIBRARIES, READ_LOGS, USER } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import { BadgeMark, EmptyStamp, Stamp, TIER_NAME } from "@/projects/youngin/book/components/stamp";
import {
  Card,
  Chip,
  InfoNote,
  ProgressBar,
  ScreenHeader,
  SectionTitle,
  Segmented,
} from "@/projects/youngin/book/components/ui";

type View = "stamps" | "badges";

export function CollectionScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const [view, setView] = useState<View>("stamps");

  const visited = LIBRARIES.filter((l) => l.visited).length;
  const earned = BADGES.filter((b) => b.earned);
  const locked = BADGES.filter((b) => !b.earned);

  return (
    <div className="book-enter min-h-full pb-[104px]">
      <ScreenHeader
        title="스탬프 / 배지"
        subtitle={`누적 스탬프 ${USER.totalStamps}개`}
        onBack={() => onNavigate("record")}
      />

      <div className="px-5 pt-5">
        <Segmented
          options={[
            { key: "stamps" as View, label: `지점 스탬프 ${visited}/${LIBRARIES.length}` },
            { key: "badges" as View, label: `배지 ${earned.length}/${BADGES.length}` },
          ]}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "stamps" ? (
        <>
          {/* 스탬프판 */}
          <section className="px-5 pt-5">
            <Card>
              <div className="p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[var(--bk-muted)]">
                      전 지점 순회 진행률
                    </p>
                    <p className="book-num mt-1 text-[26px] font-bold leading-none tracking-[-0.02em] text-[var(--bk-ink)]">
                      {visited}
                      <span className="text-[15px] font-semibold text-[var(--bk-muted)]">
                        /{LIBRARIES.length}곳
                      </span>
                    </p>
                  </div>
                  <Chip tone="gold" icon="solar:route-linear">
                    완주 시 지점 순회 배지
                  </Chip>
                </div>
                <div className="mt-3.5">
                  <ProgressBar value={visited} goal={LIBRARIES.length} height={9} />
                </div>
              </div>
            </Card>
          </section>

          <section className="px-5 pt-5">
            <SectionTitle
              title="용인시 공공도서관 스탬프판"
              caption="지점에서 QR을 찍으면 도장이 찍힙니다"
            />
            <div
              className="rounded-[14px] border p-4"
              style={{ borderColor: "var(--bk-line)", background: "var(--bk-surface)" }}
            >
              <div className="grid grid-cols-3 gap-x-2 gap-y-5">
                {LIBRARIES.map((library) => (
                  <button
                    key={library.id}
                    type="button"
                    onClick={() => onNavigate("libraryDetail", library.id)}
                    className="flex flex-col items-center gap-2 transition-transform duration-150 active:scale-[0.95]"
                  >
                    {library.visited ? (
                      <Stamp
                        label={library.short}
                        date={library.lastVisitedAt}
                        seed={library.id}
                        size={84}
                      />
                    ) : (
                      <EmptyStamp label={library.short} size={84} />
                    )}
                    <span
                      className="line-clamp-1 text-[11.5px] font-semibold"
                      style={{
                        color: library.visited ? "var(--bk-ink)" : "var(--bk-faint)",
                      }}
                    >
                      {library.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 완독 스탬프 */}
          <section className="px-5 pt-7">
            <SectionTitle
              title="완독 스탬프"
              caption={`최근 ${READ_LOGS.length}권의 완독 도장`}
            />
            <div
              className="rounded-[14px] border p-4"
              style={{ borderColor: "var(--bk-line)", background: "var(--bk-surface)" }}
            >
              <div className="grid grid-cols-3 gap-x-2 gap-y-5">
                {READ_LOGS.map((log) => (
                  <div key={log.id} className="flex flex-col items-center gap-2">
                    <Stamp
                      label="완독"
                      kind="read"
                      date={`2026.${log.finishedAt.replace("월 ", ".").replace("일", "")}`}
                      seed={log.id}
                      size={84}
                    />
                    <span className="line-clamp-1 text-[11.5px] font-semibold text-[var(--bk-ink)]">
                      {log.title}
                    </span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <EmptyStamp label="다음" size={84} />
                  <span className="text-[11.5px] font-semibold text-[var(--bk-faint)]">
                    다음 한 권
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pt-5">
            <InfoNote icon="solar:verified-check-linear">
              같은 지점을 다시 방문해도 스탬프는 하루 한 번만 적립됩니다. 신규 지점은 2배로
              적립됩니다.
            </InfoNote>
          </section>
        </>
      ) : (
        <>
          {/* 획득 배지 */}
          <section className="px-5 pt-5">
            <SectionTitle title="획득한 배지" caption={`${earned.length}개`} />
            <div className="grid gap-2.5">
              {earned.map((badge, index) => (
                <Card
                  key={badge.id}
                  className="book-enter"
                  style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
                >
                  <div className="flex items-center gap-3.5 p-4">
                    <BadgeMark tier={badge.tier} icon={badge.icon} earned size={52} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-[var(--bk-ink)]">
                          {badge.name}
                        </p>
                        <Chip tone="gold">{TIER_NAME(badge.tier)}</Chip>
                      </div>
                      <p className="mt-1 text-[12.5px] text-[var(--bk-muted)]">
                        {badge.description}
                      </p>
                      <p className="book-num mt-1 text-[11.5px] font-medium text-[var(--bk-faint)]">
                        {badge.earnedAt} 획득
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 미획득 배지 */}
          <section className="px-5 pt-7">
            <SectionTitle title="아직 못 받은 배지" caption={`${locked.length}개`} />
            <div className="grid gap-2.5">
              {locked.map((badge) => (
                <Card key={badge.id}>
                  <div className="flex items-center gap-3.5 p-4">
                    <BadgeMark tier={badge.tier} icon={badge.icon} earned={false} size={52} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-[var(--bk-muted)]">
                          {badge.name}
                        </p>
                        <Icon
                          icon="solar:lock-keyhole-minimalistic-linear"
                          width="14"
                          height="14"
                          color="var(--bk-faint)"
                        />
                      </div>
                      <p className="mt-1 text-[12.5px] text-[var(--bk-muted)]">
                        {badge.description}
                      </p>
                      {badge.progress && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <ProgressBar
                            value={badge.progress.current}
                            goal={badge.progress.goal}
                            height={6}
                            fill="var(--bk-faint)"
                          />
                          <span className="book-num shrink-0 text-[11.5px] font-bold text-[var(--bk-muted)]">
                            {badge.progress.current}/{badge.progress.goal}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
