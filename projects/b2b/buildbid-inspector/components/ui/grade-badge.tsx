import type { Grade } from "@/projects/b2b/buildbid-inspector/lib/types";

export const GRADE_META: Record<Grade, { label: string; desc: string; style: string; ring: string }> = {
  S: {
    label: "S",
    desc: "최상 — 즉시 재판매 가능",
    style: "bg-[var(--bbi-accent)] text-[var(--bbi-on-accent)]",
    ring: "ring-[var(--bbi-accent)]",
  },
  A: {
    label: "A",
    desc: "양호 — 경미한 마모만 존재",
    style: "bg-[var(--bbi-success)] text-white",
    ring: "ring-[var(--bbi-success)]",
  },
  B: {
    label: "B",
    desc: "보통 — 일부 정비 후 판매 권장",
    style: "bg-[var(--bbi-warning)] text-white",
    ring: "ring-[var(--bbi-warning)]",
  },
  C: {
    label: "C",
    desc: "주의 — 주요 부품 정비 필요",
    style: "bg-[var(--bbi-danger)] text-white",
    ring: "ring-[var(--bbi-danger)]",
  },
};

export function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" }) {
  const meta = GRADE_META[grade];
  const dims = size === "sm" ? "h-7 w-7 text-[13px]" : "h-11 w-11 text-[18px]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[9999px] font-bold ${dims} ${meta.style}`}
    >
      {meta.label}
    </span>
  );
}
