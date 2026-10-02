import { PHOTO } from "@/projects/youngin/safe/lib/photos";
import type {
  Badge,
  Choice,
  DeviceStep,
  Facility,
  MissionStep,
  Scenario,
} from "@/projects/youngin/safe/lib/types";

/* ------------------------------------------------------------------ *
 * 시나리오 (미션 선택 화면)
 * ------------------------------------------------------------------ */

export const SCENARIOS: Scenario[] = [
  {
    key: "cardiac",
    title: "심정지 대응",
    situation: "저녁 시간 용인중앙시장 골목",
    summary:
      "앞서 걷던 시민이 갑자기 쓰러졌습니다. 골든타임 4분 30초 안에 신고, AED 확보, 사용까지 해내야 합니다.",
    difficulty: "심화",
    minutes: 6,
    steps: 4,
    dataSource: "용인시 AED 설치 위치 데이터",
    photoId: PHOTO.market,
    photoAlt: "전구 줄조명이 걸린 저녁 시장 골목",
    cleared: false,
    bestScore: null,
    playable: true,
  },
  {
    key: "heat",
    title: "폭염 대응",
    situation: "한낮 처인구 김량장동 일대",
    summary:
      "체감온도 35도, 야외 작업 중 어지럼을 호소하는 이웃을 가장 가까운 무더위쉼터까지 안전하게 옮깁니다.",
    difficulty: "기본",
    minutes: 4,
    steps: 3,
    dataSource: "용인시 무더위쉼터 지정 현황",
    photoId: PHOTO.heatwave,
    photoAlt: "도시 원경 위로 내려앉은 한낮의 강한 태양",
    cleared: true,
    bestScore: 88,
    playable: true,
  },
  {
    key: "cold",
    title: "한파 대응",
    situation: "새벽 한파특보, 영하 14도",
    summary:
      "귀갓길에 한랭질환 의심 증상을 보이는 어르신을 발견했습니다. 응급조치와 한파쉼터 안내를 판단합니다.",
    difficulty: "기본",
    minutes: 4,
    steps: 3,
    dataSource: "용인시 한파쉼터 지정 현황",
    photoId: PHOTO.coldwave,
    photoAlt: "눈 덮인 길과 앙상한 겨울 나무",
    cleared: true,
    bestScore: 79,
    playable: true,
  },
  {
    key: "quake",
    title: "지진 대피",
    situation: "규모 4.9 지진, 노후 상가 밀집지역",
    summary:
      "흔들림이 멈춘 직후 30초. 실내 행동 요령부터 옥외대피장소 도착까지의 경로를 선택합니다.",
    difficulty: "입문",
    minutes: 5,
    steps: 4,
    dataSource: "용인시 지진 옥외대피장소 데이터",
    photoId: PHOTO.denseBuildings,
    photoAlt: "좁은 골목을 사이에 둔 밀집 노후 고층 건물",
    cleared: false,
    bestScore: null,
    playable: true,
  },
];

export const TRAINEE = {
  name: "정하윤",
  org: "용인시 처인구 김량장동",
  clearedCount: 2,
  totalCount: 4,
  avgReaction: 2.4,
  badgeCount: 3,
  lastScore: 63,
};

/* ------------------------------------------------------------------ *
 * 심정지 미션 (게임 화면)
 * ------------------------------------------------------------------ */

export const MISSION_STEPS: MissionStep[] = [
  { key: "report", label: "119 신고", shortLabel: "신고" },
  { key: "search", label: "AED 탐색", shortLabel: "탐색" },
  { key: "move", label: "현장 이동", shortLabel: "이동" },
  { key: "use", label: "AED 사용", shortLabel: "사용" },
];

/** 제한시간. 심정지 골든타임 4분 30초. */
export const TIME_LIMIT = 270;

/**
 * 맵 핀. x, y는 CityMap의 0 0 393 300 좌표계 기준이다.
 * 거리와 도보 시간은 보행 속도 1.6m/s로 환산해 서로 어긋나지 않게 맞췄다.
 */
