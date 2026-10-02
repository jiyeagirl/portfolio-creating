"use client";

import { useState } from "react";
import { CaretLeft, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";
import { Button, Field, Input } from "@/projects/monitoring/petlive/components/ui";
import type { Navigate } from "@/projects/monitoring/petlive/lib/navigation";

export function ForgotPasswordScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="pl-enter flex min-h-full flex-col px-6 pb-10 pt-16">
      <button
        type="button"
        onClick={() => onNavigate("login")}
        aria-label="로그인으로 돌아가기"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pl-canvas-soft)] text-[var(--pl-ink)]"
      >
        <CaretLeft size={18} weight="bold" />
      </button>

      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pl-positive-soft)] text-[var(--pl-positive-deep)]">
            <CheckCircle size={32} weight="fill" />
          </span>
          <h1 className="mt-6 text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[var(--pl-ink)]">
            메일을 보냈어요
          </h1>
          <p className="mt-2 max-w-[26ch] text-[14px] leading-[20px] text-[var(--pl-mute)]">
            <span className="font-medium text-[var(--pl-body)]">{email}</span>
            {"(으)로 재설정 링크를 보냈어요. 메일함을 확인해주세요."}
          </p>

          <div className="mt-9 w-full">
            <Button full size="lg" onClick={() => onNavigate("login")}>
              로그인으로 돌아가기
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-9">
          <h1 className="text-[26px] font-extrabold leading-[32px] tracking-[-0.02em] text-[var(--pl-ink)]">
            비밀번호를
            <br />
            재설정해요
          </h1>
          <p className="mt-2 text-[14px] leading-[20px] text-[var(--pl-mute)]">
            가입하신 이메일로 재설정 링크를 보내드릴게요.
          </p>

          <div className="mt-8 space-y-4">
            <Field label="이메일">
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                suffix={<EnvelopeSimple size={17} className="text-[var(--pl-mute)]" />}
              />
            </Field>
          </div>

          <div className="mt-7">
            <Button full size="lg" disabled={!email} onClick={() => setSent(true)}>
              재설정 링크 보내기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
