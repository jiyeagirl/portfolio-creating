"use client";

import { useState } from "react";
import { CheckCircle, Info } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import { USER } from "@/projects/platform/lumi/lib/mock-data";
import {
  AppBar,
  Field,
  PrimaryButton,
  inputClass,
} from "@/projects/platform/lumi/components/ui";

const BIRTH_TIMES = [
  "자시 (23:30 ~ 01:30)",
  "축시 (01:30 ~ 03:30)",
  "인시 (03:30 ~ 05:30)",
  "묘시 (05:30 ~ 07:30)",
  "시간 모름",
];

const NOTICES = [
  { id: "reserve", label: "예약 10분 전 알림", note: "예약한 상담 시작 전에 알려 드려요" },
  { id: "favorite", label: "찜한 상담사 상담 가능 알림", note: "대기 없이 연결할 수 있을 때" },
  { id: "event", label: "혜택과 이벤트 알림", note: "할인, 쿠폰 소식" },
];

export function ProfileEditScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [nickname, setNickname] = useState(USER.nickname);
  const [birth, setBirth] = useState(USER.birth);
  const [birthTime, setBirthTime] = useState(USER.birthTime);
  const [gender, setGender] = useState(USER.gender);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    reserve: true,
    favorite: true,
    event: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="lm-enter flex min-h-full flex-col">
      <AppBar title="프로필 수정" onBack={() => onNavigate("mypage")} />

      <section className="space-y-5 px-5 pt-5">
        <Field label="닉네임" helper="후기에는 실명 대신 가려진 이름으로 표시됩니다.">
          <input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setSaved(false);
            }}
            className={inputClass}
          />
        </Field>

        <Field label="생년월일" helper="사주 상담에 쓰이며 상담사에게만 전달됩니다.">
          <input
            value={birth}
            onChange={(e) => {
              setBirth(e.target.value);
              setSaved(false);
            }}
            className={inputClass}
          />
        </Field>

        <Field label="태어난 시">
          <select
            value={birthTime}
            onChange={(e) => {
              setBirthTime(e.target.value);
              setSaved(false);
            }}
            className={inputClass}
          >
            {BIRTH_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 text-[13px] font-semibold">성별</p>
          <div className="flex gap-2">
            {["여성", "남성"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setGender(option);
                  setSaved(false);
                }}
                aria-pressed={gender === option}
                className={`flex-1 rounded-xl border py-3 text-[14px] font-semibold transition-colors ${
                  gender === option
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)] text-[var(--lm-muted)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <Field label="휴대폰 번호" helper="상담사에게는 안심번호로만 연결됩니다.">
          <input
            value={USER.phone}
            readOnly
            className={`${inputClass} bg-[var(--lm-surface)] text-[var(--lm-muted)]`}
          />
        </Field>
      </section>

      <section className="mt-7 px-5">
        <h2 className="text-[15px] font-bold">알림 설정</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)]">
          {NOTICES.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index > 0 ? "border-t border-[var(--lm-border)]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{item.label}</p>
                <p className="mt-0.5 text-[11.5px] text-[var(--lm-muted)]">{item.note}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[item.id]}
                aria-label={item.label}
                onClick={() => {
                  setToggles((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                  setSaved(false);
                }}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  toggles[item.id] ? "bg-[var(--lm-accent)]" : "bg-[var(--lm-border)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    toggles[item.id] ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="flex gap-2 rounded-xl bg-[var(--lm-surface)] px-4 py-3 text-[12px] leading-relaxed text-[var(--lm-muted)]">
          <Info size={14} className="mt-[2px] shrink-0" />
          생년월일과 태어난 시는 상담 중에만 상담사에게 표시되고, 상담이 끝나면 다시 가려집니다.
        </p>
      </section>

      <div className="h-6" />

      <div className="sticky bottom-0 mt-auto border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 pb-7 pt-3">
        {saved && (
          <p className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--lm-success)]">
            <CheckCircle size={13} weight="fill" />
            변경 내용을 저장했습니다.
          </p>
        )}
        <PrimaryButton onClick={() => setSaved(true)}>저장하기</PrimaryButton>
      </div>
    </div>
  );
}
