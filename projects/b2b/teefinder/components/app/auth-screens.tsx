"use client";

import { useState } from "react";
import { AppleLogo, ChatCircle, Check, Clock, Prohibit, WarningCircle } from "@phosphor-icons/react";
import { AppBar, Field, GhostButton, PrimaryButton } from "@/projects/b2b/teefinder/components/app/app-ui";
import { useStore } from "@/projects/b2b/teefinder/lib/store";

export function LoginScreen({ onSignup }: { onSignup: () => void }) {
  const { loginDemo } = useStore();
  return (
    <div className="tf-enter flex h-full flex-col bg-[var(--tf-canvas)] px-5 pb-[48px] pt-[120px]">
      <div className="flex-1">
        <p className="text-[32px] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--tf-brand)]">
          TeeFinder
        </p>
        <h1 className="mt-6 text-[26px] font-bold leading-[1.3] tracking-[-0.02em]">
          골프장 빈자리를
          <br />
          한 곳에서 확인해요
        </h1>
        <p className="mt-3 text-[16px] leading-6 text-[var(--tf-ink-2)]">
          회원권 회원 전용이에요. 승인 후 이용할 수 있어요.
        </p>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={loginDemo}
          className="tf-press flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#fee500] text-[16px] font-semibold text-[#191600] active:bg-[#f0d800]"
        >
          <ChatCircle size={22} weight="fill" />
          카카오로 로그인
        </button>
        <button
          type="button"
          onClick={loginDemo}
          className="tf-press flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--tf-ink)] text-[16px] font-semibold text-white active:bg-[#2c3a32]"
        >
          <AppleLogo size={22} weight="fill" />
          Apple로 로그인
        </button>
        <button
          type="button"
          onClick={onSignup}
          className="tf-press mx-auto flex h-11 items-center justify-center px-4 text-[15px] font-medium text-[var(--tf-ink-2)] underline underline-offset-4"
        >
          가입 신청하기
        </button>
      </div>
    </div>
  );
}

