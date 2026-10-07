"use client";

import { useMemo, useState } from "react";
import { fmt, fmtSize } from "@/projects/platform/drawqty/lib/format";
import { buildInitialItems, FLOORS } from "@/projects/platform/drawqty/lib/plan-data";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import { PlanViewer } from "@/projects/platform/drawqty/components/site/plan-viewer";
import { Segmented } from "@/projects/platform/drawqty/components/site/ui";
import { DefRow, DetailPanel, EmptyRow, FilterTabs, PanelSection, Pager, SearchInput } from "@/projects/platform/drawqty/components/admin/admin-ui";
import type { FloorId, PlanItem, UploadRecord } from "@/projects/platform/drawqty/lib/types";

const PAGE_SIZE = 10;
type Filter = "전체" | UploadRecord["result"];
const dash = (n: number) => (n > 0 ? fmt(n) : "-");

/* 인식 결과 칩: 정상 초록, 수동 수정 포함 파랑. 글자 수와 무관하게 고정 폭 */
function ResultChip({ value }: { value: UploadRecord["result"] }) {
  return (
    <span
      className={`inline-flex h-6 w-[104px] items-center justify-center whitespace-nowrap rounded-[6px] text-[12px] font-semibold ${
        value === "정상" ? "bg-[var(--dq-green-bg)] text-[var(--dq-green-fg)]" : "bg-[var(--dq-blue-bg)] text-[var(--dq-blue-fg)]"
      }`}
    >
      {value}
    </span>
  );
}

function previewItems(record: UploadRecord): Record<FloorId, PlanItem[]> {
  const base = buildInitialItems();
  if (record.result === "수동 수정 포함") return base;
  const out = {} as Record<FloorId, PlanItem[]>;
  for (const f of FLOORS) out[f] = base[f].map((i) => ({ ...i, confidence: "높음" as const }));
  return out;
}

export function DrawingsScreen({ initialSelected }: { initialSelected: string | null }) {
  const { uploads } = useStore();
  const [filter, setFilter] = useState<Filter>("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? uploads[0]?.id ?? null);
  const [floor, setFloor] = useState<FloorId>("1F");

  const filtered = useMemo(() => {
    const q = query.trim();
    return uploads.filter(
      (u) => (filter === "전체" || u.result === filter) && (q === "" || u.company.includes(q) || u.site.includes(q) || u.fileName.includes(q)),
    );
  }, [uploads, filter, query]);

  const counts = {
    전체: uploads.length,
    정상: uploads.filter((u) => u.result === "정상").length,
    "수동 수정 포함": uploads.filter((u) => u.result === "수동 수정 포함").length,
  };

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = uploads.find((u) => u.id === selectedId) ?? null;
  const preview = useMemo(() => (selected ? previewItems(selected) : null), [selected]);

  return (
    <div className="dq-enter">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-[20px] font-semibold leading-8 tracking-[-0.02em]">업로드 도면</h1>
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
            { value: "정상", label: "정상", count: counts.정상 },
            { value: "수동 수정 포함", label: "수동 수정 포함", count: counts["수동 수정 포함"] },
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
            <table className="w-full min-w-[720px] border-collapse text-[13px]">
              <thead>
                <tr className="h-10 bg-[var(--dq-soft)] text-[12px] font-medium text-[var(--dq-ink-3)]">
                  <th className="px-4 text-left font-medium">파일명</th>
                  <th className="w-[176px] px-3 text-left font-medium">업로더</th>
                  <th className="w-[140px] px-3 text-left font-medium">업로드 일시</th>
                  <th className="w-[88px] px-3 text-right font-medium">크기 (MB)</th>
                  <th className="w-[128px] px-4 text-left font-medium">인식 결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dq-line)]">
                {pageRows.length === 0 && <EmptyRow colSpan={5} text="조건에 맞는 도면이 없습니다" />}
                {pageRows.map((u) => {
                  const active = u.id === selectedId;
                  return (
                    <tr
                      key={u.id}
                      onClick={() => {
                        setSelectedId(active ? null : u.id);
                        setFloor("1F");
                      }}
                      aria-selected={active}
                      className={`h-[52px] cursor-pointer transition-colors hover:bg-[var(--dq-soft)] ${active ? "bg-[var(--dq-soft)]" : ""}`}
                    >
                      <td className="max-w-0 px-4">
                        <span className="block truncate font-semibold" title={u.fileName}>
                          {u.fileName}
                        </span>
                        <span className="dq-mono block text-[11.5px] text-[var(--dq-ink-3)]">{u.id}</span>
                      </td>
                      <td className="max-w-0 px-3">
                        <span className="block truncate font-medium">{u.company}</span>
                        <span className="block truncate text-[12px] text-[var(--dq-ink-3)]" title={u.site}>
                          {u.site}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 tabular-nums">{u.uploadedAt}</td>
                      <td className="px-3 text-right tabular-nums">{u.sizeMb.toFixed(1)}</td>
                      <td className="px-4">
                        <ResultChip value={u.result} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pager page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
        </section>

        {selected && preview && (
          <DetailPanel
            key={selected.id}
            title={
              <div>
                <p className="truncate text-[13px] font-semibold" title={selected.fileName}>
                  {selected.fileName}
                </p>
                <p className="truncate text-[12px] text-[var(--dq-ink-3)]">
                  {selected.company} | {fmtSize(selected.sizeMb)}
                </p>
              </div>
            }
            onClose={() => setSelectedId(null)}
          >
            <PanelSection title="도면 미리보기">
              <div className="mb-3 dq-scroll-x overflow-x-auto">
                <Segmented<FloorId> value={floor} onChange={setFloor} options={FLOORS.map((f) => ({ value: f, label: f }))} />
              </div>
              <PlanViewer floor={floor} items={preview[floor]} selectedId={null} showControls={false} showValues={false} />
            </PanelSection>
            <PanelSection title="산출 결과 요약">
              <dl>
                <DefRow label="비계 면적 (㎡)">{dash(selected.scaffoldArea)}</DefRow>
                <DefRow label="동바리 RC 체적 (㎥)">{dash(selected.rcVolume)}</DefRow>
                <DefRow label="동바리 DECK 체적 (㎥)">{dash(selected.deckVolume)}</DefRow>
                <DefRow label="인식 결과">
                  <ResultChip value={selected.result} />
                </DefRow>
              </dl>
            </PanelSection>
          </DetailPanel>
        )}
      </div>
    </div>
  );
}
