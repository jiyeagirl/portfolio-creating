"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/projects/platform/drawqty/lib/format";
import { r1 } from "@/projects/platform/drawqty/lib/plan-data";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import { StatusChip } from "@/projects/platform/drawqty/components/site/ui";
import { AButton, DefRow, DetailPanel, EmptyRow, FilterTabs, PanelSection, Pager, SearchInput } from "@/projects/platform/drawqty/components/admin/admin-ui";
import type { QuoteStatus } from "@/projects/platform/drawqty/lib/types";

type Filter = "전체" | QuoteStatus;
const PAGE_SIZE = 10;
const STATUSES: QuoteStatus[] = ["신규", "검토 중", "견적 발송"];

const dash = (n: number) => (n > 0 ? fmt(n) : "-");

export function QuotesScreen({ initialSelected }: { initialSelected: string | null }) {
  const { quotes, setQuoteStatus } = useStore();
  const [filter, setFilter] = useState<Filter>("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? quotes[0]?.id ?? null);

  const counts = useMemo(
    () => ({
      전체: quotes.length,
      신규: quotes.filter((q) => q.status === "신규").length,
      "검토 중": quotes.filter((q) => q.status === "검토 중").length,
      "견적 발송": quotes.filter((q) => q.status === "견적 발송").length,
    }),
    [quotes],
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    return quotes.filter(
      (x) => (filter === "전체" || x.status === filter) && (q === "" || x.company.includes(q) || x.site.includes(q)),
    );
  }, [quotes, filter, query]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = quotes.find((q) => q.id === selectedId) ?? null;

  return (
    <div className="dq-enter">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-[20px] font-semibold leading-8 tracking-[-0.02em]">견적 요청</h1>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs<Filter>
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          options={[
            { value: "전체", label: "전체", count: counts.전체 },
            { value: "신규", label: "신규", count: counts.신규 },
            { value: "검토 중", label: "검토 중", count: counts["검토 중"] },
            { value: "견적 발송", label: "견적 발송", count: counts["견적 발송"] },
          ]}
        />
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="업체명, 현장명 검색"
        />
      </div>

      <div className={`mt-4 grid grid-cols-1 items-start gap-4 ${selected ? "xl:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        <section className="overflow-hidden rounded-[10px] border border-[var(--dq-line)] bg-[var(--dq-surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[752px] border-collapse text-[13px]">
              <thead>
                <tr className="h-10 bg-[var(--dq-soft)] text-[12px] font-medium text-[var(--dq-ink-3)]">
                  <th className="w-[136px] px-4 text-left font-medium">접수번호</th>
                  <th className="px-3 text-left font-medium">업체명</th>
                  <th className="w-[120px] px-3 text-left font-medium">연락처</th>
                  <th className="w-[104px] px-3 text-right font-medium whitespace-nowrap">비계 면적 (㎡)</th>
                  <th className="w-[116px] px-3 text-right font-medium whitespace-nowrap">동바리 체적 (㎥)</th>
                  <th className="w-[96px] px-4 text-left font-medium">처리 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dq-line)]">
                {pageRows.length === 0 && <EmptyRow colSpan={6} text="조건에 맞는 견적 요청이 없습니다" />}
                {pageRows.map((q) => {
                  const active = q.id === selectedId;
                  return (
                    <tr
                      key={q.id}
                      onClick={() => setSelectedId(active ? null : q.id)}
                      aria-selected={active}
                      className={`h-14 cursor-pointer transition-colors hover:bg-[var(--dq-soft)] ${active ? "bg-[var(--dq-soft)]" : ""}`}
                    >
                      <td className="px-4">
                        <span className="dq-mono block whitespace-nowrap text-[12.5px] font-medium">{q.id}</span>
                        <span className="block whitespace-nowrap text-[12px] text-[var(--dq-ink-3)]">{q.requestedAt}</span>
                      </td>
                      <td className="max-w-0 px-3">
                        <span className="block truncate font-semibold" title={q.company}>
                          {q.company}
                        </span>
                        <span className="block truncate text-[12px] text-[var(--dq-ink-3)]" title={q.site}>
                          {q.site}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 tabular-nums">{q.phone}</td>
                      <td className="px-3 text-right tabular-nums">{dash(q.scaffoldArea)}</td>
                      <td className="px-3 text-right tabular-nums">{dash(r1(q.rcVolume + q.deckVolume))}</td>
                      <td className="px-4">
                        <StatusChip value={q.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pager page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
        </section>

        {selected && (
          <DetailPanel
            key={selected.id}
            title={
              <div>
                <p className="dq-mono truncate text-[13px] font-semibold">{selected.id}</p>
                <p className="truncate text-[12px] text-[var(--dq-ink-3)]">{selected.requestedAt}</p>
              </div>
            }
            badge={<StatusChip value={selected.status} />}
            onClose={() => setSelectedId(null)}
          >
            <PanelSection title="고객 정보">
              <dl>
                <DefRow label="업체명">{selected.company}</DefRow>
                <DefRow label="현장명">{selected.site}</DefRow>
                <DefRow label="담당자명">{selected.manager}</DefRow>
                <DefRow label="연락처">{selected.phone}</DefRow>
                <DefRow label="이메일">{selected.email || "-"}</DefRow>
                <DefRow label="공사 예정 시기">{selected.startMonth}</DefRow>
              </dl>
            </PanelSection>
            <PanelSection title="산출 요약">
              <dl>
                <DefRow label="도면 파일명">{selected.fileName}</DefRow>
                <DefRow label="비계 면적 (㎡)">{dash(selected.scaffoldArea)}</DefRow>
                <DefRow label="동바리 RC 체적 (㎥)">{dash(selected.rcVolume)}</DefRow>
                <DefRow label="동바리 DECK 체적 (㎥)">{dash(selected.deckVolume)}</DefRow>
              </dl>
            </PanelSection>
            <PanelSection title="요청 메모">
              <p className="text-[13px] leading-5 text-[var(--dq-ink-2)]">{selected.memo || "메모가 없습니다"}</p>
            </PanelSection>
            <PanelSection title="상태 변경">
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <AButton key={s} active={selected.status === s} onClick={() => setQuoteStatus(selected.id, s)} className="flex-1">
                    {s}
                  </AButton>
                ))}
              </div>
            </PanelSection>
          </DetailPanel>
        )}
      </div>
    </div>
  );
}
