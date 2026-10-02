import type {
  AdminInventoryRow,
  AdminMemberRow,
  AdminProductRow,
  AdminReservationRow,
  AppNotification,
  Coupon,
  ErpSyncLog,
  Faq,
  Inquiry,
  LiftPass,
  Notice,
  PaymentRecord,
  Reservation,
  Room,
  RoomOptionAddon,
  RentalGear,
  SnowPackage,
  UserProfile,
} from "@/projects/commerce/snowpeak/lib/types";

export function formatWon(value: number): string {
  return value.toLocaleString("ko-KR");
}

/* ---------- 객실 ---------- */

export const ROOMS: Room[] = [
  {
    id: "room-deluxe-mtn",
    name: "디럭스 마운틴뷰",
    tagline: "능선이 그대로 펼쳐지는 전망, 스키인/스키아웃 최단 동선",
    bedType: "킹베드",
    viewPhoto: 41,
    galleryPhotos: [41, 365],
    maxAdult: 2,
    maxChild: 1,
    sizeSqm: 42,
    amenities: ["마운틴뷰", "발코니", "조식포함", "무료주차"],
    basePrice: 320000,
    stock: 6,
    rating: 4.8,
    reviewCount: 214,
    description:
      "슬로프가 정면으로 보이는 킹베드 객실. 전용 발코니에서 리프트 라인까지 한눈에 들어와 시즌권 이용객에게 인기가 높다.",
  },
  {
    id: "room-suite-lake",
    name: "스위트 레이크뷰",
    tagline: "고산 호수를 품은 통유리 스위트, 커플 여행객 선호",
    bedType: "킹베드",
    viewPhoto: 575,
    galleryPhotos: [575, 365],
    maxAdult: 2,
    maxChild: 0,
    sizeSqm: 58,
    amenities: ["레이크뷰", "월풀", "벽난로", "조식포함"],
    basePrice: 480000,
    stock: 3,
    rating: 4.9,
    reviewCount: 132,
    description:
      "거실과 침실이 분리된 스위트. 룸 내 월풀과 벽난로가 있어 겨울밤 휴식에 특화되어 있다.",
  },
  {
    id: "room-premier",
    name: "프리미어 스위트",
    tagline: "리조트 최상급 룸, 전용 라운지 이용 포함",
    bedType: "킹베드",
    viewPhoto: 128,
    galleryPhotos: [128, 365],
    maxAdult: 4,
    maxChild: 2,
    sizeSqm: 86,
    amenities: ["마운틴뷰", "월풀", "벽난로", "조식포함", "무료주차"],
    basePrice: 780000,
    stock: 2,
    rating: 5,
    reviewCount: 47,
    description:
      "복층 구조의 최상급 스위트. 전용 컨시어지와 라운지 무제한 이용이 포함되어 가족/그룹 단위 프리미엄 여행에 적합하다.",
  },
  {
    id: "room-ondol-family",
    name: "온돌 패밀리룸",
    tagline: "아이 동반 가족을 위한 온돌 바닥, 최대 5인",
    bedType: "온돌",
    viewPhoto: 599,
    galleryPhotos: [599, 365],
    maxAdult: 3,
    maxChild: 2,
    sizeSqm: 52,
    amenities: ["레이크뷰", "조식포함", "무료주차", "반려동물동반"],
    basePrice: 260000,
    stock: 8,
    rating: 4.6,
    reviewCount: 301,
    description:
      "온돌 바닥과 확장형 매트리스로 구성된 가족실. 반려동물 동반이 가능한 몇 안 되는 객실 타입이다.",
  },
];

export const ROOM_OPTION_ADDONS: RoomOptionAddon[] = [
  { id: "addon-breakfast-extra", label: "조식 추가(1인)", price: 28000, unit: "1건" },
  { id: "addon-late-checkout", label: "레이트 체크아웃(14시)", price: 40000, unit: "1건" },
  { id: "addon-crib", label: "아기 침대 대여", price: 15000, unit: "1박" },
  { id: "addon-fireplace-kit", label: "벽난로 장작 세트", price: 20000, unit: "1건" },
];

/* ---------- 리프트권 / 시즌권 ---------- */

