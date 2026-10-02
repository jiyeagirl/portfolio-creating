"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Cell,
  CenterTag,
  Code,
  Drawer,
  I,
  KeyValue,
  Meter,
  PageHead,
  Pagination,
  Panel,
  Photo,
  Row,
  SearchInput,
  Table,
  toneColor,
} from "@/projects/b2b/logisync/components/ui";
import { CENTER_BY_ID, FAILURE_LOGS, VERIFY_COUNTS, VERIFY_RECORDS } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { Tone, VerifyRecord, VerifyStatus } from "@/projects/b2b/logisync/lib/types";

const STATUS_TONE: Record<VerifyStatus, Tone> = { 정상: "ok", 중복: "neutral", 누락: "warn", 오류: "danger" };
const RETRY_TONE: Record<VerifyRecord["retry"], Tone> = {
  "재처리 대기": "info",
  "재처리 완료": "ok",
  "재처리 실패": "danger",
  폐기: "neutral",
  "해당 없음": "neutral",
};

const STATUS_DESC: Record<VerifyStatus, string> = {
  정상: "검증 통과, 표준화 단계로 전달",
  중복: "동일 식별키 재수신, 자동 폐기",
  누락: "필수 필드 공백, 재수집 필요",
  오류: "형식, 값 범위, 수집 실패",
};

type Filter = "all" | VerifyStatus;

