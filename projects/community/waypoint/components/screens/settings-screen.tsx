"use client";

import { useState } from "react";
import {
  Bell,
  Buildings,
  CheckCircle,
  DeviceMobile,
  House,
  Lock,
  ShieldCheck,
  SignOut,
  UserMinus,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, SectionTitle } from "@/projects/community/waypoint/components/ui";
import { MY_VERIFICATION } from "@/projects/community/waypoint/lib/mock-data";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const v = MY_VERIFICATION;
  const [blocked, setBlocked] = useState(v.blockedUsers);
  const [pushOn, setPushOn] = useState(true);

  return (
    <div className="waypoint flex h-full flex-col bg-[var(--wp-canvas)]">
      <ScreenHeader
        title="설정 / 안심거래"
        onBack={onBack}
        className="bg-[var(--wp-surface)] border-[var(--wp-border)]"
        backButtonClassName="text-[var(--wp-ink)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wp-ink)]"
      />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <SectionTitle title="본인 인증" />
        <div className="space-y-2.5">
          <VerifyRow icon={DeviceMobile} label="휴대폰 본인인증" done={v.phoneVerified} detail="PASS 인증 완료" />
          <VerifyRow icon={House} label="집 동네 인증" done={v.homeVerified} detail={`${v.homeAddress} | ${v.homeVerifiedAt}`} />
          <VerifyRow icon={Buildings} label="회사 동네 인증" done={v.workVerified} detail={`${v.workAddress} | ${v.workVerifiedAt}`} />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-[14px] bg-[var(--wp-accent-soft)] px-4 py-3 text-[12.5px] font-medium text-[var(--wp-accent-ink)]">
          <ShieldCheck size={16} weight="fill" />
          듀얼 인증 완료, 안심거래 등급을 유지 중이에요
        </div>

        <div className="mt-7">
          <SectionTitle title="최근 로그인 기기" />
          <div className="divide-y divide-[var(--wp-border)] rounded-[16px] border border-[var(--wp-border)]">
            {v.loginDevices.map((d) => (
              <div key={`${d.device}-${d.at}`} className="flex items-center gap-3 px-4 py-3">
                <DeviceMobile size={17} className="shrink-0 text-[var(--wp-body)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-[var(--wp-ink)]">{d.device}</p>
                  <p className="truncate text-[11.5px] text-[var(--wp-muted)]">
                    {d.location} | {d.at}
                  </p>
                </div>
                {d.current ? (
                  <Badge tone="success">현재 기기</Badge>
                ) : (
                  <button type="button" className="text-[12px] font-medium text-[var(--wp-danger)]">
                    로그아웃
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <SectionTitle title="차단 사용자 관리" />
          {blocked.length === 0 ? (
            <p className="text-[13px] text-[var(--wp-muted)]">차단한 사용자가 없어요</p>
          ) : (
            <div className="divide-y divide-[var(--wp-border)] rounded-[16px] border border-[var(--wp-border)]">
              {blocked.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <UserMinus size={17} className="shrink-0 text-[var(--wp-muted)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] text-[var(--wp-ink)]">{b.nickname}</p>
                    <p className="text-[11.5px] text-[var(--wp-muted)]">{b.blockedAt} 차단</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBlocked((prev) => prev.filter((u) => u.id !== b.id))}
                    className="text-[12px] font-medium text-[var(--wp-accent-ink)]"
                  >
                    차단 해제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7">
          <SectionTitle title="앱 설정" />
          <div className="divide-y divide-[var(--wp-border)] rounded-[16px] border border-[var(--wp-border)]">
            <button
              type="button"
              onClick={() => setPushOn((v2) => !v2)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <Bell size={17} className="text-[var(--wp-body)]" />
              <span className="flex-1 text-[13.5px] text-[var(--wp-ink)]">거래/채팅 알림 받기</span>
              <span
                className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
                  pushOn ? "bg-[var(--wp-accent)]" : "bg-[var(--wp-surface-sunken)]"
                }`}
              >
                <span
                  className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all"
                  style={{ left: pushOn ? 21 : 3 }}
                />
              </span>
            </button>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Lock size={17} className="text-[var(--wp-body)]" />
              <span className="flex-1 text-[13.5px] text-[var(--wp-ink)]">개인정보 처리방침</span>
              <CheckCircle size={15} className="text-[var(--wp-muted)]" />
            </div>
            <button type="button" className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[var(--wp-danger)]">
              <SignOut size={17} />
              <span className="flex-1 text-[13.5px] font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyRow({
  icon: Icon,
  label,
  done,
  detail,
}: {
  icon: React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>;
  label: string;
  done: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-[var(--wp-border)] px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wp-success-soft)] text-[var(--wp-success)]">
        <Icon size={17} weight="fill" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-[var(--wp-ink)]">{label}</p>
        <p className="truncate text-[11.5px] text-[var(--wp-muted)]">{detail}</p>
      </div>
      {done && <CheckCircle size={18} weight="fill" className="shrink-0 text-[var(--wp-success)]" />}
    </div>
  );
}
