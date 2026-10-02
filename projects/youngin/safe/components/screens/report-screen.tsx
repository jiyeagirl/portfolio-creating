"use client";

import { useEffect, useRef } from "react";
import {
  ArrowClockwise,
  ArrowUp,
  CheckCircle,
  Database,
  ListChecks,
  Medal,
  Sparkle,
  Timer,
  WarningCircle,
} from "@phosphor-icons/react";
import { BADGES, SCENARIOS, TRAINEE } from "@/projects/youngin/safe/lib/mission-data";
import { picsum } from "@/projects/youngin/safe/lib/photos";
import { ACTION_GUIDE } from "@/projects/youngin/safe/lib/mission-data";
import { formatDuration } from "@/projects/youngin/safe/lib/scoring";
import type { MissionResult } from "@/projects/youngin/safe/lib/scoring";
import {
  BottomBar,
  Card,
  Chip,
  GhostButton,
  MeterBar,
  PrimaryButton,
  SectionTitle,
  staggerVar,
} from "@/projects/youngin/safe/components/ui";

const AXIS_LABELS: { key: "accuracy" | "simSpeed" | "reaction"; label: string; weight: number }[] = [
  { key: "accuracy", label: "행동 정확도", weight: 60 },
  { key: "simSpeed", label: "대응 속도", weight: 25 },
  { key: "reaction", label: "반응 속도", weight: 15 },
];

/** PhoneFrame이 만든 스크롤 컨테이너를 위로 올라가며 찾는다. */
function findScroller(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    if (getComputedStyle(el).overflowY === "auto") return el;
    el = el.parentElement;
  }
  return null;
}

