import type {
  Address,
  ColorOption,
  Coupon,
  FaqItem,
  Notice,
  Order,
  Product,
  Review,
  SizeRecommendationInput,
  SizeRecommendationResult,
  UserProfile,
} from "@/projects/commerce/verve/lib/types";

import teeCharcoalFront from "@/projects/commerce/verve/assets/tee-charcoal-front.png";
import teeCharcoalSide from "@/projects/commerce/verve/assets/tee-charcoal-side.png";
import teeCharcoalBack from "@/projects/commerce/verve/assets/tee-charcoal-back.png";
import teeCharcoalFitted from "@/projects/commerce/verve/assets/tee-charcoal-fitted.png";
import teeGrayFolded from "@/projects/commerce/verve/assets/tee-gray-folded.png";
import jacketBlackHooded from "@/projects/commerce/verve/assets/jacket-black-hooded.png";
import hoodieCharcoalZip from "@/projects/commerce/verve/assets/hoodie-charcoal-zip.png";
import leggingsCharcoalFolded from "@/projects/commerce/verve/assets/leggings-charcoal-folded.png";
import leggingsBlackPocket from "@/projects/commerce/verve/assets/leggings-black-pocket.png";
import capBlackFront from "@/projects/commerce/verve/assets/cap-black-front.png";

/**
 * 상품 사진 매핑.
 *
 * 1차로는 Lorem Picsum의 라이프스타일/무드 사진을 상품 이미지에 썼는데,
 * "운동복 쇼핑몰인데 진짜 운동복 사진이 없다"는 피드백을 받고 전부 교체했다.
 * 대표님이 직접 촬영/제작한 실제 제품 사진을 assets/에 올려주셔서 그걸
 * 1순위로 쓴다 — 특히 tee-charcoal-front/side/back 3장은 같은 티셔츠를
 * 정면/측면/후면에서 찍은 진짜 세트라, 상품 상세의 360° 뷰어를 프레임을
 * 섞지 않고 진짜로 회전하는 것처럼 구현할 수 있는 유일한 상품이다.
 *
 * 업로드받지 못한 5개 카테고리(스포츠 브라, 러닝 숏츠, 스웨트팬츠, 삭스,
 * 크로스백)만 Unsplash에서 직접 검색해 하나씩 개별 다운로드 후 확인한
 * 사진으로 채웠다 — 노출된 타 브랜드 로고(Under Armour, Columbia, Adidas,
 * New Balance 등)나 부적절한 문구가 박힌 사진은 전부 제외했다.
 *
 * id 1628970976696-19370989142b — 네이비 스포츠 브라 + 오렌지 하이웨이스트 숏츠, 스튜디오
 * id 1719473442915-016f3ebda79a — 조거 팬츠 3벌(그레이/차콜/화이트) 플랫레이
 * id 1620786514684-ff35b5aae55e — 블랙 크로스백, 스튜디오 화이트 배경
 * id 1771344248009-92516f759b9a — 컬러 크루삭스 3켤레(옐로/틸/레드), 스튜디오
 */
