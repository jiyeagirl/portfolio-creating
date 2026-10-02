/**
 * BrandPilot mock 데이터. 진행 기간은 2026년 1월 ~ 4월이고 "오늘"은 2026년 4월 22일
 * 수요일이다(design.md "데이터 기준 시점"). 캠페인과 콘텐츠의 계절 어휘도 이 기간에
 * 맞춰 겨울 끝에서 봄으로 잡았다 - 1월에 여름 캠페인이 진행 중인 것처럼 읽히면 안 된다.
 * 여름 소재(선케어)는 4월 말 시작하는 "사전 예열" 캠페인에만 쓴다.
 *
 * 사진 id는 design.md의 "사진 매핑" 표에서만 고른다 - 실제로 열어 내용을 확인한 12장이고,
 * 캡션과 짝이 맞아야 한다. 새 id를 임의로 추가하지 않는다.
 *
 * 회사명은 워크스페이스 관례대로 알파벳 기반(운영 주체는 A뷰티), 사람 이름과 수치는
 * 사실적이되 가상이다. 레퍼런스는 개별 브랜드에 귀속시키지 않는다
 * (design.md "레퍼런스 탐색의 수집 범위").
 */

import type {
  ApprovalEvent,
  BrandColor,
  Campaign,
  ChannelStat,
  ContentItem,
  GuideRule,
  Person,
  ProductInfo,
  RefCategory,
  Reference,
  RefSource,
  ScheduledPost,
} from "@/projects/monitoring/brandpilot/lib/types";

export const TODAY = "2026-04-22";

export const brand = {
  name: "A뷰티",
  team: "브랜드마케팅팀",
  plan: "Growth",
};

export const currentUser = {
  name: "김서연",
  role: "브랜드마케팅팀 콘텐츠 리드",
  initial: "김",
};

export const people: Person[] = [
  { id: "p-1", name: "김서연", role: "콘텐츠 리드", initial: "김" },
  { id: "p-2", name: "박지훈", role: "퍼포먼스 마케터", initial: "박" },
  { id: "p-3", name: "이하늘", role: "아트 디렉터", initial: "이" },
  { id: "p-4", name: "최민서", role: "브랜드 매니저", initial: "최" },
  { id: "p-5", name: "정유진", role: "카피라이터", initial: "정" },
];

/* ── 캠페인 ── */

export const campaigns: Campaign[] = [
  {
    id: "cp-1",
    name: "봄 수분 집중 캠페인",
    goal: "봄 수분 라인 인지도 확보, 인스타 저장수 8천",
    status: "active",
    owner: "김서연",
    startsAt: "2026-03-09",
    endsAt: "2026-04-30",
    channels: ["instagram", "tiktok"],
    contentCount: 14,
    budgetLabel: "1,850만원",
    progress: 68,
  },
  {
    id: "cp-2",
    name: "허니 글로우 리뉴얼 론칭",
    goal: "리뉴얼 성분 소구, 상세페이지 유입 2만",
    status: "active",
    owner: "최민서",
    startsAt: "2026-03-23",
    endsAt: "2026-05-08",
    channels: ["instagram", "blog", "youtube"],
    contentCount: 11,
    budgetLabel: "2,400만원",
    progress: 41,
  },
  {
    id: "cp-3",
    name: "여름 선케어 사전 예열",
    goal: "여름 시즌 사전 수요 확보",
    status: "upcoming",
    owner: "박지훈",
    startsAt: "2026-04-27",
    endsAt: "2026-06-12",
    channels: ["instagram", "youtube"],
    contentCount: 5,
    budgetLabel: "1,200만원",
    progress: 12,
  },
  {
    id: "cp-4",
    name: "환절기 진정 케어 기획전",
    goal: "번들 판매 전환, 틱톡 조회 30만",
    status: "active",
    owner: "이하늘",
    startsAt: "2026-02-16",
    endsAt: "2026-04-24",
    channels: ["tiktok", "instagram"],
    contentCount: 9,
    budgetLabel: "980만원",
    progress: 82,
  },
  {
    id: "cp-5",
    name: "겨울 집중 보습 기획전",
    goal: "한정 구성 소진, 재구매 유도",
    status: "ended",
    owner: "정유진",
    startsAt: "2026-01-02",
    endsAt: "2026-02-13",
    channels: ["instagram", "blog"],
    contentCount: 18,
    budgetLabel: "2,100만원",
    progress: 100,
  },
];

/* ── 콘텐츠 ── */