export const LIFT_PASSES: LiftPass[] = [
  {
    id: "lift-1day",
    category: "1일권",
    name: "전 슬로프 1일 리프트권",
    price: 78000,
    validity: "발권일 09:00~17:00",
    perks: ["전 슬로프 이용", "곤돌라 무제한"],
    stock: 420,
  },
  {
    id: "lift-half",
    category: "반일권",
    name: "오후 반일 리프트권",
    price: 52000,
    validity: "13:00~17:00",
    perks: ["전 슬로프 이용"],
    stock: 260,
  },
  {
    id: "lift-night",
    category: "야간권",
    name: "나이트 세션 리프트권",
    price: 45000,
    validity: "18:00~22:00",
    perks: ["야간 조명 슬로프 전용"],
    stock: 300,
  },
  {
    id: "season-standard",
    category: "시즌권",
    name: "스탠다드 시즌권",
    price: 890000,
    validity: "2023-12-01 ~ 2024-02-29",
    perks: ["전 슬로프 무제한", "주말 포함", "렌탈 10% 할인"],
    stock: 45,
  },
  {
    id: "season-premium",
    category: "시즌권",
    name: "프리미엄 시즌권",
    price: 1290000,
    validity: "2023-12-01 ~ 2024-02-29",
    perks: ["전 슬로프 무제한", "주말 포함", "렌탈 20% 할인", "라운지 무료 이용"],
    stock: 20,
  },
];

/* ---------- 장비 렌탈 ---------- */

export const RENTAL_GEAR: RentalGear[] = [
  {
    id: "rental-ski-all",
    category: "스키",
    name: "올라운드 스키 세트",
    photo: 249,
    sizeOptions: ["150cm", "160cm", "170cm", "180cm"],
    pricePerDay: 35000,
    stock: 80,
  },
  {
    id: "rental-board-park",
    category: "보드",
    name: "파크 스노보드 세트",
    photo: 925,
    sizeOptions: ["148cm", "154cm", "158cm", "162cm"],
    pricePerDay: 38000,
    stock: 64,
  },
  {
    id: "rental-boots",
    category: "부츠",
    name: "스키/보드 겸용 부츠",
    photo: 1044,
    sizeOptions: ["230", "240", "250", "260", "270", "280"],
    pricePerDay: 12000,
    stock: 150,
  },
  {
    id: "rental-helmet",
    category: "헬멧",
    name: "세이프티 헬멧",
    photo: 79,
    sizeOptions: ["S", "M", "L"],
    pricePerDay: 8000,
    stock: 120,
  },
  {
    id: "rental-wear",
    category: "웨어",
    name: "방한 상하의 세트",
    photo: 95,
    sizeOptions: ["S", "M", "L", "XL"],
    pricePerDay: 18000,
    stock: 90,
  },
];

/* ---------- 패키지 ---------- */

export const PACKAGES: SnowPackage[] = [
  {
    id: "package-honeymoon",
    name: "알펜글로우 허니문 패키지",
    tag: "허니문",
    photo: 510,
    nights: 2,
    includes: ["스위트 레이크뷰 2박", "커플 스파 1회", "조식 2회", "야간 리프트권 2매"],
    price: 890000,
    listPrice: 1050000,
    stock: 12,
    description: "설산을 배경으로 한 로맨틱한 2박 3일 커플 패키지. 스파와 야간 스키를 함께 즐길 수 있다.",
  },
  {
    id: "package-family",
    name: "패밀리 스노우 패키지",
    tag: "패밀리",
    photo: 599,
    nights: 2,
    includes: ["온돌 패밀리룸 2박", "장비 렌탈 4인", "1일 리프트권 4매", "조식 4인"],
    price: 1180000,
    listPrice: 1420000,
    stock: 15,
    description: "4인 가족 기준 렌탈과 리프트권까지 한 번에 해결하는 패키지. 아이 동반 여행에 최적화되어 있다.",
  },
  {
    id: "package-premier",
    name: "프리미어 올인클루시브",
    tag: "프리미엄",
    photo: 128,
    nights: 3,
    includes: ["프리미어 스위트 3박", "전용 라운지 이용", "시즌권 등급 리프트권", "장비 프리미엄 라인 렌탈"],
    price: 2480000,
    listPrice: 2950000,
    stock: 4,
    description: "리조트 최상급 룸과 프리미엄 장비, 라운지 이용까지 포함된 올인클루시브 패키지.",
  },
  {
    id: "package-earlybird",
    name: "얼리버드 위크데이 패키지",
    tag: "얼리버드",
    photo: 575,
    nights: 1,
    includes: ["디럭스 마운틴뷰 1박", "1일 리프트권 2매", "조식 2인"],
    price: 420000,
    listPrice: 520000,
    stock: 30,
    description: "평일 1박 단기 여행객을 위한 얼리버드 특가 패키지. 60일 전 예약 시 추가 할인이 적용된다.",
  },
];

