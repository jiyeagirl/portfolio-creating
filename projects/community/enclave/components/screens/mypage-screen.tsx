"use client";

import {
  CaretRight,
  CheckCircle,
  Envelope,
  House,
  PencilSimple,
  Phone,
  ShieldCheck,
  SignOut,
  Siren,
} from "@phosphor-icons/react";
import { BottomNav } from "@/projects/community/enclave/components/bottom-nav";
import { Avatar, Badge, DongHoTag, ReputationBar } from "@/projects/community/enclave/components/ui";
import { ME, MY_COMPLEX, MY_REVIEWS, MY_VERIFICATION } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/enclave/lib/navigation";

export function MyPageScreen({
  onNavigate,
  onOpenActivity,
}: {
  onNavigate: (key: BottomNavKey) => void;
  onOpenActivity: (tab: "판매내역" | "구매내역" | "찜목록") => void;
}) {
  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-canvas)]">
      <div className="flex-1 overflow-y-auto ec-scroll pb-[92px]">
        <header className="px-5 pb-4 pt-[80px]">
          <div className="flex items-center gap-3">
            <Avatar size={54} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[17px] font-bold text-[var(--ec-ink)]">{ME.nickname}</p>
                <Badge tone="accent" icon={<ShieldCheck size={11} weight="fill" />}>
                  인증회원
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <DongHoTag dong={ME.dong} ho={ME.ho} />
                <span className="truncate text-[12px] text-[var(--ec-muted)]">{MY_COMPLEX.name}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="프로필 수정"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ec-border)] text-[var(--ec-body)]"
            >
              <PencilSimple size={15} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-4 py-3">
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-[var(--ec-muted)]">이웃평판</span>
                <span className="tabular-nums text-[15px] font-bold text-[var(--ec-ink)]">{ME.reputationScore}점</span>
              </div>
              <div className="mt-1.5">
                <ReputationBar value={ME.reputationScore} />
              </div>
            </div>
          </div>
        </header>

        <div className="px-5">
          <div className="grid grid-cols-3 divide-x divide-[var(--ec-border)] rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)]">
            {[
              { key: "판매내역" as const, label: "판매내역", value: "2건" },
              { key: "구매내역" as const, label: "구매내역", value: "1건" },
              { key: "찜목록" as const, label: "찜목록", value: "" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onOpenActivity(item.key)}
                className="flex flex-col items-center gap-1 py-4 transition-colors active:bg-[var(--ec-surface-soft)]"
              >
                <span className="text-[12.5px] text-[var(--ec-muted)]">{item.label}</span>
                <span className="text-[13.5px] font-semibold text-[var(--ec-ink)]">{item.value || "보기"}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="px-5 pt-6">
          <p className="mb-2 text-[13px] font-semibold text-[var(--ec-ink)]">최근 받은 후기</p>
          <div className="space-y-2">
            {MY_REVIEWS.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-[12px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-[var(--ec-ink)]">&ldquo;{r.keyword}&rdquo;</p>
                  <p className="mt-0.5 text-[11px] text-[var(--ec-muted)]">{r.reviewerNickname}</p>
                </div>
                <span className="shrink-0 tabular-nums text-[11px] text-[var(--ec-muted)]">{r.createdAt}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-6">
          <p className="mb-2 text-[13px] font-semibold text-[var(--ec-ink)]">인증 정보</p>
          <div className="space-y-2 rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-4">
            <VerifyRow icon={<Envelope size={15} />} label="이메일 인증" done={MY_VERIFICATION.emailVerified} />
            <VerifyRow icon={<Phone size={15} />} label="휴대폰 본인인증" done={MY_VERIFICATION.phoneVerified} />
            <VerifyRow
              icon={<House size={15} />}
              label={`단지 인증 (${MY_VERIFICATION.verifiedAt})`}
              done={MY_VERIFICATION.verifyStatus === "완료"}
            />
          </div>
        </section>

        <section className="px-5 pt-6">
          <p className="mb-2 text-[13px] font-semibold text-[var(--ec-ink)]">신고 내역</p>
          <div className="flex items-center gap-2 rounded-[14px] border border-dashed border-[var(--ec-border-strong)] px-4 py-3.5 text-[12.5px] text-[var(--ec-muted)]">
            <CheckCircle size={16} weight="fill" className="text-[var(--ec-accent)]" />
            접수되거나 제출한 신고 내역이 없어요
          </div>
        </section>

        <section className="px-5 pt-6">
          <div className="divide-y divide-[var(--ec-border)] rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)]">
            <MenuRow icon={<PencilSimple size={16} />} label="프로필 수정" />
            <MenuRow icon={<Siren size={16} />} label="신고 / 문의하기" />
            <MenuRow icon={<SignOut size={16} />} label="로그아웃" tone="danger" />
          </div>
        </section>
      </div>

      <BottomNav active="mypage" onNavigate={onNavigate} />
    </div>
  );
}

function VerifyRow({ icon, label, done }: { icon: React.ReactNode; label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ec-surface-soft)] text-[var(--ec-body)]">
        {icon}
      </span>
      <span className="flex-1 text-[13.5px] text-[var(--ec-ink)]">{label}</span>
      {done ? (
        <CheckCircle size={16} weight="fill" className="text-[var(--ec-accent)]" />
      ) : (
        <span className="text-[11.5px] text-[var(--ec-muted)]">미완료</span>
      )}
    </div>
  );
}

function MenuRow({ icon, label, tone = "default" }: { icon: React.ReactNode; label: string; tone?: "default" | "danger" }) {
  return (
    <button type="button" className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left">
      <span className={tone === "danger" ? "text-[var(--ec-danger)]" : "text-[var(--ec-body)]"}>{icon}</span>
      <span className={`flex-1 text-[13.5px] ${tone === "danger" ? "text-[var(--ec-danger)]" : "text-[var(--ec-ink)]"}`}>{label}</span>
      <CaretRight size={14} className="text-[var(--ec-muted)]" />
    </button>
  );
}
