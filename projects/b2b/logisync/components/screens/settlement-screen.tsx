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
  PageHead,
  Panel,
  Photo,
  Row,
  Segmented,
  Select,
  SpecCell,
  Table,
} from "@/projects/b2b/logisync/components/ui";
import { CENTER_BY_ID, CENTERS, RATE_CARD, SETTLEMENTS, SETTLEMENT_PERIODS } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { CenterId, Settlement, SettlementStatus, Tone } from "@/projects/b2b/logisync/lib/types";

const STATUS_TONE: Record<SettlementStatus, Tone> = { 예정: "neutral", 검토: "info", 확정: "ok" };
const STATUS_FLOW: SettlementStatus[] = ["예정", "검토", "확정"];

type PeriodKey = (typeof SETTLEMENT_PERIODS)[number]["key"];

const ALL_CENTERS = "전체 센터";
const ALL_PARTNERS = "전체 거래처";
const CENTER_OPTIONS = [ALL_CENTERS, ...CENTERS.map((c) => `${c.id} ${c.name}`)];
const PARTNER_OPTIONS = [ALL_PARTNERS, ...Array.from(new Set(SETTLEMENTS.map((s) => s.partner)))];

const won = (n: number) => `₩${fmt(n)}`;
const man = (n: number) => fmt(Math.round(n / 10_000));
const extrasOf = (s: Settlement) => s.extras.reduce((a, e) => a + e.amount, 0);
const totalOf = (s: Settlement) => s.base + extrasOf(s);