export const FACILITIES: Facility[] = [
  {
    id: "aed-market",
    kind: "aed",
    name: "용인중앙시장 관리사무소",
    mapLabel: "중앙시장 관리소",
    detail: "3층 사무실 입구",
    distance: 90,
    walkSeconds: 56,
    hours: "점검 중 | 패드 교체 예정",
    x: 112,
    y: 214,
    selectable: true,
  },
  {
    id: "aed-cityhall",
    kind: "aed",
    name: "용인시청 본관 1층 로비",
    mapLabel: "용인시청 AED",
    detail: "안내데스크 옆 벽면 보관함",
    distance: 210,
    walkSeconds: 131,
    hours: "24시간 개방",
    x: 285,
    y: 134,
    selectable: true,
  },
  {
    id: "aed-center",
    kind: "aed",
    name: "김량장동 행정복지센터",
    mapLabel: "행정복지센터",
    detail: "2층 민원실 복도",
    distance: 340,
    walkSeconds: 212,
    hours: "운영 09:00~18:00 | 종료",
    x: 52,
    y: 92,
    selectable: true,
  },
  {
    id: "shelter-heat",
    kind: "heatShelter",
    name: "김량장동 경로당",
    mapLabel: "경로당 쉼터",
    detail: "무더위쉼터",
    distance: 260,
    walkSeconds: 163,
    hours: "여름철 09:00~18:00",
    x: 52,
    y: 236,
    selectable: false,
  },
  {
    id: "shelter-cold",
    kind: "coldShelter",
    name: "처인구보건소",
    mapLabel: "보건소 한파쉼터",
    detail: "한파쉼터",
    distance: 420,
    walkSeconds: 263,
    hours: "겨울철 09:00~18:00",
    x: 196,
    y: 33,
    selectable: false,
  },
  {
    id: "evac",
    kind: "evacuation",
    name: "용인초등학교 운동장",
    mapLabel: "용인초 대피장소",
    detail: "지진 옥외대피장소",
    distance: 380,
    walkSeconds: 238,
    hours: "상시 개방",
    x: 310,
    y: 230,
    selectable: false,
  },
];

export const CORRECT_FACILITY_ID = "aed-cityhall";

/** 플레이어 현재 위치. 시장 골목 안쪽. */
export const PLAYER_POSITION = { x: 158, y: 236 };

/** 정답 AED까지의 경로. 금학로 횡단보도를 거쳐 시청 정문으로 들어간다. */
export const ROUTE_PATH = "M158 236 L152 199 L246 192 L250 150 L285 138";

export const REPORT_CHOICES: Choice[] = [
  {
    id: "report-delegate",
    label: "옆 사람을 지목해 119 신고를 맡기고 바로 움직인다",
    hint: "\"파란 외투 입으신 분, 119에 신고해 주세요\"",
    correct: true,
    penaltySeconds: 0,
    feedback: "지목해서 역할을 주면 책임 분산이 사라집니다. 신고와 AED 확보가 동시에 진행됩니다.",
  },
  {
    id: "report-self",
    label: "내가 직접 119에 신고하고 통화를 끝낸 뒤 움직인다",
    hint: "위치 설명에 평균 40초가 더 듭니다",
    correct: false,
    penaltySeconds: 18,
    feedback:
      "신고 자체는 맞지만 통화를 붙잡고 있는 동안 아무도 움직이지 않습니다. 신고는 넘기고 본인은 즉시 이동하세요.",
  },
  {
    id: "report-move-patient",
    label: "환자를 인도 안쪽으로 옮긴 뒤 신고한다",
    hint: "2차 사고 위험이 없다면 옮기지 않습니다",
    correct: false,
    penaltySeconds: 32,
    feedback:
      "차량 진입 같은 즉각적 위험이 없다면 환자를 옮기지 않습니다. 이동 중에는 가슴압박이 중단됩니다.",
  },
];

export const ROUTE_CHOICES: Choice[] = [
  {
    id: "route-crosswalk",
    label: "금학로 횡단보도로 건너 시청 정문으로",
    hint: "210m | 도보 2분 11초",
    correct: true,
    penaltySeconds: 0,
    feedback: "구조자 본인의 안전이 먼저입니다. 신호 대기 12초는 충분히 감당할 수 있는 시간입니다.",
  },
  {
    id: "route-jaywalk",
    label: "왕복 4차로를 가로질러 최단 거리로",
    hint: "165m | 도보 1분 43초",
    correct: false,
    penaltySeconds: 24,
    feedback: "구조자가 다치면 환자도 살릴 수 없습니다. 28초를 벌려다 훈련 기준상 사고 위험에 걸렸습니다.",
  },
  {
    id: "route-underpass",
    label: "지하보도로 우회해 안전하게",
    hint: "290m | 도보 3분 2초",
    correct: false,
    penaltySeconds: 20,
    feedback: "안전하지만 계단 왕복이 더해집니다. 신호가 있는 횡단보도가 이 상황에서는 더 빠릅니다.",
  },
];

export const ENTRY_CHOICES: Choice[] = [
  {
    id: "entry-stairs",
    label: "계단으로 뛰어 올라간다",
    hint: "AED는 1층 로비, 계단 12칸",
    correct: true,
    penaltySeconds: 0,
    feedback: "도착 지점이 1층이면 계단이 항상 빠릅니다.",
  },
  {
    id: "entry-elevator",
    label: "엘리베이터를 기다린다",
    hint: "현재 5층에서 하강 중",
    correct: false,
    penaltySeconds: 14,
    feedback: "엘리베이터 대기는 평균 14초를 잃습니다. 1층 이동은 계단을 우선하세요.",
  },
];

