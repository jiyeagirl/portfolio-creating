"use client";

import { useState } from "react";
import { AndroidLogo, AppleLogo, CreditCard } from "@phosphor-icons/react";
import { CHANNEL_LABEL, SUB_STATUS_LABEL, subscriptionActive } from "@/projects/platform/eduon/lib/access";
import { won } from "@/projects/platform/eduon/lib/format";
import { PRICE } from "@/projects/platform/eduon/lib/mock-data";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { Channel, SubStatus } from "@/projects/platform/eduon/lib/types";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { Btn, Dialog } from "@/projects/platform/eduon/components/site/ui";

/*
 * 구독 관리. 내 학습과 분리된 계정 화면이고 헤더 프로필 메뉴에서 들어온다 (사용자 지정, 2026-10-28).
 * 좌측 현재 구독 상태와 해지, 스토어 관리 안내 / 우측 결제 내역.
 * 갱신 해지는 즉시 이용 종료가 아니라는 점, 만료 뒤에는 구독 전용 강의만 잠긴다는 점을 그대로 보여 준다.
 */

const STATUS_TONE: Record<SubStatus, string> = {
  free: "text-[var(--eo-fg-2)]",
  active: "text-[var(--eo-green-dk)]",
  cancelled: "text-[var(--eo-brand-ink)]",
  failed: "text-[var(--eo-orange-dk)]",
  expired: "text-[var(--eo-red-dk)]",
  refunded: "text-[var(--eo-fg-2)]",
};

export function MembershipScreen() {
  return (
    <div className="mx-auto max-w-[1328px] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.01em]">구독 관리</h1>
      <div className="mt-8 grid items-start gap-10 border-t border-[var(--eo-hair)] pt-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <MySubscriptionPanel />
        </div>
        <aside className="min-w-0 lg:col-span-5">
          <BillingHistory />
        </aside>
      </div>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: Channel }) {
  if (channel === "ios") return <AppleLogo size={20} weight="fill" />;
  if (channel === "android") return <AndroidLogo size={20} weight="fill" />;
  return <CreditCard size={20} />;
}

