import { FLOORS, r1 } from "@/projects/platform/drawqty/lib/plan-data";
import type { FloorId, PlanItem, Targets, Totals } from "@/projects/platform/drawqty/lib/types";

/* 수량: 외벽은 비계 면적(㎡), 슬래브는 면적 x 내부 높이로 구한 동바리 체적(㎥) */
export function itemQty(item: PlanItem): number {
  return item.kind === "wall" ? item.areaM2 : r1(item.areaM2 * item.heightM);
}

export function totalsFor(items: PlanItem[]): Totals {
  const t: Totals = {
    scaffoldLength: 0,
    scaffoldArea: 0,
    rcArea: 0,
    rcVolume: 0,
    deckArea: 0,
    deckVolume: 0,
    needCheck: 0,
  };
  for (const it of items) {
    if (it.confidence === "확인 필요") t.needCheck += 1;
    if (it.kind === "wall") {
      t.scaffoldLength += it.lengthM;
      t.scaffoldArea += it.areaM2;
    } else if (it.slabType === "RC") {
      t.rcArea += it.areaM2;
      t.rcVolume += itemQty(it);
    } else {
      t.deckArea += it.areaM2;
      t.deckVolume += itemQty(it);
    }
  }
  return {
    scaffoldLength: r1(t.scaffoldLength),
    scaffoldArea: r1(t.scaffoldArea),
    rcArea: r1(t.rcArea),
    rcVolume: r1(t.rcVolume),
    deckArea: r1(t.deckArea),
    deckVolume: r1(t.deckVolume),
    needCheck: t.needCheck,
  };
}

export function allItems(items: Record<FloorId, PlanItem[]>): PlanItem[] {
  return FLOORS.flatMap((f) => items[f]);
}

export interface ResultRow {
  floor: FloorId;
  /* 구분 라벨과 대상 보조 줄 */
  group: "시스템비계" | "동바리 RC" | "동바리 DECK";
  target: string;
  length: number | null;
  area: number;
  height: number;
  qty: number;
  unit: "㎡" | "㎥";
}

export function resultRows(items: Record<FloorId, PlanItem[]>, targets: Targets): ResultRow[] {
  const rows: ResultRow[] = [];
  for (const floor of FLOORS) {
    const list = items[floor];
    const walls = list.filter((i) => i.kind === "wall");
    const rc = list.filter((i) => i.kind === "slab" && i.slabType === "RC");
    const deck = list.filter((i) => i.kind === "slab" && i.slabType === "DECK");
    if (targets.scaffold && walls.length > 0) {
      const area = r1(walls.reduce((s, i) => s + i.areaM2, 0));
      const length = r1(walls.reduce((s, i) => s + (i.kind === "wall" ? i.lengthM : 0), 0));
      rows.push({
        floor,
        group: "시스템비계",
        target: `외벽 ${walls.length}구간`,
        length,
        area,
        height: r1(area / length),
        qty: area,
        unit: "㎡",
      });
    }
    if (targets.shoring) {
      for (const [group, set] of [
        ["동바리 RC", rc],
        ["동바리 DECK", deck],
      ] as const) {
        if (set.length === 0) continue;
        const area = r1(set.reduce((s, i) => s + i.areaM2, 0));
        const qty = r1(set.reduce((s, i) => s + itemQty(i), 0));
        rows.push({
          floor,
          group,
          target: `슬래브 ${set.length}구획`,
          length: null,
          area,
          height: r1(qty / area),
          qty,
          unit: "㎥",
        });
      }
    }
  }
  return rows;
}

export function floorTotals(items: Record<FloorId, PlanItem[]>): Array<{ floor: FloorId; scaffold: number; shoring: number }> {
  return FLOORS.map((floor) => {
    const t = totalsFor(items[floor]);
    return { floor, scaffold: t.scaffoldArea, shoring: r1(t.rcVolume + t.deckVolume) };
  });
}
