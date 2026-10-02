"use client";

import { useMemo, useState } from "react";
import { Check, FileText, Prohibit, Star } from "@phosphor-icons/react";
import {
  ADMIN_APPLICANTS,
  ADMIN_EXPERT_ROWS,
  CATEGORY_META,
  expertById,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";
import type { AdminExpertRow } from "@/projects/platform/lumi/lib/types";
import {
  FilterChips,
  PageHead,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/platform/lumi/components/admin/admin-ui";
import { ExpertAvatar } from "@/projects/platform/lumi/components/ui";

type Decision = "승인" | "반려";
type GradeFilter = "all" | AdminExpertRow["grade"];

export function AdminExperts() {
  const [selectedApplicant, setSelectedApplicant] = useState(ADMIN_APPLICANTS[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<GradeFilter>("all");
  const [states, setStates] = useState<Record<string, AdminExpertRow["state"]>>({});
  const [grades, setGrades] = useState<Record<string, AdminExpertRow["grade"]>>({});

  const applicant =
    ADMIN_APPLICANTS.find((a) => a.id === selectedApplicant) ?? ADMIN_APPLICANTS[0];
  const pending = ADMIN_APPLICANTS.filter((a) => !decisions[a.id]);

  const rows = useMemo(() => {
    const q = query.trim();
    return ADMIN_EXPERT_ROWS.filter((row) => {
      const expert = expertById(row.id);
      if (grade !== "all" && row.grade !== grade) return false;
      if (!q) return true;
      return expert.name.includes(q) || row.settlementBank.includes(q);
    });
  }, [query, grade]);

  return (
    <>
      <PageHead
        title="상담사 관리"
        description="입점 신청을 심사하고, 활동 중인 상담사의 등급과 상담 가능 상태, 정산 정보를 관리합니다."
      />

      <Panel
        title="입점 심사"
        note={`심사 대기 ${pending.length}건`}
        className="mb-4 overflow-hidden"
      >
        <div className="grid lg:grid-cols-[320px_1fr]">
          <ul className="divide-y divide-[var(--lm-border)] border-b border-[var(--lm-border)] lg:border-b-0 lg:border-r">
            {ADMIN_APPLICANTS.map((item) => {
              const decision = decisions[item.id];
              const active = item.id === selectedApplicant;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedApplicant(item.id)}
                    className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                      active ? "bg-[var(--lm-accent-soft)]" : "hover:bg-[var(--lm-surface)]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold">{item.name}</span>
                        <span className="text-[11.5px] text-[var(--lm-muted)]">
                          {CATEGORY_META[item.category].label}
                        </span>
                      </span>
                      <span className="lm-num mt-0.5 block text-[11.5px] text-[var(--lm-muted)]">
                        {item.appliedAt} 신청 · 경력 {item.years}년
                      </span>
                    </span>
                    {decision ? (
                      <Tag tone={decision === "승인" ? "success" : "danger"}>{decision}</Tag>
                    ) : (
                      <Tag tone="live">대기</Tag>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-bold tracking-tight">{applicant.name}</h3>
                <p className="lm-num mt-1 text-[12.5px] text-[var(--lm-muted)]">
                  {applicant.id} · {CATEGORY_META[applicant.category].label} · 경력{" "}
                  {applicant.years}년
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11.5px] text-[var(--lm-muted)]">시연 통화 평가</p>
                <p className="lm-num text-[20px] font-bold leading-tight">
                  {applicant.interviewScore}
                  <span className="ml-0.5 text-[12px] font-semibold text-[var(--lm-muted)]">
                    / 100
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {applicant.documents.map((doc) => (
                <div
                  key={doc.label}
                  className="rounded-xl border border-[var(--lm-border)] px-3.5 py-3"
                >
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold">
                    <FileText size={13} className="text-[var(--lm-muted)]" />
                    {doc.label}
                  </p>
                  <p
                    className={`mt-1.5 text-[12px] font-bold ${
                      doc.state === "확인"
                        ? "text-[var(--lm-success)]"
                        : doc.state === "재요청"
                          ? "text-[var(--lm-live)]"
                          : "text-[var(--lm-danger)]"
                    }`}
                  >
                    {doc.state}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-[var(--lm-surface)] px-4 py-3.5">
              <p className="text-[12px] font-bold text-[var(--lm-muted)]">심사 메모</p>
              <p className="mt-1.5 text-[13px] leading-relaxed">{applicant.screeningNote}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDecisions((prev) => ({ ...prev, [applicant.id]: "승인" }))}
                className="flex items-center gap-1.5 rounded-xl bg-[var(--lm-accent)] px-4 py-2.5 text-[13.5px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
              >
                <Check size={14} weight="bold" />
                승인하고 입점 처리
              </button>
              <button
                type="button"
                onClick={() => setDecisions((prev) => ({ ...prev, [applicant.id]: "반려" }))}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--lm-border)] px-4 py-2.5 text-[13.5px] font-bold text-[var(--lm-ink)] active:translate-y-[1px]"
              >
                <Prohibit size={14} />
                반려
              </button>
              {decisions[applicant.id] && (
                <span className="flex items-center text-[12.5px] font-semibold text-[var(--lm-muted)]">
                  {decisions[applicant.id]} 처리되었습니다. 신청자에게 결과 안내가 발송됩니다.
                </span>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="활동 상담사"
        note="상태를 바꾸면 앱 노출과 즉시 상담 배정이 즉시 반영됩니다"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={query} onChange={setQuery} placeholder="상담사명, 은행 검색" />
            <FilterChips<GradeFilter>
              value={grade}
              onChange={setGrade}
              options={[
                { key: "all", label: "전체", count: ADMIN_EXPERT_ROWS.length },
                { key: "루미 마스터", label: "루미 마스터" },
                { key: "정회원", label: "정회원" },
                { key: "신규", label: "신규" },
              ]}
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                <th className="px-5 py-3 font-semibold">상담사</th>
                <th className="px-3 py-3 font-semibold">등급</th>
                <th className="px-3 py-3 text-right font-semibold">이번 달 상담</th>
                <th className="px-3 py-3 text-right font-semibold">이번 달 매출</th>
                <th className="px-3 py-3 text-right font-semibold">취소율</th>
                <th className="px-3 py-3 font-semibold">정산 계좌</th>
                <th className="px-3 py-3 text-right font-semibold">수수료</th>
                <th className="px-5 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--lm-border)]">
              {rows.map((row) => {
                const expert = expertById(row.id);
                const state = states[row.id] ?? row.state;
                const rowGrade = grades[row.id] ?? row.grade;
                return (
                  <tr key={row.id} className="text-[13px] hover:bg-[var(--lm-surface)]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <ExpertAvatar expert={expert} size={32} />
                        <div>
                          <p className="font-bold">{expert.name}</p>
                          <p className="lm-num text-[11.5px] text-[var(--lm-muted)]">
                            <Star size={9} weight="fill" className="mr-0.5 inline align-[-1px]" />
                            {expert.rating.toFixed(2)} · {CATEGORY_META[expert.category].label}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={rowGrade}
                        onChange={(e) =>
                          setGrades((prev) => ({
                            ...prev,
                            [row.id]: e.target.value as AdminExpertRow["grade"],
                          }))
                        }
                        aria-label={`${expert.name} 등급`}
                        className={`rounded-lg border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-2.5 py-1.5 text-[12.5px] font-semibold outline-none ${
                          rowGrade === "루미 마스터"
                            ? "text-[var(--lm-accent)]"
                            : "text-[var(--lm-ink)]"
                        }`}
                      >
                        {["루미 마스터", "정회원", "신규"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="lm-num px-3 py-3 text-right">{row.monthSessions}건</td>
                    <td className="lm-num px-3 py-3 text-right">
                      {formatWon(row.monthRevenue)}원
                    </td>
                    <td
                      className={`lm-num px-3 py-3 text-right ${
                        row.cancelRate >= 5 ? "font-bold text-[var(--lm-danger)]" : ""
                      }`}
                    >
                      {row.cancelRate}%
                    </td>
                    <td className="lm-num px-3 py-3 text-[var(--lm-muted)]">
                      {row.settlementBank} {row.settlementAccount}
                    </td>
                    <td className="lm-num px-3 py-3 text-right">{row.feeRate}%</td>
                    <td className="px-5 py-3">
                      <select
                        value={state}
                        onChange={(e) =>
                          setStates((prev) => ({
                            ...prev,
                            [row.id]: e.target.value as AdminExpertRow["state"],
                          }))
                        }
                        aria-label={`${expert.name} 상담 가능 상태`}
                        className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] font-semibold outline-none ${
                          state === "정지"
                            ? "border-[var(--lm-danger)] text-[var(--lm-danger)]"
                            : "border-[var(--lm-border)] text-[var(--lm-ink)]"
                        } bg-[var(--lm-elevated)]`}
                      >
                        {["활동중", "상담중", "휴식", "정지"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
