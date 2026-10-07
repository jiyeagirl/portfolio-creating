"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Cell,
  CenterTag,
  Code,
  I,
  Meter,
  PageHead,
  Panel,
  Photo,
  Row,
  Segmented,
  Table,
} from "@/projects/b2b/logisync/components/ui";
import { MAPPINGS, SCHEMA_FIELDS, STATUS_RULES } from "@/projects/b2b/logisync/lib/mock-data";
import type { Mapping, MappingStatus, Tone } from "@/projects/b2b/logisync/lib/types";

const MAP_TONE: Record<MappingStatus, Tone> = { 확정: "ok", 검토: "info", 미매핑: "warn" };

const UNIT_RULES = [
  { raw: ["EA", "PCS", "개"], std: "EA", note: "낱개" },
  { raw: ["봉", "팩", "PK"], std: "PK", note: "포장 단위" },
  { raw: ["BOX", "BX", "CTN"], std: "BX", note: "박스, 입수는 상품 마스터 기준 환산" },
  { raw: ["BDL"], std: "BX", note: "번들은 검토 후 확정 (평택)" },
];

export function StandardizeScreen() {
  const [selected, setSelected] = useState<Mapping>(MAPPINGS[0]);
  const [dict, setDict] = useState<"status" | "unit">("status");

  return (
    <div className="space-y-8">
      <PageHead
        title="데이터 표준화 및 통합"
        actions={
          <>
            <Button variant="outline" icon="upload-simple">
              매핑 일괄 등록
            </Button>
            <Button variant="primary" icon="check-square">
              규칙 v3.15 배포
            </Button>
          </>
        }
      />

      <Convergence mapping={selected} />

      <Panel title="상품코드 매핑 테이블" flush action={<span className="ls-num text-[12px] text-[var(--ls-muted)]">표준 상품 4,812 | 원천 코드 13,207</span>}>
        <Table head={["표준 상품", "센터별 원천 코드", "표준 단위", "매핑 신뢰도", "상태"]} minWidth={940}>
          {MAPPINGS.map((m) => {
            const on = m.std === selected.std && m.name === selected.name;
            return (
              <Row key={m.std + m.name} onClick={() => setSelected(m)} selected={on}>
                <Cell first selected={on}>
                  <div className="flex items-center gap-3">
                    {m.photo ? (
                      <Photo id={m.photo} alt={m.name} w={88} h={88} sizes="44px" className="h-11 w-11 shrink-0 rounded-[10px]" />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--ls-elevated)] text-[var(--ls-muted)]">
                        <I icon="package" size={18} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[var(--ls-ink)]">{m.name}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--ls-muted)]">
                        <span className="ls-code">{m.std}</span>
                        <span>{m.category}</span>
                      </p>
                    </div>
                  </div>
                </Cell>
                <Cell>
                  <div className="flex max-w-[360px] flex-wrap gap-1.5">
                    {m.sources.map((s) => (
                      <span key={s.centerId + s.code} className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--ls-canvas)] px-2 py-0.5 text-[11px]">
                        <span className="text-[var(--ls-muted)]">{s.centerId}</span>
                        <span className="ls-code text-[var(--ls-ink)]">{s.code}</span>
                      </span>
                    ))}
                  </div>
                </Cell>
                <Cell>
                  <span className="ls-code">{m.unit}</span>
                </Cell>
                <Cell className="w-[160px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Meter value={m.confidence} tone={m.confidence === 100 ? "ink" : m.confidence > 80 ? "info" : "warn"} />
                    </div>
                    <span className="ls-num w-9 text-right text-[12px]">{m.confidence}%</span>
                  </div>
                </Cell>
                <Cell>
                  <Badge tone={MAP_TONE[m.status]}>{m.status}</Badge>
                  <p className="ls-num mt-1 text-[11px] text-[var(--ls-muted)]">{m.updatedAt}</p>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SchemaCompare />

        <Panel
          title={dict === "status" ? "상태값 사전" : "단위 사전"}
          action={
            <Segmented
              value={dict}
              onChange={setDict}
              items={[
                { key: "status", label: "상태값" },
                { key: "unit", label: "단위" },
              ]}
            />
          }
          flush
        >
          {dict === "status" ? (
            <ul>
              {STATUS_RULES.map((r) => (
                <li key={r.centerId + r.raw} className="grid grid-cols-[128px_minmax(0,1fr)_20px_80px] items-center gap-3 border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3 text-[13px]">
                  <span className="text-[12px]">
                    <CenterTag id={r.centerId} withName={false} />
                    <span className="ml-2 text-[var(--ls-muted)]">{r.domain}</span>
                  </span>
                  <span className="ls-code truncate text-[var(--ls-body-strong)]">{r.raw}</span>
                  <I icon="arrow-right" size={14} className="text-[var(--ls-disabled)]" />
                  <Badge tone={r.std.includes("보류") ? "warn" : "ok"} dot={false}>
                    {r.std}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              {UNIT_RULES.map((u) => (
                <li key={u.raw.join()} className="border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                      {u.raw.map((r) => (
                        <Code key={r} className="text-[11px]">
                          {r}
                        </Code>
                      ))}
                    </div>
                    <I icon="arrow-right" size={14} className="text-[var(--ls-disabled)]" />
                    <span className="ls-code w-10 text-[14px] font-bold text-[var(--ls-ink)]">{u.std}</span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-[var(--ls-muted)]">{u.note}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* 센터 A, B, C의 서로 다른 코드가 표준 코드 하나로 모이는 그림 */
function Convergence({ mapping }: { mapping: Mapping }) {
  return (
    <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)]">
      <div className="rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
        <p className="ls-eyebrow text-[var(--ls-muted)]">원천 코드</p>
        <ul className="mt-3 space-y-2">
          {mapping.sources.map((s, i) => (
            <li
              key={s.centerId + s.code}
              className="ls-stagger grid grid-cols-[minmax(0,150px)_minmax(0,1fr)_48px] items-center gap-4 rounded-xl bg-[var(--ls-canvas)] px-4 py-2.5"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="min-w-0 text-[12px]">
                <CenterTag id={s.centerId} />
              </span>
              <span className="min-w-0">
                <span className="ls-code block truncate text-[15px] font-semibold text-[var(--ls-ink)]">{s.code}</span>
                <span className="block truncate text-[12px] text-[var(--ls-muted)]">{s.name}</span>
              </span>
              <span className="ls-code text-right text-[12px] text-[var(--ls-body)]">{s.unit}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center py-1 lg:py-0">
        <I icon="arrow-right" size={28} className="rotate-90 text-[var(--ls-ink)] lg:rotate-0" />
      </div>
      {/* 사진은 상품 식별용 썸네일로만 쓴다. 카드의 주인공은 표준 코드다. */}
      <div className="self-start rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <p className="ls-eyebrow text-[var(--ls-muted)]">표준 코드</p>
          <Badge tone={MAP_TONE[mapping.status]}>{mapping.status}</Badge>
        </div>
        <div className="mt-4 flex items-center gap-4">
          {mapping.photo && (
            <Photo id={mapping.photo} alt={mapping.name} w={128} h={128} sizes="64px" className="h-16 w-16 shrink-0 rounded-xl" />
          )}
          <div className="min-w-0">
            <p className="ls-code text-[24px] font-semibold leading-8 text-[var(--ls-ink)]">{mapping.std}</p>
            <p className="mt-0.5 truncate text-[14px] text-[var(--ls-body-strong)]">{mapping.name}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[var(--ls-canvas)] px-4 py-3 text-[12px]">
          <div>
            <dt className="text-[var(--ls-muted)]">표준 단위</dt>
            <dd className="ls-code mt-0.5 text-[14px] text-[var(--ls-ink)]">{mapping.unit}</dd>
          </div>
          <div>
            <dt className="text-[var(--ls-muted)]">원천 코드 (개)</dt>
            <dd className="ls-num mt-0.5 text-[14px] text-[var(--ls-ink)]">{mapping.sources.length}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function SchemaCompare() {
  return (
    <Panel title="원천 필드 → 공통 스키마 변환" flush action={<Code className="text-[11px]">PTK OUT-55108</Code>}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="bg-[var(--ls-paper)] px-5 py-3">
          <p className="ls-eyebrow text-[var(--ls-paper-muted)]">변환 전</p>
          <p className="text-[12px] text-[var(--ls-paper-muted)]">평택 작업관리 시스템 CSV</p>
        </div>
        <div className="px-5 py-3">
          <p className="ls-eyebrow text-[var(--ls-muted)]">변환 후</p>
          <p className="text-[12px] text-[var(--ls-muted)]">통합 movement 레코드</p>
        </div>
      </div>
      <ul>
        {SCHEMA_FIELDS.map((f, i) => (
          <li key={f.source} className="ls-stagger grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" style={{ "--i": i } as React.CSSProperties}>
            <div className="border-b border-[var(--ls-paper-line)] bg-[var(--ls-paper)] px-5 py-2.5 text-[var(--ls-paper-ink)]">
              <p className="ls-code text-[11px] text-[var(--ls-paper-muted)]">{f.source}</p>
              <p className="ls-code mt-0.5 break-all text-[12px]">{f.sourceValue}</p>
            </div>
            <div className="border-b border-[var(--ls-hairline-soft)] px-5 py-2.5">
              <p className="flex items-center justify-between gap-2">
                <span className="ls-code text-[11px] text-[var(--ls-muted)]">{f.target}</span>
                <span className="truncate text-[10px] text-[var(--ls-body)]">{f.rule}</span>
              </p>
              <p className="ls-code mt-0.5 break-all text-[12px] text-[var(--ls-ink)]">{f.targetValue}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
