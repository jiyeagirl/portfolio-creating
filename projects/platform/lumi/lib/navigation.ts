export type LumiView =
  | "home"
  | "experts"
  | "expertDetail"
  | "passes"
  | "purchase"
  | "booking"
  | "call"
  | "history"
  | "reviewWrite"
  | "mypage"
  | "favorites"
  | "payments"
  | "profileEdit";

/** 두 번째 인자는 화면이 필요로 하는 대상 id (상담사 id, 예약 id, 상담권 등급 등). */
export type NavigateFn = (view: LumiView, id?: string) => void;

export type TabKey = "home" | "experts" | "passes" | "history" | "mypage";

/** 하단 탭이 활성으로 보여야 하는 화면 묶음. */
export const TAB_OF_VIEW: Record<LumiView, TabKey> = {
  home: "home",
  experts: "experts",
  expertDetail: "experts",
  passes: "passes",
  purchase: "passes",
  booking: "experts",
  call: "history",
  history: "history",
  reviewWrite: "history",
  mypage: "mypage",
  favorites: "mypage",
  payments: "mypage",
  profileEdit: "mypage",
};
