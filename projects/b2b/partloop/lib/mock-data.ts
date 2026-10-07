import type { Order, Supplier } from "@/projects/b2b/partloop/lib/types";

/* 화면 전체가 같은 "오늘"을 쓴다. 지연 판정과 이번 달 집계의 기준이다. */
export const TODAY = "2026-10-14";
export const NOW_STAMP = "2026-10-14 15:08";
export const THIS_MONTH = "2026-10";

export const BUYER = {
  company: "A테크",
  team: "구매팀",
  manager: "마정훈",
};

export const DESTINATIONS = ["A테크 평택 1공장 자재창고", "A테크 화성 2공장 입고장"];

export const suppliers: Supplier[] = [
  { id: "sup-b", name: "B소재", category: "금속 소재", contact: "양태호", phone: "031-402-1187", leadDays: 5 },
  { id: "sup-c", name: "C정밀", category: "베어링, 축, 기어", contact: "구하람", phone: "032-818-4421", leadDays: 7 },
  { id: "sup-d", name: "D패키징", category: "포장재", contact: "노선재", phone: "031-662-9034", leadDays: 3 },
  { id: "sup-e", name: "E전자", category: "기판, 커넥터", contact: "우민재", phone: "070-4210-3358", leadDays: 10 },
  { id: "sup-f", name: "F금속", category: "볼트, 와셔, 스프링", contact: "석영훈", phone: "041-554-7702", leadDays: 4 },
];

