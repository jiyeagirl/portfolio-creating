"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import {
  AppBar,
  Field,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/commerce/snowpeak/components/ui";
import type { UserProfile } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

export function ProfileEditScreen({
  profile,
  onNavigate,
  onUpdateProfile,
}: {
  profile: UserProfile;
  onNavigate: NavigateFn;
  onUpdateProfile: (next: Partial<UserProfile>) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const canSave = name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0;

  const passwordMismatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canChangePassword =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    !passwordMismatch;

  function handleSave() {
    if (!canSave) return;
    onUpdateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setSaved(true);
  }

  function handleChangePassword() {
    if (!canChangePassword) return;
    setPasswordChanged(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="회원정보 수정" onBack={() => onNavigate("mypage")} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        <SectionHead title="기본 정보" />
        <div
          className="flex flex-col gap-4 rounded-[16px] bg-[var(--sp-surface)] p-4"
          style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
        >
          <Field label="이름">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              placeholder="이름을 입력해 주세요"
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
              }}
              placeholder="이메일을 입력해 주세요"
            />
          </Field>
          <Field label="휴대폰 번호">
            <input
              type="tel"
              className={inputClass}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSaved(false);
              }}
              placeholder="휴대폰 번호를 입력해 주세요"
            />
          </Field>
        </div>

        {saved && (
          <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-[var(--sp-success-soft)] px-4 py-3">
            <CheckCircle size={16} weight="fill" className="text-[var(--sp-success)]" />
            <p className="text-[13px] font-semibold text-[var(--sp-success)]">회원정보가 저장되었습니다</p>
          </div>
        )}

        <div className="mt-3">
          <PrimaryButton onClick={handleSave} disabled={!canSave}>
            저장
          </PrimaryButton>
        </div>

        <div className="mt-7">
          <SectionHead title="비밀번호 변경" note="변경하지 않으려면 비워두세요" />
          <div
            className="flex flex-col gap-4 rounded-[16px] bg-[var(--sp-surface)] p-4"
            style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
          >
            <Field label="현재 비밀번호">
              <input
                type="password"
                className={inputClass}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordChanged(false);
                }}
                placeholder="현재 비밀번호 입력"
              />
            </Field>
            <Field label="새 비밀번호">
              <input
                type="password"
                className={inputClass}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordChanged(false);
                }}
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
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordChanged(false);
                }}
                placeholder="새 비밀번호 다시 입력"
              />
            </Field>
          </div>

          {passwordChanged && (
            <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-[var(--sp-success-soft)] px-4 py-3">
              <CheckCircle size={16} weight="fill" className="text-[var(--sp-success)]" />
              <p className="text-[13px] font-semibold text-[var(--sp-success)]">비밀번호가 변경되었습니다</p>
            </div>
          )}

          <div className="mt-3">
            <PrimaryButton onClick={handleChangePassword} disabled={!canChangePassword} trailingIcon={false}>
              변경하기
            </PrimaryButton>
          </div>
        </div>

        <div className="mt-7">
          <SectionHead title="알림 및 로그인 설정" />
          <div
            className="flex flex-col divide-y divide-[var(--sp-border)] rounded-[16px] bg-[var(--sp-surface)]"
            style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-[14px] font-medium text-[var(--sp-ink)]">푸시 알림 수신</p>
                <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">예약, 결제, 프로모션 알림을 받습니다</p>
              </div>
              <Toggle
                checked={profile.pushEnabled}
                onChange={(next) => onUpdateProfile({ pushEnabled: next })}
                label="푸시 알림 수신"
                onClassName="bg-[var(--sp-accent)]"
                offClassName="bg-[var(--sp-surface-soft)]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-[14px] font-medium text-[var(--sp-ink)]">자동 로그인</p>
                <p className="mt-0.5 text-[12px] text-[var(--sp-mute)]">다음에도 로그인 상태를 유지합니다</p>
              </div>
              <Toggle
                checked={profile.autoLogin}
                onChange={(next) => onUpdateProfile({ autoLogin: next })}
                label="자동 로그인"
                onClassName="bg-[var(--sp-accent)]"
                offClassName="bg-[var(--sp-surface-soft)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
