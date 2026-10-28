import type { LicenseLog } from "@/projects/platform/eduon/lib/types";

/*
 * 관리자 보안 및 운영 검증 화면의 샘플 기록 (spec 8번).
 * 실제 데이터 반출, 권한 변경, 복구 작업은 없다. 화면에는 "샘플 기록" 표시를 둔다.
 * 사람: 서윤하(최고관리자), 남궁현(콘텐츠 운영자)은 mock-data.ts와 같다. 나머지는 이 파일에서만 쓴다.
 */

export type AdminRole = "operator" | "super";

export const ROLE_LABEL: Record<AdminRole, string> = { operator: "콘텐츠 운영자", super: "최고관리자" };
export const ROLE_PERSON: Record<AdminRole, string> = { operator: "남궁현", super: "서윤하" };

/* 역할별 접근 범위 */
export type Grant = "허용" | "조회만" | "차단" | "이중 승인";

export const ROLE_MATRIX: Array<{ area: string; operator: Grant; super: Grant }> = [
  { area: "콘텐츠 검수, 공개", operator: "허용", super: "허용" },
  { area: "이용 설정 (무료 공개, 미리보기)", operator: "허용", super: "허용" },
  { area: "영상 처리 재시도", operator: "허용", super: "허용" },
  { area: "구독 목록, 결제 이벤트", operator: "차단", super: "허용" },
  { area: "결제 이벤트 재처리", operator: "차단", super: "허용" },
  { area: "회원 개인정보 원문", operator: "차단", super: "조회만" },
  { area: "개인정보 대량 반출", operator: "차단", super: "이중 승인" },
  { area: "관리자 권한 변경", operator: "차단", super: "이중 승인" },
  { area: "보안 기록, 복구 시험", operator: "차단", super: "허용" },
];

/* 고위험 요청. 승인권자는 서로 다른 두 사람이어야 한다 */
export type ApprovalState = "승인" | "대기" | "반려";

export interface HighRiskRequest {
  id: string;
  kind: "개인정보 대량 반출" | "핵심 권한 변경";
  title: string;
  requester: string;
  requestedAt: string;
  reason: string;
  approvals: Array<{ name: string; role: string; state: ApprovalState; at?: string; note?: string }>;
  status: "이중 승인 대기" | "승인 완료" | "반려";
}

export const HIGH_RISK_REQUESTS: HighRiskRequest[] = [
  {
    id: "HR-2610-07",
    kind: "개인정보 대량 반출",
    title: "10월 갱신 해지 회원 연락처 2,317건",
    requester: "맹수안 | 고객지원팀",
    requestedAt: "2026. 10. 28 16:53",
    reason: "해지 사유 설문 발송, 마스킹 해제 필요 항목: 이메일",
    approvals: [
      { name: "서윤하", role: "최고관리자", state: "승인", at: "2026. 10. 28 17:42" },
      { name: "육태건", role: "개인정보 보호책임자", state: "대기" },
    ],
    status: "이중 승인 대기",
  },
  {
    id: "HR-2610-05",
    kind: "핵심 권한 변경",
    title: "남궁현 계정에 결제 이벤트 조회 권한 추가",
    requester: "남궁현 | 콘텐츠 운영",
    requestedAt: "2026. 10. 24 09:37",
    reason: "환불 문의 응대 시 결제 이벤트 확인 필요",
    approvals: [
      { name: "서윤하", role: "최고관리자", state: "승인", at: "2026. 10. 24 11:26" },
      { name: "육태건", role: "개인정보 보호책임자", state: "반려", at: "2026. 10. 24 15:08", note: "조회 범위 축소 후 재요청" },
    ],
    status: "반려",
  },
  {
    id: "HR-2610-02",
    kind: "핵심 권한 변경",
    title: "D소프트 점검 계정 기간 7일 연장",
    requester: "변우경 | 플랫폼 개발",
    requestedAt: "2026. 10. 21 14:12",
    reason: "결제 알림 중복 수신 원인 분석 계속",
    approvals: [
      { name: "서윤하", role: "최고관리자", state: "승인", at: "2026. 10. 21 15:03" },
      { name: "육태건", role: "개인정보 보호책임자", state: "승인", at: "2026. 10. 21 16:48" },
    ],
    status: "승인 완료",
  },
];

/* 개발사 접근 */
export interface VendorAccess {
  id: string;
  company: string;
  account: string;
  purpose: string;
  scope: string;
  start: string;
  end: string;
  status: "사용 중" | "만료" | "회수";
  closedNote?: string;
}