export const contents: ContentItem[] = [
  {
    id: "ct-1",
    title: "봄 수분 루틴 3단계",
    caption:
      "환절기엔 겹겹이 얇게 올리는 게 답입니다. 토너부터 앰플까지 3단계로 정리했어요.",
    hashtags: ["#봄수분루틴", "#환절기스킨케어", "#수분앰플", "#데일리루틴"],
    channel: "instagram",
    status: "review",
    campaignId: "cp-1",
    campaignName: "봄 수분 집중 캠페인",
    productLine: "보습",
    photo: 152,
    author: "김서연",
    aiGenerated: true,
    createdAt: "2026-04-21 10:12",
    version: 3,
    guideIssues: 0,
  },
  {
    id: "ct-2",
    title: "허니 글로우 세럼 성분 스토리",
    caption:
      "리뉴얼된 허니 글로우 세럼은 벌꿀 추출물 비중을 12%까지 올렸습니다. 끈적임 없이 마무리되는 이유를 성분에서 찾았어요.",
    hashtags: ["#허니글로우", "#성분리뷰", "#보습세럼"],
    channel: "blog",
    status: "approved",
    campaignId: "cp-2",
    campaignName: "허니 글로우 리뉴얼 론칭",
    productLine: "보습",
    photo: 312,
    author: "정유진",
    aiGenerated: true,
    createdAt: "2026-04-20 15:40",
    version: 2,
    guideIssues: 0,
  },
  {
    id: "ct-3",
    title: "헤어 에센스 밤 루틴 15초",
    caption:
      "머리 말리기 전 한 번, 말린 뒤 한 번. 15초면 끝나는 밤 헤어 루틴입니다.",
    hashtags: ["#헤어에센스", "#밤루틴", "#머릿결관리"],
    channel: "tiktok",
    status: "published",
    campaignId: "cp-4",
    campaignName: "환절기 진정 케어 기획전",
    productLine: "헤어",
    photo: 65,
    author: "이하늘",
    aiGenerated: true,
    createdAt: "2026-04-08 09:05",
    publishedAt: "2026-04-11 19:00",
    version: 4,
    guideIssues: 0,
    reach: 184200,
    saves: 6240,
    engagementRate: 7.8,
  },
  {
    id: "ct-4",
    title: "베리 컴플렉스 앰플 8주 기록",
    caption:
      "8주 사용 후 결 변화를 기록했습니다. 베리 컴플렉스가 어떤 피부 타입에 맞는지 정리했어요.",
    hashtags: ["#베리컴플렉스", "#앰플추천", "#8주기록"],
    channel: "instagram",
    status: "scheduled",
    campaignId: "cp-2",
    campaignName: "허니 글로우 리뉴얼 론칭",
    productLine: "안티에이징",
    photo: 102,
    author: "박지훈",
    aiGenerated: false,
    createdAt: "2026-04-17 11:20",
    scheduledAt: "2026-04-27 18:00",
    version: 2,
    guideIssues: 0,
  },
  {
    id: "ct-5",
    title: "나이트 리커버리 크림 티저",
    caption:
      "자는 동안 회복하는 밤. 환절기 한정 나이트 리커버리 크림을 먼저 만나보세요.",
    hashtags: ["#나이트리커버리", "#환절기케어", "#나이트크림"],
    channel: "instagram",
    status: "draft",
    campaignId: "cp-4",
    campaignName: "환절기 진정 케어 기획전",
    productLine: "나이트",
    photo: 365,
    author: "최민서",
    aiGenerated: true,
    createdAt: "2026-04-22 09:30",
    version: 1,
    guideIssues: 2,
  },
  {
    id: "ct-6",
    title: "플로럴 미스트 환절기 활용법",
    caption:
      "히터 아래에서 건조할 때, 메이크업 위에 바로 뿌려도 뭉치지 않는 미스트 사용법입니다.",
    hashtags: ["#플로럴미스트", "#수분미스트", "#환절기꿀팁"],
    channel: "instagram",
    status: "published",
    campaignId: "cp-1",
    campaignName: "봄 수분 집중 캠페인",
    productLine: "미스트",
    photo: 106,
    author: "정유진",
    aiGenerated: true,
    createdAt: "2026-03-28 14:02",
    publishedAt: "2026-04-02 12:00",
    version: 3,
    guideIssues: 0,
    reach: 96400,
    saves: 3180,
    engagementRate: 5.4,
  },
  {
    id: "ct-7",
    title: "원료 산지 이야기 시리즈 1편",
    caption:
      "허니 글로우에 들어가는 벌꿀은 어디서 오는지, 수급 과정을 그대로 담았습니다.",
    hashtags: ["#원료이야기", "#브랜드스토리", "#성분투명성"],
    channel: "youtube",
    status: "review",
    campaignId: "cp-2",
    campaignName: "허니 글로우 리뉴얼 론칭",
    productLine: "보습",
    photo: 490,
    author: "이하늘",
    aiGenerated: false,
    createdAt: "2026-04-19 16:45",
    version: 1,
    guideIssues: 1,
  },
  {
    id: "ct-8",
    title: "핸드크림 데스크 루틴",
    caption:
      "책상 위에 두고 쓰는 핸드크림. 바르고 바로 키보드를 만져도 미끄럽지 않습니다.",
    hashtags: ["#핸드크림", "#데스크템", "#오피스뷰티"],
    channel: "instagram",
    status: "approved",
    campaignId: "cp-1",
    campaignName: "봄 수분 집중 캠페인",
    productLine: "핸드",
    photo: 326,
    author: "김서연",
    aiGenerated: true,
    createdAt: "2026-04-16 13:10",
    version: 2,
    guideIssues: 0,
  },
  {
    id: "ct-9",
    title: "봄밤 무드 캠페인 컷",
    caption:
      "해가 진 뒤에도 남아 있는 봄기운. 봄밤의 온도를 그대로 담은 캠페인 컷입니다.",
    hashtags: ["#봄밤", "#캠페인컷", "#브랜드무드"],
    channel: "instagram",
    status: "rejected",
    campaignId: "cp-1",
    campaignName: "봄 수분 집중 캠페인",
    productLine: "브랜드",
    photo: 375,
    author: "최민서",
    aiGenerated: true,
    createdAt: "2026-04-14 17:30",
    version: 2,
    guideIssues: 3,
  },
  {
    id: "ct-10",
    title: "봄 나들이 헤어 세팅 15초",
    caption:
      "바람 부는 날에도 흐트러지지 않게. 나가기 전 15초로 끝내는 헤어 세팅입니다.",
    hashtags: ["#봄나들이", "#헤어세팅", "#헤어에센스"],
    channel: "tiktok",
    status: "published",
    campaignId: "cp-4",
    campaignName: "환절기 진정 케어 기획전",
    productLine: "헤어",
    photo: 646,
    author: "박지훈",
    aiGenerated: true,
    createdAt: "2026-03-05 10:40",
    publishedAt: "2026-03-12 20:00",
    version: 5,
    guideIssues: 0,
    reach: 312800,
    saves: 9840,
    engagementRate: 9.2,
  },
  {
    id: "ct-11",
    title: "여름 선세럼 사전 공개",
    caption:
      "여름이 오기 전에 먼저 준비합니다. 5월 출시 예정인 선세럼의 제형을 미리 공개해요.",
    hashtags: ["#선세럼", "#사전공개", "#여름준비"],
    channel: "blog",
    status: "scheduled",
    campaignId: "cp-3",
    campaignName: "여름 선케어 사전 예열",
    productLine: "선 케어",
    photo: 64,
    author: "이하늘",
    aiGenerated: false,
    createdAt: "2026-04-13 11:55",
    scheduledAt: "2026-04-29 10:00",
    version: 1,
    guideIssues: 0,
  },
  {
    id: "ct-12",
    title: "선세럼 발림성 클로즈업",
    caption:
      "백탁 없이 스며드는 과정을 그대로 찍었습니다. 덧발라도 밀리지 않는 제형이에요.",
    hashtags: ["#선세럼", "#백탁없는선크림", "#제형리뷰"],
    channel: "tiktok",
    status: "generating",
    campaignId: "cp-3",
    campaignName: "여름 선케어 사전 예열",
    productLine: "선 케어",
    photo: 64,
    author: "김서연",
    aiGenerated: true,
    createdAt: "2026-04-22 11:05",
    version: 1,
    guideIssues: 0,
  },
];