/* ---------- 쿠폰 / 공지 / FAQ ---------- */

export const COUPONS: Coupon[] = [
  { id: "coupon-welcome", label: "첫 예약 웰컴 쿠폰", discount: 20000, discountType: "정액", minAmount: 100000, expiresAt: "2024-01-31", used: false },
  { id: "coupon-season10", label: "시즌권 구매 10% 할인", discount: 10, discountType: "정률", minAmount: 500000, expiresAt: "2023-12-31", used: false },
  { id: "coupon-family5", label: "패밀리 패키지 5% 할인", discount: 5, discountType: "정률", minAmount: 800000, expiresAt: "2023-11-30", used: true },
];

export const NOTICES: Notice[] = [
  {
    id: "notice-open",
    tag: "이벤트",
    title: "2023-24 시즌 슬로프 오픈, 사전 예약 15% 할인",
    body: "12월 1일 개장을 기념해 11월 30일까지 전 상품 사전 예약 시 15% 할인이 적용됩니다.",
    photo: 232,
    date: "2023-10-13",
  },
  {
    id: "notice-lift-inspect",
    tag: "점검",
    title: "3번 곤돌라 정기 점검 안내(10/22~10/24)",
    body: "안전 점검으로 인해 3번 곤돌라가 일시 운행 중단됩니다. 대체 노선은 2번 리프트를 이용해 주세요.",
    date: "2023-10-17",
  },
  {
    id: "notice-honeymoon",
    tag: "이벤트",
    title: "알펜글로우 허니문 패키지 단독 혜택",
    body: "11월 중 예약 시 커플 스파 1회가 무료로 추가 제공됩니다.",
    photo: 510,
    date: "2023-10-14",
  },
  {
    id: "notice-terms",
    tag: "공지",
    title: "이용약관 및 개인정보 처리방침 개정 안내",
    body: "2023년 11월 1일부로 일부 약관이 개정됩니다. 자세한 내용은 고객센터에서 확인하실 수 있습니다.",
    date: "2023-10-01",
  },
];

export const FAQS: Faq[] = [
  { id: "faq-1", category: "예약", question: "객실과 리프트권을 따로 예약할 수 있나요?", answer: "네, 장바구니에서 객실/리프트권/렌탈을 개별적으로 담아 한 번에 결제하거나 각각 결제하실 수 있습니다." },
  { id: "faq-2", category: "예약", question: "인원 변경은 어떻게 하나요?", answer: "예약 상세 화면에서 체크인 3일 전까지 인원 변경 요청이 가능합니다. 이후에는 고객센터로 문의해 주세요." },
  { id: "faq-3", category: "취소환불", question: "리프트권도 환불이 되나요?", answer: "미사용 리프트권은 이용일 기준 1일 전까지 전액 환불됩니다. 당일 취소는 수수료 20%가 발생합니다." },
  { id: "faq-4", category: "취소환불", question: "패키지 상품 취소 규정이 궁금해요.", answer: "체크인 7일 전까지 전액 환불, 3~6일 전 50% 환불, 2일 이내 환불 불가입니다." },
  { id: "faq-5", category: "결제", question: "포인트와 쿠폰을 함께 사용할 수 있나요?", answer: "네, 쿠폰 할인 적용 후 남은 금액에 대해 포인트를 사용하실 수 있습니다." },
  { id: "faq-6", category: "이용안내", question: "장비 렌탈은 현장 수령인가요?", answer: "온라인으로 예약한 렌탈 장비는 리조트 1층 렌탈 데스크에서 예약 확인 후 수령하실 수 있습니다." },
];

/* ---------- 회원 / 예약 / 결제 / 알림 ---------- */

