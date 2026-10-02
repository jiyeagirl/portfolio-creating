export type PawfitView =
  | "login"
  | "home"
  | "petProfile"
  | "sizeRecommendation"
  | "productList"
  | "productDetail"
  | "cart"
  | "checkout"
  | "mypage"
  | "orderHistory"
  | "profileEdit"
  | "sizeFeedback";

/** 두 번째 인자는 화면이 필요로 하는 대상 id (반려동물 id, 상품 id, 카테고리 키 등). */
export type NavigateFn = (view: PawfitView, id?: string) => void;

export type TabKey = "home" | "productList" | "petProfile" | "mypage";

/** 하단 탭이 보이는 화면(허브 화면)만 매핑한다. 나머지는 전부 몰입형 하위 플로우라 탭이 없다. */
export const TAB_OF_VIEW: Partial<Record<PawfitView, TabKey>> = {
  home: "home",
  productList: "productList",
  petProfile: "petProfile",
  mypage: "mypage",
};

export const TAB_ROOTS: PawfitView[] = ["home", "productList", "petProfile", "mypage"];

/** `?screen=` 스크린샷 캡처 파라미터 검증용 전체 화면 목록. */
export const ALL_VIEWS: PawfitView[] = [
  "login",
  "home",
  "petProfile",
  "sizeRecommendation",
  "productList",
  "productDetail",
  "cart",
  "checkout",
  "mypage",
  "orderHistory",
  "profileEdit",
  "sizeFeedback",
];
