/* 도보 경로 mock. 실제 경로 API 대신 추상화 지도 캔버스(0~100) 위의 폴리라인
   웨이포인트와 구간 안내 텍스트를 목적지별로 미리 적어둔다. 도로명은 전부 가상이며
   상점가 구역 코드와만 연결된다(spec.md 8절). */

import type { Point } from "./types";
import { QR_POINT, destinationById } from "./mock-data";

export type Maneuver = "start" | "straight" | "left" | "right" | "cross" | "arrive";

export interface RouteStep {
  maneuver: Maneuver;
  title: string;
  detail: string;
  /** 이 구간 거리(m) */
  distance: number;
}

export interface WalkRoute {
  waypoints: Point[];
  steps: RouteStep[];
  distance: number;
  minutes: number;
  /** 경사, 계단 등 보행 약자 관련 특이사항 */
  notes: string[];
}

const ROUTES: Record<string, { waypoints: Point[]; steps: RouteStep[]; notes: string[] }> = {
  "fc-aed-1": {
    waypoints: [
      { x: 46, y: 58 },
      { x: 48, y: 55 },
      { x: 51, y: 53 },
      { x: 52, y: 50 },
    ],
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: "△△동 시장 입구 버스정류장 승차대 앞", distance: 0 },
      { maneuver: "straight", title: "중앙로 방향으로 직진", distance: 40, detail: "정류장을 등지고 큰길을 따라 40m" },
      { maneuver: "cross", title: "횡단보도 건너기", distance: 18, detail: "신호 대기 있음. 보도 폭 넓음" },
      { maneuver: "right", title: "주민센터 진입로에서 우회전", distance: 34, detail: "청사 주차장 입구를 지나 계단 없이 진입" },
      { maneuver: "arrive", title: "△△동 주민센터 도착", distance: 0, detail: "1층 로비 안내데스크 옆 벽면에 설치" },
    ],
    notes: ["전 구간 계단 없음", "로비 진입까지 경사 3% 이하"],
  },
  "fc-wc-1": {
    waypoints: [
      { x: 46, y: 58 },
      { x: 45, y: 61 },
      { x: 43, y: 63 },
    ],
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: "△△동 시장 입구 버스정류장 승차대 앞", distance: 0 },
      { maneuver: "left", title: "시장 입구 아치에서 좌회전", distance: 46, detail: "아치 아래로 들어가 아케이드 진입" },
      { maneuver: "arrive", title: "A 상점가 공중화장실 도착", distance: 28, detail: "아치 왼편 단독 건물. 05:00~24:00 개방" },
    ],
    notes: ["아케이드 아래라 우천 시에도 젖지 않음", "입구 턱 2cm"],
  },
  "fc-rest-1": {
    waypoints: [
      { x: 46, y: 58 },
      { x: 47, y: 55 },
    ],
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: "△△동 시장 입구 버스정류장 승차대 앞", distance: 0 },
      { maneuver: "arrive", title: "정류장 그늘막쉼터 도착", distance: 15, detail: "같은 승차대 안. 차양막과 벤치 2석" },
    ],
    notes: ["QR 지점과 같은 승차대"],
  },
  "fc-aed-3": {
    waypoints: [
      { x: 46, y: 58 },
      { x: 52, y: 60 },
      { x: 58, y: 63 },
      { x: 62, y: 67 },
      { x: 64, y: 70 },
    ],
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: "△△동 시장 입구 버스정류장 승차대 앞", distance: 0 },
      { maneuver: "straight", title: "상점가 아케이드 통과", distance: 132, detail: "2구역 중앙로를 따라 직진" },
      { maneuver: "left", title: "4구역 갈림길에서 좌회전", distance: 96, detail: "문구사 간판을 지나 주차장 진입로로" },
      { maneuver: "cross", title: "주차장 진입로 횡단", distance: 42, detail: "차량 출입 잦음. 좌우 확인" },
      { maneuver: "arrive", title: "공영주차장 관리동 도착", distance: 57, detail: "북측 단층 건물 외벽. 24시간 접근 가능" },
    ],
    notes: ["차량 출입로 1회 횡단", "야간 조명 있음"],
  },
  "st-a-01": {
    waypoints: [
      { x: 46, y: 58 },
      { x: 45, y: 60 },
      { x: 44, y: 61 },
    ],
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: "△△동 시장 입구 버스정류장 승차대 앞", distance: 0 },
      { maneuver: "left", title: "시장 입구 아치에서 좌회전", distance: 30, detail: "아치 아래 진입" },
      { maneuver: "arrive", title: "A 시장 입구 청과상회 도착", distance: 15, detail: "아치 오른편 첫 점포" },
    ],
    notes: ["전 구간 평지"],
  },
};

/** 미리 적어둔 경로가 없는 목적지는 QR 지점에서 직선으로 잇고 안내를 요약한다. */
function fallbackRoute(targetId: string): WalkRoute | undefined {
  const target = destinationById(targetId);
  if (!target) return undefined;
  const mid: Point = {
    x: (QR_POINT.coordinates.x + target.coordinates.x) / 2 + 3,
    y: (QR_POINT.coordinates.y + target.coordinates.y) / 2 - 2,
  };
  const half = Math.round(target.distance / 2);
  return {
    waypoints: [QR_POINT.coordinates, mid, target.coordinates],
    distance: target.distance,
    minutes: target.walkMinutes,
    steps: [
      { maneuver: "start", title: "QR 지점에서 출발", detail: QR_POINT.label, distance: 0 },
      { maneuver: "straight", title: "중앙로 방향으로 직진", detail: "보도를 따라 이동", distance: half },
      { maneuver: "right", title: "골목 진입로에서 우회전", detail: "간판을 확인하며 진입", distance: target.distance - half },
      { maneuver: "arrive", title: `${target.name} 도착`, detail: target.relativeLocation, distance: 0 },
    ],
    notes: ["보도 폭 2m 이상", "야간 조명 있음"],
  };
}

export function routeTo(targetId: string): WalkRoute | undefined {
  const target = destinationById(targetId);
  if (!target) return undefined;
  const preset = ROUTES[targetId];
  if (!preset) return fallbackRoute(targetId);
  return {
    waypoints: preset.waypoints,
    steps: preset.steps,
    notes: preset.notes,
    distance: target.distance,
    minutes: target.walkMinutes,
  };
}
