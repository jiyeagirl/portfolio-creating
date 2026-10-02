"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, CreditCard, Sparkle, Ticket } from "@phosphor-icons/react";
import { AppBar, Badge, Card, EmptyState, Tabs } from "@/projects/commerce/snowpeak/components/ui";
import { COUPONS, PAYMENT_RECORDS, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { PaymentRecord, UserProfile } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";

type WalletTab = "payments" | "coupons" | "points";

const TAB_ITEMS: { key: WalletTab; label: string }[] = [
  { key: "payments", label: "결제내역" },
  { key: "coupons", label: "쿠폰" },
  { key: "points", label: "포인트" },
];

const PAYMENT_STATUS_TONE: Record<PaymentRecord["status"], Tone> = {
  결제완료: "success",
  환불완료: "neutral",
  부분환불: "warn",
};

type PointHistoryItem = {
  id: string;
  label: string;
  detail: string;
  amount: number;
  date: string;
};

function buildPointHistory(): PointHistoryItem[] {
  const earned = PAYMENT_RECORDS.filter((p) => p.status === "결제완료").map((p) => ({
    id: `earn-${p.id}`,
    label: "결제 적립",
    detail: p.confirmationNo,
    amount: Math.round(p.amount * 0.01),
    date: p.paidAt,
  }));
  const used: PointHistoryItem[] = [
    { id: "use-1", label: "쿠폰 사용", detail: "패밀리 패키지 5% 할인", amount: -3200, date: "2023-07-15" },
  ];
  return [...earned, ...used].sort((a, b) => b.date.localeCompare(a.date));
}

const POINT_HISTORY = buildPointHistory();

function isCouponExpired(expiresAt: string): boolean {
  return expiresAt < "2023-10-15";
}

export function WalletScreen({
  profile,
  onNavigate,
}: {
  profile: UserProfile;
  onNavigate: NavigateFn;
}) {
  const [tab, setTab] = useState<WalletTab>("payments");

  const recentPayments = PAYMENT_RECORDS.slice().reverse();

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="결제 / 쿠폰 / 포인트" onBack={() => onNavigate("mypage")} />

      <Tabs value={tab} items={TAB_ITEMS} onChange={setTab} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {tab === "payments" &&
          (recentPayments.length === 0 ? (
            <EmptyState
              icon={<CreditCard size={22} weight="bold" />}
              title="결제 내역이 없어요"
              body="아직 결제한 내역이 없습니다."
            />
          ) : (
            <div className="space-y-3">
              {recentPayments.map((pay) => (
                <Card key={pay.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="sp-num text-[11.5px] text-[var(--sp-mute)]">{pay.confirmationNo}</span>
                    <Badge tone={PAYMENT_STATUS_TONE[pay.status]}>{pay.status}</Badge>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] text-[var(--sp-body)]">{pay.method}</p>
                      <p className="sp-num mt-0.5 text-[11.5px] text-[var(--sp-mute)]">{pay.paidAt}</p>
                    </div>
                    <span className="sp-num text-[16px] font-semibold text-[var(--sp-ink)]">
                      {formatWon(pay.amount)}원
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ))}

        {tab === "coupons" &&
          (COUPONS.length === 0 ? (
            <EmptyState
              icon={<Ticket size={22} weight="bold" />}
              title="보유한 쿠폰이 없어요"
              body="새로운 쿠폰이 발급되면 이곳에 표시됩니다."
            />
          ) : (
            <div className="space-y-3">
              {COUPONS.map((coupon) => {
                const expired = isCouponExpired(coupon.expiresAt);
                const disabled = coupon.used || expired;
                return (
                  <div
                    key={coupon.id}
                    className={`rounded-[16px] border p-4 ${
                      disabled
                        ? "border-[var(--sp-border)] bg-[var(--sp-surface-soft)] opacity-60"
                        : "border-transparent bg-[var(--sp-surface)]"
                    }`}
                    style={
                      disabled
                        ? undefined
                        : { boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
                        <Ticket size={16} weight="bold" />
                      </span>
                      <Badge tone={coupon.used ? "neutral" : expired ? "neutral" : "success"}>
                        {coupon.used ? "사용완료" : expired ? "기간만료" : "사용가능"}
                      </Badge>
                    </div>
                    <p className="mt-3 text-[14.5px] font-semibold text-[var(--sp-ink)]">{coupon.label}</p>
                    <p className="mt-1 text-[12px] text-[var(--sp-mute)]">
                      {coupon.discountType === "정액"
                        ? `${formatWon(coupon.discount)}원 할인`
                        : `${coupon.discount}% 할인`}{" "}
                      | {formatWon(coupon.minAmount)}원 이상 구매 시
                    </p>
                    <p className="sp-num mt-1 text-[11.5px] text-[var(--sp-mute)]">
                      {coupon.expiresAt}까지 사용 가능
                    </p>
                  </div>
                );
              })}
            </div>
          ))}

        {tab === "points" && (
          <div>
            <div
              className="rounded-[16px] bg-[var(--sp-ink)] p-5"
              style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
            >
              <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-white/70">
                <Sparkle size={14} weight="fill" className="text-[var(--sp-accent)]" />
                보유 포인트
              </div>
              <p className="sp-num mt-2 text-[28px] font-semibold text-white">
                {formatWon(profile.pointBalance)}P
              </p>
            </div>

            <div className="mt-5">
              <p className="mb-2.5 px-1 text-[13px] font-semibold text-[var(--sp-ink)]">적립 / 사용 내역</p>
              {POINT_HISTORY.length === 0 ? (
                <EmptyState
                  icon={<Sparkle size={22} weight="bold" />}
                  title="포인트 내역이 없어요"
                  body="결제하거나 쿠폰을 사용하면 이곳에 표시됩니다."
                />
              ) : (
                <div className="overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]">
                  {POINT_HISTORY.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b border-[var(--sp-border)] px-4 py-3.5 last:border-b-0"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          item.amount >= 0
                            ? "bg-[var(--sp-success-soft)] text-[var(--sp-success)]"
                            : "bg-[var(--sp-surface-soft)] text-[var(--sp-mute)]"
                        }`}
                      >
                        {item.amount >= 0 ? (
                          <ArrowUp size={14} weight="bold" />
                        ) : (
                          <ArrowDown size={14} weight="bold" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium text-[var(--sp-ink)]">{item.label}</p>
                        <p className="mt-0.5 truncate text-[11.5px] text-[var(--sp-mute)]">
                          {item.detail} | {item.date}
                        </p>
                      </div>
                      <span
                        className={`sp-num shrink-0 text-[13.5px] font-semibold ${
                          item.amount >= 0 ? "text-[var(--sp-success)]" : "text-[var(--sp-mute)]"
                        }`}
                      >
                        {item.amount >= 0 ? "+" : ""}
                        {formatWon(item.amount)}P
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
