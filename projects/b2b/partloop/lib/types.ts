export type OrderStatus = "승인 대기" | "수락 대기" | "진행 중" | "지연" | "납품 완료";

export type OrderItem = {
  id: string;
  name: string;
  spec: string;
  qty: number;
  unitPrice: number;
};

/* 타임라인 4단계. 값이 있으면 그 시각에 끝난 단계다. */
export type OrderEvents = {
  requested?: string;
  accepted?: string;
  shipped?: string;
  delivered?: string;
};

export type Order = {
  id: string;
  supplierId: string;
  status: OrderStatus;
  requestedOn: string;
  dueDate: string;
  destination: string;
  memo: string;
  items: OrderItem[];
  events: OrderEvents;
};

export type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  leadDays: number;
};
