"use client";

import { NotePencil } from "@phosphor-icons/react";

const SUGGESTED_TAGS = [
  "정기 정비 이력 양호",
  "장시간 유휴 보관",
  "타이어 교체 필요",
  "서류 미비 확인 필요",
  "매수 희망자 즉시 인수 가능",
];

export function NotesStep({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (value: string) => void;
}) {
  function appendTag(tag: string) {
    if (notes.includes(tag)) return;
    onChange(notes.length > 0 ? `${notes}\n| ${tag}` : `| ${tag}`);
  }

  return (
    <div className="px-5 pb-4">
      <div className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9999px] bg-[var(--bbi-accent-soft)]">
            <NotePencil size={18} weight="bold" className="text-[var(--bbi-accent)]" />
          </div>
          <p className="text-[15px] font-semibold leading-[22px] text-[var(--bbi-ink)]">
            체크리스트에 담기지 않은 특이사항을 적어주세요
          </p>
        </div>

        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 서류상 이력과 실측 가동시간 차이, 구매 희망자 요청사항 등"
          rows={7}
          className="mt-3.5 w-full resize-none rounded-[8px] border border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-3.5 py-3 text-[14px] font-normal leading-[20px] text-[var(--bbi-ink)] outline-none placeholder:text-[var(--bbi-muted-soft)] focus:border-[var(--bbi-accent)]"
        />
        <p className="mt-1.5 text-right text-[11px] font-semibold text-[var(--bbi-muted-soft)]">
          {notes.length}자 작성됨
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 px-0.5 text-[13px] font-bold leading-[18px] text-[var(--bbi-muted)]">자주 쓰는 문구</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => appendTag(tag)}
              className="bbi-btn-press rounded-[9999px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bbi-muted)]"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
