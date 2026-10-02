"use client";

import {
  BookmarkSimple,
  CaretRight,
  ClockCounterClockwise,
  Headset,
  Note,
  ShieldCheck,
  UserGear,
} from "@phosphor-icons/react";
import { ME } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn, View } from "@/projects/community/wedit/lib/navigation";
import { Avatar } from "@/projects/community/wedit/components/ui";

const MENU: { view: View; label: string; icon: typeof ShieldCheck; description: string }[] = [
  { view: "myVerifications", label: "내 인증 관리", icon: ShieldCheck, description: "인증 진행 현황, 승인/반려 내역" },
  { view: "myReviews", label: "내 리뷰 관리", icon: Note, description: "작성한 리뷰, 임시 저장" },
  { view: "bookmarks", label: "관심 업체", icon: BookmarkSimple, description: "북마크, 비교함" },
  { view: "activity", label: "활동 내역", icon: ClockCounterClockwise, description: "작성 게시글, 댓글, 좋아요" },
  { view: "support", label: "고객센터", icon: Headset, description: "1:1 문의, FAQ, 공지사항" },
  { view: "account", label: "계정 관리", icon: UserGear, description: "개인정보 수정, 로그아웃" },
];

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="flex min-h-full w-full flex-col gap-6 pb-[108px] pt-[72px]">
      <div className="flex items-center gap-3 px-5">
        <Avatar initial={ME.name[0]} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold text-[var(--wd-ink)]">{ME.name}님</p>
          <p className="truncate text-[12px] text-[var(--wd-muted)]">{ME.email}</p>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-3 divide-x divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white py-4">
        <Stat value={ME.verifiedVendorCount} label="인증 업체" />
        <Stat value={ME.writtenReviewCount} label="작성 리뷰" />
        <Stat value={ME.bookmarkCount} label="북마크" />
      </div>

      <button
        type="button"
        onClick={() => onNavigate("verifyUpload")}
        className="mx-5 flex items-center justify-between rounded-2xl bg-[var(--wd-accent)] px-4 py-3.5"
      >
        <span className="text-[13.5px] font-semibold text-white">결제하셨나요? 지금 인증하기</span>
        <CaretRight size={15} className="text-white" />
      </button>

      <div className="flex flex-col divide-y divide-[var(--wd-border)] px-5">
        {MENU.map((m) => (
          <button
            key={m.view}
            type="button"
            onClick={() => onNavigate(m.view)}
            className="flex items-center gap-3 py-4 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--wd-surface-tint)] text-[var(--wd-accent)]">
              <m.icon size={19} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[var(--wd-ink)]">{m.label}</p>
              <p className="truncate text-[11.5px] text-[var(--wd-muted)]">{m.description}</p>
            </div>
            <CaretRight size={15} className="text-[var(--wd-muted)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[17px] font-bold tabular-nums text-[var(--wd-ink)]">{value}</span>
      <span className="text-[11px] text-[var(--wd-muted)]">{label}</span>
    </div>
  );
}
