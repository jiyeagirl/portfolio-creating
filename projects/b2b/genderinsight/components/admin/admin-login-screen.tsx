"use client";

import { useState } from "react";
import { ArrowLeft, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { Button, Input, Toggle } from "@/projects/b2b/genderinsight/components/ui";
import { Mark } from "@/projects/b2b/genderinsight/components/layout/mark";

type View = "credential" | "reset" | "reset-sent";

export function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<View>("credential");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [failCount, setFailCount] = useState(0);

  const submit = () => {
    if (!email.trim() || !password.trim()) {
      const next = failCount + 1;
      setFailCount(next);
      setError(
        next >= 5
          ? "5회 연속 로그인에 실패해 계정이 30분간 잠겼습니다. 보안 정책에 따라 잠시 후 다시 시도해주세요."
          : "이메일과 비밀번호를 모두 입력해주세요.",
      );
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <div className="genderinsight relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--gi-soft)] px-6 py-12">
      <div className="gi-spot" />
      <div className="w-full max-w-[400px] rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-8 shadow-[var(--gi-shadow-pop)]">
        <div className="mb-7 flex items-center gap-2">
          <Mark size={24} />
          <p className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--gi-ink)]">
            GenderInsight Admin
          </p>
        </div>

        {view === "credential" && (
          <div className="gi-enter">
            <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[var(--gi-ink)]">
              관리자 콘솔 로그인
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--gi-mute)]">
              진단 운영, 참여자 관리, 결과 분석 권한을 가진 관리자 전용 콘솔입니다. 참여자
              콘솔과는 별도의 주소와 계정으로 접근합니다.
            </p>

            <div className="mt-6 space-y-3">
              <Input value={email} onChange={setEmail} placeholder="관리자 이메일" type="email" />
              <Input value={password} onChange={setPassword} placeholder="비밀번호" type="password" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[13px] text-[var(--gi-body)]">로그인 상태 유지</span>
              <Toggle on={remember} onChange={() => setRemember((prev) => !prev)} label="로그인 상태 유지" />
            </div>

            <button
              type="button"
              onClick={() => setView("reset")}
              className="mt-3 text-[12.5px] text-[var(--gi-accent-deep)] underline underline-offset-2"
            >
              비밀번호를 잊으셨나요?
            </button>

            {error && (
              <p className="mt-4 rounded-[6px] border border-[var(--gi-danger-soft)] bg-[var(--gi-danger-soft)] px-3 py-2.5 text-[12.5px] leading-5 text-[var(--gi-danger-deep)]">
                {error}
              </p>
            )}

            <div className="mt-6">
              <Button full size="lg" onClick={submit} icon={<LockKey size={15} weight="bold" />}>
                로그인
              </Button>
            </div>

            <p className="mt-4 text-[11.5px] leading-4 text-[var(--gi-mute)]">
              보안 정책: 5회 연속 로그인 실패 시 계정이 30분간 잠기며, 관리자 활동은 감사 로그에
              기록됩니다. 데모 화면에서는 이메일/비밀번호를 모두 입력하면 진행됩니다.
            </p>
          </div>
        )}

        {view === "reset" && (
          <div className="gi-enter">
            <button
              type="button"
              onClick={() => setView("credential")}
              className="mb-4 flex items-center gap-1 text-[12.5px] text-[var(--gi-mute)]"
            >
              <ArrowLeft size={13} />
              이전 단계
            </button>
            <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[var(--gi-ink)]">
              비밀번호 재설정
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--gi-mute)]">
              가입한 관리자 이메일로 재설정 링크를 보내드립니다.
            </p>
            <div className="mt-6">
              <Input value={resetEmail} onChange={setResetEmail} placeholder="관리자 이메일" type="email" />
            </div>
            <div className="mt-6">
              <Button
                full
                size="lg"
                onClick={() => setView("reset-sent")}
                disabled={!resetEmail.trim()}
              >
                재설정 링크 발송
              </Button>
            </div>
          </div>
        )}

        {view === "reset-sent" && (
          <div className="gi-enter text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gi-accent-soft)]">
              <ShieldCheck size={22} weight="bold" className="text-[var(--gi-accent-deep)]" />
            </span>
            <h1 className="mt-4 text-[18px] font-semibold leading-7 tracking-[-0.02em] text-[var(--gi-ink)]">
              재설정 링크를 발송했습니다
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[var(--gi-mute)]">
              {resetEmail || "입력한 이메일"}로 비밀번호 재설정 안내를 보냈습니다. 메일함을
              확인해주세요.
            </p>
            <button
              type="button"
              onClick={() => setView("credential")}
              className="mt-6 text-[13px] font-medium text-[var(--gi-accent-deep)] underline underline-offset-2"
            >
              로그인으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
