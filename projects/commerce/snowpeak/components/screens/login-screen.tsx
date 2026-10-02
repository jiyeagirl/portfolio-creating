"use client";

import { useState } from "react";
import {
  AppleLogo,
  ChatTeardrop,
  DeviceMobile,
  Envelope,
  LockKey,
  Snowflake,
} from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";
import { Field, PhotoTile, PrimaryButton, Tabs, inputClass } from "@/projects/commerce/snowpeak/components/ui";

type LoginTab = "email" | "phone";

export function LoginScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<LoginTab>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(true);

  const canSubmit = tab === "email" ? email.trim().length > 0 && password.length > 0 : phone.trim().length > 0 && password.length > 0;

  return (
    <div className="sp-enter flex min-h-full flex-col pb-10">
      <div className="relative h-[300px] w-full shrink-0">
        <PhotoTile
          src="https://images.pexels.com/photos/8412637/pexels-photo-8412637.jpeg"
          alt="눈 덮인 스키 리조트 산악 파노라마, 리프트와 정상 스테이션, 푸른 하늘"
          className="absolute inset-0 h-full w-full"
          sizes="393px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--sp-surface)] to-transparent" />

        <div className="absolute inset-x-6 top-[64px] flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Snowflake size={16} weight="fill" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">SnowPeak</span>
        </div>

        <div className="absolute inset-x-6 bottom-9 text-white">
          <p className="text-[12.5px] font-semibold text-white/85">2023-24 시즌 오픈</p>
          <h1 className="mt-1 text-[22px] font-semibold leading-snug tracking-[-0.02em]">
            새로운 슬로프,
            <br />
            지금 예약을 시작하세요
          </h1>
        </div>
      </div>

      <div className="relative -mt-6 flex flex-1 flex-col rounded-t-[28px] bg-[var(--sp-surface)] pb-8 pt-7">
        <div className="px-6">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em]">다시 만나 반가워요</h2>
          <p className="mt-1.5 text-[13px] text-[var(--sp-mute)]">SnowPeak 계정으로 로그인하고 예약을 이어가보세요</p>
        </div>

        <div className="mt-5">
          <Tabs
            value={tab}
            items={[
              { key: "email", label: "이메일 로그인" },
              { key: "phone", label: "휴대폰 로그인" },
            ]}
            onChange={setTab}
          />
        </div>

        <form
          className="flex flex-1 flex-col gap-4 px-6 pt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onNavigate("home");
          }}
        >
          {tab === "email" ? (
            <Field label="이메일">
              <div className="relative">
                <Envelope size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          ) : (
            <Field label="휴대폰번호">
              <div className="relative">
                <DeviceMobile size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          )}

          <Field label="비밀번호">
            <div className="relative">
              <LockKey size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <Toggle
                checked={autoLogin}
                onChange={setAutoLogin}
                label="자동 로그인"
                size="sm"
                onClassName="bg-[var(--sp-accent)]"
                offClassName="bg-[var(--sp-surface-soft)]"
              />
              <span className="text-[13px] text-[var(--sp-body)]">자동 로그인</span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate("findAccount")}
              className="text-[12.5px] font-semibold text-[var(--sp-mute)]"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          <div className="mt-1">
            <PrimaryButton type="submit" disabled={!canSubmit}>
              로그인
            </PrimaryButton>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3 px-6">
          <span className="h-px flex-1 bg-[var(--sp-border)]" />
          <span className="text-[12px] text-[var(--sp-mute)]">또는 SNS 계정으로 계속하기</span>
          <span className="h-px flex-1 bg-[var(--sp-border)]" />
        </div>

        <div className="flex items-center justify-center gap-4 px-6">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="카카오로 계속하기"
            className="flex items-center justify-center rounded-full transition-transform active:scale-95"
            style={{ height: 52, width: 52, backgroundColor: "#FEE500" }}
          >
            <ChatTeardrop size={22} weight="fill" className="text-[#391B1B]" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="네이버로 계속하기"
            className="flex items-center justify-center rounded-full text-[15px] font-bold text-white transition-transform active:scale-95"
            style={{ height: 52, width: 52, backgroundColor: "#03C75A" }}
          >
            N
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="Apple로 계속하기"
            className="flex items-center justify-center rounded-full bg-black text-white transition-transform active:scale-95"
            style={{ height: 52, width: 52 }}
          >
            <AppleLogo size={20} weight="fill" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="Google로 계속하기"
            className="flex items-center justify-center rounded-full border border-[var(--sp-border-strong)] bg-white text-[var(--sp-ink)] transition-transform active:scale-95"
            style={{ height: 52, width: 52 }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2582h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.6155z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1818l-2.9087-2.2582c-.8064.54-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5827-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.9641 10.71z"
              />
              <path
                fill="#EA4335"
                d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.3459l2.5818-2.5818C13.4632.8918 11.43 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1623 6.6564 3.5795 9 3.5795z"
              />
            </svg>
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3 px-6 text-[12.5px]">
          <button type="button" onClick={() => onNavigate("findAccount")} className="font-semibold text-[var(--sp-ink)]">
            아이디 / 비밀번호 찾기
          </button>
          <span className="h-3 w-px bg-[var(--sp-border-strong)]" />
          <button type="button" onClick={() => onNavigate("signup")} className="font-semibold text-[var(--sp-ink)]">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
