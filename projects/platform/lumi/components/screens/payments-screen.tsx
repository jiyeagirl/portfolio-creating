"use client";

import { ArrowsClockwise, Receipt } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import { PAYMENTS, formatWon } from "@/projects/platform/lumi/lib/mock-data";
import { AppBar, Badge } from "@/projects/platform/lumi/components/ui";

export function PaymentsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const totalPaid = PAYMENTS.filter((p) => p.status === "완료").reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  return (
    <div className="lm-enter pb-10">
      <AppBar title="결제 내역" onBack={() => onNavigate("mypage")} />

      <section className="px-5 pt-5">
        <div className="rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4">
          <p className="text-[12.5px] text-[var(--lm-muted)]">최근 3개월 결제 금액</p>
          <p className="lm-num mt-1 text-[24px] font-bold leading-none">
            {formatWon(totalPaid)}
            <span className="ml-1 text-[14px] font-semibold text-[var(--lm-muted)]">원</span>
          </p>
        </div>
      </section>

      <section className="mt-5">
        <div className="divide-y divide-[var(--lm-border)] border-y border-[var(--lm-border)] bg-[var(--lm-elevated)]">
          {PAYMENTS.map((payment) => (
            <article key={payment.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold">{payment.label}</p>
                  <p className="lm-num mt-1 text-[12px] text-[var(--lm-muted)]">
                    {payment.paidAt} · {payment.method}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="lm-num text-[14.5px] font-bold">{formatWon(payment.amount)}원</p>
                  <p className="lm-num mt-0.5 text-[11.5px] text-[var(--lm-muted)]">
                    {payment.quantity}장
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Badge tone={payment.status === "완료" ? "neutral" : "danger"}>
                  {payment.status}
                </Badge>
                <span className="lm-num text-[11.5px] text-[var(--lm-muted)]">{payment.id}</span>
                {payment.status === "완료" && payment.tier !== "coupon" && (
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-[var(--lm-muted)]"
                  >
                    <ArrowsClockwise size={12} />
                    환불 신청
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="rounded-2xl bg-[var(--lm-surface)] p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-bold">
            <Receipt size={14} weight="fill" className="text-[var(--lm-muted)]" />
            환불 기준
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {[
              "사용하지 않은 상담권은 구매 후 90일 안에 전액 환불됩니다.",
              "쿠폰으로 할인받은 금액은 환불 대상에서 제외됩니다.",
              "환불은 신청 후 영업일 기준 3일 안에 처리됩니다.",
            ].map((line) => (
              <li key={line} className="flex gap-2 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--lm-muted)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
