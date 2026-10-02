/* 사용자 콘솔 라우팅. 워크스페이스 규칙상 URL은 하나뿐이라 전부 내부 상태다. */
export type UserView =
  | "auth"
  | "home"
  | "browse"
  | "detail"
  | "sell"
  | "chat"
  | "community"
  | "postDetail"
  | "mypage";

/** 상단 내비에 노출되는 항목. auth, detail, postDetail은 내비 밖이다. */
export const TOP_NAV: { key: UserView; label: string }[] = [
  { key: "browse", label: "매물 탐색" },
  { key: "community", label: "커뮤니티" },
  { key: "chat", label: "채팅" },
  { key: "mypage", label: "마이페이지" },
];

/* ---------- 관리자 C4 ---------- */

/* C4는 2단계 IA다. 최상위 섹션(레일) → 하위 뷰(섹션 리스트 컬럼).
   총 15개 뷰라 C1의 평면 레일이나 C3의 수평 내비로는 담기지 않는다. */
export type AdminSection = "dashboard" | "listings" | "members" | "community";

export type AdminView =
  | "overview"
  | "listingTable"
  | "priceRules"
  | "overPrice"
  | "masterData"
  | "bannedItems"
  | "memberTable"
  | "tradeHistory"
  | "settlements"
  | "disputes"
  | "postTable"
  | "reportQueue"
  | "fraudPattern"
  | "bannedWords"
  | "inquiries";

export interface AdminSectionDef {
  key: AdminSection;
  label: string;
  views: { key: AdminView; label: string }[];
  /** 섹션 리스트 컬럼 하단의 요약 블록. 섹션마다 값이 달라야 C4가 C1로 퇴화하지 않는다. */
  summary: { label: string; value: string; tone?: "warn" | "danger" };
}

export const ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    key: "dashboard",
    label: "운영 대시보드",
    views: [{ key: "overview", label: "전체 현황" }],
    summary: { label: "오늘 거래 성사", value: "412건" },
  },
  {
    key: "listings",
    label: "매물 / 티켓",
    views: [
      { key: "listingTable", label: "매물 조회" },
      { key: "overPrice", label: "정가 초과 탐지" },
      { key: "priceRules", label: "티켓 정가 기준표" },
      { key: "masterData", label: "카테고리 / 구단 마스터" },
      { key: "bannedItems", label: "금지 품목 키워드" },
    ],
    summary: { label: "자동탐지 대기", value: "2건", tone: "warn" },
  },
  {
    key: "members",
    label: "회원 / 거래",
    views: [
      { key: "memberTable", label: "회원 조회" },
      { key: "tradeHistory", label: "거래 이력" },
      { key: "settlements", label: "안전거래 정산" },
      { key: "disputes", label: "분쟁 / 환불" },
    ],
    summary: { label: "분쟁 진행", value: "2건", tone: "danger" },
  },
  {
    key: "community",
    label: "커뮤니티 / 신고",
    views: [
      { key: "reportQueue", label: "신고 처리" },
      { key: "postTable", label: "게시글 / 댓글" },
      { key: "fraudPattern", label: "사기 의심 패턴" },
      { key: "bannedWords", label: "금칙어 관리" },
      { key: "inquiries", label: "공지 / 1:1 문의" },
    ],
    summary: { label: "신고 미처리", value: "3건", tone: "danger" },
  },
];

export function sectionOf(view: AdminView): AdminSectionDef {
  return (
    ADMIN_SECTIONS.find((s) => s.views.some((v) => v.key === view)) ?? ADMIN_SECTIONS[0]
  );
}

export function viewLabel(view: AdminView): string {
  for (const s of ADMIN_SECTIONS) {
    const hit = s.views.find((v) => v.key === view);
    if (hit) return hit.label;
  }
  return "";
}