export const USER_PROFILE: UserProfile = {
  name: "김서윤",
  email: "seoyoon.kim@example.com",
  phone: "010-2837-9910",
  joinedAt: "2023-05-20",
  tier: "골드",
  pointBalance: 48200,
  autoLogin: true,
  pushEnabled: true,
};

export const RESERVATIONS: Reservation[] = [
  {
    id: "res-1001",
    confirmationNo: "SP-231013-0342",
    lines: [
      { kind: "room", name: "디럭스 마운틴뷰", detail: "2023-12-24 ~ 2023-12-26, 2박", quantity: 1, amount: 640000 },
      { kind: "lift", name: "전 슬로프 1일 리프트권", detail: "2매", quantity: 2, amount: 156000 },
    ],
    totalAmount: 796000,
    status: "확정",
    checkIn: "2023-12-24",
    checkOut: "2023-12-26",
    createdAt: "2023-10-13",
    paymentMethod: "신용카드",
    guestName: "김서윤",
  },
  {
    id: "res-1002",
    confirmationNo: "SP-231009-0119",
    lines: [{ kind: "package", name: "알펜글로우 허니문 패키지", detail: "2023-12-31 ~ 2024-01-02, 2박", quantity: 1, amount: 890000 }],
    totalAmount: 890000,
    status: "예약대기",
    checkIn: "2023-12-31",
    checkOut: "2024-01-02",
    createdAt: "2023-10-09",
    paymentMethod: "카카오페이",
    guestName: "김서윤",
  },
  {
    id: "res-1003",
    confirmationNo: "SP-230827-0087",
    lines: [
      { kind: "rental", name: "올라운드 스키 세트", detail: "170cm, 2일", quantity: 1, amount: 70000 },
      { kind: "rental", name: "세이프티 헬멧", detail: "M, 2일", quantity: 1, amount: 16000 },
    ],
    totalAmount: 86000,
    status: "체크아웃",
    checkIn: "2023-09-12",
    checkOut: "2023-09-14",
    createdAt: "2023-08-27",
    paymentMethod: "신용카드",
    guestName: "김서윤",
  },
  {
    id: "res-1004",
    confirmationNo: "SP-230715-0021",
    lines: [{ kind: "room", name: "온돌 패밀리룸", detail: "2023-07-22 ~ 2023-07-23, 1박", quantity: 1, amount: 260000 }],
    totalAmount: 260000,
    status: "취소",
    checkIn: "2023-07-22",
    checkOut: "2023-07-23",
    createdAt: "2023-07-15",
    paymentMethod: "네이버페이",
    guestName: "김서윤",
  },
  {
    id: "res-1005",
    confirmationNo: "SP-221020-0205",
    lines: [{ kind: "season", name: "스탠다드 시즌권", detail: "2022-12-01 ~ 2023-02-28", quantity: 1, amount: 890000 }],
    totalAmount: 890000,
    status: "환불완료",
    checkIn: "2022-12-01",
    checkOut: "2023-02-28",
    createdAt: "2022-10-20",
    paymentMethod: "무통장입금",
    guestName: "김서윤",
  },
];

export const PAYMENT_RECORDS: PaymentRecord[] = [
  { id: "pay-1", reservationId: "res-1001", confirmationNo: "SP-231013-0342", amount: 796000, method: "신용카드", paidAt: "2023-10-13", status: "결제완료" },
  { id: "pay-2", reservationId: "res-1003", confirmationNo: "SP-230827-0087", amount: 86000, method: "신용카드", paidAt: "2023-08-27", status: "결제완료" },
  { id: "pay-3", reservationId: "res-1004", confirmationNo: "SP-230715-0021", amount: 260000, method: "네이버페이", paidAt: "2023-07-15", status: "환불완료" },
  { id: "pay-4", reservationId: "res-1005", confirmationNo: "SP-221020-0205", amount: 890000, method: "무통장입금", paidAt: "2022-10-20", status: "환불완료" },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "notif-1", type: "예약", title: "예약이 확정되었습니다", body: "디럭스 마운틴뷰 2023-12-24 예약이 확정되었습니다.", read: false, createdAt: "2023-10-13 14:22" },
  { id: "notif-2", type: "프로모션", title: "허니문 패키지 스파 무료 혜택", body: "11월 중 예약 시 커플 스파가 무료로 제공됩니다.", read: false, createdAt: "2023-10-14 09:10" },
  { id: "notif-3", type: "결제", title: "결제가 완료되었습니다", body: "SP-231013-0342 결제가 정상 완료되었습니다.", read: true, createdAt: "2023-10-13 14:20" },
  { id: "notif-4", type: "공지", title: "3번 곤돌라 정기 점검 안내", body: "10월 22일~24일 3번 곤돌라 운행이 중단됩니다.", read: true, createdAt: "2023-10-17 08:00" },
  { id: "notif-5", type: "예약", title: "체크인 3일 전입니다", body: "온돌 패밀리룸 체크인이 3일 남았습니다. 준비물을 확인해 주세요.", read: true, createdAt: "2023-07-19 10:00" },
];

