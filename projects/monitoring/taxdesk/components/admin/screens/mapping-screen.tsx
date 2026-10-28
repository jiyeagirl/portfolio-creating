"use client";

import { useState } from "react";
import { ArrowRight, Plus, WarningCircle } from "@phosphor-icons/react";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { Button, MetricStrip, PageHeader, TD, TH, TH_C, TH_R, TR, Tabs } from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { ATTACH_RULES, FIELD_MAP, MAP_CHECKS, type MapState } from "@/projects/monitoring/taxdesk/lib/admin-data";
import type { Tone } from "@/projects/monitoring/taxdesk/lib/status";

const MAP_TONE: Record<MapState, Tone> = { 정상: "done", 누락: "act", "형식 불일치": "stop" };
const MAP_LABEL: Record<MapState, string> = { 정상: "정상", 누락: "누락", "형식 불일치": "형식 오류" };

type View = "fields" | "attach";

export function MappingScreen() {
  const [view, setView] = useState<View>("fields");
  const [form, setForm] = useState("서식 전체");
  const forms = ["서식 전체", ...Array.from(new Set(FIELD_MAP.map((f) => f.form)))];
  const rows = FIELD_MAP.filter((f) => form === "서식 전체" || f.form === form);
  const missing = FIELD_MAP.filter((f) => f.state === "누락").length;
  const format = FIELD_MAP.filter((f) => f.state === "형식 불일치").length;

  return (
    <div>
      <PageHeader
        title="필드 매핑"
        meta="매핑 규칙 v12 | 01.18 17:24 문지후 수정"
        actions={
          <Button variant="primary" icon={<Plus size={15} />}>
            매핑 추가
          </Button>
        }
      />
      <div className="mt-5">
        <MetricStrip
          items={[
            { label: "매핑 항목 (개)", value: FIELD_MAP.length },
            { label: "누락 (개)", value: missing, tone: "act" },
            { label: "형식 불일치 (개)", value: format, tone: "stop" },
            { label: "첨부 슬롯 규칙 (개)", value: ATTACH_RULES.length },
          ]}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <Tabs
            items={[
              { id: "fields" as View, label: "항목 매핑", count: FIELD_MAP.length },
              { id: "attach" as View, label: "첨부 슬롯 규칙", count: ATTACH_RULES.length },
            ]}
            value={view}
            onChange={setView}
          />

          {view === "fields" ? (
            <>
              <div className="td-scroll-x mt-3 flex gap-1.5 overflow-x-auto">
                {forms.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setForm(f)}
                    className={`h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-[12.5px] ${
                      form === f ? "bg-[var(--td-ink)] font-semibold text-white" : "bg-[var(--td-parch)] text-[var(--td-ink-2)] hover:bg-[var(--td-line-soft)]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--td-line)]">
                      <th className={TH}>플랫폼 데이터</th>
                      <th className={`${TH} w-8`} />
                      <th className={TH}>홈택스 입력 항목</th>
                      <th className={`${TH} w-[200px]`}>입력 형식</th>
                      <th className={`${TH_C} w-[112px]`}>점검</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} className={`${TR} hover:bg-[var(--td-pearl)]`}>
                        <td className={TD}>
                          <p className="font-semibold">{r.platform}</p>
                          <p className="td-mono mt-0.5 text-[12px] text-[var(--td-ink-3)]">{r.key}</p>
                        </td>
                        <td className={`${TD} text-[var(--td-ink-3)]`}>
                          <ArrowRight size={14} />
                        </td>
                        <td className={TD}>
                          <p>{r.field}</p>
                          <p className="mt-0.5 text-[12px] text-[var(--td-ink-3)]">{r.form}</p>
                        </td>
                        <td className={`${TD} text-[var(--td-ink-2)]`}>{r.format}</td>
                        <td className={`${TD} text-center`}>
                          <StatusChip compact tone={MAP_TONE[r.state]}>
                            {MAP_LABEL[r.state]}
                          </StatusChip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--td-line)]">
                    <th className={TH}>증빙 슬롯</th>
                    <th className={TH}>홈택스 부속서류</th>
                    <th className={`${TH} w-[112px]`}>형식</th>
                    <th className={`${TH_R} w-[104px]`}>용량 한도</th>
                    <th className={TH}>자동 규격 처리</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTACH_RULES.map((r) => (
                    <tr key={r.slot} className={`${TR} hover:bg-[var(--td-pearl)]`}>
                      <td className={`${TD} font-semibold`}>{r.slot}</td>
                      <td className={TD}>{r.target}</td>
                      <td className={`${TD} text-[var(--td-ink-2)]`}>{r.format}</td>
                      <td className={`${TD} text-right tabular-nums text-[var(--td-ink-2)]`}>{r.limit || "해당 없음"}</td>
                      <td className={`${TD} text-[var(--td-ink-2)]`}>{r.convert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="rounded-[16px] border border-[var(--td-line)] p-5">
          <p className="text-[15px] font-semibold">점검 결과</p>
          <p className="mt-0.5 text-[12px] text-[var(--td-ink-3)]">오늘 10:20 실행 | 최근 작업 13건 기준</p>
          <ul className="mt-4 space-y-4">
            {MAP_CHECKS.map((c) => (
              <li key={c.title} className="flex gap-3">
                <WarningCircle
                  size={18}
                  weight="fill"
                  className={`mt-0.5 shrink-0 ${c.level === "형식 불일치" ? "text-[var(--td-stop-fg)]" : "text-[var(--td-act-fg)]"}`}
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">
                    {c.title} <span className="font-normal text-[var(--td-ink-3)]">| {MAP_LABEL[c.level]}</span>
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-[18px] text-[var(--td-ink-2)]">{c.detail}</p>
                  <p className="mt-1 text-[12px] text-[var(--td-ink-3)]">
                    영향 작업 <span className="tabular-nums">{c.jobs}</span>건
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-5 w-full">
            다시 점검
          </Button>
        </aside>
      </div>
    </div>
  );
}
