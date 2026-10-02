import type {
  AdminMember,
  BannedKeyword,
  BoardKey,
  ChatMessage,
  ChatThread,
  TileIndex,
  Category,
  Dispute,
  Listing,
  OverPriceHit,
  Post,
  PriceRule,
  Report,
  SellerProfile,
  Settlement,
  Team,
  TeamId,
} from "@/projects/commerce/baseballmarket/lib/types";

/* picsum 고정 id만 쓴다. 아래 15개는 실제로 열어 확인하고 캡션에 맞췄다 —
   id ↔ 사진 내용 표는 design.md "사진 매핑" 절에 있다. 여기 id를 바꾸면
   그 표도 함께 고친다.

   535 옷걸이 티셔츠 랙 / 338 회색 후드 뒷모습 / 669 니트 비니 / 1005 목도리 인물
   157 빈티지 스케이트보드 / 26 지갑·시계 플랫레이 / 692 대합실 인파 / 800 대합실
   452 야간 관중 환호 / 524 기차역 플랫폼 / 274 도시 네온 야경 / 628 카메라 든 사람
   823 빨간 비니 + 카메라 / 513 카페 창가 / 646 역광 인물 */
export function photo(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

/* 구단은 전부 가상이다. 지역명만 실제이고 팀명, 선수명, 등번호는 실재하지 않는다. */
export const TEAMS: Team[] = [
  { id: "graiders", city: "서울", name: "그라이더스", mark: "그", stadium: "서울 잠원구장" },
  { id: "harbors", city: "인천", name: "하버스", mark: "하", stadium: "인천 송림구장" },
  { id: "comets", city: "대전", name: "코메츠", mark: "코", stadium: "대전 갑천구장" },
  { id: "pines", city: "광주", name: "파인즈", mark: "파", stadium: "광주 무등천구장" },
  { id: "cranes", city: "수원", name: "크레인즈", mark: "크", stadium: "수원 화홍구장" },
  { id: "breeze", city: "창원", name: "브리즈", mark: "브", stadium: "창원 마산만구장" },
  { id: "embers", city: "대구", name: "엠버스", mark: "엠", stadium: "대구 신천구장" },
  { id: "tide", city: "부산", name: "타이드", mark: "타", stadium: "부산 수영만구장" },
  { id: "rhinos", city: "고양", name: "라이노스", mark: "라", stadium: "고양 대화구장" },
  { id: "mills", city: "청주", name: "밀스", mark: "밀", stadium: "청주 무심천구장" },
];

export function team(id: TeamId): Team {
  return TEAMS.find((t) => t.id === id) ?? TEAMS[0];
}

export function teamLabel(id: TeamId): string {
  const t = team(id);
  return `${t.city} ${t.name}`;
}

/** 내 응원 구단. 홈 액센트(--bm-team)를 갖는 유일한 구단이다. */
export const MY_TEAM: TeamId = "comets";

export const ME = {
  nickname: "덕아웃반장",
  realName: "정하윤",
  team: MY_TEAM,
  dong: "대전 둔산동",
  mannerScore: 42.6,
  trades: 27,
  joinedAt: "2023.04",
};

/** 카테고리 ↔ 템플릿 그리드 순번. 색이 아니라 01~06 모노 표기다. */
export const CATEGORY_TONE: Record<Category, TileIndex> = {
  유니폼: 1,
  굿즈: 2,
  티켓: 3,
};

export const CATEGORY_TILES: {
  key: Category | "커뮤니티" | "안전거래" | "정가기준";
  label: string;
  sub: string;
  index: TileIndex;
  /** 타일마다 다른 실측값 한 줄. 색이 없으니 구별은 내용이 맡는다. */
  metric: string;
}[] = [
  { key: "유니폼", label: "유니폼", sub: "홈, 원정, 서드, 올드", index: 1, metric: "3,421건" },
  { key: "굿즈", label: "굿즈", sub: "모자, 응원용품, 콜라보", index: 2, metric: "2,884건" },
  { key: "티켓", label: "티켓", sub: "정가 비교 표시", index: 3, metric: "4,102건" },
  { key: "커뮤니티", label: "커뮤니티", sub: "구단 게시판, 직관 후기", index: 4, metric: "오늘 148글" },
  { key: "안전거래", label: "안전거래", sub: "결제 보호, 배송 추적", index: 5, metric: "수수료 3%" },
  { key: "정가기준", label: "정가 기준표", sub: "암표 방지 기준", index: 6, metric: "기준표 v4.2" },
];

export const SELLERS: SellerProfile[] = [
  {
    id: "s1",
    nickname: "9회말투아웃",
    mannerScore: 47.2,
    responseRate: 98,
    responseMin: 7,
    tradeCount: 64,
    joinedAt: "2021.06",
    homeTeam: "comets",
    dong: "대전 탄방동",
  },
  {
    id: "s2",
    nickname: "외야석주민",
    mannerScore: 44.1,
    responseRate: 92,
    responseMin: 21,
    tradeCount: 38,
    joinedAt: "2022.03",
    homeTeam: "graiders",
    dong: "서울 잠원동",
  },
  {
    id: "s3",
    nickname: "마킹장인",
    mannerScore: 49.0,
    responseRate: 99,
    responseMin: 4,
    tradeCount: 121,
    joinedAt: "2020.09",
    homeTeam: "tide",
    dong: "부산 남천동",
  },
  {
    id: "s4",
    nickname: "굿즈창고",
    mannerScore: 41.8,
    responseRate: 87,
    responseMin: 43,
    tradeCount: 22,
    joinedAt: "2023.01",
    homeTeam: "embers",
    dong: "대구 삼덕동",
  },
  {
    id: "s5",
    nickname: "직관메이트",
    mannerScore: 45.5,
    responseRate: 95,
    responseMin: 12,
    tradeCount: 51,
    joinedAt: "2021.11",
    homeTeam: "harbors",
    dong: "인천 구월동",
  },
];

export function seller(id: string): SellerProfile {
  return SELLERS.find((s) => s.id === id) ?? SELLERS[0];
}

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "2024 코메츠 홈 유니폼 서지훈 27번 마킹",
    category: "유니폼",
    team: "comets",
    price: 78000,
    facePrice: 129000,
    condition: "최상",
    photoId: 535,
    createdAt: "2026-09-08T11:20:00",
    dong: "대전 탄방동",
    distanceKm: 1.2,
    likes: 34,
    chats: 6,
    status: "판매중",
    method: ["안전거래", "직거래"],
    sellerId: "s1",
    negotiable: true,
    uniform: {
      kind: "홈",
      season: 2024,
      player: "서지훈",
      backNumber: 27,
      size: "105",
      chest: 58,
      length: 74,
      shoulder: 50,
      authentic: true,
      flaws: ["좌측 소매 끝 미세 보풀"],
    },
    desc: "정품 어센틱이고 마킹은 구단 공식 매장에서 했습니다. 세 번 입고 보관만 했어요. 실측 사이즈 참고 부탁드립니다.",
  },
  {
    id: "l2",
    title: "그라이더스 원정 유니폼 2023 미착용",
    category: "유니폼",
    team: "graiders",
    price: 112000,
    facePrice: 139000,
    condition: "미착용",
    photoId: 338,
    createdAt: "2026-09-08T09:05:00",
    dong: "서울 잠원동",
    distanceKm: 148.0,
    likes: 21,
    chats: 3,
    status: "판매중",
    method: ["안전거래", "택배"],
    sellerId: "s2",
    negotiable: false,
    uniform: {
      kind: "원정",
      season: 2023,
      player: "미마킹",
      backNumber: 0,
      size: "100",
      chest: 55,
      length: 72,
      shoulder: 48,
      authentic: true,
      flaws: [],
    },
    desc: "선물 받았는데 사이즈가 안 맞아 한 번도 입지 않았습니다. 택 그대로 있습니다.",
  },
  {
    id: "l3",
    title: "타이드 올드 유니폼 1998 복각판",
    category: "유니폼",
    team: "tide",
    price: 165000,
    facePrice: 189000,
    condition: "상",
    photoId: 1005,
    createdAt: "2026-09-07T20:41:00",
    dong: "부산 남천동",
    distanceKm: 312.4,
    likes: 58,
    chats: 11,
    status: "판매중",
    method: ["안전거래", "택배"],
    sellerId: "s3",
    negotiable: true,
    uniform: {
      kind: "올드",
      season: 1998,
      player: "복각",
      backNumber: 0,
      size: "110",
      chest: 61,
      length: 76,
      shoulder: 52,
      authentic: true,
      flaws: ["우측 밑단 봉제 살짝 풀림", "전체적으로 색바램 있음"],
    },
    desc: "복각판 한정 수량이었고 지금은 구하기 어렵습니다. 색바램은 사진 그대로이고 착용에는 문제 없습니다.",
  },
  {
    id: "l4",
    title: "코메츠 니트 비니 2025 겨울 한정",
    category: "굿즈",
    team: "comets",
    price: 22000,
    facePrice: 32000,
    condition: "최상",
    photoId: 669,
    createdAt: "2026-09-08T14:02:00",
    dong: "대전 둔산동",
    distanceKm: 0.6,
    likes: 12,
    chats: 2,
    status: "판매중",
    method: ["직거래", "택배"],
    sellerId: "s1",
    negotiable: false,
    desc: "겨울 한정 굿즈입니다. 두 번 착용했고 보관 상태 좋습니다. 둔산동 직거래 가능합니다.",
  },
  {
    id: "l5",
    title: "엠버스 콜라보 스케이트보드 데크",
    category: "굿즈",
    team: "embers",
    price: 96000,
    facePrice: 128000,
    condition: "상",
    photoId: 157,
    createdAt: "2026-09-06T17:30:00",
    dong: "대구 삼덕동",
    distanceKm: 152.8,
    likes: 41,
    chats: 8,
    status: "예약중",
    method: ["안전거래"],
    sellerId: "s4",
    negotiable: true,
    desc: "구단 창단 기념 콜라보 데크입니다. 전시용으로만 뒀고 라이딩한 적 없습니다.",
  },
  {
    id: "l6",
    title: "하버스 응원 굿즈 세트 일괄",
    category: "굿즈",
    team: "harbors",
    price: 45000,
    facePrice: 71000,
    condition: "중",
    photoId: 26,
    createdAt: "2026-09-05T10:15:00",
    dong: "인천 구월동",
    distanceKm: 168.3,
    likes: 9,
    chats: 1,
    status: "판매중",
    method: ["택배", "직거래"],
    sellerId: "s5",
    negotiable: true,
    desc: "응원 타월, 키링, 파우치, 뱃지 일괄입니다. 사용감 있는 편이라 가격 낮췄습니다.",
  },
  {
    id: "l7",
    title: "9/14 코메츠 vs 그라이더스 1루 응원석 2연석",
    category: "티켓",
    team: "comets",
    price: 34000,
    facePrice: 32000,
    condition: "미착용",
    photoId: 692,
    createdAt: "2026-09-09T08:12:00",
    dong: "대전 갑천동",
    distanceKm: 2.4,
    likes: 27,
    chats: 9,
    status: "판매중",
    method: ["안전거래"],
    sellerId: "s1",
    negotiable: false,
    ticket: {
      gameDate: "2026-09-14",
      gameTime: "18:30",
      stadium: "대전 갑천구장",
      homeTeam: "comets",
      awayTeam: "graiders",
      zone: "1루 응원석",
      row: "14열",
      seats: 2,
      transfer: "모바일 양도",
    },
    desc: "일정이 겹쳐서 양도합니다. 정가에 예매 수수료만 더했습니다. 모바일 양도로 바로 넘겨드립니다.",
  },
  {
    id: "l8",
    title: "9/16 타이드 홈경기 내야지정석 1매",
    category: "티켓",
    team: "tide",
    price: 52000,
    facePrice: 28000,
    condition: "미착용",
    photoId: 452,
    createdAt: "2026-09-09T07:40:00",
    dong: "부산 수영동",
    distanceKm: 310.1,
    likes: 4,
    chats: 14,
    status: "판매중",
    method: ["안전거래"],
    sellerId: "s3",
    negotiable: true,
    ticket: {
      gameDate: "2026-09-16",
      gameTime: "18:30",
      stadium: "부산 수영만구장",
      homeTeam: "tide",
      awayTeam: "breeze",
      zone: "내야지정석",
      row: "7열",
      seats: 1,
      transfer: "모바일 양도",
    },
    desc: "좋은 자리입니다. 급하게 내놓습니다.",
  },
  {
    id: "l9",
    title: "9/20 원정 응원 버스 동행석 포함 티켓",
    category: "티켓",
    team: "harbors",
    price: 41000,
    facePrice: 39000,
    condition: "미착용",
    photoId: 524,
    createdAt: "2026-09-08T21:55:00",
    dong: "인천 구월동",
    distanceKm: 167.9,
    likes: 16,
    chats: 5,
    status: "판매중",
    method: ["안전거래"],
    sellerId: "s5",
    negotiable: false,
    ticket: {
      gameDate: "2026-09-20",
      gameTime: "14:00",
      stadium: "수원 화홍구장",
      homeTeam: "cranes",
      awayTeam: "harbors",
      zone: "원정 응원석",
      row: "3열",
      seats: 1,
      transfer: "현장 수령",
    },
    desc: "원정 응원단 버스 좌석이 포함된 패키지입니다. 현장에서 만나 수령하는 방식입니다.",
  },
  {
    id: "l10",
    title: "9/22 야간경기 외야 커플석 2연석",
    category: "티켓",
    team: "graiders",
    price: 46000,
    facePrice: 44000,
    condition: "미착용",
    photoId: 274,
    createdAt: "2026-09-07T19:18:00",
    dong: "서울 잠원동",
    distanceKm: 149.2,
    likes: 22,
    chats: 7,
    status: "거래완료",
    method: ["안전거래"],
    sellerId: "s2",
    negotiable: false,
    ticket: {
      gameDate: "2026-09-22",
      gameTime: "18:30",
      stadium: "서울 잠원구장",
      homeTeam: "graiders",
      awayTeam: "pines",
      zone: "외야 커플석",
      row: "2열",
      seats: 2,
      transfer: "모바일 양도",
    },
    desc: "외야 커플석입니다. 야간경기라 시야 좋습니다.",
  },
];

