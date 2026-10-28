import type { Course, MySubscription, SubStatus } from "@/projects/platform/eduon/lib/types";

/*
 * 재생 권한 판단 규칙은 이것 하나다 (spec 6번 "이용 권한 판단").
 * 홈 배지, 상세 잠금, 플레이어, 내 학습, 관리자 목록이 모두 이 파일을 쓴다.
 */

export type EpisodeAccess = "free" | "preview" | "subscribed" | "locked";
export type Scope = "무료 공개" | "구독 전용";

/** 구독 전용 강의를 볼 수 있는 상태. 갱신 해지는 잔여 기간 동안 이용 가능하다 */
export function subscriptionActive(status: SubStatus) {
  return status === "active" || status === "cancelled";
}

export function courseScope(course: Course): Scope {
  return course.access.free ? "무료 공개" : "구독 전용";
}

export function isPreview(course: Course, episodeNo: number) {
  return !course.access.free && course.access.previewEpisodes.includes(episodeNo);
}

export function episodeAccess(course: Course, episodeNo: number, sub: MySubscription): EpisodeAccess {
  if (course.access.free) return "free";
  if (course.access.subscription && subscriptionActive(sub.status)) return "subscribed";
  if (isPreview(course, episodeNo)) return "preview";
  return "locked";
}

export function canPlay(course: Course, episodeNo: number, sub: MySubscription) {
  return episodeAccess(course, episodeNo, sub) !== "locked";
}

/** 일반 사용자 목록과 검색에 나오는 강좌. 비공개, 검수 중, 게시 중단은 빠진다 */
export function isListed(course: Course) {
  return course.publish === "공개" && course.review === "승인";
}

export const SUB_STATUS_LABEL: Record<SubStatus, string> = {
  free: "무료 회원",
  active: "구독 중",
  cancelled: "갱신 해지",
  failed: "갱신 실패",
  expired: "만료",
  refunded: "환불 처리",
};

export const CHANNEL_LABEL = { web: "웹 카드", ios: "App Store", android: "Google Play" } as const;
