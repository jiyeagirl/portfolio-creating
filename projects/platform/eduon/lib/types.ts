export type Topic = "AI" | "디자인" | "개발";
export type Level = "입문" | "중급" | "실무";

/* 검수 상태와 공개 상태는 따로 간다 (spec 6번). 작성 중은 스튜디오에서만 보인다 */
export type ReviewStatus = "작성 중" | "검수 대기" | "보완 요청" | "승인" | "반려";
export type PublishStatus = "비공개" | "공개" | "게시 중단";
export type TranscodeStatus = "대기" | "변환 중" | "완료" | "실패";
export type Quality = "1080p" | "720p" | "480p";

export interface Episode {
  no: number;
  title: string;
  /** 초 단위 길이 */
  seconds: number;
}

export interface AccessSetting {
  /** 강좌 전체 무료 공개 */
  free: boolean;
  /** 미리보기 회차 번호 */
  previewEpisodes: number[];
  /** 구독 대상 여부 */
  subscription: boolean;
}

export interface ReviewEntry {
  at: string;
  who: string;
  action: string;
  note?: string;
  version: number;
}

export interface LicenseLog {
  at: string;
  result: "성공" | "실패";
  code?: string;
  env: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  producer: string;
  topic: Topic;
  level: Level;
  summary: string;
  /** 썸네일 URL(assets, lib/thumbs.ts) 또는 picsum 고정 id. null이면 타이틀 타일 */
  photo: string | number | null;
  episodes: Episode[];
  series: string;
  productionMethod: string;
  tools: string[];
  subtitles: string[];
  rightsFiles: string[];
  addedAt: string;
  submittedAt: string;
  review: ReviewStatus;
  publish: PublishStatus;
  transcode: TranscodeStatus;
  outputs: Record<Quality, TranscodeStatus>;
  transcodeNote?: string;
  access: AccessSetting;
  version: number;
  reviewLog: ReviewEntry[];
  /** 운영자 보완 요청 의견 (최근 것) */
  revisionNote?: string;
  drm: "적용" | "미적용";
  licenseLog: LicenseLog[];
  learners: number;
}

export type SubStatus = "free" | "active" | "cancelled" | "failed" | "expired" | "refunded";
export type Channel = "web" | "ios" | "android";

export interface BillingRecord {
  id: string;
  at: string;
  kind: "최초 결제" | "정기 갱신" | "갱신 해지" | "갱신 실패" | "만료" | "환불" | "구매 복원";
  channel: Channel;
  amount: number | null;
  result: string;
}

export interface MySubscription {
  status: SubStatus;
  channel: Channel | null;
  startedAt: string | null;
  /** 활성이면 다음 갱신 예정일, 해지면 이용 종료일, 만료면 만료일 */
  periodEnd: string | null;
  history: BillingRecord[];
}

export type Entitlement = "반영 완료" | "확인 필요" | "반영 중" | "회수 완료";

export interface EntitlementLog {
  at: string;
  change: string;
  by: string;
}

export interface AdminSubscription {
  id: string;
  name: string;
  email: string;
  channel: Channel;
  status: Exclude<SubStatus, "free">;
  periodStart: string;
  periodEnd: string;
  entitlement: Entitlement;
  history: BillingRecord[];
  entitlementLog: EntitlementLog[];
  restore?: string;
  /** 사용자 화면의 "나"와 연결된 행 */
  isMe?: boolean;
}

export type EventType = "최초 결제" | "정기 갱신" | "갱신 실패" | "갱신 해지" | "만료" | "환불" | "구매 복원";
export type EventVerify = "통과" | "실패" | "중복";
export type EventResult = "처리 완료" | "중복 수신, 추가 처리 없음" | "재확인 필요" | "재처리 완료";

export interface PaymentEvent {
  id: string;
  receivedAt: string;
  channel: Channel;
  type: EventType;
  verify: EventVerify;
  result: EventResult;
  subId: string;
  detail: string;
}

export interface Progress {
  episode: number;
  seconds: number;
  at: string;
}

export interface Comment {
  id: string;
  name: string;
  at: string;
  body: string;
  episode: number;
}
