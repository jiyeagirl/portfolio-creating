// 상태 어휘. 사용자 웹과 관리자 웹이 같은 라벨, 같은 톤을 쓴다 (spec Key Focus 마지막 항목).

export type Tone = "wait" | "run" | "act" | "done" | "stop";

/** 신고 단계. 사용자 타임라인 순서이기도 하다 (반려는 타임라인 밖) */
export type FilingStage = "접수" | "검토 중" | "보완 요청" | "신고서 확정" | "제출 중" | "접수 완료" | "반려";

export const FILING_FLOW: FilingStage[] = ["접수", "검토 중", "보완 요청", "신고서 확정", "제출 중", "접수 완료"];

export const FILING_TONE: Record<FilingStage, Tone> = {
  접수: "wait",
  "검토 중": "run",
  "보완 요청": "act",
  "신고서 확정": "done",
  "제출 중": "run",
  "접수 완료": "done",
  반려: "stop",
};

export type PaymentState = "결제 완료" | "입금 대기" | "기한 임박" | "기한 경과" | "결제 실패" | "환불";

export const PAYMENT_TONE: Record<PaymentState, Tone> = {
  "결제 완료": "done",
  "입금 대기": "wait",
  "기한 임박": "act",
  "기한 경과": "stop",
  "결제 실패": "stop",
  환불: "stop",
};

export type JobState = "실행 전" | "진행 중" | "인증 대기" | "접수 완료" | "실패";

export const JOB_TONE: Record<JobState, Tone> = {
  "실행 전": "wait",
  "진행 중": "run",
  "인증 대기": "act",
  "접수 완료": "done",
  실패: "stop",
};

export type EvidenceState = "미제출" | "제출" | "읽기 오류" | "보완 요청";

export const EVIDENCE_TONE: Record<EvidenceState, Tone> = {
  미제출: "wait",
  제출: "done",
  "읽기 오류": "stop",
  "보완 요청": "act",
};

/** 자동화 모드. 상태 칩과 다른 모양(테두리만)으로 그린다 */
export type JobMode = "자동" | "대기";

/** 홈택스 자동 신고 8단계 */
export const JOB_STEPS = [
  "신고 데이터 생성",
  "홈택스 로그인",
  "신고 메뉴 이동",
  "항목 입력",
  "부속서류 첨부",
  "인증",
  "제출",
  "접수번호 수신",
] as const;

export type FailReason = "입력 오류" | "첨부 실패" | "세션 만료" | "인증 실패" | "결과 미확인";
