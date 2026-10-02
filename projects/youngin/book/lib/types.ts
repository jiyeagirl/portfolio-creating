export type District = "처인구" | "기흥구" | "수지구";

export type Facility =
  | "어린이자료실"
  | "종합자료실"
  | "디지털자료실"
  | "스터디룸"
  | "문화프로그램실"
  | "북카페"
  | "장애인 편의시설"
  | "수유실"
  | "야외독서마당"
  | "노트북존";

export type Program = {
  id: string;
  title: string;
  period: string;
  target: string;
  slots: string;
  status: "모집중" | "대기접수" | "마감";
};

export type Library = {
  id: string;
  name: string;
  short: string;
  district: District;
  address: string;
  tel: string;
  distanceKm: number;
  photoId: number;
  photoAlt: string;
  /** 지도 카드 위 핀 좌표 (컨테이너 대비 %) */
  map: { x: number; y: number };
  hours: { weekday: string; weekend: string; closed: string };
  facilities: Facility[];
  qrSpot: string;
  programs: Program[];
  visited: boolean;
  visitCount: number;
  lastVisitedAt?: string;
  opensAt: string;
  isOpenNow: boolean;
  /** 신설 또는 소규모 분관. 지점 순회 챌린지에서 가산점 대상 */
  newBranch: boolean;
};

export type ReadLog = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: BookCategory;
  finishedAt: string;
  photoId: number;
  photoAlt: string;
  note?: string;
  libraryId?: string;
  missionId?: string;
};

export type BookCategory = "문학" | "인문" | "과학" | "사회" | "예술";

export type RecommendedBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: BookCategory;
  pages: number;
  blurb: string;
  holdings: number;
  available: number;
};

export type MissionKind = "recommend" | "theme" | "branch" | "event";

export type Mission = {
  id: string;
  kind: MissionKind;
  label: string;
  title: string;
  summary: string;
  description: string;
  period: string;
  daysLeft: number;
  progress: number;
  goal: number;
  unit: string;
  reward: string;
  photoId?: number;
  photoAlt?: string;
  steps: string[];
  joined: number;
  books?: string[];
  priority?: "정보취약계층 우선";
};

export type StampKind = "visit" | "read" | "mission";

export type Stamp = {
  id: string;
  kind: StampKind;
  /** 도장 안쪽 라벨. 지점 스탬프는 지점 약칭, 완독 스탬프는 완독 */
  label: string;
  caption: string;
  date: string;
  earned: boolean;
};

export type BadgeTier = "bronze" | "silver" | "gold";

export type Badge = {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: { current: number; goal: number };
};

export type RewardStatus = "사용가능" | "사용완료" | "진행중";

export type Reward = {
  id: string;
  name: string;
  detail: string;
  condition: string;
  status: RewardStatus;
  date?: string;
  progress?: { current: number; goal: number };
};

export type TimelineKind = "visit" | "read" | "badge" | "mission" | "reward";

export type TimelineEntry = {
  id: string;
  kind: TimelineKind;
  date: string;
  title: string;
  detail: string;
  photoId?: number;
  photoAlt?: string;
};

export type MonthStat = {
  month: string;
  visits: number;
  reads: number;
  missionRate: number;
};
