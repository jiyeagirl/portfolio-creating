"use client";

import { useState } from "react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { CATEGORY_LABEL } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { CommunityCategory } from "@/projects/community/wedit/lib/types";
import { Button } from "@/projects/community/wedit/components/ui";

const CATEGORIES: CommunityCategory[] = ["studio", "dress", "makeup", "prep"];

export function PostWriteScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [category, setCategory] = useState<CommunityCategory>("studio");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)]">
      <ScreenHeader
        title="질문 작성"
        onBack={() => onNavigate("community")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
        right={
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onNavigate("community")}
            className="text-[13.5px] font-semibold text-[var(--wd-accent)] disabled:text-[var(--wd-muted)]"
          >
            등록
          </button>
        }
      />

      <div className="flex flex-col gap-5 px-5 pt-5">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-medium text-[var(--wd-muted)]">카테고리</span>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                  category === c
                    ? "bg-[var(--wd-ink)] text-white"
                    : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
                }`}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="h-12 rounded-xl border border-[var(--wd-border)] bg-white px-4 text-[14.5px] font-medium text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="궁금한 내용을 자세히 적어주세요. 등록 후 AI가 먼저 답변을 드려요."
          rows={10}
          className="resize-none rounded-xl border border-[var(--wd-border)] bg-white p-4 text-[13.5px] leading-[20px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
        />

        <Button fullWidth size="lg" disabled={!canSubmit} onClick={() => onNavigate("community")}>
          질문 등록하기
        </Button>
      </div>
    </div>
  );
}
