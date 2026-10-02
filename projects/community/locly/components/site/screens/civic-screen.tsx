"use client";

import { useState } from "react";
import { CaretDown, CheckCircle, Circle, HandsClapping, Plus, X } from "@phosphor-icons/react";
import { CIVIC_PROPOSALS, POLLS } from "@/projects/community/locly/lib/mock-data";
import {
  Badge,
  CONTAINER,
  Display,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "@/projects/community/locly/components/site/ui";

const STATUS_TONE: Record<string, "pending" | "neutral" | "official"> = {
  접수: "pending",
  검토중: "neutral",
  답변완료: "official",
};

function Timeline({ timeline }: { timeline: { label: string; date: string; done: boolean }[] }) {
  return (
    <div className="mt-6 rounded-[12px] bg-[var(--lc-surface-soft)] px-6 pt-6">
      {timeline.map((step, i) => (
        <div key={step.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            {step.done ? (
              <CheckCircle size={19} weight="fill" className="text-[var(--lc-teal)]" />
            ) : (
              <Circle size={19} className="text-[var(--lc-muted-soft)]" />
            )}
            {i < timeline.length - 1 && (
              <span
                className={`w-px flex-1 ${step.done ? "bg-[var(--lc-teal)]" : "bg-[var(--lc-hairline)]"}`}
                style={{ minHeight: 28 }}
              />
            )}
          </div>
          <div className="pb-6">
            <p className={`text-[15px] font-medium ${step.done ? "text-[var(--lc-ink)]" : "text-[var(--lc-muted-soft)]"}`}>
              {step.label}
            </p>
            <p className="mt-0.5 text-[13px] text-[var(--lc-muted-soft)]">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CivicScreen() {
  const [tab, setTab] = useState<"proposal" | "poll">("proposal");
  const [expanded, setExpanded] = useState<string | null>(CIVIC_PROPOSALS[0].id);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [voted, setVoted] = useState<string | null>(null);

  const poll = POLLS[0];
  const totalVotes = poll.totalVotes + (voted ? 1 : 0);

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="mx-auto max-w-[920px]">
        <PageHeader
          title="주민참여"
          lead="주민의 의견이 나인구청 정책에 직접 반영되는 공식 소통 창구입니다. 접수부터 답변까지 처리 과정을 공개합니다."
        />

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-[10px] bg-[var(--lc-surface-soft)] p-1">
            {(["proposal", "poll"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-[8px] px-4 py-2 text-[14px] font-medium transition-colors ${
                  tab === key ? "bg-[var(--lc-canvas)] text-[var(--lc-ink)] shadow-[0_1px_2px_rgba(20,20,19,0.08)]" : "text-[var(--lc-muted)]"
                }`}
              >
                {key === "proposal" ? "정책 제안" : "설문 / 투표"}
              </button>
            ))}
          </div>
          {tab === "proposal" && (
            <PrimaryButton onClick={() => setCreating((v) => !v)}>
              <Plus size={15} weight="bold" />
              제안하기
            </PrimaryButton>
          )}
        </div>

        {tab === "proposal" && (
          <div>

            {creating && (
              <div className="mt-6 rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] p-8">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium text-[var(--lc-ink)]">새 정책 제안</p>
                  <button onClick={() => setCreating(false)} aria-label="닫기" className="text-[var(--lc-muted)]">
                    <X size={17} />
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  placeholder="개선이 필요한 지역 현안을 구체적으로 적어주세요"
                  className="mt-5 w-full resize-none rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] p-4 text-[15px] leading-[1.6] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
                />
                <div className="mt-4 flex justify-end">
                  <SecondaryButton
                    onClick={() => {
                      setCreating(false);
                      setDraft("");
                    }}
                  >
                    제안 등록
                  </SecondaryButton>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col divide-y divide-[var(--lc-hairline)]">
              {CIVIC_PROPOSALS.map((proposal) => (
                <div key={proposal.id} className="py-7">
                  <button
                    onClick={() => setExpanded(expanded === proposal.id ? null : proposal.id)}
                    className="flex w-full items-start gap-5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={STATUS_TONE[proposal.status]}>{proposal.status}</Badge>
                        <span className="text-[13px] text-[var(--lc-muted)]">{proposal.category}</span>
                      </div>
                      <p className="mt-3 text-[18px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                        {proposal.title}
                      </p>
                      <p className="mt-2 text-[15px] leading-[1.6] text-[var(--lc-body)]">{proposal.content}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 text-[13px] text-[var(--lc-muted-soft)]">
                        <span>{proposal.author}</span>
                        <span>{proposal.createdAt}</span>
                        <span className="inline-flex items-center gap-1 font-medium text-[var(--lc-primary)]">
                          <HandsClapping size={13} />
                          공감 {proposal.agree}
                        </span>
                      </div>
                    </div>
                    <CaretDown
                      size={17}
                      className={`mt-1 shrink-0 text-[var(--lc-muted-soft)] transition-transform ${
                        expanded === proposal.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded === proposal.id && <Timeline timeline={proposal.timeline} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "poll" && (
          <div className="mt-8 rounded-[12px] border border-[var(--lc-hairline)] p-6 md:p-8">
            <Display size="sm">{poll.title}</Display>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--lc-body)]">{poll.description}</p>
            <p className="mt-2 text-[13px] text-[var(--lc-muted-soft)]">
              마감 {poll.deadline} | 참여 {totalVotes.toLocaleString()}명
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {poll.options.map((option) => {
                const votes = option.votes + (voted === option.label ? 1 : 0);
                const pct = Math.round((votes / totalVotes) * 100);
                const isSelected = voted === option.label;
                return (
                  <button
                    key={option.label}
                    onClick={() => !voted && setVoted(option.label)}
                    disabled={!!voted}
                    className={`relative overflow-hidden rounded-[8px] border px-5 py-4 text-left transition-colors ${
                      isSelected ? "border-[var(--lc-primary)]" : "border-[var(--lc-hairline)]"
                    } ${voted ? "cursor-default" : ""}`}
                  >
                    {voted && (
                      <span
                        className="absolute inset-y-0 left-0 bg-[var(--lc-surface-card)]"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <span className="relative flex items-center justify-between text-[15px] text-[var(--lc-ink)]">
                      {option.label}
                      {voted && <span className="font-medium">{pct}%</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            {!voted && (
              <p className="mt-4 text-[13px] text-[var(--lc-muted-soft)]">
                항목을 선택하면 투표가 완료돼요. 중복 투표는 불가합니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
