"use client";

import { useState } from "react";
import { ArrowLeft, Image as ImageIcon, X } from "@phosphor-icons/react";
import { BOARDS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  CONTAINER,
  Display,
  PrimaryButton,
  SecondaryButton,
} from "@/projects/community/locly/components/site/ui";

const FIELD =
  "w-full rounded-[8px] border bg-[var(--lc-canvas)] px-3.5 text-[15px] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)]";

export function PostWriteScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [board, setBoard] = useState(BOARDS[0].key);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [attached, setAttached] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const titleError = submitted && !title.trim();
  const contentError = submitted && content.trim().length < 5;

  function addTag() {
    const value = tagInput.trim().replace(/^#/, "");
    if (value && !tags.includes(value) && tags.length < 5) setTags([...tags, value]);
    setTagInput("");
  }

  function submit() {
    setSubmitted(true);
    if (title.trim() && content.trim().length >= 5) onNavigate("community", board);
  }

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[720px]">
        <button
          onClick={() => onNavigate("community")}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--lc-muted)]"
        >
          <ArrowLeft size={15} />
          커뮤니티
        </button>

        <Display as="h1" size="md" className="mt-6">
          글쓰기
        </Display>
        <p className="mt-3 text-[15px] leading-[1.55] text-[var(--lc-body)]">
          이웃과 나누고 싶은 이야기를 자유롭게 적어주세요.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          <fieldset>
            <legend className="text-[14px] font-medium text-[var(--lc-ink)]">게시판</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {BOARDS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBoard(b.key)}
                  className={`rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    board === b.key
                      ? "bg-[var(--lc-ink)] text-[var(--lc-on-dark)]"
                      : "border border-[var(--lc-hairline)] text-[var(--lc-muted)]"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="post-title" className="text-[14px] font-medium text-[var(--lc-ink)]">
              제목
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className={`${FIELD} mt-3 h-11 ${
                titleError ? "border-[var(--lc-error)]" : "border-[var(--lc-hairline)] focus:border-[var(--lc-primary)]"
              }`}
            />
            {titleError && <p className="mt-2 text-[13px] text-[var(--lc-error)]">제목을 입력해주세요.</p>}
          </div>

          <div>
            <label htmlFor="post-content" className="text-[14px] font-medium text-[var(--lc-ink)]">
              내용
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="이웃과 나누고 싶은 이야기를 적어주세요"
              className={`${FIELD} mt-3 resize-none py-3 leading-[1.65] ${
                contentError
                  ? "border-[var(--lc-error)]"
                  : "border-[var(--lc-hairline)] focus:border-[var(--lc-primary)]"
              }`}
            />
            {contentError ? (
              <p className="mt-2 text-[13px] text-[var(--lc-error)]">내용을 5자 이상 입력해주세요.</p>
            ) : (
              <p className="mt-2 text-[13px] text-[var(--lc-muted-soft)]">{content.length}자 작성됨</p>
            )}
          </div>

          <div>
            <p className="text-[14px] font-medium text-[var(--lc-ink)]">이미지 첨부</p>
            {attached ? (
              <div className="mt-3 flex w-fit items-center gap-2 rounded-[8px] border border-[var(--lc-hairline)] px-3 py-2">
                <ImageIcon size={16} className="text-[var(--lc-primary)]" />
                <span className="text-[14px] text-[var(--lc-ink)]">photo-01.jpg</span>
                <button onClick={() => setAttached(false)} aria-label="첨부 삭제" className="text-[var(--lc-muted-soft)]">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAttached(true)}
                className="mt-3 flex h-[104px] w-[104px] flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-[var(--lc-hairline)] text-[var(--lc-muted)] transition-colors active:border-[var(--lc-primary)]"
              >
                <ImageIcon size={20} />
                <span className="text-[12px]">사진 추가</span>
              </button>
            )}
          </div>

          <div>
            <label htmlFor="post-tags" className="text-[14px] font-medium text-[var(--lc-ink)]">
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
              className={`${FIELD} mt-3 h-11 border-[var(--lc-hairline)] focus:border-[var(--lc-primary)]`}
            />
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lc-surface-card)] px-3 py-1 text-[13px] text-[var(--lc-body)]"
                  >
                    #{tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))} aria-label={`${tag} 삭제`}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--lc-hairline)] pt-8">
            <SecondaryButton onClick={() => onNavigate("community")}>취소</SecondaryButton>
            <PrimaryButton onClick={submit}>게시하기</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
