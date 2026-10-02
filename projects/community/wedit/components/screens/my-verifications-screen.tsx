"use client";

import { FileText, Receipt, Warning } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { VERIFICATIONS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { Button, PriceText, StatusPill } from "@/projects/community/wedit/components/ui";

export function MyVerificationsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="내 인증 관리"
        subtitle={`총 ${VERIFICATIONS.length}건`}
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
        subtitleClassName="text-[11px] text-[var(--wd-muted)]"
      />

      <div className="flex flex-col gap-3 px-5 pt-5">
        {VERIFICATIONS.map((v) => (
          <div key={v.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--wd-surface-tint)] text-[var(--wd-accent)]">
                  {v.docType === "receipt" ? <Receipt size={15} /> : <FileText size={15} />}
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">{v.vendorName}</p>
                  <p className="text-[10.5px] text-[var(--wd-muted)]">
                    {v.docType === "receipt" ? "영수증" : "계약서"} 인증 · {v.submittedAt} 접수
                  </p>
                </div>
              </div>
              <StatusPill status={v.status} />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[var(--wd-canvas)] px-3.5 py-2.5">
              <span className="text-[11.5px] text-[var(--wd-muted)]">계약 금액 · 계약일</span>
              <span className="text-[12.5px] font-semibold tabular-nums text-[var(--wd-ink)]">
                <PriceText value={v.amount} /> · {v.contractDate}
              </span>
            </div>

            {v.status === "rejected" && v.rejectReason && (
              <div className="flex items-start gap-2 rounded-xl bg-[var(--wd-status-rejected-bg)] p-3">
                <Warning size={14} weight="fill" className="mt-0.5 shrink-0 text-[var(--wd-status-rejected-fg)]" />
                <p className="text-[11.5px] leading-[16px] text-[var(--wd-status-rejected-fg)]">
                  {v.rejectReason}
                </p>
              </div>
            )}

            {v.status === "rejected" && (
              <Button size="sm" variant="secondary" onClick={() => onNavigate("verifyUpload")}>
                재업로드
              </Button>
            )}
            {v.status === "approved" && (
              <Button size="sm" variant="ghost" onClick={() => onNavigate("myReviews")}>
                리뷰 작성하기
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
