"use client";

import { useRef, useState } from "react";
import {
  Check,
  CheckCircle,
  CreditCard,
  Plus,
  Receipt,
  Trash,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import type { PassTier, PaymentMethod, PaymentRecord } from "@/projects/platform/veli/lib/types";
import {
  PASS_BY_TIER,
  PASS_PRODUCTS,
  PAYMENT_METHODS,
  PAYMENT_RECORDS,
  formatWon,
} from "@/projects/platform/veli/lib/mock-data";
import {
  Badge,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
} from "@/projects/platform/veli/components/ui";

type PurchaseTab = "buy" | "cards" | "history";

const TABS: { key: PurchaseTab; label: string }[] = [
  { key: "buy", label: "구매" },
  { key: "cards", label: "결제수단" },
  { key: "history", label: "결제내역" },
];

export function PurchaseScreen({
  tier,
  onNavigate,
}: {
  tier?: PassTier;
  onNavigate: NavigateFn;
}) {
  const [activeTab, setActiveTab] = useState<PurchaseTab>(tier ? "buy" : "history");

  return (
    <div className="vl-enter min-h-full pb-10">

      <div className="px-5 pt-4">
        <div className="flex items-center gap-1 rounded-full border border-[var(--vl-border)] bg-[var(--vl-surface)] p-1">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                aria-pressed={active}
                className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--vl-elevated)] text-[var(--vl-ink)]"
                    : "text-[var(--vl-muted)]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "buy" && <BuyTab tier={tier} onNavigate={onNavigate} />}
      {activeTab === "cards" && <CardsTab />}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
}

/* ---------- 구매 ---------- */

type ChangeMode = "immediate" | "nextCycle";

const CHANGE_MODE_OPTIONS: { key: ChangeMode; label: string; helper: string }[] = [
  {
    key: "immediate",
    label: "즉시 변경 (차액 결제)",
    helper: "지금 바로 적용되고 차액만 결제됩니다",
  },
  {
    key: "nextCycle",
    label: "다음 결제일부터 변경",
    helper: "이번 결제 주기는 그대로 유지됩니다",
  },
];

