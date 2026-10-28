"use client";

import { useMemo, useState } from "react";
import {
  ArrowClockwise,
  ArrowRight,
  ArrowsLeftRight,
  CheckCircle,
  Circle,
  DownloadSimple,
  FileText,
  SealWarning,
  WarningCircle,
} from "@phosphor-icons/react";
import { ModeBadge, StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { PoaDocument } from "@/projects/monitoring/taxdesk/components/poa-document";
import {
  Button,
  Checkbox,
  ConfirmDialog,
  KV,
  MetricStrip,
  PageHeader,
  Pagination,
  Select,
  SidePanel,
  TD,
  TH,
  TH_C,
  TR,
  Tabs,
  Toast,
} from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { inQueue, queueCount, type AdminScreen, type ReviewQueue } from "@/projects/monitoring/taxdesk/components/admin/admin-nav";
import {
  ADMIN_NOW,
  FILINGS,
  POA_FILING_ID,
  RAG_EVIDENCE,
  evidenceFor,
  type AdminEvidence,
  type Filing,
} from "@/projects/monitoring/taxdesk/lib/admin-data";
import { EVIDENCE_SLOTS, OCR_FIELDS } from "@/projects/monitoring/taxdesk/lib/mock-data";
import { EVIDENCE_TONE, FILING_TONE, PAYMENT_TONE, type FilingStage } from "@/projects/monitoring/taxdesk/lib/status";

type PanelTab = "customer" | "poa" | "evidence" | "rag";
const PANEL_TABS: { id: PanelTab; label: string }[] = [
  { id: "customer", label: "고객 정보" },
  { id: "poa", label: "위임장" },
  { id: "evidence", label: "증빙" },
  { id: "rag", label: "근거" },
];

const PAGE_SIZE = 10;
const REVIEWABLE: FilingStage[] = ["접수", "검토 중", "보완 요청"];

export function ReviewScreen({
  queue,
  initialTab,
  initialRow,
  initialBulk,
  onNavigate,
}: {
  queue: ReviewQueue;
  initialTab: string | null;
  initialRow: string | null;
  initialBulk: boolean;
  onNavigate: (s: AdminScreen) => void;
}) {
  const startTab: PanelTab = PANEL_TABS.some((t) => t.id === initialTab) ? (initialTab as PanelTab) : "customer";
  const startRow =
    initialRow && FILINGS.some((f) => f.id === initialRow) ? initialRow : startTab === "poa" ? POA_FILING_ID : "TD-26-0131";

  const [filings, setFilings] = useState<Filing[]>(FILINGS);
  const [stageFilter, setStageFilter] = useState("단계 전체");
  const [payFilter, setPayFilter] = useState("결제 전체");
  // 처음 연 행이 보이는 페이지에서 시작한다
  const [page, setPage] = useState(
    () =>
      Math.floor(Math.max(0, FILINGS.filter((x) => inQueue(x, queue)).findIndex((x) => x.id === startRow)) / PAGE_SIZE) + 1,
  );
  const [selectedId, setSelectedId] = useState(startRow);
  const [panelOpen, setPanelOpen] = useState(Boolean(initialRow || initialTab));
  const [tab, setTab] = useState<PanelTab>(startTab);
  const [checked, setChecked] = useState<string[]>(initialBulk ? ["TD-26-0160", "TD-26-0157"] : []);
  const [bulkStage, setBulkStage] = useState("검토 중으로 변경");
  const [confirm, setConfirm] = useState<null | "approve" | "reject">(null);
  const [supplementOpen, setSupplementOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      filings.filter(
        (f) =>
          inQueue(f, queue) &&
          (stageFilter === "단계 전체" || f.stage === stageFilter) &&
          (payFilter === "결제 전체" || f.payment === payFilter),
      ),
    [filings, queue, stageFilter, payFilter],
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const selected = filings.find((f) => f.id === selectedId) ?? filings[0];

  const allChecked = pageRows.length > 0 && pageRows.every((r) => checked.includes(r.id));

  function setStage(ids: string[], stage: FilingStage) {
    setFilings((prev) => prev.map((f) => (ids.includes(f.id) ? { ...f, stage } : f)));
  }

  const waitMode = selected.flags.includes("신규 고객") || selected.flags.includes("보완 이력");

  return (
    <div>
      <PageHeader
        title="신고 검토"
        meta={`2025년 2기 확정신고 | 신고 기한 ${ADMIN_NOW.deadline} D-${ADMIN_NOW.dday}`}
        actions={
          <Button icon={<DownloadSimple size={15} />} variant="secondary">
            내보내기
          </Button>
        }
      />

      <div className="mt-5">
        <MetricStrip
          items={[
            { label: "오늘 접수 (건)", value: filings.filter((f) => f.receivedAt.startsWith("01.20")).length },
            { label: "검토 대기 (건)", value: queueCount("검토 대기") },
            { label: "보완 요청 중 (건)", value: queueCount("보완 요청 중"), tone: "act" },
            { label: "입금 대기 (건)", value: queueCount("입금 대기") },
            { label: "기한 임박 (건)", value: queueCount("기한 임박"), tone: "stop", sub: `미확정, D-${ADMIN_NOW.dday}` },
          ]}
        />
      </div>

      <div className="mt-6 flex items-start gap-6">
        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[15px] font-semibold">
              {queue} <span className="tabular-nums font-normal text-[var(--td-ink-3)]">{rows.length}</span>
            </h2>
            <Select
              label="단계"
              value={stageFilter}
              onChange={(v) => {
                setStageFilter(v);
                setPage(1);
              }}
              options={["단계 전체", "접수", "검토 중", "보완 요청", "신고서 확정", "제출 중", "접수 완료", "반려"]}
            />
            <Select
              label="결제"
              value={payFilter}
              onChange={(v) => {
                setPayFilter(v);
                setPage(1);
              }}
              options={["결제 전체", "결제 완료", "입금 대기", "기한 임박", "환불"]}
            />
          </div>

          {checked.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[10px] bg-[var(--td-ink)] px-4 py-2 text-white">
              <span className="text-[13px] font-semibold tabular-nums">{checked.length}건 선택</span>
              <span className="mx-1 h-4 w-px bg-white/20" />
              <label className="relative">
                <span className="sr-only">일괄 단계 변경</span>
                <select
                  value={bulkStage}
                  onChange={(e) => setBulkStage(e.target.value)}
                  className="h-8 appearance-none rounded-[8px] bg-white/10 pl-3 pr-7 text-[13px] text-white"
                >
                  <option className="text-black">검토 중으로 변경</option>
                  <option className="text-black">보완 요청으로 변경</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  setStage(checked, bulkStage.startsWith("검토") ? "검토 중" : "보완 요청");
                  setToast(`${checked.length}건의 단계를 바꿨습니다`);
                  setChecked([]);
                }}
                className="h-8 rounded-[8px] bg-white px-3 text-[13px] font-semibold text-[var(--td-ink)] hover:bg-[var(--td-parch)]"
              >
                적용
              </button>
              <button type="button" onClick={() => setChecked([])} className="ml-auto text-[13px] text-[#a1a1a6] hover:text-white">
                선택 해제
              </button>
            </div>
          )}

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--td-line)]">
                  <th className={`${TH} w-10`}>
                    <Checkbox
                      label="현재 페이지 전체 선택"
                      checked={allChecked}
                      onChange={(v) => setChecked(v ? pageRows.map((r) => r.id) : [])}
                    />
                  </th>
                  <th className={TH}>고객</th>
                  <th className={`${TH_C} w-[120px]`}>단계</th>
                  <th className={`${TH_C} w-[120px]`}>결제</th>
                  <th className={`${TH_C} w-[136px]`}>접수</th>
                  <th className={`${TH} w-[104px]`}>담당</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((f) => {
                  const active = panelOpen && f.id === selected.id;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => {
                        setSelectedId(f.id);
                        setPanelOpen(true);
                      }}
                      className={`${TR} cursor-pointer ${active ? "bg-[var(--td-blue-tint)]" : "hover:bg-[var(--td-pearl)]"}`}
                    >
                      <td className={TD}>
                        <Checkbox
                          label={`${f.business} 선택`}
                          checked={checked.includes(f.id)}
                          onChange={(v) => setChecked((p) => (v ? [...p, f.id] : p.filter((x) => x !== f.id)))}
                        />
                      </td>
                      <td className={`${TD} max-w-0`}>
                        <p className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-semibold">{f.business}</span>
                          {f.flags.includes("신규 고객") && (
                            <span className="shrink-0 text-[11.5px] text-[var(--td-blue)]">신규</span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-[var(--td-ink-3)]">
                          <span className="td-mono">{f.id}</span> | {f.owner} | {f.industry}
                        </p>
                      </td>
                      <td className={`${TD} text-center`}>
                        <StatusChip compact tone={FILING_TONE[f.stage]}>
                          {f.stage === "신고서 확정" ? "확정" : f.stage}
                        </StatusChip>
                      </td>
                      <td className={`${TD} text-center`}>
                        <StatusChip compact tone={PAYMENT_TONE[f.payment]}>
                          {f.payment}
                        </StatusChip>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-center tabular-nums text-[var(--td-ink-2)]`}>{f.receivedAt}</td>
                      <td className={`${TD} whitespace-nowrap ${f.assignee === "미배정" ? "text-[var(--td-act-fg)]" : "text-[var(--td-ink-2)]"}`}>
                        {f.assignee}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="py-14 text-center text-[13px] text-[var(--td-ink-3)]">조건에 맞는 접수 건이 없습니다</p>
            )}
          </div>
          <Pagination
            from={rows.length ? (current - 1) * PAGE_SIZE + 1 : 0}
            to={Math.min(current * PAGE_SIZE, rows.length)}
            total={rows.length}
            page={current}
            pages={pages}
            onPage={setPage}
          />
        </section>

        <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} label="접수 건 상세">
          <div className="border-b border-[var(--td-line)] px-5 pb-0 pt-5">
            <div className="flex items-start justify-between gap-3 pr-8">
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold leading-6">{selected.business}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--td-ink-3)]">
                  <span className="td-mono">{selected.id}</span> | 접수 {selected.receivedAt}
                </p>
              </div>
              <StatusChip compact tone={FILING_TONE[selected.stage]}>
                {selected.stage === "신고서 확정" ? "확정" : selected.stage}
              </StatusChip>
            </div>
            <div className="mt-4">
              <Tabs items={PANEL_TABS} value={tab} onChange={setTab} size="sm" />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-4">
            {tab === "customer" && <CustomerTab f={selected} />}
            {tab === "poa" && <PoaTab f={selected} onToast={setToast} />}
            {tab === "evidence" && <EvidenceTab f={selected} />}
            {tab === "rag" && <RagTab />}

            {supplementOpen && REVIEWABLE.includes(selected.stage) && (
              <div className="mt-5 rounded-[12px] border border-[var(--td-line)] p-4">
                <p className="text-[13px] font-semibold">보완 요청 내용</p>
                <textarea
                  defaultValue="11~12월 배달앱B 정산서와 중개수수료 세금계산서를 올려 주세요."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-[8px] border border-[var(--td-line)] p-3 text-[13px] leading-5 focus:outline-2 focus:outline-[var(--td-blue-focus)]"
                />
                <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--td-ink-3)]">
                  <span>보완 기한 01.22 (목) | 알림톡 발송</span>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => {
                      setStage([selected.id], "보완 요청");
                      setSupplementOpen(false);
                      setToast("보완 요청을 보냈습니다");
                    }}
                  >
                    요청 보내기
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--td-line)] px-5 py-3">
            {REVIEWABLE.includes(selected.stage) ? (
              <div className="flex items-center gap-2">
                <Button variant="danger" onClick={() => setConfirm("reject")}>
                  반려
                </Button>
                <Button variant="secondary" onClick={() => setSupplementOpen((v) => !v)}>
                  보완 요청
                </Button>
                <Button variant="primary" className="ml-auto" onClick={() => setConfirm("approve")}>
                  신고 내용 확정
                </Button>
              </div>
            ) : selected.jobId ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-[var(--td-ink-2)]">
                  자동 신고 <span className="td-mono">{selected.jobId}</span>
                </p>
                <Button variant="secondary" icon={<ArrowRight size={14} />} onClick={() => onNavigate("jobs")}>
                  작업 보기
                </Button>
              </div>
            ) : (
              <p className="text-[13px] text-[var(--td-ink-3)]">{selected.memo ?? "처리가 끝난 건입니다"}</p>
            )}
          </div>
        </SidePanel>
      </div>

      <ConfirmDialog
        open={confirm === "approve"}
        title="신고 내용을 확정할까요"
        body={
          <div className="space-y-3">
            <p>{selected.business} 신고서를 확정하고 자동 신고 작업에 등록합니다.</p>
            <p className="flex items-center gap-2 rounded-[8px] bg-[var(--td-parch)] px-3 py-2 text-[13px]">
              실행 모드 <ModeBadge compact mode={waitMode ? "대기" : "자동"} />
              <span className="text-[var(--td-ink-3)]">{waitMode ? selected.flags.join(", ") + " 규칙" : "기본 모드"}</span>
            </p>
          </div>
        }
        confirmLabel="확정"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          setStage([selected.id], "신고서 확정");
          setConfirm(null);
          setToast("자동 신고 작업에 등록했습니다");
        }}
      />
      <ConfirmDialog
        open={confirm === "reject"}
        title="이 접수 건을 반려할까요"
        body={<p>{selected.business} 건을 반려하고 결제 금액 전액을 환불합니다. 고객에게 알림톡이 발송됩니다.</p>}
        confirmLabel="반려"
        danger
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          setStage([selected.id], "반려");
          setConfirm(null);
          setToast("반려하고 환불을 요청했습니다");
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function CustomerTab({ f }: { f: Filing }) {
  return (
    <div className="space-y-5">
      <dl className="divide-y divide-[var(--td-line-soft)]">
        <KV label="상호" value={f.business} />
        <KV label="사업자등록번호" value={f.bizNo} mono />
        <KV label="대표자" value={f.owner} />
        <KV label="개업일" value={<span className="tabular-nums">{f.openedAt}</span>} />
        <KV label="과세유형" value={f.taxType} />
        <KV label="업종" value={f.industry} />
        <KV label="판매 채널" value={f.channels} />
        <KV label="직원" value={f.staffCount} />
        <KV label="연락처" value={<span className="tabular-nums">{f.phone}</span>} />
        <KV label="이메일" value={f.email} />
      </dl>

      <div>
        <p className="text-[13px] font-semibold">수임동의</p>
        <ol className="mt-2 space-y-2">
          {f.consent.map((c) => (
            <li key={c.label} className="flex items-center gap-2.5 text-[13px]">
              {c.done ? (
                <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--td-done-fg)]" />
              ) : (
                <Circle size={16} className="shrink-0 text-[var(--td-ink-3)]" />
              )}
              <span className={c.done ? "" : "text-[var(--td-ink-3)]"}>{c.label}</span>
              <span className="ml-auto tabular-nums text-[12px] text-[var(--td-ink-3)]">{c.at}</span>
            </li>
          ))}
        </ol>
      </div>

      {f.memo && (
        <div className="rounded-[10px] bg-[var(--td-parch)] px-3.5 py-3 text-[13px] leading-5">
          <p className="text-[12px] font-semibold text-[var(--td-ink-3)]">검토 메모</p>
          <p className="mt-1">{f.memo}</p>
        </div>
      )}
    </div>
  );
}

function PoaTab({ f, onToast }: { f: Filing; onToast: (m: string) => void }) {
  const hasPreview = f.id === POA_FILING_ID;
  const checks = [
    { label: "도장 위치", value: "성명 칸 우측, 겹침 정상" },
    { label: "배경 제거", value: "투명 처리 완료 (원본 도장_류정민.png)" },
    { label: "입력값 합성", value: "위임인 5칸, 수임인 4칸 일치" },
    { label: "생성", value: "01.08 14:40 | v2" },
  ];
  return (
    <div>
      {hasPreview ? (
        <div className="rounded-[12px] bg-[var(--td-parch)] px-6 py-5">
          <PoaDocument signMode="stamp" fontSize={8.5} showLegend />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[12px] border border-[var(--td-line)] px-4 py-3.5">
          <FileText size={22} className="shrink-0 text-[var(--td-ink-3)]" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">위임장_{f.business}.pdf</p>
            <p className="text-[12px] text-[var(--td-ink-3)]">1쪽 | 서명 {f.consent[0].at}</p>
          </div>
        </div>
      )}
      {hasPreview && (
        <dl className="mt-4 divide-y divide-[var(--td-line-soft)]">
          {checks.map((c) => (
            <KV key={c.label} label={c.label} value={c.value} />
          ))}
        </dl>
      )}
      <div className="mt-4 flex gap-2">
        <Button size="sm" icon={<DownloadSimple size={14} />}>
          PDF 다운로드
        </Button>
        <Button size="sm" variant="ghost" icon={<ArrowClockwise size={14} />} onClick={() => onToast("위임장을 다시 생성했습니다")}>
          재생성
        </Button>
      </div>
    </div>
  );
}

/* 영수증 증빙. 원본은 비스듬히 찍힌 촬영본, 처리본은 회전 보정과 여백 자르기 후 */
function Receipt({ tilted }: { tilted?: boolean }) {
  return (
    <div className={`flex h-[168px] items-center justify-center overflow-hidden rounded-[8px] ${tilted ? "bg-[#8d8a84]" : "bg-[var(--td-parch)]"}`}>
      <div
        className={`w-[104px] bg-white px-2.5 py-3 text-[6.5px] leading-[1.5] text-[#333] ${tilted ? "rotate-[17deg] translate-y-3 brightness-90" : ""}`}
      >
        <p className="text-center text-[7.5px] font-bold">현금영수증</p>
        <p className="mt-1">I포장산업</p>
        <p>318-2?-60415</p>
        <p className="mt-1 border-t border-dashed border-[#bbb] pt-1">2025.11.18 15:42</p>
        <p className="flex justify-between">
          <span>크라프트 박스</span>
          <span>220,000</span>
        </p>
        <p className="flex justify-between">
          <span>OPP 봉투</span>
          <span>66,000</span>
        </p>
        <p className="mt-1 flex justify-between border-t border-dashed border-[#bbb] pt-1 font-bold">
          <span>합계</span>
          <span>314,600</span>
        </p>
      </div>
    </div>
  );
}

function EvidenceTab({ f }: { f: Filing }) {
  const list: AdminEvidence[] =
    f.id === POA_FILING_ID
      ? EVIDENCE_SLOTS.map((s) => ({ group: s.group, title: s.title, file: s.files[0]?.name ?? "", state: s.state }))
      : evidenceFor(f);
  const errorIdx = list.findIndex((e) => e.state === "읽기 오류");
  const [open, setOpen] = useState(errorIdx >= 0 ? errorIdx : 0);
  const item = list[open];

  return (
    <div>
      <ul className="divide-y divide-[var(--td-line-soft)]">
        {list.map((e, i) => (
          <li key={e.title}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`flex w-full items-center gap-3 rounded-[8px] px-2 py-2.5 text-left ${i === open ? "bg-[var(--td-pearl)]" : "hover:bg-[var(--td-pearl)]"}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{e.title}</p>
                <p className="truncate text-[12px] text-[var(--td-ink-3)]">{e.file || "파일 없음"}</p>
              </div>
              <StatusChip compact tone={EVIDENCE_TONE[e.state]}>
                {e.state}
              </StatusChip>
            </button>
          </li>
        ))}
      </ul>

      {item.state === "읽기 오류" && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold">
            <ArrowsLeftRight size={15} />
            원본과 처리본
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <Receipt tilted />
              <p className="mt-1.5 text-[12px] text-[var(--td-ink-3)]">원본 | 3.8MB, 17도 기울어짐</p>
            </div>
            <div>
              <Receipt />
              <p className="mt-1.5 text-[12px] text-[var(--td-ink-3)]">처리본 | 412KB PDF</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] font-semibold">OCR 인식값</p>
          <table className="mt-1 w-full">
            <tbody>
              {OCR_FIELDS.map((o) => {
                const low = o.confidence < 60;
                return (
                  <tr key={o.label} className="border-b border-[var(--td-line-soft)]">
                    <td className="py-2 text-[12.5px] text-[var(--td-ink-3)]">{o.label}</td>
                    <td className={`py-2 text-right text-[13px] tabular-nums ${low ? "font-semibold text-[var(--td-stop-fg)]" : ""}`}>
                      {o.value}
                    </td>
                    <td className="w-[56px] py-2 text-right text-[12px] tabular-nums text-[var(--td-ink-3)]">{o.confidence}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[var(--td-stop-fg)]">
            <WarningCircle size={14} weight="fill" />
            사업자번호 3번째 자리 인식 불가, 고객 재촬영 또는 직접 수정
          </p>
        </div>
      )}
      {item.state === "보완 요청" && item.note && (
        <p className="mt-4 rounded-[10px] bg-[var(--td-act-bg)] px-3.5 py-3 text-[13px] text-[var(--td-act-fg)]">{item.note}</p>
      )}
    </div>
  );
}

function RagTab() {
  return (
    <div className="space-y-4">
      {RAG_EVIDENCE.map((r) => (
        <div key={r.query} className="rounded-[12px] border border-[var(--td-line)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--td-line-soft)] px-3.5 py-2.5">
            <p className="truncate text-[13px] font-semibold">{r.query}</p>
            {r.review && (
              <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--td-act-fg)]">
                <SealWarning size={14} weight="fill" />
                세무사 확인 필요
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 divide-x divide-[var(--td-line-soft)]">
            <div className="px-3.5 py-3">
              <p className="text-[11.5px] font-semibold text-[var(--td-ink-3)]">근거 문서</p>
              <p className="mt-1 text-[12.5px] leading-[18px]">{r.excerpt}</p>
              <p className="mt-2 text-[11.5px] text-[var(--td-ink-3)]">
                {r.doc} | {r.date} | 유사도 <span className="tabular-nums">{r.score.toFixed(2)}</span>
              </p>
            </div>
            <div className="bg-[var(--td-pearl)] px-3.5 py-3">
              <p className="text-[11.5px] font-semibold text-[var(--td-ink-3)]">고객 자료</p>
              <p className="mt-1 text-[12.5px] leading-[18px]">{r.customer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
