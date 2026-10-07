import type {
  ApiEndpoint,
  ApiLog,
  Center,
  CenterId,
  FailureLog,
  Incident,
  IngestRun,
  InventoryRow,
  Mapping,
  SchemaField,
  Settlement,
  SettlementBasis,
  SettlementStatus,
  StatusRule,
  StockEvent,
  UnifiedRecord,
  VerifyRecord,
} from "@/projects/b2b/logisync/lib/types";

/* 기준 시각: 2026-04-15(수) 14:36 KST. 프로젝트 수행기간 2026.01 ~ 2026.04 안의 날짜만 쓴다. */
export const NOW_LABEL = "2026.04.15 수 14:36";
export const LAST_SYNC = "14:35:52";

export const OPERATOR = { name: "정하림", role: "본사 데이터운영팀", initials: "하림" };

export const CENTERS: Center[] = [
  {
    id: "ICN",
    name: "이천 1센터",
    region: "경기 이천시 마장면",
    system: "A사 WMS v5.2",
    method: "API",
    cycle: "5분",
    lastSync: "14:35:52",
    lastSyncAgo: "8초 전",
    status: "정상",
    photo: 352,
    domains: ["입고", "출고", "재고", "상품"],
    codeSample: "SKU-0192",
    todayIn: 18_416,
    todayOut: 21_907,
    success: 40_226,
    fail: 93,
    latencySec: 4,
    hourly: [2210, 2480, 3104, 3522, 3398, 3611, 3287, 2940, 3176, 3405, 3520, 3302],
  },
  {
    id: "YGN",
    name: "용인 2센터",
    region: "경기 용인시 처인구",
    system: "B사 WMS Cold 3",
    method: "DB",
    cycle: "10분",
    lastSync: "14:30:11",
    lastSyncAgo: "5분 전",
    status: "정상",
    photo: 576,
    domains: ["입고", "출고", "재고"],
    codeSample: "P10192",
    todayIn: 7_318,
    todayOut: 8_064,
    success: 15_297,
    fail: 85,
    latencySec: 11,
    hourly: [980, 1104, 1320, 1288, 1402, 1377, 1296, 1188, 1240, 1311, 1356, 1290],
  },
  {
    id: "PTK",
    name: "평택 3센터",
    region: "경기 평택시 포승읍",
    system: "자체 작업관리 시스템",
    method: "파일",
    cycle: "30분",
    lastSync: "14:02:40",
    lastSyncAgo: "33분 전",
    status: "지연",
    statusNote: "14:30 배치 파일 미도착, 3분 초과",
    photo: 617,
    domains: ["입고", "출고", "재고", "거래처"],
    codeSample: "192-KR",
    todayIn: 9_870,
    todayOut: 6_215,
    success: 15_702,
    fail: 383,
    latencySec: 1_980,
    hourly: [1402, 1388, 1510, 1688, 1720, 1754, 1690, 1621, 1604, 1580, 1710, 412],
  },
  {
    id: "CGK",
    name: "칠곡 4센터",
    region: "경북 칠곡군 왜관읍",
    system: "D사 작업관리 WES",
    method: "API",
    cycle: "실시간",
    lastSync: "14:36:01",
    lastSyncAgo: "방금",
    status: "정상",
    photo: 242,
    domains: ["입고", "출고", "재고", "상품", "거래처"],
    codeSample: "YN-000192-EA",
    todayIn: 14_026,
    todayOut: 15_388,
    success: 29_381,
    fail: 33,
    latencySec: 1,
    hourly: [2044, 2196, 2380, 2512, 2466, 2590, 2481, 2302, 2418, 2533, 2601, 2475],
  },
  {
    id: "GMP",
    name: "김포 5센터",
    region: "서울 강서구 공항동",
    system: "A사 WMS v4.8",
    method: "API",
    cycle: "15분",
    lastSync: "13:48:22",
    lastSyncAgo: "47분 전",
    status: "장애",
    statusNote: "연계 인증서 만료로 인증 실패 (AUTH-401)",
    photo: 331,
    domains: ["입고", "출고", "재고"],
    codeSample: "SKU-0192",
    todayIn: 3_902,
    todayOut: 4_411,
    success: 8_069,
    fail: 244,
    latencySec: 2_850,
    hourly: [690, 712, 744, 708, 731, 702, 688, 540, 702, 690, 410, 0],
  },
  {
    id: "SPA",
    name: "송파 6센터",
    region: "서울 송파구 문정동",
    system: "C사 OMS 연동 WMS",
    method: "API",
    cycle: "5분",
    lastSync: "14:34:47",
    lastSyncAgo: "1분 전",
    status: "정상",
    photo: 88,
    domains: ["입고", "출고", "재고", "상품"],
    codeSample: "C-192-WH",
    todayIn: 5_644,
    todayOut: 12_543,
    success: 18_521,
    fail: 53,
    latencySec: 6,
    hourly: [1210, 1388, 1566, 1702, 1655, 1590, 1498, 1520, 1611, 1684, 1702, 1655],
  },
];

export const CENTER_BY_ID = Object.fromEntries(CENTERS.map((c) => [c.id, c])) as Record<
  CenterId,
  Center
>;

