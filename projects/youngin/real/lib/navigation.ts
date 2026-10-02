/* 사용자 앱은 URL 하나(/youngin/real) 안에서 화면 상태로만 이동한다.
   CLAUDE.md의 "One URL per project" 규칙 — next/link 나 추가 라우트를 쓰지 않는다. */

export type TabKey = "home" | "map" | "districts" | "festivals";

export type Route =
  | { name: "home" }
  | { name: "map"; focusId?: string }
  | { name: "districts" }
  | { name: "festivals" }
  | { name: "directions"; targetId: string }
  | { name: "districtDetail"; districtId: string }
  | { name: "storeDetail"; storeId: string }
  | { name: "festivalDetail"; festivalId: string };

export const TAB_ROUTE: Record<TabKey, Route> = {
  home: { name: "home" },
  map: { name: "map" },
  districts: { name: "districts" },
  festivals: { name: "festivals" },
};

export function tabOf(route: Route): TabKey | null {
  switch (route.name) {
    case "home":
      return "home";
    case "map":
      return "map";
    case "districts":
      return "districts";
    case "festivals":
      return "festivals";
    default:
      return null;
  }
}

/* 관리자 콘솔은 별도 프로젝트(/youngin/real-admin)에서만 진입한다.
   사용자 앱에는 관리자 링크를 두지 않는다. */

export type AdminScreen = "dashboard" | "data" | "reports";

export const ADMIN_NAV: { key: AdminScreen; label: string; desc: string }[] = [
  { key: "dashboard", label: "운영 대시보드", desc: "등록 현황과 처리 대기 요약" },
  { key: "data", label: "시설 / 상점 데이터", desc: "공공데이터 기반 정보 등록과 보정" },
  { key: "reports", label: "오류 신고 / 콘텐츠", desc: "신고 검수와 노출 콘텐츠 관리" },
];
