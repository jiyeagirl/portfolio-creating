"use client";

import { useState } from "react";
import { CreditCard, Sparkle } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Card, Input, SectionHead, Toggle } from "@/projects/platform/studyspot/components/ui";
import { CURRENT_USER } from "@/projects/platform/studyspot/lib/mock-data";
import { won, type Navigate } from "@/projects/platform/studyspot/lib/navigation";

type PlanOption = { id: string; name: string; price: number };

const PLAN_OPTIONS: PlanOption[] = [
  { id: "p1", name: "1시간 이용권", price: 3000 },
  { id: "p2", name: "3시간 이용권", price: 8000 },
  { id: "p3", name: "10시간 이용권", price: 25000 },
];

const COUPON_DISCOUNT = 3000;

/* ── 간편결제 브랜드 로고 — 실제 배지 색/워드마크를 따른다 ── */

function TossPayLogo() {
  return (
    <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#0064FF]">
      <span className="text-[12px] font-extrabold italic tracking-tight text-white">toss</span>
    </span>
  );
}

function NaverPayLogo() {
  return (
    <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#03C75A]">
      <span className="text-[15px] font-extrabold text-white">N</span>
    </span>
  );
}

function KakaoPayLogo() {
  return (
    <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#FEE500]">
      <span className="text-[11px] font-extrabold tracking-tight text-[#3C1E1E]">pay</span>
    </span>
  );
}

function PaycoLogo() {
  return (
    <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#ED1C5E]">
      <span className="text-[9px] font-extrabold tracking-tight text-white">PAYCO</span>
    </span>
  );
}

type PayMethodId = "toss" | "naver" | "kakao" | "payco";

const PAY_METHODS: { id: PayMethodId; name: string; benefit: string; Logo: () => React.ReactElement }[] = [
  { id: "toss", name: "토스페이", benefit: "5만원 이상 결제 시 2,000원 할인", Logo: TossPayLogo },
  { id: "naver", name: "네이버페이", benefit: "네이버페이 포인트 최대 1.6% 적립", Logo: NaverPayLogo },
  { id: "kakao", name: "카카오페이", benefit: "카카오페이 포인트 최대 500원 적립", Logo: KakaoPayLogo },
  { id: "payco", name: "페이코", benefit: "페이코포인트 최대 3% 적립", Logo: PaycoLogo },
];

