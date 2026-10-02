import heroDalmatianRun from "@/projects/commerce/pawfit/assets/pets/hero-dalmatian-run.jpg";
import puppyCreamCarpet from "@/projects/commerce/pawfit/assets/pets/puppy-cream-carpet.jpg";
import beagleCouchCollar from "@/projects/commerce/pawfit/assets/pets/beagle-couch-collar.jpg";
import terrierHarnessGrass from "@/projects/commerce/pawfit/assets/pets/terrier-harness-grass.jpg";
import catBlackLookup from "@/projects/commerce/pawfit/assets/pets/cat-black-lookup.jpg";
import catTabbyCollarPath from "@/projects/commerce/pawfit/assets/pets/cat-tabby-collar-path.jpg";
import catTabbyWetPavement from "@/projects/commerce/pawfit/assets/pets/cat-tabby-wet-pavement.jpg";
import kittenSleepingFabric from "@/projects/commerce/pawfit/assets/pets/kitten-sleeping-fabric.jpg";
import knitDogMaroonCoatField from "@/projects/commerce/pawfit/assets/products/knit-dog-maroon-coat-field.jpg";
import cableKnitPinkMaltese from "@/projects/commerce/pawfit/assets/products/cable-knit-pink-maltese.png";
import meshHarnessCavalierBlue from "@/projects/commerce/pawfit/assets/products/mesh-harness-cavalier-blue.png";
import ginghamBandanaKnitDog from "@/projects/commerce/pawfit/assets/products/gingham-bandana-knit-dog.png";
import vestHarnessDachshundPlaid from "@/projects/commerce/pawfit/assets/products/vest-harness-dachshund-plaid.png";
import policePajamaMaltese from "@/projects/commerce/pawfit/assets/products/police-pajama-maltese.png";
import yellowRaincoatCockapoo from "@/projects/commerce/pawfit/assets/products/yellow-raincoat-cockapoo.png";
import type {
  AdminFeedbackRow,
  AdminInquiry,
  AdminMemberRow,
  AdminProductRow,
  AdminReview,
  AdminSizeRule,
  Address,
  Coupon,
  Order,
  PaymentMethodPF,
  Pet,
  Product,
  SizeFeedback,
  SizeRecommendation,
  SizeRow,
  UserProfile,
} from "@/projects/commerce/pawfit/lib/types";

export const PET_ASSETS = {
  heroDalmatianRun,
  puppyCreamCarpet,
};

export const CURRENT_USER: UserProfile = {
  name: "오하늘",
  email: "haneul.o****@gmail.com",
  joinedAt: "2025-09-02",
  welcomeCouponIssued: true,
};

export const PETS: Pet[] = [
  {
    id: "pet-bori",
    name: "보리",
    species: "dog",
    breed: "비글",
    gender: "수컷",
    birthDate: "2024-03-15",
    weightKg: 6.2,
    backLengthCm: 32,
    chestGirthCm: 45,
    neckCm: 28,
    photo: beagleCouchCollar,
    registeredAt: "2025-09-02",
  },
  {
    id: "pet-mongi",
    name: "몽이",
    species: "dog",
    breed: "말티즈 믹스",
    gender: "암컷",
    birthDate: "2023-07-02",
    weightKg: 4.1,
    backLengthCm: 26,
    chestGirthCm: 38,
    neckCm: 22,
    photo: terrierHarnessGrass,
    registeredAt: "2025-09-14",
  },
  {
    id: "pet-nabi",
    name: "나비",
    species: "cat",
    breed: "코리안숏헤어",
    gender: "암컷",
    birthDate: "2022-11-20",
    weightKg: 3.8,
    backLengthCm: 30,
    chestGirthCm: 34,
    neckCm: 20,
    photo: catTabbyCollarPath,
    registeredAt: "2025-10-01",
  },
];