export const HOUR_LABELS = ["03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];

export const INGEST_RUNS: IngestRun[] = [
  { id: "B-260415-1436-CGK", centerId: "CGK", domain: "출고", startedAt: "14:36:01", records: 412, duration: "실시간", status: "진행 중" },
  { id: "B-260415-1435-ICN", centerId: "ICN", domain: "출고", startedAt: "14:35:44", records: 1_208, duration: "8.2초", status: "완료" },
  { id: "B-260415-1434-SPA", centerId: "SPA", domain: "입고", startedAt: "14:34:39", records: 386, duration: "5.1초", status: "완료" },
  { id: "B-260415-1430-PTK", centerId: "PTK", domain: "입고", startedAt: "14:30:00", records: 0, duration: "대기 6분", status: "지연" },
  { id: "B-260415-1430-YGN", centerId: "YGN", domain: "재고", startedAt: "14:30:02", records: 2_914, duration: "9.7초", status: "완료" },
  { id: "B-260415-1430-GMP", centerId: "GMP", domain: "입고", startedAt: "14:30:00", records: 0, duration: "0.4초", status: "실패" },
  { id: "B-260415-1430-ICN", centerId: "ICN", domain: "재고", startedAt: "14:30:05", records: 6_402, duration: "21.4초", status: "완료" },
  { id: "B-260415-1425-SPA", centerId: "SPA", domain: "출고", startedAt: "14:25:40", records: 1_133, duration: "6.0초", status: "완료" },
];

export const PIPELINE = [
  { code: "SOURCE", label: "원천 수신", value: 128_612, note: "6개 센터, 3종 연계" },
  { code: "VERIFY", label: "정합성 검증", value: 127_721, note: "중복 516 | 오류 375" },
  { code: "MAP", label: "표준화 변환", value: 127_704, note: "미매핑 17건 보류" },
  { code: "UNIFIED", label: "통합 적재", value: 127_704, note: "공통 스키마 v2.3" },
];

export const VERIFY_COUNTS = { 정상: 127_721, 중복: 516, 누락: 208, 오류: 167 };

export const VERIFY_RECORDS: VerifyRecord[] = [
  { id: "V-88120", key: "ICN|GR|20260415|GR-7730418|L03", centerId: "ICN", domain: "입고", status: "중복", reason: "동일 식별키 재전송 (14:20 배치와 14:25 배치)", collectedAt: "14:25:07", retry: "폐기", attempts: 0 },
  { id: "V-88117", key: "PTK|GI|20260415|OUT-55102|001", centerId: "PTK", domain: "출고", status: "누락", reason: "출고 수량 필드 공백", field: "OUT_QTY", collectedAt: "14:02:40", retry: "재처리 대기", attempts: 1 },
  { id: "V-88115", key: "GMP|GR|20260415|AWB-18077342|02", centerId: "GMP", domain: "입고", status: "오류", reason: "수집 실패 (AUTH-401 인증 거부)", collectedAt: "13:48:22", retry: "재처리 대기", attempts: 3 },
  { id: "V-88111", key: "YGN|ST|20260415|LOC-C2-14-03|P14533", centerId: "YGN", domain: "재고", status: "오류", reason: "재고 수량 음수 (-24)", field: "QTY_ON_HAND", collectedAt: "14:20:09", retry: "재처리 실패", attempts: 2 },
  { id: "V-88108", key: "SPA|GI|20260415|ORD-2604-44871|1", centerId: "SPA", domain: "출고", status: "정상", reason: "검증 통과", collectedAt: "14:19:52", retry: "해당 없음", attempts: 0 },
  { id: "V-88104", key: "CGK|GR|20260415|ASN-90218|004", centerId: "CGK", domain: "입고", status: "누락", reason: "거래처 코드 누락", field: "VENDOR_CD", collectedAt: "14:17:31", retry: "재처리 완료", attempts: 1 },
  { id: "V-88101", key: "ICN|GI|20260415|GI-4418822|L01", centerId: "ICN", domain: "출고", status: "중복", reason: "센터 재전송, 수량 동일", collectedAt: "14:15:03", retry: "폐기", attempts: 0 },
  { id: "V-88097", key: "PTK|GR|20260415|IN-33019|003", centerId: "PTK", domain: "입고", status: "오류", reason: "입고일자 형식 불일치 (15/04/26)", field: "IN_DATE", collectedAt: "14:02:40", retry: "재처리 대기", attempts: 1 },
  { id: "V-88094", key: "YGN|GR|20260415|RCV-0415-0331|02", centerId: "YGN", domain: "입고", status: "정상", reason: "검증 통과", collectedAt: "14:10:08", retry: "해당 없음", attempts: 0 },
  { id: "V-88090", key: "SPA|GR|20260415|RCV-S-11820|1", centerId: "SPA", domain: "입고", status: "누락", reason: "단위 코드 누락, 기본 단위 추정 불가", field: "UOM", collectedAt: "14:09:47", retry: "재처리 대기", attempts: 0 },
  { id: "V-88086", key: "CGK|GI|20260415|SHP-66310|011", centerId: "CGK", domain: "출고", status: "정상", reason: "검증 통과", collectedAt: "14:08:55", retry: "해당 없음", attempts: 0 },
  { id: "V-88079", key: "ICN|ST|20260415|A-07-22-1|SKU-0480", centerId: "ICN", domain: "재고", status: "오류", reason: "존재하지 않는 로케이션", field: "LOC_CD", collectedAt: "14:05:18", retry: "재처리 완료", attempts: 1 },
];

export const FAILURE_LOGS: FailureLog[] = [
  { id: "F-3021", centerId: "GMP", at: "14:30:00", code: "AUTH-401", message: "연계 인증서 만료 (2026-04-15 13:45)", affected: 244, resolved: false },
  { id: "F-3020", centerId: "PTK", at: "14:30:00", code: "FILE-404", message: "14:30 입고 배치 파일 미도착", affected: 0, resolved: false },
  { id: "F-3017", centerId: "YGN", at: "14:20:09", code: "VAL-NEG", message: "음수 재고 24건 격리", affected: 24, resolved: false },
  { id: "F-3012", centerId: "ICN", at: "13:10:41", code: "API-503", message: "원천 API 일시 응답 불가, 2회 재시도 후 성공", affected: 0, resolved: true },
];

export const MAPPINGS: Mapping[] = [
  {
    std: "LS-000192",
    name: "싱글오리진 원두 1kg",
    unit: "EA",
    category: "식품 / 커피",
    photo: 766,
    status: "확정",
    confidence: 100,
    updatedAt: "04.10 10:24",
    sources: [
      { centerId: "ICN", code: "SKU-0192", name: "원두1KG_싱글오리진", unit: "EA" },
      { centerId: "YGN", code: "P10192", name: "원두 싱글오리진 1K", unit: "봉" },
      { centerId: "PTK", code: "192-KR", name: "COFFEE BEAN SO 1KG", unit: "PCS" },
      { centerId: "CGK", code: "YN-000192-EA", name: "싱글오리진 원두(1kg)", unit: "개" },
    ],
  },
  {
    std: "LS-000207",
    name: "베이직 코튼 반팔 티셔츠 L",
    unit: "EA",
    category: "패션 / 상의",
    photo: 535,
    status: "확정",
    confidence: 100,
    updatedAt: "04.08 16:02",
    sources: [
      { centerId: "ICN", code: "SKU-0207-L", name: "베이직반팔티_L", unit: "EA" },
      { centerId: "SPA", code: "C-207-WH-L", name: "코튼 반팔 T (L)", unit: "EA" },
    ],
  },
  {
    std: "LS-004518",
    name: "설향 딸기 500g",
    unit: "PK",
    category: "신선 / 과일",
    photo: 1080,
    status: "검토",
    confidence: 86,
    updatedAt: "04.15 13:58",
    sources: [
      { centerId: "YGN", code: "P14518", name: "딸기(설향)500G", unit: "팩" },
      { centerId: "SPA", code: "C-4518-FR", name: "설향딸기 0.5kg", unit: "BOX" },
    ],
  },
  {
    std: "LS-004533",
    name: "손질 채소 믹스 300g",
    unit: "PK",
    category: "신선 / 채소",
    photo: 292,
    status: "확정",
    confidence: 100,
    updatedAt: "04.06 09:12",
    sources: [
      { centerId: "YGN", code: "P14533", name: "손질채소믹스300", unit: "팩" },
      { centerId: "SPA", code: "C-4533-FR", name: "채소 믹스 300g", unit: "PK" },
    ],
  },
  {
    std: "LS-001062",
    name: "무선 바코드 스캐너",
    unit: "EA",
    category: "전자 / 사무기기",
    status: "확정",
    confidence: 100,
    updatedAt: "03.27 15:40",
    sources: [
      { centerId: "ICN", code: "SKU-1062", name: "무선스캐너_BT", unit: "EA" },
      { centerId: "GMP", code: "SKU-1062", name: "무선스캐너_BT", unit: "EA" },
      { centerId: "CGK", code: "YN-001062-EA", name: "블루투스 바코드 스캐너", unit: "개" },
    ],
  },
  {
    std: "미지정",
    name: "골판지 박스 3호 (추정)",
    unit: "BX",
    category: "부자재",
    status: "미매핑",
    confidence: 41,
    updatedAt: "04.15 14:02",
    sources: [{ centerId: "PTK", code: "PKG-03-KR", name: "CARTON NO.3", unit: "BDL" }],
  },
];

export const STATUS_RULES: StatusRule[] = [
  { centerId: "ICN", domain: "입고", raw: "GR_DONE", std: "입고완료" },
  { centerId: "YGN", domain: "입고", raw: "RCV_CMPL", std: "입고완료" },
  { centerId: "PTK", domain: "입고", raw: "IN-OK", std: "입고완료" },
  { centerId: "CGK", domain: "입고", raw: "30", std: "입고완료" },
  { centerId: "ICN", domain: "출고", raw: "GI_SHIPPED", std: "출고완료" },
  { centerId: "SPA", domain: "출고", raw: "DISPATCHED", std: "출고완료" },
  { centerId: "PTK", domain: "출고", raw: "OUT-HOLD", std: "출고보류" },
  { centerId: "CGK", domain: "출고", raw: "85", std: "출고보류" },
];

export const SCHEMA_FIELDS: SchemaField[] = [
  { source: "OUT_NO", sourceValue: "OUT-55108", target: "source_ref", targetValue: "PTK:OUT-55108", rule: "센터 접두어 결합" },
  { source: "ITEM_CD", sourceValue: "192-KR", target: "std_item_code", targetValue: "LS-000192", rule: "상품코드 매핑 M-192" },
  { source: "ITEM_NM", sourceValue: "COFFEE BEAN SO 1KG", target: "item_name", targetValue: "싱글오리진 원두 1kg", rule: "표준 상품명 치환" },
  { source: "OUT_QTY", sourceValue: "2 BOX(12)", target: "qty", targetValue: "24", rule: "BOX 입수 12 환산" },
  { source: "UOM", sourceValue: "PCS", target: "unit", targetValue: "EA", rule: "단위 사전 U-07" },
  { source: "STS", sourceValue: "OUT-OK", target: "status", targetValue: "출고완료", rule: "상태 사전 S-PTK-02" },
  { source: "OUT_DATE", sourceValue: "15/04/26 13:52", target: "occurred_at", targetValue: "2026-04-15T13:52:00+09:00", rule: "DD/MM/YY → ISO 8601" },
];

export const UNIFIED: UnifiedRecord[] = [
  {
    id: "UT-2604-0418822",
    movement: "출고",
    std: "LS-000192",
    product: "싱글오리진 원두 1kg",
    qty: 24,
    unit: "EA",
    centerId: "PTK",
    occurredAt: "04.15 13:52",
    statusStd: "출고완료",
    partner: "D유통 부산점",
    trace: {
      sourceSystem: "자체 작업관리 시스템 (파일)",
      sourceRecordId: "OUT-55108 / 라인 002",
      collectedAt: "2026-04-15 14:02:40",
      batchId: "B-260415-1400-PTK",
      dedupeKey: "PTK|GI|20260415|OUT-55108|002",
      raw: [
        ["OUT_NO", "OUT-55108"],
        ["LINE", "002"],
        ["ITEM_CD", "192-KR"],
        ["ITEM_NM", "COFFEE BEAN SO 1KG"],
        ["OUT_QTY", "2 BOX(12)"],
        ["UOM", "PCS"],
        ["STS", "OUT-OK"],
        ["OUT_DATE", "15/04/26 13:52"],
        ["CUST_CD", "BS-D0031"],
      ],
      rules: [
        { code: "M-192", text: "192-KR → LS-000192 상품코드 매핑" },
        { code: "U-07", text: "PCS → EA, BOX 입수 12 환산" },
        { code: "S-PTK-02", text: "OUT-OK → 출고완료" },
        { code: "D-03", text: "DD/MM/YY → ISO 8601, KST 부여" },
      ],
      steps: [
        { label: "원천 발생", at: "13:52:00", detail: "평택 3센터 작업관리 시스템 출고 확정" },
        { label: "수집", at: "14:02:40", detail: "14:00 출고 배치 파일, 1,284행 중 412행" },
        { label: "정합성 검증", at: "14:02:43", detail: "식별키 중복 없음, 필수 필드 9/9" },
        { label: "표준화", at: "14:02:44", detail: "규칙 4건 적용, 매핑 규칙 v3.14" },
        { label: "통합 적재", at: "14:02:45", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418817",
    movement: "입고",
    std: "LS-000192",
    product: "싱글오리진 원두 1kg",
    qty: 480,
    unit: "EA",
    centerId: "ICN",
    occurredAt: "04.15 13:47",
    statusStd: "입고완료",
    partner: "E커피 로스터리",
    trace: {
      sourceSystem: "A사 WMS v5.2 (API)",
      sourceRecordId: "GR-7730412 / L01",
      collectedAt: "2026-04-15 13:50:06",
      batchId: "B-260415-1350-ICN",
      dedupeKey: "ICN|GR|20260415|GR-7730412|L01",
      raw: [
        ["grNo", "GR-7730412"],
        ["lineNo", "L01"],
        ["sku", "SKU-0192"],
        ["skuName", "원두1KG_싱글오리진"],
        ["qty", "480"],
        ["uom", "EA"],
        ["status", "GR_DONE"],
        ["receivedAt", "2026-04-15T13:47:12+09:00"],
        ["supplier", "SUP-2211"],
      ],
      rules: [
        { code: "M-192", text: "SKU-0192 → LS-000192 상품코드 매핑" },
        { code: "S-ICN-01", text: "GR_DONE → 입고완료" },
      ],
      steps: [
        { label: "원천 발생", at: "13:47:12", detail: "이천 1센터 A사 WMS 입고 확정" },
        { label: "수집", at: "13:50:06", detail: "API 입고 실적 조회, 페이지 3/7" },
        { label: "정합성 검증", at: "13:50:07", detail: "식별키 중복 없음, 필수 필드 9/9" },
        { label: "표준화", at: "13:50:07", detail: "규칙 2건 적용, 매핑 규칙 v3.14" },
        { label: "통합 적재", at: "13:50:08", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418809",
    movement: "출고",
    std: "LS-004518",
    product: "설향 딸기 500g",
    qty: 1_260,
    unit: "PK",
    centerId: "YGN",
    occurredAt: "04.15 13:40",
    statusStd: "출고완료",
    partner: "F마트 수도권 물류",
    trace: {
      sourceSystem: "B사 WMS Cold 3 (DB)",
      sourceRecordId: "SHP-C-0415-2280 / 01",
      collectedAt: "2026-04-15 13:40:10",
      batchId: "B-260415-1340-YGN",
      dedupeKey: "YGN|GI|20260415|SHP-C-0415-2280|01",
      raw: [
        ["SHIP_ID", "SHP-C-0415-2280"],
        ["SEQ", "01"],
        ["PROD_CD", "P14518"],
        ["PROD_NM", "딸기(설향)500G"],
        ["SHIP_QTY", "1260"],
        ["UNIT", "팩"],
        ["TEMP_ZONE", "R2 (0~4℃)"],
        ["STATE", "SHIP_CMPL"],
        ["SHIP_DT", "20260415134011"],
      ],
      rules: [
        { code: "M-4518", text: "P14518 → LS-004518 (검토 중 매핑)" },
        { code: "U-02", text: "팩 → PK" },
        { code: "S-YGN-04", text: "SHIP_CMPL → 출고완료" },
        { code: "D-01", text: "yyyyMMddHHmmss → ISO 8601" },
      ],
      steps: [
        { label: "원천 발생", at: "13:40:11", detail: "용인 2센터 출하 확정, 냉장 R2 구역" },
        { label: "수집", at: "13:40:10", detail: "DB 출하 이력 증분 조회" },
        { label: "정합성 검증", at: "13:40:12", detail: "식별키 중복 없음, 필수 필드 9/9" },
        { label: "표준화", at: "13:40:12", detail: "규칙 4건, 매핑 신뢰도 86%" },
        { label: "통합 적재", at: "13:40:13", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418796",
    movement: "출고",
    std: "LS-000207",
    product: "베이직 코튼 반팔 티셔츠 L",
    qty: 318,
    unit: "EA",
    centerId: "SPA",
    occurredAt: "04.15 13:31",
    statusStd: "출고완료",
    partner: "자사몰 당일배송",
    trace: {
      sourceSystem: "C사 OMS 연동 WMS (API)",
      sourceRecordId: "ORD-2604-44802 외 317",
      collectedAt: "2026-04-15 13:34:40",
      batchId: "B-260415-1330-SPA",
      dedupeKey: "SPA|GI|20260415|WAVE-0415-13|C-207-WH-L",
      raw: [
        ["waveId", "WAVE-0415-13"],
        ["itemCode", "C-207-WH-L"],
        ["itemName", "코튼 반팔 T (L)"],
        ["pickedQty", "318"],
        ["uom", "EA"],
        ["state", "DISPATCHED"],
        ["dispatchedAt", "2026-04-15 13:31:55"],
      ],
      rules: [
        { code: "M-207", text: "C-207-WH-L → LS-000207" },
        { code: "S-SPA-03", text: "DISPATCHED → 출고완료" },
        { code: "A-11", text: "웨이브 단위 합산 레코드 분해 보존" },
      ],
      steps: [
        { label: "원천 발생", at: "13:31:55", detail: "송파 6센터 13시 웨이브 출고" },
        { label: "수집", at: "13:34:40", detail: "API 출고 실적 조회" },
        { label: "정합성 검증", at: "13:34:41", detail: "주문 318건 식별키 중복 없음" },
        { label: "표준화", at: "13:34:41", detail: "규칙 3건 적용" },
        { label: "통합 적재", at: "13:34:42", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418788",
    movement: "입고",
    std: "LS-001062",
    product: "무선 바코드 스캐너",
    qty: 40,
    unit: "EA",
    centerId: "CGK",
    occurredAt: "04.15 13:26",
    statusStd: "입고완료",
    partner: "G전자 유통",
    trace: {
      sourceSystem: "D사 작업관리 WES (API)",
      sourceRecordId: "ASN-90207 / 004",
      collectedAt: "2026-04-15 13:26:03",
      batchId: "B-260415-1326-CGK",
      dedupeKey: "CGK|GR|20260415|ASN-90207|004",
      raw: [
        ["asn", "ASN-90207"],
        ["line", "004"],
        ["item", "YN-001062-EA"],
        ["desc", "블루투스 바코드 스캐너"],
        ["qty", "40"],
        ["uom", "개"],
        ["st", "30"],
        ["ts", "1776227162"],
      ],
      rules: [
        { code: "M-1062", text: "YN-001062-EA → LS-001062" },
        { code: "U-01", text: "개 → EA" },
        { code: "S-CGK-01", text: "30 → 입고완료" },
        { code: "D-05", text: "UNIX epoch → ISO 8601" },
      ],
      steps: [
        { label: "원천 발생", at: "13:26:02", detail: "칠곡 4센터 WES 입고 검수 완료" },
        { label: "수집", at: "13:26:03", detail: "API 입고 이벤트 수신" },
        { label: "정합성 검증", at: "13:26:03", detail: "식별키 중복 없음" },
        { label: "표준화", at: "13:26:03", detail: "규칙 4건 적용" },
        { label: "통합 적재", at: "13:26:04", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418771",
    movement: "입고",
    std: "LS-004533",
    product: "손질 채소 믹스 300g",
    qty: 2_400,
    unit: "PK",
    centerId: "YGN",
    occurredAt: "04.15 13:12",
    statusStd: "입고완료",
    partner: "H농산 이천공장",
    trace: {
      sourceSystem: "B사 WMS Cold 3 (DB)",
      sourceRecordId: "RCV-0415-0322 / 01",
      collectedAt: "2026-04-15 13:20:04",
      batchId: "B-260415-1320-YGN",
      dedupeKey: "YGN|GR|20260415|RCV-0415-0322|01",
      raw: [
        ["RCV_ID", "RCV-0415-0322"],
        ["SEQ", "01"],
        ["PROD_CD", "P14533"],
        ["PROD_NM", "손질채소믹스300"],
        ["RCV_QTY", "2400"],
        ["UNIT", "팩"],
        ["STATE", "RCV_CMPL"],
      ],
      rules: [
        { code: "M-4533", text: "P14533 → LS-004533" },
        { code: "U-02", text: "팩 → PK" },
        { code: "S-YGN-01", text: "RCV_CMPL → 입고완료" },
      ],
      steps: [
        { label: "원천 발생", at: "13:12:30", detail: "용인 2센터 입고 확정" },
        { label: "수집", at: "13:20:04", detail: "DB 입고 이력 증분 조회" },
        { label: "정합성 검증", at: "13:20:05", detail: "식별키 중복 없음" },
        { label: "표준화", at: "13:20:05", detail: "규칙 3건 적용" },
        { label: "통합 적재", at: "13:20:06", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418760",
    movement: "출고",
    std: "LS-001062",
    product: "무선 바코드 스캐너",
    qty: 12,
    unit: "EA",
    centerId: "GMP",
    occurredAt: "04.15 12:58",
    statusStd: "출고완료",
    partner: "I항공 정비본부",
    trace: {
      sourceSystem: "A사 WMS v4.8 (API)",
      sourceRecordId: "GI-5520031 / L02",
      collectedAt: "2026-04-15 13:00:18",
      batchId: "B-260415-1300-GMP",
      dedupeKey: "GMP|GI|20260415|GI-5520031|L02",
      raw: [
        ["GiNo", "GI-5520031"],
        ["LineNo", "L02"],
        ["Sku", "SKU-1062"],
        ["Qty", "12"],
        ["Uom", "EA"],
        ["Status", "GI_SHIPPED"],
      ],
      rules: [
        { code: "M-1062", text: "SKU-1062 → LS-001062" },
        { code: "S-GMP-01", text: "GI_SHIPPED → 출고완료" },
      ],
      steps: [
        { label: "원천 발생", at: "12:58:40", detail: "김포 5센터 출고 확정" },
        { label: "수집", at: "13:00:18", detail: "API 출고 실적 조회" },
        { label: "정합성 검증", at: "13:00:19", detail: "식별키 중복 없음" },
        { label: "표준화", at: "13:00:19", detail: "규칙 2건 적용" },
        { label: "통합 적재", at: "13:00:20", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
  {
    id: "UT-2604-0418744",
    movement: "출고",
    std: "LS-000207",
    product: "베이직 코튼 반팔 티셔츠 L",
    qty: 1_150,
    unit: "EA",
    centerId: "ICN",
    occurredAt: "04.15 12:41",
    statusStd: "출고완료",
    partner: "J패션 오프라인 12개점",
    trace: {
      sourceSystem: "A사 WMS v5.2 (API)",
      sourceRecordId: "GI-4418790 / L01",
      collectedAt: "2026-04-15 12:45:05",
      batchId: "B-260415-1245-ICN",
      dedupeKey: "ICN|GI|20260415|GI-4418790|L01",
      raw: [
        ["giNo", "GI-4418790"],
        ["lineNo", "L01"],
        ["sku", "SKU-0207-L"],
        ["qty", "1150"],
        ["uom", "EA"],
        ["status", "GI_SHIPPED"],
      ],
      rules: [
        { code: "M-207", text: "SKU-0207-L → LS-000207" },
        { code: "S-ICN-02", text: "GI_SHIPPED → 출고완료" },
      ],
      steps: [
        { label: "원천 발생", at: "12:41:20", detail: "이천 1센터 매장 분배 출고" },
        { label: "수집", at: "12:45:05", detail: "API 출고 실적 조회" },
        { label: "정합성 검증", at: "12:45:06", detail: "식별키 중복 없음" },
        { label: "표준화", at: "12:45:06", detail: "규칙 2건 적용" },
        { label: "통합 적재", at: "12:45:07", detail: "LS-CDM v2.3 movement 테이블" },
      ],
    },
  },
];

export const INVENTORY: InventoryRow[] = [
  { std: "LS-000192", product: "싱글오리진 원두 1kg", centerId: "ICN", onHand: 3_912, safety: 1_500, delta: 456, unit: "EA", history: [3620, 3580, 3410, 3302, 3890, 3710, 3544, 3380, 3290, 3712, 3604, 3520, 3456, 3912] },
  { std: "LS-000192", product: "싱글오리진 원두 1kg", centerId: "PTK", onHand: 612, safety: 800, delta: -24, unit: "EA", anomaly: "안전재고 미달", history: [1480, 1402, 1350, 1288, 1190, 1102, 1040, 980, 910, 860, 790, 720, 636, 612] },
  { std: "LS-004518", product: "설향 딸기 500g", centerId: "YGN", onHand: 2_140, safety: 1_800, delta: -1_260, unit: "PK", history: [2980, 3410, 2820, 3100, 3380, 2760, 3040, 3220, 2890, 3150, 3300, 3010, 3400, 2140] },
  { std: "LS-004533", product: "손질 채소 믹스 300g", centerId: "YGN", onHand: -24, safety: 1_200, delta: 2_400, unit: "PK", anomaly: "음수 재고 수집", history: [1880, 1760, 1920, 1640, 1710, 1580, 1490, 1620, 1530, 1440, 1380, 1210, 1020, -24] },
  { std: "LS-000207", product: "베이직 코튼 반팔 티셔츠 L", centerId: "ICN", onHand: 8_420, safety: 3_000, delta: -1_150, unit: "EA", history: [10200, 10010, 9880, 9920, 9750, 9610, 9540, 9680, 9510, 9470, 9400, 9690, 9570, 8420] },
  { std: "LS-000207", product: "베이직 코튼 반팔 티셔츠 L", centerId: "SPA", onHand: 1_046, safety: 1_000, delta: -318, unit: "EA", anomaly: "안전재고 근접", history: [2100, 1980, 1860, 1920, 1750, 1640, 1590, 1520, 1480, 1400, 1520, 1440, 1364, 1046] },
  { std: "LS-001062", product: "무선 바코드 스캐너", centerId: "CGK", onHand: 188, safety: 60, delta: 40, unit: "EA", history: [140, 140, 138, 152, 150, 149, 149, 160, 158, 156, 150, 148, 148, 188] },
  { std: "LS-001062", product: "무선 바코드 스캐너", centerId: "GMP", onHand: 74, safety: 40, delta: -12, unit: "EA", anomaly: "47분간 미갱신", history: [98, 96, 96, 94, 92, 92, 90, 88, 88, 86, 86, 86, 86, 74] },
  { std: "LS-004518", product: "설향 딸기 500g", centerId: "SPA", onHand: 406, safety: 300, delta: -212, unit: "PK", history: [520, 610, 480, 560, 590, 470, 540, 600, 510, 580, 620, 540, 618, 406] },
];

export const STOCK_EVENTS: StockEvent[] = [
  { at: "13:52", centerId: "PTK", std: "LS-000192", kind: "출고", qty: -24, after: 612, ref: "OUT-55108" },
  { at: "13:47", centerId: "ICN", std: "LS-000192", kind: "입고", qty: 480, after: 3_912, ref: "GR-7730412" },
  { at: "13:40", centerId: "YGN", std: "LS-004518", kind: "출고", qty: -1_260, after: 2_140, ref: "SHP-C-0415-2280" },
  { at: "13:12", centerId: "YGN", std: "LS-004533", kind: "입고", qty: 2_400, after: -24, ref: "RCV-0415-0322" },
  { at: "11:05", centerId: "ICN", std: "LS-000192", kind: "이동", qty: -24, after: 3_432, ref: "TR-ICN-PTK-0415-02" },
  { at: "10:20", centerId: "YGN", std: "LS-004533", kind: "조정", qty: -2_424, after: -2_424, ref: "ADJ-C-0415-007" },
];

/* 통계: 최근 14일 일별 입고/출고 (단위: 천 건). 04.04~05, 04.11~12는 주말 */
export const DAILY = {
  labels: ["04.02", "04.03", "04.04", "04.05", "04.06", "04.07", "04.08", "04.09", "04.10", "04.11", "04.12", "04.13", "04.14", "04.15"],
  inbound: [61.4, 60.8, 42.1, 38.6, 62.9, 64.3, 63.1, 65.8, 66.2, 44.9, 40.2, 67.4, 66.1, 59.2],
  outbound: [66.8, 65.2, 51.7, 47.9, 68.4, 70.1, 69.6, 71.3, 72.8, 53.1, 49.4, 73.9, 72.2, 68.5],
};

export const WEEKLY = {
  labels: ["W09", "W10", "W11", "W12", "W13", "W14", "W15", "W16"],
  inbound: [382, 391, 377, 405, 412, 398, 420, 188],
  outbound: [431, 440, 426, 458, 466, 449, 475, 210],
};

/* 수행기간 안의 월만. 4월은 15일까지 */
export const MONTHLY = {
  labels: ["1월", "2월", "3월", "4월"],
  inbound: [1_688, 1_512, 1_764, 872],
  outbound: [1_893, 1_701, 1_982, 986],
};

/* 요일 × 시간대 물류량 히트맵 (0~100 상대값), 06시부터 22시까지 2시간 단위 */
export const HEAT_HOURS = ["06", "08", "10", "12", "14", "16", "18", "20", "22"];
export const HEAT_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
export const HEATMAP: number[][] = [
  [22, 58, 81, 74, 88, 92, 70, 44, 18],
  [20, 55, 78, 71, 84, 90, 66, 40, 16],
  [21, 57, 80, 73, 86, 95, 71, 43, 17],
  [19, 54, 76, 70, 83, 89, 64, 39, 15],
  [24, 61, 85, 78, 91, 97, 82, 58, 26],
  [12, 30, 46, 52, 55, 49, 38, 27, 11],
  [8, 18, 29, 34, 36, 33, 41, 35, 14],
];

export const TOP_PRODUCTS = [
  { std: "LS-000207", name: "베이직 코튼 반팔 티셔츠 L", inbound: 18_240, outbound: 21_904 },
  { std: "LS-004518", name: "설향 딸기 500g", inbound: 16_800, outbound: 16_512 },
  { std: "LS-004533", name: "손질 채소 믹스 300g", inbound: 14_400, outbound: 13_988 },
  { std: "LS-000192", name: "싱글오리진 원두 1kg", inbound: 9_120, outbound: 8_764 },
  { std: "LS-001062", name: "무선 바코드 스캐너", inbound: 640, outbound: 588 },
];

export const APIS: ApiEndpoint[] = [
  { id: "API-01", name: "입고 실적 수신", method: "POST", path: "/v2/ingest/receipts", group: "데이터 수신", calls24h: 48_210, lastCall: "14:35:52", p95: 84, errorRate: 0.2, status: "운영", consumer: "이천, 송파 WMS" },
  { id: "API-02", name: "출고 실적 수신", method: "POST", path: "/v2/ingest/issues", group: "데이터 수신", calls24h: 52_906, lastCall: "14:35:44", p95: 91, errorRate: 0.3, status: "운영", consumer: "이천, 송파 WMS" },
  { id: "API-03", name: "재고 스냅샷 수신", method: "PUT", path: "/v2/ingest/stock-snapshots", group: "데이터 수신", calls24h: 1_730, lastCall: "14:30:05", p95: 612, errorRate: 0.0, status: "운영", consumer: "이천, 용인" },
  { id: "API-04", name: "레거시 수신 게이트웨이", method: "POST", path: "/legacy/ingest/gmp", group: "데이터 수신", calls24h: 3_104, lastCall: "13:48:22", p95: 1_420, errorRate: 7.9, status: "오류", consumer: "김포 A사 WMS v4.8" },
  { id: "API-05", name: "통합 입출고 조회", method: "GET", path: "/v2/movements", group: "통합 조회", calls24h: 61_488, lastCall: "14:36:00", p95: 128, errorRate: 0.1, status: "운영", consumer: "본사 BI, 영업관리" },
  { id: "API-06", name: "통합 재고 조회", method: "GET", path: "/v2/inventory", group: "통합 조회", calls24h: 12_640, lastCall: "14:35:58", p95: 146, errorRate: 0.1, status: "운영", consumer: "자사몰 주문 시스템" },
  { id: "API-07", name: "원천 데이터 추적 조회", method: "GET", path: "/v2/movements/{id}/lineage", group: "통합 조회", calls24h: 1_902, lastCall: "14:31:17", p95: 204, errorRate: 0.0, status: "운영", consumer: "데이터운영팀" },
  { id: "API-08", name: "표준 상품 마스터 연계", method: "GET", path: "/v2/master/items", group: "기준정보 연계", calls24h: 2_214, lastCall: "14:20:00", p95: 96, errorRate: 0.0, status: "점검", consumer: "센터 WMS 6곳" },
  { id: "API-09", name: "센터 및 거래처 정보 연계", method: "GET", path: "/v2/master/sites", group: "기준정보 연계", calls24h: 188, lastCall: "14:00:00", p95: 71, errorRate: 0.0, status: "운영", consumer: "센터 WMS 6곳" },
  { id: "API-10", name: "ERP 전표 연동", method: "POST", path: "/v3/erp/journals", group: "외부 연동", calls24h: 0, lastCall: "미호출", p95: 0, errorRate: 0, status: "예정", consumer: "K사 ERP (연동 준비 중)" },
  { id: "API-11", name: "SCM 수요 계획 연동", method: "GET", path: "/v3/scm/forecast-feed", group: "외부 연동", calls24h: 0, lastCall: "미호출", p95: 0, errorRate: 0, status: "예정", consumer: "L사 SCM (요건 협의 중)" },
];

export const API_LOGS: ApiLog[] = [
  { at: "14:36:00.412", method: "GET", path: "/v2/movements?center=ALL&from=2026-04-15", client: "bi-dashboard", code: 200, ms: 118 },
  { at: "14:35:58.090", method: "GET", path: "/v2/inventory?std=LS-000207", client: "mall-order", code: 200, ms: 64 },
  { at: "14:35:52.771", method: "POST", path: "/v2/ingest/receipts", client: "wms-icn", code: 202, ms: 77 },
  { at: "14:35:44.305", method: "POST", path: "/v2/ingest/issues", client: "wms-icn", code: 202, ms: 83 },
  { at: "14:34:47.118", method: "POST", path: "/v2/ingest/receipts", client: "wms-spa", code: 409, ms: 21 },
  { at: "14:31:17.640", method: "GET", path: "/v2/movements/UT-2604-0418822/lineage", client: "ops-console", code: 200, ms: 188 },
  { at: "14:30:00.004", method: "POST", path: "/legacy/ingest/gmp", client: "wms-gmp", code: 401, ms: 402 },
];

export const API_KEYS = [
  { name: "wms-icn", owner: "이천 1센터", scope: "ingest:write", created: "2026.01.12", lastUsed: "8초 전" },
  { name: "bi-dashboard", owner: "본사 경영기획팀", scope: "movements:read", created: "2026.02.17", lastUsed: "방금" },
  { name: "mall-order", owner: "자사몰 개발팀", scope: "inventory:read", created: "2026.05.08", lastUsed: "2초 전" },
  { name: "wms-gmp", owner: "김포 5센터", scope: "ingest:write", created: "2026.01.05", lastUsed: "47분 전" },
];

export const INCIDENTS: Incident[] = [
  { id: "INC-0415-02", centerId: "GMP", level: "장애", title: "연계 인증서 만료, 수집 중단", startedAt: "13:48", duration: "47분", owner: "윤도경", state: "대응 중" },
  { id: "INC-0415-03", centerId: "PTK", level: "지연", title: "14:30 배치 파일 미도착", startedAt: "14:30", duration: "6분", owner: "서민재", state: "모니터링" },
  { id: "INC-0415-01", centerId: "YGN", level: "경고", title: "음수 재고 24건 수집, 격리 처리", startedAt: "14:20", duration: "16분", owner: "정하림", state: "모니터링" },
  { id: "INC-0414-07", centerId: "ICN", level: "지연", title: "원천 API 503 응답, 자동 재시도로 복구", startedAt: "04.14 22:10", duration: "4분", owner: "서민재", state: "해결" },
];

/* ── 물류비 자동 정산 ──
   계약(센터 × 거래처)마다 기준과 단가가 하나씩 있고, 월별 집계량만 달라진다.
   금액은 전부 `정산 대상 수량 × 적용 단가`로 계산해서 화면 숫자와 산식이 어긋나지 않게 한다. */

export const SETTLEMENT_PERIODS = [
  { key: "2026-01", label: "1월", range: "2026.01.01 ~ 01.31", scale: 0.93, confirmedAt: "2026.02.05" },
  { key: "2026-02", label: "2월", range: "2026.02.01 ~ 02.28", scale: 0.88, confirmedAt: "2026.03.05" },
  { key: "2026-03", label: "3월", range: "2026.03.01 ~ 03.31", scale: 1, confirmedAt: "2026.04.08" },
  { key: "2026-04", label: "4월", range: "2026.04.01 ~ 04.15 가집계", scale: 0.52, confirmedAt: undefined },
] as const;

type Contract = {
  code: string;
  centerId: CenterId;
  partner: string;
  basis: SettlementBasis;
  basisUnit: string;
  rate: number;
  basisTotal: number;
  countPerBasis: number;
  extras: { label: string; ratio: number }[];
  /** 3월 상태. 1~2월은 모두 확정, 4월은 모두 예정 */
  marchStatus: SettlementStatus;
  samples: { movement: "입고" | "출고"; product: string; qty: number; unit: string; weightKg: number }[];
};

const CONTRACTS: Contract[] = [
  {
    code: "ICN-J",
    centerId: "ICN",
    partner: "J패션 오프라인 12개점",
    basis: "수량",
    basisUnit: "EA",
    rate: 185,
    basisTotal: 48_260,
    countPerBasis: 0.0645,
    extras: [{ label: "합포장 추가 작업", ratio: 0.0685 }],
    marchStatus: "확정",
    samples: [
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 1_150, unit: "EA", weightKg: 322 },
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 860, unit: "EA", weightKg: 241 },
      { movement: "출고", product: "무선 바코드 스캐너", qty: 24, unit: "EA", weightKg: 19 },
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 1_020, unit: "EA", weightKg: 286 },
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 740, unit: "EA", weightKg: 207 },
    ],
  },
  {
    code: "YGN-F",
    centerId: "YGN",
    partner: "F마트 수도권 물류",
    basis: "중량",
    basisUnit: "kg",
    rate: 92,
    basisTotal: 126_400,
    countPerBasis: 0.01747,
    extras: [{ label: "냉장 보관 할증 15%", ratio: 0.15 }],
    marchStatus: "검토",
    samples: [
      { movement: "출고", product: "설향 딸기 500g", qty: 1_260, unit: "PK", weightKg: 693 },
      { movement: "출고", product: "손질 채소 믹스 300g", qty: 2_100, unit: "PK", weightKg: 693 },
      { movement: "출고", product: "설향 딸기 500g", qty: 980, unit: "PK", weightKg: 539 },
      { movement: "출고", product: "손질 채소 믹스 300g", qty: 1_640, unit: "PK", weightKg: 541 },
      { movement: "출고", product: "설향 딸기 500g", qty: 1_420, unit: "PK", weightKg: 781 },
    ],
  },
  {
    code: "PTK-D",
    centerId: "PTK",
    partner: "D유통 부산점",
    basis: "운송 건수",
    basisUnit: "건",
    rate: 38_500,
    basisTotal: 412,
    countPerBasis: 1,
    extras: [{ label: "상하차 대기 시간 추가", ratio: 0.0243 }],
    marchStatus: "검토",
    samples: [
      { movement: "출고", product: "싱글오리진 원두 1kg", qty: 24, unit: "EA", weightKg: 26 },
      { movement: "출고", product: "싱글오리진 원두 1kg", qty: 480, unit: "EA", weightKg: 504 },
      { movement: "출고", product: "골판지 박스 3호", qty: 1_200, unit: "BX", weightKg: 312 },
      { movement: "출고", product: "싱글오리진 원두 1kg", qty: 360, unit: "EA", weightKg: 378 },
      { movement: "출고", product: "싱글오리진 원두 1kg", qty: 120, unit: "EA", weightKg: 126 },
    ],
  },
  {
    code: "CGK-G",
    centerId: "CGK",
    partner: "G전자 유통",
    basis: "수량",
    basisUnit: "EA",
    rate: 240,
    basisTotal: 9_840,
    countPerBasis: 0.1043,
    extras: [],
    marchStatus: "확정",
    samples: [
      { movement: "입고", product: "무선 바코드 스캐너", qty: 40, unit: "EA", weightKg: 32 },
      { movement: "입고", product: "무선 바코드 스캐너", qty: 120, unit: "EA", weightKg: 96 },
      { movement: "출고", product: "무선 바코드 스캐너", qty: 64, unit: "EA", weightKg: 51 },
      { movement: "입고", product: "무선 바코드 스캐너", qty: 200, unit: "EA", weightKg: 160 },
      { movement: "출고", product: "무선 바코드 스캐너", qty: 36, unit: "EA", weightKg: 29 },
    ],
  },
  {
    code: "SPA-M",
    centerId: "SPA",
    partner: "자사몰 당일배송",
    basis: "운송 건수",
    basisUnit: "건",
    rate: 3_200,
    basisTotal: 38_915,
    countPerBasis: 1,
    extras: [{ label: "야간 배송 할증", ratio: 0.025 }],
    marchStatus: "검토",
    samples: [
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 2, unit: "EA", weightKg: 1 },
      { movement: "출고", product: "설향 딸기 500g", qty: 3, unit: "PK", weightKg: 2 },
      { movement: "출고", product: "손질 채소 믹스 300g", qty: 4, unit: "PK", weightKg: 1 },
      { movement: "출고", product: "베이직 코튼 반팔 티셔츠 L", qty: 1, unit: "EA", weightKg: 1 },
      { movement: "출고", product: "설향 딸기 500g", qty: 2, unit: "PK", weightKg: 1 },
    ],
  },
  {
    code: "GMP-I",
    centerId: "GMP",
    partner: "I항공 정비본부",
    basis: "중량",
    basisUnit: "kg",
    rate: 310,
    basisTotal: 18_720,
    countPerBasis: 0.03654,
    extras: [{ label: "보안 검색 대행", ratio: 0.0806 }],
    marchStatus: "검토",
    samples: [
      { movement: "출고", product: "무선 바코드 스캐너", qty: 12, unit: "EA", weightKg: 10 },
      { movement: "입고", product: "무선 바코드 스캐너", qty: 60, unit: "EA", weightKg: 48 },
      { movement: "출고", product: "무선 바코드 스캐너", qty: 30, unit: "EA", weightKg: 24 },
      { movement: "출고", product: "무선 바코드 스캐너", qty: 18, unit: "EA", weightKg: 15 },
      { movement: "입고", product: "무선 바코드 스캐너", qty: 90, unit: "EA", weightKg: 72 },
    ],
  },
];

const SAMPLE_DAYS = ["28", "24", "19", "12", "05"];
const APRIL_DAYS = ["15", "13", "10", "07", "02"];
const SAMPLE_TIMES = ["16:42:10", "11:05:37", "14:20:58", "09:48:03", "13:31:24"];

function buildSettlement(c: Contract, periodIndex: number): Settlement {
  const period = SETTLEMENT_PERIODS[periodIndex];
  const month = period.key.slice(5);
  const basisTotal = Math.round(c.basisTotal * period.scale);
  const base = basisTotal * c.rate;
  const extras = c.extras.map((e) => ({ label: e.label, amount: Math.round((base * e.ratio) / 10) * 10 }));
  const status: SettlementStatus = periodIndex < 2 ? "확정" : periodIndex === 2 ? c.marchStatus : "예정";
  const days = periodIndex === 3 ? APRIL_DAYS : SAMPLE_DAYS;
  const lines = c.samples.map((l, i) => {
    const basisValue = c.basis === "수량" ? l.qty : c.basis === "중량" ? l.weightKg : 1;
    return {
      unifiedId: `UT-26${month}-${String(3_100_000 + periodIndex * 97_000 + (CONTRACTS.indexOf(c) + 1) * 1_000 + i * 37).padStart(7, "0")}`,
      movement: l.movement,
      product: l.product,
      qty: l.qty,
      unit: l.unit,
      weightKg: l.weightKg,
      collectedAt: `${month}.${days[i]} ${SAMPLE_TIMES[i]}`,
      basisValue,
      amount: basisValue * c.rate,
    };
  });
  return {
    id: `ST-${period.key.replace("-", "")}-${c.code}`,
    period: period.key,
    centerId: c.centerId,
    partner: c.partner,
    basis: c.basis,
    basisUnit: c.basisUnit,
    rate: c.rate,
    basisTotal,
    base,
    extras,
    count: Math.round(basisTotal * c.countPerBasis),
    status,
    confirmedAt: status === "확정" ? period.confirmedAt : undefined,
    lines,
  };
}

export const SETTLEMENTS: Settlement[] = SETTLEMENT_PERIODS.flatMap((_, pi) => CONTRACTS.map((c) => buildSettlement(c, pi)));

export const RATE_CARD = CONTRACTS.map((c) => ({
  centerId: c.centerId,
  partner: c.partner,
  basis: c.basis,
  basisUnit: c.basisUnit,
  rate: c.rate,
  extras: c.extras.map((e) => e.label),
  appliedFrom: "2026.01.01",
}));
