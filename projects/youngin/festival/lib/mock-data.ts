import type {
  Badge,
  Facility,
  FacilityCategory,
  FacilityKind,
  Mission,
  Notice,
  Program,
} from "@/projects/youngin/festival/lib/types";

/* ---------------------------------------------------------------------------
 * 사진 대장 (design.md "사진 매핑"과 1:1)
 *
 * picsum 고정 id만 쓴다. 아래 주석은 id를 하나씩 직접 열어 확인한 내용이다.
 * id를 바꾸면 사진을 다시 열어보고 캡션 짝을 확인할 것.
 *
 *  158 대형 무대 조명 빔이 쏟아지는 야간 공연, 손 든 관객 실루엣
 *  452 공연장 관객 실루엣과 치켜든 손, 무대 조명
 *  998 끈으로 묶인 낡은 누런 책 묶음, 펜과 잉크병, 오래된 사진
 *  635 오래된 공방 원목 작업대 위에 늘어놓은 머그와 도자기
 *  225 유리 티포트에 우린 차와 작은 잔, 노란 꽃
 *  292 도마 위 붉은 양파, 파슬리, 무, 당근, 통후추
 *  145 세피아 톤 기타 헤드스톡 클로즈업
 *  342 붐비는 아시아 거리 시장, 배낭 멘 사람 뒷모습과 오토바이
 *  877 안개 낀 침엽수림, 푸른 새벽빛
 * ------------------------------------------------------------------------- */
export const PHOTO = {
  hero: 158,
  concert: 452,
  relics: 998,
  pottery: 635,
  tea: 225,
  localFood: 292,
  busking: 145,
  marketCrowd: 342,
  tombTrail: 877,
} as const;

