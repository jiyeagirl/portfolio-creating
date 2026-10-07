"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, Info } from "@phosphor-icons/react";
import { allItems, floorTotals, resultRows, totalsFor } from "@/projects/platform/drawqty/lib/calc";
import { fmt } from "@/projects/platform/drawqty/lib/format";
import { FLOOR_NAME, r1 } from "@/projects/platform/drawqty/lib/plan-data";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import { APPROX_NOTICE, Button, Segmented, Toast } from "@/projects/platform/drawqty/components/site/ui";

export function ResultScreen({
  onBack,
  onNext,
  initialToast = false,
}: {
  onBack: () => void;
  onNext: () => void;
  initialToast?: boolean;
}) {
  const { items, targets, file } = useStore();
  const [metric, setMetric] = useState<"scaffold" | "shoring">(targets.scaffold ? "scaffold" : "shoring");
  const [toast, setToast] = useState(initialToast);

  const totals = useMemo(() => totalsFor(allItems(items)), [items]);
  const rows = useMemo(() => resultRows(items, targets), [items, targets]);
  const perFloor = useMemo(() => floorTotals(items), [items]);

  const shoringTotal = r1(totals.rcVolume + totals.deckVolume);
  const rcShare = shoringTotal > 0 ? (totals.rcVolume / shoringTotal) * 100 : 0;
  const avgHeight = totals.scaffoldLength > 0 ? r1(totals.scaffoldArea / totals.scaffoldLength) : 0;

  const series = perFloor.map((f) => ({ floor: f.floor, value: metric === "scaffold" ? f.scaffold : f.shoring }));
  const max = Math.max(...series.map((s) => s.value), 1);
  const peak = series.find((s) => s.value === max)?.floor;

  return (
    <div className="dq-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">물량 산출 결과</h1>
          <p className="mt-0.5 truncate text-[13px] text-[var(--dq-ink-3)]">{file?.name}</p>
        </div>
        <Button kind="ghost" onClick={() => setToast(true)}>
          <DownloadSimple size={18} />
          엑셀로 내보내기
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
        <section className="flex flex-col justify-between rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6 lg:col-span-7">
          <h2 className="text-[13px] font-medium text-[var(--dq-ink-2)]">시스템비계 설치 면적 (㎡)</h2>
          {targets.scaffold ? (
            <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <p className="text-[44px] font-bold leading-[52px] tracking-[-0.02em] tabular-nums">{fmt(totals.scaffoldArea)}</p>
              <dl className="flex gap-8 pb-1.5 text-[13px]">
                <div>
                  <dt className="text-[var(--dq-ink-3)]">외벽 길이 합계 (m)</dt>
                  <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">{fmt(totals.scaffoldLength)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--dq-ink-3)]">평균 높이 (m)</dt>
                  <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">{fmt(avgHeight)}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="mt-3 text-[15px] text-[var(--dq-ink-3)]">산출 대상에서 제외했어요</p>
          )}
        </section>

        <section className="rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-[13px] font-medium text-[var(--dq-ink-2)]">시스템동바리 체적 (㎥)</h2>
          {targets.shoring ? (
            <>
              <p className="mt-3 text-[32px] font-bold leading-10 tracking-[-0.02em] tabular-nums">{fmt(shoringTotal)}</p>
              <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-[var(--dq-soft-2)]">
                <div className="h-full bg-[var(--dq-brand)]" style={{ width: `${rcShare}%` }} />
              </div>
              <dl className="mt-3 divide-y divide-[var(--dq-line)] text-[14px]">
                <div className="flex items-center justify-between py-2">
                  <dt className="flex items-center gap-2 text-[var(--dq-ink-2)]">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-[var(--dq-brand)]" />
                    RC
                  </dt>
                  <dd className="font-semibold tabular-nums">{fmt(totals.rcVolume)}</dd>
                </div>
                <div className="flex items-center justify-between py-2">
                  <dt className="flex items-center gap-2 text-[var(--dq-ink-2)]">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-[var(--dq-soft-2)] ring-1 ring-inset ring-[var(--dq-line-strong)]" />
                    DECK
                  </dt>
                  <dd className="font-semibold tabular-nums">{fmt(totals.deckVolume)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mt-3 text-[15px] text-[var(--dq-ink-3)]">산출 대상에서 제외했어요</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <h2 className="mb-3 text-[18px] font-semibold leading-[26px]">층별 상세</h2>
          <div className="overflow-x-auto rounded-[12px] border border-[var(--dq-line)]">
            <table className="w-full border-collapse text-[14px] sm:min-w-[560px]">
              <thead>
                <tr className="bg-[var(--dq-soft)] text-[12px] font-medium text-[var(--dq-ink-3)]">
                  <th className="h-10 w-[48px] px-3 text-left font-medium sm:w-[64px] sm:px-4">층</th>
                  <th className="px-3 text-left font-medium">구분</th>
                  <th className="hidden px-3 text-right font-medium sm:table-cell">길이 (m)</th>
                  <th className="px-3 text-right font-medium">면적 (㎡)</th>
                  <th className="hidden px-3 text-right font-medium sm:table-cell">높이 (m)</th>
                  <th className="px-3 text-right font-medium sm:px-4">수량</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const first = i === 0 || rows[i - 1].floor !== r.floor;
                  return (
                    <tr key={`${r.floor}-${r.group}`} className={first && i > 0 ? "border-t border-[var(--dq-line)]" : ""}>
                      <td className="h-12 px-3 align-middle font-semibold sm:px-4">{first ? r.floor : ""}</td>
                      <td className="px-3 align-middle">
                        <span className="block whitespace-nowrap font-medium">{r.group}</span>
                        <span className="block whitespace-nowrap text-[12px] text-[var(--dq-ink-3)]">{r.target}</span>
                      </td>
                      <td className="hidden px-3 text-right align-middle tabular-nums sm:table-cell">{r.length === null ? "-" : fmt(r.length)}</td>
                      <td className="px-3 text-right align-middle tabular-nums">{fmt(r.area)}</td>
                      <td className="hidden px-3 text-right align-middle tabular-nums sm:table-cell">{fmt(r.height)}</td>
                      <td className="whitespace-nowrap px-3 text-right align-middle font-semibold tabular-nums sm:px-4">
                        {fmt(r.qty)} <span className="text-[12px] font-normal text-[var(--dq-ink-3)]">{r.unit}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                {targets.scaffold && (
                  <TotalRow label="시스템비계 합계" length={fmt(totals.scaffoldLength)} area={fmt(totals.scaffoldArea)} qty={fmt(totals.scaffoldArea)} unit="㎡" first />
                )}
                {targets.shoring && (
                  <>
                    <TotalRow label="동바리 RC 합계" length="-" area={fmt(totals.rcArea)} qty={fmt(totals.rcVolume)} unit="㎥" first={!targets.scaffold} />
                    <TotalRow label="동바리 DECK 합계" length="-" area={fmt(totals.deckArea)} qty={fmt(totals.deckVolume)} unit="㎥" />
                  </>
                )}
              </tfoot>
            </table>
          </div>
        </section>

        <section className="rounded-[12px] border border-[var(--dq-line)] p-5 lg:col-span-4 lg:mt-[38px]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold leading-[26px]">층별 비교</h2>
          </div>
          <div className="mt-3">
            <Segmented<"scaffold" | "shoring">
              value={metric}
              onChange={setMetric}
              options={[
                { value: "scaffold", label: "비계 (㎡)" },
                { value: "shoring", label: "동바리 (㎥)" },
              ]}
            />
          </div>
          <ul className="mt-5 space-y-3">
            {series.map((s) => (
              <li key={s.floor} className="grid grid-cols-[44px_minmax(0,1fr)_84px] items-center gap-3 text-[13px]">
                <span className="font-medium text-[var(--dq-ink-2)]">{FLOOR_NAME[s.floor]}</span>
                <span className="h-5 rounded-[4px] bg-[var(--dq-soft)]">
                  <span
                    className={`block h-full rounded-[4px] ${s.floor === peak ? "bg-[var(--dq-brand)]" : "bg-[#9fb1c3]"}`}
                    style={{ width: `${(s.value / max) * 100}%` }}
                  />
                </span>
                <span className="text-right font-medium tabular-nums">{fmt(s.value)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 mt-8 border-t border-[var(--dq-line-strong)] bg-[var(--dq-surface)]">
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-[13px] leading-5 text-[var(--dq-ink-2)]">
            <Info size={18} className="mt-px shrink-0 text-[var(--dq-ink-3)]" />
            {APPROX_NOTICE}
          </p>
          <div className="flex gap-2">
            <Button kind="ghost" className="flex-1 sm:flex-none" onClick={onBack}>
              수정하러 돌아가기
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={onNext}>
              견적 요청하기
            </Button>
          </div>
        </div>
      </div>

      {toast && <Toast message="엑셀 파일을 내려받았어요" onDone={() => setToast(false)} />}
    </div>
  );
}

function TotalRow({
  label,
  length,
  area,
  qty,
  unit,
  first,
}: {
  label: string;
  length: string;
  area: string;
  qty: string;
  unit: string;
  first?: boolean;
}) {
  return (
    <tr className={`bg-[var(--dq-soft)] ${first ? "border-t border-[var(--dq-line-strong)]" : ""}`}>
      <td colSpan={2} className="h-11 px-3 text-[13px] font-semibold sm:px-4">
        {label}
      </td>
      <td className="hidden px-3 text-right tabular-nums sm:table-cell">{length}</td>
      <td className="px-3 text-right tabular-nums">{area}</td>
      <td className="hidden px-3 text-right text-[var(--dq-ink-3)] sm:table-cell">-</td>
      <td className="whitespace-nowrap px-3 text-right font-semibold tabular-nums sm:px-4">
        {qty} <span className="text-[12px] font-normal text-[var(--dq-ink-3)]">{unit}</span>
      </td>
    </tr>
  );
}