function unsplash(id: string, w: number, premium = false) {
  const host = premium ? "https://plus.unsplash.com/premium_photo" : "https://images.unsplash.com/photo";
  return `${host}-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

const PHOTO = {
  teeCharcoalFront: teeCharcoalFront.src,
  teeCharcoalSide: teeCharcoalSide.src,
  teeCharcoalBack: teeCharcoalBack.src,
  teeCharcoalFitted: teeCharcoalFitted.src,
  teeGrayFolded: teeGrayFolded.src,
  jacketBlackHooded: jacketBlackHooded.src,
  hoodieCharcoalZip: hoodieCharcoalZip.src,
  leggingsCharcoalFolded: leggingsCharcoalFolded.src,
  leggingsBlackPocket: leggingsBlackPocket.src,
  capBlackFront: capBlackFront.src,
  sportsbraShorts: unsplash("1628970976696-19370989142b", 1200),
  joggersThree: unsplash("1719473442915-016f3ebda79a", 1200),
  crossbagStudio: unsplash("1620786514684-ff35b5aae55e", 1200),
  socksStudio: unsplash("1771344248009-92516f759b9a", 1200, true),
};

function colors(base: ColorOption[]): ColorOption[] {
  return base;
}

/* ---------- 상품 16종 ---------- */

export const products: Product[] = [
  {
    id: "p-run-01",
    name: "에어리 메시 런닝 티",
    category: "러닝",
    workoutTypes: ["러닝"],
    price: 58000,
    colors: colors([
      { name: "차콜", hex: "#303030", image: PHOTO.teeCharcoalFront },
      { name: "그레이", hex: "#8f8f8f", image: PHOTO.teeGrayFolded },
    ]),
    gallery: [PHOTO.teeCharcoalFront, PHOTO.teeCharcoalFitted, PHOTO.teeGrayFolded],
    // 실사 3장(정면/측면/후면)이 확보된 유일한 상품 — 진짜 360 회전 뷰어를 쓴다.
    spin360: [PHOTO.teeCharcoalFront, PHOTO.teeCharcoalSide, PHOTO.teeCharcoalBack],
    isBest: true,
    rank: 1,
    rating: 4.8,
    reviewCount: 312,
    sizes: [
      { size: "XS", stock: 4 },
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 3 },
    ],
    material: "폴리에스터 92%, 스판덱스 8% (쿨링 메시)",
    care: ["찬물 단독 세탁", "표백제 사용 금지", "낮은 온도 다림질"],
    description:
      "겨드랑이와 등판에 쿨링 메시를 덧대 러닝 중 체온 상승을 빠르게 배출하는 티셔츠. 이염 방지 처리된 원단으로 장거리 러닝에서도 컬러가 오래간다.",
    fitNote: "레귤러 핏, 평소 사이즈 그대로 추천",
  },
  {
    id: "p-run-02",
    name: "컴프레션 하프타이츠",
    category: "러닝",
    workoutTypes: ["러닝", "웨이트"],
    price: 68000,
    colors: colors([{ name: "차콜", hex: "#303030", image: PHOTO.leggingsCharcoalFolded }]),
    gallery: [PHOTO.leggingsCharcoalFolded],
    spin360: [PHOTO.leggingsCharcoalFolded],
    isNew: true,
    rating: 4.6,
    reviewCount: 178,
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 10 },
      { size: "M", stock: 14 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 0 },
    ],
    material: "나일론 78%, 스판덱스 22%",
    care: ["찬물 세탁망 사용", "건조기 사용 금지", "표백제 사용 금지"],
    description: "허벅지 근막을 지지하는 2단 압박 밴드로 장거리 러닝의 근피로를 줄여주는 하프타이츠.",
    fitNote: "슬림 핏, 여유있게 입으려면 한 치수 업 추천",
  },
  {
    id: "p-run-03",
    name: "라이트웨이트 러닝 숏츠",
    category: "러닝",
    workoutTypes: ["러닝"],
    price: 48000,
    originalPrice: 62000,
    colors: colors([{ name: "오렌지", hex: "#c9542c", image: PHOTO.sportsbraShorts }]),
    gallery: [PHOTO.sportsbraShorts],
    spin360: [PHOTO.sportsbraShorts],
    rating: 4.5,
    reviewCount: 96,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 15 },
      { size: "L", stock: 11 },
      { size: "XL", stock: 4 },
    ],
    material: "폴리에스터 100% (4-way 스트레치)",
    care: ["찬물 세탁", "그늘에서 건조"],
    description: "내장 이너 팬츠와 사이드 슬릿으로 보폭 제한 없이 움직이는 5인치 러닝 숏츠.",
    fitNote: "레귤러 핏",
  },
  {
    id: "p-run-04",
    name: "리플렉티브 러닝 자켓",
    category: "러닝",
    workoutTypes: ["러닝"],
    price: 128000,
    colors: colors([{ name: "블랙", hex: "#181818", image: PHOTO.jacketBlackHooded }]),
    gallery: [PHOTO.jacketBlackHooded],
    spin360: [PHOTO.jacketBlackHooded],
    isNew: true,
    rating: 4.7,
    reviewCount: 64,
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 2 },
    ],
    material: "나일론 리플렉티브 코팅 원단",
    care: ["찬물 세탁", "표백제 사용 금지", "건조기 사용 금지"],
    description: "야간 러닝 시 헤드라이트에 반사되는 프린트를 전면에 배치한 초경량 윈드 자켓.",
    fitNote: "레귤러 핏, 이너 레이어링 고려 시 한 치수 업",
  },
  {
    id: "p-run-05",
    name: "브리더블 러닝 캡",
    category: "러닝",
    workoutTypes: ["러닝"],
    price: 32000,
    colors: colors([{ name: "블랙", hex: "#181818", image: PHOTO.capBlackFront }]),
    gallery: [PHOTO.capBlackFront],
    spin360: [PHOTO.capBlackFront],
    rating: 4.4,
    reviewCount: 41,
    sizes: [{ size: "M", stock: 20 }],
    material: "폴리에스터 100%",
    care: ["손세탁 권장"],
    description: "땀 배출 통풍구와 반사 로고를 적용한 러닝 전용 캡. 원사이즈, 뒷단 조절 스트랩.",
    fitNote: "원사이즈 (54-60cm 조절)",
  },
  {
    id: "p-train-01",
    name: "드라이핏 트레이닝 탱크",
    category: "트레이닝",
    workoutTypes: ["웨이트"],
    price: 42000,
    colors: colors([{ name: "그레이", hex: "#8f8f8f", image: PHOTO.teeGrayFolded }]),
    gallery: [PHOTO.teeGrayFolded],
    spin360: [PHOTO.teeGrayFolded],
    isBest: true,
    rank: 2,
    rating: 4.6,
    reviewCount: 203,
    sizes: [
      { size: "S", stock: 9 },
      { size: "M", stock: 16 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 5 },
    ],
    material: "폴리에스터 88%, 스판덱스 12%",
    care: ["찬물 세탁", "낮은 온도 다림질"],
    description: "웨이트 트레이닝 중 가동범위를 제한하지 않는 드롭 암홀 탱크탑.",
    fitNote: "레귤러 핏",
  },
  {
    id: "p-train-02",
    name: "헤비웨이트 스웨트 팬츠",
    category: "트레이닝",
    workoutTypes: ["웨이트", "일상 착용"],
    price: 78000,
    colors: colors([{ name: "차콜", hex: "#303030", image: PHOTO.joggersThree }]),
    gallery: [PHOTO.joggersThree],
    spin360: [PHOTO.joggersThree],
    rating: 4.7,
    reviewCount: 289,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 13 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 6 },
    ],
    material: "면 80%, 폴리에스터 20% (10oz 헤비웨이트)",
    care: ["찬물 세탁", "뒤집어서 건조"],
    description: "무게감 있는 10oz 원단에 테이퍼드 핏을 적용해 운동 후 일상 착용까지 이어지는 스웨트 팬츠.",
    fitNote: "테이퍼드 핏, 오버사이즈로 입으려면 한 치수 업",
  },
  {
    id: "p-train-03",
    name: "컴프레션 숏 슬리브",
    category: "트레이닝",
    workoutTypes: ["웨이트", "러닝"],
    price: 44000,
    colors: colors([{ name: "차콜", hex: "#303030", image: PHOTO.teeCharcoalFitted }]),
    gallery: [PHOTO.teeCharcoalFitted],
    spin360: [PHOTO.teeCharcoalFitted],
    isNew: true,
    rating: 4.5,
    reviewCount: 77,
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 14 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 1 },
    ],
    material: "나일론 80%, 스판덱스 20%",
    care: ["찬물 세탁망 사용", "표백제 사용 금지"],
    description: "근육 진동을 잡아주는 2웨이 압박 원단의 베이스레이어 반팔.",
    fitNote: "슬림 핏",
  },
  {
    id: "p-train-04",
    name: "트레이닝 반집업 후드",
    category: "트레이닝",
    workoutTypes: ["웨이트", "일상 착용"],
    price: 92000,
    colors: colors([{ name: "차콜", hex: "#303030", image: PHOTO.hoodieCharcoalZip }]),
    gallery: [PHOTO.hoodieCharcoalZip],
    spin360: [PHOTO.hoodieCharcoalZip],
    rating: 4.6,
    reviewCount: 152,
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 11 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 3 },
    ],
    material: "면 72%, 폴리에스터 28%",
    care: ["찬물 세탁", "뒤집어서 건조"],
    description: "쿼터 집업으로 체온 조절이 쉬운 헤비 브러시드 후드. 운동 전후 워밍업용으로 적합.",
    fitNote: "오버사이즈 핏, 슬림하게 입으려면 한 치수 다운",
  },
  {
    id: "p-yoga-01",
    name: "하이웨이스트 요가 레깅스",
    category: "요가",
    workoutTypes: ["요가/필라테스"],
    price: 72000,
    colors: colors([{ name: "블랙", hex: "#181818", image: PHOTO.leggingsBlackPocket }]),
    gallery: [PHOTO.leggingsBlackPocket],
    spin360: [PHOTO.leggingsBlackPocket],
    isBest: true,
    rank: 3,
    rating: 4.9,
    reviewCount: 421,
    sizes: [
      { size: "XS", stock: 6 },
      { size: "S", stock: 15 },
      { size: "M", stock: 19 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 2 },
    ],
    material: "나일론 75%, 스판덱스 25%",
    care: ["찬물 세탁망 사용", "건조기 사용 금지"],
    description: "스쿼트 동작에서도 비침 없는 4단 압축 원단과 포켓형 웨이스트 밴드를 적용한 요가 레깅스.",
    fitNote: "하이웨이스트 슬림 핏, 허리 압박이 싫다면 한 치수 업",
  },
  {
    id: "p-yoga-02",
    name: "크롭 스포츠 브라",
    category: "요가",
    workoutTypes: ["요가/필라테스", "러닝"],
    price: 46000,
    colors: colors([{ name: "네이비", hex: "#22303f", image: PHOTO.sportsbraShorts }]),
    gallery: [PHOTO.sportsbraShorts],
    spin360: [PHOTO.sportsbraShorts],
    rating: 4.7,
    reviewCount: 198,
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 12 },
      { size: "M", stock: 14 },
      { size: "L", stock: 6 },
    ],
    material: "폴리아마이드 68%, 스판덱스 32%",
    care: ["찬물 손세탁 권장"],
    description: "중강도 서포트 패드를 내장한 크롭 브라. 요가부터 필라테스까지 안정적인 서포트를 제공.",
    fitNote: "레귤러 핏",
  },
  {
    id: "p-yoga-03",
    name: "소프트 라운지 조거",
    category: "요가",
    workoutTypes: ["요가/필라테스", "일상 착용"],
    price: 68000,
    colors: colors([{ name: "화이트", hex: "#ebebeb", image: PHOTO.joggersThree }]),
    gallery: [PHOTO.joggersThree],
    spin360: [PHOTO.joggersThree],
    isNew: true,
    rating: 4.5,
    reviewCount: 87,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 4 },
    ],
    material: "모달 60%, 폴리에스터 35%, 스판덱스 5%",
    care: ["찬물 세탁", "낮은 온도 건조"],
    description: "피부에 닿는 촉감을 우선한 모달 혼방 원단의 세미 와이드 조거 팬츠.",
    fitNote: "세미 와이드 핏",
  },
  {
    id: "p-outer-01",
    name: "인슐레이션 러닝 재킷",
    category: "아우터",
    workoutTypes: ["러닝", "일상 착용"],
    price: 168000,
    colors: colors([{ name: "차콜", hex: "#303030", image: PHOTO.hoodieCharcoalZip }]),
    gallery: [PHOTO.hoodieCharcoalZip],
    spin360: [PHOTO.hoodieCharcoalZip],
    rating: 4.8,
    reviewCount: 133,
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 9 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 2 },
    ],
    material: "나일론 리사이클 셸 + 충전재 보온소재",
    care: ["드라이클리닝 권장"],
    description: "영하권 새벽 러닝을 위한 경량 충전 재킷. 팔 안쪽 통기 지퍼로 체온을 조절한다.",
    fitNote: "레귤러 핏, 이너 레이어링 고려 시 한 치수 업",
  },
  {
    id: "p-outer-02",
    name: "후드 집업 트랙 재킷",
    category: "아우터",
    workoutTypes: ["일상 착용", "웨이트"],
    price: 118000,
    colors: colors([{ name: "블랙", hex: "#181818", image: PHOTO.jacketBlackHooded }]),
    gallery: [PHOTO.jacketBlackHooded],
    spin360: [PHOTO.jacketBlackHooded],
    isNew: true,
    rating: 4.6,
    reviewCount: 108,
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 10 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 3 },
    ],
    material: "폴리에스터 브러시드 트리코트",
    care: ["찬물 세탁", "뒤집어서 건조"],
    description: "풀 지퍼 후드 트랙 재킷. 러닝 워밍업부터 일상까지 걸치기 좋은 미들 웨이트.",
    fitNote: "레귤러 핏",
  },
  {
    id: "p-acc-01",
    name: "퍼포먼스 크루 삭스",
    category: "액세서리",
    workoutTypes: ["러닝", "웨이트"],
    price: 18000,
    colors: colors([{ name: "멀티", hex: "#da291c", image: PHOTO.socksStudio }]),
    gallery: [PHOTO.socksStudio],
    spin360: [PHOTO.socksStudio],
    rating: 4.6,
    reviewCount: 214,
    sizes: [{ size: "M", stock: 40 }],
    material: "면 65%, 나일론 30%, 스판덱스 5%",
    care: ["찬물 세탁"],
    description: "아치 서포트 밴드와 마찰 방지 니팅 구조로 장거리 러닝에도 편안한 크루 삭스 3족 세트.",
    fitNote: "원사이즈 (230-270mm)",
  },
  {
    id: "p-acc-02",
    name: "스포츠 크로스백",
    category: "액세서리",
    workoutTypes: ["러닝", "요가/필라테스"],
    price: 54000,
    colors: colors([{ name: "블랙", hex: "#181818", image: PHOTO.crossbagStudio }]),
    gallery: [PHOTO.crossbagStudio],
    spin360: [PHOTO.crossbagStudio],
    rating: 4.5,
    reviewCount: 59,
    sizes: [{ size: "M", stock: 22 }],
    material: "리사이클 나일론 립스톱",
    care: ["젖은 천으로 표면 닦기"],
    description: "휴대폰과 카드, 젤 하나가 들어가는 경량 러닝 크로스백. 반사 스트랩 적용.",
    fitNote: "원사이즈, 스트랩 조절 가능",
  },
];

export const bestSellers = products.filter((p) => p.isBest).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
export const newArrivals = products.filter((p) => p.isNew);
export const mostReviewed = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);

export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function findProduct(id: string) {
  return products.find((p) => p.id === id);
}

/* ---------- AI 사이즈 추천 (규칙 기반 mock) ---------- */

export function recommendSize(input: SizeRecommendationInput): SizeRecommendationResult {
  const bmi = input.weightKg / ((input.heightCm / 100) * (input.heightCm / 100));
  let base: number;
  if (bmi < 19) base = 0;
  else if (bmi < 22) base = 1;
  else if (bmi < 25) base = 2;
  else if (bmi < 28) base = 3;
  else base = 4;

  if (input.preferredFit === "오버사이즈") base += 1;
  if (input.preferredFit === "슬림") base -= 1;
  if (input.gender === "여성") base -= 1;

  const labels: SizeRecommendationResult["recommendedSize"][] = ["XS", "S", "M", "L", "XL"];
  const clamped = Math.min(labels.length - 1, Math.max(0, base));
  const recommendedSize = labels[clamped];

  const reasons = [
    `키 ${input.heightCm}cm, 몸무게 ${input.weightKg}kg 기준 체형 데이터와 유사한 구매자의 82%가 ${recommendedSize} 사이즈를 선택했어요.`,
    `선호 핏을 "${input.preferredFit}"으로 선택해 표준 추천보다 ${
      input.preferredFit === "오버사이즈" ? "한 단계 넉넉하게" : input.preferredFit === "슬림" ? "한 단계 슬림하게" : "표준으로"
    } 조정했어요.`,
    `${input.workoutPurpose} 운동 시 필요한 가동 범위를 고려해 어깨/허리 여유분을 반영했어요.`,
  ];

  const expectedFit =
    input.preferredFit === "오버사이즈"
      ? "어깨선이 약간 내려오고 소매와 밑단에 여유가 있는 릴렉스 핏"
      : input.preferredFit === "슬림"
        ? "몸에 밀착되어 라인이 드러나는 슬림 핏"
        : "몸의 움직임을 방해하지 않는 표준 핏";

  return {
    recommendedSize,
    confidence: Math.round((0.74 + Math.random() * 0.16) * 100) / 100,
    reasons,
    expectedFit,
    modelComparison: {
      modelHeightCm: input.gender === "여성" ? 168 : 181,
      modelWeightKg: input.gender === "여성" ? 54 : 72,
      modelWearingSize: input.gender === "여성" ? "S" : "M",
    },
  };
}

/* ---------- 리뷰 ---------- */

export const reviews: Review[] = [
  {
    id: "rv-01",
    productId: "p-yoga-01",
    author: "j_yerim",
    verified: true,
    rating: 5,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 96,
    purchasedSize: "S",
    heightCm: 163,
    weightKg: 52,
    disclosed: true,
    body: "AI 추천 사이즈 그대로 S 주문했는데 스쿼트할 때도 비침 없고 허리 밴드가 안 말려요. 다음엔 컬러만 바꿔서 재구매할 예정.",
    photo: PHOTO.leggingsBlackPocket,
    date: "2026.07.18",
    helpfulCount: 41,
  },
  {
    id: "rv-02",
    productId: "p-yoga-01",
    author: "run_hyunwoo",
    verified: true,
    rating: 4,
    fitSatisfaction: "작아요",
    sizeSatisfaction: 71,
    purchasedSize: "M",
    heightCm: 178,
    weightKg: 74,
    disclosed: true,
    body: "허벅지가 두꺼운 편이라 M도 살짝 타이트합니다. 다음엔 L로 한 치수 업 예정. 신축성 자체는 만족스러워요.",
    date: "2026.07.02",
    helpfulCount: 18,
  },
  {
    id: "rv-03",
    productId: "p-run-01",
    author: "morning_5k",
    verified: true,
    rating: 5,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 91,
    purchasedSize: "M",
    heightCm: 175,
    weightKg: 68,
    disclosed: true,
    body: "여름 새벽 러닝 5년째인데 이 정도로 안 달라붙는 메시는 처음. 사이즈 추천 결과랑 실측이 거의 일치했습니다.",
    photo: PHOTO.teeCharcoalFront,
    date: "2026.06.29",
    helpfulCount: 63,
  },
  {
    id: "rv-04",
    productId: "p-run-01",
    author: "coldbrew_no1",
    verified: true,
    rating: 4,
    fitSatisfaction: "커요",
    sizeSatisfaction: 68,
    purchasedSize: "L",
    heightCm: 170,
    weightKg: 62,
    disclosed: true,
    body: "AI 추천은 M이었는데 오버사이즈 핏을 원해서 L로 구매. 예상대로 넉넉하게 잘 나왔어요.",
    date: "2026.06.11",
    helpfulCount: 9,
  },
  {
    id: "rv-05",
    productId: "p-train-02",
    author: "gym_daily",
    verified: true,
    rating: 5,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 88,
    purchasedSize: "L",
    disclosed: false,
    body: "10oz 원단감 진짜 묵직하고 좋습니다. 세탁 두 번 했는데 밑단 늘어짐도 없어요.",
    date: "2026.05.30",
    helpfulCount: 27,
  },
  {
    id: "rv-06",
    productId: "p-train-02",
    author: "seol_j",
    verified: true,
    rating: 5,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 94,
    purchasedSize: "M",
    heightCm: 165,
    weightKg: 58,
    disclosed: true,
    body: "테이퍼드 핏이라 발목 쪽 안 질질 끌려서 좋아요. 운동 끝나고 그대로 카페 가도 될 정도.",
    photo: PHOTO.joggersThree,
    date: "2026.05.14",
    helpfulCount: 35,
  },
  {
    id: "rv-07",
    productId: "p-outer-01",
    author: "winter_runner",
    verified: true,
    rating: 5,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 90,
    purchasedSize: "M",
    heightCm: 180,
    weightKg: 76,
    disclosed: true,
    body: "영하 8도 새벽 러닝에서도 안쪽은 후끈해요. 통기 지퍼 덕분에 5km 넘어가면서 열 조절도 잘 됩니다.",
    date: "2026.01.09",
    helpfulCount: 52,
  },
  {
    id: "rv-08",
    productId: "p-acc-01",
    author: "socks_collector",
    verified: false,
    rating: 4,
    fitSatisfaction: "딱맞아요",
    sizeSatisfaction: 82,
    purchasedSize: "M",
    disclosed: false,
    body: "아치 서포트가 확실히 느껴져서 하프 마라톤 때 신었는데 발바닥 피로도가 덜했어요.",
    date: "2026.04.22",
    helpfulCount: 14,
  },
];

export function reviewsFor(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

/* ---------- 장바구니 기본값 ---------- */

export const initialCart = [
  {
    cartId: "c-1",
    productId: "p-yoga-01",
    name: "하이웨이스트 요가 레깅스",
    image: PHOTO.leggingsBlackPocket,
    color: "블랙",
    size: "S" as const,
    price: 72000,
    quantity: 1,
  },
  {
    cartId: "c-2",
    productId: "p-run-01",
    name: "에어리 메시 런닝 티",
    image: PHOTO.teeCharcoalFront,
    color: "차콜",
    size: "M" as const,
    price: 58000,
    quantity: 2,
  },
];

/* ---------- 주문 ---------- */

export const orders: Order[] = [
  {
    id: "VV20260728-0311",
    date: "2026.07.28",
    status: "배송중",
    items: [
      {
        productId: "p-yoga-01",
        name: "하이웨이스트 요가 레깅스",
        image: PHOTO.leggingsBlackPocket,
        color: "블랙",
        size: "S",
        price: 72000,
        quantity: 1,
      },
      {
        productId: "p-yoga-02",
        name: "크롭 스포츠 브라",
        image: PHOTO.sportsbraShorts,
        color: "네이비",
        size: "S",
        price: 46000,
        quantity: 1,
      },
    ],
    total: 118000,
    estimatedDelivery: "2026.07.30 도착 예정",
    recipient: "김지은",
    address: "서울시 마포구 성지길 12, 3층",
  },
  {
    id: "VV20260714-0198",
    date: "2026.07.14",
    status: "배송완료",
    items: [
      {
        productId: "p-run-01",
        name: "에어리 메시 런닝 티",
        image: PHOTO.teeCharcoalFront,
        color: "차콜",
        size: "M",
        price: 58000,
        quantity: 2,
      },
    ],
    total: 116000,
    estimatedDelivery: "2026.07.16 도착",
    recipient: "김지은",
    address: "서울시 마포구 성지길 12, 3층",
  },
  {
    id: "VV20260622-0067",
    date: "2026.06.22",
    status: "배송완료",
    items: [
      {
        productId: "p-outer-01",
        name: "인슐레이션 러닝 재킷",
        image: PHOTO.hoodieCharcoalZip,
        color: "차콜",
        size: "M",
        price: 168000,
        quantity: 1,
      },
    ],
    total: 168000,
    estimatedDelivery: "2026.06.24 도착",
    recipient: "김지은",
    address: "서울시 마포구 성지길 12, 3층",
  },
];

export const addresses: Address[] = [
  {
    id: "addr-1",
    label: "집",
    isDefault: true,
    recipient: "김지은",
    phone: "010-4821-7793",
    address: "서울시 마포구 성지길 12, 3층",
  },
  {
    id: "addr-2",
    label: "회사",
    isDefault: false,
    recipient: "김지은",
    phone: "010-4821-7793",
    address: "서울시 강남구 테헤란로 231, 8층",
  },
];

export const coupons: Coupon[] = [
  { id: "cp-1", title: "가입 축하 15% 할인", discount: "15%", minAmount: 30000, expiresAt: "2026.08.31" },
  { id: "cp-2", title: "요가 카테고리 5천원 할인", discount: "5,000원", minAmount: 50000, expiresAt: "2026.08.15" },
  { id: "cp-3", title: "적립금 2배 쿠폰", discount: "적립 2배", minAmount: 0, expiresAt: "2026.09.01" },
];

/* ---------- 사용자 ---------- */

export const currentUser: UserProfile = {
  name: "김지은",
  email: "jieun.kim@vervewear.kr",
  phone: "010-4821-7793",
  gender: "여성",
  heightCm: 163,
  weightKg: 52,
  preferredFit: "레귤러",
  tier: "GOLD",
  points: 18400,
  memberSince: "2025.02",
};

/* ---------- 고객센터 ---------- */

export const faqs: FaqItem[] = [
  {
    id: "faq-1",
    category: "사이즈/AI 추천",
    question: "AI 사이즈 추천은 어떤 기준으로 계산되나요?",
    answer:
      "입력한 키, 몸무게, 성별, 운동 목적, 선호 핏을 기반으로 유사 체형 구매자의 사이즈 선택 데이터를 참고해 추천합니다. 실제 신체 치수를 정확히 측정하는 것은 아니며, 참고용 추천으로 제공됩니다.",
  },
  {
    id: "faq-2",
    category: "사이즈/AI 추천",
    question: "추천받은 사이즈가 안 맞으면 어떻게 하나요?",
    answer: "상품 수령 후 7일 이내 미착용 상태라면 사이즈 교환이 무료입니다. 마이페이지 > 취소/반품에서 신청할 수 있습니다.",
  },
  {
    id: "faq-3",
    category: "배송",
    question: "배송은 얼마나 걸리나요?",
    answer: "결제 완료 후 평균 1~2일 내 출고되며, 출고 후 1~2일 내 도착합니다. 도서산간 지역은 1~2일 추가될 수 있습니다.",
  },
  {
    id: "faq-4",
    category: "교환/반품",
    question: "세탁 후에도 교환/반품이 가능한가요?",
    answer: "세탁한 상품은 원칙적으로 교환/반품이 불가합니다. 사이즈 확인은 세탁 전 착용 후 신청해주세요.",
  },
  {
    id: "faq-5",
    category: "주문/결제",
    question: "주문 취소는 언제까지 가능한가요?",
    answer: "상품 준비중 단계까지는 마이페이지에서 즉시 취소할 수 있습니다. 배송이 시작되면 반품 절차로 진행됩니다.",
  },
  {
    id: "faq-6",
    category: "회원/포인트",
    question: "적립금은 언제 사용할 수 있나요?",
    answer: "구매 확정 후 3일 뒤 적립되며, 5,000원 이상부터 결제 시 사용 가능합니다.",
  },
];

export const notices: Notice[] = [
  { id: "nt-1", title: "여름 시즌 반품 정책 임시 안내", date: "2026.07.20", pinned: true },
  { id: "nt-2", title: "AI 사이즈 추천 정확도 개선 업데이트", date: "2026.07.05" },
  { id: "nt-3", title: "8월 정기 서버 점검 안내", date: "2026.06.28" },
];
