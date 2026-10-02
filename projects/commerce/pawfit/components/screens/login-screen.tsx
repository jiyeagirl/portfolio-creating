"use client";

import { useState } from "react";
import {
  AppleLogo,
  ArrowRight,
  CaretLeft,
  Check,
  ChatCircleDots,
  Envelope,
  Gift,
  LockKey,
  PawPrint,
  User,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";
import { COUPONS, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import { Field, GhostButton, PrimaryButton, inputClass } from "@/projects/commerce/pawfit/components/ui";

type Mode = "login" | "signup" | "welcome";

const welcomeCoupon = COUPONS.find((c) => c.id === "cp-welcome")!;

export function LoginScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [mode, setMode] = useState<Mode>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canLogin = loginEmail.trim().length > 0 && loginPassword.length > 0;
  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const canSignup =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    !passwordMismatch &&
    agreed;

  if (mode === "welcome") {
    return (
      <div className="pf-enter flex min-h-full flex-col justify-between px-6 pb-8 pt-24">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pf-ink)] text-white">
            <Gift size={28} weight="fill" />
          </span>
          <h1 className="mt-5 text-[22px] font-medium leading-tight tracking-[-0.02em]">
            가입을 축하해요
            <br />
            {name.trim() || "회원"}님
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--pf-muted)]">
            PawFit에 오신 걸 환영해요. 첫 구매를 위한
            <br />
            쿠폰을 바로 지급해드렸어요.
          </p>

          <div className="mt-7 w-full rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-card)] p-5 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-ink)]/20 bg-[var(--pf-ink)]/[0.05] px-2.5 py-[3px] text-[11px] font-semibold text-[var(--pf-ink)]">
              웰컴 쿠폰
            </span>
            <p className="pf-num mt-3 text-[28px] font-medium tracking-[-0.02em]">
              {Math.round(welcomeCoupon.discount * 100)}% 할인
            </p>
            <p className="mt-1.5 text-[12.5px] text-[var(--pf-muted)]">
              {formatWon(welcomeCoupon.minAmount)}원 이상 구매 시 사용 가능,{" "}
              {welcomeCoupon.expiresAt.replaceAll("-", ".")}까지
            </p>
          </div>

          <p className="mt-7 text-[13.5px] leading-relaxed text-[var(--pf-body)]">
            반려동물을 등록하고 딱 맞는 사이즈를
            <br />
            추천받아보세요.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <PrimaryButton onClick={() => onNavigate("petProfile")}>
            <span className="inline-flex items-center justify-center gap-1.5">
              <PawPrint size={16} weight="fill" />
              반려동물 등록하고 사이즈 추천받기
            </span>
          </PrimaryButton>
          <GhostButton onClick={() => onNavigate("home")}>나중에 할게요</GhostButton>
        </div>
      </div>
    );
  }

  if (mode === "signup") {
    return (
      <div className="pf-enter flex min-h-full flex-col px-6 pb-8 pt-16">
        <button
          type="button"
          onClick={() => setMode("login")}
          aria-label="로그인으로 돌아가기"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--pf-ink)] transition-transform active:scale-[0.9]"
        >
          <CaretLeft size={20} weight="bold" />
        </button>

        <h1 className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.02em]">
          반가워요, 처음이시군요
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[var(--pf-muted)]">
          몇 가지 정보만 입력하면 바로 시작할 수 있어요.
        </p>

        <form
          className="mt-7 flex flex-1 flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSignup) setMode("welcome");
          }}
        >
          <Field label="이름">
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="반려동물 보호자님 성함"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <Field label="이메일">
            <div className="relative">
              <Envelope size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <Field label="비밀번호">
            <div className="relative">
              <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="영문, 숫자 포함 8자 이상"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <Field label="비밀번호 확인" error={passwordMismatch ? "비밀번호가 일치하지 않아요" : undefined}>
            <div className="relative">
              <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className={`${inputClass} pl-10 ${passwordMismatch ? "border-[var(--pf-error)]" : ""}`}
              />
            </div>
          </Field>

          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            className="mt-1 flex items-start gap-2.5 text-left"
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                agreed ? "border-[var(--pf-ink)] bg-[var(--pf-ink)]" : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
              }`}
            >
              {agreed && <Check size={12} weight="bold" className="text-white" />}
            </span>
            <span className="text-[13px] leading-snug text-[var(--pf-body)]">
              이용약관 및 개인정보처리방침에 동의합니다
            </span>
          </button>

          <div className="mt-auto pt-4">
            <PrimaryButton type="submit" disabled={!canSignup}>
              가입하고 시작하기
            </PrimaryButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pf-enter flex min-h-full flex-col px-6 pb-8 pt-24">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pf-ink)] text-white">
          <PawPrint size={24} weight="fill" />
        </span>
        <h1 className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.02em]">
          다시 만나 반가워요
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[var(--pf-muted)]">
          PawFit 계정으로 로그인하고 이어서 쇼핑해보세요
        </p>
      </div>

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canLogin) onNavigate("home");
        }}
      >
        <Field label="이메일">
          <div className="relative">
            <Envelope size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="example@email.com"
              className={`${inputClass} pl-10`}
            />
          </div>
        </Field>

        <Field label="비밀번호">
          <div className="relative">
            <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]" />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className={`${inputClass} pl-10`}
            />
          </div>
        </Field>

        <div className="mt-1">
          <PrimaryButton type="submit" disabled={!canLogin}>
            <span className="inline-flex items-center justify-center gap-1.5">
              로그인
              <ArrowRight size={15} weight="bold" />
            </span>
          </PrimaryButton>
        </div>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--pf-hairline)]" />
        <span className="text-[12px] text-[var(--pf-muted-soft)]">또는</span>
        <span className="h-px flex-1 bg-[var(--pf-hairline)]" />
      </div>

      <div className="flex flex-col gap-2.5">
        <GhostButton onClick={() => onNavigate("home")}>
          <span className="inline-flex items-center justify-center gap-2">
            <ChatCircleDots size={17} weight="fill" />
            카카오로 계속하기
          </span>
        </GhostButton>
        <GhostButton onClick={() => onNavigate("home")}>
          <span className="inline-flex items-center justify-center gap-2">
            <AppleLogo size={17} weight="fill" />
            Apple로 계속하기
          </span>
        </GhostButton>
      </div>

      <p className="mt-7 text-center text-[13px] text-[var(--pf-muted)]">
        아직 계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="font-semibold text-[var(--pf-ink)] underline underline-offset-2"
        >
          회원가입
        </button>
      </p>
    </div>
  );
}
