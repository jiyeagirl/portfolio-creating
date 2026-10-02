"use client";

import { useState } from "react";
import type { NavigateFn, VerveView } from "@/projects/commerce/verve/lib/navigation";
import { Button, Checkbox, Field, TextInput } from "@/projects/commerce/verve/components/ui";

export function AuthScreen({ mode, onNavigate }: { mode: Extract<VerveView, "login" | "signup">; onNavigate: NavigateFn }) {
  const [findPassword, setFindPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [sent, setSent] = useState(false);

  if (findPassword) {
    return (
      <div className="verve-light flex min-h-[80dvh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-[380px]">
          <h1 className="text-[24px] font-medium tracking-[-0.3px] text-[var(--v-body-on-light)]">비밀번호 찾기</h1>
          <p className="mt-2 text-[13px] text-[var(--v-muted)]">가입한 이메일로 재설정 링크를 보내드려요.</p>
          <div className="mt-8 space-y-4">
            <Field label="이메일" tone="light">
              <TextInput tone="light" type="email" placeholder="you@example.com" />
            </Field>
            <Button
              tone="light"
              className="w-full"
              onClick={() => {
                setSent(true);
                window.setTimeout(() => setSent(false), 2000);
              }}
            >
              {sent ? "메일을 보냈어요" : "재설정 링크 받기"}
            </Button>
            <button type="button" onClick={() => setFindPassword(false)} className="w-full text-center text-[12px] text-[var(--v-muted)] underline underline-offset-4">
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verve-light flex min-h-[80dvh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[380px]">
        <h1 className="text-[24px] font-medium tracking-[-0.3px] text-[var(--v-body-on-light)]">{mode === "login" ? "로그인" : "회원가입"}</h1>
        <p className="mt-2 text-[13px] text-[var(--v-muted)]">
          {mode === "login" ? "VERVE 계정으로 로그인하세요." : "가입하고 첫 구매 15% 할인 쿠폰을 받아보세요."}
        </p>

        <div className="mt-8 space-y-4">
          <Field label="이메일" tone="light">
            <TextInput tone="light" type="email" placeholder="you@example.com" />
          </Field>
          <Field label="비밀번호" tone="light">
            <TextInput tone="light" type="password" placeholder="8자 이상 입력해주세요" />
          </Field>
          {mode === "signup" && (
            <Field label="비밀번호 확인" tone="light">
              <TextInput tone="light" type="password" placeholder="비밀번호를 다시 입력해주세요" />
            </Field>
          )}

          {mode === "signup" && (
            <div className="space-y-2 pt-2">
              <Checkbox tone="light" checked={agreedTerms} onChange={setAgreedTerms} label="이용약관 동의 (필수)" />
              <Checkbox tone="light" checked={agreedPrivacy} onChange={setAgreedPrivacy} label="개인정보 수집 및 이용 동의 (필수)" />
            </div>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button type="button" onClick={() => setFindPassword(true)} className="text-[12px] text-[var(--v-muted)] underline underline-offset-4">
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}

          <Button
            tone="light"
            className="w-full"
            disabled={mode === "signup" && (!agreedTerms || !agreedPrivacy)}
            onClick={() => onNavigate("home")}
          >
            {mode === "login" ? "로그인" : "가입하기"}
          </Button>

          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-[var(--v-hairline-on-light)]" />
            <span className="text-[11px] text-[var(--v-muted)]">또는</span>
            <div className="h-px flex-1 bg-[var(--v-hairline-on-light)]" />
          </div>

          <div className="space-y-2">
            <button type="button" onClick={() => onNavigate("home")} className="flex h-12 w-full items-center justify-center bg-[#fee500] text-[13px] font-semibold text-[#181818]">
              카카오로 계속하기
            </button>
            <button type="button" onClick={() => onNavigate("home")} className="flex h-12 w-full items-center justify-center bg-[#03c75a] text-[13px] font-semibold text-white">
              네이버로 계속하기
            </button>
          </div>

          <p className="pt-2 text-center text-[12px] text-[var(--v-muted)]">
            {mode === "login" ? (
              <>
                아직 계정이 없으신가요?{" "}
                <button type="button" onClick={() => onNavigate("signup")} className="font-medium text-[var(--v-body-on-light)] underline underline-offset-4">
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{" "}
                <button type="button" onClick={() => onNavigate("login")} className="font-medium text-[var(--v-body-on-light)] underline underline-offset-4">
                  로그인
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
