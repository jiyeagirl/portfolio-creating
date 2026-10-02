"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  FileText,
  Question as QuestionIcon,
  Star,
  ThumbsUp,
} from "@phosphor-icons/react";
import {
  MENTORS,
  QUESTIONS,
  formatDate,
  formatRelativeTime,
  mentorById,
} from "@/projects/community/linkon/lib/mock-data";
import type { Question } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  InitialMark,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

export function MentorDetailScreen({
  questionId,
  drafts,
  onNavigate,
}: {
  questionId: string;
  drafts: Question[];
  onNavigate: NavigateFn;
}) {
  const question = [...drafts, ...QUESTIONS].find((q) => q.id === questionId);
  const [liked, setLiked] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [extra, setExtra] = useState<Record<string, { author: string; content: string; createdAt: string }[]>>(
    {},
  );

  if (!question) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24">
        <EmptyState
          icon={<QuestionIcon size={22} />}
          title="질문을 찾을 수 없습니다"
          description="삭제되었거나 비공개로 전환된 질문입니다."
          action={<SecondaryButton onClick={() => onNavigate("mentor")}>목록으로</SecondaryButton>}
        />
      </div>
    );
  }

  const sortedAnswers = [...question.answers].sort(
    (a, b) => Number(b.accepted) - Number(a.accepted) || b.likes - a.likes,
  );
  const relatedMentors = MENTORS.filter((m) => m.fields.includes(question.category));

  const addFollowUp = (answerId: string) => {
    if (!followUp.trim()) return;
    setExtra((prev) => ({
      ...prev,
      [answerId]: [
        ...(prev[answerId] ?? []),
        {
          author: "A테크 정하윤",
          content: followUp.trim(),
          createdAt: "2026-07-27T12:00:00",
        },
      ],
    }));
    setFollowUp("");
  };

  return (
    <div className="mx-auto max-w-[920px] px-6 pb-24 pt-8 lg:px-10">
      <button
        onClick={() => onNavigate("mentor")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-ink)]"
      >
        <ArrowLeft size={15} weight="bold" />
        멘토 Q&amp;A
      </button>

      <article className="mt-6 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{question.category}</Badge>
          {question.answers.some((a) => a.accepted) && (
            <Badge tone="success">
              <CheckCircle size={12} weight="fill" />
              답변 채택 완료
            </Badge>
          )}
        </div>
        <h1 className="mt-4 text-[26px] font-bold leading-[1.4] tracking-tight text-[var(--lk-ink)]">
          {question.title}
        </h1>
        <div className="lk-num mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--lk-muted)]">
          <span className="font-semibold text-[var(--lk-ink)]">{question.askerLabel}</span>
          <span>{formatDate(question.createdAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Eye size={13} />
            {question.views}
          </span>
        </div>

        <p className="mt-6 whitespace-pre-line text-[15.5px] leading-[1.9] text-[var(--lk-ink)]">
          {question.content}
        </p>

        {question.attachments.length > 0 && (
          <ul className="mt-6 space-y-2">
            {question.attachments.map((file) => (
              <li key={file.name}>
                <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--lk-border)] px-4 py-3 text-left transition-colors hover:border-[var(--lk-accent)] sm:w-[380px]">
                  <FileText size={17} className="text-[var(--lk-accent)]" />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                    {file.name}
                  </span>
                  <span className="lk-num shrink-0 text-[12px] text-[var(--lk-muted)]">{file.size}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex items-center gap-2 border-t border-[var(--lk-border)] pt-5">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`lk-num inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              liked
                ? "border-[var(--lk-accent)] bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                : "border-[var(--lk-border)] text-[var(--lk-muted)] hover:border-[var(--lk-accent)]"
            }`}
          >
            <ThumbsUp size={15} weight={liked ? "fill" : "regular"} />
            도움돼요 {question.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </article>

      <section className="mt-10">
        <h2 className="lk-num text-[19px] font-bold tracking-tight text-[var(--lk-ink)]">
          멘토 답변 {question.answers.length}
        </h2>

        {sortedAnswers.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<QuestionIcon size={22} />}
              title="아직 답변이 등록되지 않았습니다"
              description={`${question.category} 분야 멘토에게 전달되었습니다. 보통 1~2영업일 안에 답변이 등록됩니다.`}
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {sortedAnswers.map((answer) => {
              const mentor = mentorById(answer.mentorId)!;
              const followUps = [...answer.followUps, ...(extra[answer.id] ?? [])];
              return (
                <li
                  key={answer.id}
                  className={`rounded-2xl border bg-[var(--lk-elevated)] p-6 ${
                    answer.accepted ? "border-[var(--lk-accent)]" : "border-[var(--lk-border)]"
                  }`}
                >
                  {answer.accepted && (
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--lk-accent-soft)] px-3 py-1 text-[12px] font-bold text-[var(--lk-accent)]">
                      <CheckCircle size={13} weight="fill" />
                      질문자가 채택한 답변
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <InitialMark mark={mentor.mark} tone={mentor.tone} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-[var(--lk-ink)]">
                        {mentor.name}
                        <span className="ml-2 text-[13px] font-medium text-[var(--lk-muted)]">
                          {mentor.role} {mentor.org}
                        </span>
                      </p>
                      <p className="lk-num mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] text-[var(--lk-muted)]">
                        <span className="font-semibold text-[var(--lk-accent)]">
                          {mentor.fields.join(", ")}
                        </span>
                        <span>답변 {mentor.answerCount}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star size={12} weight="fill" className="text-[var(--lk-warning)]" />
                          만족도 {mentor.satisfaction}
                        </span>
                        <span>{formatRelativeTime(answer.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.9] text-[var(--lk-ink)]">
                    {answer.content}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="lk-num inline-flex items-center gap-1.5 rounded-full bg-[var(--lk-surface)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--lk-muted)]">
                      <ThumbsUp size={14} />
                      {answer.likes}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-[var(--lk-border)] pt-5">
                    <p className="text-[13px] font-bold text-[var(--lk-ink)]">추가 질문</p>
                    <ul className="mt-3 space-y-3">
                      {followUps.length === 0 && (
                        <li className="text-[13px] text-[var(--lk-muted)]">
                          답변 내용에 궁금한 점이 있다면 이어서 질문할 수 있습니다.
                        </li>
                      )}
                      {followUps.map((item, i) => (
                        <li key={`${answer.id}-fu-${i}`} className="rounded-xl bg-[var(--lk-bg)] px-4 py-3">
                          <p className="lk-num text-[12.5px] font-semibold text-[var(--lk-ink)]">
                            {item.author}
                            <span className="ml-2 font-normal text-[var(--lk-muted)]">
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </p>
                          <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--lk-ink)]">
                            {item.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addFollowUp(answer.id)}
                        placeholder="추가로 궁금한 점을 입력하세요"
                        aria-label="추가 질문 입력"
                        className={inputClass}
                      />
                      <PrimaryButton size="sm" onClick={() => addFollowUp(answer.id)}>
                        등록
                      </PrimaryButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[17px] font-bold tracking-tight text-[var(--lk-ink)]">
          {question.category} 분야 멘토
        </h2>
        <div className={`mt-4 grid gap-3 ${relatedMentors.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {relatedMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5"
            >
              <div className="flex items-center gap-3">
                <InitialMark mark={mentor.mark} tone={mentor.tone} size={40} />
                <div className="min-w-0">
                  <p className="text-[14.5px] font-bold text-[var(--lk-ink)]">{mentor.name}</p>
                  <p className="truncate text-[12.5px] text-[var(--lk-muted)]">
                    {mentor.role} {mentor.org}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {mentor.career.map((item) => (
                  <li key={item} className="text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="lk-num mt-3 flex items-center gap-4 text-[12.5px] font-semibold text-[var(--lk-muted)]">
                <span>답변 {mentor.answerCount}건</span>
                <span className="inline-flex items-center gap-1">
                  <Star size={13} weight="fill" className="text-[var(--lk-warning)]" />
                  만족도 {mentor.satisfaction}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