/* ── 승인 이력 ── */

export const approvalEvents: ApprovalEvent[] = [
  {
    id: "ap-1",
    contentId: "ct-1",
    action: "requested",
    actor: "김서연",
    at: "2026-04-21 10:20",
    body: "3차 수정본 검토 요청드립니다. 카피 길이를 2줄로 줄였습니다.",
    version: 3,
  },
  {
    id: "ap-2",
    contentId: "ct-1",
    action: "comment",
    actor: "최민서",
    at: "2026-04-21 14:05",
    body: "첫 문장이 좋습니다. 다만 '겹겹이 얇게'는 사용법 근거를 한 줄 붙여주세요.",
    version: 3,
  },
  {
    id: "ap-3",
    contentId: "ct-1",
    action: "revised",
    actor: "김서연",
    at: "2026-04-21 16:40",
    body: "제품 사용 순서 안내를 캡션 하단에 추가했습니다.",
    version: 3,
  },
  {
    id: "ap-4",
    contentId: "ct-9",
    action: "rejected",
    actor: "최민서",
    at: "2026-04-15 09:15",
    body: "무드는 좋지만 브랜드 가이드의 금지 표현 3건이 걸립니다. 카피를 다시 잡아주세요.",
    version: 2,
  },
  {
    id: "ap-5",
    contentId: "ct-2",
    action: "approved",
    actor: "최민서",
    at: "2026-04-20 17:20",
    body: "성분 표기 확인했습니다. 게시 진행하셔도 좋습니다.",
    version: 2,
  },
  {
    id: "ap-6",
    contentId: "ct-7",
    action: "requested",
    actor: "이하늘",
    at: "2026-04-19 17:00",
    body: "1편 러프컷입니다. 자막 톤 확인 부탁드립니다.",
    version: 1,
  },
  {
    id: "ap-7",
    contentId: "ct-8",
    action: "approved",
    actor: "최민서",
    at: "2026-04-18 10:30",
    body: "바로 예약 걸어도 될 것 같습니다.",
    version: 2,
  },
];

