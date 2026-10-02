"use client";

import { useState } from "react";
import {
  Check,
  ChatCenteredText,
  Megaphone,
  Plus,
  Terminal,
  Ticket,
  X,
} from "@phosphor-icons/react";
import {
  ADMIN_EVENTS,
  ADMIN_INQUIRIES,
  ADMIN_NOTICES,
  SYSTEM_LOGS,
} from "@/projects/platform/veli/lib/mock-data";
import type { AdminEvent, AdminInquiry, AdminNotice } from "@/projects/platform/veli/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Panel,
  Tag,
} from "@/projects/platform/veli/components/admin/admin-ui";

type Section = "notice" | "inquiry" | "event" | "log";
type InquiryRowState = AdminInquiry & { replyText?: string };

const SECTIONS: { key: Section; label: string }[] = [
  { key: "notice", label: "공지사항" },
  { key: "inquiry", label: "고객 문의" },
  { key: "event", label: "이벤트" },
  { key: "log", label: "시스템 로그" },
];

const NOTICE_CATEGORY_TONE: Record<AdminNotice["category"], "accent" | "success" | "warning"> = {
  공지: "accent",
  이벤트: "success",
  점검: "warning",
};

const NOTICE_STATE_TONE: Record<AdminNotice["state"], "success" | "accent" | "neutral"> = {
  게시중: "success",
  예약: "accent",
  종료: "neutral",
};

const INQUIRY_STATUS_TONE: Record<AdminInquiry["status"], "warning" | "success" | "neutral"> = {
  대기: "warning",
  답변완료: "success",
  종료: "neutral",
};

const EVENT_STATE_TONE: Record<AdminEvent["state"], "success" | "accent" | "neutral"> = {
  진행중: "success",
  예정: "accent",
  종료: "neutral",
};

const NOTICE_CATEGORIES: AdminNotice["category"][] = ["공지", "이벤트", "점검"];

