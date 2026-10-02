"use client";

import { useState } from "react";
import { Camera, Package } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Chip } from "@/projects/community/enclave/components/ui";
import type { ProductCategory } from "@/projects/community/enclave/lib/types";

const CATEGORIES: ProductCategory[] = ["전자기기", "가구/인테리어", "패션/잡화", "취미/악기", "생활가전", "스포츠/레저"];
const CONDITIONS = ["새상품", "거의새것", "사용감있음"] as const;

export function PostCreateScreen({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ProductCategory>("전자기기");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("거의새것");
  const [description, setDescription] = useState("");
  const [lockerAvailable, setLockerAvailable] = useState(true);

  const canSubmit = title.trim().length > 0 && price.length > 0 && description.trim().length > 0;

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-surface)]">
      <ScreenHeader
        title="상품 등록"
        onBack={onBack}
        className="bg-[var(--ec-surface)] border-[var(--ec-border)]"
        backButtonClassName="text-[var(--ec-ink)] hover:bg-[var(--ec-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--ec-ink)]"
      />

      <div className="flex-1 overflow-y-auto ec-scroll px-5 pb-[110px] pt-5">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            className="flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-[var(--ec-border-strong)] text-[var(--ec-muted)]"
          >
            <Camera size={20} />
            <span className="text-[11px]">0 / 10</span>
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">글 제목</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 맥북 에어 M1 13인치 골드"
              className="h-[48px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 text-[14.5px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">카테고리</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">상품 상태</p>
            <div className="flex gap-1.5">
              {CONDITIONS.map((c) => (
                <Chip key={c} label={c} active={condition === c} onClick={() => setCondition(c)} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">가격</p>
            <div className="relative">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                inputMode="numeric"
                className="h-[48px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 pr-10 tabular-nums text-[14.5px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--ec-muted)]">원</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">상세 설명</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품 상태, 구매 시기, 거래 방법 등을 자세히 적어주세요"
              rows={5}
              className="w-full resize-none rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] p-4 text-[14px] leading-[21px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
            />
          </div>

          <button
            type="button"
            onClick={() => setLockerAvailable((v) => !v)}
            className="flex items-center justify-between rounded-[14px] border border-[var(--ec-border)] px-4 py-3.5"
          >
            <div className="flex items-center gap-2.5 text-left">
              <Package size={18} className="shrink-0 text-[var(--ec-accent-ink)]" />
              <div>
                <p className="text-[13.5px] font-medium text-[var(--ec-ink)]">무인택배함 픽업 허용</p>
                <p className="mt-0.5 text-[11.5px] text-[var(--ec-muted)]">구매자가 비대면으로 픽업할 수 있어요</p>
              </div>
            </div>
            <span
              className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors ${
                lockerAvailable ? "bg-[var(--ec-accent)]" : "bg-[var(--ec-surface-sunken)]"
              }`}
            >
              <span
                className="absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all"
                style={{ left: lockerAvailable ? 21 : 3 }}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[var(--ec-border)] bg-[var(--ec-surface)] px-5 pb-[34px] pt-3">
        <Button full size="lg" disabled={!canSubmit} onClick={onSubmit}>
          등록하기
        </Button>
      </div>
    </div>
  );
}
