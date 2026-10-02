/* ---------- 사용자 앱 ---------- */

export type MembershipTier = "화이트" | "실버" | "골드" | "블랙";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  tier: MembershipTier;
  pointBalance: number;
  autoLogin: boolean;
  pushEnabled: boolean;
};

export type RoomBedType = "킹베드" | "트윈베드" | "온돌";

export type RoomAmenity =
  | "마운틴뷰"
  | "레이크뷰"
  | "발코니"
  | "월풀"
  | "벽난로"
  | "조식포함"
  | "무료주차"
  | "반려동물동반";

export type Room = {
  id: string;
  name: string;
  tagline: string;
  bedType: RoomBedType;
  viewPhoto: number;
  galleryPhotos: number[];
  maxAdult: number;
  maxChild: number;
  sizeSqm: number;
  amenities: RoomAmenity[];
  basePrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
};

export type RoomOptionAddon = {
  id: string;
  label: string;
  price: number;
  unit: "1박" | "1건";
};

export type LiftPassCategory = "1일권" | "반일권" | "야간권" | "시즌권";

export type LiftPass = {
  id: string;
  category: LiftPassCategory;
  name: string;
  price: number;
  validity: string;
  perks: string[];
  stock: number;
};

export type RentalGearCategory = "스키" | "보드" | "부츠" | "헬멧" | "웨어";

export type RentalGear = {
  id: string;
  category: RentalGearCategory;
  name: string;
  photo: number;
  sizeOptions: string[];
  pricePerDay: number;
  stock: number;
};

export type PackageTag = "허니문" | "패밀리" | "프리미엄" | "얼리버드";

export type SnowPackage = {
  id: string;
  name: string;
  tag: PackageTag;
  photo: number;
  nights: number;
  includes: string[];
  price: number;
  listPrice: number;
  stock: number;
  description: string;
};

export type CartItemKind = "room" | "lift" | "season" | "rental" | "package";

export type CartItem = {
  cartId: string;
  kind: CartItemKind;
  refId: string;
  name: string;
  detail: string;
  checkIn?: string;
  checkOut?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
};

export type Coupon = {
  id: string;
  label: string;
  discount: number;
  discountType: "정액" | "정률";
  minAmount: number;
  expiresAt: string;
  used: boolean;
};

export type PaymentMethodOption = "신용카드" | "카카오페이" | "네이버페이" | "무통장입금";

export type ReservationStatus = "예약대기" | "확정" | "체크인" | "체크아웃" | "취소" | "환불완료";

export type ReservationLine = {
  kind: CartItemKind;
  name: string;
  detail: string;
  quantity: number;
  amount: number;
};

export type Reservation = {
  id: string;
  confirmationNo: string;
  lines: ReservationLine[];
  totalAmount: number;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  paymentMethod: PaymentMethodOption;
  guestName: string;
};

export type PaymentRecord = {
  id: string;
  reservationId: string;
  confirmationNo: string;
  amount: number;
  method: PaymentMethodOption;
  paidAt: string;
  status: "결제완료" | "환불완료" | "부분환불";
};

export type NoticeTag = "이벤트" | "공지" | "점검";

export type Notice = {
  id: string;
  tag: NoticeTag;
  title: string;
  body: string;
  photo?: number;
  date: string;
};

export type NotificationType = "예약" | "결제" | "프로모션" | "공지";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type Faq = {
  id: string;
  category: "예약" | "결제" | "취소환불" | "이용안내";
  question: string;
  answer: string;
};

export type InquiryStatus = "답변대기" | "답변완료";

export type Inquiry = {
  id: string;
  subject: string;
  body: string;
  status: InquiryStatus;
  createdAt: string;
  answeredAt?: string;
  answer?: string;
};

/* ---------- 관리자 콘솔 ---------- */

export type AdminReservationRow = {
  id: string;
  confirmationNo: string;
  guestName: string;
  guestPhone: string;
  kind: CartItemKind;
  productName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: ReservationStatus;
  channel: "앱" | "웹" | "제휴";
  createdAt: string;
};

export type AdminProductCategory = "객실" | "리프트권" | "시즌권" | "렌탈" | "패키지";

export type AdminProductRow = {
  id: string;
  category: AdminProductCategory;
  name: string;
  price: number;
  stock: number;
  exposed: boolean;
  promo?: string;
  updatedAt: string;
};

export type AdminMemberRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: MembershipTier;
  reservationCount: number;
  totalSpent: number;
  joinedAt: string;
  dormant: boolean;
};

export type AdminInventoryCategory = "객실" | "장비" | "리프트권";

export type AdminInventoryRow = {
  id: string;
  category: AdminInventoryCategory;
  itemName: string;
  totalStock: number;
  available: number;
  lowStockThreshold: number;
  underMaintenance: boolean;
  updatedAt: string;
};

export type ErpModule = "예약" | "결제" | "상품" | "재고" | "회원" | "매출" | "정산";

export type ErpSyncLog = {
  id: string;
  module: ErpModule;
  status: "성공" | "실패" | "대기";
  syncedAt: string;
  message: string;
  recordCount: number;
};