export function listing(id: string): Listing {
  return LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
}

/** 정가 초과 여부. 티켓 거래의 핵심 판정이다. */
export function overFace(l: Listing): number {
  if (!l.facePrice || l.category !== "티켓") return 0;
  return l.price - l.facePrice;
}

export function overFaceRatio(l: Listing): number {
  if (!l.facePrice) return 0;
  return Math.round(((l.price - l.facePrice) / l.facePrice) * 100);
}

export const RECENT_VIEWED = ["l3", "l7", "l5", "l1"];

export const SAVED_SEARCHES = [
  { id: "q1", label: "코메츠 홈 유니폼 105", count: 4, alarm: true },
  { id: "q2", label: "갑천구장 1루 응원석", count: 11, alarm: true },
  { id: "q3", label: "올드 유니폼 복각", count: 2, alarm: false },
];

export const TODAY_GAMES = [
  { home: "comets" as TeamId, away: "graiders" as TeamId, time: "18:30", stadium: "대전 갑천구장", note: "3연전 2차전" },
  { home: "tide" as TeamId, away: "breeze" as TeamId, time: "18:30", stadium: "부산 수영만구장", note: "매진 임박" },
  { home: "cranes" as TeamId, away: "harbors" as TeamId, time: "18:30", stadium: "수원 화홍구장", note: "" },
];

