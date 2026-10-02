"use client";

import { useState } from "react";
import { PencilSimple, Star, Trash } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { MY_REVIEWS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { MyReview } from "@/projects/community/wedit/lib/types";
import { EmptyState, RatingRow, Tag } from "@/projects/community/wedit/components/ui";

export function MyReviewsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [reviews, setReviews] = useState<MyReview[]>(MY_REVIEWS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const remove = (id: string) => setReviews((prev) => prev.filter((r) => r.id !== id));
  const startEdit = (r: MyReview) => {
    setEditingId(r.id);
    setDraft(r.content);
  };
  const saveEdit = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, content: draft } : r)));
    setEditingId(null);
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="내 리뷰 관리"
        subtitle={`총 ${reviews.length}건`}
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
        subtitleClassName="text-[11px] text-[var(--wd-muted)]"
      />

      {reviews.length === 0 ? (
        <EmptyState icon={<Star size={24} weight="duotone" />} title="작성한 리뷰가 없어요" body="인증이 승인되면 리뷰를 작성할 수 있어요." />
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-5">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-2.5 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">{r.vendorName}</p>
                  <Tag>{r.status === "draft" ? "임시 저장" : "게시됨"}</Tag>
                </div>
                {r.status === "published" && <RatingRow value={r.ratingAvg} size={12} />}
              </div>

              {editingId === r.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    className="resize-none rounded-xl border border-[var(--wd-border)] p-3 text-[13px] leading-[19px] text-[var(--wd-ink)] outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-full px-3 py-1.5 text-[11.5px] font-medium text-[var(--wd-muted)]"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(r.id)}
                      className="rounded-full bg-[var(--wd-accent)] px-3.5 py-1.5 text-[11.5px] font-semibold text-white"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] leading-[19px] text-[var(--wd-body)]">
                  {r.content || "작성 중인 리뷰입니다. 이어서 작성해보세요."}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10.5px] text-[var(--wd-muted)]">{r.createdAt}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="flex items-center gap-1 text-[11.5px] text-[var(--wd-body)]"
                  >
                    <PencilSimple size={12} />
                    {r.status === "draft" ? "이어쓰기" : "수정"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-1 text-[11.5px] text-[var(--wd-status-rejected-fg)]"
                  >
                    <Trash size={12} />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
