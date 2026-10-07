"use client";

/* 건설사 담당자가 쓰는 물량 산출 서비스의 상단 바. 홍보 사이트 메뉴가 아니라 서비스 헤더다: 로고, 작업 영역, 계정. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--dq-line)] bg-[var(--dq-surface)]">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center gap-3 px-4 sm:px-8">
        <span className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--dq-brand)] text-[13px] font-bold text-white">
            DQ
          </span>
          <span className="text-[16px] font-bold tracking-[-0.02em]">DrawQty</span>
        </span>
        <span className="h-4 w-px bg-[var(--dq-line-strong)]" aria-hidden />
        <span className="text-[14px] font-medium text-[var(--dq-ink-2)]">물량 산출</span>

        <span className="ml-auto flex items-center gap-2.5">
          <span className="hidden text-[13px] text-[var(--dq-ink-3)] sm:block">건설사 담당자</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dq-soft-2)] text-[12px] font-semibold text-[var(--dq-ink-2)]">
            건
          </span>
        </span>
      </div>
    </header>
  );
}
