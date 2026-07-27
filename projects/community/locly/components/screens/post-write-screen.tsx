"use client";

import { useState } from "react";
import { ArrowLeft, Image as ImageIcon, X } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { BOARDS } from "@/projects/community/locly/lib/mock-data";
import { PrimaryButton } from "@/projects/community/locly/components/layout/ui";

export function PostWriteScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [board, setBoard] = useState(BOARDS[0].key);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [attached, setAttached] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const titleError = submitted && title.trim().length === 0;
  const contentError = submitted && content.trim().length < 5;

  function addTag() {
    const value = tagInput.trim().replace(/^#/, "");
    if (value && !tags.includes(value) && tags.length < 5) {
      setTags([...tags, value]);
    }
    setTagInput("");
  }

  function handleSubmit() {
    setSubmitted(true);
    if (title.trim() && content.trim().length >= 5) {
      onNavigate("community", board);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 pb-24 pt-8 lg:px-0">
      <button
        onClick={() => onNavigate("community")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
      >
        <ArrowLeft size={16} />
        취소하고 돌아가기
      </button>

      <h1 className="mt-5 text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">글쓰기</h1>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <label className="text-[13px] font-semibold text-[var(--locly-ink)]">게시판</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BOARDS.map((b) => (
              <button
                key={b.key}
                onClick={() => setBoard(b.key)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  board === b.key
                    ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]"
                    : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="post-title" className="text-[13px] font-semibold text-[var(--locly-ink)]">
            제목
          </label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className={`mt-2 w-full rounded-lg border bg-[var(--locly-surface-elevated)] px-4 py-3 text-[14px] outline-none placeholder:text-[var(--locly-muted)] ${
              titleError ? "border-[var(--locly-danger)]" : "border-[var(--locly-border)] focus:border-[var(--locly-accent)]"
            }`}
          />
          {titleError && <p className="mt-1.5 text-[12px] text-[var(--locly-danger)]">제목을 입력해주세요.</p>}
        </div>

        <div>
          <label htmlFor="post-content" className="text-[13px] font-semibold text-[var(--locly-ink)]">
            내용
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="이웃과 나누고 싶은 이야기를 자유롭게 적어주세요"
            className={`mt-2 w-full resize-none rounded-lg border bg-[var(--locly-surface-elevated)] px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[var(--locly-muted)] ${
              contentError ? "border-[var(--locly-danger)]" : "border-[var(--locly-border)] focus:border-[var(--locly-accent)]"
            }`}
          />
          {contentError ? (
            <p className="mt-1.5 text-[12px] text-[var(--locly-danger)]">내용을 5자 이상 입력해주세요.</p>
          ) : (
            <p className="mt-1.5 text-[12px] text-[var(--locly-muted)]">{content.length}자 작성됨</p>
          )}
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[var(--locly-ink)]">이미지 첨부</label>
          {attached ? (
            <div className="mt-2 flex w-fit items-center gap-2 rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-3 py-2">
              <ImageIcon size={16} className="text-[var(--locly-accent)]" />
              <span className="text-[13px] text-[var(--locly-ink)]">photo-01.jpg</span>
              <button onClick={() => setAttached(false)} className="text-[var(--locly-muted)] hover:text-[var(--locly-danger)]">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAttached(true)}
              className="mt-2 flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--locly-border)] text-[var(--locly-muted)] transition-colors hover:border-[var(--locly-accent)] hover:text-[var(--locly-accent)]"
            >
              <ImageIcon size={20} />
              <span className="text-[11.5px]">사진 추가</span>
            </button>
          )}
        </div>

        <div>
          <label htmlFor="post-tags" className="text-[13px] font-semibold text-[var(--locly-ink)]">
            해시태그
          </label>
          <input
            id="post-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="태그 입력 후 Enter (최대 5개)"
            className="mt-2 w-full rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-4 py-3 text-[14px] outline-none placeholder:text-[var(--locly-muted)] focus:border-[var(--locly-accent)]"
          />
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--locly-accent-soft)] px-3 py-1 text-[12.5px] font-medium text-[var(--locly-accent)]"
                >
                  #{tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--locly-border)] pt-6">
          <PrimaryButton onClick={handleSubmit}>게시하기</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
