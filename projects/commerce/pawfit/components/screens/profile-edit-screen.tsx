"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { AppBar, Field, PrimaryButton, SectionHead, inputClass } from "@/projects/commerce/pawfit/components/ui";
import { CURRENT_USER } from "@/projects/commerce/pawfit/lib/mock-data";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

export function ProfileEditScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const passwordMismatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSave = name.trim().length > 0 && email.trim().length > 0 && !passwordMismatch;

  function withReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setSaved(false);
    };
  }

  const setNameAndReset = withReset(setName);
  const setEmailAndReset = withReset(setEmail);
  const setCurrentPasswordAndReset = withReset(setCurrentPassword);
  const setNewPasswordAndReset = withReset(setNewPassword);
  const setConfirmPasswordAndReset = withReset(setConfirmPassword);

  function handleSave() {
    if (!canSave) return;
    setSaved(true);
  }

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="회원정보 수정" onBack={() => onNavigate("mypage")} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-5">
        <SectionHead title="기본 정보" />
        <div className="flex flex-col gap-4 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
          <Field label="이름">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setNameAndReset(e.target.value)}
              placeholder="이름을 입력해주세요"
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmailAndReset(e.target.value)}
              placeholder="이메일을 입력해주세요"
            />
          </Field>
        </div>

        <div className="mt-6">
          <SectionHead title="비밀번호 변경" note="변경하지 않으려면 비워두세요" />
          <div className="flex flex-col gap-4 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
            <Field label="현재 비밀번호">
              <input
                type="password"
                className={inputClass}
                value={currentPassword}
                onChange={(e) => setCurrentPasswordAndReset(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
            </Field>
            <Field label="새 비밀번호">
              <input
                type="password"
                className={inputClass}
                value={newPassword}
                onChange={(e) => setNewPasswordAndReset(e.target.value)}
                placeholder="새 비밀번호 입력"
              />
            </Field>
            <Field
              label="새 비밀번호 확인"
              error={passwordMismatch ? "비밀번호가 일치하지 않습니다" : undefined}
            >
              <input
                type="password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPasswordAndReset(e.target.value)}
                placeholder="새 비밀번호 다시 입력"
              />
            </Field>
          </div>
        </div>

        {saved && (
          <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-[var(--pf-success)]/25 bg-[var(--pf-success)]/[0.08] px-4 py-3">
            <CheckCircle size={16} weight="fill" className="text-[var(--pf-success)]" />
            <p className="text-[13px] font-semibold text-[var(--pf-success)]">저장되었습니다</p>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
        <PrimaryButton onClick={handleSave} disabled={!canSave}>
          저장
        </PrimaryButton>
      </div>
    </div>
  );
}
