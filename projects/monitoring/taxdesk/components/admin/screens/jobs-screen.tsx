"use client";

import { useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  CircleDashed,
  DownloadSimple,
  HandPalm,
  Info,
  Pause,
  SpinnerGap,
  XCircle,
} from "@phosphor-icons/react";
import { ModeBadge, StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { Button, MetricStrip, PageHeader, Tabs, Toast } from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import type { AdminScreen } from "@/projects/monitoring/taxdesk/components/admin/admin-nav";
import {
  AGENT_STATUS,
  DEFAULT_JOB_ID,
  JOBS,
  JOB_SUMMARY,
  STEP_EXPLAIN,
  reconcile,
  stepLogs,
  stepStatuses,
  type Job,
  type StepStatus,
} from "@/projects/monitoring/taxdesk/lib/admin-data";
import { JOB_STEPS, JOB_TONE, type JobState } from "@/projects/monitoring/taxdesk/lib/status";

type Filter = "전체" | JobState;

const SEG: Record<StepStatus, string> = {
  done: "bg-[var(--td-done-fg)]",
  run: "bg-[var(--td-run-fg)]",
  wait: "bg-[var(--td-act-fg)]",
  fail: "bg-[var(--td-stop-fg)]",
  pending: "bg-[var(--td-line)]",
};

export function MiniSteps({ job }: { job: Job }) {
  const st = stepStatuses(job);
  return (
    <span className="flex w-[96px] shrink-0 gap-[3px]" aria-label={`8단계 중 ${Math.min(job.step + 1, 8)}단계`}>
      {st.map((s, i) => (
        <span key={i} className={`h-[5px] flex-1 rounded-full ${SEG[s]}`} />
      ))}
    </span>
  );
}

function StepIcon({ s }: { s: StepStatus }) {
  if (s === "done") return <CheckCircle size={20} weight="fill" className="text-[var(--td-done-fg)]" />;
  if (s === "run") return <SpinnerGap size={20} weight="bold" className="animate-spin text-[var(--td-run-fg)] motion-reduce:animate-none" />;
  if (s === "wait") return <Pause size={20} weight="fill" className="text-[var(--td-act-fg)]" />;
  if (s === "fail") return <XCircle size={20} weight="fill" className="text-[var(--td-stop-fg)]" />;
  return <CircleDashed size={20} className="text-[#c7c7cc]" />;
}

function fmtDur(sec: number) {
  if (!sec) return "";
  return sec >= 60 ? `${Math.floor(sec / 60)}분 ${sec % 60}초` : `${sec}초`;
}

export function JobsScreen({
  initialJob,
  initialStep,
  onNavigate,
}: {
  initialJob: string | null;
  initialStep: string | null;
  onNavigate: (s: AdminScreen) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [filter, setFilter] = useState<Filter>("전체");
  const [jobId, setJobId] = useState(initialJob && JOBS.some((j) => j.id === initialJob) ? initialJob : DEFAULT_JOB_ID);
  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const focusStep = Math.min(job.step, 7);
  const parsed = initialStep !== null ? Number(initialStep) - 1 : NaN;
  const [stepSel, setStepSel] = useState<number | null>(Number.isInteger(parsed) && parsed >= 0 && parsed < 8 ? parsed : null);
  const step = stepSel ?? focusStep;
  const [toast, setToast] = useState<string | null>(null);

  const list = useMemo(() => jobs.filter((j) => filter === "전체" || j.state === filter), [jobs, filter]);
  const statuses = stepStatuses(job);
  const logs = stepLogs(job);
  const recon = reconcile(job);
  const explain = STEP_EXPLAIN[step];

  function retry() {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, state: "진행 중", updatedAt: "10:27:31", failReason: undefined, mismatch: undefined } : j,
      ),
    );
    setToast(`${JOB_STEPS[job.step]} 단계부터 다시 실행합니다`);
  }

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "전체", label: "전체", count: jobs.length },
    { id: "진행 중", label: "진행 중", count: JOB_SUMMARY.running },
    { id: "인증 대기", label: "인증 대기", count: JOB_SUMMARY.waiting },
    { id: "실패", label: "실패", count: JOB_SUMMARY.failed },
    { id: "접수 완료", label: "접수 완료", count: JOB_SUMMARY.doneToday },
  ];

  return (
    <div>
      <PageHeader
        title="전체 작업"
        meta="홈택스 자동 신고 | 오늘 08:05부터"
        actions={
          <Button variant="secondary" icon={<HandPalm size={15} />} onClick={() => onNavigate("automation")}>
            긴급 정지
          </Button>
        }
      />
      <div className="mt-5">
        <MetricStrip
          items={[
            { label: "진행 중 (건)", value: JOB_SUMMARY.running, tone: "run", sub: `대기열 ${JOB_SUMMARY.queued}건` },
            { label: "인증 대기 (건)", value: JOB_SUMMARY.waiting, tone: "act", sub: "전환 1건 포함" },
            { label: "실패 (건)", value: JOB_SUMMARY.failed, tone: "stop", sub: "재처리 필요" },
            { label: "오늘 접수 완료 (건)", value: JOB_SUMMARY.doneToday },
            {
              label: "실행 에이전트",
              value: <span className="text-[17px]">{AGENT_STATUS.connected ? "연결됨" : "끊김"}</span>,
              sub: `${AGENT_STATUS.heartbeat} 응답 | ${AGENT_STATUS.latency}`,
            },
          ]}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="min-w-0">
          <Tabs items={tabs} value={filter} onChange={setFilter} size="sm" />
          <ul className="mt-1">
            {list.map((j) => {
              const active = j.id === job.id;
              return (
                <li key={j.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setJobId(j.id);
                      setStepSel(null);
                    }}
                    className={`flex w-full flex-col gap-2 border-b border-[var(--td-line-soft)] px-3 py-3 text-left transition-colors duration-150 ${
                      active ? "bg-[var(--td-blue-tint)]" : "hover:bg-[var(--td-pearl)]"
                    }`}
                  >
                    <span className="flex w-full items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{j.business}</span>
                      <ModeBadge compact mode={j.mode} />
                      <StatusChip compact tone={JOB_TONE[j.state]}>
                        {j.state}
                      </StatusChip>
                    </span>
                    <span className="flex w-full items-center gap-3 text-[12px] text-[var(--td-ink-3)]">
                      <span className="td-mono">{j.id}</span>
                      <MiniSteps job={j} />
                      <span className="ml-auto truncate">
                        {j.state === "실패" ? j.failReason : j.state === "접수 완료" ? "완료" : JOB_STEPS[Math.min(j.step, 7)]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="min-w-0 rounded-[16px] border border-[var(--td-line)]">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--td-line)] px-6 py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[17px] font-semibold leading-6">{job.business}</h2>
                <ModeBadge compact mode={job.mode} />
                <StatusChip compact tone={JOB_TONE[job.state]}>
                  {job.state}
                </StatusChip>
              </div>
              <p className="mt-1 text-[12.5px] text-[var(--td-ink-3)]">
                <span className="td-mono">{job.id}</span> | 접수 건 <span className="td-mono">{job.filingId}</span> | 시작{" "}
                <span className="tabular-nums">{job.startedAt}</span> | 갱신 <span className="tabular-nums">{job.updatedAt}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {job.state === "실패" && (
                <>
                  <Button variant="secondary" onClick={() => setToast("인증 대기로 넘겼습니다")}>
                    인증 대기로 전환
                  </Button>
                  <Button variant="primary" icon={<ArrowCounterClockwise size={15} />} onClick={retry}>
                    실패 단계부터 재처리
                  </Button>
                </>
              )}
              {job.state === "인증 대기" && (
                <Button variant="primary" icon={<ArrowRight size={15} />} onClick={() => onNavigate("auth")}>
                  인증 대기에서 처리
                </Button>
              )}
              {job.state === "접수 완료" && (
                <Button variant="secondary" icon={<DownloadSimple size={15} />}>
                  접수증 PDF
                </Button>
              )}
            </div>
          </div>

          {job.failReason && (
            <div
              className={`mx-6 mt-5 rounded-[12px] px-4 py-3.5 ${
                job.state === "실패" ? "bg-[var(--td-stop-bg)]" : "bg-[var(--td-act-bg)]"
              }`}
            >
              <p className={`text-[13px] font-semibold ${job.state === "실패" ? "text-[var(--td-stop-fg)]" : "text-[var(--td-act-fg)]"}`}>
                {job.failReason} | {JOB_STEPS[job.step]} 단계
                {job.converted && " | 자동 제출 실패 후 전환"}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--td-ink)]">{job.failDetail}</p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--td-ink-2)]">{job.failAction}</p>
            </div>
          )}
          {job.receiptNo && (
            <p className="mx-6 mt-5 rounded-[12px] bg-[var(--td-done-bg)] px-4 py-3 text-[13px] text-[var(--td-done-fg)]">
              접수번호 <span className="td-mono font-semibold">{job.receiptNo}</span> | 접수증 저장, 알림톡 발송 완료
            </p>
          )}

          <ol className="mt-5 grid grid-cols-8 px-6 pb-1">
            {JOB_STEPS.map((name, i) => {
              const s = statuses[i];
              const sel = i === step;
              return (
                <li key={name} className="relative min-w-0">
                  {i > 0 && (
                    <span
                      className={`absolute left-0 right-1/2 top-[19px] h-[2px] ${statuses[i - 1] === "done" ? "bg-[var(--td-done-fg)]" : "bg-[var(--td-line)]"}`}
                    />
                  )}
                  {i < 7 && (
                    <span
                      className={`absolute left-1/2 right-0 top-[19px] h-[2px] ${s === "done" ? "bg-[var(--td-done-fg)]" : "bg-[var(--td-line)]"}`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setStepSel(i)}
                    aria-pressed={sel}
                    className={`relative flex w-full flex-col items-center gap-1.5 rounded-[10px] px-1 pb-2 pt-2 transition-colors duration-150 ${
                      sel ? "bg-[var(--td-parch)]" : "hover:bg-[var(--td-pearl)]"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <StepIcon s={s} />
                    </span>
                    <span
                      className={`flex h-8 items-center text-center text-[12px] leading-4 ${sel ? "font-semibold" : "text-[var(--td-ink-2)]"}`}
                    >
                      {name}
                    </span>
                    <span className="h-4 text-[11.5px] tabular-nums text-[var(--td-ink-3)]">
                      {s === "done" ? fmtDur(job.durations[i]) : s === "pending" ? "" : s === "fail" ? "실패" : s === "wait" ? "멈춤" : "진행 중"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="grid gap-5 px-6 pt-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">{JOB_STEPS[step]} 실행 로그</p>
              <div className="mt-2 min-h-[148px] rounded-[12px] bg-[var(--td-ink)] px-4 py-3">
                {logs[step].length === 0 ? (
                  <p className="td-mono py-6 text-center text-[12.5px] text-[#86868b]">아직 실행 전</p>
                ) : (
                  <ul className="space-y-1">
                    {logs[step].map((l, k) => (
                      <li key={k} className="td-mono flex gap-3 text-[12.5px] leading-5">
                        <span className="shrink-0 text-[#86868b]">{l.at}</span>
                        <span
                          className={
                            l.level === "error" ? "text-[#ff8a80]" : l.level === "warn" ? "text-[#ffd479]" : "text-[#e8e8ed]"
                          }
                        >
                          {l.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="rounded-[12px] bg-[var(--td-parch)] px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Info size={15} />
                홈택스에서 처리되는 내용
              </p>
              <p className="mt-2 text-[13px] leading-5 text-[var(--td-ink-2)]">{explain.body}</p>
              <ul className="mt-2.5 space-y-1.5">
                {explain.items.map((t) => (
                  <li key={t} className="flex gap-2 text-[12.5px] leading-[18px]">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--td-ink-3)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-6 pb-6 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold">입력값 대조</p>
              <p className="text-[12px] text-[var(--td-ink-3)]">
                일치 <span className="tabular-nums">{recon.filter((r) => r.ok).length}</span> | 불일치{" "}
                <span className="tabular-nums">{recon.filter((r) => r.ok === false).length}</span> | 미입력{" "}
                <span className="tabular-nums">{recon.filter((r) => r.ok === null).length}</span>
              </p>
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--td-line)]">
                    <th className="h-9 px-2 text-left text-[12px] font-semibold text-[var(--td-ink-3)]">항목</th>
                    <th className="h-9 w-[92px] px-2 text-left text-[12px] font-semibold text-[var(--td-ink-3)]">신고서 칸</th>
                    <th className="h-9 w-[120px] px-2 text-right text-[12px] font-semibold text-[var(--td-ink-3)]">플랫폼 값</th>
                    <th className="h-9 w-[120px] px-2 text-right text-[12px] font-semibold text-[var(--td-ink-3)]">홈택스 입력값</th>
                    <th className="h-9 w-[56px] px-2 text-center text-[12px] font-semibold text-[var(--td-ink-3)]">대조</th>
                  </tr>
                </thead>
                <tbody>
                  {recon.map((r) => (
                    <tr key={r.label} className={`border-b border-[var(--td-line-soft)] ${r.ok === false ? "bg-[var(--td-stop-bg)]" : ""}`}>
                      <td className="px-2 py-2.5 text-[13px]">{r.label}</td>
                      <td className="px-2 py-2.5 text-[12.5px] text-[var(--td-ink-3)]">{r.field}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-right text-[13px] tabular-nums">{r.platform}</td>
                      <td
                        className={`whitespace-nowrap px-2 py-2.5 text-right text-[13px] tabular-nums ${
                          r.ok === false ? "font-semibold text-[var(--td-stop-fg)]" : r.ok === null ? "text-[#c7c7cc]" : ""
                        }`}
                      >
                        {r.hometax ?? "미입력"}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        {r.ok === true && <CheckCircle size={16} weight="fill" className="mx-auto text-[var(--td-done-fg)]" />}
                        {r.ok === false && <XCircle size={16} weight="fill" className="mx-auto text-[var(--td-stop-fg)]" />}
                        {r.ok === null && <CircleDashed size={16} className="mx-auto text-[#c7c7cc]" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