/* ── 레퍼런스 탐색 ──
   각 플랫폼이 공개한 API로만 수집한다. 스크래핑도, 특정 브랜드 계정을 지목한 모니터링도
   하지 않는다. 소스마다 실제 호출하는 API 경로와 권한, 할당량 제약을 함께 적어,
   "어디서 어떻게 가져오는지"가 화면에서 드러나게 한다. 수집된 소재는 브랜드가 아니라
   소구 방식으로 분류하고, 화면 어디에도 개별 브랜드를 귀속시키지 않는다. */

export const refSources: RefSource[] = [
  {
    id: "src-meta",
    name: "Meta 광고 라이브러리",
    platform: "Meta",
    api: "Ad Library API",
    path: "GET /ads_archive",
    scope: "페이스북과 인스타그램에 집행된 광고 중 Meta가 아카이브로 공개한 소재를 가져옵니다.",
    note: "앱 검수와 신원 확인을 마친 토큰이 필요합니다. EU 집행 건은 전체 카테고리, 그 외 지역은 정치와 사회 이슈 광고만 공개됩니다.",
    state: "connected",
    lastSyncAt: "2026-04-22 06:00",
    weekly: 62,
    enabled: true,
  },
  {
    id: "src-ig",
    name: "Instagram 해시태그 공개 게시물",
    platform: "Instagram",
    api: "Graph API",
    path: "/ig_hashtag_search → /recent_media",
    scope: "등록한 캠페인 해시태그가 달린 공개 게시물만 조회합니다.",
    note: "비즈니스 계정 토큰 기준입니다. 조회 가능한 해시태그는 7일 단위 30개로 제한되고, 비공개 계정 게시물은 응답에 포함되지 않습니다.",
    state: "connected",
    lastSyncAt: "2026-04-22 06:00",
    weekly: 34,
    enabled: true,
  },
  {
    id: "src-yt",
    name: "YouTube 공개 동영상",
    platform: "YouTube",
    api: "Data API v3",
    path: "search.list",
    scope: "공개 상태 동영상 중 캠페인 키워드에 걸리는 브랜드 채널 콘텐츠를 가져옵니다.",
    note: "일 할당량 10,000 유닛 중 검색 1회가 100 유닛을 씁니다. 현재 하루 11회로 예약돼 있습니다.",
    state: "connected",
    lastSyncAt: "2026-04-22 06:00",
    weekly: 11,
    enabled: true,
  },
  {
    id: "src-naver",
    name: "네이버 블로그 공개 포스트",
    platform: "Naver",
    api: "검색 API",
    path: "/v1/search/blog.json",
    scope: "캠페인 키워드로 상위 노출된 공개 블로그 포스트를 가져옵니다.",
    note: "일 25,000회 호출 제한입니다. 본문은 저장하지 않고 원문 링크와 요약만 보관합니다.",
    state: "connected",
    lastSyncAt: "2026-04-22 06:00",
    weekly: 9,
    enabled: true,
  },
  {
    id: "src-tt-cc",
    name: "TikTok Creative Center",
    platform: "TikTok",
    api: "조회 API 없음",
    path: "담당자 URL 등록",
    scope: "Top Ads 페이지에서 담당자가 소재 링크를 직접 등록합니다.",
    note: "누구나 볼 수 있는 페이지지만 공식 조회 API가 없어 자동 수집 대상이 아닙니다. 주 1회 큐레이션합니다.",
    state: "manual",
    lastSyncAt: "2026-04-20 14:10",
    weekly: 8,
    enabled: true,
  },
  {
    id: "src-tt-ccl",
    name: "TikTok Commercial Content Library",
    platform: "TikTok",
    api: "Research API",
    path: "/commercial_content/ad/query",
    scope: "EU에 집행된 광고와 커머셜 콘텐츠 아카이브를 조회합니다.",
    note: "연구 목적 접근 신청이 승인돼야 호출할 수 있습니다. 4월 9일에 신청해 현재 검수 대기 중입니다.",
    state: "review",
    lastSyncAt: "-",
    weekly: 0,
    enabled: false,
  },
];

