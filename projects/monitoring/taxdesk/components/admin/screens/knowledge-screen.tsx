"use client";

import { useState } from "react";
import { MagnifyingGlass, UploadSimple } from "@phosphor-icons/react";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { Button, PageHeader, TD, TH, TH_C, TH_R, TR } from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { KNOWLEDGE_DOCS, SEARCH_TEST } from "@/projects/monitoring/taxdesk/lib/admin-data";

export function KnowledgeScreen() {
  const [query, setQuery] = useState(SEARCH_TEST.query);
  const docs = [...KNOWLEDGE_DOCS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title="지식자료 관리"
        meta={`기준 문서 ${KNOWLEDGE_DOCS.length}건 | AI 안내와 검토 근거에 사용`}
        actions={
          <Button variant="primary" icon={<UploadSimple size={15} />}>
            문서 올리기
          </Button>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--td-line)]">
                  <th className={TH}>문서</th>
                  <th className={`${TH} w-[88px]`}>분류</th>
                  <th className={`${TH} w-[64px]`}>버전</th>
                  <th className={`${TH} w-[104px]`}>기준일</th>
                  <th className={`${TH_R} w-[80px]`}>청크 (개)</th>
                  <th className={`${TH_C} w-[96px]`}>상태</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className={`${TR} hover:bg-[var(--td-pearl)]`}>
                    <td className={`${TD} max-w-0`}>
                      <p className="truncate font-semibold" title={d.title}>
                        {d.title}
                      </p>
                      <p className="td-mono mt-0.5 text-[12px] text-[var(--td-ink-3)]">{d.id}</p>
                    </td>
                    <td className={`${TD} text-[var(--td-ink-2)]`}>{d.category}</td>
                    <td className={`${TD} td-mono`}>{d.version}</td>
                    <td className={`${TD} whitespace-nowrap tabular-nums`}>{d.date}</td>
                    <td className={`${TD} text-right tabular-nums`}>{d.chunks.toLocaleString("ko-KR")}</td>
                    <td className={`${TD} text-center`}>
                      <StatusChip compact tone={d.state === "적용" ? "done" : "run"}>
                        {d.state}
                      </StatusChip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-[16px] border border-[var(--td-line)] p-5">
          <p className="text-[15px] font-semibold">검색 테스트</p>
          <label className="relative mt-3 block">
            <span className="sr-only">검색 질문</span>
            <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--td-ink-3)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-[8px] border border-[var(--td-line)] pl-8 pr-3 text-[13px] focus:outline-2 focus:outline-[var(--td-blue-focus)]"
            />
          </label>
          <p className="mt-3 text-[12px] text-[var(--td-ink-3)]">
            상위 {SEARCH_TEST.results.length}건 | 적용 문서만 | 0.31초
          </p>
          <ol className="mt-2 divide-y divide-[var(--td-line-soft)]">
            {SEARCH_TEST.results.map((r, i) => (
              <li key={r.doc} className="py-3">
                <p className="flex items-center gap-2 text-[13px]">
                  <span className="tabular-nums text-[var(--td-ink-3)]">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{r.doc}</span>
                  <span className="shrink-0 tabular-nums text-[12px] text-[var(--td-blue)]">{r.score.toFixed(2)}</span>
                </p>
                <p className="mt-1 text-[12.5px] leading-[18px] text-[var(--td-ink-2)]">{r.excerpt}</p>
                <p className="mt-1 text-[12px] text-[var(--td-ink-3)]">
                  {r.version} | {r.date} 기준
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
