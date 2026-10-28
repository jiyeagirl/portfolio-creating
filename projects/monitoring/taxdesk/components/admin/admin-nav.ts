import { FILINGS } from "@/projects/monitoring/taxdesk/lib/admin-data";
import type { Filing } from "@/projects/monitoring/taxdesk/lib/admin-data";

export const ADMIN_SCREENS = ["review", "jobs", "auth", "mapping", "automation", "members", "payments", "knowledge"] as const;
export type AdminScreen = (typeof ADMIN_SCREENS)[number];

export type SectionId = "review" | "auto" | "ops";

export const SECTION_OF: Record<AdminScreen, SectionId> = {
  review: "review",
  jobs: "auto",
  auth: "auto",
  mapping: "auto",
  automation: "auto",
  members: "ops",
  payments: "ops",
  knowledge: "ops",
};

export const SCREEN_LABEL: Record<AdminScreen, string> = {
  review: "신고 검토",
  jobs: "전체 작업",
  auth: "인증 대기",
  mapping: "필드 매핑",
  automation: "자동화 설정",
  members: "회원 관리",
  payments: "결제 관리",
  knowledge: "지식자료 관리",
};

/** 신고 검토 큐. 섹션 리스트 컬럼이 이 필터를 고른다 */
export const REVIEW_QUEUES = ["전체 접수", "검토 대기", "보완 요청 중", "입금 대기", "기한 임박", "반려"] as const;
export type ReviewQueue = (typeof REVIEW_QUEUES)[number];

export function inQueue(f: Filing, q: ReviewQueue) {
  switch (q) {
    case "전체 접수":
      return true;
    case "검토 대기":
      return f.stage === "접수" || f.stage === "검토 중";
    case "보완 요청 중":
      return f.stage === "보완 요청";
    case "입금 대기":
      return f.payment === "입금 대기" || f.payment === "기한 임박";
    case "기한 임박":
      return f.stage === "접수" || f.stage === "검토 중" || f.stage === "보완 요청";
    case "반려":
      return f.stage === "반려";
  }
}

export function queueCount(q: ReviewQueue) {
  return FILINGS.filter((f) => inQueue(f, q)).length;
}