export function photo(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

/* --- 행사 개요 --------------------------------------------------------- */

export const FESTIVAL = {
  name: "제24회 포은문화제",
  subtitle: "단심, 오늘에 잇다",
  period: "2026. 9. 18(금) ~ 9. 20(일)",
  place: "포은 정몽주 선생 묘역 일원",
  address: "용인시 처인구 모현읍 능원로 25",
  host: "용인시",
  organizer: "용인문화재단",
  hours: "10:00 ~ 21:00 (마지막 날 18:00 종료)",
  /** 목업 기준 시각. 2일차 오후, 진행 중과 곧 시작이 동시에 보이는 지점. */
  today: "9월 19일 (토)",
  dayLabel: "2일차",
  now: "14:20",
  nowMinutes: 14 * 60 + 20,
  qrEntry: "행사장 QR 15개소",
  contact: "031-324-4700",
} as const;

/* --- 시설 -------------------------------------------------------------- */

export const FACILITIES: Facility[] = [
  // 프로그램
  {
    id: "f-stage",
    name: "어울마당 메인무대",
    kind: "stage",
    category: "program",
    zone: "A",
    hours: "10:00 ~ 21:00",
    desc: "개막식과 저녁 공연이 열리는 야외 주무대입니다. 잔디석은 선착순이며 돗자리 반입이 가능합니다.",
    status: "open",
    walkMin: 4,
    x: 345,
    y: 468,
  },
  {
    id: "f-hall",
    name: "포은아트홀 소공연장",
    kind: "hall",
    category: "program",
    zone: "A",
    hours: "10:00 ~ 20:00",
    desc: "실내 공연장입니다. 우천 시 야외 프로그램이 이곳으로 옮겨 진행됩니다. 좌석 240석.",
    status: "open",
    walkMin: 7,
    x: 150,
    y: 335,
  },
  {
    id: "f-exhibit",
    name: "전시마당",
    kind: "exhibit",
    category: "program",
    zone: "D",
    hours: "10:00 ~ 18:00",
    desc: "포은 유물 특별전이 열립니다. 고문서와 친필 자료 32점을 전시하며 도슨트 해설이 하루 세 차례 있습니다.",
    status: "open",
    walkMin: 6,
    x: 528,
    y: 340,
  },
  {
    id: "f-craft",
    name: "전통체험마당",
    kind: "experience",
    category: "program",
    zone: "B",
    hours: "10:00 ~ 17:00",
    desc: "도자, 한지, 매듭 공예 부스 12곳이 모여 있습니다. 체험비는 부스별로 다르며 현장 접수합니다.",
    status: "open",
    walkMin: 3,
    x: 140,
    y: 760,
  },
  {
    id: "f-tea",
    name: "다례관",
    kind: "tea",
    category: "program",
    zone: "B",
    hours: "11:00 ~ 17:00",
    desc: "전통 다례를 배우고 직접 차를 우려 마시는 온돌방입니다. 회차당 16명, 신발을 벗고 입장합니다.",
    status: "open",
    walkMin: 3,
    x: 238,
    y: 706,
  },
  {
    id: "f-food",
    name: "먹거리장터",
    kind: "food",
    category: "program",
    zone: "C",
    hours: "10:30 ~ 20:30",
    desc: "지역 향토음식 부스 18곳이 운영됩니다. 다회용기를 쓰며 반납 시 보증금 1,000원을 돌려받습니다.",
    status: "busy",
    walkMin: 2,
    x: 472,
    y: 758,
  },
  {
    id: "f-tomb",
    name: "포은 정몽주 선생 묘역",
    kind: "heritage",
    category: "program",
    zone: "E",
    hours: "상시 개방",
    desc: "경기도 기념물로 지정된 묘역입니다. 참배길은 왕복 약 900m이며 계단 구간이 있습니다.",
    status: "open",
    walkMin: 11,
    x: 355,
    y: 138,
  },

  // 편의시설
  {
    id: "f-toilet1",
    name: "제1화장실",
    kind: "toilet",
    category: "convenience",
    zone: "A",
    hours: "상시 개방",
    desc: "어울마당 동측에 있는 상설 화장실입니다. 장애인 칸과 기저귀 교환대가 있습니다.",
    status: "open",
    walkMin: 4,
    x: 530,
    y: 596,
  },
  {
    id: "f-toilet2",
    name: "제2화장실",
    kind: "toilet",
    category: "convenience",
    zone: "C",
    hours: "상시 개방",
    desc: "먹거리장터 옆 이동식 화장실 8칸입니다. 오후에 대기가 길어질 수 있습니다.",
    status: "busy",
    walkMin: 2,
    x: 592,
    y: 710,
  },
  {
    id: "f-toilet3",
    name: "제3화장실",
    kind: "toilet",
    category: "convenience",
    zone: "P",
    hours: "상시 개방",
    desc: "임시주차장 입구에 있는 이동식 화장실 6칸입니다.",
    status: "open",
    walkMin: 6,
    x: 150,
    y: 880,
  },
  {
    id: "f-parking",
    name: "임시주차장",
    kind: "parking",
    category: "convenience",
    zone: "P",
    hours: "09:00 ~ 22:00",
    desc: "승용차 420면입니다. 주말 정오 이후 만차가 잦으니 셔틀버스를 권합니다.",
    status: "busy",
    walkMin: 7,
    x: 345,
    y: 905,
  },
  {
    id: "f-nursing",
    name: "수유 돌봄쉼터",
    kind: "nursing",
    category: "convenience",
    zone: "A",
    hours: "10:00 ~ 19:00",
    desc: "수유실, 기저귀 교환대, 유아용 정수기가 있습니다. 유모차 대여도 이곳에서 받습니다.",
    status: "open",
    walkMin: 6,
    x: 95,
    y: 470,
  },
  {
    id: "f-rest",
    name: "그늘쉼터",
    kind: "rest",
    category: "convenience",
    zone: "A",
    hours: "10:00 ~ 21:00",
    desc: "차양막 아래 벤치 40석과 냉수기가 있습니다. 휴대폰 충전 콘센트를 쓸 수 있습니다.",
    status: "open",
    walkMin: 5,
    x: 95,
    y: 566,
  },
  {
    id: "f-lost",
    name: "분실물센터",
    kind: "lost",
    category: "convenience",
    zone: "A",
    hours: "10:00 ~ 21:00",
    desc: "습득물을 보관합니다. 폐장 후 미수령 물품은 용인문화재단 사무국으로 옮겨집니다.",
    status: "open",
    walkMin: 3,
    x: 452,
    y: 652,
  },
  {
    id: "f-shuttle",
    name: "셔틀버스 승강장",
    kind: "shuttle",
    category: "convenience",
    zone: "P",
    hours: "09:30 ~ 21:30",
    desc: "용인터미널, 에버라인 명지대역을 오갑니다. 20분 간격 배차이며 무료입니다.",
    status: "open",
    walkMin: 8,
    x: 598,
    y: 928,
  },
  {
    id: "f-accessible",
    name: "무장애 관람석",
    kind: "accessible",
    category: "convenience",
    zone: "A",
    hours: "10:00 ~ 21:00",
    desc: "메인무대 좌측 데크의 휠체어 관람 구역 12석입니다. 휠체어와 유아차를 대여합니다.",
    status: "open",
    walkMin: 4,
    x: 255,
    y: 508,
  },

  // 안전시설
  {
    id: "f-info",
    name: "종합안내소",
    kind: "info",
    category: "safety",
    zone: "A",
    hours: "09:30 ~ 21:00",
    desc: "프로그램 안내, 미아 접수, 통역 지원을 맡습니다. 종이 안내도와 미션 스탬프판을 받을 수 있습니다.",
    status: "open",
    walkMin: 1,
    x: 345,
    y: 652,
  },
  {
    id: "f-aed",
    name: "자동심장충격기 (AED)",
    kind: "aed",
    category: "safety",
    zone: "A",
    hours: "상시",
    desc: "안내소 서측 기둥에 설치된 AED입니다. 행사장에는 모두 3대가 있습니다.",
    status: "open",
    walkMin: 2,
    x: 250,
    y: 652,
  },
  {
    id: "f-medical",
    name: "응급의료소",
    kind: "medical",
    category: "safety",
    zone: "A",
    hours: "10:00 ~ 21:00",
    desc: "간호사 2명이 상주하며 응급처치와 냉방 휴식을 지원합니다. 119 연계 지점입니다.",
    status: "open",
    walkMin: 3,
    x: 455,
    y: 520,
  },
];

export const FACILITY_LABEL: Record<FacilityKind, string> = {
  stage: "야외무대",
  hall: "실내공연장",
  experience: "체험부스",
  tea: "다례",
  exhibit: "전시부스",
  food: "먹거리",
  heritage: "문화재",
  toilet: "화장실",
  parking: "주차장",
  nursing: "수유 돌봄",
  rest: "휴게공간",
  lost: "분실물",
  shuttle: "셔틀버스",
  accessible: "무장애",
  info: "안내소",
  aed: "AED",
  medical: "의료지원",
};

export const FACILITY_ICON: Record<FacilityKind, string> = {
  stage: "solar:music-note-slider-bold",
  hall: "solar:ticket-bold",
  experience: "solar:palette-bold",
  tea: "solar:cup-hot-bold",
  exhibit: "solar:gallery-wide-bold",
  food: "solar:chef-hat-bold",
  heritage: "solar:crown-bold",
  toilet: "solar:bath-bold",
  parking: "solar:garage-bold",
  nursing: "solar:heart-shine-bold",
  rest: "solar:armchair-2-bold",
  lost: "solar:bag-smile-bold",
  shuttle: "solar:bus-bold",
  accessible: "solar:wheel-bold",
  info: "solar:info-square-bold",
  aed: "solar:heart-pulse-bold",
  medical: "solar:medical-kit-bold",
};

export const CATEGORY_LABEL: Record<FacilityCategory, string> = {
  program: "프로그램",
  convenience: "편의시설",
  safety: "안전시설",
};

export const CATEGORY_COLOR: Record<FacilityCategory, { fg: string; bg: string }> = {
  program: { fg: "var(--fs-cat-program)", bg: "var(--fs-cat-program-soft)" },
  convenience: { fg: "var(--fs-cat-conv)", bg: "var(--fs-cat-conv-soft)" },
  safety: { fg: "var(--fs-cat-safety)", bg: "var(--fs-cat-safety-soft)" },
};

export const STATUS_LABEL = {
  open: "운영 중",
  busy: "혼잡",
  closed: "운영 종료",
} as const;

/* --- 프로그램 (오늘, 9월 19일 토요일) ---------------------------------- */

export const PROGRAMS: Program[] = [
  {
    id: "p-rite",
    title: "포은 추모 다례",
    kind: "의례",
    facilityId: "f-tomb",
    start: "10:00",
    end: "11:00",
    host: "포은선생숭모사업회",
    note: "묘역 앞마당에서 진행합니다. 참관은 자유이며 별도 접수가 없습니다.",
    photoId: PHOTO.tombTrail,
    views: 1840,
  },
  {
    id: "p-docent",
    title: "포은 유물 특별전 도슨트 해설",
    kind: "전시",
    facilityId: "f-exhibit",
    start: "13:30",
    end: "15:00",
    host: "용인문화재단 학예팀 한지우",
    note: "고문서 32점을 40분간 해설합니다. 전시마당 입구에서 바로 합류할 수 있습니다.",
    photoId: PHOTO.relics,
    views: 2260,
  },
  {
    id: "p-pottery",
    title: "도자 공예 체험",
    kind: "체험",
    facilityId: "f-craft",
    start: "14:00",
    end: "16:00",
    host: "모현 도예공방",
    note: "물레 성형 후 다음 주 배송해 드립니다. 체험비 8,000원, 현장 접수.",
    photoId: PHOTO.pottery,
    views: 1520,
  },
  {
    id: "p-busking",
    title: "청소년 버스킹 무대",
    kind: "공연",
    facilityId: "f-hall",
    start: "15:00",
    end: "15:40",
    host: "용인시 청소년 동아리 6팀",
    note: "우천 예보로 어울마당에서 포은아트홀 소공연장으로 장소를 옮겼습니다.",
    photoId: PHOTO.busking,
    views: 980,
  },
  {
    id: "p-tea",
    title: "다례 체험",
    kind: "체험",
    facilityId: "f-tea",
    start: "15:30",
    end: "16:30",
    host: "용인차문화연구회",
    note: "회차당 16명 정원입니다. 15:10부터 다례관 앞에서 대기표를 나눠 줍니다.",
    photoId: PHOTO.tea,
    views: 1120,
  },
  {
    id: "p-food",
    title: "향토음식 만들기",
    kind: "체험",
    facilityId: "f-food",
    start: "16:00",
    end: "17:00",
    host: "처인구 향토음식연구회",
    note: "모현 백김치와 도토리묵을 직접 만들어 봅니다. 재료비 5,000원.",
    photoId: PHOTO.localFood,
    views: 860,
  },
  {
    id: "p-concert",
    title: "가을밤 야외음악회",
    kind: "공연",
    facilityId: "f-stage",
    start: "19:00",
    end: "20:30",
    host: "용인시립국악단, 초청 합창단",
    note: "사전 접수는 마감됐고 잔디석은 선착순 입장입니다. 돗자리를 가져오세요.",
    photoId: PHOTO.concert,
    full: true,
    views: 4310,
  },
];

/* --- 미션 -------------------------------------------------------------- */

export const MISSIONS: Mission[] = [
  {
    id: "m-info",
    title: "종합안내소 찾기",
    desc: "행사장에서 길을 잃었을 때 가장 먼저 갈 곳입니다. 미아 접수와 통역 지원도 이곳에서 받습니다.",
    facilityId: "f-info",
    icon: "solar:info-square-bold",
    done: true,
    doneAt: "09.19 11:24",
    needsQr: true,
  },
  {
    id: "m-toilet",
    title: "가까운 화장실 확인하기",
    desc: "행사장에 화장실이 세 곳 있습니다. 지금 서 있는 자리에서 가장 가까운 곳을 미리 봐 두세요.",
    facilityId: "f-toilet1",
    icon: "solar:bath-bold",
    done: true,
    doneAt: "09.19 11:52",
    needsQr: false,
  },
  {
    id: "m-stage",
    title: "메인무대 방문하기",
    desc: "저녁 야외음악회가 열리는 어울마당 주무대입니다. 잔디석 위치를 미리 확인해 두면 좋습니다.",
    facilityId: "f-stage",
    icon: "solar:music-note-slider-bold",
    done: true,
    doneAt: "09.19 12:36",
    needsQr: true,
  },
  {
    id: "m-medical",
    title: "응급의료소 위치 익히기",
    desc: "더위나 부상으로 도움이 필요할 때 찾는 곳입니다. AED 위치도 함께 확인해 두세요.",
    facilityId: "f-medical",
    icon: "solar:medical-kit-bold",
    done: false,
    needsQr: true,
  },
  {
    id: "m-craft",
    title: "전통체험부스 참여하기",
    desc: "전통체험마당의 12개 공방 중 한 곳에서 체험을 마치고 부스의 QR을 찍으세요.",
    facilityId: "f-craft",
    icon: "solar:palette-bold",
    done: false,
    needsQr: true,
  },
  {
    id: "m-tomb",
    title: "묘역 참배길 걷기",
    desc: "포은 정몽주 선생 묘역까지 왕복 900m 참배길을 걷습니다. 계단 구간이 있어 시간 여유를 두세요.",
    facilityId: "f-tomb",
    icon: "solar:crown-bold",
    done: false,
    needsQr: true,
  },
];

export const BADGES: Badge[] = [
  { id: "b-1", name: "첫 걸음", desc: "미션 1개 완료", icon: "solar:walking-bold", require: 1 },
  { id: "b-2", name: "행사장 눈썰미", desc: "미션 3개 완료", icon: "solar:eye-bold", require: 3 },
  {
    id: "b-3",
    name: "포은 길잡이",
    desc: "미션 5개 완료, 기념품 응모",
    icon: "solar:map-arrow-square-bold",
    require: 5,
  },
  {
    id: "b-4",
    name: "완주",
    desc: "미션 6개 전부 완료",
    icon: "solar:medal-ribbon-star-bold",
    require: 6,
  },
];

/* --- 공지 -------------------------------------------------------------- */

export const NOTICES: Notice[] = [
  {
    id: "n-1",
    kind: "운영",
    title: "15:00 청소년 버스킹, 장소가 바뀌었습니다",
    body: "우천 예보로 어울마당에서 포은아트홀 소공연장으로 옮겨 진행합니다. 좌석은 240석 선착순입니다.",
    at: "09.19 13:40",
  },
  {
    id: "n-2",
    kind: "안전",
    title: "먹거리장터 혼잡, 제2화장실 대기가 깁니다",
    body: "오후 2시 기준 C구역이 붐빕니다. 어울마당 동측 제1화장실을 이용하시면 대기가 짧습니다.",
    at: "09.19 14:05",
  },
  {
    id: "n-3",
    kind: "교통",
    title: "임시주차장 만차 임박, 셔틀버스를 이용해 주세요",
    body: "420면 중 386면이 찼습니다. 용인터미널과 명지대역에서 20분 간격으로 무료 셔틀이 출발합니다.",
    at: "09.19 13:10",
  },
];

/* --- 파생 값 ----------------------------------------------------------- */

export function getFacility(id: string): Facility {
  return FACILITIES.find((f) => f.id === id) ?? FACILITIES[0];
}

export function getProgram(id: string): Program {
  return PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];
}

