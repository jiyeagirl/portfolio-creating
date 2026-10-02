"use client";

import { useState } from "react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { coupons, currentUser, mostReviewed, orders } from "@/projects/commerce/verve/lib/mock-data";
import type { OrderStatus } from "@/projects/commerce/verve/lib/types";
import { BadgePill, Button, Checkbox, Divider, EmptyState, Field, SectionHeading, TextInput, formatPrice } from "@/projects/commerce/verve/components/ui";

type Tab = "orders" | "wishlist" | "coupons" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "주문내역" },
  { id: "wishlist", label: "찜 목록" },
  { id: "coupons", label: "쿠폰 / 포인트" },
  { id: "profile", label: "회원정보" },
];

const STATUS_TONE: Record<OrderStatus, boolean> = {
  결제완료: false,
  배송준비중: false,
  배송중: true,
  배송완료: false,
};

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<Tab>("orders");
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [heightCm, setHeightCm] = useState(currentUser.heightCm);
  const [weightKg, setWeightKg] = useState(currentUser.weightKg);
  const [saved, setSaved] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const tierProgress = Math.min(1, currentUser.points / 30000);

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading title="마이페이지" tone="light" />

        <div className="mt-10 flex items-center gap-6 border border-[var(--v-hairline-on-light)] p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[var(--v-body-on-light)] text-[18px] font-semibold text-white">
            {currentUser.name.slice(0, 1)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-medium text-[var(--v-body-on-light)]">{currentUser.name}</p>
              <BadgePill tone="light">{currentUser.tier}</BadgePill>
            </div>
            <p className="mt-1 text-[12px] text-[var(--v-muted)]">{currentUser.email} · {currentUser.memberSince} 가입</p>
          </div>
          <div className="hidden text-right md:block">
            <p className="v-number text-[18px] font-medium text-[var(--v-body-on-light)]">{formatPrice(currentUser.points)}</p>
            <p className="text-[11px] text-[var(--v-muted)]">보유 포인트</p>
          </div>
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[var(--v-hairline-on-light)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] transition-colors ${
                tab === t.id ? "border-[var(--v-primary)] text-[var(--v-body-on-light)]" : "border-transparent text-[var(--v-muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-[var(--v-hairline-on-light)] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[var(--v-muted)]">
                      {order.date} · {order.id}
                    </p>
                    <BadgePill tone="light" accent={STATUS_TONE[order.status]}>
                      {order.status}
                    </BadgePill>
                  </div>
                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-16 w-14 object-cover" />
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-[var(--v-body-on-light)]">{item.name}</p>
                          <p className="text-[12px] text-[var(--v-muted)]">
                            {item.color} / {item.size} / {item.quantity}개
                          </p>
                        </div>
                        <span className="v-number text-[13px] text-[var(--v-body-on-light)]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <Divider tone="light" className="my-4" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[12px] text-[var(--v-muted)]">{order.estimatedDelivery}</p>
                    <div className="flex gap-2">
                      <Button tone="light" variant="outline" className="h-9 px-4 text-[11px]" onClick={() => onNavigate("productDetail", order.items[0].productId)}>
                        리뷰 작성
                      </Button>
                      {order.status !== "배송완료" ? (
                        <Button tone="light" variant="outline" className="h-9 px-4 text-[11px]">
                          배송 조회
                        </Button>
                      ) : (
                        <Button tone="light" variant="outline" className="h-9 px-4 text-[11px]">
                          교환/반품 신청
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <p className="mb-4 text-[12px] text-[var(--v-muted)]">최근 본 상품</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {mostReviewed.map((p) => (
                  <button key={p.id} type="button" onClick={() => onNavigate("productDetail", p.id)} className="text-left">
                    <div className="aspect-[3/4] overflow-hidden bg-[var(--v-surface-strong-light)]">
                      <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 text-[12px] font-medium text-[var(--v-body-on-light)] line-clamp-1">{p.name}</p>
                    <p className="v-number text-[12px] text-[var(--v-muted)]">{formatPrice(p.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "coupons" && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">보유 쿠폰</p>
                <div className="mt-4 space-y-2">
                  {coupons.map((c) => (
                    <div key={c.id} className="flex items-center justify-between border border-[var(--v-hairline-on-light)] p-4">
                      <div>
                        <p className="text-[13px] font-medium text-[var(--v-body-on-light)]">{c.title}</p>
                        <p className="mt-1 text-[11px] text-[var(--v-muted)]">
                          {c.minAmount > 0 ? `${formatPrice(c.minAmount)} 이상 구매 시` : "제한 없음"} · {c.expiresAt}까지
                        </p>
                      </div>
                      <span className="text-[14px] font-semibold text-[var(--v-primary)]">{c.discount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">포인트</p>
                <div className="mt-4 border border-[var(--v-hairline-on-light)] p-5">
                  <p className="v-number text-[28px] font-medium text-[var(--v-body-on-light)]">{formatPrice(currentUser.points)}</p>
                  <p className="mt-1 text-[12px] text-[var(--v-muted)]">다음 등급까지 {formatPrice(30000 - currentUser.points > 0 ? 30000 - currentUser.points : 0)} 남음</p>
                  <div className="mt-4 h-1.5 w-full bg-[var(--v-surface-strong-light)]">
                    <div className="h-full bg-[var(--v-primary)]" style={{ width: `${tierProgress * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-[420px] space-y-6">
              <Field label="이름" tone="light">
                <TextInput tone="light" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="연락처" tone="light">
                <TextInput tone="light" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="키 (cm)" tone="light">
                  <TextInput tone="light" type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                </Field>
                <Field label="몸무게 (kg)" tone="light">
                  <TextInput tone="light" type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
                </Field>
              </div>
              <p className="text-[12px] text-[var(--v-muted)]">저장된 신체 정보는 AI 사이즈 추천의 기본값으로 사용돼요.</p>
              <Checkbox tone="light" checked={pushEnabled} onChange={setPushEnabled} label="배송/이벤트 알림 수신 동의" />
              <Button
                tone="light"
                onClick={() => {
                  setSaved(true);
                  window.setTimeout(() => setSaved(false), 1800);
                }}
              >
                {saved ? "저장됨" : "정보 저장"}
              </Button>
            </div>
          )}

          {tab === "orders" && orders.length === 0 && (
            <EmptyState tone="light" title="주문 내역이 없어요" action={<Button tone="light" onClick={() => onNavigate("shop")}>쇼핑하러 가기</Button>} />
          )}
        </div>
      </div>
    </div>
  );
}
