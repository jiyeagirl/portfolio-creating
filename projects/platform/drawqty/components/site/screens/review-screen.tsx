"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus } from "@phosphor-icons/react";
import { allItems, totalsFor } from "@/projects/platform/drawqty/lib/calc";
import { fmt } from "@/projects/platform/drawqty/lib/format";
import { FLOORS, FLOOR_HEIGHT, MANUAL_LENGTH, r1, SAMPLE_FILE } from "@/projects/platform/drawqty/lib/plan-data";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import { PlanViewer } from "@/projects/platform/drawqty/components/site/plan-viewer";
import { Button, ConfidenceChip, Field, Segmented } from "@/projects/platform/drawqty/components/site/ui";
import type { FloorId, PlanItem } from "@/projects/platform/drawqty/lib/types";

export function ReviewScreen({
  initialFloor,
  initialSelected,
  initialAdding,
  onBack,
  onNext,
}: {
  initialFloor: FloorId;
  initialSelected: string | null;
  initialAdding: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const { items, file, targets, updateItem, addManualSegment } = useStore();
  const [floor, setFloor] = useState<FloorId>(initialFloor);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected);
  const [adding, setAdding] = useState(initialAdding);
  const listRef = useRef<HTMLDivElement>(null);

  const list = items[floor];
  const walls = list.filter((i) => i.kind === "wall");
  const slabs = list.filter((i) => i.kind === "slab");
  const totals = useMemo(() => totalsFor(allItems(items)), [items]);
  const floorNeedCheck = list.filter((i) => i.confidence === "확인 필요").length;
  const hasManualSegment = list.some((i) => i.id === `${floor}-X1`);

  useEffect(() => {
    if (!selectedId) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-item="${selectedId}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  function changeFloor(next: FloorId) {
    setFloor(next);
    setSelectedId(null);
    setAdding(false);
  }

  return (
    <div className="dq-enter">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">인식 확인, 수정</h1>
        <div className="dq-scroll-x max-w-full overflow-x-auto">
          <Segmented<FloorId>
            value={floor}
            onChange={changeFloor}
            options={FLOORS.map((f) => ({ value: f, label: f }))}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
        <PlanViewer
          floor={floor}
          items={list}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAdding(false);
          }}
          fileName={file?.name ?? SAMPLE_FILE.name}
        />

        <section className="overflow-hidden rounded-[12px] border border-[var(--dq-line)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--dq-line)] px-4 py-3">
            <h2 className="text-[16px] font-semibold leading-6">인식 결과</h2>
            <p className="whitespace-nowrap text-[13px] text-[var(--dq-ink-3)]">
              구간 {list.length}개{floorNeedCheck > 0 && <span className="font-semibold text-[var(--dq-orange-fg)]">, 확인 필요 {floorNeedCheck}개</span>}
            </p>
          </div>

          <div ref={listRef} className={`lg:overflow-y-auto ${adding && !hasManualSegment ? "lg:max-h-[250px]" : "lg:max-h-[404px]"}`}>
            <GroupHeader title="외벽 (시스템비계)" />
            <ul className="divide-y divide-[var(--dq-line)]">
              {walls.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  selected={selectedId === it.id}
                  onSelect={() => {
                    setSelectedId(selectedId === it.id ? null : it.id);
                    setAdding(false);
                  }}
                  onSave={(h, a) => {
                    updateItem(it.id, { heightM: h, areaM2: a });
                    setSelectedId(null);
                  }}
                  onCancel={() => setSelectedId(null)}
                />
              ))}
            </ul>
            <GroupHeader title="슬래브 (시스템동바리)" />
            <ul className="divide-y divide-[var(--dq-line)]">
              {slabs.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  selected={selectedId === it.id}
                  onSelect={() => {
                    setSelectedId(selectedId === it.id ? null : it.id);
                    setAdding(false);
                  }}
                  onSave={(h, a) => {
                    updateItem(it.id, { heightM: h, areaM2: a });
                    setSelectedId(null);
                  }}
                  onCancel={() => setSelectedId(null)}
                />
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--dq-line)] bg-[var(--dq-surface)] p-4">
            {adding && !hasManualSegment ? (
              <AddForm
                floor={floor}
                onCancel={() => setAdding(false)}
                onAdd={(h) => {
                  addManualSegment(floor, h);
                  setAdding(false);
                  setSelectedId(`${floor}-X1`);
                }}
              />
            ) : (
              <Button
                kind="ghost"
                size="sm"
                className="w-full"
                disabled={hasManualSegment}
                onClick={() => {
                  setSelectedId(null);
                  setAdding(true);
                }}
              >
                <Plus size={16} weight="bold" />
                구간 추가
              </Button>
            )}
          </div>
        </section>
      </div>

      <SummaryBar
        totals={totals}
        targets={targets}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}

function GroupHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between bg-[var(--dq-soft)] px-4 py-2 text-[12px] font-medium text-[var(--dq-ink-3)]">
      <span>{title}</span>
      <span>면적 (㎡)</span>
    </div>
  );
}