export function AdminOperations() {
  const [section, setSection] = useState<Section>("notice");

  const [notices, setNotices] = useState<AdminNotice[]>(ADMIN_NOTICES);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<AdminNotice["category"]>("공지");
  const [formPublishedAt, setFormPublishedAt] = useState("2026-08-10");

  const [inquiries, setInquiries] = useState<InquiryRowState[]>(ADMIN_INQUIRIES);
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  const openInquiry = inquiries.find((i) => i.id === openInquiryId) ?? null;

  const submitNotice = () => {
    if (!formTitle.trim()) return;
    const newNotice: AdminNotice = {
      id: `no-new-${notices.length + 1}`,
      title: formTitle.trim(),
      category: formCategory,
      publishedAt: formPublishedAt,
      state: "예약",
    };
    setNotices((prev) => [newNotice, ...prev]);
    setFormTitle("");
    setJustAdded(true);
  };

  const submitReply = () => {
    if (!openInquiryId || !replyDraft.trim()) return;
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === openInquiryId ? { ...i, status: "답변완료", replyText: replyDraft.trim() } : i,
      ),
    );
    setReplyDraft("");
  };

  return (
    <>
      <PageHead
        title="운영 관리"
        description="공지사항과 이벤트, 고객 문의를 처리하고 시스템 로그를 확인합니다."
      />

      <div className="mb-4">
        <FilterChips<Section> value={section} onChange={setSection} options={SECTIONS} />
      </div>

      {section === "notice" && (
        <>
          <Panel
            title="공지사항"
            note="공지, 이벤트, 점검 안내를 한 곳에서 관리합니다"
            actions={
              <button
                type="button"
                onClick={() => {
                  setShowForm((v) => !v);
                  setJustAdded(false);
                }}
                className="flex items-center gap-1.5 rounded-[8px] border border-[var(--vl-border)] px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--vl-surface)]"
              >
                <Plus size={14} weight="bold" />
                새 공지 작성
              </button>
            }
          >
            {showForm && (
              <div className="border-b border-[var(--vl-border)] px-5 py-5">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-[var(--vl-muted)]">제목</span>
                    <input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="공지 제목을 입력하세요"
                      className="mt-1.5 w-full rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-canvas)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--vl-accent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-[var(--vl-muted)]">카테고리</span>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as AdminNotice["category"])}
                      className="mt-1.5 w-full rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-canvas)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--vl-accent)]"
                    >
                      {NOTICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-[var(--vl-muted)]">게시일</span>
                    <input
                      type="date"
                      value={formPublishedAt}
                      onChange={(e) => setFormPublishedAt(e.target.value)}
                      className="vl-num mt-1.5 w-full rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-canvas)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--vl-accent)]"
                    />
                  </label>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={submitNotice}
                    className="rounded-full bg-[var(--vl-accent)] px-4 py-2 text-[13px] font-bold text-[var(--vl-accent-fg)] active:scale-[0.97]"
                  >
                    등록
                  </button>
                  {justAdded && (
                    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--vl-success)]">
                      <Check size={13} weight="bold" />
                      공지가 등록되었습니다. 게시일에 자동으로 노출됩니다.
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                    <th className="px-5 py-3 font-semibold">제목</th>
                    <th className="px-3 py-3 font-semibold">카테고리</th>
                    <th className="px-3 py-3 font-semibold">게시일</th>
                    <th className="px-5 py-3 font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--vl-border)]">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="text-[13px]">
                      <td className="px-5 py-3.5 font-semibold">{notice.title}</td>
                      <td className="px-3 py-3.5">
                        <Tag tone={NOTICE_CATEGORY_TONE[notice.category]}>{notice.category}</Tag>
                      </td>
                      <td className="vl-num px-3 py-3.5 text-[var(--vl-muted)]">{notice.publishedAt}</td>
                      <td className="px-5 py-3.5">
                        <Tag tone={NOTICE_STATE_TONE[notice.state]}>{notice.state}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}

      {section === "inquiry" && (
        <Panel title="고객 문의" note="행을 누르면 문의 내용을 확인하고 답변을 등록할 수 있습니다">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                  <th className="px-5 py-3 font-semibold">회원</th>
                  <th className="px-3 py-3 font-semibold">제목</th>
                  <th className="px-3 py-3 font-semibold">카테고리</th>
                  <th className="px-3 py-3 font-semibold">상태</th>
                  <th className="px-5 py-3 font-semibold">접수일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vl-border)]">
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => {
                      setOpenInquiryId(inquiry.id);
                      setReplyDraft("");
                    }}
                    className="cursor-pointer text-[13px] hover:bg-[var(--vl-surface)]"
                  >
                    <td className="px-5 py-3.5 font-semibold">{inquiry.member}</td>
                    <td className="px-3 py-3.5 text-[var(--vl-muted)]">{inquiry.subject}</td>
                    <td className="px-3 py-3.5">
                      <Tag tone="neutral">{inquiry.category}</Tag>
                    </td>
                    <td className="px-3 py-3.5">
                      <Tag tone={INQUIRY_STATUS_TONE[inquiry.status]}>{inquiry.status}</Tag>
                    </td>
                    <td className="vl-num px-5 py-3.5 text-[var(--vl-muted)]">{inquiry.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {section === "event" && (
        <div className="grid gap-3 lg:grid-cols-3">
          {ADMIN_EVENTS.map((event) => (
            <article
              key={event.id}
              className="rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
                  <Ticket size={16} weight="fill" />
                </div>
                <Tag tone={EVENT_STATE_TONE[event.state]}>{event.state}</Tag>
              </div>

              <h3 className="mt-4 text-[15px] font-bold tracking-tight">{event.title}</h3>
              <p className="vl-num mt-1.5 text-[12.5px] text-[var(--vl-muted)]">{event.period}</p>

              <dl className="mt-4 space-y-2.5 border-t border-[var(--vl-border)] pt-4 text-[12.5px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--vl-muted)]">혜택</dt>
                  <dd className="text-right font-semibold">{event.benefit}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--vl-muted)]">참여</dt>
                  <dd className="vl-num text-right font-semibold">{event.joined.toLocaleString("ko-KR")}명</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      {section === "log" && (
        <Panel title="시스템 로그" note="배치, 정산, 스팸 차단 등 시스템이 자동으로 남긴 처리 기록입니다">
          <ul className="divide-y divide-[var(--vl-border)]">
            {SYSTEM_LOGS.map((log) => (
              <li key={log.id} className="flex items-start gap-3 px-5 py-4">
                <Terminal size={15} className="mt-0.5 shrink-0 text-[var(--vl-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-relaxed">{log.message}</p>
                  <p className="vl-num mt-1 text-[11.5px] text-[var(--vl-muted)]">{log.occurredAt}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {openInquiry && (
        <Drawer onClose={() => setOpenInquiryId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">{openInquiry.id}</p>
              <h2 className="mt-1 text-[19px] font-bold tracking-tight">문의 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenInquiryId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--vl-surface)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] bg-[var(--vl-surface)] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]">
              <ChatCenteredText size={16} />
            </div>
            <div>
              <p className="text-[14px] font-bold">{openInquiry.member}</p>
              <p className="vl-num text-[12px] text-[var(--vl-muted)]">{openInquiry.createdAt} 접수</p>
            </div>
            <span className="ml-auto">
              <Tag tone={INQUIRY_STATUS_TONE[openInquiry.status]}>{openInquiry.status}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "제목", value: openInquiry.subject },
              { label: "카테고리", value: openInquiry.category },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--vl-muted)]">{item.label}</dt>
                <dd className="text-right font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 flex items-center gap-1.5 text-[13.5px] font-bold">
            <Megaphone size={15} className="text-[var(--vl-muted)]" />
            답변
          </h3>

          {openInquiry.status === "대기" ? (
            <div className="mt-3">
              <textarea
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="회원에게 전달할 답변을 입력하세요"
                rows={4}
                className="w-full rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-canvas)] px-3.5 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[var(--vl-accent)]"
              />
              <button
                type="button"
                onClick={submitReply}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--vl-accent)] py-3 text-[13.5px] font-bold text-[var(--vl-accent-fg)] active:scale-[0.97]"
              >
                <Check size={14} weight="bold" />
                답변 등록
              </button>
            </div>
          ) : openInquiry.replyText ? (
            <p className="mt-3 rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--vl-ink)]">
              {openInquiry.replyText}
            </p>
          ) : (
            <p className="mt-3 rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-[12.5px] font-semibold text-[var(--vl-muted)]">
              {openInquiry.status === "답변완료"
                ? "고객에게 답변이 발송되어 문의가 종결되었습니다."
                : "문의가 종결되어 더 이상 답변을 등록할 수 없습니다."}
            </p>
          )}
        </Drawer>
      )}
    </>
  );
}
