"use client";

import { useState } from "react";
import { CaretDown, CheckCircle, ChatCircleDots } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  BottomSheet,
  Card,
  Chip,
  Field,
  PrimaryButton,
  SectionHead,
  inputClass,
} from "@/projects/commerce/snowpeak/components/ui";
import { FAQS, INQUIRIES } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { Faq, InquiryStatus } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";

type CategoryFilter = "전체" | Faq["category"];

const CATEGORIES: CategoryFilter[] = ["전체", "예약", "결제", "취소환불", "이용안내"];

const INQUIRY_STATUS_TONE: Record<InquiryStatus, Tone> = {
  답변대기: "warn",
  답변완료: "success",
};

export function SupportScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter((f) => category === "전체" || f.category === category);

  function handleSubmitInquiry() {
    if (!subject.trim() || !body.trim()) return;
    setSubmitted(true);
  }

  function handleCloseInquiry() {
    setInquiryOpen(false);
    setSubmitted(false);
    setSubject("");
    setBody("");
  }

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="고객센터" onBack={() => onNavigate("mypage")} />

      <div className="flex-1 overflow-y-auto pb-10 pt-4">
        {/* FAQ */}
        <SectionHead title="자주 묻는 질문" />
        <div className="sp-scroll-x flex gap-2 overflow-x-auto px-5 pb-3">
          {CATEGORIES.map((cat) => (
            <Chip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
              {cat}
            </Chip>
          ))}
        </div>

        <div className="mx-5 overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]">
          {filteredFaqs.map((faq) => {
            const open = openFaqId === faq.id;
            return (
              <div key={faq.id} className="border-b border-[var(--sp-border)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(open ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="min-w-0 flex-1 text-[13.5px] font-medium text-[var(--sp-ink)]">
                    {faq.question}
                  </span>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`shrink-0 text-[var(--sp-mute)] transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4">
                    <p className="rounded-[12px] bg-[var(--sp-surface-soft)] p-3.5 text-[12.5px] leading-relaxed text-[var(--sp-body)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 1:1 문의 */}
        <div className="mt-7">
          <SectionHead title="1:1 문의" action="문의하기" onAction={() => setInquiryOpen(true)} />
          <div className="px-5">
            {INQUIRIES.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-[16px] border border-dashed border-[var(--sp-border-strong)] px-6 py-10 text-center">
                <ChatCircleDots size={22} weight="bold" className="text-[var(--sp-mute)]" />
                <p className="text-[13px] text-[var(--sp-mute)]">등록된 문의가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {INQUIRIES.slice()
                  .reverse()
                  .map((inq) => (
                    <Card key={inq.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="sp-num text-[11.5px] text-[var(--sp-mute)]">{inq.createdAt}</span>
                        <Badge tone={INQUIRY_STATUS_TONE[inq.status]}>{inq.status}</Badge>
                      </div>
                      <p className="mt-2 text-[14px] font-semibold text-[var(--sp-ink)]">{inq.subject}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sp-mute)]">{inq.body}</p>
                      {inq.status === "답변완료" && inq.answer && (
                        <div className="mt-3 rounded-[12px] bg-[var(--sp-accent-soft)] p-3.5">
                          <p className="text-[11px] font-semibold text-[var(--sp-accent-deep)]">답변</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sp-body)]">{inq.answer}</p>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomSheet
        open={inquiryOpen}
        title="1:1 문의하기"
        onClose={handleCloseInquiry}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle size={30} weight="fill" className="text-[var(--sp-success)]" />
            <p className="text-[14px] font-semibold text-[var(--sp-ink)]">문의가 접수되었습니다</p>
            <p className="text-[12.5px] text-[var(--sp-mute)]">빠르게 확인 후 답변드리겠습니다.</p>
            <button
              type="button"
              onClick={handleCloseInquiry}
              className="mt-2 text-[12.5px] font-semibold text-[var(--sp-mute)] underline underline-offset-2"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Field label="제목">
              <input
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="문의 제목을 입력해 주세요"
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
      </BottomSheet>
    </div>
  );
}
