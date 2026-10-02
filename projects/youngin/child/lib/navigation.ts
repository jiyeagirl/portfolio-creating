import type { AgeBand, FacilityCategory, MissionKind } from "@/projects/youngin/child/lib/types";

/** 프로젝트는 URL 하나만 쓴다. 화면 전환은 전부 이 값과 onNavigate 콜백으로만 한다. */
export type ChildScreen = "home" | "facility" | "mission" | "record";

export type ChildNavigate = (
  next: ChildScreen,
  options?: { facilityId?: string; openQr?: boolean },
) => void;

/** 하단 탭에 올라가는 화면. 시설 상세는 탭이 아니라 푸시로 열리는 화면이라 빠져 있다. */
export const TAB_SCREENS: ChildScreen[] = ["home", "mission", "record"];

/** 연령대 밴드는 개월 수 구간으로만 정의한다. 시설명이 아니라 이 구간이
 *  시설/미션/배너 매칭의 단일 기준이라 타 지자체에도 그대로 이식된다. */
export const BAND_LABEL: Record<AgeBand, string> = {
  infant: "영아기",
  toddler: "유아기",
  preschool: "취학 준비기",
  school: "초등 저학년",
};

export const BAND_RANGE: Record<AgeBand, string> = {
  infant: "0 - 23개월",
  toddler: "만 2 - 4세",
  preschool: "만 5 - 6세",
  school: "만 7 - 9세",
};

export const BAND_ORDER: AgeBand[] = ["infant", "toddler", "preschool", "school"];

/** 밴드별 길이(개월). 현재 밴드 안에서 아이가 어디쯤 왔는지 그리는 데 쓴다. */
export const BAND_SPAN: Record<AgeBand, number> = {
  infant: 24,
  toddler: 36,
  preschool: 24,
  school: 36,
};

export const CATEGORY_LABEL: Record<FacilityCategory, string> = {
  forest: "숲 체험",
  playground: "놀이터",
  library: "어린이도서관",
  toyLibrary: "장난감도서관",
  waterPlay: "물놀이장",
};

export const MISSION_KIND_LABEL: Record<MissionKind, string> = {
  visit: "방문 미션",
  season: "시즌 미션",
  age: "연령별 미션",
};

/* ── 조사 ──
 * 아이 이름과 연령대 라벨이 데이터라서 조사를 문장에 박아 둘 수 없다.
 * "서아는 / 도윤은", "서아가 / 도윤이" 처럼 받침에 따라 갈리므로 여기서 붙인다. */

function hasFinalConsonant(word: string): boolean {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/** 은/는 */
export function withTopic(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "은" : "는"}`;
}

/** 이/가 */
export function withSubject(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "이" : "가"}`;
}

/** 와/과 */
export function withCompanion(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "과" : "와"}`;
}

/** 개월 수를 "만 6세 7개월" 형태로. 24개월 미만은 개월 수만 쓰는 국내 표기 관례를 따른다. */
export function formatAge(months: number): string {
  if (months < 24) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `만 ${years}세` : `만 ${years}세 ${rest}개월`;
}

/** 남은 개월 수를 "1년 4개월" / "5개월" 로. */
export function formatDuration(months: number): string {
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years}년` : `${years}년 ${rest}개월`;
}
