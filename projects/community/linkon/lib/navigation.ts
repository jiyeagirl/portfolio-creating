export type LinkonView =
  | "signup"
  | "home"
  | "companies"
  | "companyDetail"
  | "chat"
  | "feed"
  | "feedWrite"
  | "board"
  | "boardDetail"
  | "mentor"
  | "mentorDetail"
  | "mentorAsk";

export type NavigateFn = (view: LinkonView, id?: string) => void;

export const PRIMARY_NAV: { view: LinkonView; label: string }[] = [
  { view: "home", label: "홈" },
  { view: "companies", label: "기업 찾기" },
  { view: "feed", label: "네트워킹 피드" },
  { view: "board", label: "정보게시판" },
  { view: "mentor", label: "멘토 Q&A" },
  { view: "chat", label: "채팅" },
];