function ItemRow({
  item,
  selected,
  onSelect,
  onSave,
  onCancel,
}: {
  item: PlanItem;
  selected: boolean;
  onSelect: () => void;
  onSave: (heightM: number, areaM2: number) => void;
  onCancel: () => void;
}) {
  const sub =
    item.kind === "wall"
      ? `길이 ${fmt(item.lengthM)} m, 높이 ${fmt(item.heightM)} m`
      : `${item.slabType}, 높이 ${fmt(item.heightM)} m`;

  return (
    <li data-item={item.id} className={selected ? "bg-[var(--dq-soft)]" : ""}>
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2 text-left hover:bg-[var(--dq-soft)]"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold">{item.label}</span>
          <span className="block truncate text-[12px] text-[var(--dq-ink-3)]">{sub}</span>
        </span>
        <span className="w-[68px] shrink-0 text-right text-[14px] font-medium tabular-nums">{fmt(item.areaM2)}</span>
        <ConfidenceChip value={item.confidence} />
      </button>
      {selected && <EditForm key={`${item.id}-${item.heightM}-${item.areaM2}`} item={item} onSave={onSave} onCancel={onCancel} />}
    </li>
  );
}

function EditForm({
  item,
  onSave,
  onCancel,
}: {
  item: PlanItem;
  onSave: (heightM: number, areaM2: number) => void;
  onCancel: () => void;
}) {
  const [h, setH] = useState(String(item.heightM));
  const [a, setA] = useState(String(item.areaM2));
  const [touchedArea, setTouchedArea] = useState(false);

  const hNum = Number(h);
  const aNum = Number(a);
  const valid = hNum > 0 && aNum > 0 && Number.isFinite(hNum) && Number.isFinite(aNum);
  const volume = item.kind === "slab" && valid ? r1(aNum * hNum) : null;

  return (
    <div className="px-4 pb-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="높이 (m)"
          value={h}
          inputMode="decimal"
          onChange={(v) => {
            setH(v);
            const n = Number(v);
            if (item.kind === "wall" && !touchedArea && n > 0) setA(String(r1(item.lengthM * n)));
          }}
        />
        <Field
          label="면적 (㎡)"
          value={a}
          inputMode="decimal"
          onChange={(v) => {
            setA(v);
            setTouchedArea(true);
          }}
        />
      </div>
      {volume !== null && (
        <p className="mt-2 text-[13px] text-[var(--dq-ink-2)]">
          동바리 체적 (㎥) <span className="font-semibold text-[var(--dq-ink)]">{fmt(volume)}</span>
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" disabled={!valid} onClick={() => onSave(hNum, aNum)}>
          <Check size={15} weight="bold" />
          저장
        </Button>
        <Button size="sm" kind="text" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}

function AddForm({ floor, onAdd, onCancel }: { floor: FloorId; onAdd: (h: number) => void; onCancel: () => void }) {
  const [h, setH] = useState(String(FLOOR_HEIGHT[floor]));
  const hNum = Number(h);
  return (
    <div>
      <p className="text-[14px] font-semibold">남측 계단실 돌출부</p>
      <p className="text-[12px] text-[var(--dq-ink-3)]">둘레 {fmt(MANUAL_LENGTH)} m</p>
      <div className="mt-3 flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Field label="높이 (m)" value={h} inputMode="decimal" onChange={setH} />
        </div>
        <Button disabled={!(hNum > 0)} onClick={() => onAdd(hNum)}>
          추가
        </Button>
      </div>
      <Button kind="text" size="sm" className="mt-1" onClick={onCancel}>
        취소
      </Button>
    </div>
  );
}

function SummaryBar({
  totals,
  targets,
  onBack,
  onNext,
}: {
  totals: ReturnType<typeof totalsFor>;
  targets: { scaffold: boolean; shoring: boolean };
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 border-t border-[var(--dq-line-strong)] bg-[var(--dq-surface)] lg:sticky lg:bottom-0 lg:z-20">
      <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <dl className="grid grid-cols-3 gap-4 lg:flex lg:gap-10">
          <Metric label="시스템비계 면적 (㎡)" value={targets.scaffold ? fmt(totals.scaffoldArea) : "-"} />
          <Metric label="동바리 RC (㎥)" value={targets.shoring ? fmt(totals.rcVolume) : "-"} />
          <Metric label="동바리 DECK (㎥)" value={targets.shoring ? fmt(totals.deckVolume) : "-"} />
        </dl>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p className="hidden whitespace-nowrap text-[13px] text-[var(--dq-ink-2)] sm:block">
            {totals.needCheck > 0 ? (
              <>
                확인 필요 <span className="font-semibold text-[var(--dq-orange-fg)]">{totals.needCheck}개</span>
              </>
            ) : (
              "확인 필요 구간 없음"
            )}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button kind="ghost" onClick={onBack}>
              이전
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={onNext}>물량 결과 보기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[12px] text-[var(--dq-ink-3)]">{label}</dt>
      <dd className="mt-0.5 text-[18px] font-semibold leading-7 tabular-nums sm:text-[20px]">{value}</dd>
    </div>
  );
}
