import type { LinkStatus, Tone } from "@/projects/b2b/logisync/lib/types";

export type View =
  | "ingest"
  | "monitor"
  | "verify"
  | "standardize"
  | "unified"
  | "settlement"
  | "inventory"
  | "analytics"
  | "api";

export type SectionKey = "ingest" | "verify" | "unify" | "serve";

export type Section = {
  key: SectionKey;
  step: string;
  code: string;
  label: string;
  icon: string;
  views: { key: View; label: string; hint: string }[];
  summary: { label: string; value: string; sub: string; tone: Tone };
};

/* 섹션 = 파이프라인 단계. 데이터가 흐르는 순서대로 위에서 아래로 놓는다. */
export const SECTIONS: Section[] = [
  {
    key: "ingest",
    step: "01",
    code: "INGEST",
    label: "수집",
    icon: "solar:server-path-linear",
    views: [
      { key: "ingest", label: "데이터 수집 및 연계", hint: "센터별 연계, 수집 주기" },
      { key: "monitor", label: "수집 상태 모니터링", hint: "지연, 장애 상태 보드" },
    ],
    summary: { label: "연결 센터 (곳)", value: "6", sub: "지연 1 | 장애 1", tone: "danger" },
  },
  {
    key: "verify",
    step: "02",
    code: "VERIFY",
    label: "검증",
    icon: "solar:shield-check-linear",
    views: [{ key: "verify", label: "정합성 및 중복 관리", hint: "중복, 누락, 오류 분류" }],
    summary: { label: "재처리 대기 (건)", value: "128", sub: "오늘 격리 375건", tone: "warn" },
  },
  {
    key: "unify",
    step: "03",
    code: "UNIFY",
    label: "통합",
    icon: "solar:layers-minimalistic-linear",
    views: [
      { key: "standardize", label: "데이터 표준화 및 통합", hint: "상품코드, 단위, 상태값" },
      { key: "unified", label: "통합 물류 데이터", hint: "통합 조회와 원천 데이터 추적" },
      { key: "settlement", label: "물류비 자동 정산", hint: "단가 적용, 정산 내역" },
      { key: "inventory", label: "재고 현황 관리", hint: "센터별, 상품별 재고" },
    ],
    summary: { label: "매핑 규칙", value: "v3.14", sub: "미매핑 17건 보류", tone: "neutral" },
  },
  {
    key: "serve",
    step: "04",
    code: "SERVE",
    label: "활용",
    icon: "solar:chart-square-linear",
    views: [
      { key: "analytics", label: "통합 조회 및 통계", hint: "일별, 센터별, 시간대별" },
      { key: "api", label: "데이터 연계 API", hint: "수신, 조회, 외부 연동" },
    ],
    summary: { label: "오늘 API 호출 (건)", value: "184,382", sub: "오류율 0.31%", tone: "neutral" },
  },
];

export const VIEWS = SECTIONS.flatMap((s) => s.views.map((v) => v.key));

export function sectionOf(view: View): Section {
  return SECTIONS.find((s) => s.views.some((v) => v.key === view)) ?? SECTIONS[0];
}

export function viewLabel(view: View) {
  return sectionOf(view).views.find((v) => v.key === view)?.label ?? "";
}

export const LINK_TONE: Record<LinkStatus, Tone> = { 정상: "ok", 지연: "warn", 장애: "danger" };

export function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}