export function SignupScreen({ onBack }: { onBack: () => void }) {
  const { signUp } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipNo, setMembershipNo] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAccount, setAgreeAccount] = useState(false);

  const ready =
    name.trim() !== "" &&
    phone.trim().length >= 10 &&
    membershipNo.trim() !== "" &&
    agreeTerms &&
    agreeAccount;

  return (
    <div className="tf-enter flex h-full flex-col bg-[var(--tf-canvas)]">
      <AppBar title="가입 신청" onBack={onBack} />
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) signUp({ name: name.trim(), phone: phone.trim(), membershipNo: membershipNo.trim() });
        }}
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-6 pt-5">
          <Field label="이름" value={name} onChange={setName} placeholder="이름을 입력해 주세요" required />
          <Field
            label="휴대폰 번호"
            value={phone}
            onChange={setPhone}
            placeholder="010-0000-0000"
            inputMode="tel"
            required
          />
          <Field
            label="회원권 번호"
            value={membershipNo}
            onChange={setMembershipNo}
            placeholder="TF-0000-0000"
            required
          />
          <div className="space-y-1 pt-2">
            <Agree checked={agreeTerms} onChange={setAgreeTerms} label="서비스 이용약관과 개인정보 처리방침에 동의해요" />
            <Agree
              checked={agreeAccount}
              onChange={setAgreeAccount}
              label="골프장 계정 정보를 암호화해 보관하는 것에 동의해요"
            />
          </div>
        </div>
        <div className="border-t border-[var(--tf-line)] bg-[var(--tf-surface)] px-5 pb-[48px] pt-3">
          <PrimaryButton type="submit" disabled={!ready}>
            가입 신청
          </PrimaryButton>
          {!ready && (
            <p className="mt-2 text-center text-[13px] text-[var(--tf-ink-3)]">
              모든 항목을 입력하고 두 가지 동의에 체크해 주세요
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function Agree({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      className="flex min-h-[48px] w-full items-center gap-3 text-left"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border ${
          checked
            ? "border-[var(--tf-brand)] bg-[var(--tf-brand)] text-white"
            : "border-[var(--tf-line)] bg-[var(--tf-surface)] text-transparent"
        }`}
      >
        <Check size={16} weight="bold" />
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-[22px] text-[var(--tf-ink-2)]">{label}</span>
    </button>
  );
}

function DemoToggle() {
  const { session, setMemberStatus } = useStore();
  if (!session) return null;
  return (
    <div className="mx-auto flex w-fit items-center gap-1 rounded-[10px] bg-[var(--tf-soft)] p-1 text-[13px]">
      <span className="px-2 text-[var(--tf-ink-3)]">(시연)</span>
      <button
        type="button"
        onClick={() => setMemberStatus(session.id, "정상")}
        className="h-9 rounded-[8px] px-3 font-medium text-[var(--tf-ink-2)] active:bg-[var(--tf-pressed)]"
      >
        승인됨
      </button>
      <button
        type="button"
        onClick={() => setMemberStatus(session.id, "반려")}
        className="h-9 rounded-[8px] px-3 font-medium text-[var(--tf-ink-2)] active:bg-[var(--tf-pressed)]"
      >
        반려로 전환
      </button>
    </div>
  );
}

/* 승인 전에는 어느 탭을 눌러도 이 화면으로 돌아온다 */
export function PendingScreen() {
  const { session, logout } = useStore();
  if (!session) return null;
  return (
    <div className="tf-enter flex h-full flex-col bg-[var(--tf-canvas)] px-5 pb-[48px] pt-[96px]">
      <div className="flex flex-1 flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tf-orange-bg)] text-[var(--tf-orange-fg)]">
          <Clock size={32} weight="fill" />
        </span>
        <h1 className="mt-6 text-[24px] font-bold leading-[1.3] tracking-[-0.02em]">
          가입 승인을 기다리고 있어요
        </h1>
        <p className="mt-3 text-[16px] leading-6 text-[var(--tf-ink-2)]">
          {session.name}님의 회원권 정보를 확인하는 중이에요. 승인되면 바로 이용할 수 있어요.
        </p>
        <dl className="mt-8 w-full divide-y divide-[var(--tf-line)] border-y border-[var(--tf-line)] text-left text-[15px]">
          <div className="flex min-h-[48px] items-center justify-between">
            <dt className="text-[var(--tf-ink-3)]">신청일</dt>
            <dd className="font-medium">{session.joinedAt}</dd>
          </div>
          <div className="flex min-h-[48px] items-center justify-between">
            <dt className="text-[var(--tf-ink-3)]">회원권 번호</dt>
            <dd className="tf-mono font-medium">{session.membershipNo}</dd>
          </div>
          <div className="flex min-h-[48px] items-center justify-between">
            <dt className="text-[var(--tf-ink-3)]">연락처</dt>
            <dd className="font-medium">{session.phone}</dd>
          </div>
        </dl>
      </div>
      <div className="space-y-4">
        <DemoToggle />
        <GhostButton onClick={logout}>다른 계정으로 로그인</GhostButton>
      </div>
    </div>
  );
}

export function RejectedScreen() {
  const { session, resubmit } = useStore();
  if (!session) return null;
  const suspended = session.status === "이용 정지";
  return (
    <div className="tf-enter flex h-full flex-col bg-[var(--tf-canvas)] px-5 pb-[48px] pt-[96px]">
      <div className="flex flex-1 flex-col items-center text-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full ${
            suspended
              ? "bg-[var(--tf-gray-bg)] text-[var(--tf-gray-fg)]"
              : "bg-[var(--tf-red-bg)] text-[var(--tf-red-fg)]"
          }`}
        >
          {suspended ? <Prohibit size={32} weight="fill" /> : <WarningCircle size={32} weight="fill" />}
        </span>
        <h1 className="mt-6 text-[24px] font-bold leading-[1.3] tracking-[-0.02em]">
          {suspended ? "이용이 정지되었어요" : "가입 신청이 반려되었어요"}
        </h1>
        <div className="mt-6 w-full rounded-[14px] border border-[var(--tf-line)] bg-[var(--tf-surface)] p-4 text-left">
          <p className="text-[13px] font-medium text-[var(--tf-ink-3)]">{suspended ? "정지 사유" : "반려 사유"}</p>
          <p className="mt-1.5 text-[16px] leading-6 text-[var(--tf-ink)]">
            {suspended ? session.suspendReason : session.rejectReason}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {!suspended && <DemoToggle />}
        {!suspended && <PrimaryButton onClick={resubmit}>재신청</PrimaryButton>}
      </div>
    </div>
  );
}