/** 수집 파이프라인 상태. 소스별 수집 뒤 중복 제거 → 자동 분류 순서로 돈다. */
export const collectPipeline = [
  { label: "최근 동기화", value: "2026-04-22 06:00" },
  { label: "다음 동기화", value: "2026-04-23 06:00" },
  { label: "이번 회차 수집", value: "124건" },
  { label: "중복 제거", value: "18건" },
  { label: "자동 분류 정확도", value: "94.2%" },
  { label: "보관 범위", value: "원문 링크와 메타데이터" },
];

export const refCategories: RefCategory[] = [
  { id: "cat-1", label: "수분 소구" },
  { id: "cat-2", label: "성분 소구" },
  { id: "cat-3", label: "숏폼 루틴" },
  { id: "cat-4", label: "시즌 캠페인" },
  { id: "cat-5", label: "무드 브랜딩" },
];

export const references: Reference[] = [
  {
    id: "rf-1",
    categoryId: "cat-1",
    categoryLabel: "수분 소구",
    sourceName: "Meta 광고 라이브러리",
    title: "환절기 수분 3종 비교 리뷰",
    channel: "instagram",
    photo: 106,
    collectedAt: "2026-04-19",
    engagement: "저장 8,420",
    keywords: ["비교리뷰", "속당김", "지속력"],
    styleNotes: "시즌 컷으로 시작해 제형 클로즈업으로 넘어간다. 자막은 화면 하단 고정.",
    bookmarked: true,
  },
  {
    id: "rf-2",
    categoryId: "cat-2",
    categoryLabel: "성분 소구",
    sourceName: "YouTube 공개 동영상",
    title: "성분 실험실 시리즈 4화",
    channel: "youtube",
    photo: 490,
    collectedAt: "2026-04-17",
    engagement: "조회 21.4만",
    keywords: ["성분", "실험", "전문성"],
    styleNotes: "어두운 우드 배경에 원료를 나열. 브랜드 컬러를 소품 하나로만 노출.",
    bookmarked: true,
  },
  {
    id: "rf-3",
    categoryId: "cat-3",
    categoryLabel: "숏폼 루틴",
    sourceName: "TikTok Creative Center",
    title: "밤 루틴 15초 챌린지",
    channel: "tiktok",
    photo: 65,
    collectedAt: "2026-04-15",
    engagement: "조회 87.6만",
    keywords: ["숏폼", "루틴", "챌린지"],
    styleNotes: "역광 인물 컷으로 시작해 3컷 안에 제품을 노출. 자막 속도가 빠름.",
    bookmarked: false,
  },
  {
    id: "rf-4",
    categoryId: "cat-4",
    categoryLabel: "시즌 캠페인",
    sourceName: "Meta 광고 라이브러리",
    title: "봄 시즌 한정판 티저",
    channel: "instagram",
    photo: 152,
    collectedAt: "2026-04-12",
    engagement: "저장 5,110",
    keywords: ["한정판", "플로럴", "티저"],
    styleNotes: "꽃 매크로 한 장으로 시즌감만 전달. 제품은 다음 컷에.",
    bookmarked: true,
  },
  {
    id: "rf-5",
    categoryId: "cat-5",
    categoryLabel: "무드 브랜딩",
    sourceName: "Instagram 해시태그 공개 게시물",
    title: "봄밤 무드 캠페인",
    channel: "instagram",
    photo: 375,
    collectedAt: "2026-04-08",
    engagement: "저장 3,940",
    keywords: ["무드", "야간", "감성"],
    styleNotes: "채도를 낮춘 어두운 톤. 카피를 이미지 위에 얹지 않고 캡션으로만 처리.",
    bookmarked: false,
  },
  {
    id: "rf-6",
    categoryId: "cat-2",
    categoryLabel: "성분 소구",
    sourceName: "네이버 블로그 공개 포스트",
    title: "허니 성분 보습력 실험",
    channel: "blog",
    photo: 312,
    collectedAt: "2026-04-05",
    engagement: "댓글 612",
    keywords: ["허니", "보습", "수치화"],
    styleNotes: "수치 그래프를 본문 상단에 배치해 신뢰도를 먼저 확보.",
    bookmarked: true,
  },
];

export const aiKeywordInsights = [
  { keyword: "속당김 없는", count: 34, delta: "+12" },
  { keyword: "성분 투명성", count: 28, delta: "+9" },
  { keyword: "15초 루틴", count: 24, delta: "+15" },
  { keyword: "봄밤 무드", count: 19, delta: "+4" },
  { keyword: "8주 기록", count: 16, delta: "+7" },
];

