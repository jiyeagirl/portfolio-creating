"use client";

import Image from "next/image";
import { Buildings, Megaphone, UserCircle } from "@phosphor-icons/react";
import { Card, CardHead, PageHead } from "@/projects/monitoring/safesense/components/admin/ui";
import { sites } from "@/projects/monitoring/safesense/lib/mock-data";

const ADMIN_ACCOUNTS = [
  { name: "오세연", role: "안전관리 총괄", scope: "전체 현장" },
  { name: "한지훈", role: "현장 관리자", scope: "A건설 강남 현장" },
  { name: "배준혁", role: "현장 관리자", scope: "C중공업 부산 조선소 2블록" },
];

const NOTICES = [
  { title: "7월 정기 안전 점검 일정 공지", at: "07.28" },
  { title: "혹서기 근무 시간 조정 안내", at: "07.22" },
  { title: "신규 센서 캘리브레이션 절차 변경", at: "07.15" },
];

export function AdminSites() {
  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="SITE MANAGEMENT"
        title="현장 관리"
        desc="현장/회사/관리자 계정/공지사항을 관리합니다."
        actions={
          <button className="ss-press ss-focusable rounded-[8px] border border-[var(--ss-accent)] bg-[var(--ss-accent)] px-4 py-2 text-[11px] font-bold text-[#0a0a0a]">
            현장 등록
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-[10px] bg-[var(--ss-border)] sm:grid-cols-3">
        {sites.map((site) => (
          <div key={site.id} className="bg-[var(--ss-panel)]">
            <div className="relative h-[104px] overflow-hidden border-b border-[var(--ss-border)]">
              <Image src={`https://picsum.photos/id/${site.photoId}/500/300`} alt={site.name} fill className="object-cover grayscale" />
              <div className="absolute inset-0 bg-[var(--ss-bg)]/60" />
            </div>
            <div className="p-4">
              <p className="ss-mono flex items-center gap-1.5 text-[9px] text-[var(--ss-muted)]">
                <Buildings size={11} />
                {site.address}
              </p>
              <p className="mt-1.5 text-[13.5px] font-semibold text-[var(--ss-foreground)]">{site.name}</p>
              <p className="ss-mono mt-2 text-[10px] text-[var(--ss-muted)]">
                담당 {site.managerName} / 근로자 {site.workerCount}명
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] lg:grid-cols-2">
        <Card>
          <CardHead title="관리자 계정" desc="현장별 접근 권한" />
          <div className="divide-y divide-[var(--ss-border)] px-5 pb-5">
            {ADMIN_ACCOUNTS.map((a) => (
              <div key={a.name} className="flex items-center gap-3 py-3">
                <UserCircle size={22} className="shrink-0 text-[var(--ss-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-[var(--ss-foreground)]">
                    {a.name} <span className="ss-mono text-[10px] font-normal text-[var(--ss-muted)]">/ {a.role}</span>
                  </p>
                  <p className="ss-mono mt-0.5 text-[10px] text-[var(--ss-muted)]">{a.scope}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="공지사항" desc="근로자 앱으로 발행되는 공지" />
          <div className="divide-y divide-[var(--ss-border)] px-5 pb-5">
            {NOTICES.map((n) => (
              <div key={n.title} className="flex items-center gap-3 py-3">
                <Megaphone size={17} className="shrink-0 text-[var(--ss-muted)]" />
                <p className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--ss-foreground)]">{n.title}</p>
                <span className="ss-mono shrink-0 text-[10px] text-[var(--ss-muted)]">{n.at}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
