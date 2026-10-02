"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  Cake,
  Check,
  Confetti,
  DeviceMobile,
  Envelope,
  LockKey,
  SealCheck,
  Sparkle,
  User,
} from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";
import { AppBar, Field, PrimaryButton, inputClass } from "@/projects/commerce/snowpeak/components/ui";

type Step = "terms" | "verify" | "account" | "push" | "done";

const STEP_ORDER: Step[] = ["terms", "verify", "account", "push"];
const STEP_TITLE: Record<Step, string> = {
  terms: "약관 동의",
  verify: "본인인증",
  account: "계정 정보",
  push: "알림 설정",
  done: "가입 완료",
};

type AgreementKey = "terms" | "privacy" | "age" | "marketing";

const AGREEMENT_ITEMS: { key: AgreementKey; label: string; required: boolean }[] = [
  { key: "terms", label: "서비스 이용약관 동의", required: true },
  { key: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
  { key: "age", label: "만 14세 이상입니다", required: true },
  { key: "marketing", label: "마케팅 정보 수신 동의(선택)", required: false },
];

function AgreementRow({
  label,
  checked,
  onClick,
  emphasized = false,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  emphasized?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
      <span
        className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
          checked ? "border-[var(--sp-accent)] bg-[var(--sp-accent)]" : "border-[var(--sp-border-strong)] bg-[var(--sp-surface)]"
        }`}
      >
        {checked && <Check size={12} weight="bold" className="text-white" />}
      </span>
      <span className={`text-[13.5px] ${emphasized ? "font-semibold text-[var(--sp-ink)]" : "text-[var(--sp-body)]"}`}>{label}</span>
    </button>
  );
}

function StepShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="px-6 pt-6">
        <h1 className="text-[21px] font-semibold leading-snug tracking-[-0.02em]">{title}</h1>
        <p className="mt-1.5 text-[13px] text-[var(--sp-mute)]">{subtitle}</p>
      </div>
      <div className="flex flex-1 flex-col px-6 pt-6">{children}</div>
      <div className="px-6 pb-2 pt-6">{footer}</div>
    </div>
  );
}

export function SignupScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [step, setStep] = useState<Step>("terms");

  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const [verifyName, setVerifyName] = useState("");
  const [verifyBirth, setVerifyBirth] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [verified, setVerified] = useState(false);

  const [accEmail, setAccEmail] = useState("");
  const [accPhone, setAccPhone] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [accPasswordConfirm, setAccPasswordConfirm] = useState("");

  const [pushReservation, setPushReservation] = useState(true);
  const [pushPromo, setPushPromo] = useState(false);

  const allAgreed = AGREEMENT_ITEMS.every((item) => agreements[item.key]);
  const requiredAgreed = AGREEMENT_ITEMS.filter((item) => item.required).every((item) => agreements[item.key]);

  function toggleAll() {
    const next = !allAgreed;
    setAgreements({ terms: next, privacy: next, age: next, marketing: next });
  }

  function toggleOne(key: AgreementKey) {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const canVerify = verifyName.trim().length > 0 && verifyBirth.trim().length >= 6 && verifyPhone.trim().length > 0;

  const passwordMismatch = accPasswordConfirm.length > 0 && accPassword !== accPasswordConfirm;
  const canCreateAccount =
    accEmail.trim().length > 0 &&
    accPhone.trim().length > 0 &&
    accPassword.length > 0 &&
    accPasswordConfirm.length > 0 &&
    !passwordMismatch;

  function goBack() {
    const idx = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);
    if (idx <= 0) {
      onNavigate("login");
      return;
    }
    setStep(STEP_ORDER[idx - 1]);
  }

  if (step === "done") {
    return (
      <div className="sp-enter flex min-h-full flex-col justify-between px-6 pb-8 pt-24">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sp-accent)] text-white">
            <Confetti size={28} weight="fill" />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold leading-snug tracking-[-0.02em]">
            {verifyName.trim() || "회원"}님,
            <br />
            SnowPeak 회원이 되신 것을 환영합니다
          </h1>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--sp-mute)]">
            객실, 리프트권, 장비 렌탈까지
            <br />
            하나의 장바구니에서 예약해보세요
          </p>

          <div className="mt-7 w-full rounded-[16px] bg-[var(--sp-surface)] p-5 text-left" style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sp-accent-soft)] px-2.5 py-[3px] text-[11px] font-semibold text-[var(--sp-accent)]">
              <Sparkle size={12} weight="fill" />
              화이트 등급으로 시작
            </span>
            <p className="mt-3 text-[15px] font-semibold text-[var(--sp-ink)]">첫 예약 웰컴 쿠폰이 지급되었어요</p>
            <p className="mt-1.5 text-[12.5px] text-[var(--sp-mute)]">
              10만원 이상 예약 시 2만원 할인, 마이페이지에서 바로 확인할 수 있어요
            </p>
          </div>
        </div>

        <PrimaryButton onClick={() => onNavigate("home")}>홈으로 가기</PrimaryButton>
      </div>
    );
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="sp-enter flex min-h-full flex-col">
      <AppBar title={STEP_TITLE[step]} onBack={goBack} />

      <div className="flex gap-1.5 px-6 pt-5">
        {STEP_ORDER.map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-[var(--sp-accent)]" : "bg-[var(--sp-surface-soft)]"}`}
          />
        ))}
      </div>

      {step === "terms" && (
        <StepShell
          title={
            <>
              서비스 이용을 위해
              <br />
              약관에 동의해주세요
            </>
          }
          subtitle="필수 항목에 동의하셔야 회원가입을 진행할 수 있어요"
          footer={
            <PrimaryButton disabled={!requiredAgreed} onClick={() => setStep("verify")}>
              다음
            </PrimaryButton>
          }
        >
          <button
            type="button"
            onClick={toggleAll}
            className={`flex w-full items-center gap-3 rounded-[14px] px-4 py-3.5 text-left transition-colors ${
              allAgreed ? "bg-[var(--sp-accent-soft)]" : "bg-[var(--sp-surface-soft)]"
            }`}
          >
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full transition-colors ${
                allAgreed ? "bg-[var(--sp-accent)]" : "bg-[var(--sp-border-strong)]"
              }`}
            >
              <Check size={13} weight="bold" className="text-white" />
            </span>
            <span className="text-[14.5px] font-semibold text-[var(--sp-ink)]">전체 동의</span>
          </button>

          <div className="mt-1 flex flex-col divide-y divide-[var(--sp-border)]">
            {AGREEMENT_ITEMS.map((item) => (
              <AgreementRow
                key={item.key}
                label={item.required ? `[필수] ${item.label}` : `[선택] ${item.label}`}
                checked={agreements[item.key]}
                onClick={() => toggleOne(item.key)}
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === "verify" && (
        <StepShell
          title="본인인증을 진행해주세요"
          subtitle="안전한 서비스 이용을 위해 본인 확인이 필요해요"
          footer={
            <PrimaryButton disabled={!verified} onClick={() => setStep("account")}>
              다음
            </PrimaryButton>
          }
        >
          <div className="flex flex-col gap-4">
            <Field label="이름">
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  value={verifyName}
                  onChange={(e) => {
                    setVerifyName(e.target.value);
                    setVerified(false);
                  }}
                  placeholder="실명을 입력해주세요"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="생년월일">
              <div className="relative">
                <Cake size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  value={verifyBirth}
                  onChange={(e) => {
                    setVerifyBirth(e.target.value);
                    setVerified(false);
                  }}
                  placeholder="19990101"
                  maxLength={8}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="휴대폰번호">
              <div className="relative">
                <DeviceMobile size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="tel"
                  value={verifyPhone}
                  onChange={(e) => {
                    setVerifyPhone(e.target.value);
                    setVerified(false);
                  }}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            {!verified ? (
              <PrimaryButton trailingIcon={false} disabled={!canVerify} onClick={() => setVerified(true)}>
                인증하기
              </PrimaryButton>
            ) : (
              <div className="flex items-center gap-2.5 rounded-[12px] bg-[var(--sp-success-soft)] px-4 py-3.5">
                <SealCheck size={18} weight="fill" className="text-[var(--sp-success)]" />
                <span className="text-[13.5px] font-semibold text-[var(--sp-success)]">인증이 완료되었습니다</span>
              </div>
            )}
          </div>
        </StepShell>
      )}

      {step === "account" && (
        <StepShell
          title="계정 정보를 입력해주세요"
          subtitle="로그인에 사용할 이메일과 비밀번호를 설정해요"
          footer={
            <PrimaryButton disabled={!canCreateAccount} onClick={() => setStep("push")}>
              다음
            </PrimaryButton>
          }
        >
          <div className="flex flex-col gap-4">
            <Field label="이메일">
              <div className="relative">
                <Envelope size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="email"
                  value={accEmail}
                  onChange={(e) => setAccEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="휴대폰번호">
              <div className="relative">
                <DeviceMobile size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="tel"
                  value={accPhone || verifyPhone}
                  onChange={(e) => setAccPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="비밀번호">
              <div className="relative">
                <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="password"
                  value={accPassword}
                  onChange={(e) => setAccPassword(e.target.value)}
                  placeholder="영문, 숫자 포함 8자 이상"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="비밀번호 확인" error={passwordMismatch ? "비밀번호가 일치하지 않아요" : undefined}>
              <div className="relative">
                <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="password"
                  value={accPasswordConfirm}
                  onChange={(e) => setAccPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className={`${inputClass} pl-10 ${passwordMismatch ? "border-[var(--sp-danger)]" : ""}`}
                />
              </div>
            </Field>
          </div>
        </StepShell>
      )}

      {step === "push" && (
        <StepShell
          title="알림을 받아보시겠어요?"
          subtitle="언제든 마이페이지에서 다시 변경할 수 있어요"
          footer={<PrimaryButton onClick={() => setStep("done")}>가입 완료하기</PrimaryButton>}
        >
          <div className="flex flex-col divide-y divide-[var(--sp-border)]">
            <div className="flex items-center gap-3 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-ink)]">
                <Bell size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[var(--sp-ink)]">예약 / 결제 알림</p>
                <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">예약 확정, 결제 완료 등 중요 알림을 받아요</p>
              </div>
              <Toggle
                checked={pushReservation}
                onChange={setPushReservation}
                label="예약 결제 알림 수신"
                onClassName="bg-[var(--sp-accent)]"
                offClassName="bg-[var(--sp-surface-soft)]"
              />
            </div>
            <div className="flex items-center gap-3 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-ink)]">
                <Sparkle size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[var(--sp-ink)]">이벤트 및 프로모션 알림</p>
                <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">할인 혜택과 시즌 이벤트 소식을 받아요</p>
              </div>
              <Toggle
                checked={pushPromo}
                onChange={setPushPromo}
                label="이벤트 프로모션 알림 수신"
                onClassName="bg-[var(--sp-accent)]"
                offClassName="bg-[var(--sp-surface-soft)]"
              />
            </div>
          </div>
        </StepShell>
      )}
    </div>
  );
}
