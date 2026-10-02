"use client";

import { useState } from "react";
import { Bell, CheckCircle, EnvelopeSimple, Phone, SignOut, WarningCircle } from "@phosphor-icons/react";
import { Card, Monogram, SectionTitle, ScreenHeader, Toggle } from "@/projects/monitoring/marketflow-mobile/components/ui";
import { adminProfile, brands } from "@/projects/monitoring/marketflow-mobile/lib/mock-data";
import type { NotificationSettings } from "@/projects/monitoring/marketflow-mobile/lib/types";

export function MypageScreen({
  settings,
  onChangeSettings,
}: {
  settings: NotificationSettings;
  onChangeSettings: (next: NotificationSettings) => void;
}) {
  const [loggedOut, setLoggedOut] = useState(false);
  const assignedBrands = brands.filter((brand) => adminProfile.assignedBrandIds.includes(brand.id));

  function updateSetting(key: keyof NotificationSettings, value: boolean) {
    onChangeSettings({ ...settings, [key]: value });
  }

  return (
    <div>
      <ScreenHeader title="마이페이지" subtitle="계정 및 알림 설정" />

      <div className="flex flex-col gap-7 px-4 pb-28 pt-5">
        <Card className="flex flex-col gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Monogram letter={adminProfile.name.slice(0, 1)} size={52} className="text-[16px]" />
            <div>
              <p className="text-[16px] font-bold text-[var(--mfm-ink)]">{adminProfile.name}</p>
              <p className="text-[12px] text-[var(--mfm-muted)]">{adminProfile.role}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-[var(--mfm-hairline-soft)] pt-3.5">
            <div className="flex items-center gap-2.5 text-[12.5px] text-[var(--mfm-body)]">
              <EnvelopeSimple size={15} className="text-[var(--mfm-muted-soft)]" />
              <span className="truncate">{adminProfile.email}</span>
            </div>
            <div className="mfm-tabular flex items-center gap-2.5 text-[12.5px] text-[var(--mfm-body)]">
              <Phone size={15} className="text-[var(--mfm-muted-soft)]" />
              <span>{adminProfile.phone}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <SectionTitle title="담당 브랜드/조직" />
          <div className="flex flex-col gap-2">
            {assignedBrands.map((brand) => (
              <Card key={brand.id} className="flex items-center gap-3 px-3.5 py-3">
                <Monogram letter={brand.initial} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--mfm-ink)]">{brand.name}</p>
                  <p className="text-[11px] text-[var(--mfm-muted)]">{brand.industry}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle title="알림 수신 설정" />
          <Card className="flex flex-col divide-y divide-[var(--mfm-hairline-soft)] px-4">
            <SettingRow
              icon={<Bell size={16} />}
              label="승인 요청 알림"
              detail="새 콘텐츠 승인 요청이 오면 알려드려요"
              checked={settings.approvalRequest}
              onChange={(next) => updateSetting("approvalRequest", next)}
            />
            <SettingRow
              icon={<CheckCircle size={16} />}
              label="발행 완료 알림"
              detail="예약한 콘텐츠가 발행되면 알려드려요"
              checked={settings.publishComplete}
              onChange={(next) => updateSetting("publishComplete", next)}
            />
            <SettingRow
              icon={<WarningCircle size={16} />}
              label="발행 오류 알림"
              detail="발행에 실패하면 즉시 알려드려요"
              checked={settings.publishError}
              onChange={(next) => updateSetting("publishError", next)}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setLoggedOut(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--mfm-hairline)] text-[13.5px] font-semibold text-[var(--mfm-error)] transition-colors active:bg-[var(--mfm-error-soft)]"
          >
            <SignOut size={16} weight="bold" />
            로그아웃
          </button>
          {loggedOut && (
            <p className="text-center text-[11.5px] text-[var(--mfm-muted)]">로그아웃되었습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  detail,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--mfm-surface-card)] text-[var(--mfm-body-strong)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--mfm-ink)]">{label}</p>
        <p className="mt-0.5 text-[11px] leading-[1.4] text-[var(--mfm-muted)]">{detail}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
