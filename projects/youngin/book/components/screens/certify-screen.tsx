"use client";

import { Icon } from "@iconify/react";
import { MISSIONS, THIS_MONTH, photo } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate, BookScreen } from "@/projects/youngin/book/lib/navigation";
import { Card, Chip, InfoNote, ProgressBar, SectionTitle } from "@/projects/youngin/book/components/ui";

const WAYS: {
  id: string;
  screen: BookScreen;
  missionId?: string;
  title: string;
  detail: string;
  icon: string;
  reward: string;
}[] = [
  {
    id: "visit",
    screen: "scan",
    title: "도서관 방문 인증",
    detail: "지점 입구에 설치된 QR을 스캔합니다",
    icon: "solar:qr-code-bold",
    reward: "방문 스탬프 1개",
  },
  {
    id: "read",
    screen: "bookCertify",
    title: "완독 인증",
    detail: "다 읽은 책 표지를 찍고 제목과 한 줄 감상을 남깁니다",
    icon: "solar:camera-bold",
    reward: "완독 스탬프 1개",
  },
  {
    id: "mission",
    screen: "missionDetail",
    missionId: "m-recommend",
    title: "월간 미션 인증",
    detail: "이달의 추천도서, 테마 미션, 특별 이벤트에 참여합니다",
    icon: "solar:flag-2-bold",
    reward: "미션 스탬프 및 배지",
  },
];

export function CertifyScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const openMissions = MISSIONS.filter((m) => m.progress < m.goal);

  return (
    <div className="book-enter min-h-full pb-[104px] pt-[59px]">
      <header className="px-5 pb-5 pt-4">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--bk-ink)]">
          인증하기
        </h1>
        <p className="mt-1 text-[13px] text-[var(--bk-muted)]">
          방문과 완독을 남기면 그대로 독서기록이 됩니다
        </p>
      </header>

      {/* 이번 달 인증 현황 */}
      <section className="px-5">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-[var(--bk-ink)]">
                {THIS_MONTH.label} 인증 현황
              </p>
              <span className="book-num text-[12px] font-medium text-[var(--bk-muted)]">
                {THIS_MONTH.daysLeft}일 남음
              </span>
            </div>
            <div className="mt-3.5 flex divide-x" style={{ borderColor: "var(--bk-line-soft)" }}>
              {[
                { label: "방문 인증", value: THIS_MONTH.visitedLibraries, unit: "곳" },
                { label: "완독 인증", value: THIS_MONTH.reads, unit: "권" },
                { label: "미션 달성", value: 1, unit: "개" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${index === 0 ? "pr-3" : "px-3"}`}
                  style={{ borderColor: "var(--bk-line-soft)" }}
                >
                  <p className="book-num text-[24px] font-bold leading-none tracking-[-0.02em] text-[var(--bk-ink)]">
                    {stat.value}
                    <span className="ml-0.5 text-[12.5px] font-semibold text-[var(--bk-muted)]">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[11.5px] font-medium text-[var(--bk-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 인증 방식 3가지 */}
      <section className="px-5 pt-7">
        <SectionTitle title="무엇을 인증할까요" />
        <div className="grid gap-3">
          {WAYS.map((way, index) => (
            <button
              key={way.id}
              type="button"
              onClick={() => onNavigate(way.screen, way.missionId)}
              className="book-enter flex items-center gap-4 rounded-[14px] border border-[var(--bk-line)] bg-[var(--bk-surface)] p-4 text-left transition-transform duration-150 active:scale-[0.98]"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span
                className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[14px]"
                style={{
                  background: index === 0 ? "var(--bk-accent)" : "var(--bk-accent-soft)",
                }}
              >
                <Icon
                  icon={way.icon}
                  width="27"
                  height="27"
                  color={index === 0 ? "var(--bk-on-accent)" : "var(--bk-accent)"}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold tracking-[-0.01em] text-[var(--bk-ink)]">
                  {way.title}
                </span>
                <span className="mt-1 block text-[12.5px] leading-[1.5] text-[var(--bk-muted)]">
                  {way.detail}
                </span>
                <span className="mt-2 inline-flex">
                  <Chip tone="read" icon="solar:verified-check-bold">
                    {way.reward}
                  </Chip>
                </span>
              </span>
              <Icon
                icon="solar:alt-arrow-right-linear"
                width="20"
                height="20"
                color="var(--bk-faint)"
              />
            </button>
          ))}
        </div>
      </section>

      {/* 인증 방법 안내 */}
      <section className="px-5 pt-7">
        <SectionTitle title="처음이신가요" caption="세 단계면 끝납니다" />
        <Card>
          <div className="relative h-[132px] w-full">
            <img
              src={photo(504, 786, 264)}
              alt="원목 테이블에서 스마트폰을 든 손"
              className="h-full w-full object-cover"
            />
          </div>
          <ol className="p-4">
            {[
              "도서관에 도착하면 입구 안내판의 QR을 카메라로 비춥니다",
              "지점이 자동으로 인식되고 방문 스탬프가 적립됩니다",
              "책을 다 읽으면 표지 사진과 제목으로 완독 인증을 올립니다",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 py-2">
                <span
                  className="book-num flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{ background: "var(--bk-accent-soft)", color: "var(--bk-accent)" }}
                >
                  {index + 1}
                </span>
                <p className="text-[13.5px] leading-[1.55] text-[var(--bk-body)]">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* 진행 중 미션 */}
      <section className="px-5 pt-7">
        <SectionTitle
          title="아직 남은 미션"
          caption={`${openMissions.length}개 미션이 진행 중입니다`}
        />
        <Card>
          {openMissions.map((mission, index) => (
            <div key={mission.id}>
              {index > 0 && (
                <div className="ml-4 h-px" style={{ background: "var(--bk-line-soft)" }} />
              )}
              <button
                type="button"
                onClick={() => onNavigate("missionDetail", mission.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-[var(--bk-surface-soft)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold text-[var(--bk-ink)]">
                    {mission.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={mission.progress} goal={mission.goal} height={6} />
                    <span className="book-num shrink-0 text-[11.5px] font-bold text-[var(--bk-muted)]">
                      {mission.progress}/{mission.goal}
                      {mission.unit}
                    </span>
                  </div>
                </div>
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width="18"
                  height="18"
                  color="var(--bk-faint)"
                />
              </button>
            </div>
          ))}
        </Card>
      </section>

      <section className="px-5 pt-4">
        <InfoNote icon="solar:shield-check-linear">
          인증 사진과 기록은 용인시 독서문화진흥 통계로만 집계되며, 개인 정보는 다른 이용자에게
          공개되지 않습니다.
        </InfoNote>
      </section>
    </div>
  );
}
