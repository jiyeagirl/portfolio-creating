"use client";

import { useState } from "react";
import { User, EnvelopeSimple, Eye, EyeSlash, Phone, Check } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Field, Input } from "@/projects/monitoring/petlive/components/ui";
import type { Navigate } from "@/projects/monitoring/petlive/lib/navigation";

function AgreeCheck({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[8px] border transition-colors ${
        checked
          ? "border-[var(--pl-accent)] bg-[var(--pl-accent)] text-[var(--pl-on-accent)]"
          : "border-[var(--pl-hairline-strong)] text-transparent"
      }`}
    >
      <Check size={13} weight="bold" />
    </span>
  );
}

function AgreeRow({
  label,
  required,
  checked,
  onToggle,
}: {
  label: string;
  required: boolean;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <button type="button" onClick={onToggle} className="flex min-w-0 items-center gap-2.5">
        <AgreeCheck checked={checked} />
        <span className="truncate text-[14px] text-[var(--pl-ink)]">
          {label} <span className="text-[var(--pl-mute)]">{required ? "(필수)" : "(선택)"}</span>
        </span>
      </button>
      <button type="button" className="shrink-0 text-[12.5px] font-medium text-[var(--pl-mute)]">
        보기
      </button>
    </div>
  );
}

export function SignupScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const canProceedStep1 =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.length >= 8 &&
    password === confirmPassword &&
    phone.trim() !== "" &&
    codeSent &&
    smsCode.trim().length > 0;

  const allAgreed = agreeTerms && agreePrivacy && agreeMarketing;
  const canComplete = agreeTerms && agreePrivacy;

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreeTerms(next);
    setAgreePrivacy(next);
    setAgreeMarketing(next);
  };

  return (
    <div className="pl-enter flex min-h-full flex-col">
      <ScreenHeader
        title="회원가입"
        onBack={step === 1 ? () => onNavigate("login") : () => setStep(1)}
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        titleClassName="text-[16px] font-bold tracking-[-0.01em] text-[var(--pl-ink)]"
      />

      <div className="flex flex-1 flex-col px-6 pb-10 pt-6">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[var(--pl-accent)]" : "bg-[var(--pl-hairline)]"}`} />
          <span className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[var(--pl-accent)]" : "bg-[var(--pl-hairline)]"}`} />
        </div>
        <p className="mt-2 text-[12px] font-medium text-[var(--pl-mute)]">STEP {step} / 2</p>

        {step === 1 ? (
          <>
            <h1 className="mt-5 text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[var(--pl-ink)]">
              기본 정보를 입력해주세요
            </h1>
            <p className="mt-2 text-[14px] leading-[20px] text-[var(--pl-mute)]">
              PetLive 이용을 위해 본인 인증까지 진행할게요.
            </p>

            <div className="mt-7 space-y-4">
              <Field label="이름">
                <Input
                  value={name}
                  onChange={setName}
                  placeholder="박서연"
                  suffix={<User size={17} className="text-[var(--pl-mute)]" />}
                />
              </Field>

              <Field label="이메일">
                <Input
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  suffix={<EnvelopeSimple size={17} className="text-[var(--pl-mute)]" />}
                />
              </Field>

              <Field label="비밀번호" hint="영문, 숫자를 포함해 8자 이상 입력하세요">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                      className="text-[var(--pl-mute)]"
                    >
                      {showPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </Field>

              <div>
                <Field label="비밀번호 확인">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                        className="text-[var(--pl-mute)]"
                      >
                        {showConfirmPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />
                </Field>
                {passwordMismatch && (
                  <p className="mt-1.5 text-[12px] leading-4 text-[var(--pl-negative)]">
                    비밀번호가 일치하지 않습니다
                  </p>
                )}
              </div>

              <Field label="휴대폰 번호">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(v) => {
                        setPhone(v);
                        setCodeSent(false);
                        setSmsCode("");
                      }}
                      placeholder="010-2456-7781"
                      suffix={<Phone size={17} className="text-[var(--pl-mute)]" />}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={phone.trim() === ""}
                    onClick={() => setCodeSent(true)}
                  >
                    {codeSent ? "재전송" : "인증번호 전송"}
                  </Button>
                </div>
              </Field>

              {codeSent && (
                <Field label="인증번호" hint="문자로 전송된 6자리 번호를 입력하세요">
                  <Input
                    type="tel"
                    value={smsCode}
                    onChange={setSmsCode}
                    placeholder="000000"
                  />
                </Field>
              )}
            </div>

            <div className="mt-8">
              <Button full size="lg" disabled={!canProceedStep1} onClick={() => setStep(2)}>
                다음
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[var(--pl-ink)]">
              약관에 동의해주세요
            </h1>
            <p className="mt-2 text-[14px] leading-[20px] text-[var(--pl-mute)]">
              안전한 서비스 이용을 위해 아래 약관을 확인하고 동의해주세요.
            </p>

            <div className="mt-7">
              <button
                type="button"
                onClick={toggleAll}
                className="flex w-full items-center gap-2.5 rounded-[18px] bg-[var(--pl-canvas-soft)] px-4 py-4"
              >
                <AgreeCheck checked={allAgreed} />
                <span className="text-[15px] font-semibold text-[var(--pl-ink)]">전체 동의</span>
              </button>

              <div className="mt-1 divide-y divide-[var(--pl-hairline)] px-1">
                <AgreeRow
                  label="서비스 이용약관 동의"
                  required
                  checked={agreeTerms}
                  onToggle={() => setAgreeTerms((v) => !v)}
                />
                <AgreeRow
                  label="개인정보 수집 및 이용 동의"
                  required
                  checked={agreePrivacy}
                  onToggle={() => setAgreePrivacy((v) => !v)}
                />
                <AgreeRow
                  label="마케팅 정보 수신 동의"
                  required={false}
                  checked={agreeMarketing}
                  onToggle={() => setAgreeMarketing((v) => !v)}
                />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Button full size="lg" disabled={!canComplete} onClick={() => onNavigate("home")}>
                가입 완료
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