export const CHAT_THREADS: ChatThread[] = [
  {
    id: "c1",
    listingId: "l1",
    peerId: "s1",
    lastMessage: "네 실측 다시 재서 보내드렸어요",
    lastAt: "방금",
    unread: 2,
    stage: "가격제안",
    offer: 72000,
  },
  {
    id: "c2",
    listingId: "l7",
    peerId: "s1",
    lastMessage: "양도 링크 보냈습니다. 확인 부탁드려요",
    lastAt: "18분 전",
    unread: 0,
    stage: "결제완료",
  },
  {
    id: "c3",
    listingId: "l5",
    peerId: "s4",
    lastMessage: "주말에 직거래 가능하실까요",
    lastAt: "어제",
    unread: 0,
    stage: "예약중",
  },
  {
    id: "c4",
    listingId: "l3",
    peerId: "s3",
    lastMessage: "구매 확정했습니다. 감사합니다",
    lastAt: "3일 전",
    unread: 0,
    stage: "거래완료",
  },
];

export const CHAT_LOG: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", from: "system", text: "안전거래로 보호되는 대화입니다. 외부 송금 요청은 신고해 주세요.", at: "" },
    { id: "m2", from: "me", text: "안녕하세요. 실착 몇 번 하셨는지 여쭤봐도 될까요", at: "오후 2:04" },
    { id: "m3", from: "peer", text: "세 번 입었고 이후로는 옷장에 걸어만 뒀습니다", at: "오후 2:06" },
    { id: "m4", from: "peer", text: "", at: "오후 2:06", kind: "listing" },
    { id: "m5", from: "me", text: "어깨 실측만 한 번 더 확인 부탁드려요", at: "오후 2:11" },
    { id: "m6", from: "peer", text: "어깨 50cm 맞습니다. 사진 추가로 올렸어요", at: "오후 2:19" },
    { id: "m7", from: "me", text: "", at: "오후 2:22", kind: "offer", amount: 72000 },
    { id: "m8", from: "peer", text: "네 실측 다시 재서 보내드렸어요", at: "오후 2:24" },
  ],
};

