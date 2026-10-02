"use client";

import { useState } from "react";
import {
  CaretDown,
  ChatCircleDots,
  CheckCircle,
  GearSix,
  PencilSimple,
  SignOut,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import type { FaqItem } from "@/projects/platform/veli/lib/types";
import { CURRENT_USER, FAQ_ITEMS, MY_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import {
  Field,
  InitialAvatar,
  ListRow,
  PrimaryButton,
  SafeNumberStatusBadge,
  SectionHead,
  VehicleTile,
  inputClass,
} from "@/projects/platform/veli/components/ui";

/* FAQ를 고객센터 화면에서 보여줄 카테고리 순서. 안심번호/통화처럼 이 화면과 맞닿아 있는
   주제를 먼저 보여주고, 이용권/계정은 뒤로 둔다. */
const FAQ_CATEGORY_ORDER: FaqItem["category"][] = ["안심번호", "통화", "이용권", "계정"];

function formatJoinDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const primary = MY_SAFE_NUMBERS[0];

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryBody, setInquiryBody] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const faqGroups = FAQ_CATEGORY_ORDER.map((category) => ({
    category,
    items: FAQ_ITEMS.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  function toggleInquiry() {
    setShowInquiry((prev) => !prev);
    setInquirySubmitted(false);
  }

  function submitInquiry() {
    if (!inquirySubject.trim() || !inquiryBody.trim()) return;
    setInquirySubject("");
    setInquiryBody("");
    setInquirySubmitted(true);
  }

  return (
    <div className="vl-enter pb-10">
      <section className="flex items-center gap-4 px-5 pb-1 pt-3">
        <InitialAvatar name={CURRENT_USER.name} size={56} />
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-bold tracking-tight">{CURRENT_USER.name}</p>
          <p className="vl-num mt-0.5 text-[13px] text-[var(--vl-muted)]">
            {CURRENT_USER.phoneMasked}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-[var(--vl-muted)]">
            {CURRENT_USER.email}
          </p>
        </div>
      </section>
      <p className="vl-num px-5 pb-5 pt-1 text-[11.5px] text-[var(--vl-muted-soft)]">
        {formatJoinDate(CURRENT_USER.joinedAt)} 가입
      </p>

      <section className="px-5">
        <div className="flex items-center gap-3 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 py-3.5">
          <VehicleTile color={primary.vehicle.color} size={44} />
          <div className="min-w-0 flex-1">
            <p className="vl-num text-[14px] font-bold">{primary.vehicle.number}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-[var(--vl-muted)]">
              {primary.vehicle.model}, {primary.vehicle.color}
            </p>
          </div>
          <SafeNumberStatusBadge status={primary.status} />
        </div>
      </section>

      <section className="mt-7">
        <SectionHead title="계정" />
        <div className="mx-5 overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]">
          <ListRow
            icon={<PencilSimple size={16} />}
            label="프로필 수정"
            onClick={() => onNavigate("profileEdit")}
          />
          <ListRow
            icon={<GearSix size={16} />}
            label="설정"
            onClick={() => onNavigate("settings")}
          />
        </div>
      </section>

      <section className="mt-6">
        <SectionHead title="고객센터" note="자주 묻는 질문과 1:1 문의" />
        <div className="mx-5 overflow-hidden rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)]">
          {faqGroups.map((group, groupIndex) => (
            <div
              key={group.category}
              className={groupIndex > 0 ? "border-t border-[var(--vl-divider)]" : ""}
            >
              <p className="px-5 pb-2 pt-4 text-[11.5px] font-semibold text-[var(--vl-muted)]">
                {group.category}
              </p>
              {group.items.map((item) => {
                const open = openFaqId === item.id;
                return (
                  <div key={item.id} className="border-t border-[var(--vl-divider)] first:border-t-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(open ? null : item.id)}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left"
                    >
                      <span className="flex-1 text-[14px] font-normal text-[var(--vl-ink)]">
                        {item.question}
                      </span>
                      <CaretDown
                        size={14}
                        className={`shrink-0 text-[var(--vl-muted)] transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="px-5 pb-4 text-[13px] leading-relaxed text-[var(--vl-muted)]">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="border-t border-[var(--vl-divider)]">
            <ListRow icon={<ChatCircleDots size={16} />} label="1:1 문의하기" onClick={toggleInquiry} />
            {showInquiry && (
              <div className="border-t border-[var(--vl-divider)] px-5 py-4">
                {inquirySubmitted ? (
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--vl-success)]">
                    <CheckCircle size={15} weight="fill" />
                    문의가 접수되었습니다
                  </p>
                ) : (
                  <div className="space-y-3">
                    <Field label="제목">
                      <input
                        value={inquirySubject}
                        onChange={(e) => setInquirySubject(e.target.value)}
                        placeholder="문의 제목을 입력해 주세요"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="내용">
                      <textarea
                        value={inquiryBody}
                        onChange={(e) => setInquiryBody(e.target.value)}
                        placeholder="문의 내용을 자세히 적어 주시면 빠르게 도와드릴게요"
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                    <PrimaryButton
                      onClick={submitInquiry}
                      disabled={!inquirySubject.trim() || !inquiryBody.trim()}
                    >
                      문의 등록
                    </PrimaryButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-semibold text-[var(--vl-muted)]"
        >
          <SignOut size={14} />
          로그아웃
        </button>
      </section>
    </div>
  );
}