export const INQUIRIES: Inquiry[] = [
  {
    id: "inquiry-1",
    subject: "패키지 인원 변경 문의",
    body: "허니문 패키지 인원을 2인에서 3인으로 변경하고 싶습니다.",
    status: "답변완료",
    createdAt: "2023-10-11",
    answeredAt: "2023-10-12",
    answer: "패키지 상품은 정원이 고정되어 있어 인원 변경이 어렵습니다. 대신 추가 인원 상품을 별도로 담아드릴 수 있습니다.",
  },
  {
    id: "inquiry-2",
    subject: "렌탈 장비 사이즈 교환 가능 여부",
    body: "현장에서 부츠 사이즈가 맞지 않을 경우 교환이 가능한가요?",
    status: "답변대기",
    createdAt: "2023-10-14",
  },
];

/* ---------- 관리자 콘솔 ---------- */

export const ADMIN_RESERVATIONS: AdminReservationRow[] = [
  { id: "ar-1", confirmationNo: "SP-231013-0342", guestName: "김서윤", guestPhone: "010-2837-9910", kind: "room", productName: "디럭스 마운틴뷰", checkIn: "2023-12-24", checkOut: "2023-12-26", amount: 640000, status: "확정", channel: "앱", createdAt: "2023-10-13" },
  { id: "ar-2", confirmationNo: "SP-231009-0119", guestName: "김서윤", guestPhone: "010-2837-9910", kind: "package", productName: "알펜글로우 허니문 패키지", checkIn: "2023-12-31", checkOut: "2024-01-02", amount: 890000, status: "예약대기", channel: "앱", createdAt: "2023-10-09" },
  { id: "ar-3", confirmationNo: "SP-231015-0552", guestName: "박지훈", guestPhone: "010-4471-2039", kind: "room", productName: "스위트 레이크뷰", checkIn: "2023-12-20", checkOut: "2023-12-22", amount: 960000, status: "확정", channel: "웹", createdAt: "2023-10-15" },
  { id: "ar-4", confirmationNo: "SP-231015-0553", guestName: "이하늘", guestPhone: "010-9982-1174", kind: "package", productName: "패밀리 스노우 패키지", checkIn: "2024-01-15", checkOut: "2024-01-17", amount: 1180000, status: "예약대기", channel: "제휴", createdAt: "2023-10-15" },
  { id: "ar-5", confirmationNo: "SP-231011-0441", guestName: "최민재", guestPhone: "010-1123-7784", kind: "season", productName: "프리미엄 시즌권", checkIn: "2023-12-01", checkOut: "2024-02-29", amount: 1290000, status: "확정", channel: "웹", createdAt: "2023-10-11" },
  { id: "ar-6", confirmationNo: "SP-231010-0410", guestName: "정유나", guestPhone: "010-5566-3321", kind: "rental", productName: "파크 스노보드 세트", checkIn: "2023-12-26", checkOut: "2023-12-28", amount: 76000, status: "체크인", channel: "앱", createdAt: "2023-10-10" },
  { id: "ar-7", confirmationNo: "SP-231006-0388", guestName: "한도윤", guestPhone: "010-7789-4432", kind: "room", productName: "온돌 패밀리룸", checkIn: "2023-10-27", checkOut: "2023-10-28", amount: 260000, status: "취소", channel: "앱", createdAt: "2023-10-06" },
  { id: "ar-8", confirmationNo: "SP-230813-0092", guestName: "오세라", guestPhone: "010-2298-6610", kind: "lift", productName: "전 슬로프 1일 리프트권", checkIn: "2023-10-22", checkOut: "2023-10-22", amount: 78000, status: "체크아웃", channel: "웹", createdAt: "2023-08-13" },
  { id: "ar-9", confirmationNo: "SP-221020-0205", guestName: "김서윤", guestPhone: "010-2837-9910", kind: "season", productName: "스탠다드 시즌권", checkIn: "2022-12-01", checkOut: "2023-02-28", amount: 890000, status: "환불완료", channel: "앱", createdAt: "2022-10-20" },
  { id: "ar-10", confirmationNo: "SP-231014-0561", guestName: "장은우", guestPhone: "010-3345-8871", kind: "package", productName: "프리미어 올인클루시브", checkIn: "2024-01-20", checkOut: "2024-01-23", amount: 2480000, status: "확정", channel: "웹", createdAt: "2023-10-14" },
];

