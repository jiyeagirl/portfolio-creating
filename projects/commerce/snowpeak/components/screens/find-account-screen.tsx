"use client";

import { useState } from "react";
import { DeviceMobile, EnvelopeSimple, SealCheck, User } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";
import { USER_PROFILE } from "@/projects/commerce/snowpeak/lib/mock-data";
import { AppBar, Field, GhostButton, PrimaryButton, Tabs, inputClass } from "@/projects/commerce/snowpeak/components/ui";

type FindTab = "id" | "password";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  const hidden = "*".repeat(Math.max(user.length - visible.length, 2));
  return `${visible}${hidden}@${domain}`;
}

function maskPhone(phone: string): string {
  const parts = phone.split("-");
  if (parts.length !== 3) return phone;
  const [first, middle, last] = parts;
  return `${first}-${middle.slice(0, 2)}**-**${last.slice(-2)}`;
}

export function FindAccountScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<FindTab>("id");

  const [idName, setIdName] = useState("");
  const [idPhone, setIdPhone] = useState("");
  const [idFound, setIdFound] = useState(false);

  const [pwName, setPwName] = useState("");
  const [pwPhone, setPwPhone] = useState("");
  const [pwSent, setPwSent] = useState(false);

  const canFindId = idName.trim().length > 0 && idPhone.trim().length > 0;
  const canFindPw = pwName.trim().length > 0 && pwPhone.trim().length > 0;

  function switchTab(next: FindTab) {
    setTab(next);
    setIdFound(false);
    setPwSent(false);
  }

  return (
    <div className="sp-enter flex min-h-full flex-col">
      <AppBar title="아이디 / 비밀번호 찾기" onBack={() => onNavigate("login")} />

      <Tabs
        value={tab}
        items={[
          { key: "id", label: "아이디 찾기" },
          { key: "password", label: "비밀번호 찾기" },
        ]}
        onChange={switchTab}
      />

      {tab === "id" ? (
        <div className="flex flex-1 flex-col px-6 pt-6">
          <h1 className="text-[19px] font-semibold tracking-[-0.02em]">가입하신 정보로 아이디를 찾아드려요</h1>
          <p className="mt-1.5 text-[13px] text-[var(--sp-mute)]">본인 확인을 위해 이름과 휴대폰번호를 입력해주세요</p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canFindId) setIdFound(true);
            }}
          >
            <Field label="이름">
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
            <Field label="휴대폰번호">
              <div className="relative">
                <DeviceMobile size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="tel"
                  value={idPhone}
                  onChange={(e) => setIdPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <div className="mt-1">
              <PrimaryButton type="submit" trailingIcon={false} disabled={!canFindId}>
                아이디 찾기
              </PrimaryButton>
            </div>
          </form>

          {idFound && (
            <div className="mt-6 rounded-[16px] bg-[var(--sp-surface)] p-5" style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}>
              <div className="flex items-center gap-2">
                <SealCheck size={18} weight="fill" className="text-[var(--sp-success)]" />
                <span className="text-[13.5px] font-semibold text-[var(--sp-success)]">계정을 찾았어요</span>
              </div>
              <p className="sp-num mt-3 text-[18px] font-semibold text-[var(--sp-ink)]">{maskEmail(USER_PROFILE.email)}</p>
              <p className="mt-1.5 text-[12.5px] text-[var(--sp-mute)]">{USER_PROFILE.joinedAt.replaceAll("-", ".")}에 가입한 계정이에요</p>
              <div className="mt-5">
                <GhostButton onClick={() => onNavigate("login")}>로그인하러 가기</GhostButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-6 pt-6">
          <h1 className="text-[19px] font-semibold tracking-[-0.02em]">비밀번호를 재설정해드려요</h1>
          <p className="mt-1.5 text-[13px] text-[var(--sp-mute)]">본인 확인을 위해 이름과 휴대폰번호를 입력해주세요</p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canFindPw) setPwSent(true);
            }}
          >
            <Field label="이름">
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  value={pwName}
                  onChange={(e) => setPwName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
            <Field label="휴대폰번호">
              <div className="relative">
                <DeviceMobile size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
                <input
                  type="tel"
                  value={pwPhone}
                  onChange={(e) => setPwPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <div className="mt-1">
              <PrimaryButton type="submit" trailingIcon={false} disabled={!canFindPw}>
                비밀번호 찾기
              </PrimaryButton>
            </div>
          </form>

          {pwSent && (
            <div className="mt-6 rounded-[16px] bg-[var(--sp-surface)] p-5" style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={18} weight="fill" className="text-[var(--sp-info)]" />
                <span className="text-[13.5px] font-semibold text-[var(--sp-info)]">임시 비밀번호를 보내드렸어요</span>
              </div>
              <p className="sp-num mt-3 text-[16px] font-semibold text-[var(--sp-ink)]">{maskPhone(USER_PROFILE.phone)}</p>
              <p className="mt-1.5 text-[12.5px] text-[var(--sp-mute)]">문자로 받은 임시 비밀번호로 로그인 후 비밀번호를 변경해주세요</p>
              <div className="mt-5">
                <GhostButton onClick={() => onNavigate("login")}>로그인하러 가기</GhostButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