export const SIZE_RECOMMENDATIONS: Record<string, SizeRecommendation> = {
  "pet-bori": {
    petId: "pet-bori",
    recommendedSize: "M",
    confidence: "매우 적합",
    basis: [
      "가슴둘레 45cm, M 사이즈 권장 범위(43~47cm)의 중앙값",
      "몸무게 6.2kg, 비글 평균 체형 대비 표준 범위",
    ],
    brandSizes: [
      { brand: "PawFit", size: "M" },
      { brand: "A펫웨어", size: "M" },
      { brand: "B프렌즈", size: "L" },
    ],
  },
  "pet-mongi": {
    petId: "pet-mongi",
    recommendedSize: "S",
    confidence: "적합",
    basis: [
      "가슴둘레 38cm, S 사이즈 권장 범위(36~40cm) 안쪽",
      "목둘레 22cm 기준으로도 S 사이즈 하네스 권장",
    ],
    brandSizes: [
      { brand: "PawFit", size: "S" },
      { brand: "A펫웨어", size: "S" },
      { brand: "B프렌즈", size: "S" },
    ],
  },
  "pet-nabi": {
    petId: "pet-nabi",
    recommendedSize: "S",
    confidence: "참고용",
    basis: [
      "가슴둘레 34cm 기준 S 사이즈에 가장 가까움",
      "고양이는 견종 대비 표준 편차가 커 참고용으로 안내",
    ],
    brandSizes: [{ brand: "PawFit", size: "S" }],
  },
};

