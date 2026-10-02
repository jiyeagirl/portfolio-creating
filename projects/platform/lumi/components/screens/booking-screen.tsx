"use client";

import { useState } from "react";
import { CalendarCheck, Check, CheckCircle, Warning } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import { CAUTIONS, PASS_BY_TIER, expertById } from "@/projects/platform/lumi/lib/mock-data";
import {
  AppBar,
  ExpertAvatar,
  Field,
  PrimaryButton,
  inputClass,
} from "@/projects/platform/lumi/components/ui";

export function BookingScreen({
  expertId,
  onNavigate,
  selectedTier,
  onSelectTier,
  ownedCount,
  onConfirm,
}: {
  expertId: string;
  onNavigate: NavigateFn;
  selectedTier: PassTier;
  onSelectTier: (tier: PassTier) => void;
  ownedCount: (tier: PassTier) => number;
  onConfirm: (tier: PassTier) => void;
}) {
  const expert = expertById(expertId);
  const openSlots = expert.slots.filter((s) => s.times.some((t) => !t.taken));

  const [date, setDate] = useState(openSlots[0]?.date ?? "");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const tier = expert.tiers.includes(selectedTier) ? selectedTier : expert.tiers[0];
  const pass = PASS_BY_TIER[tier];
  const activeSlot = expert.slots.find((s) => s.date === date);
  const remaining = ownedCount(tier);
  const dateLabel = activeSlot?.label ?? "";

  const submit = () => {
    if (!time) {
      setError("상담 시간을 선택해 주세요.");
      return;
    }
    if (remaining < 1) {
      setError(`${pass.name} 상담권이 없습니다. 먼저 상담권을 구매해 주세요.`);
      return;
    }
    if (!agreed) {
      setError("상담 전 유의사항에 동의해 주세요.");
      return;
    }
    setError("");
    onConfirm(tier);
    setDone(true);
  };

  if (done) {
    return (
      <div className="lm-enter flex min-h-full flex-col">
        <AppBar title="예약 완료" onBack={() => onNavigate("history")} />
        <div className="flex flex-1 flex-col items-center px-6 pt-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]">
            <CheckCircle size={32} weight="fill" />
          </span>
          <h2 className="mt-4 text-[20px] font-bold tracking-tight">예약되었습니다</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--lm-muted)]">
            상담 10분 전에 알림을 보내 드립니다.
            <br />
            시간이 되면 앱에서 전화 연결 버튼이 열립니다.
          </p>

          <div className="mt-6 w-full rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4 text-left">
            <div className="flex items-center gap-3">
              <ExpertAvatar expert={expert} size={44} />
              <div>
                <p className="text-[14.5px] font-bold">{expert.name}</p>
                <p className="lm-num text-[12px] text-[var(--lm-muted)]">
                  {pass.name} {pass.minutes}분
                </p>
              </div>
            </div>
            <div className="lm-num mt-3.5 space-y-2 border-t border-[var(--lm-border)] pt-3.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--lm-muted)]">일시</span>
                <span className="font-semibold">
                  {dateLabel} {time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--lm-muted)]">사용 상담권</span>
                <span className="font-semibold">1장 (잔여 {Math.max(0, remaining - 1)}장)</span>
              </div>
              {memo && (
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-[var(--lm-muted)]">상담 주제</span>
                  <span className="text-right font-semibold">{memo}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 w-full space-y-2">
            <PrimaryButton onClick={() => onNavigate("history")}>예약 내역 보기</PrimaryButton>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="w-full rounded-xl border border-[var(--lm-border)] py-3.5 text-[15px] font-bold text-[var(--lm-ink)]"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lm-enter flex min-h-full flex-col">
      <AppBar title="예약하기" onBack={() => onNavigate("expertDetail", expert.id)} />

      <section className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4">
          <ExpertAvatar expert={expert} size={48} />
          <div className="min-w-0">
            <p className="text-[15px] font-bold">{expert.name}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-[var(--lm-muted)]">{expert.headline}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-bold">사용할 상담권</h2>
        <div className="mt-3 space-y-2">
          {expert.tiers.map((key) => {
            const item = PASS_BY_TIER[key];
            const count = ownedCount(key);
            const active = tier === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelectTier(key);
                  setError("");
                }}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                  active
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border-[var(--lm-border)]"
                  }`}
                >
                  {active && <Check size={11} weight="bold" />}
                </span>
                <span className="lm-num flex-1 text-[14px] font-bold">
                  {item.name} {item.minutes}분
                </span>
                <span
                  className={`lm-num text-[12.5px] font-semibold ${
                    count > 0 ? "text-[var(--lm-muted)]" : "text-[var(--lm-danger)]"
                  }`}
                >
                  {count > 0 ? `보유 ${count}장` : "보유 없음"}
                </span>
              </button>
            );
          })}
        </div>
        {remaining < 1 && (
          <button
            type="button"
            onClick={() => onNavigate("purchase", tier)}
            className="mt-2 w-full rounded-xl bg-[var(--lm-surface)] py-3 text-[13px] font-bold text-[var(--lm-ink)]"
          >
            {pass.name} 상담권 구매하러 가기
          </button>
        )}
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-bold">날짜</h2>
        <div className="lm-scroll-x mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {expert.slots.map((slot) => {
            const disabled = slot.times.every((t) => t.taken) || slot.times.length === 0;
            return (
              <button
                key={slot.date}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setDate(slot.date);
                  setTime("");
                }}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  date === slot.date
                    ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                    : disabled
                      ? "bg-[var(--lm-surface)] text-[var(--lm-border)]"
                      : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>

        <h2 className="mt-5 text-[15px] font-bold">시간</h2>
        {activeSlot && activeSlot.times.length > 0 ? (
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {activeSlot.times.map((t) => {
              const active = time === t.time;
              return (
                <button
                  key={t.time}
                  type="button"
                  disabled={t.taken}
                  onClick={() => {
                    setTime(t.time);
                    setError("");
                  }}
                  className={`lm-num rounded-xl border py-2.5 text-center text-[12.5px] font-semibold transition-colors ${
                    t.taken
                      ? "border-[var(--lm-border)] text-[var(--lm-border)] line-through"
                      : active
                        ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                        : "border-[var(--lm-border)] bg-[var(--lm-elevated)] text-[var(--lm-ink)]"
                  }`}
                >
                  {t.time}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-[var(--lm-surface)] px-4 py-3 text-[12.5px] text-[var(--lm-muted)]">
            선택한 날짜에는 남은 시간이 없습니다.
          </p>
        )}
      </section>

      <section className="mt-6 px-5">
        <Field
          label="상담 주제 (선택)"
          helper="미리 적어 두면 상담사가 준비하고 들어옵니다."
        >
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            maxLength={120}
            placeholder="예: 8월에 지원하는 회사 두 곳 중 어디가 맞을지"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </Field>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-[var(--lm-surface)] p-4">
          <p className="text-[13px] font-bold">상담 전 유의사항</p>
          <ul className="mt-2.5 space-y-1.5">
            {CAUTIONS.map((line) => (
              <li key={line} className="flex gap-2 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--lm-muted)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setAgreed((v) => !v);
              setError("");
            }}
            aria-pressed={agreed}
            className="mt-3.5 flex w-full items-center gap-2.5 rounded-xl bg-[var(--lm-elevated)] px-3.5 py-3 text-left"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                agreed
                  ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                  : "border-[var(--lm-border)]"
              }`}
            >
              {agreed && <Check size={11} weight="bold" />}
            </span>
            <span className="text-[13px] font-semibold">위 내용을 확인했습니다</span>
          </button>
        </div>
      </section>

      <div className="h-6" />

      <div className="sticky bottom-0 mt-auto border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 pb-7 pt-3">
        {error && (
          <p className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--lm-danger)]">
            <Warning size={13} weight="fill" />
            {error}
          </p>
        )}
        <div className="lm-num mb-2.5 flex items-center justify-between text-[12.5px]">
          <span className="text-[var(--lm-muted)]">
            {dateLabel} {time || "시간 미선택"}
          </span>
          <span className="font-bold">
            {pass.name} {pass.minutes}분 1장 사용
          </span>
        </div>
        <PrimaryButton onClick={submit}>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck size={16} weight="fill" />
            예약 확정하기
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}
