import {
  Barricade,
  DotsThreeOutline,
  Lightbulb,
  PersonSimpleWalk,
  Student,
  Trash,
  Wheelchair,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import { photo } from "@/projects/youngin/street/lib/photos";
import type { HazardType, Report, ReportStatus } from "@/projects/youngin/street/lib/types";

/* 위험 유형 7종. 색은 주지 않는다 — 액센트는 Action Blue 하나뿐이고, 색은 처리 상태에만
   쓴다(design.md "Tokens / 팔레트"). 유형은 아이콘과 라벨로만 구분한다. */
export const HAZARD_TYPES: {
  key: HazardType;
  label: string;
  /** 지도 필터 칩처럼 폭이 좁은 자리에서 쓰는 짧은 라벨. */
  short: string;
  icon: Icon;
  hint: string;
}[] = [
  {
    key: "sidewalk",
    label: "보도블록 파손",
    short: "보도블록",
    icon: Barricade,
    hint: "블록이 깨지거나 들려서 걸려 넘어질 수 있는 곳",
  },
  {
    key: "walkway",
    label: "보행로 불량",
    short: "보행로",
    icon: PersonSimpleWalk,
    hint: "울퉁불퉁한 인도, 단차, 물 고임, 노면 도색 벗겨짐",
  },
  {
    key: "mobility",
    label: "휠체어 / 유모차 이동 불편",
    short: "이동 불편",
    icon: Wheelchair,
    hint: "경사가 급하거나 턱이 높아 바퀴가 넘지 못하는 곳",
  },
  {
    key: "obstruction",
    label: "불법 적치물",
    short: "적치물",
    icon: Trash,
    hint: "인도를 막은 적치물, 입간판, 쌓인 폐기물",
  },
  {
    key: "streetlight",
    label: "가로등 고장",
    short: "가로등",
    icon: Lightbulb,
    hint: "점등되지 않거나 파손된 가로등, 보안등",
  },
  {
    key: "schoolzone",
    label: "어린이보호구역 위험",
    short: "보호구역",
    icon: Student,
    hint: "통학로 시야 가림, 노면 표시 훼손, 보호 울타리 파손",
  },
  {
    key: "etc",
    label: "기타",
    short: "기타",
    icon: DotsThreeOutline,
    hint: "위 항목에 해당하지 않는 보행 불편 사항",
  },
];

export const HAZARD_BY_KEY = Object.fromEntries(
  HAZARD_TYPES.map((t) => [t.key, t]),
) as Record<HazardType, (typeof HAZARD_TYPES)[number]>;

/* 처리 상태 4단계. ink/soft는 styles/street.css의 상태색 토큰을 가리킨다. */
export const STATUS_META: Record<
  ReportStatus,
  { label: string; ink: string; soft: string; caption: string }
> = {
  received: {
    label: "접수 완료",
    ink: "var(--st-received)",
    soft: "var(--st-received-soft)",
    caption: "제보가 등록되었고 담당 부서 배정을 기다리는 중입니다.",
  },
  reviewing: {
    label: "검토 중",
    ink: "var(--st-reviewing)",
    soft: "var(--st-reviewing-soft)",
    caption: "담당 부서가 현장을 확인하고 중복 제보 여부를 검토하고 있습니다.",
  },
  working: {
    label: "처리 중",
    ink: "var(--st-working)",
    soft: "var(--st-working-soft)",
    caption: "보수 작업이 배정되어 진행되고 있습니다.",
  },
  done: {
    label: "처리 완료",
    ink: "var(--st-done)",
    soft: "var(--st-done-soft)",
    caption: "현장 조치가 끝났고 승인된 제보에는 시티포인트가 지급됩니다.",
  },
};

/*
 * 좌표는 전부 city-map.tsx와 같은 viewBox 0 0 393 852 계다.
 *
 * 지도 화면은 위(헤더 카드 + 필터 2줄)와 아래(하단 시트 + 탭바)가 지도를 덮으므로
 * 실제로 보이는 밴드는 y 약 230~620이다. 제보 핀은 전부 이 밴드 안에 둔다 —
 * 밴드 밖에 두면 확대하지 않는 한 탭조차 할 수 없다.
 */

/** 제보 위치. 제보하기 화면에서 GPS로 자동 입력된 지점이다. */
export const DRAFT_POSITION = { x: 196, y: 470 };

/** 내 현재 위치. 제보를 올린 뒤 몇 걸음 이동한 지점이라 제보 핀과 겹치지 않는다. */
export const MY_POSITION = { x: 160, y: 508 };

export const CITIZEN = {
  name: "정하늘",
  district: "처인구 김량장동",
  totalReports: 12,
  approved: 9,
  points: 2700,
};

/* 이번에 새로 올리는 제보. 제보하기 화면의 초기 상태이자, 접수 완료 화면의 대표 카드다. */
export const DRAFT = {
  photo: photo("brokenBlock", 900),
  photoCaption: "깨져 들린 보도블록과 그 아래 파인 구멍",
  type: "sidewalk" as HazardType,
  address: "경기 용인시 처인구 금학로 55번길 12",
  landmark: "용인중앙시장 정문 앞 횡단보도 진입부",
  coord: "37.2342, 127.2015",
  accuracy: 8,
  x: DRAFT_POSITION.x,
  y: DRAFT_POSITION.y,
  detail:
    "중앙시장 정문 쪽 횡단보도로 내려가는 인도입니다. 보도블록 3장이 깨진 채 들려 있고 그 아래가 10cm 정도 파여 있습니다. 장 보고 나오는 어르신들이 매일 지나는 길이라 밤에는 특히 위험해 보입니다.",
  code: "YI-2026-0814",
  receivedAt: "2026년 8월 7일 오후 2시 41분",
  department: "처인구청 건설도로과",
  departmentPhone: "031-324-8752",
  expectedPoints: 300,
  expectedDays: "영업일 기준 3일 이내",
};

export const REPORTS: Report[] = [
  {
    id: "r-0814",
    code: "YI-2026-0814",
    type: "sidewalk",
    status: "received",
    title: "깨져 들린 보도블록 3장",
    address: "처인구 금학로 55번길 12",
    landmark: "용인중앙시장 정문 앞",
    x: DRAFT_POSITION.x,
    y: DRAFT_POSITION.y,
    reportedAt: "2026.08.07",
    reportedAgo: "방금 전",
    photo: photo("brokenBlock", 600),
    detail:
      "중앙시장 정문 쪽 횡단보도로 내려가는 인도입니다. 보도블록 3장이 깨진 채 들려 있고 그 아래가 10cm 정도 파여 있습니다.",
    department: "처인구청 건설도로과",
    points: 0,
    agrees: 2,
    mine: true,
    timeline: [
      { status: "received", at: "8월 7일 14:41", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: null, note: "담당 부서 배정 후 현장 확인이 진행됩니다." },
      { status: "working", at: null, note: "보수 작업 배정 예정" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0791",
    code: "YI-2026-0791",
    type: "walkway",
    status: "working",
    title: "보행자 전용 노면 도색 박리",
    address: "처인구 중부대로 1289번길 8",
    landmark: "김량장 지하보도 북측 진입로",
    x: 228,
    y: 344,
    reportedAt: "2026.08.03",
    reportedAgo: "4일 전",
    photo: photo("peeledPaint", 600),
    detail:
      "붉은색 보행자 전용 도색이 절반 넘게 벗겨져 차량이 보행 구간을 구분하지 못합니다. 출근 시간대에 자전거와 보행자가 자주 엉킵니다.",
    department: "처인구청 도시정비과",
    points: 0,
    agrees: 14,
    mine: true,
    timeline: [
      { status: "received", at: "8월 3일 08:12", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "8월 4일 10:30", note: "현장 확인 완료, 재도색 대상으로 판정" },
      { status: "working", at: "8월 6일 09:00", note: "재도색 작업 배정, 8월 9일 야간 시공 예정" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0776",
    code: "YI-2026-0776",
    type: "mobility",
    status: "reviewing",
    title: "휠체어가 넘지 못하는 진입 턱",
    address: "처인구 김량장로 41",
    landmark: "김량장동 행정복지센터 서측 출입구",
    x: 286,
    y: 600,
    reportedAt: "2026.08.01",
    reportedAgo: "6일 전",
    photo: photo("wheelchairPath", 600),
    detail:
      "인도에서 건물 앞으로 들어가는 구간에 6cm 정도 턱이 남아 있습니다. 수동 휠체어는 혼자 넘지 못하고 유모차도 앞바퀴가 걸립니다.",
    department: "처인구청 건축과",
    points: 0,
    agrees: 21,
    mine: false,
    timeline: [
      { status: "received", at: "8월 1일 16:05", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "8월 5일 11:20", note: "경사로 설치 가능 여부 현장 실측 중" },
      { status: "working", at: null, note: "실측 결과에 따라 작업 배정" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0768",
    code: "YI-2026-0768",
    type: "obstruction",
    status: "received",
    title: "인도를 막은 폐기물 적치",
    address: "처인구 경안천로 22번길 5",
    landmark: "김량장동 주민센터 뒤편 골목",
    x: 322,
    y: 540,
    reportedAt: "2026.07.30",
    reportedAgo: "8일 전",
    photo: photo("dumpedBags", 600),
    detail:
      "수거함 옆으로 폐기물 봉투가 계속 쌓여 인도 폭이 절반 이하로 줄었습니다. 유모차는 차도로 내려가야 지나갈 수 있습니다.",
    department: "처인구청 청소행정과",
    points: 0,
    agrees: 9,
    mine: false,
    timeline: [
      { status: "received", at: "7월 30일 19:44", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: null, note: "담당 부서 배정 후 현장 확인이 진행됩니다." },
      { status: "working", at: null, note: "수거 일정 배정 예정" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0742",
    code: "YI-2026-0742",
    type: "streetlight",
    status: "done",
    title: "쓰러진 가로등과 흩어진 유리 파편",
    address: "처인구 중부대로 1310번길 3",
    landmark: "용인공용버스터미널 남측 보도",
    x: 216,
    y: 318,
    reportedAt: "2026.07.24",
    reportedAgo: "14일 전",
    photo: photo("fallenLamp", 600),
    detail:
      "가로등 등기구가 통째로 떨어져 바닥에 있고 유리 파편이 보도에 흩어져 있습니다. 밤에는 이 구간 전체가 어둡습니다.",
    department: "용인시 도로관리과",
    points: 300,
    agrees: 37,
    mine: true,
    timeline: [
      { status: "received", at: "7월 24일 21:18", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "7월 25일 09:05", note: "긴급 위험으로 분류, 당일 현장 확인" },
      { status: "working", at: "7월 25일 14:00", note: "파편 수거 및 등기구 교체 작업 진행" },
      { status: "done", at: "7월 26일 17:30", note: "교체 완료, 시티포인트 300P 지급" },
    ],
  },
  {
    id: "r-0735",
    code: "YI-2026-0735",
    type: "schoolzone",
    status: "working",
    title: "통학로 횡단보도 대기 공간 부족",
    address: "처인구 금학로 12번길 7",
    landmark: "용인초등학교 정문 앞 횡단보도",
    x: 92,
    y: 560,
    reportedAt: "2026.07.21",
    reportedAgo: "17일 전",
    photo: photo("schoolCrossing", 600),
    detail:
      "등교 시간에 아이들이 횡단보도 앞에 서 있을 자리가 없어 차도 쪽으로 밀려납니다. 보호 울타리 연장이 필요해 보입니다.",
    department: "용인시 교통행정과",
    points: 0,
    agrees: 52,
    mine: false,
    timeline: [
      { status: "received", at: "7월 21일 08:33", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "7월 23일 13:10", note: "어린이보호구역 개선 대상으로 확인" },
      { status: "working", at: "8월 3일 09:00", note: "보호 울타리 12m 연장 공사 발주 완료" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0712",
    code: "YI-2026-0712",
    type: "walkway",
    status: "done",
    title: "인도 판 사이 단차와 잡초",
    address: "처인구 김량장로 88",
    landmark: "김량장근린공원 동측 산책로 입구",
    x: 92,
    y: 400,
    reportedAt: "2026.07.15",
    reportedAgo: "23일 전",
    photo: photo("slabGap", 600),
    detail:
      "콘크리트 판이 벌어지면서 2cm 정도 단차가 생겼고 틈으로 잡초가 올라옵니다. 비 오는 날 미끄럽습니다.",
    department: "처인구청 공원녹지과",
    points: 300,
    agrees: 11,
    mine: true,
    timeline: [
      { status: "received", at: "7월 15일 10:02", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "7월 16일 15:40", note: "현장 확인 완료, 부분 재포장 대상" },
      { status: "working", at: "7월 20일 08:30", note: "판 교체 및 줄눈 보수 진행" },
      { status: "done", at: "7월 21일 16:10", note: "보수 완료, 시티포인트 300P 지급" },
    ],
  },
  {
    id: "r-0704",
    code: "YI-2026-0704",
    type: "sidewalk",
    status: "received",
    title: "하천 산책로 진입부 블록 침하",
    address: "처인구 경안천로 140",
    landmark: "경안천 김량장교 서측 진입 계단",
    x: 348,
    y: 318,
    reportedAt: "2026.07.12",
    reportedAgo: "26일 전",
    photo: photo("brokenBlock", 600),
    detail:
      "산책로로 내려가는 진입부 블록이 한쪽으로 내려앉아 발이 걸립니다. 야간 조명이 약해 잘 보이지 않습니다.",
    department: "처인구청 하천관리과",
    points: 0,
    agrees: 6,
    mine: false,
    timeline: [
      { status: "received", at: "7월 12일 18:27", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: null, note: "우기 종료 후 일괄 점검 예정" },
      { status: "working", at: null, note: "점검 결과에 따라 작업 배정" },
      { status: "done", at: null, note: "완료 후 시티포인트 300P 지급 예정" },
    ],
  },
  {
    id: "r-0689",
    code: "YI-2026-0689",
    type: "obstruction",
    status: "done",
    title: "인도 점용 입간판 6개",
    address: "처인구 금학로 208번길 15",
    landmark: "김량장동 먹자골목 초입",
    x: 48,
    y: 300,
    reportedAt: "2026.07.06",
    reportedAgo: "32일 전",
    photo: photo("dumpedBags", 600),
    detail:
      "점포 입간판이 인도 한가운데까지 나와 있어 휠체어가 지나가지 못합니다. 계도가 필요합니다.",
    department: "처인구청 도시정비과",
    points: 300,
    agrees: 18,
    mine: false,
    timeline: [
      { status: "received", at: "7월 6일 12:15", note: "제보가 정상 접수되었습니다." },
      { status: "reviewing", at: "7월 8일 09:50", note: "현장 확인 완료, 계도 대상 6건" },
      { status: "working", at: "7월 10일 10:00", note: "점포별 자진 정비 안내 진행" },
      { status: "done", at: "7월 14일 11:20", note: "정비 완료 확인, 시티포인트 300P 지급" },
    ],
  },
];

export const MY_REPORTS = REPORTS.filter((r) => r.mine);

/** 지도 상단 요약. 스펙의 "제보 데이터가 다시 시민에게 공개된다"를 숫자로 보여 준다. */
export const DISTRICT_SUMMARY = {
  name: "처인구 김량장동",
  total: REPORTS.length,
  open: REPORTS.filter((r) => r.status !== "done").length,
  done: REPORTS.filter((r) => r.status === "done").length,
  updatedAt: "오늘 14:41 기준",
};