export function VerifyScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(VERIFY_RECORDS);
  const [checked, setChecked] = useState<string[]>([]);
  const [open, setOpen] = useState<VerifyRecord | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter(
      (r) => (filter === "all" || r.status === filter) && (!q || `${r.id} ${r.key} ${r.reason}`.toLowerCase().includes(q)),
    );
  }, [records, filter, query]);

  const allChecked = rows.length > 0 && rows.every((r) => checked.includes(r.id));
  const waiting = records.filter((r) => r.retry === "재처리 대기").length;

  const reprocess = () => {
    // 정상 레코드는 재처리 대상이 아니므로 선택돼 있어도 그대로 둔다
    setRecords((rs) =>
      rs.map((r) => (checked.includes(r.id) && r.status !== "정상" ? { ...r, retry: "재처리 완료", attempts: r.attempts + 1 } : r)),
    );
    setChecked([]);
  };

  const total = Object.values(VERIFY_COUNTS).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <PageHead
        code="02 검증"
        title="데이터 정합성 및 중복 관리"
        desc="식별키로 중복을 걸러내고, 누락과 오류는 격리한 뒤 재처리합니다. 통과한 레코드만 표준화 단계로 넘어갑니다."
        actions={
          <>
            <Button variant="outline" icon="solar:key-minimalistic-linear">
              식별키 규칙
            </Button>
            <Button variant="primary" icon="solar:restart-linear" onClick={reprocess} disabled={checked.length === 0}>
              {checked.length > 0 ? `선택 ${checked.length}건 재처리` : "재처리 실행"}
            </Button>
          </>
        }
      />

      {/* 상태 스코어보드가 곧 필터다 */}
      <div role="tablist" aria-label="검증 상태" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(Object.keys(VERIFY_COUNTS) as VerifyStatus[]).map((s) => {
          const on = filter === s;
          const tone = STATUS_TONE[s];
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(on ? "all" : s)}
              className={`ls-swap relative overflow-hidden rounded-2xl p-5 text-left shadow-[var(--ls-shadow)] ${on ? "ls-dark bg-[var(--ls-canvas)]" : "bg-[var(--ls-surface)] hover:bg-[var(--ls-canvas)]"}`}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: on ? toneColor(tone, "base") : "transparent" }} />
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Badge tone={tone}>{s}</Badge>
                  <span className="text-[12px] text-[var(--ls-muted)]">(건)</span>
                </span>
                <span className="ls-num text-[12px] text-[var(--ls-muted)]">{((VERIFY_COUNTS[s] / total) * 100).toFixed(2)}%</span>
              </span>
              <span className="ls-figure mt-4 block text-[30px] leading-9 text-[var(--ls-ink)]">{fmt(VERIFY_COUNTS[s])}</span>
              <span className="mt-2 block text-[12px] leading-[18px] text-[var(--ls-body)]">{STATUS_DESC[s]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel flush>
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-bold text-[var(--ls-ink)]">
                검증 결과 {filter === "all" ? "전체" : filter}
                <span className="ls-num ml-2 font-medium text-[var(--ls-muted)]">{rows.length}건 표시</span>
              </h2>
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="검증 ID, 식별키, 사유" className="sm:w-[300px]" />
          </div>

          <Table head={["", "검증 ID", "식별키 / 센터", "사유", "재처리", "상태"]} minWidth={940}>
            <tr className="border-b border-[var(--ls-hairline-soft)]">
              <td className="px-6 py-2">
                <input
                  type="checkbox"
                  aria-label="표시된 항목 전체 선택"
                  checked={allChecked}
                  onChange={() => setChecked(allChecked ? [] : rows.map((r) => r.id))}
                  className="h-4 w-4 accent-[var(--ls-primary)]"
                />
              </td>
              <td colSpan={5} className="py-2 pr-6 text-[12px] text-[var(--ls-muted)]">
                전체 선택 | 선택 {checked.length}건 | 재처리 대기 {waiting}건
              </td>
            </tr>
            {rows.map((r) => {
              const on = checked.includes(r.id);
              return (
                <Row key={r.id} onClick={() => setOpen(r)} selected={on}>
                  <Cell first selected={on} className="w-12">
                    <input
                      type="checkbox"
                      aria-label={`${r.id} 선택`}
                      checked={on}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => setChecked((c) => (on ? c.filter((x) => x !== r.id) : [...c, r.id]))}
                      className="h-4 w-4 accent-[var(--ls-primary)]"
                    />
                  </Cell>
                  <Cell>
                    <p className="ls-code whitespace-nowrap text-[12px] text-[var(--ls-ink)]">{r.id}</p>
                    <p className="ls-num mt-0.5 text-[12px] text-[var(--ls-muted)]">{r.collectedAt}</p>
                  </Cell>
                  <Cell>
                    <p className="ls-code max-w-[300px] truncate text-[11px] text-[var(--ls-body-strong)]" title={r.key}>
                      {r.key}
                    </p>
                    <p className="mt-1 text-[12px]">
                      <CenterTag id={r.centerId} />
                      <span className="ml-2 text-[var(--ls-muted)]">{r.domain}</span>
                    </p>
                  </Cell>
                  <Cell>
                    <p className="max-w-[260px] text-[var(--ls-body-strong)]">{r.reason}</p>
                    {r.field && <Code className="mt-1 text-[10px]">{r.field}</Code>}
                  </Cell>
                  <Cell>
                    <Badge tone={RETRY_TONE[r.retry]} dot={false}>
                      {r.retry}
                    </Badge>
                    {r.attempts > 0 && <p className="ls-num mt-1 text-[11px] text-[var(--ls-muted)]">시도 {r.attempts}회</p>}
                  </Cell>
                  <Cell>
                    <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                  </Cell>
                </Row>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-[13px] text-[var(--ls-muted)]">
                  조건에 맞는 검증 결과가 없습니다.
                </td>
              </tr>
            )}
          </Table>
          <Pagination total={filter === "all" ? total : VERIFY_COUNTS[filter]} pageSize={12} label="검증 결과" />
        </Panel>

        <div className="space-y-6">
          <Panel title="식별키 구성">
            <div className="flex flex-wrap gap-1">
              {["센터", "유형", "일자", "문서번호", "라인"].map((k, i) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="rounded-full bg-[var(--ls-elevated)] px-2.5 py-1 text-[12px] text-[var(--ls-ink)]">{k}</span>
                  {i < 4 && <span className="ls-code text-[var(--ls-disabled)]">|</span>}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-[18px] text-[var(--ls-body)]">
              같은 키가 24시간 안에 다시 들어오면 수량이 같을 때 폐기, 다를 때 오류로 격리합니다.
            </p>
            <div className="mt-5 space-y-3">
              {[
                ["오늘 중복 제거율", 0.4, "516건"],
                ["재처리 성공률", 91.8, "112 / 122건"],
              ].map(([l, v, sub]) => (
                <div key={l as string}>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className="text-[var(--ls-body)]">{l}</span>
                    <span className="ls-num text-[var(--ls-ink)]">
                      {v}% <span className="text-[var(--ls-muted)]">{sub}</span>
                    </span>
                  </div>
                  <Meter value={v as number} tone="ink" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="수집 실패 이력" flush>
            <ul>
              {FAILURE_LOGS.map((f) => (
                <li key={f.id} className="border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <I
                        icon={f.resolved ? "solar:check-circle-linear" : "solar:close-circle-linear"}
                        size={15}
                        className={f.resolved ? "text-[var(--ls-ok-fg)]" : "text-[var(--ls-danger-fg)]"}
                      />
                      <Code className="text-[10px]">{f.code}</Code>
                    </span>
                    <span className="ls-num text-[11px] text-[var(--ls-muted)]">
                      {f.centerId} | {f.at}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-[18px] text-[var(--ls-body-strong)]">{f.message}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <RecordDrawer record={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function RecordDrawer({ record, onClose }: { record: VerifyRecord | null; onClose: () => void }) {
  const c = record ? CENTER_BY_ID[record.centerId] : null;
  return (
    <Drawer
      open={!!record}
      onClose={onClose}
      eyebrow="검증 레코드"
      title={record ? `${record.id} ${record.status}` : ""}
      footer={
        record && (record.retry === "재처리 대기" || record.retry === "재처리 실패") ? (
          <>
            <Button variant="primary" icon="solar:restart-linear" onClick={onClose}>
              이 건 재처리
            </Button>
            <Button variant="ghost" onClick={onClose}>
              폐기로 전환
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        )
      }
    >
      {record && c && (
        <div className="space-y-6">
          <div className="flex gap-4 overflow-hidden rounded-xl bg-[var(--ls-canvas)]">
            <Photo id={c.photo} alt={`${c.name} 물류 동선`} w={200} h={200} sizes="100px" className="h-[100px] w-[100px] shrink-0" />
            <div className="min-w-0 py-3 pr-4">
              <CenterTag id={c.id} />
              <p className="mt-2 text-[12px] text-[var(--ls-body)]">{c.system}</p>
              <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">
                {c.method} | {c.cycle}
              </p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-[12px] text-[var(--ls-muted)]">식별키</p>
            <p className="ls-code break-all rounded-xl bg-[var(--ls-canvas)] px-3 py-2.5 text-[12px] leading-5 text-[var(--ls-ink)]">{record.key}</p>
          </div>
          <KeyValue
            rows={[
              ["검증 결과", <Badge key="s" tone={STATUS_TONE[record.status]}>{record.status}</Badge>],
              ["사유", record.reason],
              ["대상 필드", record.field ?? "없음"],
              ["데이터 유형", record.domain],
              ["수집 시점", <span key="t" className="ls-num">2026-04-15 {record.collectedAt}</span>],
              ["재처리", `${record.retry} (시도 ${record.attempts}회)`],
            ]}
          />
        </div>
      )}
    </Drawer>
  );
}
