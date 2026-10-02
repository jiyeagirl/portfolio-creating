"use client";

import type { ReactNode } from "react";
import { CaretLeft, X } from "@phosphor-icons/react";

/* 아키타입 A2의 네비게이션 모델. 하단 탭바가 없으므로 홈(지갑) 외의 모든 화면은
   여기서 올라오는 시트로 뜬다.

   기기 프레임 안쪽 규칙 (CLAUDE.md "Device edge integrity"):
   - `absolute inset-0`으로 화면 박스 안쪽에 고정한다. `fixed`나 음수 offset을 쓰지 않는다.
   - 스크림과 시트 표면 모두 `backdrop-blur`를 쓰지 않는다. PhoneFrame의 rounded 코너
     클립을 뚫고 모서리에 흰 틈이 새기 때문이다. 스크림은 불투명도만 있는 순수 검정,
     시트는 완전 불투명한 `--vl-elevated`다.
   - 시트 상단만 라운드(`rounded-t-[24px]`)하고 하단은 각지게 둔다. 하단은 PhoneFrame의
     클립이 처리하므로 여기서 다시 둥글리면 코너가 이중으로 파인다. */

export function Sheet({
  title,
  onClose,
  onBack,
  children,
}: {
  title: string;
  onClose: () => void;
  /** 시트 안에서 한 단계 뒤로 (통화 상세 → 통화 기록 등). 없으면 닫기 버튼만 보인다. */
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="vl-scrim-in absolute inset-0 bg-black/35"
      />

      <div
        className="vl-sheet-in absolute inset-x-0 bottom-0 top-[64px] flex flex-col overflow-hidden rounded-t-[24px] bg-[var(--vl-elevated)]"
        style={{ boxShadow: "var(--vl-shadow-sheet)" }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="shrink-0 px-4 pb-2 pt-2.5">
          <span
            className="mx-auto block h-[5px] w-[36px] rounded-full bg-[var(--vl-border-strong)]"
            aria-hidden
          />
          <div className="mt-3 flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="뒤로"
                className="-ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--vl-ink)] transition-opacity active:opacity-60"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
            )}
            <h2 className="min-w-0 flex-1 truncate text-[18px] font-bold tracking-[-0.01em] text-[var(--vl-ink)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-surface)] text-[var(--vl-muted)] transition-opacity active:opacity-60"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div className="vl-scroll-x flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