export const SHOCK_CHOICES: Choice[] = [
  {
    id: "shock-clear",
    label: "\"모두 물러나세요\"라고 외치고 주변을 확인한 뒤 버튼",
    hint: "환자와 접촉한 사람이 없는지 눈으로 확인",
    correct: true,
    penaltySeconds: 0,
    feedback: "제세동 직전 육안 확인은 생략할 수 없는 단계입니다.",
  },
  {
    id: "shock-now",
    label: "안내 음성이 나오자마자 바로 버튼을 누른다",
    hint: "가장 빠르지만 접촉자가 감전될 수 있습니다",
    correct: false,
    penaltySeconds: 10,
    feedback:
      "1초를 아끼려다 가슴압박을 하던 사람이 감전될 수 있습니다. 확인은 실제로 1초면 끝납니다.",
  },
];

export const DEVICE_STEPS: DeviceStep[] = [
  {
    id: "power",
    label: "전원 켜기",
    instruction: "덮개를 열고 전원 버튼을 누릅니다. 이후 모든 행동은 음성 안내를 따릅니다.",
    action: "전원 버튼 누르기",
    voice: "전원이 켜졌습니다. 환자의 상의를 벗기십시오.",
  },
  {
    id: "pads",
    label: "패드 부착",
    instruction:
      "오른쪽 빗장뼈 아래, 왼쪽 젖꼭지 바깥쪽 겨드랑이 중간선. 패드 그림과 같은 위치에 맨살로 붙입니다.",
    action: "패드 2장 부착",
    voice: "패드를 환자의 맨 가슴에 부착하십시오.",
  },
  {
    id: "analyze",
    label: "분석 대기",
    instruction: "심장 리듬을 분석하는 동안 아무도 환자에게 닿으면 안 됩니다. 가슴압박도 멈춥니다.",
    action: "손 떼고 대기",
    voice: "심장 리듬을 분석 중입니다. 환자에게서 물러나십시오.",
  },
  {
    id: "shock",
    label: "제세동 시행",
    instruction: "제세동이 필요한 리듬입니다. 주변을 확인하고 깜빡이는 버튼을 누릅니다.",
    action: "제세동 버튼 누르기",
    voice: "제세동이 필요합니다. 깜빡이는 버튼을 누르십시오.",
  },
  {
    id: "cpr",
    label: "가슴압박 재개",
    instruction: "제세동 직후 지체 없이 가슴압박을 다시 시작합니다. 분당 100회에서 120회 속도.",
    action: "즉시 압박 재개",
    voice: "즉시 가슴압박을 시작하십시오.",
  },
];

/** 시뮬레이션상 각 단계에 걸리는 기본 소요 시간(초). 페널티는 여기에 더해진다. */
export const BASE_SECONDS = {
  report: 22,
  search: 18,
  move: 131,
  use: 68,
} as const;

export const IDEAL_SECONDS =
  BASE_SECONDS.report + BASE_SECONDS.search + BASE_SECONDS.move + BASE_SECONDS.use;

/* ------------------------------------------------------------------ *
 * 배지
 * ------------------------------------------------------------------ */

export const BADGES: Badge[] = [
  {
    id: "first-responder",
    name: "첫 대응자",
    description: "첫 미션을 끝까지 완주",
    earned: true,
    isNew: false,
  },
  {
    id: "heat-guardian",
    name: "폭염 지킴이",
    description: "폭염 대응 미션 성공",
    earned: true,
    isNew: false,
  },
  {
    id: "cold-guardian",
    name: "한파 지킴이",
    description: "한파 대응 미션 성공",
    earned: true,
    isNew: false,
  },
  {
    id: "aed-user",
    name: "AED 사용자",
    description: "AED 5단계를 순서대로 완료",
    earned: false,
    isNew: true,
  },
  {
    id: "golden-time",
    name: "골든타임",
    description: "심정지 미션을 4분 안에 성공",
    earned: false,
    isNew: false,
  },
  {
    id: "all-clear",
    name: "생활안전 마스터",
    description: "네 가지 미션 모두 성공",
    earned: false,
    isNew: false,
  },
];

/* ------------------------------------------------------------------ *
 * 실제 상황 행동 가이드 (리포트 화면)
 * ------------------------------------------------------------------ */

export const ACTION_GUIDE = [
  {
    order: 1,
    title: "반응과 호흡을 확인한다",
    body: "양쪽 어깨를 두드리며 크게 부릅니다. 10초 안에 정상 호흡이 없으면 심정지로 판단합니다.",
  },
  {
    order: 2,
    title: "한 사람을 지목해 119와 AED를 맡긴다",
    body: "\"거기 계신 분\"이 아니라 옷차림을 짚어 지목합니다. 지목이 없으면 아무도 움직이지 않습니다.",
  },
  {
    order: 3,
    title: "가슴압박을 즉시 시작한다",
    body: "가슴 중앙을 5cm 깊이로 분당 100회에서 120회. 팔은 곧게 펴고 체중을 실어 누릅니다.",
  },
  {
    order: 4,
    title: "AED가 도착하면 음성 안내를 그대로 따른다",
    body: "전원, 패드 부착, 분석 대기, 제세동. 판단은 기기가 합니다. 사람이 할 일은 손을 떼는 것입니다.",
  },
];
