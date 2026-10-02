"use client";

import { useState } from "react";
import {
  CheckCircle,
  Headset,
  PawPrint,
  PencilSimple,
  ShoppingBag,
  SignOut,
  Ticket,
} from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  Field,
  ListRow,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/commerce/pawfit/components/ui";
import { COUPONS, CURRENT_USER } from "@/projects/commerce/pawfit/lib/mock-data";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

function formatJoinedDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}월 ${d}일`;
}

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [csOpen, setCsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const unusedCoupons = COUPONS.filter((c) => !c.used);
  const soonestCoupon = [...unusedCoupons].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))[0];

  function handleSubmitInquiry() {
    if (!subject.trim() || !body.trim()) return;
    setSubmitted(true);
    setSubject("");
    setBody("");
  }

  function handleCloseInquiry() {
    setCsOpen(false);
    setSubmitted(false);
    setSubject("");
    setBody("");
  }

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="마이페이지" />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* 사용자 요약 */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-strong)] text-[20px] font-semibold text-[var(--pf-ink)]">
              {CURRENT_USER.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-semibold text-[var(--pf-ink)]">{CURRENT_USER.name}</p>
              <p className="mt-0.5 truncate text-[13px] text-[var(--pf-muted)]">{CURRENT_USER.email}</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--pf-muted-soft)]">
                {formatJoinedDate(CURRENT_USER.joinedAt)} 가입
              </p>
            </div>
          </div>
        </div>

        {/* 계정 */}
        <div className="mt-6 px-5">
          <SectionHead title="계정" />
        </div>
        <div className="mx-5 overflow-hidden rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]">
          <ListRow icon={<ShoppingBag size={16} weight="bold" />} label="주문내역" onClick={() => onNavigate("orderHistory")} />
          <ListRow icon={<PawPrint size={16} weight="bold" />} label="반려동물 관리" onClick={() => onNavigate("petProfile")} />
          <ListRow icon={<PencilSimple size={16} weight="bold" />} label="회원정보 수정" onClick={() => onNavigate("profileEdit")} />
        </div>

        {/* 보유 쿠폰 */}
        <div className="mt-6 px-5">
          <SectionHead title="보유 쿠폰" />
          <div className="rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-card)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Ticket size={18} weight="duotone" className="text-[var(--pf-ink)]" />
                <p className="text-[14px] font-semibold text-[var(--pf-ink)]">
                  사용 가능한 쿠폰 {unusedCoupons.length}장
                </p>
              </div>
              {soonestCoupon ? (
                <Badge tone="accent">{formatShortDate(soonestCoupon.expiresAt)}까지</Badge>
              ) : (
                <Badge tone="neutral">보유 쿠폰 없음</Badge>
              )}
            </div>
            {soonestCoupon && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--pf-muted)]">
                가장 빨리 만료되는 쿠폰: {soonestCoupon.label}
              </p>
            )}
          </div>
        </div>

        {/* 고객센터 */}
        <div className="mt-6 px-5">
          <SectionHead title="고객센터" />
          <div className="overflow-hidden rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]">
            <ListRow
              icon={<Headset size={16} weight="bold" />}
              label="1:1 문의하기"
              value={csOpen ? "접기" : "펼치기"}
              onClick={() => setCsOpen((v) => !v)}
            />
            {csOpen && (
              <div className="border-t border-[var(--pf-hairline)] p-4">
                {submitted ? (
                  <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <CheckCircle size={28} weight="fill" className="text-[var(--pf-success)]" />
                    <p className="text-[14px] font-semibold text-[var(--pf-ink)]">문의가 접수되었습니다</p>
                    <p className="text-[12.5px] text-[var(--pf-muted)]">빠르게 확인 후 답변드릴게요.</p>
                    <button
                      type="button"
                      onClick={handleCloseInquiry}
                      className="mt-2 text-[12.5px] font-semibold text-[var(--pf-muted)] underline underline-offset-2"
                    >
                      닫기
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Field label="제목">
                      <input
                        className={inputClass}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="문의 제목을 입력해주세요"
                      />
                    </Field>
                    <Field label="내용">
                      <textarea
                        rows={4}
                        className={`${inputClass} resize-none`}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="문의 내용을 자세히 적어주시면 빠르게 도와드릴게요"
                      />
                    </Field>
                    <PrimaryButton onClick={handleSubmitInquiry} disabled={!subject.trim() || !body.trim()}>
                      문의 보내기
                    </PrimaryButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="mt-6 px-5">
          <div className="overflow-hidden rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]">
            <ListRow icon={<SignOut size={16} weight="bold" />} label="로그아웃" danger onClick={() => onNavigate("login")} />
          </div>
        </div>
      </div>
    </div>
  );
}