export function getMission(id: string): Mission {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export type ProgramPhase = "live" | "soon" | "later" | "ended";

export function phaseOf(program: Program): ProgramPhase {
  const now = FESTIVAL.nowMinutes;
  const start = toMinutes(program.start);
  const end = toMinutes(program.end);
  if (end <= now) return "ended";
  if (start <= now) return "live";
  return start - now <= 90 ? "soon" : "later";
}

/** 시작까지 남은 분. 이미 시작했으면 0. */
export function minutesUntil(program: Program) {
  return Math.max(0, toMinutes(program.start) - FESTIVAL.nowMinutes);
}

export const LIVE_PROGRAMS = PROGRAMS.filter((p) => phaseOf(p) === "live");
export const SOON_PROGRAMS = PROGRAMS.filter((p) => phaseOf(p) === "soon");
export const POPULAR_PROGRAMS = [...PROGRAMS].sort((a, b) => b.views - a.views).slice(0, 3);

export const DONE_MISSIONS = MISSIONS.filter((m) => m.done);
export const MISSION_PROGRESS = Math.round((DONE_MISSIONS.length / MISSIONS.length) * 100);

export function facilitiesOf(category: FacilityCategory) {
  return FACILITIES.filter((f) => f.category === category);
}

export function searchFacilities(query: string) {
  const q = query.trim();
  if (!q) return [];
  return FACILITIES.filter(
    (f) =>
      f.name.includes(q) ||
      FACILITY_LABEL[f.kind].includes(q) ||
      CATEGORY_LABEL[f.category].includes(q),
  );
}