const STANDARD_SIZE_CHART: SizeRow[] = [
  { size: "XS", chest: 30, neck: 20, length: 20 },
  { size: "S", chest: 38, neck: 24, length: 25 },
  { size: "M", chest: 45, neck: 28, length: 30 },
  { size: "L", chest: 52, neck: 32, length: 35 },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-basic-knit",
    name: "베이직 라운드 니트",
    category: "니트",
    price: 32000,
    brandTint: "pink",
    colorways: [
      { name: "오트밀", hex: "#e8dcc4" },
      { name: "라벤더", hex: "#b8a4ed" },
    ],
    sizes: ["XS", "S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.7,
    reviewCount: 128,
    recommendedFor: ["dog", "cat"],
    description: "매일 입기 좋은 기본 라운드넥 니트. 신축성 있는 골지 조직으로 활동이 편합니다.",
    isPopular: true,
    image: knitDogMaroonCoatField,
  },
  {
    id: "prod-cable-knit",
    name: "포근한 케이블 니트",
    category: "니트",
    price: 38000,
    listPrice: 42000,
    brandTint: "ochre",
    colorways: [
      { name: "머스타드", hex: "#e8b94a" },
      { name: "차콜", hex: "#3a3a3a" },
    ],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.8,
    reviewCount: 96,
    recommendedFor: ["dog"],
    description: "두께감 있는 케이블 조직으로 쌀쌀한 날씨에 보온성을 더한 니트.",
    image: cableKnitPinkMaltese,
  },
  {
    id: "prod-hooded-raincoat",
    name: "방수 후드 레인코트",
    category: "레인코트",
    price: 45000,
    brandTint: "teal",
    colorways: [
      { name: "포레스트", hex: "#1a3a3a" },
      { name: "옐로우", hex: "#f2c14e" },
    ],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.6,
    reviewCount: 74,
    recommendedFor: ["dog"],
    description: "완전 방수 원단과 배수 후드로 장마철 산책에도 문제없는 레인코트.",
    isPopular: true,
    image: yellowRaincoatCockapoo,
  },
  {
    id: "prod-clear-raincoat",
    name: "투명 시티 레인코트",
    category: "레인코트",
    price: 42000,
    brandTint: "lavender",
    colorways: [{ name: "클리어", hex: "#e4e4f5" }],
    sizes: ["XS", "S", "M"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.4,
    reviewCount: 41,
    recommendedFor: ["dog", "cat"],
    description: "투명 PVC 소재로 어떤 옷 위에 덧입어도 색이 겹치지 않는 도심형 레인코트.",
    isNew: true,
    image: ginghamBandanaKnitDog,
  },
  {
    id: "prod-nosework-harness",
    name: "노즈워크 하네스 조끼",
    category: "하네스",
    price: 36000,
    brandTint: "peach",
    colorways: [
      { name: "테라코타", hex: "#ffb084" },
      { name: "네이비", hex: "#2b3a55" },
    ],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.9,
    reviewCount: 203,
    recommendedFor: ["dog"],
    description: "가슴 압박을 줄인 조끼형 설계로 장시간 산책에도 편안한 하네스.",
    isPopular: true,
    image: vestHarnessDachshundPlaid,
  },
  {
    id: "prod-mesh-harness",
    name: "메쉬 에어 하네스",
    category: "하네스",
    price: 29000,
    brandTint: "cream",
    colorways: [
      { name: "민트", hex: "#a4d4c5" },
      { name: "그레이", hex: "#9a9a9a" },
    ],
    sizes: ["XS", "S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    image: meshHarnessCavalierBlue,
    rating: 4.5,
    reviewCount: 58,
    recommendedFor: ["dog", "cat"],
    description: "통기성 좋은 메쉬 원단으로 여름철에도 시원하게 착용하는 하네스.",
  },
  {
    id: "prod-heart-bandana",
    name: "하트 도트 반다나",
    category: "반다나",
    price: 12000,
    brandTint: "pink",
    colorways: [{ name: "핑크", hex: "#ff4d8b" }],
    sizes: ["S", "M"],
    sizeChart: STANDARD_SIZE_CHART.slice(0, 3),
    rating: 4.6,
    reviewCount: 87,
    recommendedFor: ["dog", "cat"],
    description: "가볍게 포인트를 주기 좋은 도트 패턴 반다나. 목둘레 조절 스냅 버튼.",
  },
  {
    id: "prod-check-bandana",
    name: "체크 반다나 세트",
    category: "반다나",
    price: 15000,
    brandTint: "ochre",
    colorways: [
      { name: "레드 체크", hex: "#c14e3a" },
      { name: "그린 체크", hex: "#4e6b4a" },
    ],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.3,
    reviewCount: 32,
    recommendedFor: ["dog"],
    description: "두 장 세트로 구성된 클래식 체크 반다나.",
    isNew: true,
    image: ginghamBandanaKnitDog,
  },
  {
    id: "prod-trekking-boots",
    name: "논슬립 트레킹 부츠",
    category: "부츠",
    price: 28000,
    brandTint: "teal",
    colorways: [{ name: "블랙", hex: "#0a0a0a" }],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.2,
    reviewCount: 45,
    recommendedFor: ["dog"],
    description: "미끄럼 방지 밑창으로 등산이나 아스팔트 산책에 좋은 4개입 부츠 세트.",
  },
  {
    id: "prod-rain-boots",
    name: "방수 레인부츠",
    category: "부츠",
    price: 24000,
    brandTint: "lavender",
    colorways: [
      { name: "옐로우", hex: "#f2c14e" },
      { name: "라벤더", hex: "#b8a4ed" },
    ],
    sizes: ["XS", "S", "M"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.1,
    reviewCount: 27,
    recommendedFor: ["dog", "cat"],
    description: "발바닥까지 완전 방수되는 레인부츠 4개입 세트.",
  },
  {
    id: "prod-fleece-pajama",
    name: "플리스 잠옷",
    category: "잠옷",
    price: 26000,
    brandTint: "peach",
    colorways: [
      { name: "베이지", hex: "#e8dcc4" },
      { name: "그레이", hex: "#9a9a9a" },
    ],
    sizes: ["XS", "S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.8,
    reviewCount: 112,
    recommendedFor: ["dog", "cat"],
    description: "부드러운 플리스 안감으로 겨울철 실내복으로 좋은 전신 잠옷.",
    isPopular: true,
  },
  {
    id: "prod-stripe-pajama",
    name: "스트라이프 파자마",
    category: "잠옷",
    price: 23000,
    brandTint: "cream",
    colorways: [{ name: "네이비 스트라이프", hex: "#2b3a55" }],
    sizes: ["S", "M", "L"],
    sizeChart: STANDARD_SIZE_CHART,
    rating: 4.4,
    reviewCount: 39,
    recommendedFor: ["dog"],
    description: "가벼운 코튼 혼방 소재의 스트라이프 파자마.",
    isNew: true,
    image: policePajamaMaltese,
  },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export const ADDRESSES: Address[] = [
  { id: "addr-home", label: "집", recipient: "오하늘", phone: "010-****-2214", address: "서울시 마포구 성산로 12길 8, 3층", isDefault: true },
  { id: "addr-office", label: "회사", recipient: "오하늘", phone: "010-****-2214", address: "서울시 강남구 테헤란로 421, 7층", isDefault: false },
];

export const PAYMENT_METHODS_PF: PaymentMethodPF[] = [
  { id: "pm-1", brand: "A카드", last4: "5521", isDefault: true },
  { id: "pm-2", brand: "B페이", last4: "0033", isDefault: false },
];

export const COUPONS: Coupon[] = [
  { id: "cp-welcome", label: "웰컴 쿠폰 15% 할인", discount: 0.15, minAmount: 20000, expiresAt: "2026-08-31", used: false },
  { id: "cp-repeat", label: "재구매 감사 쿠폰 5,000원", discount: 5000, minAmount: 30000, expiresAt: "2026-08-15", used: false },
  { id: "cp-review", label: "후기 작성 쿠폰 3,000원", discount: 3000, minAmount: 0, expiresAt: "2026-07-20", used: true },
];

export const ORDERS: Order[] = [
  {
    id: "ord-20260722",
    items: [
      { productId: "prod-nosework-harness", productName: "노즈워크 하네스 조끼", color: "테라코타", size: "M", quantity: 1, price: 36000 },
      { productId: "prod-heart-bandana", productName: "하트 도트 반다나", color: "핑크", size: "S", quantity: 1, price: 12000 },
    ],
    totalAmount: 48000,
    status: "배송완료",
    orderedAt: "2026-07-22",
    addressLabel: "집",
    trackingNo: "CJ-48812093",
  },
  {
    id: "ord-20260710",
    items: [{ productId: "prod-fleece-pajama", productName: "플리스 잠옷", color: "베이지", size: "S", quantity: 2, price: 26000 }],
    totalAmount: 52000,
    status: "배송완료",
    orderedAt: "2026-07-10",
    addressLabel: "집",
    trackingNo: "CJ-48213098",
  },
  {
    id: "ord-20260728",
    items: [{ productId: "prod-hooded-raincoat", productName: "방수 후드 레인코트", color: "포레스트", size: "M", quantity: 1, price: 45000 }],
    totalAmount: 45000,
    status: "배송중",
    orderedAt: "2026-07-28",
    addressLabel: "집",
    trackingNo: "CJ-49010221",
  },
  {
    id: "ord-20260729",
    items: [{ productId: "prod-basic-knit", productName: "베이직 라운드 니트", color: "라벤더", size: "S", quantity: 1, price: 32000 }],
    totalAmount: 32000,
    status: "결제완료",
    orderedAt: "2026-07-29",
    addressLabel: "회사",
  },
];

export const SIZE_FEEDBACKS: SizeFeedback[] = [
  {
    id: "fb-1",
    petName: "구름이",
    productId: "prod-nosework-harness",
    purchasedSize: "M",
    fit: "딱 맞아요",
    rating: 5,
    body: "추천받은 사이즈 그대로 주문했는데 정말 딱 맞았어요. 가슴 압박도 없고 좋아요.",
    photo: catBlackLookup,
    accuracy: "정확해요",
    createdAt: "2026-07-15",
  },
  {
    id: "fb-2",
    petName: "호두",
    productId: "prod-basic-knit",
    purchasedSize: "S",
    fit: "커요",
    rating: 4,
    body: "목둘레는 잘 맞는데 기장이 살짝 길어요. 한 사이즈 아래도 괜찮았을 것 같아요.",
    photo: catTabbyWetPavement,
    accuracy: "약간 달라요",
    createdAt: "2026-07-11",
  },
  {
    id: "fb-3",
    petName: "다호",
    productId: "prod-fleece-pajama",
    purchasedSize: "M",
    fit: "딱 맞아요",
    rating: 5,
    body: "추천 사이즈 신뢰하고 구매했는데 실패 없었어요.",
    photo: kittenSleepingFabric,
    accuracy: "정확해요",
    createdAt: "2026-07-03",
  },
];

/* ---------- 관리자 콘솔 ---------- */

export const ADMIN_SIZE_RULES: AdminSizeRule[] = [
  { id: "rule-1", brand: "PawFit", scope: "소형견 전체", weightRange: "3~6kg", chestRange: "34~40cm", neckRange: "22~26cm", recommendedSize: "S", updatedAt: "2026-06-20" },
  { id: "rule-2", brand: "PawFit", scope: "중형견 전체", weightRange: "6~12kg", chestRange: "40~48cm", neckRange: "26~30cm", recommendedSize: "M", updatedAt: "2026-06-20" },
  { id: "rule-3", brand: "PawFit", scope: "대형견 전체", weightRange: "12~25kg", chestRange: "48~58cm", neckRange: "30~36cm", recommendedSize: "L", updatedAt: "2026-06-20" },
  { id: "rule-4", brand: "PawFit", scope: "고양이 전체", weightRange: "2~5kg", chestRange: "30~36cm", neckRange: "18~22cm", recommendedSize: "S", updatedAt: "2026-06-18" },
  { id: "rule-5", brand: "A펫웨어", scope: "비글, 코커스패니얼", weightRange: "8~14kg", chestRange: "42~48cm", neckRange: "26~30cm", recommendedSize: "M", updatedAt: "2026-05-30" },
  { id: "rule-6", brand: "A펫웨어", scope: "말티즈, 푸들(토이)", weightRange: "2~5kg", chestRange: "32~38cm", neckRange: "20~24cm", recommendedSize: "XS", updatedAt: "2026-05-30" },
  { id: "rule-7", brand: "B프렌즈", scope: "골든리트리버, 래브라도", weightRange: "20~35kg", chestRange: "55~65cm", neckRange: "36~42cm", recommendedSize: "L", updatedAt: "2026-05-12" },
  { id: "rule-8", brand: "B프렌즈", scope: "시바견, 웰시코기", weightRange: "8~13kg", chestRange: "40~46cm", neckRange: "26~30cm", recommendedSize: "M", updatedAt: "2026-05-12" },
  { id: "rule-9", brand: "C도그", scope: "닥스훈트", weightRange: "4~8kg", chestRange: "36~42cm", neckRange: "22~26cm", recommendedSize: "S", updatedAt: "2026-04-28" },
  { id: "rule-10", brand: "C도그", scope: "포메라니안", weightRange: "2~3.5kg", chestRange: "28~34cm", neckRange: "18~22cm", recommendedSize: "XS", updatedAt: "2026-04-28" },
];

export const ADMIN_PRODUCTS: AdminProductRow[] = PRODUCTS.map((p, i) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  stock: [42, 18, 63, 5, 0, 27, 91, 34, 12, 8, 55, 20][i] ?? 30,
  exposed: p.id !== "prod-rain-boots",
  recommendedFor: p.recommendedFor,
  updatedAt: "2026-07-0" + (((i % 9) + 1)),
}));

export const ADMIN_MEMBERS: AdminMemberRow[] = [
  { id: "am-1", name: "오하늘", email: "haneul.o****@gmail.com", petCount: 3, orderCount: 4, totalSpent: 177000, joinedAt: "2025-09-02" },
  { id: "am-2", name: "정소민", email: "somin.j****@naver.com", petCount: 1, orderCount: 7, totalSpent: 312000, joinedAt: "2025-02-14" },
  { id: "am-3", name: "이도경", email: "dokyung****@gmail.com", petCount: 2, orderCount: 2, totalSpent: 68000, joinedAt: "2025-11-30" },
  { id: "am-4", name: "박서아", email: "seoa.p****@naver.com", petCount: 1, orderCount: 12, totalSpent: 498000, joinedAt: "2024-12-08" },
  { id: "am-5", name: "김라온", email: "raon.k****@gmail.com", petCount: 2, orderCount: 1, totalSpent: 26000, joinedAt: "2026-06-19" },
  { id: "am-6", name: "최다인", email: "dain.c****@naver.com", petCount: 1, orderCount: 5, totalSpent: 156000, joinedAt: "2025-05-25" },
  { id: "am-7", name: "한소율", email: "soyul.h****@gmail.com", petCount: 4, orderCount: 9, totalSpent: 402000, joinedAt: "2025-01-11" },
  { id: "am-8", name: "윤태경", email: "taekyung****@naver.com", petCount: 1, orderCount: 3, totalSpent: 91000, joinedAt: "2025-08-07" },
  { id: "am-9", name: "서지안", email: "jian.s****@gmail.com", petCount: 2, orderCount: 6, totalSpent: 214000, joinedAt: "2025-03-22" },
  { id: "am-10", name: "임하람", email: "haram.l****@naver.com", petCount: 1, orderCount: 0, totalSpent: 0, joinedAt: "2026-07-20" },
];

export const ADMIN_FEEDBACK: AdminFeedbackRow[] = [
  { id: "af-1", member: "오하늘", petName: "구름이", product: "노즈워크 하네스 조끼", fit: "딱 맞아요", accuracy: "정확해요", rating: 5, createdAt: "2026-07-15" },
  { id: "af-2", member: "정소민", petName: "호두", product: "베이직 라운드 니트", fit: "커요", accuracy: "약간 달라요", rating: 4, createdAt: "2026-07-11" },
  { id: "af-3", member: "박서아", petName: "다호", product: "플리스 잠옷", fit: "딱 맞아요", accuracy: "정확해요", rating: 5, createdAt: "2026-07-03" },
  { id: "af-4", member: "한소율", petName: "밤이", product: "방수 후드 레인코트", fit: "작아요", accuracy: "부정확해요", rating: 2, createdAt: "2026-06-27" },
  { id: "af-5", member: "최다인", petName: "두부", product: "메쉬 에어 하네스", fit: "딱 맞아요", accuracy: "정확해요", rating: 5, createdAt: "2026-06-20" },
  { id: "af-6", member: "서지안", petName: "콩이", product: "체크 반다나 세트", fit: "딱 맞아요", accuracy: "정확해요", rating: 4, createdAt: "2026-06-14" },
  { id: "af-7", member: "윤태경", petName: "감자", product: "투명 시티 레인코트", fit: "커요", accuracy: "약간 달라요", rating: 3, createdAt: "2026-06-02" },
  { id: "af-8", member: "이도경", petName: "복실이", product: "논슬립 트레킹 부츠", fit: "작아요", accuracy: "부정확해요", rating: 2, createdAt: "2026-05-28" },
];

export const ADMIN_INQUIRIES: AdminInquiry[] = [
  { id: "aiq-1", member: "한소율", subject: "레인코트 사이즈가 안 맞아서 교환하고 싶어요", category: "사이즈", status: "대기", createdAt: "2026-07-29" },
  { id: "aiq-2", member: "윤태경", subject: "배송이 3일째 그대로예요", category: "배송", status: "대기", createdAt: "2026-07-29" },
  { id: "aiq-3", member: "임하람", subject: "웰컴 쿠폰이 적용이 안 돼요", category: "결제", status: "답변완료", createdAt: "2026-07-27" },
  { id: "aiq-4", member: "김라온", subject: "니트 보풀이 너무 심하게 일어나요", category: "상품", status: "답변완료", createdAt: "2026-07-20" },
  { id: "aiq-5", member: "이도경", subject: "부츠 사이즈 재입고 문의", category: "상품", status: "종료", createdAt: "2026-07-05" },
  { id: "aiq-6", member: "정소민", subject: "환불 처리 기간이 궁금해요", category: "결제", status: "종료", createdAt: "2026-06-30" },
];

export const ADMIN_REVIEWS: AdminReview[] = [
  { id: "ar-1", member: "박서아", product: "노즈워크 하네스 조끼", rating: 5, body: "산책할 때 당김이 훨씬 덜해요, 강력 추천합니다.", createdAt: "2026-07-16", exposed: true },
  { id: "ar-2", member: "한소율", product: "방수 후드 레인코트", rating: 2, body: "생각보다 방수가 잘 안 되는 것 같아요.", createdAt: "2026-06-28", exposed: true },
  { id: "ar-3", member: "최다인", product: "플리스 잠옷", rating: 5, body: "겨울 내내 매일 입혔어요, 세탁해도 보풀 없어요.", createdAt: "2026-06-21", exposed: true },
  { id: "ar-4", member: "서지안", product: "체크 반다나 세트", rating: 4, body: "가격 대비 만족스러운 구성이에요.", createdAt: "2026-06-15", exposed: false },
];

export const DASHBOARD_STATS_PF = {
  totalMembers: 3184,
  totalPets: 4021,
  todayOrders: 62,
  todayRevenue: 2140000,
  monthRevenue: 41800000,
  popularProduct: "노즈워크 하네스 조끼",
  recommendationUsageRate: 78.4,
  recommendationSuccessRate: 91.2,
  feedbackCount: 842,
  pendingInquiries: 2,
};

export const CATEGORY_SIZE_TREND: { label: string; value: number; caption: string }[] = [
  { label: "니트", value: 412, caption: "412건" },
  { label: "하네스", value: 388, caption: "388건" },
  { label: "레인코트", value: 201, caption: "201건" },
  { label: "반다나", value: 156, caption: "156건" },
  { label: "부츠", value: 98, caption: "98건" },
  { label: "잠옷", value: 244, caption: "244건" },
];

export const RECOMMEND_ACCURACY_SHARE: { label: string; share: number; note: string }[] = [
  { label: "정확해요", share: 68, note: "572건" },
  { label: "약간 달라요", share: 24, note: "202건" },
  { label: "부정확해요", share: 8, note: "68건" },
];

export function formatWon(amount: number): string {
  return amount.toLocaleString("ko-KR");
}
