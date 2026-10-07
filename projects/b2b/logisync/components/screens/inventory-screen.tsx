"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Cell,
  CenterTag,
  I,
  LineChart,
  Meter,
  PageHead,
  Panel,
  Photo,
  Row,
  Segmented,
  SpecBand,
  SpecCell,
  Sparkline,
  Table,
} from "@/projects/b2b/logisync/components/ui";
import type { IconName } from "@/projects/b2b/logisync/lib/icons";
import { DAILY, INVENTORY, MAPPINGS, STOCK_EVENTS } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { InventoryRow, StockEvent, Tone } from "@/projects/b2b/logisync/lib/types";

const PHOTO_BY_STD = Object.fromEntries(MAPPINGS.filter((m) => m.photo).map((m) => [m.std, m.photo as number]));

const EVENT_ICON: Record<StockEvent["kind"], IconName> = {
  입고: "tray-arrow-down",
  출고: "tray-arrow-up",
  조정: "sliders-horizontal",
  이동: "arrows-left-right",
};

function health(r: InventoryRow): { tone: Tone; label: string } {
  if (r.onHand < 0) return { tone: "danger", label: "이상 데이터" };
  if (r.onHand < r.safety) return { tone: "danger", label: "재고 부족" };
  if (r.anomaly) return { tone: "warn", label: r.anomaly };
  return { tone: "ok", label: "정상" };
}

type Scope = "all" | "alert";
type Sort = "risk" | "delta";

