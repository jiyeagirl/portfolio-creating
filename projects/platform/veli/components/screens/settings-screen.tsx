"use client";

import { useState } from "react";
import { CheckCircle, Info, Trash, WarningCircle } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import { Toggle } from "@/components/shared/toggle";
import {
  DangerGhostButton,
  Field,
  ListRow,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/platform/veli/components/ui";

export function SettingsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const [pushOn, setPushOn] = useState(true);
  const [callOn, setCallOn] = useState(true);
  const [marketingOn, setMarketingOn] = useState(false);

  const [callLogDeleteRequested, setCallLogDeleteRequested] = useState(false);

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  function handlePasswordChange() {
    if (!currentPw.trim() || !newPw.trim() || !confirmPw.trim()) {
      setPwError("모든 항목을 입력해 주세요");
      setPwSaved(false);
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("새 비밀번호가 일치하지 않습니다");
      setPwSaved(false);
      return;
    }
    setPwError("");
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  return (
    <div className="vl-enter pb-10">

      <section className="mt-2">
        <SectionHead title="비밀번호 변경" />
        <div className="flex flex-col gap-4 px-5">
          <Field label="현재 비밀번호">
            <input
              type="password"
              value={currentPw}
              onChange={(e) => {
                setCurrentPw(e.target.value);
                setPwSaved(false);
              }}
              className={inputClass}
            />
          </Field>
          <Field label="새 비밀번호">
            <input
              type="password"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                setPwSaved(false);
              }}
              className={inputClass}
            />
          </Field>
          <Field label="새 비밀번호 확인" error={pwError || undefined}>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setPwSaved(false);
                setPwError("");
              }}
              className={inputClass}
            />
          </Field>
          {pwSaved && (
            <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--vl-success)]">
              <CheckCircle size={14} weight="fill" />
              비밀번호가 변경되었습니다
            </p>
          )}
          <PrimaryButton onClick={handlePasswordChange}>변경하기</PrimaryButton>
        </div>
      </section>

      <section className="mt-7">
        <SectionHead title="알림 설정" />
        <div className="mx-5 overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-normal text-[var(--vl-ink)]">푸시 알림</p>
              <p className="mt-0.5 text-[12px] text-[var(--vl-muted)]">
                통화 연결과 이용권 만료를 앱 알림으로 받아요
              </p>
            </div>
            <Toggle
              checked={pushOn}
              onChange={setPushOn}
              label="푸시 알림"
              onClassName="bg-[var(--vl-accent)]"
              offClassName="bg-[var(--vl-border)]"
            />
          </div>
          <div className="flex items-center gap-3 border-t border-[var(--vl-divider)] px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-normal text-[var(--vl-ink)]">통화 알림</p>
              <p className="mt-0.5 text-[12px] text-[var(--vl-muted)]">
                안심번호로 걸려온 부재중 전화를 알려줘요
              </p>
            </div>
            <Toggle
              checked={callOn}
              onChange={setCallOn}
              label="통화 알림"
              onClassName="bg-[var(--vl-accent)]"
              offClassName="bg-[var(--vl-border)]"
            />
          </div>
          <div className="flex items-center gap-3 border-t border-[var(--vl-divider)] px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-normal text-[var(--vl-ink)]">마케팅 정보 수신</p>
              <p className="mt-0.5 text-[12px] text-[var(--vl-muted)]">
                할인과 프로모션 소식을 받아볼 수 있어요
              </p>
            </div>
            <Toggle
              checked={marketingOn}
              onChange={setMarketingOn}
              label="마케팅 정보 수신"
              onClassName="bg-[var(--vl-accent)]"
              offClassName="bg-[var(--vl-border)]"
            />
          </div>
        </div>
      </section>

      <section className="mt-7">
        <SectionHead title="개인정보와 보안" />
        <div className="mx-5 overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]">
          <ListRow
            icon={<Trash size={16} />}
            label="통화 기록 삭제 요청"
            onClick={() => setCallLogDeleteRequested(true)}
          />
        </div>
        {callLogDeleteRequested && (
          <div className="mx-5 mt-2 flex items-start gap-2 rounded-[12px] bg-[var(--vl-surface)] p-3.5">
            <Info size={14} className="mt-[2px] shrink-0 text-[var(--vl-muted)]" />
            <p className="text-[12px] leading-relaxed text-[var(--vl-muted)]">
              요청이 접수되었습니다. 개인정보 처리방침에 따라 영업일 기준 3일 이내 삭제 처리됩니다.
            </p>
          </div>
        )}
      </section>

      <section className="mt-7 px-5 pb-4">
        <SectionHead title="회원 탈퇴" />
        <DangerGhostButton onClick={() => setShowWithdrawConfirm(true)}>회원 탈퇴</DangerGhostButton>

        {showWithdrawConfirm && (
          <div className="mt-3 rounded-[12px] border border-[var(--vl-danger)]/30 bg-[var(--vl-danger-soft)] p-4">
            <p className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--vl-danger)]">
              <WarningCircle size={16} weight="fill" />
              정말 탈퇴하시겠어요
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--vl-ink)]">
              탈퇴하면 발급된 안심번호와 이용권 혜택이 모두 사라지고, 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawConfirm(false)}
                className="flex-1 rounded-full border border-[var(--vl-border)] bg-[var(--vl-elevated)] py-3 text-[14px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="flex-1 rounded-full bg-[var(--vl-danger)] py-3 text-[14px] font-bold text-white transition-transform active:translate-y-[1px] active:opacity-70"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
