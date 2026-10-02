import {
  BASE_SECONDS,
  IDEAL_SECONDS,
  TIME_LIMIT,
} from "@/projects/youngin/safe/lib/mission-data";
import type { MissionStepKey, ReportLine } from "@/projects/youngin/safe/lib/types";

/** 한 판단 지점의 결과. 게임 화면이 쌓아서 리포트로 넘긴다. */
export type Decision = {
  stepKey: MissionStepKey;
  question: string;
  chosenLabel: string;
  correct: boolean;
  penaltySeconds: number;
  feedback: string;
  /** 선택지가 뜬 시점부터 탭까지 실제로 걸린 시간(초). */
  reactionSeconds: number;
};

export type MissionResult = {
  success: boolean;
  /** 시뮬레이션상 총 대응 시간(초). */
  elapsedSeconds: number;
  limitSeconds: number;
  /** 판단 지점 평균 반응시간(초). */
  avgReaction: number;
  score: number;
  grade: string;
  /** 점수를 만든 세 축. 0에서 1 사이. 리포트에 그대로 보여 준다. */
  axes: { accuracy: number; simSpeed: number; reaction: number };
  decisions: Decision[];
  lines: ReportLine[];
};

const GRADES: { min: number; label: string; tone: string }[] = [
  { min: 85, label: "우수", tone: "accent" },
  { min: 70, label: "양호", tone: "accent" },
  { min: 55, label: "보통", tone: "heat" },
  { min: 0, label: "재훈련 권장", tone: "cardiac" },
];

export function gradeOf(score: number) {
  return GRADES.find((g) => score >= g.min) ?? GRADES[GRADES.length - 1];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * 점수 = 행동 정확도 60 + 대응 속도 25 + 반응 속도 15.
 * 정확도는 판단 지점 정답률, 대응 속도는 제한시간 대비 여유,
 * 반응 속도는 선택지가 뜨고 실제로 탭하기까지 걸린 시간이다.
 * 리포트에 이 세 축을 그대로 보여 준다.
 */
export function buildResult(decisions: Decision[]): MissionResult {
  const penalty = decisions.reduce((sum, d) => sum + d.penaltySeconds, 0);
  const elapsedSeconds = IDEAL_SECONDS + penalty;
  const correctCount = decisions.filter((d) => d.correct).length;
  const accuracy = decisions.length ? correctCount / decisions.length : 0;
  const simSpeed = clamp01((TIME_LIMIT - elapsedSeconds) / (TIME_LIMIT - IDEAL_SECONDS));
  const avgReaction = decisions.length
    ? decisions.reduce((sum, d) => sum + d.reactionSeconds, 0) / decisions.length
    : 0;
  const reactionScore = clamp01((3.5 - avgReaction) / 2.5);
  const score = Math.round(60 * accuracy + 25 * simSpeed + 15 * reactionScore);

  const penaltyOf = (key: MissionStepKey) =>
    decisions.filter((d) => d.stepKey === key).reduce((sum, d) => sum + d.penaltySeconds, 0);

  const lines: ReportLine[] = [
    {
      key: "report",
      label: "119 신고",
      seconds: BASE_SECONDS.report + penaltyOf("report"),
      targetSeconds: BASE_SECONDS.report,
    },
    {
      key: "search",
      label: "AED 탐색",
      seconds: BASE_SECONDS.search + penaltyOf("search"),
      targetSeconds: BASE_SECONDS.search,
    },
    {
      key: "move",
      label: "현장 이동",
      seconds: BASE_SECONDS.move + penaltyOf("move"),
      targetSeconds: BASE_SECONDS.move,
    },
    {
      key: "use",
      label: "AED 사용",
      seconds: BASE_SECONDS.use + penaltyOf("use"),
      targetSeconds: BASE_SECONDS.use,
    },
  ];

  return {
    success: elapsedSeconds <= TIME_LIMIT,
    elapsedSeconds,
    limitSeconds: TIME_LIMIT,
    avgReaction: Math.round(avgReaction * 100) / 100,
    score,
    grade: gradeOf(score).label,
    axes: { accuracy, simSpeed, reaction: reactionScore },
    decisions,
    lines,
  };
}

/**
 * 게임을 거치지 않고 리포트 화면만 열었을 때 쓰는 기록.
 * 한 번 오답(엘리베이터 대기)이 섞인 현실적인 완주 기록이라 개선 포인트 섹션이 비지 않는다.
 */
export const SAMPLE_DECISIONS: Decision[] = [
  {
    stepKey: "report",
    question: "쓰러진 시민을 발견했습니다. 무엇부터 합니까?",
    chosenLabel: "옆 사람을 지목해 119 신고를 맡기고 바로 움직인다",
    correct: true,
    penaltySeconds: 0,
    feedback: "지목해서 역할을 주면 책임 분산이 사라집니다. 신고와 AED 확보가 동시에 진행됩니다.",
    reactionSeconds: 1.7,
  },
  {
    stepKey: "search",
    question: "어느 AED로 갑니까?",
    chosenLabel: "용인시청 본관 1층 로비",
    correct: true,
    penaltySeconds: 0,
    feedback: "가장 가까운 AED가 아니라 지금 실제로 쓸 수 있는 AED를 골랐습니다.",
    reactionSeconds: 2.6,
  },
  {
    stepKey: "move",
    question: "어떤 경로로 이동합니까?",
    chosenLabel: "금학로 횡단보도로 건너 시청 정문으로",
    correct: true,
    penaltySeconds: 0,
    feedback: "구조자 본인의 안전이 먼저입니다. 신호 대기 12초는 충분히 감당할 수 있는 시간입니다.",
    reactionSeconds: 1.4,
  },
  {
    stepKey: "move",
    question: "시청 정문에 도착했습니다. 로비까지 어떻게 올라갑니까?",
    chosenLabel: "엘리베이터를 기다린다",
    correct: false,
    penaltySeconds: 14,
    feedback: "엘리베이터 대기는 평균 14초를 잃습니다. 1층 이동은 계단을 우선하세요.",
    reactionSeconds: 2.2,
  },
  {
    stepKey: "use",
    question: "제세동 안내가 나왔습니다. 무엇부터 합니까?",
    chosenLabel: "\"모두 물러나세요\"라고 외치고 주변을 확인한 뒤 버튼",
    correct: true,
    penaltySeconds: 0,
    feedback: "제세동 직전 육안 확인은 생략할 수 없는 단계입니다.",
    reactionSeconds: 1.4,
  },
];

export const SAMPLE_RESULT = buildResult(SAMPLE_DECISIONS);

export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m === 0) return `${rest}초`;
  return `${m}분 ${String(rest).padStart(2, "0")}초`;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}
