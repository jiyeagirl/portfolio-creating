"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeft,
  Check,
  CheckCircle,
  Plus,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Monogram, PrimaryButton, Toggle } from "@/projects/monitoring/caresignal/components/app/ui";
import { PHOTO, photoUrl } from "@/projects/monitoring/caresignal/lib/photos";
import {
  carryPositions,
  guardians,
  onboardingPermissions,
  terms,
  user,
} from "@/projects/monitoring/caresignal/lib/app-data";
import type { AppNavigate } from "@/projects/monitoring/caresignal/lib/navigation";

const STEPS = ["본인 확인", "보호자 등록", "권한 설정", "휴대 위치"];

export function OnboardingScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState<string[]>(["service", "privacy", "location", "guardian"]);
  const [permissions, setPermissions] = useState<string[]>(["location", "motion", "notification"]);
  const [carry, setCarry] = useState("pocket");

  const toggleTerm = (key: string) =>
    setAgreed((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const togglePermission = (key: string) =>
    setPermissions((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  if (step === 0) {
    return (
      <div className="flex min-h-full w-full flex-col">
        <div className="relative h-[416px] w-full">
          <Image
            src={photoUrl(PHOTO.benchCouple, 786, 832)}
            alt="해 질 무렵 공원 벤치에 나란히 앉아 있는 두 사람"
            fill
            priority
            sizes="393px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col px-6 pb-10 pt-8">
          <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1d1d1f]">
            평소처럼 지내시면
            <br />
            안전은 저희가 봅니다
          </h1>
          <p className="mt-3 text-[16px] font-normal leading-[1.6] text-[#333333]">
            스마트폰을 지니고 계시기만 하면 낙상, 장시간 미활동, 생활권 이탈을 자동으로 감지해
            보호자와 복지기관에 알려 드립니다.
          </p>

          <div className="mt-auto space-y-2.5 pt-8">
            <PrimaryButton className="w-full" onClick={() => setStep(1)}>
              시작하기
            </PrimaryButton>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="cs-focusable w-full py-2 text-[15px] font-normal text-[#0066cc]"
            >
              이미 가입한 계정으로 로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="flex min-h-full w-full flex-col px-6 pb-10 pt-[132px]">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#eaf6ee]">
          <ShieldCheck size={40} weight="fill" className="text-[#248a3d]" />
        </span>
        <h1 className="mt-6 text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1d1d1f]">
          안전 감지를 시작합니다
        </h1>
        <p className="mt-3 text-[16px] font-normal leading-[1.6] text-[#333333]">
          지금부터 {user.name} 님의 활동과 위치를 확인합니다. 별도로 앱을 켜 두지 않아도 됩니다.
        </p>

        <ul className="mt-8 space-y-3.5">
          {[
            `보호자 ${guardians.filter((g) => g.relation !== "복지관 담당자").length}명 등록 완료`,
            `담당 기관 ${user.agency} 연결`,
            `휴대 위치 ${carryPositions.find((c) => c.key === carry)?.label} 설정`,
          ].map((line) => (
            <li key={line} className="flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-[#248a3d]" />
              <span className="text-[15px] font-normal text-[#333333]">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <PrimaryButton className="w-full" onClick={() => onNavigate("home")}>
            홈 화면으로 이동
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col px-6 pb-10 pt-[68px]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="cs-press cs-focusable -ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[#0066cc]"
          aria-label="이전 단계"
        >
          <CaretLeft size={22} weight="bold" />
        </button>
        <div className="flex flex-1 gap-1.5">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={`h-[4px] flex-1 rounded-full ${
                index < step ? "bg-[#0066cc]" : "bg-[#e8e8ed]"
              }`}
            />
          ))}
        </div>
        <span className="text-[13px] font-normal tabular-nums text-[#7a7a7a]">
          {step} / {STEPS.length}
        </span>
      </div>

      <h1 className="mt-7 text-[27px] font-bold leading-[1.25] tracking-[-0.03em] text-[#1d1d1f]">
        {step === 1 && "본인 확인을 해 주세요"}
        {step === 2 && "보호자를 등록해 주세요"}
        {step === 3 && "감지에 필요한 권한입니다"}
        {step === 4 && "스마트폰을 어디에 두시나요"}
      </h1>
      <p className="mt-2.5 text-[15px] font-normal leading-[1.6] text-[#333333]">
        {step === 1 && "휴대폰 번호로 본인 확인을 하고 이용약관에 동의해 주세요."}
        {step === 2 && "위험 상황이 감지되면 등록한 순서대로 연락이 갑니다."}
        {step === 3 && "권한을 끄면 해당 항목의 감지가 중지됩니다."}
        {step === 4 && "휴대 위치에 따라 충격 감지 기준을 다르게 적용합니다."}
      </p>

      <div className="mt-7 flex-1">
        {step === 1 && (
          <div className="space-y-5">
            <Field label="이름" value={user.name} />
            <Field label="생년월일" value="1948년 3월 19일" />
            <Field label="휴대폰 번호" value={user.phone} verified />
            <div>
              <p className="text-[13px] font-semibold text-[#333333]">약관 동의</p>
              <ul className="mt-2.5 divide-y divide-[#f0f0f0] rounded-[11px] border border-[#e0e0e0]">
                {terms.map((term) => {
                  const checked = agreed.includes(term.key);
                  return (
                    <li key={term.key}>
                      <button
                        type="button"
                        onClick={() => toggleTerm(term.key)}
                        className="cs-focusable flex w-full items-center gap-3 px-3.5 py-3 text-left"
                      >
                        <span
                          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                            checked ? "bg-[#0066cc] text-white" : "border border-[#c7c7cc] text-transparent"
                          }`}
                        >
                          <Check size={13} weight="bold" />
                        </span>
                        <span className="flex-1 text-[14.5px] font-normal text-[#1d1d1f]">
                          {term.label}
                        </span>
                        <span className="text-[12px] font-normal text-[#7a7a7a]">
                          {term.required ? "필수" : "선택"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {guardians.map((guardian) => (
              <div
                key={guardian.id}
                className="flex items-center gap-3 rounded-[18px] border border-[#e0e0e0] p-4"
              >
                <Monogram name={guardian.name} size={42} tone={guardian.order === 1 ? "primary" : "neutral"} />
                <div className="flex-1">
                  <p className="text-[15.5px] font-semibold text-[#1d1d1f]">
                    {guardian.name}
                    <span className="ml-1.5 text-[13px] font-normal text-[#7a7a7a]">
                      {guardian.relation}
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] font-normal tabular-nums text-[#7a7a7a]">
                    {guardian.phone}
                  </p>
                </div>
                <span className="rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[12px] font-semibold text-[#333333]">
                  {guardian.order}차
                </span>
              </div>
            ))}
            <button
              type="button"
              className="cs-press cs-focusable flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#c7c7cc] text-[15px] font-semibold text-[#0066cc]"
            >
              <Plus size={17} weight="bold" />
              비상 연락처 추가
            </button>
            <p className="pt-1 text-[13px] font-normal leading-[1.6] text-[#7a7a7a]">
              담당 복지기관은 {user.agency} {user.manager}로 자동 연결됩니다.
            </p>
          </div>
        )}

        {step === 3 && (
          <ul className="divide-y divide-[#f0f0f0] rounded-[18px] border border-[#e0e0e0]">
            {onboardingPermissions.map((permission) => (
              <li key={permission.key} className="flex items-start gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-[15.5px] font-semibold text-[#1d1d1f]">
                    {permission.label}
                    <span className="ml-1.5 text-[12px] font-normal text-[#7a7a7a]">
                      {permission.required ? "필수" : "선택"}
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] font-normal leading-[1.5] text-[#7a7a7a]">
                    {permission.body}
                  </p>
                </div>
                <Toggle
                  checked={permissions.includes(permission.key)}
                  onChange={() => togglePermission(permission.key)}
                  label={permission.label}
                />
              </li>
            ))}
          </ul>
        )}

        {step === 4 && (
          <div className="space-y-2.5">
            {carryPositions.map((position) => {
              const active = position.key === carry;
              return (
                <button
                  key={position.key}
                  type="button"
                  onClick={() => setCarry(position.key)}
                  className={`cs-press cs-focusable flex w-full items-center gap-3 rounded-[18px] border px-4 py-4 text-left ${
                    active ? "border-[#0071e3] border-2" : "border-[#e0e0e0]"
                  }`}
                >
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                      active ? "bg-[#0066cc] text-white" : "border border-[#c7c7cc] text-transparent"
                    }`}
                  >
                    <Check size={13} weight="bold" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15.5px] font-semibold text-[#1d1d1f]">
                      {position.label}
                    </span>
                    <span className="mt-1 block text-[13px] font-normal text-[#7a7a7a]">
                      {position.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-8">
        <PrimaryButton className="w-full" onClick={() => setStep((s) => s + 1)}>
          {step === 4 ? "설정 완료" : "다음"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Field({ label, value, verified }: { label: string; value: string; verified?: boolean }) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#333333]">{label}</label>
      <div className="mt-2 flex min-h-[48px] items-center gap-2 rounded-full border border-[#d2d2d7] px-5">
        <span className="flex-1 text-[16px] font-normal text-[#1d1d1f]">{value}</span>
        {verified && (
          <span className="flex items-center gap-1 text-[13px] font-semibold text-[#248a3d]">
            <CheckCircle size={15} weight="fill" />
            인증 완료
          </span>
        )}
      </div>
    </div>
  );
}
