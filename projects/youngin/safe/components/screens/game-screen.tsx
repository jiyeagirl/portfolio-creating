"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  CheckCircle,
  FirstAid,
  Lightning,
  MapPin,
  NavigationArrow,
  Path,
  PhoneCall,
  SpeakerHigh,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { CityMap } from "@/projects/youngin/safe/components/city-map";
import {
  BASE_SECONDS,
  CORRECT_FACILITY_ID,
  DEVICE_STEPS,
  ENTRY_CHOICES,
  FACILITIES,
  MISSION_STEPS,
  REPORT_CHOICES,
  ROUTE_CHOICES,
  SHOCK_CHOICES,
  TIME_LIMIT,
} from "@/projects/youngin/safe/lib/mission-data";
import { staggerVar } from "@/projects/youngin/safe/components/ui";
import { buildResult, formatClock } from "@/projects/youngin/safe/lib/scoring";
import type { Decision, MissionResult } from "@/projects/youngin/safe/lib/scoring";
import type { Choice, MissionStepKey } from "@/projects/youngin/safe/lib/types";

type Phase = "report" | "search" | "route" | "moving" | "entry" | "use";

const PHASE_STEP: Record<Phase, MissionStepKey> = {
  report: "report",
  search: "search",
  route: "move",
  moving: "move",
  entry: "move",
  use: "use",
};

const OBJECTIVE: Record<Phase, string> = {
  report: "신고와 가슴압박을 동시에",
  search: "지금 쓸 수 있는 AED 찾기",
  route: "안전하게, 그리고 빠르게",
  moving: "용인시청 1층 로비로 이동",
  entry: "1층 로비까지 올라가기",
  use: "음성 안내를 그대로 따르기",
};

/* 이동 애니메이션. 시뮬레이션 131초를 실제 5.6초로 압축해 보여 준다. */
const TRAVEL_MS = 5600;
const ENTRY_TRIGGER = 0.62;

const AED_STATUS: Record<string, { label: string; usable: boolean }> = {
  "aed-market": { label: "점검 중", usable: false },
  "aed-cityhall": { label: "이용 가능", usable: true },
  "aed-center": { label: "운영 종료", usable: false },
};

function FeedbackBanner({ correct, text }: { correct: boolean; text: string }) {
  return (
    <div
      className="sf-panel-in mb-3.5 flex items-start gap-2.5 rounded-[12px] px-3.5 py-3"
      style={{ background: correct ? "rgba(14,122,85,0.9)" : "rgba(160,48,36,0.9)" }}
      role="status"
    >
      {correct ? (
        <CheckCircle size={16} weight="fill" color="#ffffff" />
      ) : (
        <WarningCircle size={16} weight="fill" color="#ffffff" />
      )}
      <p className="text-[12.5px] font-semibold leading-[18px] text-white">{text}</p>
    </div>
  );
}

function ChoiceButton({
  choice,
  onPick,
  index,
}: {
  choice: Choice;
  onPick: (choice: Choice) => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(choice)}
      style={staggerVar(index)}
      className="sf-stagger flex w-full items-start gap-3 rounded-[12px] border border-[var(--sf-deep-line)] bg-[var(--sf-deep)] px-3.5 py-3 text-left transition-transform duration-200 active:scale-[0.985]"
    >
      <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--sf-deep-line)] text-[10.5px] font-bold text-[var(--sf-on-dark-muted)]">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-[20px] text-[var(--sf-on-dark)]">
          {choice.label}
        </span>
        <span className="mt-0.5 block text-[11.5px] font-medium leading-[16px] text-[var(--sf-on-dark-muted)]">
          {choice.hint}
        </span>
      </span>
    </button>
  );
}

function PanelHead({ eyebrow, question }: { eyebrow: string; question: string }) {
  return (
    <div className="mb-3.5">
      <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--sf-accent-bright)]">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-[17px] font-bold leading-[24px] tracking-[-0.01em] text-[var(--sf-on-dark)]">
        {question}
      </h2>
    </div>
  );
}

