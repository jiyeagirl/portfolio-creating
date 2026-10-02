"use client";

import Image from "next/image";
import {
  Buildings,
  CalendarBlank,
  CaretRight,
  ChatCenteredText,
  Phone,
  User,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import type { InspectionJob } from "@/projects/b2b/buildbid-inspector/lib/types";
import { formatUsage } from "@/projects/b2b/buildbid-inspector/lib/mock-data";
import { JobStatusBadge } from "@/projects/b2b/buildbid-inspector/components/ui/status-badge";
import { MapTile } from "@/projects/b2b/buildbid-inspector/components/ui/map-tile";

export function JobDetailScreen({
  job,
  onBack,
  onStart,
}: {
  job: InspectionJob;
  onBack: () => void;
  onStart: () => void;
}) {
  const canStart = job.status !== "완료";

  return (
    <div className="relative h-full w-full overflow-y-auto bbi-scroll-hidden bg-[var(--bbi-canvas)] pb-[128px]">
      <ScreenHeader
        title="검수 일정 상세"
        subtitle={`${job.scheduledTime} | ${job.equipmentType}`}
        onBack={onBack}
        className="bg-[var(--bbi-surface)] border-[var(--bbi-border)]"
        backButtonClassName="text-[var(--bbi-ink)] hover:bg-[var(--bbi-surface-sunken)]"
        titleClassName="text-[15.5px] font-bold text-[var(--bbi-ink)]"
        subtitleClassName="text-[11px] font-semibold text-[var(--bbi-muted)]"
      />

      <div className="px-5 pt-5">
        {/* Equipment summary */}
        <section className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[var(--bbi-surface-sunken)]">
                <Image
                  src={job.photo}
                  alt={`${job.equipmentType} ${job.equipmentModel} 실물 사진`}
                  placeholder="blur"
                  className="h-full w-full object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <h2 className="text-[20px] font-bold leading-[26px] text-[var(--bbi-ink)]">
                  {job.equipmentType}
                </h2>
                <p className="text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">
                  {job.equipmentModel}
                </p>
              </div>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <InfoTile label="연식" value={`${job.equipmentYear}년식`} />
            <InfoTile label="가동 이력" value={formatUsage(job.equipmentType, job.equipmentHours)} />
          </div>

          {job.requestNote && (
            <div className="mt-3 flex items-start gap-2 rounded-[12px] bg-[var(--bbi-accent-soft)] p-3">
              <ChatCenteredText size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--bbi-accent)]" />
              <p className="text-[13px] font-normal leading-[18px] text-[var(--bbi-ink)]">
                {job.requestNote}
              </p>
            </div>
          )}
        </section>

        {/* Seller info */}
        <section className="mt-4 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bbi-ink)]">판매자 정보</h3>
          <div className="mt-3 flex flex-col gap-3">
            <ContactRow icon={<Buildings size={17} weight="bold" />} label="업체명" value={job.companyName} />
            <ContactRow
              icon={<User size={17} weight="bold" />}
              label="담당자"
              value={`${job.contactName} | ${job.contactRole}`}
            />
            <ContactRow
              icon={<Phone size={17} weight="bold" />}
              label="연락처"
              value={job.contactPhone}
              valueClassName="bbi-tabular"
            />
          </div>
        </section>

        {/* Location */}
        <section className="mt-4 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bbi-ink)]">위치 확인</h3>
          <p className="mt-1 text-[15px] font-normal leading-[22px] text-[var(--bbi-body)]">{job.address}</p>
          <p className="text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">{job.addressDetail}</p>
          <div className="mt-3">
            <MapTile tileId={job.mapTileId} />
          </div>
        </section>

        {!canStart && (
          <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface-sunken)] p-4">
            <CalendarBlank size={18} weight="bold" className="text-[var(--bbi-muted)]" />
            <p className="text-[13px] font-semibold leading-[18px] text-[var(--bbi-muted)]">
              이미 제출 완료된 검수 건입니다
            </p>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--bbi-border)] bg-[var(--bbi-surface)] px-5 pb-8 pt-3">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className={`bbi-btn-press flex h-[52px] w-full items-center justify-center gap-1.5 rounded-[9999px] text-[15px] font-bold ${
            canStart
              ? "bg-[var(--bbi-accent)] text-[var(--bbi-on-accent)]"
              : "bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted-soft)]"
          }`}
        >
          {canStart ? "검수 시작" : "검수 완료됨"}
          {canStart && <CaretRight size={16} weight="bold" />}
        </button>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[var(--bbi-surface-sunken)] px-3 py-2.5">
      <p className="text-[11px] font-semibold leading-[14px] text-[var(--bbi-muted)]">{label}</p>
      <p className="bbi-tabular mt-0.5 text-[15px] font-bold leading-[20px] text-[var(--bbi-ink)]">{value}</p>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9999px] bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold leading-[14px] text-[var(--bbi-muted)]">{label}</p>
        <p className={`truncate text-[15px] font-semibold leading-[20px] text-[var(--bbi-ink)] ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