function BuyTab({
  tier,
  onNavigate,
}: {
  tier?: PassTier;
  onNavigate: NavigateFn;
}) {
  const [selectedTier, setSelectedTier] = useState<PassTier>(tier ?? "standard");
  const [changeMode, setChangeMode] = useState<ChangeMode>("nextCycle");
  const [methodId, setMethodId] = useState(
    PAYMENT_METHODS.find((m) => m.isDefault)?.id ?? PAYMENT_METHODS[0].id,
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [done, setDone] = useState(false);

  const pass = PASS_BY_TIER[selectedTier];
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);

  if (done) {
    return (
      <div className="px-5 pt-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vl-success-soft)] text-[var(--vl-success)]">
          <CheckCircle size={32} weight="fill" />
        </span>
        <h2 className="mt-4 text-[18px] font-bold tracking-tight">변경이 완료되었습니다</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--vl-muted)]">
          {pass.name} 이용권으로{" "}
          {changeMode === "immediate"
            ? "즉시 변경되었고 차액이 결제되었습니다"
            : "다음 결제일부터 적용됩니다"}
          .
        </p>

        <div className="mt-6 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-4 text-left">
          <div className="vl-num flex items-center justify-between text-[13px]">
            <span className="text-[var(--vl-muted)]">결제 금액</span>
            <span className="font-bold">{formatWon(pass.priceMonthly)}원</span>
          </div>
          <div className="vl-num mt-2 flex items-center justify-between text-[13px]">
            <span className="text-[var(--vl-muted)]">결제 수단</span>
            <span className="font-semibold">
              {method ? `${method.brand} ****${method.last4}` : "미선택"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={() => onNavigate("passes")}>이용권으로 돌아가기</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5">
      <h2 className="text-[14px] font-bold">이용권 선택</h2>
      <div className="mt-3 flex gap-2">
        {PASS_PRODUCTS.map((p) => {
          const active = p.tier === selectedTier;
          return (
            <button
              key={p.tier}
              type="button"
              onClick={() => setSelectedTier(p.tier)}
              aria-pressed={active}
              className={`flex-1 rounded-full border px-2 py-2.5 text-center transition-colors ${
                active
                  ? "border-[var(--vl-accent)] bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]"
                  : "border-[var(--vl-border)] bg-[var(--vl-elevated)] text-[var(--vl-ink)]"
              }`}
            >
              <span className="block text-[12.5px] font-bold">{p.name}</span>
              <span className="vl-num mt-0.5 block text-[11px]">
                {formatWon(p.priceMonthly)}원
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-bold">{pass.name}</p>
          <p className="vl-num text-[17px] font-bold leading-none">
            {formatWon(pass.priceMonthly)}
            <span className="ml-0.5 text-[12px] font-semibold text-[var(--vl-muted)]">
              원/월
            </span>
          </p>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--vl-muted)]">{pass.bestFor}</p>
        <ul className="mt-3 space-y-1.5 border-t border-[var(--vl-divider)] pt-3">
          {pass.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[12.5px] text-[var(--vl-muted)]">
              <Check size={13} weight="bold" className="shrink-0 text-[var(--vl-accent)]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="mt-6 text-[14px] font-bold">변경 방식</h2>
      <div className="mt-3 space-y-2">
        {CHANGE_MODE_OPTIONS.map((opt) => {
          const active = changeMode === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setChangeMode(opt.key)}
              aria-pressed={active}
              className={`flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-[var(--vl-accent)] bg-[var(--vl-accent-soft)]"
                  : "border-[var(--vl-border)] bg-[var(--vl-elevated)]"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-[var(--vl-accent)] bg-[var(--vl-accent)]" : "border-[var(--vl-border)]"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--vl-accent-fg)]" />}
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold">{opt.label}</span>
                <span className="mt-0.5 block text-[11.5px] text-[var(--vl-muted)]">
                  {opt.helper}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-6 text-[14px] font-bold">결제 수단</h2>
      <div className="mt-3 space-y-2">
        {PAYMENT_METHODS.map((m) => {
          const active = methodId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethodId(m.id)}
              aria-pressed={active}
              className={`flex w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-[var(--vl-accent)] bg-[var(--vl-accent-soft)]"
                  : "border-[var(--vl-border)] bg-[var(--vl-elevated)]"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-[var(--vl-accent)] bg-[var(--vl-accent)]" : "border-[var(--vl-border)]"
                }`}
              >
                {active && <Check size={10} weight="bold" className="text-[var(--vl-accent-fg)]" />}
              </span>
              <CreditCard size={18} className="shrink-0 text-[var(--vl-muted)]" />
              <span className="flex-1 text-[13.5px] font-semibold">
                {m.brand} ****{m.last4}
              </span>
              {m.isDefault && (
                <Badge tone="accent" className="text-[10.5px]">
                  기본
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <h2 className="mt-6 text-[14px] font-bold">쿠폰</h2>
      <div className="mt-3 flex gap-2">
        <input
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setCouponApplied(false);
          }}
          placeholder="쿠폰 코드를 입력하세요"
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={() => setCouponApplied(couponCode.trim().length > 0)}
          className="shrink-0 rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 text-[13px] font-semibold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
        >
          적용
        </button>
      </div>
      {couponApplied && (
        <p className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-[var(--vl-success)]">
          <Check size={13} weight="bold" />
          쿠폰이 적용됨
        </p>
      )}

      <div className="mt-6 rounded-[12px] bg-[var(--vl-surface)] p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-bold">
          <Receipt size={14} weight="fill" className="text-[var(--vl-muted)]" />
          결제 예정 금액
        </p>
        <div className="vl-num mt-3 flex items-center justify-between text-[15px]">
          <span className="text-[13px] font-normal text-[var(--vl-muted)]">{pass.name} 이용권</span>
          <span className="font-bold">{formatWon(pass.priceMonthly)}원</span>
        </div>
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={() => setDone(true)}>결제하기</PrimaryButton>
      </div>
      <div className="h-8" />
    </div>
  );
}

/* ---------- 결제수단 ---------- */

function CardsTab() {
  const addIdCounter = useRef(0);
  const [methods, setMethods] = useState<PaymentMethod[]>(() =>
    PAYMENT_METHODS.map((m) => ({ ...m })),
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  function setDefault(id: string) {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  }

  function removeMethod(id: string) {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  }

  function addMethod() {
    if (!cardNumber.trim()) return;
    addIdCounter.current += 1;
    const digits = cardNumber.replace(/\D/g, "");
    const last4 = digits.slice(-4).padStart(4, "0");
    setMethods((prev) => [
      ...prev,
      {
        id: `pm-new-${addIdCounter.current}`,
        brand: "C카드",
        last4,
        isDefault: prev.length === 0,
      },
    ]);
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setShowAddForm(false);
  }

  return (
    <div className="px-5 pt-5">
      <h2 className="text-[14px] font-bold">등록된 결제 수단</h2>
      <div className="mt-3 space-y-2">
        {methods.length === 0 && (
          <p className="rounded-[12px] border border-dashed border-[var(--vl-border)] px-4 py-6 text-center text-[13px] text-[var(--vl-muted)]">
            등록된 결제 수단이 없습니다
          </p>
        )}
        {methods.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 py-3.5"
          >
            <CreditCard size={20} className="shrink-0 text-[var(--vl-muted)]" />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <p className="truncate text-[13.5px] font-semibold">
                {m.brand} ****{m.last4}
              </p>
              {m.isDefault && (
                <Badge tone="accent" className="text-[10.5px]">
                  기본
                </Badge>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {!m.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefault(m.id)}
                  className="rounded-[8px] border border-[var(--vl-border)] px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
                >
                  기본으로 설정
                </button>
              )}
              <button
                type="button"
                onClick={() => removeMethod(m.id)}
                className="flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--vl-danger)] transition-transform active:translate-y-[1px] active:opacity-70"
              >
                <Trash size={13} />
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <GhostButton onClick={() => setShowAddForm((v) => !v)}>
          <span className="flex items-center justify-center gap-1.5">
            <Plus size={15} weight="bold" />
            {showAddForm ? "카드 추가 취소" : "카드 추가"}
          </span>
        </GhostButton>
      </div>

      {showAddForm && (
        <div className="mt-4 space-y-3 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-4">
          <Field label="카드 번호">
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className={inputClass}
            />
          </Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="유효기간">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="CVC">
                <input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="000"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
          <PrimaryButton onClick={addMethod}>카드 등록하기</PrimaryButton>
        </div>
      )}
      <div className="h-8" />
    </div>
  );
}

/* ---------- 결제내역 ---------- */

const HISTORY_STATUS_TONE: Record<PaymentRecord["status"], "success" | "danger" | "neutral"> = {
  완료: "success",
  실패: "danger",
  환불: "neutral",
};

function HistoryTab() {
  const [records, setRecords] = useState<PaymentRecord[]>(() =>
    PAYMENT_RECORDS.map((r) => ({ ...r })),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function retry(id: string) {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: "완료" } : r)));
  }

  return (
    <div className="px-5 pt-5">
      <h2 className="text-[14px] font-bold">결제 내역</h2>
      <div className="mt-3 space-y-2">
        {records.map((r) => {
          const expanded = expandedId === r.id;
          return (
            <div
              key={r.id}
              className="overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : r.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold">{r.item}</p>
                  <p className="vl-num mt-0.5 text-[11.5px] text-[var(--vl-muted)]">
                    {r.paidAt} | {r.method}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="vl-num text-[14px] font-bold">{formatWon(r.amount)}원</p>
                  <div className="mt-1">
                    <Badge tone={HISTORY_STATUS_TONE[r.status]}>{r.status}</Badge>
                  </div>
                </div>
              </button>
              {expanded && (
                <div className="border-t border-[var(--vl-divider)] px-4 py-3">
                  <p className="vl-num text-[12px] text-[var(--vl-muted)]">
                    영수증 번호 {r.receiptId}
                  </p>
                  {r.status === "실패" && (
                    <button
                      type="button"
                      onClick={() => retry(r.id)}
                      className="mt-3 rounded-[8px] border border-[var(--vl-accent)] px-3 py-2 text-[12.5px] font-semibold text-[var(--vl-accent)] transition-transform active:translate-y-[1px] active:opacity-70"
                    >
                      결제 재시도
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
