"use client";

import { useState } from "react";
import { CaretDown, CheckCircle, Circle, HandsClapping, Plus, X } from "@phosphor-icons/react";
import { CIVIC_PROPOSALS, POLLS } from "@/projects/community/locly/lib/mock-data";
import { Badge, PrimaryButton, SecondaryButton } from "@/projects/community/locly/components/layout/ui";

const STATUS_TONE: Record<string, "warning" | "accent" | "success"> = {
  접수: "warning",
  검토중: "accent",
  답변완료: "success",
};

function ProposalTimeline({ timeline }: { timeline: { label: string; date: string; done: boolean }[] }) {
  return (
    <div className="mt-4 flex flex-col gap-0 border-t border-[var(--locly-border)] pt-4">
      {timeline.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            {step.done ? (
              <CheckCircle size={18} weight="fill" className="text-[var(--locly-success)]" />
            ) : (
              <Circle size={18} className="text-[var(--locly-border)]" />
            )}
            {i < timeline.length - 1 && (
              <span className={`w-px flex-1 ${step.done ? "bg-[var(--locly-success)]" : "bg-[var(--locly-border)]"}`} style={{ minHeight: 24 }} />
            )}
          </div>
          <div className="pb-4">
            <p className={`text-[13.5px] font-semibold ${step.done ? "text-[var(--locly-ink)]" : "text-[var(--locly-muted)]"}`}>
              {step.label}
            </p>
            <p className="text-[12px] text-[var(--locly-muted)]">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CivicScreen() {
  const [tab, setTab] = useState<"proposal" | "poll">("proposal");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [votedOption, setVotedOption] = useState<string | null>(null);

  const poll = POLLS[0];
  const totalVotes = poll.totalVotes + (votedOption ? 1 : 0);

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-24 pt-8 lg:px-0">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">주민참여</h1>
        <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
          주민의 의견이 지자체 정책에 직접 반영되는 공식 소통 창구예요
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1 rounded-full border border-[var(--locly-border)] p-1 w-fit">
        <button
          onClick={() => setTab("proposal")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
            tab === "proposal" ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "text-[var(--locly-muted)]"
          }`}
        >
          정책 제안
        </button>
        <button
          onClick={() => setTab("poll")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
            tab === "poll" ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "text-[var(--locly-muted)]"
          }`}
        >
          설문 · 투표
        </button>
      </div>

      {tab === "proposal" && (
        <div className="mt-6">
          <div className="flex justify-end">
            <PrimaryButton onClick={() => setCreating((v) => !v)}>
              <Plus size={16} weight="bold" />
              제안하기
            </PrimaryButton>
          </div>

          {creating && (
            <div className="mt-4 rounded-2xl border border-[var(--locly-accent)]/40 bg-[var(--locly-accent-soft)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-[var(--locly-ink)]">새 정책 제안 작성</p>
                <button onClick={() => setCreating(false)} className="text-[var(--locly-muted)] hover:text-[var(--locly-ink)]">
                  <X size={16} />
                </button>
              </div>
              <textarea
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                rows={4}
                placeholder="개선이 필요한 지역 현안을 구체적으로 적어주세요"
                className="mt-4 w-full resize-none rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-4 py-3 text-[13.5px] outline-none placeholder:text-[var(--locly-muted)] focus:border-[var(--locly-accent)]"
              />
              <div className="mt-3 flex justify-end">
                <SecondaryButton
                  onClick={() => {
                    setCreating(false);
                    setProposalText("");
                  }}
                >
                  제안 등록
                </SecondaryButton>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {CIVIC_PROPOSALS.map((proposal) => (
              <div key={proposal.id} className="p-5">
                <button
                  onClick={() => setExpanded(expanded === proposal.id ? null : proposal.id)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[proposal.status]}>{proposal.status}</Badge>
                      <span className="text-[12px] text-[var(--locly-muted)]">{proposal.category}</span>
                    </div>
                    <p className="mt-2 text-[15px] font-semibold text-[var(--locly-ink)]">{proposal.title}</p>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--locly-muted)]">
                      {proposal.content}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[12px] text-[var(--locly-muted)]">
                      <span>{proposal.author}</span>
                      <span>{proposal.createdAt}</span>
                      <span className="inline-flex items-center gap-1 font-medium text-[var(--locly-accent)]">
                        <HandsClapping size={13} />
                        공감 {proposal.agree}
                      </span>
                    </div>
                  </div>
                  <CaretDown
                    size={16}
                    className={`mt-1 shrink-0 text-[var(--locly-muted)] transition-transform ${expanded === proposal.id ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded === proposal.id && <ProposalTimeline timeline={proposal.timeline} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "poll" && (
        <div className="mt-6 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-6">
          <p className="text-[16px] font-bold text-[var(--locly-ink)]">{poll.title}</p>
          <p className="mt-1.5 text-[13px] text-[var(--locly-muted)]">{poll.description}</p>
          <p className="mt-1 text-[12px] text-[var(--locly-muted)]">마감 {poll.deadline} · 참여 {totalVotes.toLocaleString()}명</p>

          <div className="mt-5 flex flex-col gap-2.5">
            {poll.options.map((option) => {
              const votes = option.votes + (votedOption === option.label ? 1 : 0);
              const pct = Math.round((votes / totalVotes) * 100);
              const isSelected = votedOption === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => !votedOption && setVotedOption(option.label)}
                  disabled={!!votedOption}
                  className={`relative overflow-hidden rounded-lg border px-4 py-3 text-left transition-colors ${
                    isSelected ? "border-[var(--locly-accent)]" : "border-[var(--locly-border)]"
                  } ${votedOption ? "cursor-default" : "hover:border-[var(--locly-accent)]"}`}
                >
                  {votedOption && (
                    <span
                      className="absolute inset-y-0 left-0 bg-[var(--locly-accent-soft)]"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <span className="relative flex items-center justify-between text-[13.5px] font-medium text-[var(--locly-ink)]">
                    {option.label}
                    {votedOption && <span className="font-semibold text-[var(--locly-accent)]">{pct}%</span>}
                  </span>
                </button>
              );
            })}
          </div>
          {!votedOption && (
            <p className="mt-3 text-[12px] text-[var(--locly-muted)]">항목을 선택하면 투표가 완료돼요. 중복 투표는 불가합니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
