import type { Confidence, FloorId, PlanItem, SlabItem, UploadedFile, WallItem } from "@/projects/platform/drawqty/lib/types";

/* 건물 외곽 46.0 x 25.2 m. 도면 좌표는 모두 이 건물의 좌상단을 원점으로 한 미터 단위. */
export const BLD = { w: 46.0, d: 25.2 };

export const FLOORS: FloorId[] = ["1F", "2F", "3F", "4F", "RF"];

/* 층마다 층고가 다르다 (m) */
export const FLOOR_HEIGHT: Record<FloorId, number> = {
  "1F": 4.2,
  "2F": 3.6,
  "3F": 3.3,
  "4F": 3.2,
  RF: 3.0,
};

/* 층마다 슬래브 구획 면적이 조금씩 다르다 (코어와 설비 샤프트 위치 차이) */
const SLAB_SCALE: Record<FloorId, number> = { "1F": 1, "2F": 0.984, "3F": 0.971, "4F": 0.963, RF: 0.912 };

export const FLOOR_NAME: Record<FloorId, string> = {
  "1F": "1층",
  "2F": "2층",
  "3F": "3층",
  "4F": "4층",
  RF: "옥상",
};

export const SAMPLE_FILE: UploadedFile = {
  name: "성수동근린생활시설_건축_평면도.dwg",
  sizeMb: 4.2,
  floors: "지상 4층, 옥상",
  layers: 38,
};

export function r1(value: number): number {
  return Math.round(value * 10) / 10;
}

const WALLS: Array<{ n: string; label: string; side: WallItem["side"]; from: number; to: number }> = [
  { n: "W1", label: "북측 외벽 가", side: "N", from: 0, to: 23 },
  { n: "W2", label: "북측 외벽 나", side: "N", from: 23, to: 46 },
  { n: "W3", label: "동측 외벽", side: "E", from: 0, to: 25.2 },
  { n: "W4", label: "남측 외벽 가", side: "S", from: 0, to: 23 },
  { n: "W5", label: "남측 외벽 나", side: "S", from: 23, to: 46 },
  { n: "W6", label: "서측 외벽", side: "W", from: 0, to: 25.2 },
];

/* 내벽 안쪽 슬래브 4구획. 중앙 좌측 큰 구획 두 개는 RC, 우측 하단 두 개는 데크 */
const SLABS: Array<{ n: string; label: string; type: SlabItem["slabType"]; x: number; y: number; w: number; h: number }> = [
  { n: "S1", label: "슬래브 A", type: "RC", x: 0.4, y: 0.4, w: 20, h: 24.4 },
  { n: "S2", label: "슬래브 B", type: "RC", x: 20.4, y: 0.4, w: 25.2, h: 12 },
  { n: "S3", label: "슬래브 C", type: "DECK", x: 20.4, y: 12.4, w: 17.6, h: 12.4 },
  { n: "S4", label: "슬래브 D", type: "DECK", x: 38, y: 12.4, w: 7.6, h: 12.4 },
];

/* 1층 인식 결과: 확인 필요 2개(남측 외벽 나, 슬래브 D), 수동 수정됨 1개(동측 외벽 높이 보정) */
const SEED: Record<string, { confidence: Confidence; heightM?: number }> = {
  "1F-W5": { confidence: "확인 필요" },
  "1F-S4": { confidence: "확인 필요" },
  "1F-W3": { confidence: "수동 수정됨", heightM: 4.5 },
};

export function buildInitialItems(): Record<FloorId, PlanItem[]> {
  const out = {} as Record<FloorId, PlanItem[]>;
  for (const floor of FLOORS) {
    const list: PlanItem[] = [];
    for (const w of WALLS) {
      const id = `${floor}-${w.n}`;
      const seed = SEED[id];
      const heightM = seed?.heightM ?? FLOOR_HEIGHT[floor];
      const lengthM = r1(w.to - w.from);
      list.push({
        kind: "wall",
        id,
        floor,
        label: w.label,
        side: w.side,
        from: w.from,
        to: w.to,
        lengthM,
        heightM,
        areaM2: r1(lengthM * heightM),
        confidence: seed?.confidence ?? "높음",
      });
    }
    for (const s of SLABS) {
      const id = `${floor}-${s.n}`;
      const seed = SEED[id];
      list.push({
        kind: "slab",
        id,
        floor,
        label: s.label,
        slabType: s.type,
        rect: { x: s.x, y: s.y, w: s.w, h: s.h },
        areaM2: r1(s.w * s.h * SLAB_SCALE[floor]),
        heightM: seed?.heightM ?? FLOOR_HEIGHT[floor],
        confidence: seed?.confidence ?? "높음",
      });
    }
    out[floor] = list;
  }
  return out;
}

/* "구간 추가"는 정해진 위치(남측 계단실 돌출부)에 영역이 생기는 연출 */
export const MANUAL_REGION = { x: 30, y: 25.2, w: 6.4, h: 2.4 };
export const MANUAL_LENGTH = 11.2;

export function manualSegment(floor: FloorId, heightM: number): WallItem {
  return {
    kind: "wall",
    id: `${floor}-X1`,
    floor,
    label: "남측 계단실 돌출부",
    side: "S",
    from: 0,
    to: 0,
    lengthM: MANUAL_LENGTH,
    heightM,
    areaM2: r1(MANUAL_LENGTH * heightM),
    confidence: "수동 수정됨",
    region: MANUAL_REGION,
  };
}
