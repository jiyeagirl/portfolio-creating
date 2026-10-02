"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AppleLogo,
  Car,
  Check,
  CheckCircle,
  ChatCircleDots,
  ShieldCheck,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import { AppBar, Field, PrimaryButton, inputClass } from "@/projects/platform/veli/components/ui";

type SignupStep = "login" | "signupTerms" | "signupVerify" | "signupVehicle" | "signupDone";

/* 발급 안내 화면에서만 쓰는 고정 목업 번호. 실제 발급 로직 없이 신규 가입 완료 상태를 보여준다. */
const ISSUED_NUMBER = "070-9931-4482";

function Checkbox({
  checked,
  onChange,
  label,
  tone = "default",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  tone?: "default" | "emphasis";
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 text-left ${
        tone === "emphasis" ? "py-3" : "py-2.5"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[8px] border transition-colors ${
          checked
            ? "border-[var(--vl-accent)] bg-[var(--vl-accent)] text-white"
            : "border-[var(--vl-border)] bg-[var(--vl-elevated)] text-transparent"
        }`}
      >
        <Check size={12} weight="bold" />
      </span>
      <span
        className={`flex-1 text-[13.5px] ${
          tone === "emphasis" ? "font-bold text-[var(--vl-ink)]" : "font-normal text-[var(--vl-ink)]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export function LoginScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [step, setStep] = useState<SignupStep>("login");

  /* 로그인 폼 상태 */
  const [loginMode, setLoginMode] = useState<"phone" | "email">("phone");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [autoLogin, setAutoLogin] = useState(true);
  const canLogin = loginId.trim().length >= 4 && loginPw.trim().length >= 4;

  /* 약관 동의 상태 */
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const allRequired = agreeTerms && agreePrivacy && agreeLocation;
  const allChecked = allRequired && agreeMarketing;

  /* 본인인증 상태 */
  const [phoneInput, setPhoneInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [verified, setVerified] = useState(false);
  const canSendCode = phoneInput.replace(/\D/g, "").length >= 10;
  const canVerify = codeInput.replace(/\D/g, "").length === 6;

  /* 차량 등록 상태 */
  const [plateInput, setPlateInput] = useState("");

  if (step === "signupTerms") {
    return (
      <div className="vl-enter flex min-h-full flex-col">
        <AppBar title="약관 동의" onBack={() => setStep("login")} />
        <div className="flex-1 px-5 pb-8 pt-5">
          <p className="text-[13.5px] leading-relaxed text-[var(--vl-muted)]">
            안심번호 발급과 차량 정보 등록을 위해 아래 약관에 동의해 주세요.
          </p>

          <div className="mt-5 rounded-[12px] border border-[var(--vl-border)] px-4">
            <Checkbox
              tone="emphasis"
              checked={allChecked}
              onChange={(next) => {
                setAgreeTerms(next);
                setAgreePrivacy(next);
                setAgreeLocation(next);
                setAgreeMarketing(next);
              }}
              label="전체 동의"
            />
            <div className="h-px bg-[var(--vl-divider)]" />
            <Checkbox
              checked={agreeTerms}
              onChange={setAgreeTerms}
              label={
                <>
                  <span className="font-semibold text-[var(--vl-accent)]">필수</span> 서비스 이용약관 동의
                </>
              }
            />
            <Checkbox
              checked={agreePrivacy}
              onChange={setAgreePrivacy}
              label={
                <>
                  <span className="font-semibold text-[var(--vl-accent)]">필수</span> 개인정보 처리방침 동의
                </>
              }
            />
            <Checkbox
              checked={agreeLocation}
              onChange={setAgreeLocation}
              label={
                <>
                  <span className="font-semibold text-[var(--vl-accent)]">필수</span> 위치기반서비스 이용약관 동의
                </>
              }
            />
            <Checkbox
              checked={agreeMarketing}
              onChange={setAgreeMarketing}
              label={
                <>
                  <span className="font-semibold text-[var(--vl-muted)]">선택</span> 마케팅 정보 수신 동의
                </>
              }
            />
          </div>
        </div>
        <div className="px-5 pb-10">
          <PrimaryButton disabled={!allRequired} onClick={() => setStep("signupVerify")}>
            다음
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (step === "signupVerify") {
    return (
      <div className="vl-enter flex min-h-full flex-col">
        <AppBar title="휴대폰 본인인증" onBack={() => setStep("signupTerms")} />
        <div className="flex-1 px-5 pb-8 pt-5">
          <p className="text-[13.5px] leading-relaxed text-[var(--vl-muted)]">
            안심번호는 본인 명의 휴대폰 인증 후 발급할 수 있습니다.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <Field label="휴대폰 번호">
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="010-0000-0000"
                  inputMode="numeric"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!canSendCode}
                  onClick={() => setCodeSent(true)}
                  className="shrink-0 rounded-full border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 text-[13px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70 disabled:cursor-not-allowed disabled:text-[var(--vl-muted)]"
                >
                  인증번호 받기
                </button>
              </div>
            </Field>

            {codeSent && (
              <Field
                label="인증번호"
                helper={!verified ? "발송된 인증번호 6자리를 입력해 주세요" : undefined}
              >
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} vl-num`}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={!canVerify}
                    onClick={() => setVerified(true)}
                    className="shrink-0 rounded-full bg-[var(--vl-accent)] px-4 text-[13px] font-bold text-[var(--vl-accent-fg)] transition-transform active:translate-y-[1px] active:opacity-70 disabled:cursor-not-allowed disabled:bg-[var(--vl-surface)] disabled:text-[var(--vl-muted)]"
                  >
                    인증하기
                  </button>
                </div>
              </Field>
            )}

            {verified && (
              <div className="flex items-center gap-2 rounded-[12px] bg-[var(--vl-success-soft)] px-4 py-3 text-[13px] font-semibold text-[var(--vl-success)]">
                <CheckCircle size={17} weight="fill" />
                본인인증이 완료되었습니다
              </div>
            )}
          </div>
        </div>
        <div className="px-5 pb-10">
          <PrimaryButton disabled={!verified} onClick={() => setStep("signupVehicle")}>
            다음
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (step === "signupVehicle") {
    return (
      <div className="vl-enter flex min-h-full flex-col">
        <AppBar title="차량번호 등록" onBack={() => setStep("signupVerify")} />
        <div className="flex-1 px-5 pb-8 pt-5">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
              <Car size={26} weight="fill" />
            </span>
            <p className="text-[13.5px] leading-relaxed text-[var(--vl-muted)]">
              차량번호를 등록하면 이 차량에 연결된
              <br />
              070 안심번호가 자동으로 발급됩니다
            </p>
          </div>
          <Field label="차량번호" helper="등록한 차량번호와 안심번호가 서로 연결됩니다">
            <input
              className={`${inputClass} vl-num`}
              placeholder="예: 24가 7745"
              value={plateInput}
              onChange={(e) => setPlateInput(e.target.value)}
            />
          </Field>
        </div>
        <div className="px-5 pb-10">
          <PrimaryButton disabled={!plateInput.trim()} onClick={() => setStep("signupDone")}>
            안심번호 발급받기
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (step === "signupDone") {
    return (
      <div className="vl-enter flex min-h-full flex-col justify-between px-6 pb-10 pt-24 text-center">
        <div className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
            <ShieldCheck size={38} weight="fill" />
          </span>
          <h1 className="mt-5 text-[21px] font-bold tracking-tight">안심번호가 발급되었습니다</h1>
          <p className="vl-num mt-3 text-[26px] font-bold tracking-tight text-[var(--vl-accent)]">
            {ISSUED_NUMBER}
          </p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--vl-muted)]">
            등록하신 <span className="vl-num font-semibold text-[var(--vl-ink)]">{plateInput || "24가 7745"}</span> 차량에
            <br />
            안심번호가 연결되었습니다. 앞으로 이 번호로
            <br />
            걸려오는 전화만 실제 번호 노출 없이 받을 수 있습니다.
          </p>
        </div>
        <PrimaryButton onClick={() => onNavigate("home")}>시작하기</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="vl-enter flex min-h-full flex-col px-6 pb-10 pt-20">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
          <ShieldCheck size={30} weight="fill" />
        </span>
        <h1 className="mt-4 text-[22px] font-bold tracking-tight">veli</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--vl-muted)]">
          차량번호와 연결된 070 안심번호로
          <br />
          실제 번호 노출 없이 연락만 받으세요
        </p>
      </div>

      <div className="mt-9 flex flex-col gap-3">
        <div className="flex rounded-full bg-[var(--vl-surface)] p-1">
          <button
            type="button"
            onClick={() => setLoginMode("phone")}
            className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
              loginMode === "phone"
                ? "bg-[var(--vl-elevated)] text-[var(--vl-ink)]"
                : "text-[var(--vl-muted)]"
            }`}
          >
            휴대폰 번호
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("email")}
            className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
              loginMode === "email"
                ? "bg-[var(--vl-elevated)] text-[var(--vl-ink)]"
                : "text-[var(--vl-muted)]"
            }`}
          >
            이메일
          </button>
        </div>

        <Field label={loginMode === "phone" ? "휴대폰 번호" : "이메일"}>
          <input
            className={inputClass}
            placeholder={loginMode === "phone" ? "010-0000-0000" : "you@example.com"}
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </Field>
        <Field label="비밀번호">
          <input
            type="password"
            className={inputClass}
            placeholder="비밀번호를 입력하세요"
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
          />
        </Field>

        <Checkbox checked={autoLogin} onChange={setAutoLogin} label="자동 로그인" />

        <PrimaryButton disabled={!canLogin} onClick={() => onNavigate("home")}>
          로그인
        </PrimaryButton>

        <div className="flex items-center justify-center gap-2.5 pt-1 text-[12.5px] text-[var(--vl-muted)]">
          <button type="button" className="font-semibold">
            아이디 찾기
          </button>
          <span className="h-3 w-px bg-[var(--vl-border)]" aria-hidden />
          <button type="button" className="font-semibold">
            비밀번호 찾기
          </button>
          <span className="h-3 w-px bg-[var(--vl-border)]" aria-hidden />
          <button
            type="button"
            onClick={() => setStep("signupTerms")}
            className="font-semibold text-[var(--vl-accent)]"
          >
            회원가입
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--vl-divider)]" aria-hidden />
          <span className="text-[11.5px] font-semibold text-[var(--vl-muted)]">간편 로그인</span>
          <span className="h-px flex-1 bg-[var(--vl-divider)]" aria-hidden />
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center justify-center gap-2 rounded-full border border-[var(--vl-border)] bg-[var(--vl-elevated)] py-3.5 text-[14px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
          >
            <ChatCircleDots size={17} weight="fill" className="text-[var(--vl-muted)]" />
            카카오로 계속하기
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center justify-center gap-2 rounded-full border border-[var(--vl-border)] bg-[var(--vl-elevated)] py-3.5 text-[14px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
          >
            <AppleLogo size={17} weight="fill" className="text-[var(--vl-muted)]" />
            Apple로 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
