export type VeliView =
  | "login"
  | "home"
  | "numberDetail"
  | "callFlow"
  | "history"
  | "callDetail"
  | "passes"
  | "purchase"
  | "mypage"
  | "profileEdit"
  | "settings";

/** 두 번째 인자는 화면이 필요로 하는 대상 id (통화 id, 시나리오 키 등). */
export type NavigateFn = (view: VeliView, id?: string) => void;


/* 아키타입 A2(크리덴셜 월렛) — 하단 탭바가 없다. 홈은 크리덴셜 카드 덱 한 장이고,
   나머지 화면은 전부 카드에서 올라오는 시트다. 아래 세 상수가 그 규칙을 정의한다. */

/** 시트로 뜨지 않고 화면 전체를 점유하는 뷰. 로그인은 아직 지갑이 없는 상태이고,
    통화 플로우는 실제 통화 중이라 지갑을 덮는 것이 맞다. */
export const FULLSCREEN_VIEWS: VeliView[] = ["login", "callFlow"];

/** 시트 헤더에 쓸 제목. 홈은 시트가 아니므로 없다. */
export const SHEET_TITLE: Partial<Record<VeliView, string>> = {
  numberDetail: "안심번호 상세",
  history: "통화 기록",
  callDetail: "통화 상세",
  passes: "이용권",
  purchase: "이용권 구매",
  mypage: "내 정보",
  profileEdit: "프로필 수정",
  settings: "설정",
};

/** 시트 안에서 뒤로 갈 목적지. 값이 없으면 시트를 닫고 지갑으로 돌아간다. */
export const SHEET_PARENT: Partial<Record<VeliView, VeliView>> = {
  callDetail: "history",
  purchase: "passes",
  profileEdit: "mypage",
  settings: "mypage",
};


/** `?screen=` 스크린샷 캡처 파라미터 검증용 전체 화면 목록. `SHEET_TITLE`은
    시트로 뜨는 뷰만 담고 있어 이 목적으로는 쓸 수 없다. */
export const ALL_VIEWS: VeliView[] = [
  "login",
  "home",
  "numberDetail",
  "callFlow",
  "history",
  "callDetail",
  "passes",
  "purchase",
  "mypage",
  "profileEdit",
  "settings",
];