/** 수집하고 분류한 소재 전체에서 AI가 뽑아낸 요약. 개별 브랜드가 아니라 패턴을 말한다. */
export const referenceSummary = [
  {
    id: "sm-1",
    tag: "포맷",
    title: "성분을 숫자로 먼저 보여주는 소재가 늘었다",
    detail:
      "최근 30일 수집분 118건 중 41건이 함량, 사용 기간, 개선율 같은 수치를 첫 3초 안에 노출했습니다. 4주 전보다 9건 늘었습니다.",
  },
  {
    id: "sm-2",
    tag: "구성",
    title: "숏폼은 제품보다 인물 컷을 먼저 놓는다",
    detail:
      "숏폼 루틴으로 분류된 47건 중 33건이 인물 클로즈업으로 시작했습니다. 제품이 처음 등장하는 시점은 평균 4.2초입니다.",
  },
  {
    id: "sm-3",
    tag: "가이드",
    title: "시즌 소재는 카피를 이미지에 얹지 않는다",
    detail:
      "시즌 캠페인 22건 중 16건이 텍스트를 캡션으로만 처리했습니다. 이미지 내 텍스트 비중 20% 이하라는 우리 가이드와 방향이 같습니다.",
  },
];

/* ── 브랜드 가이드 ── */

export const guideRules: GuideRule[] = [
  {
    id: "gr-1",
    category: "톤앤매너",
    label: "단정하고 담백한 서술",
    detail: "감탄사와 과장 수식어를 쓰지 않는다. 문장은 2줄 이내로 끊는다.",
    enabled: true,
  },
  {
    id: "gr-2",
    category: "톤앤매너",
    label: "성분은 수치와 함께",
    detail: "성분을 언급할 때는 함량이나 기간 같은 확인 가능한 수치를 붙인다.",
    enabled: true,
  },
  {
    id: "gr-3",
    category: "금지 표현",
    label: "의학적 효능 표현 금지",
    detail: "치료, 완치, 재생, 미백 즉시 같은 표현은 사용할 수 없다.",
    enabled: true,
  },
  {
    id: "gr-4",
    category: "금지 표현",
    label: "최상급 단정 금지",
    detail: "최고, 유일한, 1위 같은 단정 표현은 근거 표기 없이 쓰지 않는다.",
    enabled: true,
  },
  {
    id: "gr-5",
    category: "금지 표현",
    label: "경쟁사 직접 비교 금지",
    detail: "타 브랜드명을 직접 언급하거나 비교 대상으로 세우지 않는다.",
    enabled: true,
  },
  {
    id: "gr-6",
    category: "필수 표기",
    label: "광고 표기",
    detail: "유료 광고 콘텐츠에는 상단 첫 줄에 광고 표기를 넣는다.",
    enabled: true,
  },
  {
    id: "gr-7",
    category: "필수 표기",
    label: "개인차 문구",
    detail: "사용 후기 콘텐츠에는 개인차가 있을 수 있다는 문구를 넣는다.",
    enabled: false,
  },
];

export const brandColors: BrandColor[] = [
  { name: "브랜드 바이올렛", hex: "#7928CA", usage: "로고, 주요 버튼, 강조" },
  { name: "잉크", hex: "#171717", usage: "제목, 본문" },
  { name: "웜 아이보리", hex: "#F7F3EA", usage: "제품 배경, 패키지" },
  { name: "허니 앰버", hex: "#E0A33D", usage: "보습 라인 서브 컬러" },
  { name: "소프트 로즈", hex: "#E8B4C2", usage: "플로럴 라인 서브 컬러" },
];

export const products: ProductInfo[] = [
  {
    id: "pd-1",
    name: "데일리 선세럼 SPF50+",
    line: "선 케어",
    keyIngredient: "무기자차 복합",
    claim: "백탁 없이 덧발리는 데일리 선세럼",
    photo: 64,
  },
  {
    id: "pd-2",
    name: "허니 글로우 세럼",
    line: "보습",
    keyIngredient: "벌꿀 추출물 12%",
    claim: "끈적임 없이 마무리되는 보습 세럼",
    photo: 312,
  },
  {
    id: "pd-3",
    name: "베리 컴플렉스 앰플",
    line: "안티에이징",
    keyIngredient: "베리 5종 복합 추출물",
    claim: "8주 사용 결 관리 앰플",
    photo: 102,
  },
  {
    id: "pd-4",
    name: "리페어 헤어 에센스",
    line: "헤어",
    keyIngredient: "가수분해 실크 단백질",
    claim: "15초 밤 루틴 헤어 에센스",
    photo: 65,
  },
  {
    id: "pd-5",
    name: "나이트 리커버리 크림",
    line: "나이트",
    keyIngredient: "세라마이드 NP",
    claim: "자는 동안 채우는 나이트 크림",
    photo: 365,
  },
];