export const POSTS: Post[] = [
  {
    id: "p1",
    board: "live",
    team: "comets",
    title: "오늘 갑천 3연전 2차전 실시간 응원 스레드",
    body: "선발 라인업 나왔습니다. 1번 중견수부터 순서 그대로네요. 오늘은 좀 터집시다.",
    author: "덕아웃반장",
    createdAt: "12분 전",
    likes: 214,
    comments: 486,
    photoId: 452,
    hot: true,
  },
  {
    id: "p2",
    board: "review",
    team: "comets",
    title: "어제 갑천구장 1루 응원석 후기 (시야 사진 있음)",
    body: "14열 정도면 응원 열기도 느껴지고 시야도 안 가립니다. 다만 3회 이후로는 햇빛이 정면으로 들어와요.",
    author: "외야석주민",
    createdAt: "3시간 전",
    likes: 88,
    comments: 31,
    photoId: 628,
    linkedListingId: "l7",
  },
  {
    id: "p3",
    board: "goods",
    team: "tide",
    title: "1998 복각 유니폼 드디어 구했습니다",
    body: "3년을 찾아다녔는데 결국 손에 넣었네요. 상태는 세월이 좀 묻었지만 그게 또 맛입니다.",
    author: "마킹장인",
    createdAt: "6시간 전",
    likes: 152,
    comments: 44,
    photoId: 646,
    linkedListingId: "l3",
    hot: true,
  },
  {
    id: "p4",
    board: "free",
    title: "원정 다니는 분들 교통편 어떻게 하시나요",
    body: "이번에 처음 원정 가는데 버스 응원단 신청이 나은지 개별로 가는 게 나은지 궁금합니다.",
    author: "직관메이트",
    createdAt: "9시간 전",
    likes: 37,
    comments: 62,
    photoId: 513,
  },
  {
    id: "p5",
    board: "review",
    team: "graiders",
    title: "잠원구장 외야 커플석 다녀왔습니다",
    body: "생각보다 그라운드가 멀지만 야경이 좋아서 만족했습니다. 야간경기 추천드려요.",
    author: "9회말투아웃",
    createdAt: "어제",
    likes: 64,
    comments: 18,
    photoId: 823,
  },
];

