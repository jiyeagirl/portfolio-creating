"use client";

import { useState } from "react";
import { Desktop, HandPalm, LockKey, PlugsConnected, Plugs, WarningOctagon } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import { Button, ConfirmDialog, KV, PageHeader, Toast } from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { AGENT_HISTORY, AGENT_STATUS, AUTOMATION_DEFAULTS, JOB_SUMMARY } from "@/projects/monitoring/taxdesk/lib/admin-data";
import type { JobMode } from "@/projects/monitoring/taxdesk/lib/status";

const TOGGLE_ON = "bg-[var(--td-blue)]";
const TOGGLE_OFF = "bg-[#d2d2d7]";

export function AutomationScreen({ initialStop, agentDown }: { initialStop: boolean; agentDown: boolean }) {
  const [mode, setMode] = useState<JobMode>(AUTOMATION_DEFAULTS.defaultMode);
  const [rules, setRules] = useState(AUTOMATION_DEFAULTS.rules);
  const [fallback, setFallback] = useState(AUTOMATION_DEFAULTS.fallbackToWait);
  const [stopped, setStopped] = useState(initialStop);
  const [confirmStop, setConfirmStop] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const connected = !agentDown;

  return (
    <div>
      <PageHeader
        title="자동화 설정"
        meta="변경 사항은 다음 작업부터 적용"
        actions={
          <Button variant="primary" onClick={() => setToast("설정을 저장했습니다")}>
            저장
          </Button>
        }
      />

      {stopped && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[12px] bg-[var(--td-stop-bg)] px-4 py-3.5">
          <WarningOctagon size={20} weight="fill" className="shrink-0 text-[var(--td-stop-fg)]" />
          <p className="min-w-0 flex-1 text-[13px] leading-5 text-[var(--td-stop-fg)]">
            <span className="font-semibold">긴급 정지 중 | 10:27 문지후</span> 진행 중 {JOB_SUMMARY.running}건은 현재 단계에서 멈췄고, 새 작업은 시작하지 않습니다.
          </p>
          <Button size="sm" variant="secondary" onClick={() => setStopped(false)}>
            정지 해제
          </Button>
        </div>
      )}
      {!connected && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[12px] bg-[var(--td-act-bg)] px-4 py-3.5">
          <Plugs size={20} className="shrink-0 text-[var(--td-act-fg)]" />
          <p className="min-w-0 flex-1 text-[13px] leading-5 text-[var(--td-act-fg)]">
            <span className="font-semibold">실행 에이전트 연결 끊김 | 10:25:31부터</span> 대기열 작업은 재연결될 때까지 멈춥니다.
          </p>
          <Button size="sm" variant="secondary">
            재연결 요청
          </Button>
        </div>
      )}

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 divide-y divide-[var(--td-line)] border-y border-[var(--td-line)]">
          <section className="py-6">
            <h2 className="text-[15px] font-semibold">기본 모드</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "자동", title: "자동 제출", body: "인증과 제출까지 에이전트가 처리합니다" },
                  { id: "대기", title: "인증 대기", body: "입력과 첨부까지만 하고 담당 세무사가 인증합니다" },
                ] as const
              ).map((o) => {
                const on = mode === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMode(o.id)}
                    className={`flex items-start gap-3 rounded-[12px] border p-4 text-left transition-colors duration-150 ${
                      on ? "border-[var(--td-blue-focus)] bg-[var(--td-blue-tint)]" : "border-[var(--td-line)] hover:bg-[var(--td-pearl)]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                        on ? "border-[var(--td-blue)]" : "border-[#c7c7cc]"
                      }`}
                    >
                      {on && <span className="h-2 w-2 rounded-full bg-[var(--td-blue)]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold">{o.title}</span>
                      <span className="mt-1 block text-[13px] leading-5 text-[var(--td-ink-2)]">{o.body}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="py-6">
            <h2 className="text-[15px] font-semibold">조건 규칙</h2>
            <p className="mt-0.5 text-[13px] text-[var(--td-ink-3)]">기본 모드가 자동 제출이어도 아래 조건이면 인증 대기</p>
            <ul className="mt-3 divide-y divide-[var(--td-line-soft)]">
              {rules.map((r) => (
                <li key={r.id} className="flex items-center gap-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{r.label}</p>
                    <p className="mt-0.5 text-[13px] text-[var(--td-ink-2)]">{r.desc}</p>
                  </div>
                  <span className="hidden whitespace-nowrap text-[12px] text-[var(--td-ink-3)] sm:inline">
                    이번 기간 <span className="tabular-nums">{r.matched}</span>건 해당
                  </span>
                  <Toggle
                    label={r.label}
                    checked={r.on}
                    onChange={(v) => setRules((p) => p.map((x) => (x.id === r.id ? { ...x, on: v } : x)))}
                    onClassName={TOGGLE_ON}
                    offClassName={TOGGLE_OFF}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="flex items-center gap-4 py-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold">실패 시 대기 자동 전환</h2>
              <p className="mt-0.5 text-[13px] text-[var(--td-ink-2)]">인증, 제출 단계에서 실패하면 재시도 없이 인증 대기로 넘깁니다</p>
            </div>
            <Toggle label="실패 시 대기 자동 전환" checked={fallback} onChange={setFallback} onClassName={TOGGLE_ON} offClassName={TOGGLE_OFF} />
          </section>

          <section className="flex flex-wrap items-center gap-4 py-6">
            <div className="min-w-0 flex-1">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold">
                <HandPalm size={18} className="text-[var(--td-stop-fg)]" />
                긴급 정지
              </h2>
              <p className="mt-0.5 text-[13px] text-[var(--td-ink-2)]">진행 중인 작업을 현재 단계에서 멈추고 새 작업을 받지 않습니다</p>
            </div>
            {stopped ? (
              <Button variant="secondary" onClick={() => setStopped(false)}>
                정지 해제
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setConfirmStop(true)}>
                모든 작업 정지
              </Button>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[16px] border border-[var(--td-line)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--td-parch)]">
                  <Desktop size={20} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold">실행 에이전트</p>
                  <p className="text-[12px] text-[var(--td-ink-3)]">버전 {AGENT_STATUS.version}</p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold ${
                  connected ? "text-[var(--td-done-fg)]" : "text-[var(--td-act-fg)]"
                }`}
              >
                {connected ? <PlugsConnected size={16} /> : <Plugs size={16} />}
                {connected ? "연결됨" : "연결 끊김"}
              </span>
            </div>
            <dl className="mt-4 divide-y divide-[var(--td-line-soft)]">
              <KV label="실행 PC" value={AGENT_STATUS.pc} />
              <KV label="마지막 응답" value={<span className="tabular-nums">{connected ? `${AGENT_STATUS.heartbeat} | ${AGENT_STATUS.latency}` : "10:25:31"}</span>} />
              <KV label="동시 실행" value={`${AGENT_STATUS.concurrency}건`} />
              <KV label="인증서" value={`${AGENT_STATUS.cert.owner} | 만료 ${AGENT_STATUS.cert.expires}`} />
            </dl>
            <p className="mt-3 flex items-start gap-2 rounded-[10px] bg-[var(--td-parch)] px-3 py-2.5 text-[12.5px] leading-[18px] text-[var(--td-ink-2)]">
              <LockKey size={15} className="mt-px shrink-0" />
              인증서는 에이전트 PC에만 보관하고 서버에는 저장하지 않습니다
            </p>
          </section>

          <section className="rounded-[16px] border border-[var(--td-line)] p-5">
            <p className="text-[14px] font-semibold">연결 기록</p>
            <ol className="mt-3">
              {(connected
                ? AGENT_HISTORY
                : [{ at: "01.20 10:25:31", kind: "연결 끊김" as const, note: "응답 없음 90초, 대기열 1건 보류" }, ...AGENT_HISTORY]
              ).map((h, i) => (
                <li key={h.at} className="relative flex gap-3 pb-4 last:pb-0">
                  {i > 0 && <span className="absolute left-[4px] top-[-12px] h-3 w-px bg-[var(--td-line)]" />}
                  <span
                    className={`mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full ${
                      h.kind === "재연결" ? "bg-[var(--td-done-fg)]" : "bg-[var(--td-act-fg)]"
                    }`}
                  />
                  <div className="min-w-0 text-[13px] leading-5">
                    <p>
                      <span className="font-semibold">{h.kind}</span>{" "}
                      <span className="tabular-nums text-[12px] text-[var(--td-ink-3)]">{h.at}</span>
                    </p>
                    <p className="text-[12.5px] text-[var(--td-ink-2)]">{h.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmStop}
        title="모든 자동 신고 작업을 멈출까요"
        body={<p>진행 중 {JOB_SUMMARY.running}건은 현재 단계에서 멈추고 대기열 {JOB_SUMMARY.queued}건은 시작하지 않습니다. 해제하면 멈춘 단계부터 이어서 실행합니다.</p>}
        confirmLabel="정지"
        danger
        onClose={() => setConfirmStop(false)}
        onConfirm={() => {
          setStopped(true);
          setConfirmStop(false);
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
