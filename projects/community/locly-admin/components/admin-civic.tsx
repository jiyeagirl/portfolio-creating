"use client";

import { useState } from "react";
import { CheckCircle, Circle, HandsClapping, Plus } from "@phosphor-icons/react";
import { CIVIC_PROPOSALS, POLLS } from "@/projects/community/locly/lib/mock-data";
import type { CivicProposal } from "@/projects/community/locly/lib/types";
import {
  AdminButton,
  AdminPageHead,
  Drawer,
  Field,
  Panel,
  StatusBadge,
  Tabs,
} from "@/projects/community/locly-admin/components/admin-ui";
import type { AdminTone } from "@/projects/community/locly-admin/components/admin-ui";

const STATUS_TONE: Record<CivicProposal["status"], AdminTone> = {
  접수: "wait",
  검토중: "info",
  답변완료: "ok",
};

const NEXT_STATUS: Record<CivicProposal["status"], CivicProposal["status"]> = {
  접수: "검토중",
  검토중: "답변완료",
  답변완료: "답변완료",
};

export function AdminCivic() {
  const [tab, setTab] = useState<"proposals" | "polls">("proposals");
  const [proposals, setProposals] = useState(CIVIC_PROPOSALS);
  const [selectedId, setSelectedId] = useState(CIVIC_PROPOSALS[0].id);
  const [reply, setReply] = useState("");
  const [creating, setCreating] = useState(false);

  const selected = proposals.find((p) => p.id === selectedId) ?? proposals[0];
  const waiting = proposals.filter((p) => p.status !== "답변완료").length;

  function advance(id: string) {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const status = NEXT_STATUS[p.status];
        const stepIndex = p.timeline.findIndex((t) => !t.done);
        return {
          ...p,
          status,
          timeline: p.timeline.map((t, i) => (i === stepIndex ? { ...t, done: true } : t)),
        };
      }),
    );
    setReply("");
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="주민참여 관리"
        lead="주민이 올린 정책 제안의 처리 단계를 갱신하고, 의견 수렴용 설문을 만들어 결과를 확인합니다."
        action={
          tab === "polls" ? (
            <AdminButton variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} weight="bold" />
              설문 만들기
            </AdminButton>
          ) : (
            <StatusBadge tone={waiting > 0 ? "wait" : "ok"}>답변 대기 {waiting}건</StatusBadge>
          )
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "proposals", label: "정책 제안", count: proposals.length },
          { key: "polls", label: "설문 · 투표", count: POLLS.length },
        ]}
      />

      {tab === "proposals" && (
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <Panel title="접수 목록" meta={`${proposals.length}건`} padded={false}>
            <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
              {proposals.map((proposal) => (
                <button
                  key={proposal.id}
                  onClick={() => setSelectedId(proposal.id)}
                  className={`px-6 py-4 text-left transition-colors ${
                    selected.id === proposal.id ? "bg-[var(--lc-surface-soft)]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge tone={STATUS_TONE[proposal.status]}>{proposal.status}</StatusBadge>
                    <span className="text-[12px] text-[var(--lc-muted-soft)]">{proposal.createdAt}</span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-[14px] font-medium leading-[1.45] text-[var(--lc-ink)]">
                    {proposal.title}
                  </p>
                  <p className="mt-2 flex items-center gap-3 text-[12px] text-[var(--lc-muted)]">
                    <span>{proposal.category}</span>
                    <span className="inline-flex items-center gap-1">
                      <HandsClapping size={12} />
                      {proposal.agree}
                    </span>
                  </p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title={selected.title}
            meta={`${selected.author} · ${selected.createdAt}`}
            action={<StatusBadge tone={STATUS_TONE[selected.status]}>{selected.status}</StatusBadge>}
          >
            <p className="text-[15px] leading-[1.7] text-[var(--lc-body)]">{selected.content}</p>

            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-[8px] bg-[var(--lc-surface-soft)] px-5 py-4">
              {[
                { label: "분류", value: selected.category },
                { label: "공감", value: `${selected.agree}명` },
                { label: "담당", value: "나인구청 도시안전과" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[12px] text-[var(--lc-muted)]">{item.label}</p>
                  <p className="mt-1 text-[14px] font-medium text-[var(--lc-ink)]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--lc-muted-soft)]">
                처리 단계
              </p>
              <div className="mt-4">
                {selected.timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {step.done ? (
                        <CheckCircle size={18} weight="fill" className="text-[var(--lc-teal)]" />
                      ) : (
                        <Circle size={18} className="text-[var(--lc-hairline)]" />
                      )}
                      {i < selected.timeline.length - 1 && (
                        <span
                          className={`w-px flex-1 ${step.done ? "bg-[var(--lc-teal)]" : "bg-[var(--lc-hairline)]"}`}
                          style={{ minHeight: 22 }}
                        />
                      )}
                    </div>
                    <div className="pb-5">
                      <p
                        className={`text-[14px] font-medium ${
                          step.done ? "text-[var(--lc-ink)]" : "text-[var(--lc-muted-soft)]"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--lc-muted-soft)]">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--lc-hairline)] pt-6">
              <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--lc-muted-soft)]">
                담당 부서 답변
              </p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="검토 결과와 후속 일정을 작성하면 제안자에게 알림이 발송되고 주민 사이트에 공개됩니다."
                className="mt-3 w-full resize-none rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] p-4 text-[14px] leading-[1.6] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
              />
              <div className="mt-4 flex justify-end gap-2">
                <AdminButton>임시 저장</AdminButton>
                <AdminButton variant="primary" onClick={() => advance(selected.id)}>
                  {selected.status === "답변완료" ? "답변 수정 등록" : "다음 단계로 처리"}
                </AdminButton>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === "polls" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {POLLS.map((poll) => (
            <Panel key={poll.id} title={poll.title} meta={`마감 ${poll.deadline}`}>
              <p className="text-[14px] leading-[1.6] text-[var(--lc-body)]">{poll.description}</p>
              <p className="mt-4 text-[13px] text-[var(--lc-muted)]">
                총 참여 <span className="font-medium text-[var(--lc-ink)]">{poll.totalVotes.toLocaleString()}</span>명
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {[...poll.options]
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, i) => {
                    const pct = Math.round((option.votes / poll.totalVotes) * 100);
                    return (
                      <div key={option.label}>
                        <div className="flex items-baseline justify-between text-[14px]">
                          <span className="text-[var(--lc-ink)]">{option.label}</span>
                          <span className="font-medium text-[var(--lc-body)]">
                            {pct}% · {option.votes.toLocaleString()}표
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--lc-surface-card)]">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: i === 0 ? "var(--lc-primary)" : "var(--lc-ink)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-[var(--lc-hairline)] pt-5">
                <AdminButton size="sm">결과 내보내기</AdminButton>
                <AdminButton size="sm" variant="secondary">
                  설문 마감
                </AdminButton>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Drawer
        open={creating}
        title="설문 만들기"
        subtitle="등록하면 주민참여 화면의 설문·투표 탭에 바로 게시됩니다."
        onClose={() => setCreating(false)}
        footer={
          <>
            <AdminButton onClick={() => setCreating(false)}>취소</AdminButton>
            <AdminButton variant="primary" onClick={() => setCreating(false)}>
              게시하기
            </AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Field label="설문 제목" placeholder="예: 나인천 수변공원 야간 개방 시간 조정" />
          <Field label="설명" placeholder="설문 배경과 결과 활용 계획을 적어주세요." textarea />
          <Field label="선택지 1" placeholder="현행 유지 (22시 폐장)" />
          <Field label="선택지 2" placeholder="23시까지 연장" />
          <Field label="선택지 3" placeholder="24시간 개방" />
          <Field label="마감일" placeholder="2026-08-15" hint="마감 후에는 결과만 공개됩니다." />
        </div>
      </Drawer>
    </div>
  );
}