export const BOARDS: { key: BoardKey; label: string }[] = [
  { key: "live", label: "실시간 응원" },
  { key: "team", label: "구단 게시판" },
  { key: "review", label: "직관 후기" },
  { key: "goods", label: "굿즈 자랑" },
  { key: "free", label: "자유 게시판" },
];

/* ---------- 관리자 ---------- */

export const ADMIN_ME = {
  name: "윤세라",
  role: "거래운영팀 / 신고 담당",
};

export const KPI = {
  members: 184_206,
  membersDelta: 4.2,
  listings: 12_874,
  listingsDelta: -1.6,
  closeRate: 63.4,
  closeRateDelta: 2.1,
  gmv: 418_260_000,
  gmvDelta: 8.7,
};

export const CATEGORY_SHARE = [
  { label: "유니폼", value: 46 },
  { label: "티켓", value: 33 },
  { label: "굿즈", value: 21 },
];

export const TEAM_ACTIVITY: { team: TeamId; value: number }[] = [
  { team: "comets", value: 92 },
  { team: "graiders", value: 88 },
  { team: "tide", value: 81 },
  { team: "embers", value: 66 },
  { team: "harbors", value: 61 },
  { team: "cranes", value: 54 },
  { team: "pines", value: 47 },
  { team: "breeze", value: 41 },
  { team: "rhinos", value: 33 },
  { team: "mills", value: 28 },
];