export function PaymentScreen({ branchId, onNavigate }: { branchId?: string; onNavigate: Navigate }) {
  void branchId; // 결제 화면 로직에서 지점 조회는 필요 없음(일반 체크아웃)

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [payTab, setPayTab] = useState<"simple" | "card">("simple");
  const [selectedPayMethod, setSelectedPayMethod] = useState<PayMethodId>("toss");

  const hasCoupon = CURRENT_USER.couponCount > 0;
  const selectedPlan = PLAN_OPTIONS.find((plan) => plan.id === selectedPlanId);
  const basePrice = selectedPlan?.price ?? 0;
  const couponDiscount = couponApplied && hasCoupon ? COUPON_DISCOUNT : 0;
  const total = Math.max(0, basePrice - couponDiscount - pointsUsed);
  const totalSavings = couponDiscount + pointsUsed;

  const handlePointsChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    const parsed = digitsOnly === "" ? 0 : Number(digitsOnly);
    setPointsUsed(Math.min(parsed, CURRENT_USER.point));
  };

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader
        title="주문 | 결제"
        onBack={() => onNavigate("home")}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]"
      />

      <div className="ss-enter flex-1 overflow-y-auto px-5 pb-[110px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 이용권 선택 */}
        <div>
          <SectionHead title="이용권 선택" desc="이용 시간에 맞는 이용권을 선택하세요" />
          <div className="space-y-2.5">
            {PLAN_OPTIONS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between gap-3 rounded-[12px] border p-4 text-left transition-colors ${
                    isSelected ? "border-[var(--ss-ink)] bg-[var(--ss-canvas)]" : "border-[var(--ss-hairline)] bg-[var(--ss-canvas)]"
                  }`}
                >
                  <div>
                    <p className="text-[14.5px] font-semibold text-[var(--ss-ink)]">{plan.name}</p>
                    <p className="ss-mono mt-1 text-[13px] text-[var(--ss-mute)]">{won(plan.price)}</p>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-[var(--ss-ink)]" : "border-[var(--ss-hairline-strong)]"
                    }`}
                  >
                    {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[var(--ss-ink)]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="mt-7">
          <SectionHead title="결제 수단" />

          {/* 간편결제 / 카드 탭 */}
          <div className="mb-3 grid grid-cols-2 rounded-[8px] bg-[var(--ss-surface)] p-[3px]">
            {[
              { key: "simple" as const, label: "간편결제" },
              { key: "card" as const, label: "카드" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPayTab(tab.key)}
                aria-pressed={payTab === tab.key}
                className={`h-9 rounded-[6px] text-[13.5px] font-semibold transition-colors ${
                  payTab === tab.key ? "bg-[var(--ss-canvas)] text-[var(--ss-ink)] shadow-[var(--ss-shadow-soft)]" : "text-[var(--ss-mute)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {payTab === "simple" ? (
            <div className="space-y-2">
              {PAY_METHODS.map((method) => {
                const isSelected = method.id === selectedPayMethod;
                const Logo = method.Logo;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayMethod(method.id)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center gap-3 rounded-[10px] border bg-[var(--ss-canvas)] px-3.5 py-3 text-left transition-colors ${
                      isSelected ? "border-[var(--ss-ink)]" : "border-[var(--ss-hairline)]"
                    }`}
                  >
                    <Logo />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[var(--ss-ink)]">{method.name}</p>
                      <p className="mt-0.5 truncate text-[11.5px] text-[var(--ss-info)]">{method.benefit}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-[var(--ss-ink)]" : "border-[var(--ss-hairline-strong)]"
                      }`}
                    >
                      {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[var(--ss-ink)]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 rounded-[10px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-4">
              <div className="flex items-center gap-2 text-[var(--ss-mute)]">
                <CreditCard size={16} weight="bold" />
                <span className="text-[12.5px]">카드 정보는 안전하게 암호화되어 처리돼요</span>
              </div>
              <Input value="" placeholder="카드 번호" />
              <div className="grid grid-cols-2 gap-2.5">
                <Input value="" placeholder="MM / YY" />
                <Input value="" placeholder="CVC" />
              </div>
              <Input value="" placeholder="카드 소유자명" />
            </div>
          )}
        </div>

        {/* 쿠폰 적용 / 포인트 사용 */}
        <Card className="mt-7 divide-y divide-[var(--ss-hairline)]" padded={false}>
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-[var(--ss-ink)]">쿠폰 적용</p>
                <p className="mt-1 text-[12.5px] text-[var(--ss-mute)]">
                  {hasCoupon ? `보유 쿠폰 ${CURRENT_USER.couponCount}장` : "보유한 쿠폰이 없어요"}
                </p>
              </div>
              <div className={hasCoupon ? "" : "pointer-events-none opacity-40"}>
                <Toggle on={couponApplied} onChange={() => setCouponApplied((v) => !v)} label="쿠폰 적용" />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14.5px] font-semibold text-[var(--ss-ink)]">포인트 사용</p>
              <div className="w-[112px]">
                <Input
                  type="text"
                  value={pointsUsed === 0 ? "" : String(pointsUsed)}
                  onChange={handlePointsChange}
                  placeholder="0"
                  suffix={<span className="text-[13px] font-medium text-[var(--ss-mute)]">P</span>}
                />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <p className="text-[12.5px] text-[var(--ss-mute)]">보유 포인트 {CURRENT_USER.point.toLocaleString("ko-KR")}P</p>
              <button
                type="button"
                onClick={() => setPointsUsed(CURRENT_USER.point)}
                className="text-[12.5px] font-semibold text-[var(--ss-ink)]"
              >
                전액 사용
              </button>
            </div>
          </div>
        </Card>

        {/* 결제 금액 */}
        <Card className="mt-7" padded>
          <p className="text-[14.5px] font-semibold text-[var(--ss-ink)]">결제 금액</p>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-[var(--ss-body)]">이용권 금액</span>
              <span className="ss-mono text-[var(--ss-ink)]">{won(basePrice)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--ss-body)]">쿠폰 할인</span>
                <span className="ss-mono text-[var(--ss-negative)]">-{won(couponDiscount)}</span>
              </div>
            )}
            {pointsUsed > 0 && (
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--ss-body)]">포인트 할인</span>
                <span className="ss-mono text-[var(--ss-negative)]">-{won(pointsUsed)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--ss-hairline)] pt-4">
            <span className="text-[15px] font-bold text-[var(--ss-ink)]">총 결제 금액</span>
            <span className="ss-mono text-[18px] font-extrabold text-[var(--ss-ink)]">{won(total)}</span>
          </div>
        </Card>

        {/* 절약 안내 */}
        {totalSavings > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[var(--ss-positive-soft)] px-3.5 py-3">
            <Sparkle size={15} weight="fill" className="shrink-0 text-[var(--ss-positive)]" />
            <p className="text-[12.5px] font-medium text-[var(--ss-positive)]">
              지금 결제하면 총 {won(totalSavings)}을 아껴요
            </p>
          </div>
        )}
      </div>

      {/* 하단 고정 결제 버튼 — 불투명 표면, backdrop-blur 금지 */}
      <div className="absolute inset-x-0 bottom-0 border-t border-[var(--ss-hairline)] bg-[var(--ss-canvas)] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)]">
        <Button full size="lg" disabled={!selectedPlanId} onClick={() => onNavigate("qrCheckin")}>
          {selectedPlanId ? `${won(total)} 결제하기` : "이용권을 선택해주세요"}
        </Button>
      </div>
    </div>
  );
}
