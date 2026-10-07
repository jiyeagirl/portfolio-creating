"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  CenterTag,
  Code,
  PageHead,
  Pagination,
  Panel,
  Photo,
  Row,
  Cell,
  SearchInput,
  Segmented,
  Select,
  SpecBand,
  SpecCell,
  Table,
  Tabs,
} from "@/projects/b2b/logisync/components/ui";
import { CENTERS, CENTER_BY_ID, UNIFIED } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { CenterId, Movement, UnifiedRecord } from "@/projects/b2b/logisync/lib/types";

type MoveFilter = "all" | Movement;
type Period = "today" | "7d" | "30d";

const CENTER_OPTIONS = ["전체 센터", ...CENTERS.map((c) => `${c.id} ${c.name}`)];

export function UnifiedScreen() {
  const [move, setMove] = useState<MoveFilter>("all");
  const [center, setCenter] = useState(CENTER_OPTIONS[0]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<Period>("today");
  const [selectedId, setSelectedId] = useState(UNIFIED[0].id);

  const rows = useMemo(() => {
    const centerId = center === CENTER_OPTIONS[0] ? null : (center.slice(0, 3) as CenterId);
    const q = query.trim().toLowerCase();
    return UNIFIED.filter(
      (r) =>
        (move === "all" || r.movement === move) &&
        (!centerId || r.centerId === centerId) &&
        (!q || [r.id, r.std, r.product, r.partner].some((v) => v.toLowerCase().includes(q))),
    );
  }, [move, center, query]);

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  return (
    <div className="space-y-8">
      <PageHead
        title="통합 물류 데이터"
        actions={
          <>
            <Segmented
              value={period}
              onChange={setPeriod}
              items={[
                { key: "today", label: "오늘" },
                { key: "7d", label: "7일" },
                { key: "30d", label: "30일" },
              ]}
            />
            <Button icon="download-simple">CSV 내보내기</Button>
          </>
        }
      />

      <SpecBand cols={4}>
        <SpecCell label="통합 입고" value="59,176" unit="건" sub="어제 같은 시각 대비 +4.1%" />
        <SpecCell label="통합 출고" value="68,528" unit="건" sub="어제 같은 시각 대비 +2.7%" />
        <SpecCell label="통합 적재 레코드" value="127,704" unit="건" sub="원천 수신 128,612건 중 99.3%" />
        <SpecCell label="표준화 보류 레코드" value="17" unit="건" />
      </SpecBand>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel flush>
          <div className="space-y-4 px-6 pt-5">
            <Tabs
              value={move}
              onChange={setMove}
              items={[
                { key: "all", label: "전체", count: 127_704 },
                { key: "입고", label: "입고", count: 59_176 },
                { key: "출고", label: "출고", count: 68_528 },
              ]}
            />
            <div className="flex flex-col gap-2 pb-4 sm:flex-row">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="통합 ID, 표준 상품코드, 상품명, 거래처"
                className="sm:flex-1"
              />
              <Select label="센터" value={center} options={CENTER_OPTIONS} onChange={setCenter} />
            </div>
          </div>

          <Table head={["통합 ID", "표준 상품", "원천 센터", "수량", "표준 상태"]} align={["left", "left", "left", "right", "left"]}>
            {rows.map((r) => {
              const on = r.id === selected?.id;
              return (
                <Row key={r.id} onClick={() => setSelectedId(r.id)} selected={on}>
                  <Cell first selected={on}>
                    <p className="ls-code whitespace-nowrap text-[12px] text-[var(--ls-ink)]">{r.id}</p>
                    <p className="ls-num mt-0.5 text-[12px] text-[var(--ls-muted)]">{r.occurredAt}</p>
                  </Cell>
                  <Cell>
                    <p className="max-w-[200px] truncate text-[var(--ls-ink)]">{r.product}</p>
                    <p className="ls-code mt-0.5 text-[11px] text-[var(--ls-muted)]">{r.std}</p>
                  </Cell>
                  <Cell>
                    <CenterTag id={r.centerId} withName={false} />
                  </Cell>
                  <Cell align="right">
                    <p className="ls-num font-semibold text-[var(--ls-ink)]">
                      {r.movement === "출고" ? "−" : "+"}
                      {fmt(r.qty)}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">
                      {r.movement} {r.unit}
                    </p>
                  </Cell>
                  <Cell>
                    <Badge tone={r.statusStd.includes("보류") ? "warn" : "ok"}>{r.statusStd}</Badge>
                  </Cell>
                </Row>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-[13px] text-[var(--ls-muted)]">
                  조건에 맞는 통합 레코드가 없습니다. 검색어나 센터 필터를 바꿔 보세요.
                </td>
              </tr>
            )}
          </Table>
          <Pagination total={period === "today" ? 127_704 : period === "7d" ? 846_210 : 3_612_488} pageSize={8} label="통합 레코드" />
        </Panel>

        {selected ? <TracePanel key={selected.id} record={selected} /> : <EmptyTrace />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CenterFlow />
        {selected && <ProductHistory std={selected.std} product={selected.product} />}
      </div>
    </div>
  );
}

function EmptyTrace() {
  return (
    <Panel title="원천 데이터 추적">
      <p className="py-10 text-center text-[13px] text-[var(--ls-muted)]">왼쪽 표에서 레코드를 선택하세요.</p>
    </Panel>
  );
}

/* 통합 레코드에서 원천까지 거꾸로 따라간다. 위가 현재(통합), 아래가 원천. */
function TracePanel({ record }: { record: UnifiedRecord }) {
  const c = CENTER_BY_ID[record.centerId];
  const t = record.trace;
  const steps = [...t.steps].reverse();

  return (
    <aside className="overflow-hidden rounded-2xl bg-[var(--ls-surface)] shadow-[var(--ls-shadow)] xl:sticky xl:top-[80px]" aria-label="원천 데이터 추적">
      <div className="px-6 pb-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold leading-[22px] text-[var(--ls-ink)]">원천 데이터 추적</h2>
          <Code className="text-[11px]">{record.id}</Code>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-[var(--ls-body)]">
          {record.product} {fmt(record.qty)}
          {record.unit} {record.movement}, 거래처 {record.partner}
        </p>
      </div>

      <ol className="px-6 py-5">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.label} className="ls-stagger relative flex gap-4 pb-5" style={{ "--i": i } as React.CSSProperties}>
              {!last && <span aria-hidden className="absolute left-[11px] top-6 h-[calc(100%-16px)] w-px bg-[var(--ls-hairline)]" />}
              <span
                className={`ls-num relative flex h-6 w-6 shrink-0 rounded-full items-center justify-center text-[11px] font-bold ${
                  i === 0 ? "bg-[var(--ls-ink)] text-[var(--ls-canvas)]" : "bg-[var(--ls-elevated)] text-[var(--ls-body-strong)]"
                }`}
              >
                {steps.length - i}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-bold leading-5 text-[var(--ls-ink)]">{s.label}</p>
                  <p className="ls-num shrink-0 text-[12px] text-[var(--ls-muted)]">{s.at}</p>
                </div>
                <p className="mt-0.5 text-[12px] leading-[18px] text-[var(--ls-body)]">{s.detail}</p>

                {s.label === "표준화" && (
                  <ul className="mt-3 space-y-1.5">
                    {t.rules.map((r) => (
                      <li key={r.code} className="flex items-start gap-2 text-[12px] leading-[18px] text-[var(--ls-body-strong)]">
                        <Code className="text-[10px]">{r.code}</Code>
                        <span className="min-w-0">{r.text}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.label === "정합성 검증" && (
                  <p className="ls-code mt-2 break-all text-[11px] leading-4 text-[var(--ls-muted)]">식별키 {t.dedupeKey}</p>
                )}

                {s.label === "수집" && (
                  <div className="mt-2 space-y-0.5 text-[12px] leading-[18px]">
                    <p className="text-[var(--ls-body-strong)]">
                      수집 시점 <span className="ls-num">{t.collectedAt}</span>
                    </p>
                    <p className="ls-code break-all text-[11px] text-[var(--ls-muted)]">{t.batchId}</p>
                  </div>
                )}

                {s.label === "원천 발생" && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-3 overflow-hidden rounded-xl bg-[var(--ls-canvas)]">
                      <Photo id={c.photo} alt={`${c.name} 인근 물류 동선`} w={176} h={176} className="h-[88px] w-[88px] shrink-0" sizes="88px" />
                      <div className="min-w-0 py-2 pr-3">
                        <CenterTag id={c.id} />
                        <p className="mt-1.5 text-[12px] leading-[18px] text-[var(--ls-body)]">{t.sourceSystem}</p>
                        <p className="ls-code mt-0.5 text-[11px] text-[var(--ls-muted)]">{t.sourceRecordId}</p>
                      </div>
                    </div>

                    {/* 원본 레코드는 "종이 문서"처럼 밝은 표면에 원문 그대로 둔다 */}
                    <div className="overflow-hidden rounded-xl bg-[var(--ls-paper)] text-[var(--ls-paper-ink)]">
                      <div className="flex items-center justify-between border-b border-[var(--ls-paper-line)] px-3 py-2">
                        <span className="ls-eyebrow text-[var(--ls-paper-muted)]">원본 레코드</span>
                        <span className="text-[11px] text-[var(--ls-paper-muted)]">원본 {t.raw.length}개 필드</span>
                      </div>
                      <dl className="ls-code px-3 py-2 text-[11px] leading-[18px]">
                        {t.raw.map(([k, v]) => (
                          <div key={k} className="flex gap-3">
                            <dt className="w-[92px] shrink-0 text-[var(--ls-paper-muted)]">{k}</dt>
                            <dd className="min-w-0 break-all">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex gap-2 bg-[var(--ls-canvas)] px-6 py-4">
        <Button variant="outline" size="sm" icon="file-text">
          원본 파일 열기
        </Button>
        <Button variant="ghost" size="sm" icon="link">
          추적 링크 복사
        </Button>
      </div>
    </aside>
  );
}

function CenterFlow() {
  const max = Math.max(...CENTERS.map((c) => Math.max(c.todayIn, c.todayOut)));
  const top = [...CENTERS].sort((a, b) => b.todayIn + b.todayOut - (a.todayIn + a.todayOut))[0].id;
  return (
    <Panel title="센터별 오늘 입출고" action={<span className="text-[12px] text-[var(--ls-muted)]">14:36 기준 (건)</span>}>
      <ul className="space-y-4">
        {CENTERS.map((c) => (
          <li key={c.id} className="grid grid-cols-[156px_minmax(0,1fr)_68px] items-center gap-4">
            <span className="min-w-0 text-[13px]">
              <CenterTag id={c.id} />
            </span>
            <div className="space-y-1">
              <div className="h-[6px] rounded-full bg-[var(--ls-chart-1)]" style={{ width: `${(c.todayIn / max) * 100}%` }} />
              <div className="h-[6px] rounded-full bg-[var(--ls-chart-2)]" style={{ width: `${(c.todayOut / max) * 100}%` }} />
            </div>
            <p className="ls-num text-right text-[14px] font-bold leading-5" style={{ color: c.id === top ? "var(--ls-primary)" : "var(--ls-ink)" }}>
              {fmt(c.todayIn + c.todayOut)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-5 text-[12px] text-[var(--ls-body)]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--ls-chart-1)]" />
          입고
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--ls-chart-2)]" />
          출고
        </span>
      </div>
    </Panel>
  );
}

function ProductHistory({ std, product }: { std: string; product: string }) {
  const rows = UNIFIED.filter((r) => r.std === std);
  const net = rows.reduce((s, r) => s + (r.movement === "입고" ? r.qty : -r.qty), 0);
  return (
    <Panel
      title={`${product} 입출고 이력`}
      action={<Code className="text-[11px]">{std}</Code>}
      flush
    >
      <ul>
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-4 border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3">
            <span className="ls-num w-[84px] shrink-0 text-[12px] text-[var(--ls-muted)]">{r.occurredAt}</span>
            <span className="min-w-0 flex-1">
              <CenterTag id={r.centerId} />
            </span>
            <Badge tone={r.movement === "입고" ? "info" : "neutral"} dot={false}>
              {r.movement}
            </Badge>
            <span className="ls-num w-[72px] shrink-0 text-right text-[13px] font-semibold text-[var(--ls-ink)]">
              {r.movement === "출고" ? "−" : "+"}
              {fmt(r.qty)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-6 py-4 text-[13px]">
        <span className="text-[var(--ls-muted)]">오늘 전 센터 순증감</span>
        <span className="ls-num font-bold text-[var(--ls-ink)]">
          {net > 0 ? "+" : net < 0 ? "−" : ""}
          {fmt(Math.abs(net))} {rows[0]?.unit}
        </span>
      </div>
    </Panel>
  );
}