export const bannedPhraseHits = [
  { phrase: "완벽한 미백", contentTitle: "봄밤 무드 캠페인 컷", rule: "의학적 효능 표현 금지" },
  { phrase: "업계 1위", contentTitle: "봄밤 무드 캠페인 컷", rule: "최상급 단정 금지" },
  { phrase: "타사 대비", contentTitle: "봄밤 무드 캠페인 컷", rule: "경쟁사 직접 비교 금지" },
  { phrase: "즉각 재생", contentTitle: "나이트 리커버리 크림 티저", rule: "의학적 효능 표현 금지" },
  { phrase: "누구에게나", contentTitle: "나이트 리커버리 크림 티저", rule: "최상급 단정 금지" },
  { phrase: "완치", contentTitle: "원료 산지 이야기 시리즈 1편", rule: "의학적 효능 표현 금지" },
];

/* ── 게시 관리 ── */

export const scheduledPosts: ScheduledPost[] = [
  { id: "sp-1", contentId: "ct-4", title: "베리 컴플렉스 앰플 8주 기록", channel: "instagram", at: "2026-04-27 18:00", status: "scheduled", photo: 102 },
  { id: "sp-2", contentId: "ct-11", title: "여름 선세럼 사전 공개", channel: "blog", at: "2026-04-29 10:00", status: "scheduled", photo: 64 },
  { id: "sp-3", contentId: "ct-2", title: "허니 글로우 세럼 성분 스토리", channel: "blog", at: "2026-04-24 09:00", status: "scheduled", photo: 312 },
  { id: "sp-4", contentId: "ct-8", title: "핸드크림 데스크 루틴", channel: "instagram", at: "2026-04-25 12:30", status: "scheduled", photo: 326 },
  { id: "sp-5", contentId: "ct-3", title: "헤어 에센스 밤 루틴 15초", channel: "tiktok", at: "2026-04-11 19:00", status: "published", photo: 65 },
  { id: "sp-6", contentId: "ct-6", title: "플로럴 미스트 환절기 활용법", channel: "instagram", at: "2026-04-02 12:00", status: "published", photo: 106 },
  { id: "sp-7", contentId: "ct-10", title: "봄 나들이 헤어 세팅 15초", channel: "tiktok", at: "2026-03-12 20:00", status: "published", photo: 646 },
  { id: "sp-8", contentId: "ct-9", title: "봄밤 무드 캠페인 컷", channel: "instagram", at: "2026-04-16 18:00", status: "failed", photo: 375 },
];

/* ── 성과 ── */

export const channelStats: ChannelStat[] = [
  { channel: "instagram", reach: 842_000, engagement: 6.2, delta: "+14.2%", posts: 24 },
  { channel: "tiktok", reach: 1_204_000, engagement: 8.9, delta: "+31.5%", posts: 16 },
  { channel: "youtube", reach: 318_000, engagement: 4.1, delta: "-3.8%", posts: 7 },
  { channel: "blog", reach: 96_000, engagement: 2.7, delta: "+6.4%", posts: 12 },
];

/** 진행 기간이 1월~4월이라 추이 차트도 4개월만 쓴다. */
export const monthlyReach = [
  { month: "1월", reach: 1_180_000, posts: 38 },
  { month: "2월", reach: 1_460_000, posts: 44 },
  { month: "3월", reach: 1_890_000, posts: 52 },
  { month: "4월", reach: 2_460_000, posts: 59 },
];

export const monthlyEngagement = [
  { month: "1월", value: 4.2 },
  { month: "2월", value: 4.8 },
  { month: "3월", value: 5.6 },
  { month: "4월", value: 6.5 },
];

export const contentTypeShare = [
  { label: "숏폼 영상", value: 38, note: "틱톡, 쇼츠" },
  { label: "제품 컷", value: 24, note: "제형, 패키지" },
  { label: "인물 캠페인", value: 18, note: "모델, 라이프스타일" },
  { label: "성분 스토리", value: 12, note: "원료, 실험" },
  { label: "기타", value: 8, note: "공지, 이벤트" },
];

export const campaignReach = [
  { label: "환절기 진정 케어 기획전", value: 1_820_000 },
  { label: "봄 수분 집중 캠페인", value: 1_240_000 },
  { label: "허니 글로우 리뉴얼 론칭", value: 860_000 },
  { label: "겨울 집중 보습 기획전", value: 640_000 },
  { label: "여름 선케어 사전 예열", value: 180_000 },
];

export const aiInsights = [
  {
    id: "in-1",
    title: "숏폼 첫 3초에 제형을 노출한 콘텐츠가 저장수 2.4배",
    detail:
      "4월 발행 숏폼 16건 중 제형 클로즈업으로 시작한 9건의 평균 저장수가 나머지 대비 2.4배 높았습니다. 선세럼 후속 콘텐츠에도 같은 구성을 권장합니다.",
    impact: "높음",
  },
  {
    id: "in-2",
    title: "블로그 유입이 인스타 캡션 링크에서 발생",
    detail:
      "성분 스토리 블로그 유입의 62%가 인스타그램 캡션 링크에서 왔습니다. 블로그 단독 배포보다 인스타 선행 발행이 효율적입니다.",
    impact: "보통",
  },
  {
    id: "in-3",
    title: "유튜브 쇼츠 참여율만 전월 대비 하락",
    detail:
      "쇼츠 참여율이 4.1%로 3.8% 하락했습니다. 자막 밀도가 높아 이탈이 빨라진 것으로 보입니다. 자막을 화면당 12자 이내로 줄여보세요.",
    impact: "높음",
  },
];