export function ReportScreen({
  result,
  onRetry,
  onOther,
  onHeroVisibleChange,
}: {
  result: MissionResult;
  onRetry: () => void;
  onOther: () => void;
  /** 딥 히어로가 상태바 아래에 남아 있는지. 상태바 잉크를 뒤집는 데 쓴다. */
  onHeroVisibleChange?: (visible: boolean) => void;
}) {
  const scenario = SCENARIOS[0];
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const scroller = findScroller(hero);
    if (!hero || !scroller || !onHeroVisibleChange) return;

    const check = () => onHeroVisibleChange(scroller.scrollTop < hero.offsetHeight - 59);
    check();
    scroller.addEventListener("scroll", check, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", check);
      onHeroVisibleChange(true);
    };
  }, [onHeroVisibleChange]);

  const correct = result.decisions.filter((d) => d.correct);
  const missed = result.decisions.filter((d) => !d.correct);
  const maxSeconds = Math.max(...result.lines.map((l) => Math.max(l.seconds, l.targetSeconds)));
  const delta = result.score - TRAINEE.lastScore;
  const newBadges = BADGES.filter((b) => b.isNew);

  return (
    /* sf-enter의 transform이 컨테이닝 블록을 만들어 하단 고정 바를 스크롤 끝으로
       밀어내므로, 진입 애니메이션은 BottomBar 바깥 래퍼에만 준다. */
    <div className="min-h-full bg-[var(--sf-canvas)]">
      <div className="sf-enter pb-[124px]">
      {/* 결과 헤더 */}
      <header
        ref={heroRef}
        className="relative overflow-hidden bg-[var(--sf-deep)] px-5 pb-7 pt-[71px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={picsum(scenario.photoId, 786, 500)}
          alt={scenario.photoAlt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.17]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(19,31,26,0.55) 0%, rgba(19,31,26,0.92) 62%, var(--sf-deep) 100%)",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-1.5">
            <Chip
              ink="#ffffff"
              soft={result.success ? "var(--sf-accent)" : "var(--sf-cardiac)"}
              icon={<CheckCircle size={12} weight="fill" />}
            >
              {result.success ? "미션 성공" : "미션 실패"}
            </Chip>
            <Chip ink="var(--sf-on-dark)" soft="rgba(255,255,255,0.14)">
              {scenario.title}
            </Chip>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--sf-on-dark-muted)]">
                안전 대응 점수
              </p>
              <p className="sf-num mt-1 text-[56px] font-bold leading-[58px] tracking-[-0.04em] text-[var(--sf-on-dark)]">
                {result.score}
                <span className="ml-1 text-[20px] font-bold text-[var(--sf-on-dark-muted)]">점</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-[rgba(52,196,138,0.16)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--sf-accent-bright)]">
                  {result.grade}
                </span>
                {delta > 0 && (
                  <span className="sf-num flex items-center gap-0.5 text-[11.5px] font-bold text-[var(--sf-accent-bright)]">
                    <ArrowUp size={11} weight="bold" />
                    지난 훈련 대비 {delta}점
                  </span>
                )}
              </div>
            </div>

            <div className="pb-1 text-right">
              <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--sf-on-dark-muted)]">
                총 대응 시간
              </p>
              <p className="sf-num mt-1 text-[26px] font-bold leading-[30px] text-[var(--sf-on-dark)]">
                {formatDuration(result.elapsedSeconds)}
              </p>
              <p className="sf-num mt-1 text-[11.5px] font-semibold text-[var(--sf-on-dark-muted)]">
                제한 {formatDuration(result.limitSeconds)}
              </p>
            </div>
          </div>

          {/* 점수를 만든 세 축 */}
          <div className="mt-6 flex flex-col gap-2.5 rounded-[14px] border border-[var(--sf-deep-line)] px-4 py-3.5">
            {AXIS_LABELS.map((axis) => (
              <div key={axis.key} className="flex items-center gap-3">
                <span className="w-[62px] shrink-0 text-[11.5px] font-semibold text-[var(--sf-on-dark-muted)]">
                  {axis.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-deep-line)]">
                  <span
                    className="block h-full rounded-full bg-[var(--sf-accent-bright)] transition-[width] duration-700"
                    style={{ width: `${Math.max(3, result.axes[axis.key] * 100)}%` }}
                  />
                </span>
                <span className="sf-num w-[44px] shrink-0 text-right text-[11.5px] font-bold text-[var(--sf-on-dark)]">
                  {Math.round(result.axes[axis.key] * axis.weight)}
                  <span className="text-[10px] font-semibold text-[var(--sf-on-dark-muted)]">
                    /{axis.weight}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="sf-num mt-3 text-[11.5px] font-medium text-[var(--sf-on-dark-muted)]">
            평균 반응시간 {result.avgReaction}초 | 판단 지점 {result.decisions.length}곳 중{" "}
            {correct.length}곳 정확
          </p>
        </div>
      </header>

      {/* 단계별 소요 시간 */}
      <section className="mt-7 px-5">
        <SectionTitle
          title="단계별 대응 시간"
          caption="검은 눈금이 훈련 기준 권장 시간입니다"
        />
        <Card className="px-4 py-4">
          <div className="flex flex-col gap-3.5">
            {result.lines.map((line) => {
              const over = line.seconds > line.targetSeconds;
              return (
                <div key={line.key}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold text-[var(--sf-body)]">
                      {line.label}
                    </span>
                    <span
                      className="sf-num text-[13px] font-bold"
                      style={{ color: over ? "var(--sf-heat)" : "var(--sf-ink)" }}
                    >
                      {formatDuration(line.seconds)}
                      {over && (
                        <span className="ml-1 text-[11px] font-semibold text-[var(--sf-heat)]">
                          +{line.seconds - line.targetSeconds}초
                        </span>
                      )}
                    </span>
                  </div>
                  <MeterBar
                    ratio={line.seconds / maxSeconds}
                    targetRatio={line.targetSeconds / maxSeconds}
                    tone={over ? "var(--sf-heat)" : "var(--sf-accent)"}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-4 border-t border-[var(--sf-hairline-soft)] pt-3 text-[11.5px] font-medium leading-[17px] text-[var(--sf-muted)]">
            실제 현장에서도 가장 긴 구간은 이동입니다. 그래서 AED를 고르는 판단이 전체 시간을
            좌우합니다.
          </p>
        </Card>
      </section>

      {/* 올바르게 수행한 행동 */}
      <section className="mt-8 px-5">
        <SectionTitle
          title="올바르게 수행한 행동"
          caption={`${correct.length}개 항목`}
          right={
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sf-accent-soft)]">
              <ListChecks size={14} weight="bold" color="var(--sf-accent)" />
            </span>
          }
        />
        <div className="flex flex-col gap-2">
          {correct.map((d, i) => (
            <div
              key={`${d.chosenLabel}-${i}`}
              style={staggerVar(i)}
              className="sf-stagger flex items-start gap-2.5 rounded-[14px] border border-[var(--sf-accent-soft)] bg-[var(--sf-accent-soft)] px-3.5 py-3"
            >
              <CheckCircle size={16} weight="fill" color="var(--sf-accent)" className="mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold leading-[19px] text-[var(--sf-accent-strong)]">
                  {d.chosenLabel}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-[17px] text-[var(--sf-body)]">
                  {d.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 놓친 행동 */}
      <section className="mt-8 px-5">
        <SectionTitle
          title="놓친 행동과 개선 포인트"
          caption={missed.length ? `${missed.length}개 항목` : "이번 훈련에서는 없었습니다"}
          right={
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sf-cardiac-soft)]">
              <WarningCircle size={14} weight="bold" color="var(--sf-cardiac)" />
            </span>
          }
        />
        {missed.length ? (
          <div className="flex flex-col gap-2">
            {missed.map((d, i) => (
              <Card key={`${d.chosenLabel}-${i}`} className="px-3.5 py-3.5">
                <p className="text-[11px] font-bold tracking-[0.02em] text-[var(--sf-cardiac)]">
                  {d.question}
                </p>
                <p className="mt-1.5 text-[13.5px] font-bold leading-[19px] text-[var(--sf-ink)]">
                  {d.chosenLabel}
                </p>
                <p className="mt-1.5 text-[12.5px] font-medium leading-[18px] text-[var(--sf-body)]">
                  {d.feedback}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-[var(--sf-hairline-soft)] pt-2.5">
                  <Timer size={12} weight="bold" color="var(--sf-heat)" />
                  <span className="sf-num text-[11.5px] font-bold text-[var(--sf-heat)]">
                    이 선택으로 {d.penaltySeconds}초 손실
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex items-center gap-2.5 px-3.5 py-4">
            <Sparkle size={16} weight="fill" color="var(--sf-accent)" />
            <p className="text-[13px] font-semibold text-[var(--sf-body)]">
              모든 판단 지점을 정확히 통과했습니다. 이제 시간을 줄이는 훈련만 남았습니다.
            </p>
          </Card>
        )}
      </section>

      {/* 실제 상황 행동 가이드 */}
      <section className="mt-8 px-5">
        <SectionTitle
          title="실제 상황에서는 이렇게"
          caption="한국형 심폐소생술 지침 기준 순서"
        />
        <div className="rounded-[16px] border border-[var(--sf-hairline)] bg-[var(--sf-surface)] px-4 py-1">
          {ACTION_GUIDE.map((step, i) => (
            <div
              key={step.order}
              className={`flex gap-3.5 py-3.5 ${
                i < ACTION_GUIDE.length - 1 ? "border-b border-[var(--sf-hairline-soft)]" : ""
              }`}
            >
              <span className="sf-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sf-accent)] text-[12px] font-bold text-white">
                {step.order}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-[20px] text-[var(--sf-ink)]">
                  {step.title}
                </p>
                <p className="mt-1 text-[12.5px] font-medium leading-[18px] text-[var(--sf-muted)]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 px-1">
          <Database size={12} weight="bold" color="var(--sf-muted-soft)" />
          <span className="text-[11px] font-medium text-[var(--sf-muted-soft)]">
            {scenario.dataSource} 기준, 2026년 3월 갱신
          </span>
        </div>
      </section>

      {/* 획득 배지 */}
      <section className="mt-8 px-5">
        <SectionTitle title="획득한 배지" caption="이번 훈련으로 하나가 추가됐습니다" />
        <div className="flex gap-2.5">
          {newBadges.map((badge) => (
            <div
              key={badge.id}
              className="relative flex-1 rounded-[16px] border border-[var(--sf-accent)] bg-[var(--sf-accent-soft)] px-4 py-4"
            >
              <span className="absolute right-3 top-3 rounded-full bg-[var(--sf-accent)] px-2 py-0.5 text-[9.5px] font-bold tracking-[0.06em] text-white">
                NEW
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sf-accent)]">
                <Medal size={20} weight="fill" color="#ffffff" />
              </span>
              <p className="mt-3 text-[15px] font-bold text-[var(--sf-accent-strong)]">
                {badge.name}
              </p>
              <p className="mt-1 text-[12px] font-medium leading-[17px] text-[var(--sf-body)]">
                {badge.description}
              </p>
            </div>
          ))}
          <div className="flex-1 rounded-[16px] border border-dashed border-[var(--sf-hairline)] px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sf-sunken)]">
              <Medal size={20} weight="fill" color="var(--sf-muted-soft)" />
            </span>
            <p className="mt-3 text-[15px] font-bold text-[var(--sf-muted)]">골든타임</p>
            <p className="mt-1 text-[12px] font-medium leading-[17px] text-[var(--sf-muted-soft)]">
              4분 안에 성공하면 받습니다. 이번 기록은{" "}
              <span className="sf-num">{formatDuration(result.elapsedSeconds)}</span>.
            </p>
          </div>
        </div>
      </section>
      </div>

      <BottomBar>
        <div className="flex gap-2.5">
          <div className="flex-1">
            <GhostButton onClick={onOther}>다른 미션 선택</GhostButton>
          </div>
          <div className="flex-[1.25]">
            <PrimaryButton onClick={onRetry} icon={<ArrowClockwise size={17} weight="bold" />}>
              다시 도전하기
            </PrimaryButton>
          </div>
        </div>
      </BottomBar>
    </div>
  );
}