export const initialOrders: Order[] = [
  {
    id: "PO-2610-0431",
    supplierId: "sup-d",
    status: "승인 대기",
    requestedOn: "2026-10-14",
    dueDate: "2026-10-27",
    destination: DESTINATIONS[0],
    memo: "10월 3주차 출하분 포장용. 박스는 도면 REV2 규격으로 부탁드립니다.",
    items: [
      { id: "i1", name: "골판지 박스 대", spec: "480 × 360 × 300 mm, 이중 골", qty: 2350, unitPrice: 1270 },
      { id: "i2", name: "에어캡 롤", spec: "1.2 m × 50 m", qty: 64, unitPrice: 18400 },
    ],
    events: { requested: "2026-10-14 09:42" },
  },
  {
    id: "PO-2610-0428",
    supplierId: "sup-e",
    status: "승인 대기",
    requestedOn: "2026-10-13",
    dueDate: "2026-11-04",
    destination: DESTINATIONS[1],
    memo: "시제품 3차 양산분. 납품 시 성적서 동봉.",
    items: [
      { id: "i1", name: "제어 기판 REV3", spec: "4층, 120 × 85 mm", qty: 640, unitPrice: 8730 },
      { id: "i2", name: "12핀 커넥터", spec: "2.54 mm 피치", qty: 1920, unitPrice: 346 },
    ],
    events: { requested: "2026-10-13 16:25" },
  },
  {
    id: "PO-2610-0424",
    supplierId: "sup-c",
    status: "수락 대기",
    requestedOn: "2026-10-13",
    dueDate: "2026-10-30",
    destination: DESTINATIONS[0],
    memo: "",
    items: [
      { id: "i1", name: "깊은 홈 볼 베어링 6204ZZ", spec: "내경 20 mm, 외경 47 mm", qty: 1200, unitPrice: 2180 },
      { id: "i2", name: "베어링 하우징 UCP204", spec: "주철, 축경 20 mm", qty: 80, unitPrice: 7450 },
    ],
    events: { requested: "2026-10-13 11:03" },
  },
  {
    id: "PO-2610-0419",
    supplierId: "sup-b",
    status: "진행 중",
    requestedOn: "2026-10-08",
    dueDate: "2026-10-22",
    destination: DESTINATIONS[1],
    memo: "절단 도면은 메일로 전달했습니다.",
    items: [
      { id: "i1", name: "알루미늄 판재 A5052", spec: "t3.0, 1000 × 2000 mm", qty: 46, unitPrice: 94800 },
    ],
    events: {
      requested: "2026-10-08 10:17",
      accepted: "2026-10-08 14:52",
      shipped: "2026-10-13 17:40",
    },
  },
  {
    id: "PO-2610-0415",
    supplierId: "sup-f",
    status: "진행 중",
    requestedOn: "2026-10-07",
    dueDate: "2026-10-20",
    destination: DESTINATIONS[0],
    memo: "",
    items: [
      { id: "i1", name: "육각 볼트 M8 × 30", spec: "SUS304, 전나사", qty: 5600, unitPrice: 118 },
      { id: "i2", name: "스프링 와셔 M8", spec: "SUS304", qty: 5600, unitPrice: 31 },
    ],
    events: {
      requested: "2026-10-07 15:21",
      accepted: "2026-10-07 17:48",
    },
  },
  {
    id: "PO-2610-0411",
    supplierId: "sup-e",
    status: "지연",
    requestedOn: "2026-10-05",
    dueDate: "2026-10-10",
    destination: DESTINATIONS[1],
    memo: "조립 라인 투입 일정이 있어 납기 엄수 부탁드립니다.",
    items: [
      { id: "i1", name: "전원 커넥터 3P", spec: "5.08 mm 피치", qty: 2740, unitPrice: 612 },
      { id: "i2", name: "케이블 하네스 6핀", spec: "길이 400 mm", qty: 860, unitPrice: 1490 },
    ],
    events: {
      requested: "2026-10-05 09:14",
      accepted: "2026-10-05 13:39",
    },
  },
  {
    id: "PO-2610-0406",
    supplierId: "sup-c",
    status: "진행 중",
    requestedOn: "2026-10-02",
    dueDate: "2026-10-17",
    destination: DESTINATIONS[0],
    memo: "",
    items: [
      { id: "i1", name: "스테인리스 샤프트", spec: "SUS303, 지름 12 × 300 mm", qty: 360, unitPrice: 5920 },
      { id: "i2", name: "오일 씰 TC", spec: "12 × 22 × 7 mm", qty: 720, unitPrice: 540 },
    ],
    events: {
      requested: "2026-10-02 10:36",
      accepted: "2026-10-02 16:05",
      shipped: "2026-10-14 07:50",
    },
  },
  {
    id: "PO-2610-0402",
    supplierId: "sup-d",
    status: "납품 완료",
    requestedOn: "2026-10-01",
    dueDate: "2026-10-08",
    destination: DESTINATIONS[0],
    memo: "",
    items: [
      { id: "i1", name: "발포 완충재", spec: "PE, 두께 20 mm", qty: 900, unitPrice: 3260 },
      { id: "i2", name: "라벨 롤", spec: "100 × 150 mm, 500매", qty: 140, unitPrice: 12900 },
    ],
    events: {
      requested: "2026-10-01 09:05",
      accepted: "2026-10-01 11:20",
      shipped: "2026-10-06 13:10",
      delivered: "2026-10-07 10:42",
    },
  },
  {
    id: "PO-2609-0398",
    supplierId: "sup-b",
    status: "납품 완료",
    requestedOn: "2026-09-24",
    dueDate: "2026-10-02",
    destination: DESTINATIONS[1],
    memo: "",
    items: [
      { id: "i1", name: "스테인리스 판재 SUS304", spec: "t2.0, 1219 × 2438 mm", qty: 22, unitPrice: 187300 },
    ],
    events: {
      requested: "2026-09-24 14:11",
      accepted: "2026-09-24 16:30",
      shipped: "2026-09-29 09:25",
      delivered: "2026-09-30 15:12",
    },
  },
  {
    id: "PO-2609-0391",
    supplierId: "sup-f",
    status: "납품 완료",
    requestedOn: "2026-09-18",
    dueDate: "2026-09-25",
    destination: DESTINATIONS[0],
    memo: "",
    items: [
      { id: "i1", name: "육각 너트 M10", spec: "SUS304", qty: 3200, unitPrice: 74 },
      { id: "i2", name: "평와셔 M10", spec: "SUS304", qty: 3200, unitPrice: 22 },
    ],
    events: {
      requested: "2026-09-18 11:47",
      accepted: "2026-09-18 15:02",
      shipped: "2026-09-23 10:15",
      delivered: "2026-09-24 09:36",
    },
  },
  {
    id: "PO-2609-0385",
    supplierId: "sup-c",
    status: "납품 완료",
    requestedOn: "2026-09-12",
    dueDate: "2026-09-26",
    destination: DESTINATIONS[1],
    memo: "",
    items: [
      { id: "i1", name: "스퍼 기어 모듈 1.5", spec: "Z32, S45C", qty: 150, unitPrice: 14260 },
    ],
    events: {
      requested: "2026-09-12 13:28",
      accepted: "2026-09-12 17:10",
      shipped: "2026-09-24 08:45",
      delivered: "2026-09-25 14:08",
    },
  },
];

export function supplierOf(id: string): Supplier {
  return suppliers.find((supplier) => supplier.id === id) ?? suppliers[0];
}