/** 티켓 거래 추이 12주 */
export const TICKET_TREND = [
  { label: "6/1", value: 412 },
  { label: "6/8", value: 468 },
  { label: "6/15", value: 501 },
  { label: "6/22", value: 477 },
  { label: "6/29", value: 556 },
  { label: "7/6", value: 604 },
  { label: "7/13", value: 588 },
  { label: "7/20", value: 651 },
  { label: "7/27", value: 712 },
  { label: "8/3", value: 698 },
  { label: "8/10", value: 764 },
  { label: "8/17", value: 812 },
];

export const REPORTS: Report[] = [
  { id: "r1", target: "매물", targetLabel: "9/16 타이드 홈경기 내야지정석 1매", reason: "정가 초과", reporter: "외야석주민", createdAt: "2026-09-09 09:12", state: "미처리" },
  { id: "r2", target: "회원", targetLabel: "티켓상인77", reason: "사기 의심", reporter: "직관메이트", createdAt: "2026-09-09 08:47", state: "검토중", memo: "동일 계좌로 3건 신고 누적" },
  { id: "r3", target: "게시글", targetLabel: "원정 다니는 분들 교통편 어떻게 하시나요", reason: "도배", reporter: "굿즈창고", createdAt: "2026-09-09 07:31", state: "반려", memo: "정상 게시글로 확인" },
  { id: "r4", target: "매물", targetLabel: "미개봉 응원봉 대량 판매", reason: "금지 품목", reporter: "9회말투아웃", createdAt: "2026-09-08 22:05", state: "미처리" },
  { id: "r5", target: "댓글", targetLabel: "그 가격이면 그냥 암표 아닌가요", reason: "욕설 / 비방", reporter: "마킹장인", createdAt: "2026-09-08 20:44", state: "처리완료", memo: "댓글 블라인드" },
  { id: "r6", target: "매물", targetLabel: "9/20 결승 티켓 프리미엄", reason: "정가 초과", reporter: "덕아웃반장", createdAt: "2026-09-08 19:20", state: "미처리" },
  { id: "r7", target: "회원", targetLabel: "굿즈도매상", reason: "허위 매물", reporter: "외야석주민", createdAt: "2026-09-08 15:02", state: "검토중" },
];

