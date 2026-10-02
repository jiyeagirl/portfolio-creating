"use client";

import { useState } from "react";
import { Buildings, EnvelopeSimple, LockSimple, Eye, EyeSlash, AppleLogo } from "@phosphor-icons/react";
import { Button, Field, Input, Toggle } from "@/projects/platform/studyspot/components/ui";
import type { Navigate } from "@/projects/platform/studyspot/lib/navigation";

function KakaoLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#3C1E1E"
        d="M9 2.4c-4.42 0-8 2.77-8 6.19 0 2.19 1.48 4.12 3.71 5.22-.16.6-.6 2.22-.69 2.57-.11.43.16.42.33.31.14-.09 2.16-1.47 3.04-2.07.52.07 1.06.11 1.61.11 4.42 0 8-2.77 8-6.19S13.42 2.4 9 2.4Z"
      />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

export function LoginScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [email, setEmail] = useState("jiwon.han@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);

  return (
    <div className="ss-enter flex min-h-full flex-col justify-between px-6 pb-10 pt-20">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]">
            <Buildings size={22} weight="fill" />
          </span>
          <span className="text-[20px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]">StudySpot</span>
        </div>

        <h1 className="mt-9 text-[26px] font-extrabold leading-[32px] tracking-[-0.02em] text-[var(--ss-ink)]">
          지금 비어 있는 자리를
          <br />
          바로 찾아 앉으세요
        </h1>
        <p className="mt-2 text-[14px] leading-[20px] text-[var(--ss-mute)]">
          로그인하고 주변 지점의 실시간 좌석 현황을 확인하세요.
        </p>

        <div className="mt-8 space-y-4">
          <Field label="이메일">
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              suffix={<EnvelopeSimple size={17} className="text-[var(--ss-mute)]" />}
            />
          </Field>
          <Field label="비밀번호">
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
                  className="text-[var(--ss-mute)]"
                >
                  {showPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
                </button>
              }
            />
          </Field>

          <div className="flex items-center justify-between pt-1">
            <button type="button" onClick={() => setAutoLogin((v) => !v)} className="flex items-center gap-2">
              <Toggle on={autoLogin} onChange={() => setAutoLogin((v) => !v)} label="자동 로그인" />
              <span className="text-[13px] text-[var(--ss-body)]">자동 로그인</span>
            </button>
            <button type="button" className="text-[13px] font-medium text-[var(--ss-mute)]">
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </div>

        <div className="mt-7">
          <Button full size="lg" icon={<LockSimple size={17} weight="bold" />} onClick={() => onNavigate("home")}>
            로그인
          </Button>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--ss-hairline)]" />
          <span className="text-[12px] text-[var(--ss-mute)]">SNS 계정으로 계속하기</span>
          <span className="h-px flex-1 bg-[var(--ss-hairline)]" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "카카오", bg: "#FEE500", fg: "#3C1E1E", icon: <KakaoLogo /> },
            { label: "애플", bg: "#0B0B0A", fg: "#FFFFFF", icon: <AppleLogo size={18} weight="fill" /> },
            { label: "구글", bg: "#FFFFFF", fg: "#3C3C3C", icon: <GoogleLogo /> },
          ].map((sns) => (
            <button
              key={sns.label}
              type="button"
              onClick={() => onNavigate("home")}
              aria-label={`${sns.label}로 계속하기`}
              style={{ background: sns.bg, color: sns.fg }}
              className="flex h-12 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)]"
            >
              {sns.icon}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[13px] text-[var(--ss-mute)]">
        계정이 없으신가요?{" "}
        <button type="button" onClick={() => onNavigate("home")} className="font-semibold text-[var(--ss-ink)]">
          회원가입
        </button>
      </p>
    </div>
  );
}