export function InventoryScreen() {
  const [scope, setScope] = useState<Scope>("all");
  const [sort, setSort] = useState<Sort>("risk");
  const [key, setKey] = useState(`${INVENTORY[1].std}-${INVENTORY[1].centerId}`);

  const rows = useMemo(() => {
    const list = INVENTORY.filter((r) => scope === "all" || health(r).tone !== "ok");
    return [...list].sort((a, b) =>
      sort === "delta" ? Math.abs(b.delta) - Math.abs(a.delta) : a.onHand / a.safety - b.onHand / b.safety,
    );
  }, [scope, sort]);

  const selected = INVENTORY.find((r) => `${r.std}-${r.centerId}` === key) ?? INVENTORY[0];
  const alerts = INVENTORY.filter((r) => health(r).tone !== "ok").length;
  const short = INVENTORY.filter((r) => r.onHand < r.safety).length;

  return (
    <div className="space-y-8">
      <PageHead
        title="재고 현황 관리"
        actions={
          <>
            <Button variant="outline" icon="calendar-blank">
              04.02 ~ 04.15
            </Button>
            <Button variant="primary" icon="bell-ringing">
              부족 알림 설정
            </Button>
          </>
        }
      />

      <SpecBand cols={4}>
        <SpecCell label="관리 표준 상품" value="4,812" unit="SKU" />
        <SpecCell label="오늘 재고 순변동" value="−9,352" unit="EA" sub="입고 59,176 | 출고 68,528" />
        <SpecCell label="안전재고 미달" value={String(short)} unit="건" sub="평택 원두, 용인 채소 믹스" subTone="danger" />
        <SpecCell label="이상 데이터" value={String(alerts - short)} unit="건" sub="음수 재고, 장시간 미갱신" subTone="warn" />
      </SpecBand>

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel flush>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
            <Segmented
              value={scope}
              onChange={setScope}
              items={[
                { key: "all", label: `센터별 전체 ${INVENTORY.length}` },
                { key: "alert", label: `주의 필요 ${alerts}` },
              ]}
            />
            <Segmented
              value={sort}
              onChange={setSort}
              items={[
                { key: "risk", label: "안전재고 대비순" },
                { key: "delta", label: "변동량순" },
              ]}
            />
          </div>
          <Table head={["표준 상품", "센터", "현재 / 안전재고", "오늘 변동", "14일 추이", "상태"]} align={["left", "left", "left", "right", "left", "left"]} minWidth={980}>
            {rows.map((r) => {
              const k = `${r.std}-${r.centerId}`;
              const on = k === key;
              const h = health(r);
              const photo = PHOTO_BY_STD[r.std];
              return (
                <Row key={k} onClick={() => setKey(k)} selected={on}>
                  <Cell first selected={on}>
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <Photo id={photo} alt={r.product} w={80} h={80} sizes="40px" className="h-10 w-10 shrink-0 rounded-[10px]" />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--ls-elevated)] text-[var(--ls-muted)]">
                          <I icon="package" size={16} />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="max-w-[190px] truncate text-[var(--ls-ink)]">{r.product}</p>
                        <p className="ls-code mt-0.5 text-[11px] text-[var(--ls-muted)]">{r.std}</p>
                      </div>
                    </div>
                  </Cell>
                  <Cell>
                    <CenterTag id={r.centerId} withName={false} />
                  </Cell>
                  <Cell className="w-[200px]">
                    <p className="ls-num flex items-baseline justify-between">
                      <span className="text-[14px] font-bold" style={{ color: r.onHand < r.safety ? "var(--ls-danger-fg)" : "var(--ls-ink)" }}>
                        {fmt(r.onHand)}
                      </span>
                      <span className="text-[11px] text-[var(--ls-muted)]">
                        안전 {fmt(r.safety)} {r.unit}
                      </span>
                    </p>
                    <div className="mt-2">
                      <Meter value={Math.max(0, r.onHand)} max={r.safety * 3} marker={r.safety} tone={h.tone === "ok" ? "ink" : h.tone} />
                    </div>
                  </Cell>
                  <Cell align="right">
                    <span className="ls-num font-semibold" style={{ color: r.delta < 0 ? "var(--ls-body-strong)" : "var(--ls-ink)" }}>
                      {r.delta > 0 ? "+" : r.delta < 0 ? "−" : ""}
                      {fmt(Math.abs(r.delta))}
                    </span>
                  </Cell>
                  <Cell>
                    <Sparkline data={r.history} baseline={r.safety} width={112} height={30} color={h.tone === "ok" ? "var(--ls-ink)" : `var(--ls-${h.tone}-fg)`} />
                  </Cell>
                  <Cell>
                    <Badge tone={h.tone}>{h.label}</Badge>
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </Panel>

        <Panel title="재고 변동 이력" flush action={<span className="text-[12px] text-[var(--ls-muted)]">오늘</span>}>
          <ol>
            {STOCK_EVENTS.map((e) => (
              <li key={e.ref} className="flex gap-3 border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ls-elevated)] text-[var(--ls-body-strong)]">
                  <I icon={EVENT_ICON[e.kind]} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[var(--ls-ink)]">
                      {e.kind} <span className="ls-code ml-1 text-[11px] font-normal text-[var(--ls-muted)]">{e.std}</span>
                    </p>
                    <p className="ls-num text-[13px] font-bold" style={{ color: e.qty < 0 ? "var(--ls-body-strong)" : "var(--ls-ink)" }}>
                      {e.qty > 0 ? "+" : "−"}
                      {fmt(Math.abs(e.qty))}
                    </p>
                  </div>
                  <p className="mt-0.5 flex items-center justify-between gap-2 text-[12px] text-[var(--ls-muted)]">
                    <span className="truncate">
                      {e.centerId} | {e.ref}
                    </span>
                    <span className="ls-num shrink-0">
                      {e.at} | 잔량 <span style={{ color: e.after < 0 ? "var(--ls-danger-fg)" : undefined }}>{fmt(e.after)}</span>
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel
        title={`${selected.product} 기간별 재고 변화`}
        action={
          <span className="flex items-center gap-3 text-[12px]">
            <CenterTag id={selected.centerId} />
            <Badge tone={health(selected).tone}>{health(selected).label}</Badge>
          </span>
        }
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <LineChart
            labels={DAILY.labels}
            height={220}
            series={[
              { name: "현재 재고", data: selected.history, color: "var(--ls-ink)" },
              { name: "안전재고", data: selected.history.map(() => selected.safety), color: "var(--ls-primary)", dashed: true },
            ]}
          />
          <dl className="space-y-5 rounded-xl bg-[var(--ls-canvas)] p-5">
            {[
              [`14일 전 (${selected.unit})`, fmt(selected.history[0])],
              [`최저 (${selected.unit})`, fmt(Math.min(...selected.history))],
              [`현재 (${selected.unit})`, fmt(selected.onHand)],
              ["안전재고 대비 (%)", String(Math.round((selected.onHand / selected.safety) * 100))],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] text-[var(--ls-muted)]">{k}</dt>
                <dd className="ls-figure mt-1 text-[22px] leading-7 text-[var(--ls-ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>
    </div>
  );
}
