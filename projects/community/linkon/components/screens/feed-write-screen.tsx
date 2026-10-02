"use client";

import { useState } from "react";
import { ArrowLeft, FileArrowUp, FilePdf, Plus, X } from "@phosphor-icons/react";
import { MY_COMPANY, CURRENT_USER } from "@/projects/community/linkon/lib/mock-data";
import type { FeedCategory, FeedPost } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Chip,
  BrandMark,
  Field,
  PrimaryButton,
  SecondaryButton,
  VerifiedBadge,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

const CATEGORIES: FeedCategory[] = [
  "협업 모집",
  "투자 이야기",
  "창업 후기",
  "정부지원사업",
  "행사 후기",
];

const SAMPLE_FILE = { name: "협업제안_개요_0727.pdf", size: "1.2MB" };

export function FeedWriteScreen({
  onNavigate,
  onPublish,
}: {
  onNavigate: NavigateFn;
  onPublish: (post: FeedPost) => void;
}) {
  const [category, setCategory] = useState<FeedCategory>("협업 모집");
  const [content, setContent] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);
  const [recruiting, setRecruiting] = useState(true);
  const [role, setRole] = useState("");
  const [positions, setPositions] = useState("1");
  const [deadline, setDeadline] = useState("2026-09-05");
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const value = tagDraft.trim().replace(/^#/, "");
    if (!value || tags.includes(value) || tags.length >= 5) return;
    setTags([...tags, value]);
    setTagDraft("");
  };

  const submit = () => {
    if (content.trim().length < 10) {
      setError("본문을 10자 이상 입력해 주세요.");
      return;
    }
    if (recruiting && !role.trim()) {
      setError("모집 대상을 입력해 주세요.");
      return;
    }
    onPublish({
      id: `local-${Date.now()}`,
      companyId: MY_COMPANY.id,
      author: CURRENT_USER.name,
      category,
      content: content.trim(),
      tags,
      attachment: attachment ?? undefined,
      likes: 0,
      saves: 0,
      createdAt: "2026-07-27T12:00:00",
      recruiting: recruiting
        ? { role: role.trim(), deadline, positions: Number(positions) || 1 }
        : undefined,
      comments: [],
    });
    onNavigate("feed");
  };

  return (
    <div className="mx-auto max-w-[860px] px-6 pb-24 pt-8 lg:px-10">
      <button
        onClick={() => onNavigate("feed")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-ink)]"
      >
        <ArrowLeft size={15} weight="bold" />
        네트워킹 피드
      </button>

      <h1 className="mt-6 text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">피드 작성</h1>
      <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
        작성한 글은 인증을 마친 회원 기업에게만 공개됩니다.
      </p>

      <div className="mt-7 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
        <div className="flex items-center gap-3 border-b border-[var(--lk-border)] pb-5">
          <BrandMark logo={MY_COMPANY.logo} size={44} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-[var(--lk-ink)]">{MY_COMPANY.name}</p>
              <VerifiedBadge />
            </div>
            <p className="mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
              {CURRENT_USER.name} {CURRENT_USER.role}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-[var(--lk-ink)]">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <Chip
                  key={item}
                  active={category === item}
                  onClick={() => {
                    setCategory(item);
                    setRecruiting(item === "협업 모집");
                  }}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>

          <Field
            label="본문"
            required
            helper={`${content.length}자 입력 (최소 10자)`}
            error={error && content.trim().length < 10 ? error : undefined}
          >
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError(null);
              }}
              rows={8}
              placeholder="어떤 협업을 찾고 있는지, 어떤 경험을 공유하려는지 구체적으로 적어주세요."
              className={`${inputClass} resize-y leading-[1.8]`}
            />
          </Field>

          <div>
            <p className="mb-3 text-[13px] font-semibold text-[var(--lk-ink)]">이미지·파일 첨부</p>
            {attachment ? (
              <div className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-bg)] px-4 py-3">
                <FilePdf size={18} className="shrink-0 text-[var(--lk-accent)]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                    {attachment.name}
                  </span>
                  <span className="lk-num block text-[12px] text-[var(--lk-muted)]">
                    {attachment.size}
                  </span>
                </span>
                <button
                  onClick={() => setAttachment(null)}
                  aria-label="첨부 삭제"
                  className="text-[var(--lk-muted)] hover:text-[var(--lk-danger)]"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAttachment(SAMPLE_FILE)}
                className="flex h-[112px] w-full max-w-[420px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--lk-border)] bg-[var(--lk-bg)] text-[var(--lk-muted)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
              >
                <FileArrowUp size={22} />
                <span className="text-[13px] font-semibold">파일 선택 (이미지·PDF, 최대 10MB)</span>
              </button>
            )}
          </div>

          <div>
            <p className="mb-3 text-[13px] font-semibold text-[var(--lk-ink)]">태그 (최대 5개)</p>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lk-accent-soft)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--lk-accent)]"
                >
                  #{tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))} aria-label={`${tag} 삭제`}>
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              <span className="flex items-center gap-2">
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="태그 입력 후 Enter"
                  aria-label="태그 입력"
                  className="w-[180px] rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3 py-1.5 text-[13px] text-[var(--lk-ink)] outline-none"
                />
                <button
                  onClick={addTag}
                  aria-label="태그 추가"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lk-border)] text-[var(--lk-muted)] hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--lk-border)] bg-[var(--lk-bg)] p-5">
            <button
              onClick={() => setRecruiting((v) => !v)}
              role="switch"
              aria-checked={recruiting}
              className="flex w-full items-center justify-between gap-4"
            >
              <span className="text-left">
                <span className="block text-[14px] font-bold text-[var(--lk-ink)]">협업 모집 글로 등록</span>
                <span className="mt-1 block text-[12.5px] text-[var(--lk-muted)]">
                  모집 대상과 마감일이 함께 표시되고 관심 분야가 맞는 기업에게 먼저 노출됩니다.
                </span>
              </span>
              <span
                className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
                  recruiting ? "bg-[var(--lk-accent)]" : "bg-[var(--lk-border)]"
                }`}
              >
                <span
                  className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all ${
                    recruiting ? "left-[21px]" : "left-[3px]"
                  }`}
                />
              </span>
            </button>

            {recruiting && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field
                  label="모집 대상"
                  required
                  error={error && !role.trim() ? "모집 대상을 입력해 주세요." : undefined}
                >
                  <input
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setError(null);
                    }}
                    placeholder="예: 사출 금형 보유 제조사"
                    className={inputClass}
                  />
                </Field>
                <Field label="모집 기업 수">
                  <input
                    value={positions}
                    onChange={(e) => setPositions(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    className={`${inputClass} lk-num`}
                  />
                </Field>
                <Field label="마감일">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`${inputClass} lk-num`}
                  />
                </Field>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-2.5 border-t border-[var(--lk-border)] pt-6">
          <SecondaryButton onClick={() => onNavigate("feed")}>취소</SecondaryButton>
          <PrimaryButton onClick={submit}>등록하기</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