export const topContents = contents
  .filter((c) => c.status === "published" && c.reach)
  .sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0));

/* ── AI 학습 소스 ── */

export const trainingSources = [
  { name: "승인 완료 콘텐츠", count: 148, at: "2026-04-21", state: "반영됨" },
  { name: "브랜드 가이드 규칙", count: 7, at: "2026-04-21", state: "반영됨" },
  { name: "제품 상세페이지", count: 22, at: "2026-04-13", state: "반영됨" },
  { name: "고객 리뷰 요약", count: 640, at: "2026-04-06", state: "반영됨" },
  { name: "북마크한 레퍼런스", count: 4, at: "-", state: "대기" },
];

/* ── AI 생성 ── */

export const generatePurposes = [
  "신제품 소개",
  "사용법 안내",
  "성분 설명",
  "후기 재구성",
  "이벤트 안내",
];

export const generatedDrafts = [
  {
    id: "gd-1",
    caption:
      "환절기엔 겹겹이 얇게 올리는 게 답입니다. 토너부터 앰플까지 3단계로 정리했어요.",
    hashtags: ["#봄수분루틴", "#환절기스킨케어", "#수분앰플", "#데일리루틴"],
    tone: "담백한 정보형",
    photo: 152,
  },
  {
    id: "gd-2",
    caption:
      "아침에 당기는 게 싫었다면. 자는 동안 채우고 아침에 덜 당기는 순서로 바꿔보세요.",
    hashtags: ["#속당김", "#수분앰플추천", "#환절기필수템"],
    tone: "공감형 도입",
    photo: 326,
  },
  {
    id: "gd-3",
    caption:
      "일교차가 큰 4월. 아침과 밤에 쓰는 제품을 나누면 하루 피부 컨디션이 달라집니다.",
    hashtags: ["#일교차", "#아침저녁루틴", "#수분앰플"],
    tone: "시간대 소구",
    photo: 106,
  },
];

/* ── 대시보드 ── */

export const quickActions = [
  { key: "generate" as const, label: "AI 콘텐츠 생성", desc: "캠페인을 고르면 카피와 이미지를 함께 만듭니다" },
  { key: "approvals" as const, label: "승인 대기 확인", desc: "검토를 기다리는 콘텐츠를 처리합니다" },
  { key: "publishing" as const, label: "게시 일정 관리", desc: "예약 게시와 캘린더를 확인합니다" },
  { key: "references" as const, label: "레퍼런스 탐색", desc: "업계 공개 광고를 모아 분류하고 분석합니다" },
];

export const aiRecommendations = [
  {
    id: "rc-1",
    title: "봄 수분 숏폼을 3건 더 만들어보세요",
    detail: "봄 수분 캠페인 목표 저장수의 68%를 달성했습니다. 숏폼이 저장 전환에 가장 효율적입니다.",
    screen: "generate" as const,
  },
  {
    id: "rc-2",
    title: "반려된 무드 컷의 금지 표현 3건을 수정하세요",
    detail: "브랜드 가이드 위반으로 반려된 상태입니다. 카피만 교체하면 재승인 요청이 가능합니다.",
    screen: "approvals" as const,
  },
  {
    id: "rc-3",
    title: "게시 실패한 인스타그램 예약을 재시도하세요",
    detail: "4월 16일 18시 예약이 실패로 남아 있습니다. 캠페인 노출 공백이 6일째입니다.",
    screen: "publishing" as const,
  },
];

export const recentActivity = [
  { id: "ac-1", actor: "최민서", action: "허니 글로우 세럼 성분 스토리를 승인했습니다", at: "04/20 17:20" },
  { id: "ac-2", actor: "김서연", action: "봄 수분 루틴 3단계를 3차 수정했습니다", at: "04/21 16:40" },
  { id: "ac-3", actor: "AI 어시스턴트", action: "선세럼 발림성 클로즈업 카피를 생성 중입니다", at: "04/22 11:05" },
  { id: "ac-4", actor: "이하늘", action: "원료 산지 이야기 1편 검토를 요청했습니다", at: "04/19 17:00" },
  { id: "ac-5", actor: "박지훈", action: "베리 컴플렉스 앰플 후기를 4월 27일로 예약했습니다", at: "04/17 11:20" },
];