function MySubscriptionPanel() {
  const { mySub, cancelRenewal } = useStore();
  const { go, toast } = useSite();
  const [confirm, setConfirm] = useState(false);
  const [storeHelp, setStoreHelp] = useState(false);
  const s = mySub.status;

  if (s === "free")
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[16px] text-[var(--eo-fg-2)]">구독 중인 상품이 없어요. 무료 공개 강의와 미리보기 회차를 볼 수 있어요.</p>
        <Btn variant="signature" onClick={() => go("subscription")}>
          할인 받고 구독 시작하기
        </Btn>
      </div>
    );

  const dateLabel = s === "active" ? "다음 갱신 예정일" : s === "cancelled" ? "이용 종료일" : s === "failed" ? "결제 재시도일" : s === "expired" ? "만료일" : "환불일";
  const date = s === "failed" ? "2026. 10. 30" : mySub.periodEnd;
  const channel = mySub.channel ?? "web";

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`text-[24px] font-bold leading-[32px] ${STATUS_TONE[s]}`}>{SUB_STATUS_LABEL[s]}</span>
        <span className="text-[15px] text-[var(--eo-fg-2)]">EduOn 월 구독</span>
      </div>
      <p className="mt-2 text-[16px] leading-[26px] text-[var(--eo-fg-2)]">
        {s === "active" && "구독 대상 전체 강의를 볼 수 있어요."}
        {s === "cancelled" && `자동 갱신을 해지했어요. ${mySub.periodEnd}까지는 전체 강의를 계속 볼 수 있어요.`}
        {s === "failed" && "갱신 결제가 실패했어요. 결제 수단을 바꾸지 않으면 재시도일 뒤 구독 전용 강의가 잠겨요."}
        {s === "expired" && "구독 기간이 끝나 구독 전용 강의가 잠겼어요. 무료 공개 강의와 미리보기 회차는 계속 볼 수 있어요."}
        {s === "refunded" && "결제가 환불되어 구독 권한이 회수됐어요."}
      </p>

      <dl className="mt-8 grid gap-x-8 gap-y-5 border-y border-[var(--eo-hair)] py-6 sm:grid-cols-3">
        <div>
          <dt className="text-[13px] text-[var(--eo-fg-3)]">구매 경로</dt>
          <dd className="mt-1.5 flex items-center gap-2 text-[16px] font-semibold">
            <ChannelIcon channel={channel} />
            {CHANNEL_LABEL[channel]}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-[var(--eo-fg-3)]">{dateLabel}</dt>
          <dd className="mt-1.5 whitespace-nowrap text-[16px] font-semibold">{date}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-[var(--eo-fg-3)]">월 구독료 (원)</dt>
          <dd className="mt-1.5 text-[16px] font-semibold">{won(PRICE)}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {s === "active" &&
          (channel === "web" ? (
            <Btn variant="outline" onClick={() => setConfirm(true)}>
              갱신 해지
            </Btn>
          ) : (
            <Btn variant="outline" onClick={() => setStoreHelp(true)}>
              {CHANNEL_LABEL[channel]}에서 관리
            </Btn>
          ))}
        {(s === "expired" || s === "refunded") && (
          <Btn variant="brand" onClick={() => go("subscription")}>
            다시 구독
          </Btn>
        )}
        {s === "failed" && (
          <Btn variant="brand" onClick={() => go("subscription")}>
            결제 수단 변경
          </Btn>
        )}
        {s === "cancelled" && (
          <Btn variant="outline" onClick={() => go("home")}>
            강의 계속 보기
          </Btn>
        )}
      </div>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="자동 갱신을 해지할까요?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirm(false)}>
              유지
            </Btn>
            <Btn
              variant="light"
              onClick={() => {
                cancelRenewal();
                setConfirm(false);
                toast("자동 갱신을 해지했어요");
              }}
            >
              갱신 해지
            </Btn>
          </>
        }
      >
        <p>
          해지해도 바로 끝나지 않아요. <span className="font-semibold text-[var(--eo-fg)]">{mySub.periodEnd}</span>까지 전체 강의를 볼 수 있고, 그 뒤에는 다음 결제가
          진행되지 않아요.
        </p>
      </Dialog>

      <Dialog
        open={storeHelp}
        onClose={() => setStoreHelp(false)}
        title={`${CHANNEL_LABEL[channel]}에서 구독을 관리해요`}
        footer={
          <Btn variant="light" onClick={() => setStoreHelp(false)}>
            확인
          </Btn>
        }
      >
        <p>앱에서 구매한 구독은 EduOn에서 해지할 수 없어요.</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          {channel === "ios" ? (
            <>
              <li>iPhone 설정 앱에서 내 이름을 눌러요</li>
              <li>구독 메뉴에서 EduOn을 골라요</li>
              <li>구독 취소를 눌러요</li>
            </>
          ) : (
            <>
              <li>Google Play 앱에서 프로필을 눌러요</li>
              <li>결제 및 정기 결제, 정기 결제로 들어가요</li>
              <li>EduOn을 고르고 정기 결제 취소를 눌러요</li>
            </>
          )}
        </ol>
      </Dialog>
    </div>
  );
}

function BillingHistory() {
  const { mySub } = useStore();
  const rows = mySub.history;
  return (
    <section className="rounded-[24px] bg-[var(--eo-raised)]" aria-labelledby="billing-title">
      <div className="flex items-baseline justify-between px-5 pb-3 pt-5">
        <h2 id="billing-title" className="text-[17px] font-semibold">
          결제 내역
        </h2>
        <span className="text-[13px] text-[var(--eo-fg-3)]">금액 (원)</span>
      </div>
      {rows.length === 0 ? (
        <p className="border-t border-[var(--eo-hair)] px-5 py-5 text-[14px] text-[var(--eo-fg-3)]">결제 내역이 없어요.</p>
      ) : (
        <ul className="divide-y divide-[var(--eo-hair)] border-t border-[var(--eo-hair)]">
          {rows.map((r) => (
            <li key={r.id} className="flex items-start gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{r.kind}</div>
                <div className="mt-0.5 text-[13px] text-[var(--eo-fg-3)]">
                  {r.at} | {CHANNEL_LABEL[r.channel]} | {r.result}
                </div>
              </div>
              <span className={`whitespace-nowrap text-[15px] font-semibold ${r.amount !== null && r.amount < 0 ? "text-[var(--eo-red-dk)]" : ""}`}>
                {r.amount === null ? "" : r.amount < 0 ? `-${won(-r.amount)}` : won(r.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {subscriptionActive(mySub.status) && <p className="border-t border-[var(--eo-hair)] px-5 py-3.5 text-[13px] text-[var(--eo-fg-3)]">영수증은 결제 메일로 보내 드려요.</p>}
    </section>
  );
}
