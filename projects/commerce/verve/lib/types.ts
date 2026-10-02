/* ---------- 공통 ---------- */

export type Gender = "남성" | "여성";
export type WorkoutPurpose = "러닝" | "웨이트" | "요가/필라테스" | "일상 착용";
export type PreferredFit = "슬림" | "레귤러" | "오버사이즈";
export type SizeLabel = "XS" | "S" | "M" | "L" | "XL";

/* ---------- 상품 ---------- */

export type ProductCategory = "러닝" | "트레이닝" | "요가" | "아우터" | "액세서리";

export type ColorOption = {
  name: string;
  hex: string;
  image: string;
};

export type SizeStock = {
  size: SizeLabel;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  workoutTypes: WorkoutPurpose[];
  price: number;
  originalPrice?: number;
  colors: ColorOption[];
  gallery: string[];
  spin360: string[];
  isNew?: boolean;
  isBest?: boolean;
  rank?: number;
  rating: number;
  reviewCount: number;
  sizes: SizeStock[];
  material: string;
  care: string[];
  description: string;
  fitNote: string;
};

/* ---------- AI 사이즈 추천 ---------- */

export type SizeRecommendationInput = {
  gender: Gender;
  heightCm: number;
  weightKg: number;
  workoutPurpose: WorkoutPurpose;
  preferredFit: PreferredFit;
};

export type SizeRecommendationResult = {
  recommendedSize: SizeLabel;
  confidence: number;
  reasons: string[];
  expectedFit: string;
  modelComparison: {
    modelHeightCm: number;
    modelWeightKg: number;
    modelWearingSize: SizeLabel;
  };
};

/* ---------- 리뷰 ---------- */

export type Review = {
  id: string;
  productId: string;
  author: string;
  verified: boolean;
  rating: number;
  fitSatisfaction: "작아요" | "딱맞아요" | "커요";
  sizeSatisfaction: number;
  purchasedSize: SizeLabel;
  heightCm?: number;
  weightKg?: number;
  disclosed: boolean;
  body: string;
  photo?: string;
  date: string;
  helpfulCount: number;
};

/* ---------- 장바구니 / 주문 ---------- */

export type CartItem = {
  cartId: string;
  productId: string;
  name: string;
  image: string;
  color: string;
  size: SizeLabel;
  price: number;
  quantity: number;
};

export type OrderStatus = "결제완료" | "배송준비중" | "배송중" | "배송완료";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  color: string;
  size: SizeLabel;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  estimatedDelivery: string;
  recipient: string;
  address: string;
};

export type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  recipient: string;
  phone: string;
  address: string;
};

export type Coupon = {
  id: string;
  title: string;
  discount: string;
  minAmount: number;
  expiresAt: string;
};

/* ---------- 사용자 ---------- */

export type MembershipTier = "WHITE" | "SILVER" | "GOLD" | "BLACK";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  preferredFit: PreferredFit;
  tier: MembershipTier;
  points: number;
  memberSince: string;
};

/* ---------- 고객센터 ---------- */

export type FaqCategory = "주문/결제" | "배송" | "교환/반품" | "사이즈/AI 추천" | "회원/포인트";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export type Notice = {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
};
