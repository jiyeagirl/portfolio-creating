import type { IconName } from "@/projects/b2b/logisync/lib/icons";
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
  label: string;
  icon: IconName;
  views: { key: View; label: string; icon: IconName }[];
};

/* 섹션 = 파이프라인 단계. 데이터가 흐르는 순서대로 위에서 아래로 놓는다. */
export const SECTIONS: Section[] = [
  {
    key: "ingest",
    step: "01",
    label: "수집",
    icon: "hard-drives",
    views: [
      { key: "ingest", label: "데이터 수집 및 연계", icon: "hard-drives" },
      { key: "monitor", label: "수집 상태 모니터링", icon: "monitor" },
    ],
  },
  {
    key: "verify",
    step: "02",
    label: "검증",
    icon: "shield-check",
    views: [{ key: "verify", label: "정합성 및 중복 관리", icon: "shield-check" }],
  },
  {
    key: "unify",
    step: "03",
    label: "통합",
    icon: "stack",
    views: [
      { key: "standardize", label: "데이터 표준화 및 통합", icon: "arrows-left-right" },
      { key: "unified", label: "통합 물류 데이터", icon: "stack" },
      { key: "settlement", label: "물류비 자동 정산", icon: "calculator" },
      { key: "inventory", label: "재고 현황 관리", icon: "package" },
    ],
  },
  {
    key: "serve",
    step: "04",
    label: "활용",
    icon: "chart-bar",
    views: [
      { key: "analytics", label: "통합 조회 및 통계", icon: "chart-bar" },
      { key: "api", label: "데이터 연계 API", icon: "code" },
    ],
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