export const MEMBERS: AdminMember[] = [
  { id: "u1", nickname: "9회말투아웃", realName: "김도현", phone: "010-2417-8830", joinedAt: "2021-06-14", team: "comets", trades: 64, mannerScore: 47.2, sanction: "없음", reports: 0 },
  { id: "u2", nickname: "티켓상인77", realName: "박준영", phone: "010-5528-1194", joinedAt: "2025-11-02", team: "tide", trades: 9, mannerScore: 28.4, sanction: "경고", reports: 3 },
  { id: "u3", nickname: "마킹장인", realName: "이수민", phone: "010-3390-6621", joinedAt: "2020-09-08", team: "tide", trades: 121, mannerScore: 49.0, sanction: "없음", reports: 0 },
  { id: "u4", nickname: "굿즈도매상", realName: "최윤호", phone: "010-7742-0058", joinedAt: "2026-02-19", team: "embers", trades: 14, mannerScore: 31.1, sanction: "7일 정지", reports: 5 },
  { id: "u5", nickname: "외야석주민", realName: "한지우", phone: "010-6015-3372", joinedAt: "2022-03-27", team: "graiders", trades: 38, mannerScore: 44.1, sanction: "없음", reports: 1 },
  { id: "u6", nickname: "덕아웃반장", realName: "정하윤", phone: "010-8834-2205", joinedAt: "2023-04-11", team: "comets", trades: 27, mannerScore: 42.6, sanction: "없음", reports: 0 },
  { id: "u7", nickname: "밤샘예매", realName: "오세훈", phone: "010-2266-9741", joinedAt: "2026-06-30", team: "cranes", trades: 3, mannerScore: 36.0, sanction: "영구 정지", reports: 8 },
];

export const SETTLEMENTS: Settlement[] = [
  { id: "st1", listingLabel: "타이드 올드 유니폼 1998 복각판", buyer: "덕아웃반장", seller: "마킹장인", amount: 165000, fee: 4950, requestedAt: "2026-09-08", state: "정산대기" },
  { id: "st2", listingLabel: "9/14 코메츠 1루 응원석 2연석", buyer: "외야석주민", seller: "9회말투아웃", amount: 34000, fee: 1020, requestedAt: "2026-09-08", state: "정산완료" },
  { id: "st3", listingLabel: "엠버스 콜라보 스케이트보드 데크", buyer: "직관메이트", seller: "굿즈창고", amount: 96000, fee: 2880, requestedAt: "2026-09-07", state: "보류" },
  { id: "st4", listingLabel: "하버스 응원 굿즈 세트 일괄", buyer: "밤샘예매", seller: "직관메이트", amount: 45000, fee: 1350, requestedAt: "2026-09-06", state: "환불" },
  { id: "st5", listingLabel: "그라이더스 원정 유니폼 2023", buyer: "마킹장인", seller: "외야석주민", amount: 112000, fee: 3360, requestedAt: "2026-09-05", state: "정산완료" },
];

export const DISPUTES: Dispute[] = [
  { id: "d1", listingLabel: "엠버스 콜라보 스케이트보드 데크", filedBy: "직관메이트", against: "굿즈창고", reason: "설명과 다른 하자", amount: 96000, filedAt: "2026-09-08", state: "조정중" },
  { id: "d2", listingLabel: "9/20 결승 티켓 프리미엄", filedBy: "덕아웃반장", against: "티켓상인77", reason: "양도 미이행", amount: 88000, filedAt: "2026-09-07", state: "접수" },
  { id: "d3", listingLabel: "하버스 응원 굿즈 세트 일괄", filedBy: "밤샘예매", against: "직관메이트", reason: "구성품 누락", amount: 45000, filedAt: "2026-09-05", state: "환불완료" },
];

