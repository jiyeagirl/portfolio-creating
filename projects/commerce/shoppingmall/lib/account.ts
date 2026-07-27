export type OrderStatus = "결제완료" | "배송준비중" | "배송중" | "배송완료";

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: string;
  itemCount: number;
  total: number;
  thumbnail: string;
};

export type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  recipient: string;
  phone: string;
  address: string;
};

export const customer = {
  name: "이서연",
  email: "seoyeon.lee@gmail.com",
  tier: "GOLD",
  memberSince: "2023.04",
  points: 48200,
  pointsToNextTier: 32000,
  tierProgress: 0.68,
};

export const orders: Order[] = [
  {
    id: "VT20260723-0142",
    date: "2026.07.23",
    status: "결제완료",
    items: "울 캐시미어 싱글 코트 외 1건",
    itemCount: 2,
    total: 487000,
    thumbnail: "https://picsum.photos/seed/vestire-wool-cashmere-coat/200/200",
  },
  {
    id: "VT20260718-0098",
    date: "2026.07.18",
    status: "배송중",
    items: "리브 하프넥 니트",
    itemCount: 1,
    total: 89000,
    thumbnail: "https://picsum.photos/seed/vestire-rib-half-neck-knit/200/200",
  },
  {
    id: "VT20260705-0231",
    date: "2026.07.05",
    status: "배송완료",
    items: "스트레이트 데님 팬츠 외 2건",
    itemCount: 3,
    total: 314000,
    thumbnail: "https://picsum.photos/seed/vestire-straight-denim-pants/200/200",
  },
  {
    id: "VT20260622-0177",
    date: "2026.06.22",
    status: "배송완료",
    items: "캐시미어 블렌드 머플러",
    itemCount: 1,
    total: 79000,
    thumbnail: "https://picsum.photos/seed/vestire-cashmere-scarf/200/200",
  },
  {
    id: "VT20260530-0064",
    date: "2026.05.30",
    status: "배송완료",
    items: "테일러드 울 블레이저",
    itemCount: 1,
    total: 268000,
    thumbnail: "https://picsum.photos/seed/vestire-tailored-wool-blazer/200/200",
  },
];

export const addresses: Address[] = [
  {
    id: "addr-1",
    label: "집",
    isDefault: true,
    recipient: "이서연",
    phone: "010-4821-9036",
    address: "서울특별시 마포구 양화로 12길 25, 4층 401호 (합정동)",
  },
  {
    id: "addr-2",
    label: "회사",
    isDefault: false,
    recipient: "이서연",
    phone: "010-4821-9036",
    address: "서울특별시 성동구 성수이로 77, 어반타워 8층",
  },
];

export const orderStatusColor: Record<OrderStatus, string> = {
  결제완료: "bg-surface text-muted border border-border",
  배송준비중: "bg-surface text-muted border border-border",
  배송중: "bg-accent-soft text-accent border border-accent/20",
  배송완료: "bg-accent text-accent-foreground",
};
