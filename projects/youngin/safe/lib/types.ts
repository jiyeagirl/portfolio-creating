export type ScreenKey = "select" | "game" | "report";

export type ScenarioKey = "cardiac" | "heat" | "cold" | "quake";

export type Difficulty = "입문" | "기본" | "심화";

/** 미션 카드에서 쓰는 시나리오 메타. */
export type Scenario = {
  key: ScenarioKey;
  title: string;
  situation: string;
  /** 카드 본문 한 줄 설명. */
  summary: string;
  difficulty: Difficulty;
  minutes: number;
  steps: number;
  /** 실제 데이터 출처를 카드에 노출한다. 데이터 활용 가시성이 이 서비스의 핵심이다. */
  dataSource: string;
  photoId: number;
  /** 사진이 무엇을 담고 있는지. lib/photos.ts의 캡션 표와 짝을 이룬다. */
  photoAlt: string;
  cleared: boolean;
  bestScore: number | null;
  playable: boolean;
};

export type FacilityKind = "aed" | "heatShelter" | "coldShelter" | "evacuation";

/** 게임 맵에 찍히는 실제 안전시설 핀. x, y는 맵 SVG 좌표계. */
export type Facility = {
  id: string;
  kind: FacilityKind;
  name: string;
  /** 맵 위에 찍히는 짧은 이름. 정식 명칭은 리스트에서만 쓴다. */
  mapLabel: string;
  detail: string;
  /** 미터. */
  distance: number;
  /** 도보 초. */
  walkSeconds: number;
  hours: string;
  x: number;
  y: number;
  /** 목적지로 고를 수 있는 핀인지. false면 맵 컨텍스트로만 보인다. */
  selectable: boolean;
};

export type MissionStepKey = "report" | "search" | "move" | "use";

export type MissionStep = {
  key: MissionStepKey;
  label: string;
  shortLabel: string;
};

/** 상황 선택지. 하나만 correct이고, 나머지는 리포트의 개선 포인트로 이어진다. */
export type Choice = {
  id: string;
  label: string;
  hint: string;
  correct: boolean;
  /** 오답을 골랐을 때 대응 시간에 더해지는 페널티 초. */
  penaltySeconds: number;
  feedback: string;
};

/** AED 사용 단계의 세부 인터랙션 한 스텝. */
export type DeviceStep = {
  id: string;
  label: string;
  instruction: string;
  action: string;
  /** 기기가 음성 안내로 읽어 주는 문장. */
  voice: string;
};

export type ReportLine = {
  key: MissionStepKey;
  label: string;
  /** 초. */
  seconds: number;
  targetSeconds: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  isNew: boolean;
};
