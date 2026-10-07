export const SCREENS = ["orders", "new-order", "order-detail"] as const;

export type Screen = (typeof SCREENS)[number];

export type Navigate = (screen: Screen, orderId?: string) => void;

/* 상단 바에 보이는 화면. 상세는 목록에서 행을 눌러 들어가므로 내비에 없다. */
export const NAV_ITEMS: { key: Screen; label: string }[] = [
  { key: "orders", label: "발주 현황" },
  { key: "new-order", label: "발주 작성" },
];
