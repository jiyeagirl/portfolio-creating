"use client";

import { useState } from "react";
import { CaretDown, PushPin } from "@phosphor-icons/react";
import { faqs, notices } from "@/projects/commerce/verve/lib/mock-data";
import type { FaqCategory } from "@/projects/commerce/verve/lib/types";
import { Button, Divider, Field, SectionHeading, Select, TextArea, TextInput } from "@/projects/commerce/verve/components/ui";

type Tab = "faq" | "inquiry" | "shipping" | "returns" | "notice";

const TABS: { id: Tab; label: string }[] = [
  { id: "faq", label: "자주 묻는 질문" },
  { id: "inquiry", label: "1:1 문의" },
  { id: "shipping", label: "배송 안내" },
  { id: "returns", label: "교환/반품 안내" },
  { id: "notice", label: "공지사항" },
];

const FAQ_CATEGORIES: FaqCategory[] = ["주문/결제", "배송", "교환/반품", "사이즈/AI 추천", "회원/포인트"];

export function SupportScreen() {
  const [tab, setTab] = useState<Tab>("faq");
  const [faqCategory, setFaqCategory] = useState<FaqCategory | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  const filteredFaqs = faqCategory ? faqs.filter((f) => f.category === faqCategory) : faqs;

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading title="고객센터" tone="light" />

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[var(--v-hairline-on-light)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] transition-colors ${
                tab === t.id ? "border-[var(--v-primary)] text-[var(--v-body-on-light)]" : "border-transparent text-[var(--v-muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "faq" && (
            <div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFaqCategory(null)}
                  className={`px-3 py-1.5 text-[12px] font-medium ${!faqCategory ? "bg-[var(--v-body-on-light)] text-white" : "bg-[var(--v-surface-strong-light)] text-[var(--v-body-on-light)]"}`}
                >
                  전체
                </button>
                {FAQ_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFaqCategory(faqCategory === c ? null : c)}
                    className={`px-3 py-1.5 text-[12px] font-medium ${faqCategory === c ? "bg-[var(--v-body-on-light)] text-white" : "bg-[var(--v-surface-strong-light)] text-[var(--v-body-on-light)]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-6 divide-y divide-[var(--v-hairline-on-light)]">
                {filteredFaqs.map((f) => (
                  <div key={f.id} className="py-4">
                    <button type="button" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} className="flex w-full items-start justify-between gap-4 text-left">
                      <div>
                        <p className="text-[11px] text-[var(--v-primary)]">{f.category}</p>
                        <p className="mt-1 text-[14px] font-medium text-[var(--v-body-on-light)]">{f.question}</p>
                      </div>
                      <CaretDown size={14} className={`mt-1 shrink-0 text-[var(--v-muted)] transition-transform ${openFaq === f.id ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === f.id && <p className="mt-3 text-[13px] leading-relaxed text-[var(--v-muted)]">{f.answer}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "inquiry" && (
            <div className="max-w-[480px] space-y-5">
              <Field label="문의 유형" tone="light">
                <Select tone="light" defaultValue="주문/결제">
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="제목" tone="light">
                <TextInput tone="light" placeholder="문의 제목을 입력해주세요" />
              </Field>
              <Field label="내용" tone="light">
                <TextArea tone="light" placeholder="문의하실 내용을 자세히 적어주세요" />
              </Field>
              <Field label="답변받을 이메일" tone="light">
                <TextInput tone="light" type="email" placeholder="you@example.com" />
              </Field>
              <Button
                tone="light"
                onClick={() => {
                  setInquirySent(true);
                  window.setTimeout(() => setInquirySent(false), 2200);
                }}
              >
                {inquirySent ? "문의가 접수됐어요" : "문의 남기기"}
              </Button>
            </div>
          )}

          {tab === "shipping" && (
            <div className="max-w-[560px] space-y-5 text-[13px] leading-relaxed text-[var(--v-muted)]">
              <p>결제 완료 후 평균 1-2일 내 출고되며, 출고 후 1-2일 내 도착합니다.</p>
              <p>제주 및 도서산간 지역은 1-2일이 추가로 소요될 수 있으며, 별도 배송비가 부과될 수 있습니다.</p>
              <p>배송 조회는 마이페이지 &gt; 주문내역에서 확인할 수 있습니다.</p>
              <Divider tone="light" />
              <div className="flex justify-between">
                <span>기본 배송비</span>
                <span className="text-[var(--v-body-on-light)]">3,500원</span>
              </div>
              <div className="flex justify-between">
                <span>5만원 이상 구매 시</span>
                <span className="text-[var(--v-body-on-light)]">무료배송</span>
              </div>
            </div>
          )}

          {tab === "returns" && (
            <div className="max-w-[560px] space-y-5 text-[13px] leading-relaxed text-[var(--v-muted)]">
              <p>상품 수령 후 7일 이내, 미착용/미세탁 상태에 한해 교환 및 반품이 가능합니다.</p>
              <p>사이즈 교환은 무료로 진행되며, 단순 변심의 경우 왕복 배송비가 발생할 수 있습니다.</p>
              <p>세탁을 진행한 상품, 택을 제거한 상품은 교환/반품이 제한될 수 있습니다.</p>
              <p>마이페이지 &gt; 주문내역에서 교환/반품 신청이 가능합니다.</p>
            </div>
          )}

          {tab === "notice" && (
            <div className="divide-y divide-[var(--v-hairline-on-light)]">
              {notices.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    {n.pinned && <PushPin size={13} weight="fill" className="text-[var(--v-primary)]" />}
                    <span className="text-[14px] text-[var(--v-body-on-light)]">{n.title}</span>
                  </div>
                  <span className="text-[12px] text-[var(--v-muted)]">{n.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
