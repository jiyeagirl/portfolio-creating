"use client";

import { useState } from "react";
import { LockKey, Plus } from "@phosphor-icons/react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import { maskPassword } from "@/projects/b2b/teefinder/lib/format";
import {
  useScrim,
  Field,
  GhostButton,
  PrimaryButton,
  SelectField,
  Sheet,
} from "@/projects/b2b/teefinder/components/app/app-ui";
import { Badge, accountTone, memberTone } from "@/projects/b2b/teefinder/components/ui";

export function ProfileScreen({ initialWithdraw = false }: { initialWithdraw?: boolean }) {
  const { session, accounts, courses, withdraw, logout } = useStore();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(initialWithdraw);
  const [destroyed, setDestroyed] = useState<number | null>(null);

  useScrim(confirmOpen || destroyed !== null);

  if (!session) return null;

  return (
    <div className="relative flex h-full flex-col bg-[var(--tf-canvas)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-surface)] pt-[59px]">
        <div className="flex h-14 items-end px-5 pb-2">
          <h1 className="text-[24px] font-bold tracking-[-0.02em]">내 정보</h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="bg-[var(--tf-surface)] px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-[22px] font-bold tracking-[-0.02em]">{session.name}</p>
            <Badge tone={memberTone(session.status)}>{session.status === "정상" ? "승인됨" : session.status}</Badge>
          </div>
          <dl className="mt-4 divide-y divide-[var(--tf-line)] border-t border-[var(--tf-line)] text-[15px]">
            <div className="flex min-h-[48px] items-center justify-between gap-4">
              <dt className="shrink-0 text-[var(--tf-ink-3)]">연락처</dt>
              <dd className="font-medium">{session.phone}</dd>
            </div>
            <div className="flex min-h-[48px] items-center justify-between gap-4">
              <dt className="shrink-0 text-[var(--tf-ink-3)]">회원권</dt>
              <dd className="truncate font-medium">{session.membershipLabel}</dd>
            </div>
            <div className="flex min-h-[48px] items-center justify-between gap-4">
              <dt className="shrink-0 text-[var(--tf-ink-3)]">회원권 번호</dt>
              <dd className="tf-mono font-medium">{session.membershipNo}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-3 bg-[var(--tf-surface)] pt-5">
          <div className="flex items-center justify-between px-5">
            <h2 className="text-[18px] font-bold tracking-[-0.01em]">골프장 계정</h2>
            <span className="text-[14px] text-[var(--tf-ink-3)]">{accounts.length}곳 등록</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 px-5 text-[13px] text-[var(--tf-ink-3)]">
            <LockKey size={15} weight="fill" />
            암호화되어 보관돼요
          </p>
          {accounts.length === 0 ? (
            <p className="px-5 py-8 text-[16px] text-[var(--tf-ink-2)]">등록한 골프장 계정이 없어요</p>
          ) : (
            <ul className="mt-2 divide-y divide-[var(--tf-line)]">
              {accounts.map((a) => (
                <li key={a.courseId}>
                  <button
                    type="button"
                    onClick={() => setEditing(a.courseId)}
                    className="tf-press flex min-h-[72px] w-full items-center gap-3 px-5 text-left active:bg-[var(--tf-soft)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold tracking-[-0.01em]">
                        {getCourse(a.courseId).name}
                      </span>
                      <span className="mt-0.5 block truncate text-[14px] text-[var(--tf-ink-2)]">
                        {a.loginId}{"  "}
                        <span className="tracking-[0.12em] text-[var(--tf-ink-3)]">{maskPassword(a.password)}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge tone={accountTone(a.status)} compact>
                        {a.status}
                      </Badge>
                      <span className="text-[13px] font-medium text-[var(--tf-ink-2)] underline underline-offset-4">
                        {a.status === "정상" ? "수정" : "다시 입력"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="px-5 pb-5 pt-3">
            <GhostButton onClick={() => setEditing("new")}>
              <Plus size={20} weight="bold" />
              계정 추가
            </GhostButton>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="tf-press h-11 px-4 text-[15px] font-medium text-[var(--tf-red-fg)] underline underline-offset-4"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {editing && (
        <AccountSheet
          key={editing}
          courseId={editing === "new" ? null : editing}
          registered={accounts.map((a) => a.courseId)}
          onClose={() => setEditing(null)}
          courses={courses.map((c) => ({ id: c.id, name: c.name }))}
        />
      )}

      {confirmOpen && destroyed === null && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setConfirmOpen(false)}
            className="absolute inset-0 bg-[rgba(24,35,29,0.4)]"
          />
          <div className="tf-enter relative w-full rounded-[20px] bg-[var(--tf-surface)] p-6 shadow-[var(--tf-sheet-shadow)]">
            <h2 className="text-[20px] font-bold tracking-[-0.02em]">회원 탈퇴</h2>
            <p className="mt-3 text-[16px] leading-6 text-[var(--tf-ink-2)]">
              등록한 골프장 계정 정보가 즉시 파기돼요. 파기한 정보는 복구할 수 없어요.
            </p>
            <div className="mt-6 flex gap-3">
              <GhostButton onClick={() => setConfirmOpen(false)} className="flex-1">
                취소
              </GhostButton>
              <button
                type="button"
                onClick={() => setDestroyed(withdraw())}
                className="tf-press flex h-[52px] flex-1 items-center justify-center rounded-[14px] bg-[var(--tf-red-fg)] text-[16px] font-semibold text-white active:bg-[#8a2b22]"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}

      {destroyed !== null && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--tf-canvas)] px-6">
          <div className="tf-enter w-full text-center">
            <p className="text-[24px] font-bold tracking-[-0.02em]">탈퇴가 완료되었어요</p>
            <p className="mt-3 text-[16px] leading-6 text-[var(--tf-ink-2)]">
              골프장 계정 정보 {destroyed}건을 파기했어요.
            </p>
            <div className="mt-8">
              <PrimaryButton onClick={logout}>로그인 화면으로</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountSheet({
  courseId,
  registered,
  courses,
  onClose,
}: {
  courseId: string | null;
  registered: string[];
  courses: Array<{ id: string; name: string }>;
  onClose: () => void;
}) {
  const { accounts, saveAccount, deleteAccount } = useStore();
  const existing = accounts.find((a) => a.courseId === courseId);
  const available = courses.filter((c) => !registered.includes(c.id));
  const [target, setTarget] = useState(courseId ?? available[0]?.id ?? "");
  const [loginId, setLoginId] = useState(existing?.loginId ?? "");
  const [password, setPassword] = useState(existing?.password ?? "");

  return (
    <Sheet title={existing ? "골프장 계정 수정" : "골프장 계정 추가"} onClose={onClose}>
      <div className="space-y-4">
        {existing ? (
          <p className="text-[17px] font-semibold">{getCourse(existing.courseId).name}</p>
        ) : (
          <SelectField
            label="골프장"
            value={target}
            onChange={setTarget}
            options={available.map((c) => ({ value: c.id, label: c.name }))}
          />
        )}
        <Field label="아이디" value={loginId} onChange={setLoginId} />
        <Field label="비밀번호" value={password} onChange={setPassword} type="password" />
        <p className="flex items-center gap-1.5 text-[13px] text-[var(--tf-ink-3)]">
          <LockKey size={15} weight="fill" />
          암호화되어 보관돼요
        </p>
        <PrimaryButton
          disabled={loginId.trim() === "" || password === "" || target === ""}
          onClick={() => {
            saveAccount(target, loginId.trim(), password);
            onClose();
          }}
        >
          저장
        </PrimaryButton>
        {existing && (
          <GhostButton
            onClick={() => {
              deleteAccount(existing.courseId);
              onClose();
            }}
          >
            계정 삭제
          </GhostButton>
        )}
      </div>
    </Sheet>
  );
}
