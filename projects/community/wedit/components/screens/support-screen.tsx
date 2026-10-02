"use client";

import { useState } from "react";
import { CaretDown, Headset, PaperPlaneTilt } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { FAQS, NOTICES } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { Button } from "@/projects/community/wedit/components/ui";

export function SupportScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<"faq" | "notice">("faq");
  const [openId, setOpenId] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="고객센터"
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
      />

      <div className="flex flex-col gap-4 px-5 pt-5">
        {!inquiryOpen ? (
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className="flex items-center gap-3 rounded-2xl bg-[var(--wd-surface-tint)] p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--wd-accent)]">
              <Headset size={19} weight="duotone" />
            </span>
            <div className="flex-1 text-left">
              <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">1:1 문의하기</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--wd-muted)]">평균 응답 시간 6시간 이내</p>
            </div>
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
            <p className="text-[13px] font-semibold text-[var(--wd-ink)]">1:1 문의</p>
            {sent ? (
              <p className="text-[12.5px] text-[var(--wd-muted)]">문의가 접수됐어요. 답변은 이메일로 안내드려요.</p>
            ) : (
              <>
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  rows={4}
                  placeholder="문의 내용을 입력해주세요"
                  className="resize-none rounded-xl border border-[var(--wd-border)] p-3 text-[13px] leading-[19px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
                />
                <Button size="sm" icon={<PaperPlaneTilt size={12} weight="bold" />} onClick={() => setSent(true)} disabled={!inquiryText.trim()}>
                  문의 보내기
                </Button>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("faq")}
            className={`flex-1 rounded-full py-2 text-[12.5px] font-semibold ${
              tab === "faq" ? "bg-[var(--wd-ink)] text-white" : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
            }`}
          >
            자주 묻는 질문
          </button>
          <button
            type="button"
            onClick={() => setTab("notice")}
            className={`flex-1 rounded-full py-2 text-[12.5px] font-semibold ${
              tab === "notice" ? "bg-[var(--wd-ink)] text-white" : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
            }`}
          >
            공지사항
          </button>
        </div>

        {tab === "faq" && (
          <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-4">
            {FAQS.map((f) => {
              const open = openId === f.id;
              return (
                <div key={f.id} className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : f.id)}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="text-[13px] font-medium text-[var(--wd-ink)]">{f.question}</span>
                    <CaretDown
                      size={14}
                      className={`shrink-0 text-[var(--wd-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && <p className="mt-2.5 text-[12.5px] leading-[19px] text-[var(--wd-muted)]">{f.answer}</p>}
                </div>
              );
            })}
          </div>
        )}

        {tab === "notice" && (
          <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-4">
            {NOTICES.map((n) => {
              const open = openId === n.id;
              return (
                <div key={n.id} className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : n.id)}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[var(--wd-ink)]">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--wd-muted)]">{n.date}</p>
                    </div>
                    <CaretDown
                      size={14}
                      className={`shrink-0 text-[var(--wd-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && <p className="mt-2.5 text-[12.5px] leading-[19px] text-[var(--wd-muted)]">{n.body}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
