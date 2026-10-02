export type TabKey = "home" | "explore" | "reviews" | "community" | "mypage";

export type View =
  | TabKey
  | "vendorDetail"
  | "compare"
  | "verifyUpload"
  | "postDetail"
  | "postWrite"
  | "myVerifications"
  | "myReviews"
  | "bookmarks"
  | "activity"
  | "support"
  | "account";

export type NavigateParams = {
  id?: string;
  ids?: string[];
  category?: string;
};

export type NavigateFn = (view: View, params?: NavigateParams) => void;

export const TABS: { key: TabKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "explore", label: "탐색" },
  { key: "reviews", label: "리뷰" },
  { key: "community", label: "커뮤니티" },
  { key: "mypage", label: "마이" },
];