export const VENDOR_ACCESS: VendorAccess[] = [
  {
    id: "VA-118",
    company: "D소프트",
    account: "vendor_dsoft_02",
    purpose: "결제 알림 중복 수신 분석",
    scope: "결제 이벤트 로그 조회, 개인정보 마스킹",
    start: "2026. 10. 21",
    end: "2026. 11. 04",
    status: "사용 중",
  },
  {
    id: "VA-114",
    company: "E시스템",
    account: "vendor_esys_01",
    purpose: "재생 보호 라이선스 연동 점검",
    scope: "라이선스 요청 기록 조회",
    start: "2026. 10. 07",
    end: "2026. 10. 21",
    status: "만료",
    closedNote: "기간 종료 자동 만료 2026. 10. 21 23:59",
  },
  {
    id: "VA-109",
    company: "F네트웍스",
    account: "vendor_fnet_03",
    purpose: "영상 전송 캐시 설정 점검",
    scope: "영상 처리 설정 조회",
    start: "2026. 10. 02",
    end: "2026. 10. 23",
    status: "회수",
    closedNote: "작업 조기 종료로 서윤하 회수 2026. 10. 17 18:26",
  },
];

/* 접근 기록 */
export interface AccessLogEntry {
  id: string;
  at: string;
  actor: string;
  actorRole: string;
  target: string;
  action: string;
  result: "허용" | "차단" | "승인 대기";
}

export const ACCESS_LOGS: AccessLogEntry[] = [
  { id: "AL-90417", at: "2026. 10. 28 19:47", actor: "남궁현", actorRole: "콘텐츠 운영자", target: "구독 목록", action: "화면 조회", result: "차단" },
  { id: "AL-90412", at: "2026. 10. 28 18:33", actor: "vendor_dsoft_02", actorRole: "D소프트", target: "결제 이벤트 로그", action: "기록 조회", result: "허용" },
  { id: "AL-90405", at: "2026. 10. 28 17:42", actor: "서윤하", actorRole: "최고관리자", target: "HR-2610-07 반출 요청", action: "1차 승인", result: "승인 대기" },
  { id: "AL-90398", at: "2026. 10. 28 16:53", actor: "맹수안", actorRole: "고객지원팀", target: "갱신 해지 회원 연락처", action: "반출 요청", result: "승인 대기" },
  { id: "AL-90371", at: "2026. 10. 28 11:06", actor: "남궁현", actorRole: "콘텐츠 운영자", target: "SQL로 시작하는 데이터 조회", action: "보완 요청", result: "허용" },
  { id: "AL-90352", at: "2026. 10. 27 22:19", actor: "vendor_esys_01", actorRole: "E시스템", target: "라이선스 요청 기록", action: "기록 조회", result: "차단" },
  { id: "AL-90344", at: "2026. 10. 27 15:38", actor: "남궁현", actorRole: "콘텐츠 운영자", target: "회원 정다빈 연락처", action: "원문 조회", result: "차단" },
  { id: "AL-90329", at: "2026. 10. 27 10:46", actor: "남궁현", actorRole: "콘텐츠 운영자", target: "노코드로 만드는 랜딩 페이지", action: "승인", result: "허용" },
  { id: "AL-90311", at: "2026. 10. 26 13:52", actor: "서윤하", actorRole: "최고관리자", target: "SUB-40688 결제 이벤트", action: "재확인", result: "허용" },
  { id: "AL-90287", at: "2026. 10. 25 09:14", actor: "탕지원", actorRole: "정산 담당", target: "보안 기록", action: "화면 조회", result: "차단" },
  { id: "AL-90263", at: "2026. 10. 24 15:08", actor: "육태건", actorRole: "개인정보 보호책임자", target: "HR-2610-05 권한 변경", action: "2차 승인 반려", result: "허용" },
  { id: "AL-90240", at: "2026. 10. 23 20:31", actor: "서윤하", actorRole: "최고관리자", target: "생성형 AI 저작권 기초", action: "게시 중단 사유 수정", result: "허용" },
];

/* 보안 점검 항목: 발견 → 수정 → 재검증 → 종료 */
export const FINDING_STAGES = ["발견", "수정", "재검증", "종료"] as const;
export type FindingStage = (typeof FINDING_STAGES)[number];

export interface SecurityFinding {
  id: string;
  item: string;
  severity: "높음" | "중간" | "낮음";
  owner: string;
  stage: FindingStage;
  source: "자체 시험" | "외부 검증";
  /** 단계별 기록 시각. 아직 오지 않은 단계는 없다 */
  dates: Partial<Record<FindingStage, string>>;
  action: string;
}

