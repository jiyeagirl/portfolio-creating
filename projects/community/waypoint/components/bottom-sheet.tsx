"use client";

import type { ReactNode } from "react";

/* 아키타입 A4(맵 캔버스)의 3단 스냅 시트.

   지도가 홈이므로 콘텐츠는 전부 이 시트 안에 들어간다. 하단 탭바가 없고, 시트 헤더의
   세그먼트 컨트롤이 그 역할을 대신한다.

   기기 프레임 안쪽 규칙 (CLAUDE.md "Device edge integrity"):
   - `absolute inset-x-0 bottom-0`으로 화면 박스 안쪽에 고정한다. `fixed`나 음수 offset 금지.
   - 표면은 완전 불투명(`--wp-surface`). `backdrop-blur`를 쓰지 않는다 — Chromium에서
     backdrop filter는 PhoneFrame의 rounded 코너 클립을 벗어나 모서리에 흰 틈을 만든다.
   - 상단만 라운드하고 하단은 각지게 둔다. 하단은 PhoneFrame의 클립이 처리한다. */

export type SheetStage = "peek" | "half" | "full";

/* 852px 화면 기준 각 단계에서 시트 상단이 앉는 위치.
   peek 15% / half 50% / full 92%를 화면 높이에 맞춰 px로 고정했다. */
const STAGE_TOP: Record<SheetStage, number> = {
  peek: 724,
  half: 426,
  full: 68,
};

export function BottomSheet({
  stage,
  onStageChange,
  header,
  children,
}: {
  stage: SheetStage;
  onStageChange: (next: SheetStage) => void;
  /** 그래버 아래 고정 영역. 세그먼트 컨트롤과 요약 줄이 여기 들어간다. */
  header: ReactNode;
  children: ReactNode;
}) {
  const next: Record<SheetStage, SheetStage> = { peek: "half", half: "full", full: "peek" };

  return (
    <div
      className="wp-sheet absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[20px] bg-[var(--wp-surface)]"
      style={{
        top: 0,
        transform: `translateY(${STAGE_TOP[stage]}px)`,
        height: 852,
        boxShadow: "var(--wp-shadow-pop)",
      }}
    >
      {/* 그래버 행 전체가 다음 단계로 넘기는 버튼이다. 실제 드래그 대신 탭으로
          3단을 순환한다 — 목업에서 드래그 제스처는 스크린샷에 남지 않는다. */}
      <button
        type="button"
        onClick={() => onStageChange(next[stage])}
        aria-label={`시트 ${next[stage] === "peek" ? "접기" : "펼치기"}`}
        className="shrink-0 px-4 pb-1 pt-2.5"
      >
        <span className="mx-auto block h-[5px] w-[36px] rounded-full bg-[var(--wp-border-strong)]" />
      </button>

      <div className="shrink-0 px-4 pb-3 pt-2">{header}</div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

/* 시트 헤더의 세그먼트. A4에서 이것이 하단 탭바를 대신하는 유일한 전환 장치다.
   듀오톤 두 색이 "내 동네"와 "내 동선"을 각각 맡는다. */
export function SheetSegment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; tone: "home" | "work" }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[var(--wp-border)] bg-[var(--wp-surface-soft)] p-1">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={active}
            className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${
              active ? "text-white" : "text-[var(--wp-muted)]"
            }`}
            style={
              active
                ? {
                    background:
                      option.tone === "home" ? "var(--wp-accent)" : "var(--wp-accent-2)",
                  }
                : undefined
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* 지도 위에 뜨는 플로팅 필터 칩. 시트가 아니라 지도 레이어에 얹힌다. */
export function FloatingChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active ? "bg-[var(--wp-ink)] text-white" : "bg-white text-[var(--wp-body)]"
      }`}
      style={{ boxShadow: "var(--wp-shadow)" }}
    >
      {label}
    </button>
  );
}
