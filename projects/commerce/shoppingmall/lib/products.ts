export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  color: string;
  image: string;
  isNew?: boolean;
  rank?: number;
  rating: number;
  reviewCount: number;
};

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const products: Product[] = [
  {
    id: "p-01",
    name: "울 캐시미어 싱글 코트",
    category: "아우터",
    price: 398000,
    color: "카멜",
    image: picsum("vestire-wool-cashmere-coat", 640, 800),
    rank: 1,
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "p-02",
    name: "리브 하프넥 니트",
    category: "니트웨어",
    price: 89000,
    originalPrice: 128000,
    color: "오트밀",
    image: picsum("vestire-rib-half-neck-knit", 640, 800),
    rank: 2,
    isNew: true,
    rating: 4.7,
    reviewCount: 501,
  },
  {
    id: "p-03",
    name: "스트레이트 데님 팬츠",
    category: "팬츠",
    price: 118000,
    color: "미드 블루",
    image: picsum("vestire-straight-denim-pants", 640, 800),
    rank: 3,
    rating: 4.6,
    reviewCount: 447,
  },
  {
    id: "p-04",
    name: "테일러드 울 블레이저",
    category: "아우터",
    price: 268000,
    color: "차콜",
    image: picsum("vestire-tailored-wool-blazer", 640, 800),
    rank: 4,
    rating: 4.9,
    reviewCount: 189,
  },
  {
    id: "p-05",
    name: "실크 블렌드 블라우스",
    category: "셔츠/블라우스",
    price: 138000,
    color: "아이보리",
    image: picsum("vestire-silk-blend-blouse", 640, 800),
    rank: 5,
    isNew: true,
    rating: 4.5,
    reviewCount: 156,
  },
  {
    id: "p-06",
    name: "와이드 슬랙스",
    category: "팬츠",
    price: 108000,
    color: "블랙",
    image: picsum("vestire-wide-slacks", 640, 800),
    rank: 6,
    rating: 4.7,
    reviewCount: 278,
  },
  {
    id: "p-07",
    name: "코튼 오버사이즈 셔츠",
    category: "셔츠/블라우스",
    price: 98000,
    color: "화이트",
    image: picsum("vestire-cotton-oversize-shirt", 640, 800),
    isNew: true,
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "p-08",
    name: "플리츠 미디 스커트",
    category: "스커트",
    price: 118000,
    color: "모스 그린",
    image: picsum("vestire-pleated-midi-skirt", 640, 800),
    isNew: true,
    rating: 4.4,
    reviewCount: 92,
  },
  {
    id: "p-09",
    name: "캐시미어 블렌드 머플러",
    category: "액세서리",
    price: 79000,
    color: "베이지",
    image: picsum("vestire-cashmere-scarf", 640, 800),
    rating: 4.8,
    reviewCount: 134,
  },
  {
    id: "p-10",
    name: "크루넥 울 니트",
    category: "니트웨어",
    price: 94000,
    originalPrice: 118000,
    color: "네이비",
    image: picsum("vestire-crewneck-wool-knit", 640, 800),
    rating: 4.6,
    reviewCount: 367,
  },
  {
    id: "p-11",
    name: "레더 첼시 부츠",
    category: "슈즈",
    price: 228000,
    color: "다크 브라운",
    image: picsum("vestire-leather-chelsea-boots", 640, 800),
    isNew: true,
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: "p-12",
    name: "린넨 블렌드 셋업 재킷",
    category: "아우터",
    price: 188000,
    color: "샌드",
    image: picsum("vestire-linen-setup-jacket", 640, 800),
    rating: 4.5,
    reviewCount: 61,
  },
  {
    id: "p-13",
    name: "밴딩 슬림 팬츠",
    category: "팬츠",
    price: 88000,
    color: "차콜",
    image: picsum("vestire-banding-slim-pants", 640, 800),
    isNew: true,
    rating: 4.3,
    reviewCount: 74,
  },
  {
    id: "p-14",
    name: "브이넥 미디 원피스",
    category: "원피스",
    price: 148000,
    color: "버건디",
    image: picsum("vestire-vneck-midi-dress", 640, 800),
    rating: 4.6,
    reviewCount: 121,
  },
  {
    id: "p-15",
    name: "스퀘어 토트백",
    category: "액세서리",
    price: 168000,
    color: "블랙",
    image: picsum("vestire-square-tote-bag", 640, 800),
    rating: 4.7,
    reviewCount: 143,
  },
  {
    id: "p-16",
    name: "더블 브레스티드 코트",
    category: "아우터",
    price: 358000,
    color: "그레이",
    image: picsum("vestire-double-breasted-coat", 640, 800),
    rating: 4.8,
    reviewCount: 97,
  },
];

export const bestSellers = products
  .filter((p) => p.rank)
  .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

export const newArrivals = products.filter((p) => p.isNew);

export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}