export const SECURITY_FINDINGS: SecurityFinding[] = [
  {
    id: "SF-0931",
    item: "임시 재생 주소 만료 후 재사용 가능",
    severity: "높음",
    owner: "변우경",
    stage: "재검증",
    source: "외부 검증",
    dates: { 발견: "2026. 10. 13 14:22", 수정: "2026. 10. 19 18:05", 재검증: "2026. 10. 27 10:31" },
    action: "주소 서명에 만료 시각 포함, 서버에서 120초 경과 요청 거부",
  },
  {
    id: "SF-0928",
    item: "콘텐츠 운영자가 구독 목록 API 직접 호출 가능",
    severity: "높음",
    owner: "변우경",
    stage: "종료",
    source: "자체 시험",
    dates: { 발견: "2026. 10. 08 11:47", 수정: "2026. 10. 10 16:20", 재검증: "2026. 10. 14 09:53", 종료: "2026. 10. 15 13:18" },
    action: "화면 메뉴 숨김 외에 API 단에서 역할 확인 추가",
  },
  {
    id: "SF-0935",
    item: "관리자 세션 30분 무활동 시 만료 미적용",
    severity: "중간",
    owner: "봉지안",
    stage: "수정",
    source: "자체 시험",
    dates: { 발견: "2026. 10. 22 15:36", 수정: "2026. 10. 26 17:44" },
    action: "무활동 타이머와 재인증 화면 추가 중",
  },
  {
    id: "SF-0937",
    item: "결제 알림 서명 검증 실패 시 재시도 횟수 무제한",
    severity: "중간",
    owner: "변우경",
    stage: "발견",
    source: "외부 검증",
    dates: { 발견: "2026. 10. 27 19:08" },
    action: "재시도 상한과 수동 재확인 큐 설계",
  },
  {
    id: "SF-0924",
    item: "오류 화면에 내부 서버 경로 노출",
    severity: "낮음",
    owner: "봉지안",
    stage: "종료",
    source: "외부 검증",
    dates: { 발견: "2026. 10. 02 10:12", 수정: "2026. 10. 03 15:49", 재검증: "2026. 10. 07 11:26", 종료: "2026. 10. 07 16:02" },
    action: "공통 오류 응답으로 교체",
  },
  {
    id: "SF-0933",
    item: "접근 기록 보관 기간 90일 미만 설정",
    severity: "낮음",
    owner: "탕지원",
    stage: "재검증",
    source: "자체 시험",
    dates: { 발견: "2026. 10. 16 09:27", 수정: "2026. 10. 20 14:51", 재검증: "2026. 10. 28 11:13" },
    action: "보관 기간 1년으로 변경, 삭제 배치 확인",
  },
];

/* 백업 상태 */
export interface BackupStatus {
  target: string;
  schedule: string;
  lastAt: string;
  result: "성공" | "지연" | "실패";
  retention: string;
}

export const BACKUPS: BackupStatus[] = [
  { target: "회원, 구독 DB", schedule: "1시간마다 증분", lastAt: "2026. 10. 28 20:03", result: "성공", retention: "35일" },
  { target: "콘텐츠 메타데이터", schedule: "1일 1회 전체", lastAt: "2026. 10. 28 03:17", result: "성공", retention: "90일" },
  { target: "영상 원본 저장소", schedule: "업로드 시 복제", lastAt: "2026. 10. 28 19:41", result: "지연", retention: "영구" },
  { target: "접근 기록", schedule: "1일 1회 전체", lastAt: "2026. 10. 28 03:29", result: "성공", retention: "1년" },
];

/* 복구 시험. 목표와 측정은 분 단위 */
export interface RecoveryTest {
  id: string;
  target: string;
  testedAt: string;
  rtoTarget: number;
  rtoMeasured: number;
  rpoTarget: number;
  rpoMeasured: number;
  owner: string;
}

export const RECOVERY_TESTS: RecoveryTest[] = [
  { id: "RT-2610-B", target: "회원, 구독 DB", testedAt: "2026. 10. 24 02:13", rtoTarget: 60, rtoMeasured: 47, rpoTarget: 60, rpoMeasured: 38, owner: "봉지안" },
  { id: "RT-2610-A", target: "콘텐츠 메타데이터", testedAt: "2026. 10. 17 01:52", rtoTarget: 120, rtoMeasured: 83, rpoTarget: 1440, rpoMeasured: 1107, owner: "봉지안" },
  { id: "RT-2609-C", target: "영상 원본 저장소", testedAt: "2026. 09. 26 02:41", rtoTarget: 240, rtoMeasured: 293, rpoTarget: 60, rpoMeasured: 22, owner: "변우경" },
];

/* 재생 보호 탭의 라이선스 요청 실패 기록. 강좌 기본 기록(성공)에 더해 보여 준다 */
export const LICENSE_FAILURES: Record<string, LicenseLog[]> = {
  c01: [
    { at: "2026. 10. 28 18:47", result: "실패", code: "LIC-403-DEVICE", env: "Firefox 131 | Linux" },
    { at: "2026. 10. 28 17:06", result: "실패", code: "LIC-408-TIMEOUT", env: "Edge 130 | Windows" },
  ],
  c04: [{ at: "2026. 10. 28 16:22", result: "실패", code: "LIC-401-EXPIRED", env: "Chrome 129 | Android" }],
  c09: [{ at: "2026. 10. 27 23:38", result: "실패", code: "LIC-408-TIMEOUT", env: "Safari 18 | iOS" }],
};

export const LICENSE_CODE_LABEL: Record<string, string> = {
  "LIC-403-DEVICE": "미지원 환경",
  "LIC-408-TIMEOUT": "응답 시간 초과, 재시도 후 성공",
  "LIC-401-EXPIRED": "재생 권한 만료",
};
