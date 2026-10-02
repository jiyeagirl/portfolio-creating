"use client";

import { useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Toggle } from "@/components/shared/toggle";
import { ME } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { Button } from "@/projects/community/wedit/components/ui";

export function AccountScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [name, setName] = useState(ME.name);
  const [email, setEmail] = useState(ME.email);
  const [marketingAlert, setMarketingAlert] = useState(false);
  const [communityAlert, setCommunityAlert] = useState(true);

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="계정 관리"
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
      />

      <div className="flex flex-col gap-6 px-5 pt-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
          <p className="text-[13px] font-semibold text-[var(--wd-ink)]">개인정보 수정</p>
          <Field label="이름" value={name} onChange={setName} />
          <Field label="이메일" value={email} onChange={setEmail} />
          <Field label="휴대폰 번호" value="010-****-5821" onChange={() => {}} readOnly />
        </div>

        <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-4">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13px] font-medium text-[var(--wd-ink)]">마케팅 알림</p>
              <p className="mt-0.5 text-[11px] text-[var(--wd-muted)]">기획전, 이벤트 소식 수신</p>
            </div>
            <Toggle
              checked={marketingAlert}
              onChange={setMarketingAlert}
              label="마케팅 알림"
              onClassName="bg-[var(--wd-accent)]"
              offClassName="bg-[var(--wd-border)]"
            />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13px] font-medium text-[var(--wd-ink)]">커뮤니티 알림</p>
              <p className="mt-0.5 text-[11px] text-[var(--wd-muted)]">답변, 댓글 알림 수신</p>
            </div>
            <Toggle
              checked={communityAlert}
              onChange={setCommunityAlert}
              label="커뮤니티 알림"
              onClassName="bg-[var(--wd-accent)]"
              offClassName="bg-[var(--wd-border)]"
            />
          </div>
        </div>

        <Button fullWidth variant="ghost" icon={<SignOut size={13} weight="bold" />} onClick={() => onNavigate("home")}>
          로그아웃
        </Button>

        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-center text-[11.5px] text-[var(--wd-muted)] underline underline-offset-2"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-medium text-[var(--wd-muted)]">{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 rounded-xl border border-[var(--wd-border)] px-3.5 text-[13.5px] text-[var(--wd-ink)] outline-none ${
          readOnly ? "bg-[var(--wd-canvas)] text-[var(--wd-muted)]" : "bg-white"
        }`}
      />
    </label>
  );
}