export const PRICE_RULES: PriceRule[] = [
  { id: "pr1", stadium: "대전 갑천구장", zone: "1루 응원석", weekday: 28000, weekend: 32000, updatedAt: "2026-08-30", version: "v4.2" },
  { id: "pr2", stadium: "대전 갑천구장", zone: "내야지정석", weekday: 22000, weekend: 26000, updatedAt: "2026-08-30", version: "v4.2" },
  { id: "pr3", stadium: "부산 수영만구장", zone: "내야지정석", weekday: 24000, weekend: 28000, updatedAt: "2026-08-30", version: "v4.2" },
  { id: "pr4", stadium: "서울 잠원구장", zone: "외야 커플석", weekday: 38000, weekend: 44000, updatedAt: "2026-07-12", version: "v4.1" },
  { id: "pr5", stadium: "수원 화홍구장", zone: "원정 응원석", weekday: 34000, weekend: 39000, updatedAt: "2026-07-12", version: "v4.1" },
];

export const OVERPRICE_HITS: OverPriceHit[] = [
  { id: "oh1", listingLabel: "9/16 타이드 홈경기 내야지정석 1매", stadium: "부산 수영만구장", zone: "내야지정석", face: 28000, asking: 52000, seller: "마킹장인", detectedAt: "2026-09-09 07:41", state: "미처리" },
  { id: "oh2", listingLabel: "9/20 결승 티켓 프리미엄", stadium: "서울 잠원구장", zone: "외야 커플석", face: 44000, asking: 88000, seller: "티켓상인77", detectedAt: "2026-09-08 19:22", state: "노출중단" },
  { id: "oh3", listingLabel: "9/18 갑천 1루 응원석 4연석", stadium: "대전 갑천구장", zone: "1루 응원석", face: 32000, asking: 41000, seller: "밤샘예매", detectedAt: "2026-09-08 11:03", state: "미처리" },
  { id: "oh4", listingLabel: "9/21 수원 원정석 2매", stadium: "수원 화홍구장", zone: "원정 응원석", face: 39000, asking: 42000, seller: "직관메이트", detectedAt: "2026-09-07 16:48", state: "허용" },
];

export const BANNED_KEYWORDS: BannedKeyword[] = [
  { id: "bk1", word: "선입금", scope: "매물", hits: 142, addedAt: "2026-03-04", addedBy: "윤세라" },
  { id: "bk2", word: "직거래만", scope: "매물", hits: 38, addedAt: "2026-05-19", addedBy: "임태경" },
  { id: "bk3", word: "프리미엄", scope: "매물", hits: 91, addedAt: "2026-01-22", addedBy: "윤세라" },
  { id: "bk4", word: "대리구매", scope: "전체", hits: 27, addedAt: "2026-06-08", addedBy: "임태경" },
  { id: "bk5", word: "계좌이체", scope: "전체", hits: 205, addedAt: "2025-11-30", addedBy: "윤세라" },
];

export const RECENT_INQUIRIES = [
  { id: "iq1", user: "외야석주민", subject: "정산이 3일째 대기 상태입니다", at: "9월 9일 09:31", state: "미답변" },
  { id: "iq2", user: "굿즈창고", subject: "노출 중단 사유를 알고 싶습니다", at: "9월 9일 08:12", state: "답변완료" },
  { id: "iq3", user: "밤샘예매", subject: "계정 정지 이의 신청", at: "9월 8일 22:40", state: "미답변" },
  { id: "iq4", user: "마킹장인", subject: "실측 사진 추가 등록 방법", at: "9월 8일 17:05", state: "답변완료" },
];

export const KRW = (n: number) => `${n.toLocaleString("ko-KR")}원`;
