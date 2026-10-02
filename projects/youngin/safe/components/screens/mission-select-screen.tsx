"use client";

import { useState } from "react";
import {
  ArrowRight,
  Buildings,
  CaretRight,
  CheckCircle,
  Database,
  Heartbeat,
  Lightning,
  ListChecks,
  Medal,
  Snowflake,
  Sun,
  Timer,
} from "@phosphor-icons/react";
import {
  BADGES,
  SCENARIOS,
  TRAINEE,
} from "@/projects/youngin/safe/lib/mission-data";
import { picsum } from "@/projects/youngin/safe/lib/photos";
import type { Difficulty, ScenarioKey } from "@/projects/youngin/safe/lib/types";
import {
  BottomBar,
  Card,
  Chip,
  DifficultyDots,
  OutlineChip,
  PrimaryButton,
  SCENARIO_TONE,
  SectionTitle,
  staggerVar,
} from "@/projects/youngin/safe/components/ui";

const SCENARIO_ICON = {
  cardiac: Heartbeat,
  heat: Sun,
  cold: Snowflake,
  quake: Buildings,
} as const;

const DIFFICULTY_LEVEL: Record<Difficulty, 1 | 2 | 3> = {
  입문: 1,
  기본: 2,
  심화: 3,
};

export function MissionSelectScreen({ onStart }: { onStart: (key: ScenarioKey) => void }) {
  const [selected, setSelected] = useState<ScenarioKey>("cardiac");
  const featured = SCENARIOS[0];
  const others = SCENARIOS.slice(1);
  const selectedScenario = SCENARIOS.find((s) => s.key === selected) ?? featured;
  const earned = BADGES.filter((b) => b.earned);

  return (
    /* sf-enter는 transform 애니메이션이라 이 요소가 absolute 자식의 컨테이닝 블록이 된다.
       하단 고정 바가 화면 하단이 아니라 스크롤 콘텐츠 끝에 붙어 버리므로,
       진입 애니메이션은 반드시 BottomBar를 감싸지 않는 안쪽 래퍼에만 준다. */
    <div className="min-h-full bg-[var(--sf-canvas)]">
      <div className="sf-enter pb-[116px]">
      {/* 브랜드 + 진입 문장 */}
      <header className="px-5 pt-[71px]">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--sf-accent)]">
            <Lightning size={13} weight="fill" color="#ffffff" />
          </span>
          <span className="text-[12px] font-bold tracking-[0.02em] text-[var(--sf-accent-strong)]">
            용인시 재난안전과
          </span>
          <span className="ml-auto text-[11px] font-semibold text-[var(--sf-muted-soft)]">
            2026 생활안전 훈련
          </span>
        </div>

        <h1 className="mt-5 text-[34px] font-bold leading-[41px] tracking-[-0.03em] text-[var(--sf-ink)]">
          알고 있는 것을
          <br />
          <span className="text-[var(--sf-accent)]">해낼 수 있게</span>
        </h1>
        <p className="mt-3 max-w-[300px] text-[14.5px] font-medium leading-[22px] text-[var(--sf-muted)]">
          용인시 AED, 무더위쉼터, 대피소 위치를 그대로 옮긴 지도 위에서 실제 상황을 미션으로
          연습합니다.
        </p>
      </header>

      {/* 내 훈련 현황. 캔버스와 다른 재질을 써서 화면 위쪽 리듬을 끊는다. */}
      <section className="mt-6 px-5">
        <div className="rounded-[20px] bg-[var(--sf-deep)] px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14.5px] font-bold text-[var(--sf-on-dark)]">
                {TRAINEE.name} 님의 훈련 기록
              </p>
              <p className="mt-0.5 text-[11.5px] font-medium text-[var(--sf-on-dark-muted)]">
                {TRAINEE.org}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sf-deep-raised)]">
              <Medal size={17} weight="fill" color="var(--sf-accent-bright)" />
            </span>
          </div>

          <div className="mt-5 flex items-end gap-5">
            <div>
              <p className="text-[10.5px] font-semibold text-[var(--sf-on-dark-muted)]">완주 미션</p>
              <p className="sf-num mt-1 text-[26px] font-bold leading-[28px] text-[var(--sf-on-dark)]">
                {TRAINEE.clearedCount}
                <span className="text-[14px] font-semibold text-[var(--sf-on-dark-muted)]">
                  /{TRAINEE.totalCount}
                </span>
              </p>
            </div>
            <div className="h-8 w-px bg-[var(--sf-deep-line)]" />
            <div>
              <p className="text-[10.5px] font-semibold text-[var(--sf-on-dark-muted)]">
                평균 반응시간
              </p>
              <p className="sf-num mt-1 text-[26px] font-bold leading-[28px] text-[var(--sf-on-dark)]">
                {TRAINEE.avgReaction}
                <span className="text-[13px] font-semibold text-[var(--sf-on-dark-muted)]">초</span>
              </p>
            </div>
            <div className="h-8 w-px bg-[var(--sf-deep-line)]" />
            <div>
              <p className="text-[10.5px] font-semibold text-[var(--sf-on-dark-muted)]">획득 배지</p>
              <p className="sf-num mt-1 text-[26px] font-bold leading-[28px] text-[var(--sf-on-dark)]">
                {TRAINEE.badgeCount}
                <span className="text-[13px] font-semibold text-[var(--sf-on-dark-muted)]">개</span>
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--sf-deep-line)]">
            <div
              className="h-full rounded-full bg-[var(--sf-accent-bright)]"
              style={{ width: `${(TRAINEE.clearedCount / TRAINEE.totalCount) * 100}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11.5px] font-medium leading-[16px] text-[var(--sf-on-dark-muted)]">
            남은 두 가지 미션을 끝내면 생활안전 마스터 배지를 받습니다.
          </p>
        </div>
      </section>

      {/* 추천 미션 */}
      <section className="mt-8 px-5">
        <SectionTitle title="지금 필요한 훈련" caption="아직 완주하지 않은 미션부터 제안합니다" />

        <Card
          onClick={() => setSelected(featured.key)}
          selected={selected === featured.key}
          className="overflow-hidden"
          ariaLabel={`${featured.title} 미션 선택`}
        >
          <div className="relative h-[168px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picsum(featured.photoId, 786, 336)}
              alt={featured.photoAlt}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,17,14,0.92) 0%, rgba(11,17,14,0.35) 46%, rgba(11,17,14,0.12) 100%)",
              }}
            />
            <div className="absolute left-4 top-4 flex items-center gap-1.5">
              <Chip ink="#ffffff" soft="rgba(195,59,44,0.92)">
                {SCENARIO_TONE.cardiac.label}
              </Chip>
              <Chip ink="var(--sf-on-dark)" soft="rgba(255,255,255,0.16)">
                미완주
              </Chip>
            </div>
            <div className="absolute inset-x-4 bottom-3.5">
              <p className="text-[11.5px] font-semibold text-[rgba(255,255,255,0.72)]">
                {featured.situation}
              </p>
              <h3 className="mt-1 text-[24px] font-bold leading-[29px] tracking-[-0.02em] text-white">
                {featured.title}
              </h3>
            </div>
          </div>

          <div className="px-4 pb-4 pt-3.5">
            <p className="text-[13.5px] font-medium leading-[20px] text-[var(--sf-body)]">
              {featured.summary}
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <OutlineChip>
                <Timer size={12} weight="bold" />약 {featured.minutes}분
              </OutlineChip>
              <OutlineChip>
                <ListChecks size={12} weight="bold" />
                {featured.steps}단계
              </OutlineChip>
              <OutlineChip>
                <DifficultyDots level={DIFFICULTY_LEVEL[featured.difficulty]} />
                {featured.difficulty}
              </OutlineChip>
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--sf-hairline-soft)] pt-3">
              <Database size={13} weight="bold" color="var(--sf-accent)" />
              <span className="text-[11.5px] font-semibold text-[var(--sf-accent-strong)]">
                {featured.dataSource}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* 나머지 미션 */}
      <section className="mt-8 px-5">
        <SectionTitle
          title="다른 상황도 연습하기"
          caption="상황마다 판단해야 하는 지점이 다릅니다"
        />

        <div className="flex flex-col gap-2.5">
          {others.map((scenario, i) => {
            const Icon = SCENARIO_ICON[scenario.key];
            const tone = SCENARIO_TONE[scenario.key];
            return (
              <Card
                key={scenario.key}
                onClick={() => setSelected(scenario.key)}
                selected={selected === scenario.key}
                className="sf-stagger flex items-center gap-3.5 p-3"
                style={staggerVar(i)}
                ariaLabel={`${scenario.title} 미션 선택`}
              >
                <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[12px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={picsum(scenario.photoId, 204, 204)}
                    alt={scenario.photoAlt}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: tone.ink }}
                  >
                    <Icon size={11} weight="fill" color="#ffffff" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[15.5px] font-bold text-[var(--sf-ink)]">
                      {scenario.title}
                    </h3>
                    {scenario.cleared && (
                      <CheckCircle size={15} weight="fill" color="var(--sf-accent)" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--sf-muted)]">
                    {scenario.situation}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-[var(--sf-muted-soft)]">
                    <span className="sf-num">약 {scenario.minutes}분</span>
                    <span className="h-2.5 w-px bg-[var(--sf-hairline)]" />
                    <span className="flex items-center gap-1">
                      <DifficultyDots level={DIFFICULTY_LEVEL[scenario.difficulty]} />
                      {scenario.difficulty}
                    </span>
                    {scenario.bestScore !== null && (
                      <>
                        <span className="h-2.5 w-px bg-[var(--sf-hairline)]" />
                        <span className="sf-num text-[var(--sf-accent-strong)]">
                          최고 {scenario.bestScore}점
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <CaretRight size={16} weight="bold" color="var(--sf-muted-soft)" />
              </Card>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-3 flex h-[46px] w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[var(--sf-hairline)] text-[13.5px] font-semibold text-[var(--sf-muted)] transition-transform active:scale-[0.99]"
        >
          전체 미션 보기
          <ArrowRight size={14} weight="bold" />
        </button>
      </section>

      {/* 배지 */}
      <section className="mt-8">
        <div className="px-5">
          <SectionTitle
            title="획득한 배지"
            caption="순위 없이, 완주할 때마다 하나씩 쌓입니다"
          />
        </div>
        <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`w-[132px] shrink-0 rounded-[14px] border p-3 ${
                badge.earned
                  ? "border-[var(--sf-accent-soft)] bg-[var(--sf-accent-soft)]"
                  : "border-[var(--sf-hairline)] bg-[var(--sf-surface)]"
              }`}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: badge.earned ? "var(--sf-accent)" : "var(--sf-sunken)",
                }}
              >
                <Medal
                  size={16}
                  weight="fill"
                  color={badge.earned ? "#ffffff" : "var(--sf-muted-soft)"}
                />
              </span>
              <p
                className={`mt-2.5 text-[13px] font-bold ${
                  badge.earned ? "text-[var(--sf-accent-strong)]" : "text-[var(--sf-muted)]"
                }`}
              >
                {badge.name}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-[15px] text-[var(--sf-muted)]">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 px-5 text-[11.5px] font-medium leading-[17px] text-[var(--sf-muted-soft)]">
          {earned.length}개 획득 | 학교, 경로당, 주민센터 단체 훈련에서도 그대로 이어집니다.
        </p>
      </section>
      </div>

      <BottomBar>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-[var(--sf-muted)]">선택한 미션</p>
          <p className="text-[12.5px] font-bold text-[var(--sf-ink)]">
            {selectedScenario.title} | {selectedScenario.difficulty}
          </p>
        </div>
        <PrimaryButton
          onClick={() => onStart(selectedScenario.key)}
          icon={<Lightning size={17} weight="fill" />}
        >
          미션 시작하기
        </PrimaryButton>
      </BottomBar>
    </div>
  );
}
