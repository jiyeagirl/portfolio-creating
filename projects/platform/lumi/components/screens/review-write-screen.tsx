"use client";

import { useState } from "react";
import { CheckCircle, Star, Warning } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import { CONSULT_TAGS, PASS_BY_TIER, expertById } from "@/projects/platform/lumi/lib/mock-data";
import {
  AppBar,
  ExpertAvatar,
  Field,
  PrimaryButton,
  inputClass,
} from "@/projects/platform/lumi/components/ui";

const RATING_COPY = ["", "아쉬웠어요", "그저 그랬어요", "괜찮았어요", "좋았어요", "정말 좋았어요"];

export function ReviewWriteScreen({
  expertId,
  onNavigate,
  onSubmit,
}: {
  expertId: string;
  onNavigate: NavigateFn;
  onSubmit: (expertId: string) => void;
}) {
  const expert = expertById(expertId);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const submit = () => {
    if (rating === 0) {
      setError("별점을 선택해 주세요.");
      return;
    }
    if (body.trim().length < 10) {
      setError("후기는 10자 이상 남겨 주세요.");
      return;
    }
    setError("");
    onSubmit(expert.id);
    setDone(true);
  };

  if (done) {
    return (
      <div className="lm-enter flex min-h-full flex-col">
        <AppBar title="후기 등록 완료" onBack={() => onNavigate("history")} />
        <div className="flex flex-1 flex-col items-center px-6 pt-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]">
            <CheckCircle size={32} weight="fill" />
          </span>
          <h2 className="mt-4 text-[20px] font-bold tracking-tight">후기가 등록되었습니다</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--lm-muted)]">
            작성자 이름은 {"김*민"}처럼 가려져 노출됩니다.
            <br />
            적립 포인트 500P가 지급되었습니다.
          </p>
          <div className="mt-6 w-full space-y-2">
            <PrimaryButton onClick={() => onNavigate("history")}>상담 내역으로</PrimaryButton>
            <button
              type="button"
              onClick={() => onNavigate("expertDetail", expert.id)}
              className="w-full rounded-xl border border-[var(--lm-border)] py-3.5 text-[15px] font-bold text-[var(--lm-ink)]"
            >
              {expert.name} 상담사 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lm-enter flex min-h-full flex-col">
      <AppBar title="후기 작성" onBack={() => onNavigate("history")} />

      <section className="px-5 pt-5">
        <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4">
          <ExpertAvatar expert={expert} size={48} />
          <div>
            <p className="text-[15px] font-bold">{expert.name}</p>
            <p className="lm-num mt-0.5 text-[12.5px] text-[var(--lm-muted)]">
              {PASS_BY_TIER[expert.tiers[0]].name} {PASS_BY_TIER[expert.tiers[0]].minutes}분 상담
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7 px-5 text-center">
        <h2 className="text-[16px] font-bold">상담은 어떠셨나요</h2>
        <div className="mt-3.5 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRating(value);
                setError("");
              }}
              aria-label={`${value}점`}
              className="p-1"
            >
              <Star
                size={34}
                weight={value <= rating ? "fill" : "regular"}
                className={value <= rating ? "text-[var(--lm-live)]" : "text-[var(--lm-border)]"}
              />
            </button>
          ))}
        </div>
        <p className="mt-2 h-5 text-[13px] font-semibold text-[var(--lm-muted)]">
          {RATING_COPY[rating]}
        </p>
      </section>

      <section className="mt-5 px-5">
        <h2 className="text-[15px] font-bold">어떤 점이 좋았나요</h2>
        <p className="mt-1 text-[12.5px] text-[var(--lm-muted)]">여러 개를 고를 수 있어요</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CONSULT_TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                    : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <Field label="상담 내용" helper="상담사가 어떤 말을 해 주었는지 적으면 다른 분께 도움이 됩니다.">
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setError("");
            }}
            rows={6}
            maxLength={500}
            placeholder="어떤 고민으로 상담했고, 어떤 답을 들었는지 적어 주세요."
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </Field>
        <p className="lm-num mt-1.5 text-right text-[11.5px] text-[var(--lm-muted)]">
          {body.length} / 500
        </p>
      </section>

      <div className="h-6" />

      <div className="sticky bottom-0 mt-auto border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 pb-7 pt-3">
        {error && (
          <p className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--lm-danger)]">
            <Warning size={13} weight="fill" />
            {error}
          </p>
        )}
        <PrimaryButton onClick={submit}>후기 등록하기</PrimaryButton>
      </div>
    </div>
  );
}