export function GameScreen({
  onFinish,
  onExit,
}: {
  onFinish: (result: MissionResult) => void;
  onExit: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("report");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [simElapsed, setSimElapsed] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  const promptAt = useRef<number>(0);
  const travelStart = useRef<number>(0);
  const travelBase = useRef<number>(0);
  const raf = useRef<number>(0);

  /* 선택지가 새로 뜰 때마다 반응시간 측정을 다시 시작한다. */
  useEffect(() => {
    promptAt.current = Date.now();
  }, [phase, deviceIndex]);

  const target = useMemo(() => FACILITIES.find((f) => f.id === CORRECT_FACILITY_ID)!, []);
  const stepIndex = MISSION_STEPS.findIndex((s) => s.key === PHASE_STEP[phase]);
  const remaining = Math.max(0, TIME_LIMIT - simElapsed);
  const urgent = remaining <= 60;

  const record = useCallback(
    (stepKey: MissionStepKey, question: string, choice: Choice) => {
      const reaction = Math.max(0.4, (Date.now() - promptAt.current) / 1000);
      setDecisions((prev) => [
        ...prev,
        {
          stepKey,
          question,
          chosenLabel: choice.label,
          correct: choice.correct,
          penaltySeconds: choice.penaltySeconds,
          feedback: choice.feedback,
          reactionSeconds: Math.round(reaction * 10) / 10,
        },
      ]);
      setFeedback({ correct: choice.correct, text: choice.feedback });
      return choice.penaltySeconds;
    },
    [],
  );

  /* 피드백 배너는 잠깐만 떠 있는다. 화면을 가리면 다음 판단을 방해한다. */
  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(id);
  }, [feedback]);

  /* 이동 구간. requestAnimationFrame으로 경로 진행과 시뮬레이션 시계를 함께 굴린다. */
  useEffect(() => {
    if (phase !== "moving") return;
    travelStart.current = Date.now();
    const startProgress = progress;
    const startElapsed = travelBase.current;

    const tick = () => {
      const t = Math.min(1, (Date.now() - travelStart.current) / (TRAVEL_MS * (1 - startProgress)));
      const p = startProgress + (1 - startProgress) * t;
      setProgress(p);
      setSimElapsed(startElapsed + BASE_SECONDS.move * p);

      if (startProgress < ENTRY_TRIGGER && p >= ENTRY_TRIGGER) {
        setProgress(ENTRY_TRIGGER);
        setSimElapsed(startElapsed + BASE_SECONDS.move * ENTRY_TRIGGER);
        setPhase("entry");
        return;
      }
      if (p >= 1) {
        setSimElapsed(startElapsed + BASE_SECONDS.move);
        setPhase("use");
        return;
      }
      raf.current = window.requestAnimationFrame(tick);
    };

    raf.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf.current);
    // progress는 시작 지점을 잡는 용도라 의존성에 넣으면 매 프레임 재시작한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleReport = (choice: Choice) => {
    const penalty = record("report", "쓰러진 시민을 발견했습니다. 무엇부터 합니까?", choice);
    setSimElapsed((s) => s + BASE_SECONDS.report + penalty);
    setPhase("search");
  };

  const handleFacility = (id: string) => {
    const facility = FACILITIES.find((f) => f.id === id);
    if (!facility || !facility.selectable) return;
    const status = AED_STATUS[id];
    const choice: Choice = {
      id,
      label: facility.name,
      hint: facility.hours,
      correct: id === CORRECT_FACILITY_ID,
      penaltySeconds: id === CORRECT_FACILITY_ID ? 0 : 22,
      feedback:
        id === CORRECT_FACILITY_ID
          ? "가장 가까운 AED가 아니라 지금 실제로 쓸 수 있는 AED를 골랐습니다."
          : `${facility.name}은(는) 현재 ${status.label} 상태입니다. AED는 거리뿐 아니라 사용 가능 여부까지 확인해야 합니다. 사용 가능한 용인시청 AED로 안내합니다.`,
    };
    const penalty = record("search", "어느 AED로 갑니까?", choice);
    setSelectedFacility(CORRECT_FACILITY_ID);
    setSimElapsed((s) => s + BASE_SECONDS.search + penalty);
    setPhase("route");
  };

  const handleRoute = (choice: Choice) => {
    const penalty = record("move", "어떤 경로로 이동합니까?", choice);
    travelBase.current = simElapsed + penalty;
    setSimElapsed((s) => s + penalty);
    setPhase("moving");
  };

  const handleEntry = (choice: Choice) => {
    const penalty = record(
      "move",
      "시청 정문에 도착했습니다. 로비까지 어떻게 올라갑니까?",
      choice,
    );
    travelBase.current += penalty;
    setSimElapsed((s) => s + penalty);
    setPhase("moving");
  };

  const advanceDevice = (penalty = 0) => {
    setSimElapsed((s) => s + BASE_SECONDS.use / DEVICE_STEPS.length + penalty);
    if (deviceIndex >= DEVICE_STEPS.length - 1) {
      onFinish(buildResult(decisions));
      return;
    }
    setDeviceIndex((i) => i + 1);
  };

  const handleShock = (choice: Choice) => {
    const penalty = record("use", "제세동 안내가 나왔습니다. 무엇부터 합니까?", choice);
    advanceDevice(penalty);
  };

  const device = DEVICE_STEPS[deviceIndex];
  const remainingDistance = Math.round(target.distance * (1 - progress));
  const remainingWalk = Math.round(target.walkSeconds * (1 - progress));

  return (
    <div className="relative flex h-[852px] flex-col overflow-hidden bg-[var(--sf-deep)]">
      {/* HUD */}
      <div className="relative z-20 shrink-0 px-5 pb-3.5 pt-[67px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[rgba(195,59,44,0.16)] px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2604f]" />
              <span className="text-[11px] font-bold text-[#f0917f]">심정지 대응</span>
            </span>
            <span className="text-[11.5px] font-semibold text-[var(--sf-on-dark-muted)]">
              용인중앙시장 골목
            </span>
          </div>
          <button
            type="button"
            onClick={onExit}
            aria-label="훈련 종료"
            className="-mr-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sf-deep-raised)] transition-transform active:scale-95"
          >
            <X size={15} weight="bold" color="var(--sf-on-dark-muted)" />
          </button>
        </div>

        <div className="mt-2.5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.04em] text-[var(--sf-on-dark-muted)]">
              남은 골든타임
            </p>
            <p
              className={`sf-num text-[33px] font-bold leading-[37px] tracking-[-0.03em] ${
                urgent ? "sf-urgent" : ""
              }`}
              style={{ color: urgent ? "#f0917f" : "var(--sf-on-dark)" }}
            >
              {formatClock(remaining)}
            </p>
          </div>
          <div className="pb-0.5 text-right">
            <p className="text-[10px] font-bold tracking-[0.04em] text-[var(--sf-on-dark-muted)]">
              현재 목표
            </p>
            <p className="mt-0.5 max-w-[184px] text-[12.5px] font-semibold leading-[17px] text-[var(--sf-on-dark)]">
              {OBJECTIVE[phase]}
            </p>
          </div>
        </div>

        {/* 단계 진행 */}
        <div className="mt-3 flex items-center gap-1.5">
          {MISSION_STEPS.map((step, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <div key={step.key} className="flex flex-1 flex-col gap-1.5">
                <div
                  className="h-[3px] w-full rounded-full"
                  style={{
                    background: done
                      ? "var(--sf-accent-bright)"
                      : current
                        ? "rgba(52,196,138,0.45)"
                        : "var(--sf-deep-line)",
                  }}
                />
                <div className="flex items-center gap-1">
                  {done ? (
                    <Check size={10} weight="bold" color="var(--sf-accent-bright)" />
                  ) : (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: current ? "var(--sf-accent-bright)" : "var(--sf-deep-line)",
                      }}
                    />
                  )}
                  <span
                    className="text-[10.5px] font-bold"
                    style={{
                      color: done || current ? "var(--sf-on-dark)" : "var(--sf-on-dark-muted)",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 지도 */}
      <div className="relative min-h-0 flex-1">
        <CityMap
          facilities={FACILITIES}
          selectedId={selectedFacility}
          onSelect={phase === "search" ? handleFacility : undefined}
          showRoute={phase === "route" || phase === "moving" || phase === "entry" || phase === "use"}
          routeProgress={phase === "route" ? 0 : progress}
          focusKind={phase === "search" ? "aed" : undefined}
        />

        {/* HUD와 지도 사이 이음새를 부드럽게. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-6"
          style={{
            background: "linear-gradient(to bottom, var(--sf-deep), rgba(19,31,26,0))",
          }}
        />

        {/* 범례. 이 지도가 실제 공공데이터라는 사실을 화면에 남긴다. */}
        <div className="pointer-events-none absolute inset-x-3 bottom-7 flex items-center justify-center gap-3 rounded-[9px] bg-[rgba(11,20,17,0.78)] px-3 py-1.5">
          {[
            { c: "#34c48a", t: "AED" },
            { c: "#e0a03c", t: "무더위쉼터" },
            { c: "#6ba8d8", t: "한파쉼터" },
            { c: "#b9c4cd", t: "옥외대피장소" },
          ].map((item) => (
            <span key={item.t} className="flex items-center gap-1">
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: item.c }} />
              <span className="text-[9.5px] font-semibold text-[var(--sf-on-dark-muted)]">
                {item.t}
              </span>
            </span>
          ))}
        </div>

        {/* 지도 위 오버레이. 액션 패널 높이가 단계마다 흔들리지 않도록
            피드백 배너와 이동 상태를 여기 쌓는다. */}
        <div className="pointer-events-none absolute inset-x-4 top-3 z-10 flex flex-col gap-2">
          {feedback && <FeedbackBanner correct={feedback.correct} text={feedback.text} />}

          {(phase === "moving" || phase === "entry") && (
            <div className="flex items-center gap-3 rounded-[12px] bg-[rgba(11,20,17,0.9)] px-3.5 py-2.5">
            <NavigationArrow size={16} weight="fill" color="var(--sf-accent-bright)" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-[var(--sf-on-dark)]">
                {target.name}
              </p>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[var(--sf-deep-line)]">
                <div
                  className="h-full rounded-full bg-[var(--sf-accent-bright)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
              <p className="sf-num shrink-0 text-right text-[12px] font-bold text-[var(--sf-accent-bright)]">
                {remainingDistance}m
                <span className="block text-[10px] font-semibold text-[var(--sf-on-dark-muted)]">
                  도보 {formatClock(remainingWalk)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 액션 패널. min-height를 고정해 단계가 바뀌어도 지도 밴드 높이가 크게 흔들리지 않게 한다.
          이 값이 커지면 CityMap의 viewBox 비율도 같이 맞춰야 핀이 잘리지 않는다. */}
      <div className="relative z-20 -mt-5 min-h-[326px] shrink-0 rounded-t-[20px] border-t border-[var(--sf-deep-line)] bg-[var(--sf-deep-raised)] px-5 pb-9 pt-4">
        {phase === "report" && (
          <div className="sf-panel-in">
            <PanelHead
              eyebrow="상황 발생"
              question="쓰러진 시민을 발견했습니다. 무엇부터 합니까?"
            />
            <div className="flex flex-col gap-2">
              {REPORT_CHOICES.map((c, i) => (
                <ChoiceButton key={c.id} choice={c} index={i} onPick={handleReport} />
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
              <PhoneCall size={12} weight="bold" />
              반응과 호흡 확인은 이미 끝났습니다. 정상 호흡이 없습니다.
            </p>
          </div>
        )}

        {phase === "search" && (
          <div className="sf-panel-in">
            <PanelHead eyebrow="AED 탐색" question="어느 AED로 갑니까?" />
            <div className="flex flex-col gap-2">
              {FACILITIES.filter((f) => f.selectable).map((f, i) => {
                const status = AED_STATUS[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFacility(f.id)}
                    style={staggerVar(i)}
                    className="sf-stagger flex items-center gap-3 rounded-[12px] border border-[var(--sf-deep-line)] bg-[var(--sf-deep)] px-3.5 py-3 text-left transition-transform duration-200 active:scale-[0.985]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(52,196,138,0.14)]">
                      <Lightning size={14} weight="fill" color="var(--sf-accent-bright)" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold text-[var(--sf-on-dark)]">
                        {f.name}
                      </span>
                      <span className="sf-num mt-0.5 block text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
                        {f.detail} | {f.distance}m | 도보 {formatClock(f.walkSeconds)}
                      </span>
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: status.usable
                          ? "rgba(52,196,138,0.18)"
                          : "rgba(224,160,60,0.16)",
                        color: status.usable ? "var(--sf-accent-bright)" : "#e0a03c",
                      }}
                    >
                      {status.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
              <MapPin size={12} weight="bold" />
              지도의 핀을 눌러도 선택됩니다. 실제 용인시 AED 설치 위치 데이터입니다.
            </p>
          </div>
        )}

        {phase === "route" && (
          <div className="sf-panel-in">
            <PanelHead eyebrow="현장 이동" question="어떤 경로로 이동합니까?" />
            <div className="flex flex-col gap-2">
              {ROUTE_CHOICES.map((c, i) => (
                <ChoiceButton key={c.id} choice={c} index={i} onPick={handleRoute} />
              ))}
            </div>
          </div>
        )}

        {phase === "moving" && (
          <div className="sf-panel-in">
            <PanelHead eyebrow="이동 중" question="용인시청 본관 1층 로비로 이동하고 있습니다" />
            <div className="flex items-center gap-3 rounded-[12px] border border-[var(--sf-deep-line)] bg-[var(--sf-deep)] px-3.5 py-3.5">
              <Path size={18} weight="bold" color="var(--sf-accent-bright)" />
              <div className="flex-1">
                <p className="text-[12.5px] font-semibold text-[var(--sf-on-dark)]">
                  금학로 횡단보도를 지나는 중
                </p>
                <p className="sf-num mt-0.5 text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
                  남은 거리 {remainingDistance}m | 도보 {formatClock(remainingWalk)}
                </p>
              </div>
              <span className="sf-num text-[20px] font-bold text-[var(--sf-accent-bright)]">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
              이동하는 동안에도 골든타임은 흐릅니다. 현장에서는 이 시간이 가장 길게 걸립니다.
            </p>

            {/* 이동 구간은 손이 비는 시간이다. 도착 직후 할 일을 미리 읽게 한다. */}
            <div className="mt-4 rounded-[12px] border border-[var(--sf-deep-line)] px-3.5 py-3">
              <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--sf-on-dark-muted)]">
                도착하면 바로 할 일
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {DEVICE_STEPS.slice(0, 3).map((s, i) => (
                  <p
                    key={s.id}
                    className="flex items-center gap-2 text-[12px] font-semibold text-[var(--sf-on-dark)]"
                  >
                    <span className="sf-num flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sf-deep-line)] text-[9.5px] font-bold text-[var(--sf-on-dark-muted)]">
                      {i + 1}
                    </span>
                    {s.label}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "entry" && (
          <div className="sf-panel-in">
            <PanelHead
              eyebrow="분기 상황"
              question="시청 정문에 도착했습니다. 로비까지 어떻게 올라갑니까?"
            />
            <div className="flex flex-col gap-2">
              {ENTRY_CHOICES.map((c, i) => (
                <ChoiceButton key={c.id} choice={c} index={i} onPick={handleEntry} />
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[var(--sf-on-dark-muted)]">
              <ArrowUp size={12} weight="bold" />
              AED 보관함은 정문에서 계단 12칸 위 로비 안내데스크 옆입니다.
            </p>
          </div>
        )}

        {phase === "use" && (
          <div className="sf-panel-in">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--sf-accent-bright)]">
                AED 사용 {deviceIndex + 1}/{DEVICE_STEPS.length}
              </p>
              <div className="flex items-center gap-1">
                {DEVICE_STEPS.map((s, i) => (
                  <span
                    key={s.id}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === deviceIndex ? 18 : 6,
                      background:
                        i <= deviceIndex ? "var(--sf-accent-bright)" : "var(--sf-deep-line)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 기기 음성 안내 */}
            <div className="flex items-start gap-2.5 rounded-[12px] bg-[rgba(52,196,138,0.1)] px-3.5 py-3">
              <SpeakerHigh size={15} weight="fill" color="var(--sf-accent-bright)" />
              <p className="text-[12.5px] font-semibold leading-[18px] text-[var(--sf-accent-bright)]">
                {device.voice}
              </p>
            </div>

            <h2 className="mt-3.5 text-[17px] font-bold leading-[23px] text-[var(--sf-on-dark)]">
              {device.label}
            </h2>
            <p className="mt-1.5 text-[12.5px] font-medium leading-[18px] text-[var(--sf-on-dark-muted)]">
              {device.instruction}
            </p>

            {device.id === "analyze" && (
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--sf-deep-line)]">
                <div className="sf-analyze h-full w-[30%] rounded-full bg-[var(--sf-accent-bright)]" />
              </div>
            )}

            {device.id === "shock" ? (
              <div className="mt-3.5 flex flex-col gap-2">
                {SHOCK_CHOICES.map((c, i) => (
                  <ChoiceButton key={c.id} choice={c} index={i} onPick={handleShock} />
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => advanceDevice()}
                className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--sf-accent)] text-[15.5px] font-bold text-white transition-transform duration-200 active:scale-[0.98]"
              >
                {device.id === "cpr" ? (
                  <FirstAid size={17} weight="fill" />
                ) : device.id === "analyze" ? (
                  <Warning size={17} weight="fill" />
                ) : (
                  <Lightning size={17} weight="fill" />
                )}
                {device.action}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