export const ADMIN_PRODUCTS: AdminProductRow[] = [
  { id: "ap-1", category: "객실", name: "디럭스 마운틴뷰", price: 320000, stock: 6, exposed: true, updatedAt: "2023-10-01" },
  { id: "ap-2", category: "객실", name: "스위트 레이크뷰", price: 480000, stock: 3, exposed: true, updatedAt: "2023-10-01" },
  { id: "ap-3", category: "객실", name: "프리미어 스위트", price: 780000, stock: 2, exposed: true, updatedAt: "2023-09-29" },
  { id: "ap-4", category: "객실", name: "온돌 패밀리룸", price: 260000, stock: 8, exposed: true, updatedAt: "2023-10-01" },
  { id: "ap-5", category: "리프트권", name: "전 슬로프 1일 리프트권", price: 78000, stock: 420, exposed: true, updatedAt: "2023-10-13" },
  { id: "ap-6", category: "리프트권", name: "나이트 세션 리프트권", price: 45000, stock: 300, exposed: true, updatedAt: "2023-10-13" },
  { id: "ap-7", category: "시즌권", name: "스탠다드 시즌권", price: 890000, stock: 45, exposed: true, promo: "사전예약 15%", updatedAt: "2023-10-13" },
  { id: "ap-8", category: "시즌권", name: "프리미엄 시즌권", price: 1290000, stock: 20, exposed: true, updatedAt: "2023-10-13" },
  { id: "ap-9", category: "렌탈", name: "올라운드 스키 세트", price: 35000, stock: 80, exposed: true, updatedAt: "2023-09-26" },
  { id: "ap-10", category: "렌탈", name: "파크 스노보드 세트", price: 38000, stock: 64, exposed: true, updatedAt: "2023-09-26" },
  { id: "ap-11", category: "패키지", name: "알펜글로우 허니문 패키지", price: 890000, stock: 12, exposed: true, promo: "커플 스파 무료", updatedAt: "2023-10-14" },
  { id: "ap-12", category: "패키지", name: "프리미어 올인클루시브", price: 2480000, stock: 4, exposed: false, updatedAt: "2023-09-11" },
];

export const ADMIN_MEMBERS: AdminMemberRow[] = [
  { id: "am-1", name: "김서윤", email: "seoyoon.kim@example.com", phone: "010-2837-9910", tier: "골드", reservationCount: 5, totalSpent: 2862000, joinedAt: "2023-05-20", dormant: false },
  { id: "am-2", name: "박지훈", email: "jihoon.park@example.com", phone: "010-4471-2039", tier: "실버", reservationCount: 2, totalSpent: 960000, joinedAt: "2023-07-30", dormant: false },
  { id: "am-3", name: "이하늘", email: "haneul.lee@example.com", phone: "010-9982-1174", tier: "화이트", reservationCount: 1, totalSpent: 1180000, joinedAt: "2023-10-09", dormant: false },
  { id: "am-4", name: "최민재", email: "minjae.choi@example.com", phone: "010-1123-7784", tier: "블랙", reservationCount: 12, totalSpent: 8420000, joinedAt: "2023-03-05", dormant: false },
  { id: "am-5", name: "정유나", email: "yuna.jung@example.com", phone: "010-5566-3321", tier: "실버", reservationCount: 3, totalSpent: 412000, joinedAt: "2023-06-25", dormant: false },
  { id: "am-6", name: "한도윤", email: "doyoon.han@example.com", phone: "010-7789-4432", tier: "화이트", reservationCount: 1, totalSpent: 0, joinedAt: "2023-10-06", dormant: false },
  { id: "am-7", name: "오세라", email: "sera.oh@example.com", phone: "010-2298-6610", tier: "화이트", reservationCount: 1, totalSpent: 78000, joinedAt: "2023-04-20", dormant: true },
  { id: "am-8", name: "장은우", email: "eunwoo.jang@example.com", phone: "010-3345-8871", tier: "골드", reservationCount: 7, totalSpent: 5210000, joinedAt: "2023-03-25", dormant: false },
];

