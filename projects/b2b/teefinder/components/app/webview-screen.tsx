"use client";

import { useEffect, useState } from "react";
import { ArrowClockwise, Check, LockSimple, WarningCircle, X } from "@phosphor-icons/react";
import { getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import { formatFee, formatLongDate } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { GhostButton, PrimaryButton } from "@/projects/b2b/teefinder/components/app/app-ui";
import type { CourseLayout } from "@/projects/b2b/teefinder/lib/types";

const STEPS = ["아이디, 비밀번호 자동 입력", "로그인 완료", "예약 페이지로 이동"];
const STEP_MS = 1400;

export function WebviewScreen({
  courseId,
  date,
  time,
  layout,
  fee,
  initialStage = 0,
  onClose,
  onOpenProfile,
}: {
  courseId: string;
  date: string;
  time: string;
  layout: CourseLayout;
  fee?: number;
  initialStage?: number;
  onClose: () => void;
  onOpenProfile: () => void;
}) {
  const { accounts, courses } = useStore();
  const course = courses.find((c) => c.id === courseId) ?? getCourse(courseId);
  const account = accounts.find((a) => a.courseId === courseId);
  const needsCaptcha = course.loginKind === "보안문자";
  const loginFails = account?.status === "로그인 실패";

  const [stage, setStage] = useState(initialStage);
  const [captcha, setCaptcha] = useState("");
  const [captchaDone, setCaptchaDone] = useState(initialStage >= 2);

  const blockedAtCaptcha = needsCaptcha && !captchaDone && stage >= 1;
  const failed = loginFails && stage >= 1;
  const halted = !account || blockedAtCaptcha || failed || stage >= 3;

  useEffect(() => {
    if (halted) return;
    const t = setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [stage, halted]);

  const host = course.domain.replace("https://", "");
  const path = stage >= 3 ? "/reserve/step2" : stage === 2 ? "/mypage" : "/login";
  const doneSteps = failed || blockedAtCaptcha ? Math.max(stage - 1, 0) : stage;

  return (
    <div className="flex h-full flex-col bg-[var(--tf-surface)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-canvas)] pt-[59px]">
        <div className="flex h-[56px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="tf-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-[var(--tf-pressed)]"
          >
            <X size={22} weight="bold" />
          </button>
          <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-[var(--tf-soft)] px-3">
            <LockSimple size={15} weight="fill" className="shrink-0 text-[var(--tf-ink-3)]" />
            <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--tf-ink-2)]">
              {host}
              <span className="text-[var(--tf-ink)]">{path}</span>
            </span>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--tf-ink-3)]">
            <ArrowClockwise size={20} />
          </span>
        </div>
        <div className="h-[3px] bg-[var(--tf-line)]">
          <div
            className="tf-progress h-full bg-[var(--tf-brand)]"
            style={{ width: `${(doneSteps / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* 골프장 예약 사이트 목업. 실제 JS Injection은 없다. */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafafa] text-[#222]">
        <div className="flex h-14 items-center border-b border-[#e3e3e3] bg-white px-5">
          <span className="text-[17px] font-bold tracking-[-0.02em]">{course.name}</span>
          <span className="ml-auto text-[13px] text-[#777]">온라인 예약</span>
        </div>

        {!account && (
          <div className="px-5 pt-12 text-center">
            <WarningCircle size={40} weight="fill" className="mx-auto text-[var(--tf-orange)]" />
            <p className="mt-4 text-[17px] font-semibold">등록된 골프장 계정이 없어요</p>
            <p className="mt-2 text-[15px] leading-[22px] text-[#555]">
              계정을 등록하면 로그인부터 예약 페이지까지 자동으로 이동해요.
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={onOpenProfile}>골프장 계정 등록</PrimaryButton>
            </div>
          </div>
        )}

        {account && stage < 2 && !failed && (
          <div className="px-5 pt-8">
            <h2 className="text-[19px] font-bold">회원 로그인</h2>
            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-[13px] text-[#666]">아이디</label>
                <div className="flex h-12 items-center rounded-[6px] border border-[#cfcfcf] bg-white px-3.5 text-[16px]">
                  {stage >= 1 ? account.loginId : ""}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[13px] text-[#666]">비밀번호</label>
                <div className="flex h-12 items-center rounded-[6px] border border-[#cfcfcf] bg-white px-3.5 text-[16px] tracking-[0.2em]">
                  {stage >= 1 ? "•".repeat(account.password.length) : ""}
                </div>
              </div>
              {needsCaptcha && (
                <div>
                  <label className="mb-1 block text-[13px] text-[#666]">보안문자</label>
                  <div className="flex gap-2">
                    <div
                      className="relative flex h-12 w-[140px] items-center justify-center gap-1.5 overflow-hidden rounded-[6px] border border-[#cfcfcf] bg-[#f0f0ea] text-[22px] font-bold text-[#444]"
                      aria-label="보안문자 이미지"
                    >
                      {["K", "7", "R", "2", "M"].map((ch, i) => (
                        <span key={i} style={{ transform: `rotate(${(i - 2) * 9}deg) translateY(${i % 2 ? 2 : -2}px)` }}>
                          {ch}
                        </span>
                      ))}
                      <span className="absolute inset-x-0 top-[40%] h-px rotate-[-6deg] bg-[#9a9a90]" />
                    </div>
                    <input
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="문자 입력"
                      className="h-12 min-w-0 flex-1 rounded-[6px] border border-[#cfcfcf] bg-white px-3.5 text-[16px]"
                    />
                  </div>
                </div>
              )}
              <div className="flex h-12 items-center justify-center rounded-[6px] bg-[#3b4a41] text-[16px] font-semibold text-white">
                로그인
              </div>
            </div>
          </div>
        )}

        {account && failed && (
          <div className="px-5 pt-12 text-center">
            <WarningCircle size={40} weight="fill" className="mx-auto text-[var(--tf-red)]" />
            <p className="mt-4 text-[17px] font-semibold">로그인에 실패했어요</p>
            <p className="mt-2 text-[15px] leading-[22px] text-[#555]">
              저장된 아이디 또는 비밀번호가 골프장 사이트와 달라요. 계정 정보를 확인해 주세요.
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={onOpenProfile}>계정 정보 수정</PrimaryButton>
            </div>
          </div>
        )}

        {account && stage === 2 && (
          <div className="px-5 pt-8">
            <h2 className="text-[19px] font-bold">마이페이지</h2>
            <p className="mt-3 text-[16px] text-[#555]">{account.loginId}님 환영합니다</p>
            <div className="mt-5 divide-y divide-[#e6e6e6] rounded-[6px] border border-[#e0e0e0] bg-white text-[15px]">
              {["예약 내역", "회원 정보", "라운드 이용 기록"].map((m) => (
                <div key={m} className="flex h-12 items-center px-4">
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {account && stage >= 3 && (
          <div className="px-5 pt-8">
            <h2 className="text-[19px] font-bold">예약 신청</h2>
            <dl className="mt-5 divide-y divide-[#e6e6e6] rounded-[6px] border border-[#e0e0e0] bg-white text-[15px]">
              <div className="flex h-12 items-center justify-between px-4">
                <dt className="text-[#777]">날짜</dt>
                <dd className="font-medium">{formatLongDate(date)}</dd>
              </div>
              <div className="flex h-12 items-center justify-between px-4">
                <dt className="text-[#777]">시간</dt>
                <dd className="font-medium">{time}</dd>
              </div>
              <div className="flex h-12 items-center justify-between px-4">
                <dt className="text-[#777]">코스</dt>
                <dd className="font-medium">{layout}</dd>
              </div>
              {fee !== undefined && (
                <div className="flex h-12 items-center justify-between px-4">
                  <dt className="text-[#777]">그린피</dt>
                  <dd className="font-medium">{formatFee(fee)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 flex h-12 items-center justify-center rounded-[6px] bg-[#3b4a41] text-[16px] font-semibold text-white">
              예약 신청
            </div>
          </div>
        )}
      </div>

      {/* 자동 진행 상태. 사이트 위에 얹는 불투명 바 */}
      <div className="border-t border-[var(--tf-line)] bg-[var(--tf-surface)] px-5 pb-[46px] pt-3">
        {blockedAtCaptcha ? (
          <div>
            <p className="mb-3 text-[15px] font-medium">보안문자를 직접 입력해 주세요</p>
            <PrimaryButton onClick={() => captcha.trim().length >= 4 && setCaptchaDone(true)} disabled={captcha.trim().length < 4}>
              입력 완료 후 계속
            </PrimaryButton>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {STEPS.map((label, i) => {
              const done = i < doneSteps;
              const active = i === doneSteps && !failed && !!account;
              return (
                <li key={label} className="flex min-h-[28px] items-center gap-2.5 text-[14px]">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      done
                        ? "bg-[var(--tf-green)] text-white"
                        : active
                          ? "bg-[var(--tf-brand)] text-white"
                          : "bg-[var(--tf-soft)] text-[var(--tf-ink-3)]"
                    }`}
                  >
                    {done ? <Check size={12} weight="bold" /> : i + 1}
                  </span>
                  <span className={done || active ? "font-medium text-[var(--tf-ink)]" : "text-[var(--tf-ink-3)]"}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {stage >= 3 && (
          <div className="mt-3">
            <GhostButton onClick={onClose}>앱으로 돌아가기</GhostButton>
          </div>
        )}
      </div>
    </div>
  );
}
