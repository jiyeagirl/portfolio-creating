"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "@phosphor-icons/react";
import { Button, Input } from "@/projects/b2b/orderlog/components/ui";
import { Mark } from "@/projects/b2b/orderlog/components/layout/mark";

type Step = "credential" | "otp";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState<Step>("credential");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="orderlog flex min-h-dvh items-center justify-center bg-[var(--ot-nav-bg)] px-6 py-12">
      <div className="w-full max-w-[400px] rounded-[10px] border border-[var(--ot-nav-border)] bg-[var(--ot-surface)] p-8 shadow-[var(--ot-shadow-pop)]">
        <div className="mb-7 flex items-center gap-2">
          <Mark size={24} />
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-[var(--ot-ink)]">
            OrderLog Admin
          </span>
        </div>

        {step === "credential" && (
          <div className="ot-enter">
            <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[var(--ot-ink)]">
              관리자 콘솔 로그인
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--ot-mute)]">
              계정/권한, 거래처, AI 룰, 접근 로그를 관리하는 마스터 전용 콘솔입니다.
              원청/납품처/거래처 콘솔과는 별도의 주소와 계정으로 접근합니다.
            </p>
            <div className="mt-6 space-y-3">
              <Input value={id} onChange={setId} placeholder="관리자 이메일" />
              <Input value={pw} onChange={setPw} placeholder="비밀번호" type="password" />
            </div>
            <div className="mt-6">
              <Button full size="lg" onClick={() => setStep("otp")} icon={<Lock size={15} weight="bold" />}>
                다음
              </Button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="ot-enter">
            <button
              type="button"
              onClick={() => setStep("credential")}
              className="mb-4 text-[12.5px] text-[var(--ot-mute)]"
            >
              ← 이전 단계
            </button>
            <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[var(--ot-ink)]">
              SMS 인증번호 6자리 입력
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--ot-mute)]">
              010-****-9021로 인증번호를 발송했습니다. (포트폴리오 목업 — 아무 숫자나
              입력해도 진행됩니다)
            </p>
            <div className="mt-6">
              <Input value={otp} onChange={setOtp} placeholder="123456" />
            </div>
            <div className="mt-6">
              <Button full size="lg" onClick={onLogin} icon={<ShieldCheck size={15} weight="bold" />}>
                인증하고 관리자 콘솔 접속
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
