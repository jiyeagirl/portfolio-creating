"use client";

import { useState } from "react";
import { ArrowsClockwise, CheckCircle, FilePdf, Key, ShieldCheck } from "@phosphor-icons/react";
import { ModeBadge, StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import {
  Button,
  Checkbox,
  ConfirmDialog,
  KV,
  PageHeader,
  SidePanel,
  TD,
  TH,
  TH_C,
  TR,
  Toast,
} from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { AGENT_STATUS, FILINGS, JOBS, jobTax, reconcile, type Job } from "@/projects/monitoring/taxdesk/lib/admin-data";
import { JOB_TONE } from "@/projects/monitoring/taxdesk/lib/status";

const ATTACHMENTS = ["신용카드매출전표등 수령명세서", "매출처별 세금계산서 합계표", "매입처별 세금계산서 합계표"];

export function AuthScreen({ initialRow }: { initialRow: string | null }) {
  const waiting = JOBS.filter((j) => j.state === "인증 대기");
  const [jobs, setJobs] = useState<Job[]>(waiting);
  const [selectedId, setSelectedId] = useState(
    initialRow && waiting.some((j) => j.id === initialRow) ? initialRow : waiting[0].id,
  );
  const [panelOpen, setPanelOpen] = useState(Boolean(initialRow));
  const [checked, setChecked] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<null | { ids: string[] }>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pending = jobs.filter((j) => j.state === "인증 대기");
  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];
  const tax = jobTax(selected);
  const recon = reconcile(selected);
  const filing = FILINGS.find((f) => f.id === selected.filingId);

  function authorize(ids: string[]) {
    setJobs((prev) => prev.map((j) => (ids.includes(j.id) ? { ...j, state: "진행 중", step: 6, updatedAt: "10:27:48" } : j)));
    setChecked([]);
    setConfirm(null);
    setToast(`${ids.length}건을 인증하고 제출을 시작했습니다`);
  }

  return (
    <div>
      <PageHeader
        title="인증 대기"
        meta={`인증 직전에 멈춘 작업 | 인증서 ${AGENT_STATUS.cert.owner}, 만료 ${AGENT_STATUS.cert.expires}`}
        actions={
          <Button
            variant="primary"
            icon={<ShieldCheck size={15} />}
            disabled={pending.length === 0}
            onClick={() => setConfirm({ ids: checked.length ? checked : pending.map((j) => j.id) })}
          >
            {checked.length ? `선택 ${checked.length}건 일괄 인증` : "전체 일괄 인증"}
          </Button>
        }
      />

      <div className="mt-6 flex items-start gap-6">
        <section className="min-w-0 flex-1">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--td-line)]">
                  <th className={`${TH} w-10`}>
                    <Checkbox
                      label="전체 선택"
                      checked={pending.length > 0 && pending.every((j) => checked.includes(j.id))}
                      onChange={(v) => setChecked(v ? pending.map((j) => j.id) : [])}
                    />
                  </th>
                  <th className={`${TH} w-[248px]`}>고객</th>
                  <th className={`${TH_C} w-[96px]`}>모드</th>
                  <th className={TH}>멈춘 이유</th>
                  <th className={`${TH} w-[120px]`}>멈춘 시각</th>
                  <th className={`${TH_C} w-[128px]`}>상태</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr
                    key={j.id}
                    onClick={() => {
                      setSelectedId(j.id);
                      setPanelOpen(true);
                    }}
                    className={`${TR} cursor-pointer ${panelOpen && j.id === selected.id ? "bg-[var(--td-blue-tint)]" : "hover:bg-[var(--td-pearl)]"}`}
                  >
                    <td className={TD}>
                      {j.state === "인증 대기" && (
                        <Checkbox
                          label={`${j.business} 선택`}
                          checked={checked.includes(j.id)}
                          onChange={(v) => setChecked((p) => (v ? [...p, j.id] : p.filter((x) => x !== j.id)))}
                        />
                      )}
                    </td>
                    <td className={`${TD} w-[248px] max-w-[248px]`}>
                      <p className="truncate whitespace-nowrap font-semibold">{j.business}</p>
                      <p className="mt-0.5 truncate whitespace-nowrap text-[12px] text-[var(--td-ink-3)]">
                        <span className="td-mono">{j.id}</span> | 납부할 세액 {jobTax(j).payable.toLocaleString("ko-KR")}원
                      </p>
                    </td>
                    <td className={`${TD} text-center`}>
                      <ModeBadge compact mode={j.mode} />
                    </td>
                    <td className={TD}>
                      {j.converted ? (
                        <span className="flex flex-col">
                          <span className="font-semibold text-[var(--td-act-fg)]">자동 제출 실패 후 전환</span>
                          <span className="text-[12px] text-[var(--td-ink-3)]">{j.failReason}, 서명 응답 시간 초과</span>
                        </span>
                      ) : (
                        <span className="flex flex-col">
                          <span>조건 규칙: {j.waitReason}</span>
                          <span className="text-[12px] text-[var(--td-ink-3)]">대기 모드로 시작</span>
                        </span>
                      )}
                    </td>
                    <td className={`${TD} whitespace-nowrap tabular-nums text-[var(--td-ink-2)]`}>{j.updatedAt.slice(0, 5)}</td>
                    <td className={`${TD} text-center`}>
                      <StatusChip compact tone={JOB_TONE[j.state]}>
                        {j.state === "진행 중" ? "제출 중" : j.state}
                      </StatusChip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-[12px] bg-[var(--td-parch)] px-4 py-3.5 text-[13px] leading-5">
            <Key size={18} className="mt-0.5 shrink-0 text-[var(--td-ink-2)]" />
            <div>
              <p className="font-semibold">인증은 사무소 PC 에이전트에서 서명합니다</p>
              <p className="mt-0.5 text-[var(--td-ink-2)]">
                {AGENT_STATUS.pc} | {AGENT_STATUS.cert.issuer} 공동인증서 | 인증서 파일은 이 PC 밖으로 전송하지 않음
              </p>
            </div>
          </div>
        </section>

        <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} label="제출 내용 미리보기">
          <div className="border-b border-[var(--td-line)] px-5 py-5 pr-12">
            <p className="text-[12px] font-semibold text-[var(--td-ink-3)]">제출 내용 미리보기</p>
            <p className="mt-1 truncate text-[17px] font-semibold leading-6">{selected.business}</p>
            <p className="mt-0.5 text-[12.5px] text-[var(--td-ink-3)]">
              {filing?.owner} | <span className="td-mono">{selected.bizNo}</span> | 2025년 2기 확정
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="rounded-[12px] border border-[var(--td-line)] px-4 py-3">
              <p className="text-[12px] text-[var(--td-ink-3)]">납부할 세액 (원)</p>
              <p className="mt-1 text-[24px] font-semibold leading-8 tabular-nums">{tax.payable.toLocaleString("ko-KR")}</p>
            </div>
            <dl className="mt-3 divide-y divide-[var(--td-line-soft)]">
              <KV label="과세 매출 (원)" value={<span className="tabular-nums">{selected.amounts.sales.toLocaleString("ko-KR")}</span>} />
              <KV label="매출세액 (원)" value={<span className="tabular-nums">{tax.salesTax.toLocaleString("ko-KR")}</span>} />
              <KV label="매입세액 (원)" value={<span className="tabular-nums">{selected.amounts.purchaseTax.toLocaleString("ko-KR")}</span>} />
              <KV label="경감공제 (원)" value={<span className="tabular-nums">{selected.amounts.credit.toLocaleString("ko-KR")}</span>} />
            </dl>

            <p className="mt-5 text-[13px] font-semibold">첨부 서류</p>
            <ul className="mt-2 space-y-1.5">
              {ATTACHMENTS.map((a) => (
                <li key={a} className="flex items-center gap-2 text-[13px]">
                  <FilePdf size={16} className="shrink-0 text-[var(--td-ink-3)]" />
                  <span className="truncate">{a}</span>
                  <CheckCircle size={14} weight="fill" className="ml-auto shrink-0 text-[var(--td-done-fg)]" />
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center justify-between text-[13px]">
              <span className="font-semibold">입력값 대조</span>
              <span className="tabular-nums text-[var(--td-done-fg)]">
                {recon.filter((r) => r.ok).length}/{recon.length} 일치
              </span>
            </p>
            {selected.converted && (
              <p className="mt-4 flex items-center gap-2 rounded-[10px] bg-[var(--td-act-bg)] px-3.5 py-2.5 text-[12.5px] text-[var(--td-act-fg)]">
                <ArrowsClockwise size={15} className="shrink-0" />
                자동 제출 중 인증 실패, 09:06에 인증 대기로 전환
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--td-line)] px-5 py-3">
            <Button variant="ghost">신고서 원본 보기</Button>
            <Button
              variant="primary"
              className="ml-auto"
              icon={<ShieldCheck size={15} />}
              disabled={selected.state !== "인증 대기"}
              onClick={() => setConfirm({ ids: [selected.id] })}
            >
              인증 후 제출
            </Button>
          </div>
        </SidePanel>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={`${confirm?.ids.length ?? 0}건을 인증하고 제출할까요`}
        body={
          <p>
            {AGENT_STATUS.cert.owner} 공동인증서로 서명한 뒤 바로 홈택스에 제출합니다. 제출 후에는 접수번호 수신까지 자동으로 진행합니다.
          </p>
        }
        confirmLabel="인증 후 제출"
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && authorize(confirm.ids)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
