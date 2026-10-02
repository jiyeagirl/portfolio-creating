export type Tone = "ok" | "info" | "warn" | "danger" | "neutral";

export type CenterId = "ICN" | "YGN" | "PTK" | "CGK" | "GMP" | "SPA";

export type LinkStatus = "정상" | "지연" | "장애";

export type DataDomain = "입고" | "출고" | "재고" | "상품" | "거래처";

export type Center = {
  id: CenterId;
  name: string;
  region: string;
  /** 원천 운영 시스템 */
  system: string;
  method: "API" | "DB" | "파일";
  cycle: string;
  lastSync: string;
  lastSyncAgo: string;
  status: LinkStatus;
  statusNote?: string;
  photo: number;
  domains: DataDomain[];
  /** 이 센터 원천 상품코드 형식 예시 */
  codeSample: string;
  todayIn: number;
  todayOut: number;
  success: number;
  fail: number;
  latencySec: number;
  /** 최근 12시간 시간대별 수집 건수 */
  hourly: number[];
};

export type IngestRun = {
  id: string;
  centerId: CenterId;
  domain: DataDomain;
  startedAt: string;
  records: number;
  duration: string;
  status: "완료" | "진행 중" | "지연" | "실패";
};

export type VerifyStatus = "정상" | "중복" | "누락" | "오류";

export type VerifyRecord = {
  id: string;
  key: string;
  centerId: CenterId;
  domain: DataDomain;
  status: VerifyStatus;
  reason: string;
  field?: string;
  collectedAt: string;
  retry: "재처리 대기" | "재처리 완료" | "재처리 실패" | "폐기" | "해당 없음";
  attempts: number;
};

export type FailureLog = {
  id: string;
  centerId: CenterId;
  at: string;
  code: string;
  message: string;
  affected: number;
  resolved: boolean;
};

export type MappingStatus = "확정" | "검토" | "미매핑";

export type SourceCode = {
  centerId: CenterId;
  code: string;
  name: string;
  unit: string;
};

export type Mapping = {
  std: string;
  name: string;
  unit: string;
  category: string;
  photo?: number;
  sources: SourceCode[];
  status: MappingStatus;
  confidence: number;
  updatedAt: string;
};

export type StatusRule = {
  centerId: CenterId;
  domain: "입고" | "출고";
  raw: string;
  std: string;
};

export type SchemaField = {
  source: string;
  sourceValue: string;
  target: string;
  targetValue: string;
  rule: string;
};

export type Movement = "입고" | "출고";

export type TraceStep = {
  label: string;
  at: string;
  detail: string;
};

export type UnifiedRecord = {
  id: string;
  movement: Movement;
  std: string;
  product: string;
  qty: number;
  unit: string;
  centerId: CenterId;
  occurredAt: string;
  statusStd: string;
  partner: string;
  trace: {
    sourceSystem: string;
    sourceRecordId: string;
    collectedAt: string;
    batchId: string;
    dedupeKey: string;
    raw: [string, string][];
    rules: { code: string; text: string }[];
    steps: TraceStep[];
  };
};

export type InventoryRow = {
  std: string;
  product: string;
  centerId: CenterId;
  onHand: number;
  safety: number;
  delta: number;
  unit: string;
  anomaly?: string;
  /** 최근 14일 재고 */
  history: number[];
};

export type StockEvent = {
  at: string;
  centerId: CenterId;
  std: string;
  kind: "입고" | "출고" | "조정" | "이동";
  qty: number;
  after: number;
  ref: string;
};

export type ApiStatus = "운영" | "점검" | "오류" | "예정";

export type ApiEndpoint = {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  group: "데이터 수신" | "통합 조회" | "기준정보 연계" | "외부 연동";
  calls24h: number;
  lastCall: string;
  p95: number;
  errorRate: number;
  status: ApiStatus;
  consumer: string;
};

export type ApiLog = {
  at: string;
  method: ApiEndpoint["method"];
  path: string;
  client: string;
  code: number;
  ms: number;
};

export type Incident = {
  id: string;
  centerId: CenterId;
  level: "장애" | "지연" | "경고";
  title: string;
  startedAt: string;
  duration: string;
  owner: string;
  state: "대응 중" | "모니터링" | "해결";
};

export type SettlementStatus = "예정" | "검토" | "확정";

export type SettlementBasis = "수량" | "중량" | "운송 건수";

export type SettlementLine = {
  unifiedId: string;
  movement: Movement;
  product: string;
  qty: number;
  unit: string;
  weightKg: number;
  collectedAt: string;
  /** 이 레코드가 정산 기준에서 차지하는 값 (수량, kg, 운송 1건) */
  basisValue: number;
  amount: number;
};

export type Settlement = {
  id: string;
  period: string;
  centerId: CenterId;
  partner: string;
  basis: SettlementBasis;
  basisUnit: string;
  rate: number;
  basisTotal: number;
  base: number;
  extras: { label: string; amount: number }[];
  count: number;
  status: SettlementStatus;
  confirmedAt?: string;
  lines: SettlementLine[];
};
