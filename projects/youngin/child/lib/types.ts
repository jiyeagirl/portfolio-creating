/** 연령대 밴드. 시설/미션/복지 배너의 노출 대상은 전부 이 값으로만 매칭한다.
 *  시설명이 아니라 표준 카테고리 + 연령 로직으로 설계해야 타 지자체로 확산된다(spec.md 3항). */
export type AgeBand = "infant" | "toddler" | "preschool" | "school";

export type FacilityCategory = "forest" | "playground" | "library" | "toyLibrary" | "waterPlay";

export interface Child {
  id: string;
  name: string;
  /** 만 나이 표기용 개월 수 */
  months: number;
  band: AgeBand;
  /** 다음 연령대까지 남은 개월 수. 0이면 이미 마지막 밴드 */
  monthsToNextBand: number;
  nextBand: AgeBand | null;
  joinedAt: string;
  /** 방문한 서로 다른 시설 수 */
  visitedCount: number;
  stampCount: number;
}

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  district: string;
  address: string;
  distanceKm: number;
  hours: string;
  /** 휴관일, 우천 시 운영 등 예외 안내 */
  closedNote: string;
  phone: string;
  /** 이용 대상 연령대 */
  bands: AgeBand[];
  ageLabel: string;
  intro: string;
  /** 시설 상세의 특징 칩 */
  tags: string[];
  /** 지금 열려 있는 미션 한 줄 요약 (홈 카드용) */
  openMission: string;
  reward: string;
  /** 시설 상세에서 펼쳐 보여줄 미션 id */
  missionIds: string[];
  /** 손으로 확인한 picsum id. 대응하는 사진이 없는 시설은 undefined 로 두고
   *  카테고리 글리프 타일을 쓴다(lib/mock-data.ts 사진 대장 참고). */
  photo?: number;
  /** 시설 상세 사진 스트립. 확인한 사진이 있는 시설에만 있다. */
  gallery?: number[];
  visited: boolean;
}

export type MissionState = "done" | "active" | "locked";

/** 방문 미션(시설 1곳에서 끝나는 것), 시즌 미션(기간 한정), 연령별 미션(밴드 전환으로 열리는 것). */
export type MissionKind = "visit" | "season" | "age";

export interface Mission {
  id: string;
  kind: MissionKind;
  title: string;
  detail: string;
  state: MissionState;
  /** locked 미션이 열리는 연령대 */
  unlockBand?: AgeBand;
  reward: string;
  /** 도장 개수. 완료 예정 리워드 합계를 내는 데 쓴다. */
  stamps: number;
  bands: AgeBand[];
  facilityId?: string;
  /** 여러 번 반복해야 끝나는 미션만 있다 */
  progress?: { done: number; goal: number };
  /** 기간 한정 미션의 마감 표기 */
  dueLabel?: string;
  completedAt?: string;
}

export interface SeasonMission {
  season: string;
  title: string;
  detail: string;
  goal: number;
  done: number;
  endsOn: string;
  reward: string;
  photo: number;
}

export interface WelfareBanner {
  id: string;
  /** 배너 분류 라벨. 관리자 콘솔의 등록 폼과 같은 값 */
  kind: "현금성 지원" | "이용 안내" | "프로그램 모집" | "건강 관리";
  title: string;
  body: string;
  cta: string;
  /** 노출 대상 연령대 */
  bands: AgeBand[];
  /** 이미지 배너면 picsum id, 텍스트 배너면 undefined */
  photo?: number;
  department: string;
  period: string;
  /** 관리자 통계용 */
  impressions: number;
  taps: number;
  status: "노출 중" | "예약" | "종료";
}

export interface VisitRecord {
  id: string;
  /** 타임라인 월 묶음 키 */
  month: string;
  date: string;
  facilityId: string;
  facilityName: string;
  category: FacilityCategory;
  note: string;
  stamps: number;
  /** 인증 사진. 사진 없이 QR 인증만 한 방문은 undefined */
  photo?: number;
}

export interface MonthlyStat {
  month: string;
  label: string;
  visits: number;
  facilities: number;
  stamps: number;
}

/* ── 관리자 콘솔 ── */

export interface BandStat {
  band: AgeBand;
  children: number;
  visits: number;
  /** 배너 탭 전환율(%) */
  tapRate: number;
}

export interface AdminFacilityRow {
  id: string;
  name: string;
  category: FacilityCategory;
  district: string;
  bands: AgeBand[];
  qrScans: number;
  lastSyncedAt: string;
  status: "운영 중" | "점검" | "휴관";
}
