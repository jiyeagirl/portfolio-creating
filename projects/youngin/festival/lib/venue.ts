import type { Zone } from "@/projects/youngin/festival/lib/types";

/**
 * 행사장 부지도 전용 색. UI 팔레트(styles/festival.css)와 섞지 않는다 — 섞으면
 * 지면색이 카드 배경과 같아져 핀이 배경에 묻힌다. design.md "행사장 지도" 참고.
 */
export const MAP_INK = {
  ground: "#ede6d9",
  lawn: "#d5e0c6",
  lawnDeep: "#c6d5b4",
  forest: "#b9ccac",
  forestDeep: "#a5bc96",
  plaza: "#e2dacb",
  road: "#f5f1e8",
  roadEdge: "#ddd4c4",
  water: "#bfd4de",
  waterEdge: "#a9c3d0",
  building: "#d9cfbe",
  roof: "#c4b7a2",
  outline: "#b3a48d",
  label: "#6b6357",
  labelSoft: "#8a8171",
} as const;

/** SVG 좌표계. 세로형 부지 한 장. */
export const MAP_VIEWBOX = { w: 720, h: 980 } as const;

export const ZOOM = { min: 0.8, max: 2.4, step: 0.3, initial: 1 } as const;

/**
 * 첫 진입 시 화면에 잡히는 지점. 상단 검색바와 하단 시트가 화면을 위아래로 잘라내므로
 * 레이어를 그냥 가운데 두면 방문객이 서 있는 남쪽(안내소, 장터, 체험마당)이 시트 밑으로
 * 내려간다. 레이어를 위로 밀어 현재 위치 주변을 기본 화면에 넣는다.
 */
export const INITIAL_PAN = { x: 12, y: -96 } as const;

/** 방문객 현재 위치 (어울마당 남측 진입로). GPS 대신 고정값으로 둔 목업 값이다. */
export const CURRENT_POSITION = { x: 345, y: 700 } as const;

export const ZONES: Zone[] = [
  { code: "E", name: "묘역 참배길", x: 262, y: 205 },
  { code: "D", name: "전시마당", x: 452, y: 408 },
  { code: "A", name: "어울마당", x: 168, y: 596 },
  { code: "B", name: "전통체험마당", x: 112, y: 812 },
  { code: "C", name: "먹거리장터", x: 362, y: 812 },
  { code: "P", name: "임시주차장", x: 110, y: 945 },
];
