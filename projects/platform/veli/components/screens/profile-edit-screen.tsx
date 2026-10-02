"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import { CURRENT_USER, MY_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import {
  Field,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/platform/veli/components/ui";

export function ProfileEditScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const vehicle = MY_SAFE_NUMBERS[0].vehicle;

  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [phone, setPhone] = useState(CURRENT_USER.phoneMasked);
  const [vehicleNumber, setVehicleNumber] = useState(vehicle.number);
  const [vehicleModel, setVehicleModel] = useState(vehicle.model);
  const [vehicleColor, setVehicleColor] = useState(vehicle.color);

  const [showPhoneChange, setShowPhoneChange] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verified, setVerified] = useState(false);

  const [saved, setSaved] = useState(false);

  function markDirty() {
    setSaved(false);
  }

  function handleVerify() {
    const digitsOnly = /^\d{6}$/.test(verifyCode.trim());
    if (digitsOnly) setVerified(true);
  }

  function handleTogglePhoneChange() {
    setShowPhoneChange((prev) => !prev);
    setNewPhone("");
    setVerifyCode("");
    setVerified(false);
  }

  function handleSave() {
    if (verified && newPhone.trim()) {
      setPhone(newPhone);
      setShowPhoneChange(false);
      setNewPhone("");
      setVerifyCode("");
      setVerified(false);
    }
    setSaved(true);
  }

  return (
    <div className="vl-enter pb-10">

      <section className="mt-2">
        <SectionHead title="회원정보" />
        <div className="flex flex-col gap-5 px-5">
          <Field label="이름">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                markDirty();
              }}
              className={inputClass}
            />
          </Field>

          <Field label="이메일">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                markDirty();
              }}
              className={inputClass}
            />
          </Field>

          <Field label="휴대폰 번호" helper="본인인증 후 새 번호로 바꿀 수 있습니다">
            <div className="flex items-center gap-2">
              <input value={phone} readOnly className={`${inputClass} flex-1 bg-[var(--vl-surface)] text-[var(--vl-muted)]`} />
              <button
                type="button"
                onClick={handleTogglePhoneChange}
                className="shrink-0 rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 py-3 text-[13px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
              >
                변경
              </button>
            </div>
          </Field>

          {showPhoneChange && (
            <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-surface)] p-4">
              <Field label="새 휴대폰 번호">
                <input
                  value={newPhone}
                  onChange={(e) => {
                    setNewPhone(e.target.value);
                    setVerified(false);
                  }}
                  placeholder="010-0000-0000"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Field>
              <Field label="인증번호" helper={!verified ? "발송된 인증번호 6자리를 입력해 주세요" : undefined}>
                <div className="flex items-center gap-2">
                  <input
                    value={verifyCode}
                    onChange={(e) => {
                      setVerifyCode(e.target.value);
                      setVerified(false);
                    }}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    className={`${inputClass} vl-num flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="shrink-0 rounded-[8px] bg-[var(--vl-accent)] px-4 py-3 text-[13px] font-bold text-[var(--vl-accent-fg)] transition-transform active:translate-y-[1px] active:opacity-70"
                  >
                    인증하기
                  </button>
                </div>
              </Field>
              {verified && (
                <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--vl-success)]">
                  <CheckCircle size={14} weight="fill" />
                  휴대폰 번호 인증이 완료되었습니다
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mt-7">
        <SectionHead title="차량 정보" note="등록된 차량 정보는 안심번호와 연결되어 있습니다" />
        <div className="flex flex-col gap-5 px-5">
          <Field label="차량번호">
            <input
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
                markDirty();
              }}
              className={`${inputClass} vl-num`}
            />
          </Field>
          <Field label="모델명">
            <input
              value={vehicleModel}
              onChange={(e) => {
                setVehicleModel(e.target.value);
                markDirty();
              }}
              className={inputClass}
            />
          </Field>
          <Field label="색상">
            <input
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value);
                markDirty();
              }}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="mt-7 px-5">
        {saved && (
          <p className="mb-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--vl-success)]">
            <CheckCircle size={13} weight="fill" />
            저장되었습니다
          </p>
        )}
        <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
      </section>
    </div>
  );
}
