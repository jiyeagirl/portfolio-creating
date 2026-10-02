import type { StaticImageData } from "next/image";

export type Species = "dog" | "cat";

export type Pet = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  gender: "수컷" | "암컷";
  birthDate: string;
  weightKg: number;
  backLengthCm: number;
  chestGirthCm: number;
  neckCm: number;
  photo: StaticImageData;
  registeredAt: string;
};

export type RecommendConfidence = "매우 적합" | "적합" | "참고용";

export type SizeRecommendation = {
  petId: string;
  recommendedSize: string;
  confidence: RecommendConfidence;
  basis: string[];
  brandSizes: { brand: string; size: string }[];
};

export type ProductCategory = "니트" | "레인코트" | "하네스" | "반다나" | "부츠" | "잠옷";

export type BrandTint = "pink" | "teal" | "lavender" | "peach" | "ochre" | "cream";

export type SizeRow = { size: string; chest: number; neck: number; length: number };

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  listPrice?: number;
  brandTint: BrandTint;
  colorways: { name: string; hex: string }[];
  sizes: string[];
  sizeChart: SizeRow[];
  rating: number;
  reviewCount: number;
  recommendedFor: Species[];
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  /** 실제 착용 사진이 검증된 상품만 채운다. 없으면 ProductTile이 브랜드 컬러 타일로 대체한다. */
  image?: StaticImageData;
};

export type CartItem = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

export type Coupon = {
  id: string;
  label: string;
  discount: number;
  minAmount: number;
  expiresAt: string;
  used: boolean;
};

export type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

export type PaymentMethodPF = {
  id: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

export type OrderStatus = "결제완료" | "배송준비" | "배송중" | "배송완료" | "취소";

export type OrderItem = {
  productId: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderedAt: string;
  addressLabel: string;
  trackingNo?: string;
};

export type FitFeedback = "작아요" | "딱 맞아요" | "커요";
export type AccuracyFeedback = "정확해요" | "약간 달라요" | "부정확해요";

export type SizeFeedback = {
  id: string;
  petName: string;
  productId: string;
  purchasedSize: string;
  fit: FitFeedback;
  rating: number;
  body: string;
  photo?: StaticImageData;
  accuracy: AccuracyFeedback;
  createdAt: string;
};

export type UserProfile = {
  name: string;
  email: string;
  joinedAt: string;
  welcomeCouponIssued: boolean;
};

/* ---------- 관리자 콘솔 ---------- */

export type AdminSizeRule = {
  id: string;
  brand: string;
  scope: string;
  weightRange: string;
  chestRange: string;
  neckRange: string;
  recommendedSize: string;
  updatedAt: string;
};

export type AdminProductRow = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  exposed: boolean;
  recommendedFor: Species[];
  updatedAt: string;
};

export type AdminMemberRow = {
  id: string;
  name: string;
  email: string;
  petCount: number;
  orderCount: number;
  totalSpent: number;
  joinedAt: string;
};

export type AdminFeedbackRow = {
  id: string;
  member: string;
  petName: string;
  product: string;
  fit: FitFeedback;
  accuracy: AccuracyFeedback;
  rating: number;
  createdAt: string;
};

export type AdminInquiry = {
  id: string;
  member: string;
  subject: string;
  category: "사이즈" | "배송" | "결제" | "상품" | "기타";
  status: "대기" | "답변완료" | "종료";
  createdAt: string;
};

export type AdminReview = {
  id: string;
  member: string;
  product: string;
  rating: number;
  body: string;
  createdAt: string;
  exposed: boolean;
};
