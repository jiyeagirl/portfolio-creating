export type TabKey = "home" | "approvals" | "notifications" | "mypage";

export type MarketflowMobileScreen = TabKey | "contentReview";

export type MarketflowMobileNavigate = (screen: MarketflowMobileScreen, contentId?: string) => void;

/** 하단 탭이 감춰지고 뒤로가기 헤더를 쓰는 화면. */
export const FULLSCREEN: MarketflowMobileScreen[] = ["contentReview"];

/** 각 화면이 눌린 상태로 보여야 할 탭. contentReview는 진입 경로(승인함/알림)를 유지한다. */
export const TAB_OF_SCREEN: Record<MarketflowMobileScreen, TabKey> = {
  home: "home",
  approvals: "approvals",
  notifications: "notifications",
  mypage: "mypage",
  contentReview: "approvals",
};
