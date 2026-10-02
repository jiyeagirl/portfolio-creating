"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Eye, PencilSimpleLine, Star, ThumbsUp } from "@phosphor-icons/react";
import { MENTORS, QUESTIONS, formatRelativeTime } from "@/projects/community/linkon/lib/mock-data";
import type { QnaCategory, Question } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  Chip,
  InitialMark,
  EmptyState,
  PrimaryButton,
  Reveal,
} from "@/projects/community/linkon/components/layout/ui";

const CATEGORIES: (QnaCategory | "전체")[] = [
  "전체",
  "투자",
  "법률",
  "특허",
  "마케팅",
  "세무",
  "정부지원사업",
];

export function MentorScreen({
  onNavigate,
  drafts,
}: {
  onNavigate: NavigateFn;
  drafts: Question[];
}) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const allQuestions = useMemo(() => [...drafts, ...QUESTIONS], [drafts]);

  const questions = useMemo(() => {
    const filtered =
      category === "전체" ? allQuestions : allQuestions.filter((q) => q.category === category);
    return [...filtered].sort((a, b) =>
      sort === "popular" ? b.views - a.views : b.createdAt.localeCompare(a.createdAt),
    );
  }, [allQuestions, category, sort]);

  const answeredRate = Math.round(
    (allQuestions.filter((q) => q.answers.length > 0).length / allQuestions.length) * 100,
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">멘토 Q&amp;A</h1>
          <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-[var(--lk-muted)]">
            투자, 법률, 특허, 마케팅, 세무, 정부지원사업 분야 멘토가 직접 답변합니다. 최근 30일 답변률
            <span className="lk-num font-semibold text-[var(--lk-ink)]"> {answeredRate}%</span>입니다.
          </p>
        </div>
        <PrimaryButton onClick={() => onNavigate("mentorAsk")}>
          <PencilSimpleLine size={16} weight="fill" />
          질문 등록
        </PrimaryButton>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((item) => (
              <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
                {item}
              </Chip>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="lk-num text-[13px] font-medium text-[var(--lk-muted)]">
              질문 {questions.length}건
            </p>
            <div className="flex items-center gap-2">
              {(["recent", "popular"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    sort === key
                      ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                      : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
                  }`}
                >
                  {key === "recent" ? "최신순" : "조회순"}
                </button>
              ))}
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<PencilSimpleLine size={22} />}
                title="이 분야의 질문이 아직 없습니다"
                description="첫 질문을 남기면 담당 분야 멘토에게 바로 전달됩니다."
                action={
                  <PrimaryButton size="sm" onClick={() => onNavigate("mentorAsk")}>
                    질문 등록
                  </PrimaryButton>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {questions.map((question, index) => {
                const accepted = question.answers.find((a) => a.accepted);
                return (
                  <Reveal key={question.id} delay={Math.min(index, 6) * 0.03}>
                    <li>
                      <button
                        onClick={() => onNavigate("mentorDetail", question.id)}
                        className="group w-full rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6 text-left transition-colors hover:border-[var(--lk-accent)]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="accent">{question.category}</Badge>
                          {accepted ? (
                            <Badge tone="success">
                              <CheckCircle size={12} weight="fill" />
                              답변 채택
                            </Badge>
                          ) : question.answers.length > 0 ? (
                            <Badge tone="neutral">답변 {question.answers.length}</Badge>
                          ) : (
                            <Badge tone="warning">답변 대기</Badge>
                          )}
                        </div>
                        <p className="mt-3 text-[16.5px] font-bold leading-snug text-[var(--lk-ink)] transition-colors group-hover:text-[var(--lk-accent)]">
                          {question.title}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[var(--lk-muted)]">
                          {question.content}
                        </p>
                        <div className="lk-num mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--lk-muted)]">
                          <span className="font-semibold text-[var(--lk-ink)]">{question.askerLabel}</span>
                          <span>{formatRelativeTime(question.createdAt)}</span>
                          <span className="inline-flex items-center gap-1">
                            <Eye size={13} />
                            {question.views}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ThumbsUp size={13} />
                            {question.likes}
                          </span>
                        </div>
                      </button>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>

        <aside>
          <div className="sticky top-[92px] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">활동 멘토</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
              운영기관이 위촉한 분야별 전문가입니다.
            </p>
            <ul className="mt-4 divide-y divide-[var(--lk-border)]">
              {MENTORS.map((mentor) => (
                <li key={mentor.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <InitialMark mark={mentor.mark} tone={mentor.tone} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[var(--lk-ink)]">
                        {mentor.name}
                        <span className="ml-1.5 text-[12.5px] font-medium text-[var(--lk-muted)]">
                          {mentor.role}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-[12.5px] text-[var(--lk-muted)]">{mentor.org}</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--lk-muted)]">
                        {mentor.career[0]}
                      </p>
                      <div className="lk-num mt-2 flex items-center gap-3 text-[12px] font-semibold text-[var(--lk-muted)]">
                        <span className="text-[var(--lk-accent)]">{mentor.fields.join(", ")}</span>
                        <span>답변 {mentor.answerCount}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star size={12} weight="fill" className="text-[var(--lk-warning)]" />
                          {mentor.satisfaction}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
