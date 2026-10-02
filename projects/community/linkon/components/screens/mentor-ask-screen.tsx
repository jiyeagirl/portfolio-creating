"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Paperclip, X } from "@phosphor-icons/react";
import { MENTORS, MY_COMPANY } from "@/projects/community/linkon/lib/mock-data";
import type { QnaCategory, Question } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Chip,
  InitialMark,
  Field,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

const CATEGORIES: QnaCategory[] = ["투자", "법률", "특허", "마케팅", "세무", "정부지원사업"];

export function MentorAskScreen({
  onNavigate,
  onPublish,
}: {
  onNavigate: NavigateFn;
  onPublish: (question: Question) => void;
}) {
  const [category, setCategory] = useState<QnaCategory>("투자");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const assignedMentors = MENTORS.filter((m) => m.fields.includes(category));

  const submit = () => {
    const next: typeof errors = {};
    if (title.trim().length < 6) next.title = "제목을 6자 이상 입력해 주세요.";
    if (content.trim().length < 20) next.content = "상황을 알 수 있도록 20자 이상 작성해 주세요.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onPublish({
      id: `local-q-${Date.now()}`,
      category,
      title: title.trim(),
      content: content.trim(),
      askerCompanyId: MY_COMPANY.id,
      askerLabel: anonymous ? "비공개 기업" : MY_COMPANY.name,
      createdAt: "2026-07-27T12:00:00",
      views: 0,
      likes: 0,
      attachments: files,
      answers: [],
    });
    onNavigate("mentor");
  };

  return (
    <div className="mx-auto max-w-[860px] px-6 pb-24 pt-8 lg:px-10">
      <button
        onClick={() => onNavigate("mentor")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-ink)]"
      >
        <ArrowLeft size={15} weight="bold" />
        멘토 Q&amp;A
      </button>

      <h1 className="mt-6 text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">질문 등록</h1>
      <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
        선택한 분야의 멘토에게 바로 전달되며, 답변은 알림으로 안내됩니다.
      </p>

      <div className="mt-7 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-[var(--lk-ink)]">
              카테고리 <span className="text-[var(--lk-danger)]">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
                  {item}
                </Chip>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[var(--lk-bg)] px-4 py-3">
              <span className="text-[12.5px] font-semibold text-[var(--lk-muted)]">담당 멘토</span>
              {assignedMentors.map((mentor) => (
                <span key={mentor.id} className="flex items-center gap-2">
                  <InitialMark mark={mentor.mark} tone={mentor.tone} size={28} />
                  <span className="text-[13px] font-semibold text-[var(--lk-ink)]">
                    {mentor.name}
                    <span className="ml-1 font-medium text-[var(--lk-muted)]">{mentor.role}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <Field label="제목" required error={errors.title}>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="질문을 한 문장으로 요약해 주세요"
              className={inputClass}
            />
          </Field>

          <Field
            label="내용"
            required
            error={errors.content}
            helper="상황, 시도한 방법, 확인하고 싶은 부분을 함께 적으면 답변이 정확해집니다."
          >
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              rows={9}
              placeholder="예: 시드 라운드를 마치고 프리A를 준비 중입니다. 기존 투자자의 후속 참여 비중을 어떻게 잡아야 할지 고민입니다."
              className={`${inputClass} resize-y leading-[1.8]`}
            />
          </Field>

          <div>
            <p className="mb-3 text-[13px] font-semibold text-[var(--lk-ink)]">파일 첨부</p>
            <div className="flex flex-wrap items-center gap-2">
              {files.map((file) => (
                <span
                  key={file.name}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--lk-border)] px-3 py-2 text-[12.5px] font-medium text-[var(--lk-ink)]"
                >
                  <FileText size={14} className="text-[var(--lk-accent)]" />
                  {file.name}
                  <span className="lk-num text-[var(--lk-muted)]">{file.size}</span>
                  <button
                    onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
                    aria-label={`${file.name} 삭제`}
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              <button
                onClick={() =>
                  setFiles((prev) =>
                    prev.length >= 3
                      ? prev
                      : [...prev, { name: `첨부자료_${prev.length + 1}.pdf`, size: "820KB" }],
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--lk-border)] px-3.5 py-2 text-[13px] font-semibold text-[var(--lk-muted)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
              >
                <Paperclip size={15} />
                파일 선택 (최대 3개)
              </button>
            </div>
          </div>

          <button
            onClick={() => setAnonymous((v) => !v)}
            role="switch"
            aria-checked={anonymous}
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-bg)] px-5 py-4"
          >
            <span className="text-left">
              <span className="block text-[14px] font-bold text-[var(--lk-ink)]">기업명 비공개</span>
              <span className="mt-1 block text-[12.5px] text-[var(--lk-muted)]">
                다른 회원사에게는 기업명이 가려지고, 멘토와 운영기관에게만 공개됩니다.
              </span>
            </span>
            <span
              className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
                anonymous ? "bg-[var(--lk-accent)]" : "bg-[var(--lk-border)]"
              }`}
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all ${
                  anonymous ? "left-[21px]" : "left-[3px]"
                }`}
              />
            </span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-end gap-2.5 border-t border-[var(--lk-border)] pt-6">
          <SecondaryButton onClick={() => onNavigate("mentor")}>취소</SecondaryButton>
          <PrimaryButton onClick={submit}>질문 등록</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