export const ADMIN_INVENTORY: AdminInventoryRow[] = [
  { id: "inv-1", category: "객실", itemName: "디럭스 마운틴뷰", totalStock: 12, available: 6, lowStockThreshold: 3, underMaintenance: false, updatedAt: "2023-10-15" },
  { id: "inv-2", category: "객실", itemName: "스위트 레이크뷰", totalStock: 6, available: 3, lowStockThreshold: 2, underMaintenance: false, updatedAt: "2023-10-15" },
  { id: "inv-3", category: "객실", itemName: "프리미어 스위트", totalStock: 4, available: 2, lowStockThreshold: 1, underMaintenance: true, updatedAt: "2023-10-14" },
  { id: "inv-4", category: "객실", itemName: "온돌 패밀리룸", totalStock: 14, available: 8, lowStockThreshold: 3, underMaintenance: false, updatedAt: "2023-10-15" },
  { id: "inv-5", category: "장비", itemName: "올라운드 스키 세트", totalStock: 120, available: 80, lowStockThreshold: 20, underMaintenance: false, updatedAt: "2023-10-13" },
  { id: "inv-6", category: "장비", itemName: "파크 스노보드 세트", totalStock: 90, available: 64, lowStockThreshold: 15, underMaintenance: false, updatedAt: "2023-10-13" },
  { id: "inv-7", category: "장비", itemName: "세이프티 헬멧", totalStock: 150, available: 12, lowStockThreshold: 20, underMaintenance: false, updatedAt: "2023-10-15" },
  { id: "inv-8", category: "리프트권", itemName: "전 슬로프 1일 리프트권", totalStock: 500, available: 420, lowStockThreshold: 100, underMaintenance: false, updatedAt: "2023-10-15" },
  { id: "inv-9", category: "리프트권", itemName: "야간 세션 리프트권", totalStock: 350, available: 300, lowStockThreshold: 80, underMaintenance: false, updatedAt: "2023-10-15" },
];

export const ERP_LOGS: ErpSyncLog[] = [
  { id: "erp-1", module: "예약", status: "성공", syncedAt: "2023-10-15 09:00", message: "예약 데이터 128건 동기화 완료", recordCount: 128 },
  { id: "erp-2", module: "결제", status: "성공", syncedAt: "2023-10-15 09:00", message: "결제 데이터 121건 동기화 완료", recordCount: 121 },
  { id: "erp-3", module: "재고", status: "실패", syncedAt: "2023-10-15 08:30", message: "재고 API 응답 시간 초과(timeout)로 12건 동기화 실패", recordCount: 12 },
  { id: "erp-4", module: "상품", status: "성공", syncedAt: "2023-10-14 21:00", message: "상품 정보 12건 동기화 완료", recordCount: 12 },
  { id: "erp-5", module: "회원", status: "성공", syncedAt: "2023-10-14 21:00", message: "회원 데이터 8건 동기화 완료", recordCount: 8 },
  { id: "erp-6", module: "매출", status: "대기", syncedAt: "2023-10-15 10:00", message: "일 매출 정산 데이터 처리 대기 중", recordCount: 0 },
  { id: "erp-7", module: "정산", status: "성공", syncedAt: "2023-10-14 06:00", message: "전일 정산 데이터 회계 시스템 전송 완료", recordCount: 1 },
  { id: "erp-8", module: "재고", status: "성공", syncedAt: "2023-10-14 08:30", message: "재고 데이터 34건 동기화 완료", recordCount: 34 },
];
