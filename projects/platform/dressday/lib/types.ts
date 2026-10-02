// 고객 사이트와 관리자 콘솔이 함께 쓰는 도메인 타입.

export type Category = "원피스" | "블라우스, 셔츠" | "니트" | "아우터" | "스커트" | "팬츠" | "셋업";

export type Occasion = "하객" | "면접, 오피스" | "데이트" | "여행" | "파티";

export type Size = "XS" | "S" | "M" | "L" | "XL";

/** 사진 없는 상품 타일에 쓰는 의류 아이콘 종류 */
export type Garment = "dress" | "shirt" | "knit" | "outer" | "skirt" | "pants";

export type Tone = "wait" | "live" | "act" | "done" | "stop";

export interface Product {
  id: string;
  name: string;
  /** 입점 라벨. 실존 브랜드처럼 읽히지 않게 글자 기반 이름을 쓴다 (CLAUDE.md Completeness) */
  label: string;
  category: Category;
  occasions: Occasion[];
  color: string;
  /** 사진이 없을 때 타일 바탕색. 상품 색 이름에 맞춘다 */
  tone: string;
  /** 타일 위 아이콘 색 (밝은 톤이면 잉크, 어두운 톤이면 흰색) */
  toneInk: "dark" | "light";
  garment: Garment;
  /** 1일 대여료 (원) */
  price: number;
  /** 보증금 (원). 반납 검수 후 환불 */
  deposit: number;
  /** 정가 (원) */
  retail: number;
  /** 사이즈별 대여 가능 수량. 0이면 오늘 예약 불가 */
  stock: Partial<Record<Size, number>>;
  /** 오늘 받을 수 있는지 (재고 + 당일 배차 여유) */
  today: boolean;
  isNew: boolean;
  /** 인기 순위. 없으면 순위 밖 */
  rank?: number;
  /** 이번 주(9/11~9/17) 대여 횟수. 인기 순위의 근거 */
  week?: number;
  /** 누적 대여 횟수 */
  rentals: number;
  /** picsum 고정 id. 없으면 톤 타일 + 사진 요청 목록 */
  photo?: { id: number; alt: string };
}

export type ScreenName =
  | "home"
  | "browse"
  | "product"
  | "booking"
  | "payment"
  | "tracking"
  | "return"
  | "mypage";

export type NavigateFn = (screen: ScreenName) => void;