export function SettlementScreen() {
  const [period, setPeriod] = useState<PeriodKey>("2026-03");
  const [center, setCenter] = useState(ALL_CENTERS);
  const [partner, setPartner] = useState(ALL_PARTNERS);
  const [statusOverride, setStatusOverride] = useState<Record<string, { status: SettlementStatus; confirmedAt?: string }>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recalcAt, setRecalcAt] = useState<string | null>(null);
  const [rateOpen, setRateOpen] = useState(false);

  const periodInfo = SETTLEMENT_PERIODS.find((p) => p.key === period)!;

  const rows = useMemo(() => {
    const centerId = center === ALL_CENTERS ? null : (center.slice(0, 3) as CenterId);
    return SETTLEMENTS.filter(
      (s) =>
        s.period === period && (!centerId || s.centerId === centerId) && (partner === ALL_PARTNERS || s.partner === partner),
    ).map((s) => ({ ...s, ...statusOverride[s.id] }));
  }, [period, center, partner, statusOverride]);

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  const base = rows.reduce((a, r) => a + r.base, 0);
  const extras = rows.reduce((a, r) => a + extrasOf(r), 0);
  const count = rows.reduce((a, r) => a + r.count, 0);
  const confirmed = rows.filter((r) => r.status === "확정").length;

  const advance = (s: Settlement) => {
    const next = STATUS_FLOW[STATUS_FLOW.indexOf(s.status) + 1];
    if (!next) return;
    setStatusOverride((o) => ({ ...o, [s.id]: { status: next, confirmedAt: next === "확정" ? "2026.04.15" : undefined } }));
  };

  return (
    <div className="space-y-8">
      <PageHead
        code="03 통합"
        title="물류비 자동 정산"
        desc="수집된 입고 및 출고 데이터를 기준으로 물류비를 자동 산정하고, 기간별 정산 내역을 조회합니다."
        actions={
          <>
            <Button variant="outline" icon="solar:tag-price-linear" onClick={() => setRateOpen(true)}>
              단가 기준표
            </Button>
            <Button variant="primary" icon="solar:calculator-linear" onClick={() => setRecalcAt("14:36")}>
              {recalcAt ? `${recalcAt} 재산정 완료` : "물류비 산정 실행"}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            value={period}
            onChange={(v) => {
              setPeriod(v);
              setSelectedId(null);
            }}
            items={SETTLEMENT_PERIODS.map((p) => ({ key: p.key, label: p.label }))}
          />
          <span className="ls-num text-[12px] text-[var(--ls-muted)]">정산 기간 {periodInfo.range}</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select label="물류센터" value={center} options={CENTER_OPTIONS} onChange={(v) => { setCenter(v); setSelectedId(null); }} />
          <Select label="거래처" value={partner} options={PARTNER_OPTIONS} onChange={(v) => { setPartner(v); setSelectedId(null); }} />
        </div>
      </div>

      <Flow collected={Math.round(count * 1.037)} target={count} rates={rows.length} total={base + extras} settlements={rows.length} />

      <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
        <SpecCell label="총 물류비" value={man(base + extras)} unit="만원" sub={won(base + extras)} />
        <SpecCell label="추가 비용" value={man(extras)} unit="만원" sub={base ? `${won(extras)} | 기본 대비 ${((extras / base) * 100).toFixed(1)}%` : "해당 없음"} />
        <SpecCell label="정산 대상 건수" value={fmt(count)} unit="건" />
        <SpecCell
          label="확정 정산"
          value={`${confirmed} / ${rows.length}`}
          unit="건"
          sub={confirmed === rows.length && rows.length ? "전체 확정" : "미확정 포함"}
          subTone={confirmed === rows.length && rows.length ? "ok" : "info"}
        />
      </div>

      <Panel
        title="정산 내역"
        flush
      >
        <Table
          head={["정산 ID", "센터 / 거래처", "정산 기준 / 적용 단가", "대상 건수 (건)", "정산 금액 (원)", "상태"]}
          align={["left", "left", "left", "right", "right", "left"]}
          minWidth={980}
        >
          {rows.map((r) => {
            const on = r.id === selected?.id;
            return (
              <Row key={r.id} onClick={() => setSelectedId(r.id)} selected={on}>
                <Cell first selected={on}>
                  <p className="ls-code whitespace-nowrap text-[12px] text-[var(--ls-ink)]">{r.id}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">{periodInfo.label} 정산</p>
                </Cell>
                <Cell>
                  <CenterTag id={r.centerId} />
                  <p className="mt-1 max-w-[220px] truncate text-[12px] text-[var(--ls-muted)]">{r.partner}</p>
                </Cell>
                <Cell>
                  <p className="text-[var(--ls-ink)]">
                    {r.basis} {fmt(r.basisTotal)}
                    {r.basisUnit}
                  </p>
                  <p className="ls-num mt-0.5 text-[12px] text-[var(--ls-muted)]">
                    {r.basisUnit}당 {won(r.rate)}
                  </p>
                </Cell>
                <Cell align="right">
                  <span className="ls-num">{fmt(r.count)}</span>
                </Cell>
                <Cell align="right">
                  <p className="ls-num font-semibold text-[var(--ls-ink)]">{fmt(totalOf(r))}</p>
                  <p className="ls-num mt-0.5 text-[11px] text-[var(--ls-muted)]">
                    {extrasOf(r) ? `추가 ${fmt(extrasOf(r))}` : "추가 비용 없음"}
                  </p>
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                  {r.confirmedAt && <p className="ls-num mt-1 text-[11px] text-[var(--ls-muted)]">{r.confirmedAt}</p>}
                </Cell>
              </Row>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-14 text-center text-[13px] text-[var(--ls-muted)]">
                조건에 맞는 정산 내역이 없습니다. 센터나 거래처 필터를 바꿔 보세요.
              </td>
            </tr>
          )}
        </Table>
      </Panel>

      {selected && <SettlementDetail key={selected.id} s={selected} onAdvance={() => advance(selected)} />}

      <RateDrawer open={rateOpen} onClose={() => setRateOpen(false)} />
    </div>
  );
}

function Flow({
  collected,
  target,
  rates,
  total,
  settlements,
}: {
  collected: number;
  target: number;
  rates: number;
  total: number;
  settlements: number;
}) {
  const steps = [
    { icon: "solar:inbox-in-linear", label: "입출고 데이터 수집 (건)", value: fmt(collected) },
    { icon: "solar:filter-linear", label: "정산 대상 집계 (건)", value: fmt(target) },
    { icon: "solar:tag-price-linear", label: "단가 적용 (건)", value: String(rates) },
    { icon: "solar:calculator-linear", label: "물류비 자동 산정 (원)", value: fmt(total) },
    { icon: "solar:document-text-linear", label: "정산 내역 조회 (건)", value: String(settlements) },
  ];
  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {steps.map((s, i) => (
        <li
          key={s.label}
          className="ls-stagger relative flex items-center gap-3 rounded-2xl bg-[var(--ls-surface)] px-4 py-4 shadow-[var(--ls-shadow)]"
          style={{ "--i": i } as React.CSSProperties}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              i === 3 ? "bg-[var(--ls-primary-soft)] text-[var(--ls-primary)]" : "bg-[var(--ls-canvas)] text-[var(--ls-body-strong)]"
            }`}
          >
            <I icon={s.icon} size={18} />
          </span>
          <span className="min-w-0">
            <span className="ls-num block text-[11px] text-[var(--ls-muted)]">
              {String(i + 1).padStart(2, "0")} {s.label}
            </span>
            <span className="ls-figure mt-0.5 block truncate text-[16px] text-[var(--ls-ink)]">{s.value}</span>
          </span>
          {i < steps.length - 1 && (
            <I icon="solar:alt-arrow-right-linear" size={16} className="absolute -right-[14px] z-10 hidden text-[var(--ls-disabled)] xl:block" />
          )}
        </li>
      ))}
    </ol>
  );
}

function SettlementDetail({ s, onAdvance }: { s: Settlement; onAdvance: () => void }) {
  const c = CENTER_BY_ID[s.centerId];
  const extras = extrasOf(s);
  const step = STATUS_FLOW.indexOf(s.status);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <Panel title="산출 근거">
        <div className="flex gap-3 overflow-hidden rounded-xl bg-[var(--ls-canvas)]">
          <Photo id={c.photo} alt={`${c.name} 물류 동선`} w={144} h={144} sizes="72px" className="h-[72px] w-[72px] shrink-0" />
          <div className="min-w-0 py-2.5 pr-3">
            <CenterTag id={c.id} />
            <p className="mt-1 truncate text-[12px] text-[var(--ls-body)]">{s.partner}</p>
            <p className="ls-code mt-0.5 text-[11px] text-[var(--ls-muted)]">{s.id}</p>
          </div>
        </div>

        {/* 산식을 숫자 그대로 보여준다 */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="text-[var(--ls-body)]">정산 대상 {s.basis}</span>
            <span className="ls-num text-[var(--ls-ink)]">
              {fmt(s.basisTotal)} {s.basisUnit}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="text-[var(--ls-body)]">× 적용 단가</span>
            <span className="ls-num text-[var(--ls-ink)]">
              {won(s.rate)} / {s.basisUnit}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-[var(--ls-hairline-soft)] pt-2.5 text-[13px]">
            <span className="font-semibold text-[var(--ls-ink)]">기본 물류비</span>
            <span className="ls-num font-semibold text-[var(--ls-ink)]">{won(s.base)}</span>
          </div>
          {s.extras.map((e) => (
            <div key={e.label} className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-[var(--ls-body)]">+ {e.label}</span>
              <span className="ls-num text-[var(--ls-ink)]">{won(e.amount)}</span>
            </div>
          ))}
          {s.extras.length === 0 && <p className="text-[12px] text-[var(--ls-muted)]">이 계약에는 추가 비용 항목이 없습니다.</p>}
        </div>

        <div className="mt-4 flex items-baseline justify-between rounded-xl bg-[var(--ls-canvas)] px-4 py-3.5">
          <span className="text-[13px] font-bold text-[var(--ls-ink)]">총 물류비 (원)</span>
          <span className="ls-figure text-[24px] leading-8 text-[var(--ls-ink)]">{fmt(s.base + extras)}</span>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[12px] text-[var(--ls-muted)]">정산 상태</p>
          <ol className="grid grid-cols-3 gap-2">
            {STATUS_FLOW.map((st, i) => (
              <li key={st}>
                <span className="block h-[6px] rounded-full" style={{ background: i <= step ? "var(--ls-ink)" : "var(--ls-elevated)" }} />
                <span className={`mt-2 block text-[12px] ${i === step ? "font-bold text-[var(--ls-ink)]" : "text-[var(--ls-muted)]"}`}>{st}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4">
            {s.status === "예정" && (
              <Button variant="secondary" icon="solar:clipboard-check-linear" onClick={onAdvance} full>
                검토 요청
              </Button>
            )}
            {s.status === "검토" && (
              <Button variant="primary" icon="solar:lock-keyhole-minimalistic-linear" onClick={onAdvance} full>
                정산 확정
              </Button>
            )}
            {s.status === "확정" && (
              <p className="flex items-center gap-2 rounded-xl bg-[var(--ls-ok-bg)] px-4 py-3 text-[12px] text-[var(--ls-ok-fg)]">
                <I icon="solar:lock-keyhole-minimalistic-linear" size={16} />
                {s.confirmedAt} 확정. 이 기간의 데이터 기준으로 금액이 보존됩니다.
              </p>
            )}
          </div>
        </div>
      </Panel>

      <Panel
        title="산출 대상 입출고 데이터"
        flush
        action={
          <span className="ls-num text-[12px] text-[var(--ls-muted)]">
            {fmt(s.count)}건 중 최근 {s.lines.length}건
          </span>
        }
      >
        <Table head={["통합 ID", "상품", `${s.basis} (${s.basisUnit})`, "원천 수집 시점", "금액 (원)"]} align={["left", "left", "right", "left", "right"]} minWidth={640}>
          {s.lines.map((l) => (
            <Row key={l.unifiedId}>
              <Cell>
                <p className="ls-code whitespace-nowrap text-[12px] text-[var(--ls-ink)]">{l.unifiedId}</p>
                <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">{l.movement}</p>
              </Cell>
              <Cell>
                <p className="max-w-[180px] truncate text-[var(--ls-ink)]">{l.product}</p>
                <p className="ls-num mt-0.5 text-[12px] text-[var(--ls-muted)]">
                  {fmt(l.qty)} {l.unit} | {fmt(l.weightKg)}kg
                </p>
              </Cell>
              <Cell align="right">
                <span className="ls-num">{fmt(l.basisValue)}</span>
              </Cell>
              <Cell>
                <CenterTag id={s.centerId} withName={false} />
                <p className="ls-num mt-1 text-[12px] text-[var(--ls-muted)]">2026.{l.collectedAt}</p>
              </Cell>
              <Cell align="right">
                <span className="ls-num font-semibold text-[var(--ls-ink)]">{fmt(l.amount)}</span>
              </Cell>
            </Row>
          ))}
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--ls-canvas)] px-6 py-4 text-[12px]">
          <span className="flex items-center gap-2 text-[var(--ls-body)]">
            <I icon="solar:routing-2-linear" size={16} />
            원천 센터 {c.name} | {c.system} | 모든 레코드에 수집 시점 보존
          </span>
          <Code className="text-[11px]">{s.basis} × {won(s.rate)}</Code>
        </div>
      </Panel>
    </div>
  );
}

function RateDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="물류센터, 거래처별 기본 단가"
      footer={
        <Button variant="ghost" onClick={onClose}>
          닫기
        </Button>
      }
    >
      <ul className="space-y-3">
        {RATE_CARD.map((r) => (
          <li key={r.centerId + r.partner} className="rounded-xl bg-[var(--ls-canvas)] px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <CenterTag id={r.centerId} />
              <span className="ls-num text-[15px] font-bold text-[var(--ls-ink)]">
                {won(r.rate)}
                <span className="ml-1 text-[12px] font-medium text-[var(--ls-muted)]">/ {r.basisUnit}</span>
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-[var(--ls-body)]">
              {r.partner} | {r.basis} 기준 | {r.appliedFrom} 적용
            </p>
            {r.extras.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.extras.map((e) => (
                  <span key={e} className="rounded-full bg-[var(--ls-elevated)] px-2.5 py-0.5 text-[11px] text-[var(--ls-body-strong)]">
                    + {e}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Drawer>
  );
}
