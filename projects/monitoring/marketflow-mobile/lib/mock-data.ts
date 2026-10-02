import type {
  AdminProfile,
  AppNotification,
  Assignee,
  Brand,
  ContentItem,
} from "@/projects/monitoring/marketflow-mobile/lib/types";

/* 목업 "오늘" 기준일. spec.md 1행의 제작 기간(2025.03~2025.09) 안에서 진행. */
export const TODAY = "2025-09-18";

export const brands: Brand[] = [
  { id: "brand-a", name: "A테크", industry: "가전/전자", initial: "A" },
  { id: "brand-b", name: "B뷰티", industry: "코스메틱", initial: "B" },
  { id: "brand-c", name: "C푸드", industry: "F&B", initial: "C" },
  { id: "brand-d", name: "D카페", industry: "카페 프랜차이즈", initial: "D" },
  { id: "brand-e", name: "E패션", industry: "패션/의류", initial: "E" },
];

export const assignees: Assignee[] = [
  { id: "user-yoon", name: "김도윤", role: "콘텐츠 매니저" },
  { id: "user-seo", name: "이서연", role: "콘텐츠 매니저" },
  { id: "user-jihun", name: "박지훈", role: "SNS 운영팀" },
  { id: "user-yuna", name: "최유나", role: "SNS 운영팀" },
];

/* picsum id -> 실제 육안 확인 내용 / 화면 사용처. design.md "사진 매핑" 표와 1:1로 대응. */
export const contentItems: ContentItem[] = [
  {
    id: "ct-001",
    title: "가을 신상 니트 룩북 블로그",
    type: "blog",
    brandId: "brand-e",
    channelIds: ["naver-blog"],
    assigneeId: "user-seo",
    status: "pending",
    createdAt: "2025-09-18T08:12:00+09:00",
    scheduledAt: "2025-09-19T10:00:00+09:00",
    heroImageId: 1059,
    copy:
      "선선해진 아침 공기에 어울리는 가을 니트 5벌을 골랐습니다. 캐주얼한 데일리룩부터 오피스룩까지, 한 벌로 세 가지 무드를 내는 레이어드 팁을 함께 소개합니다. 이번 시즌 컬러 트렌드인 카멜과 차콜 조합을 중심으로 스타일링했습니다.",
    channelPreviews: [
      {
        channel: "naver-blog",
        caption:
          "환절기 니트 스타일링, 이 5벌이면 끝. 카멜×차콜 조합으로 완성하는 가을 데일리룩을 소개합니다.",
        hashtags: ["가을니트", "데일리룩", "환절기코디"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-002",
    title: "가을 시즌 라떼 3종 카드뉴스",
    type: "card-news",
    brandId: "brand-d",
    channelIds: ["instagram", "facebook"],
    assigneeId: "user-yoon",
    status: "pending",
    createdAt: "2025-09-17T14:30:00+09:00",
    scheduledAt: "2025-09-20T09:00:00+09:00",
    heroImageId: 431,
    copy:
      "가을 한정 시즌 메뉴 3종(단호박 라떼, 흑임자 라떼, 밤 크림 라떼)을 소개하는 카드뉴스입니다. 원두 산지 소개와 함께 매장 방문을 유도하는 CTA로 마무리합니다.",
    cardNewsSlides: [
      { id: "slide-1", imageId: 431, heading: "가을이 왔다, 시즌 라떼 3종", body: "10월 한 달간 전 매장에서 만나보세요" },
      { id: "slide-2", imageId: 1060, heading: "핸드드립으로 뽑은 베이스", body: "에티오피아 예가체프 원두 사용" },
      { id: "slide-3", imageId: 42, heading: "매장에서 직접 만나보세요", body: "전국 42개 매장 동시 출시" },
    ],
    channelPreviews: [
      {
        channel: "instagram",
        caption: "가을 한정, 라떼 3종 출시. 단호박, 흑임자, 밤 크림, 이번 주말 매장에서 먼저 만나보세요.",
        hashtags: ["가을라떼", "시즌메뉴", "카페추천"],
      },
      {
        channel: "facebook",
        caption: "10월 한 달간 진행하는 가을 시즌 라떼 3종을 소개합니다. 매장별 재고는 다를 수 있어요.",
        hashtags: ["가을라떼", "시즌메뉴"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-003",
    title: "저당 요거트볼 레시피 카드뉴스",
    type: "card-news",
    brandId: "brand-c",
    channelIds: ["instagram"],
    assigneeId: "user-yuna",
    status: "changes-requested",
    createdAt: "2025-09-15T09:40:00+09:00",
    scheduledAt: "2025-09-22T11:00:00+09:00",
    heroImageId: 493,
    copy:
      "당 함량을 낮춘 홈메이드 요거트볼 레시피 카드뉴스입니다. 자사 그래놀라 제품을 활용한 3단계 레시피를 소개하고, 마지막 슬라이드에서 제품 구매 링크로 연결합니다.",
    cardNewsSlides: [
      { id: "slide-1", imageId: 493, heading: "5분이면 완성, 저당 요거트볼", body: "아침 대용식으로도 든든해요" },
      { id: "slide-2", imageId: 429, heading: "산딸기 듬뿍 올리기", body: "냉동 산딸기도 좋아요" },
      { id: "slide-3", imageId: 1080, heading: "제철 과일로 응용하기", body: "딸기, 블루베리, 바나나 모두 OK" },
    ],
    channelPreviews: [
      {
        channel: "instagram",
        caption: "당은 줄이고 든든함은 그대로. 5분 완성 저당 요거트볼 레시피를 공개합니다.",
        hashtags: ["저당간식", "홈카페", "아침대용식"],
      },
    ],
    comments: [
      {
        id: "cmt-1",
        author: "박지훈",
        createdAt: "2025-09-16T11:05:00+09:00",
        body: "3번째 슬라이드에 제품 구매 링크 문구가 빠졌습니다. CTA 버튼 카피 추가해서 다시 올려주세요.",
        kind: "change-request",
      },
    ],
  },
  {
    id: "ct-004",
    title: "제철 딸기 직송 블로그",
    type: "blog",
    brandId: "brand-c",
    channelIds: ["naver-blog"],
    assigneeId: "user-yuna",
    status: "pending",
    createdAt: "2025-09-18T10:05:00+09:00",
    scheduledAt: "2025-09-21T08:00:00+09:00",
    heroImageId: 1080,
    copy:
      "산지 직송 제철 딸기의 당도와 보관법을 안내하는 블로그입니다. 손질 과정과 추천 레시피(딸기청, 요거트볼)를 함께 소개하며 정기배송 서비스로 연결합니다.",
    channelPreviews: [
      {
        channel: "naver-blog",
        caption: "당도 최고조에 오른 제철 딸기, 산지에서 이틀 만에 도착합니다. 신선하게 즐기는 손질법도 함께 담았어요.",
        hashtags: ["제철딸기", "산지직송", "홈베이킹"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-005",
    title: "히알루론 세럼 신제품 카드뉴스",
    type: "card-news",
    brandId: "brand-b",
    channelIds: ["instagram", "kakao-channel"],
    assigneeId: "user-seo",
    status: "rejected",
    createdAt: "2025-09-12T13:20:00+09:00",
    scheduledAt: "2025-09-23T09:00:00+09:00",
    heroImageId: 306,
    copy:
      "신제품 히알루론 세럼의 수분 지속력을 강조하는 카드뉴스입니다. 임상 테스트 수치와 성분 스토리를 함께 담아 초기 판매 전환을 유도합니다.",
    cardNewsSlides: [
      { id: "slide-1", imageId: 306, heading: "72시간 지속되는 수분감", body: "히알루론산 5종 복합 처방" },
      { id: "slide-2", imageId: 106, heading: "피부 자극 테스트 완료", body: "민감성 피부 전문 기관 검증" },
    ],
    channelPreviews: [
      {
        channel: "instagram",
        caption: "72시간 수분 지속, 히알루론 세럼 신제품을 소개합니다. 민감성 피부 테스트까지 완료했어요.",
        hashtags: ["히알루론세럼", "수분케어", "신제품"],
      },
      {
        channel: "kakao-channel",
        caption: "히알루론 세럼 신제품 출시 소식을 가장 먼저 전해드려요.",
        hashtags: ["신제품출시"],
      },
    ],
    comments: [
      {
        id: "cmt-2",
        author: "최유나",
        createdAt: "2025-09-13T09:50:00+09:00",
        body: "'72시간 지속' 문구는 임상 결과 원본 수치와 표현이 달라 반려합니다. 실측 수치(68시간)로 정정 후 재요청해주세요.",
        kind: "rejection",
      },
    ],
  },
  {
    id: "ct-006",
    title: "무선이어폰 언박싱 숏폼",
    type: "short-form",
    brandId: "brand-a",
    channelIds: ["youtube-shorts", "instagram"],
    assigneeId: "user-jihun",
    status: "pending",
    createdAt: "2025-09-16T16:45:00+09:00",
    scheduledAt: "2025-09-24T18:00:00+09:00",
    heroImageId: 26,
    shortFormDurationSec: 34,
    copy:
      "신제품 무선이어폰의 언박싱부터 착용감 리뷰까지 34초 안에 압축한 숏폼입니다. 노이즈캔슬링 데모 구간과 가격 정보 자막을 포함합니다.",
    channelPreviews: [
      {
        channel: "youtube-shorts",
        caption: "34초로 끝내는 신제품 무선이어폰 언박싱. 노이즈캔슬링 실사용 구간까지 담았습니다.",
        hashtags: ["언박싱", "무선이어폰", "테크리뷰"],
      },
      {
        channel: "instagram",
        caption: "기다리셨던 신제품 무선이어폰, 언박싱부터 착용샷까지 34초 요약.",
        hashtags: ["신제품", "테크굿즈"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-007",
    title: "스마트오피스 솔루션 블로그",
    type: "blog",
    brandId: "brand-a",
    channelIds: ["naver-blog"],
    assigneeId: "user-jihun",
    status: "approved",
    createdAt: "2025-09-08T09:00:00+09:00",
    scheduledAt: "2025-09-15T09:00:00+09:00",
    heroImageId: 1048,
    copy:
      "중소기업 대상 스마트오피스 솔루션 도입 사례를 소개하는 블로그입니다. 도입 전후 회의실 예약 효율 데이터를 인포그래픽으로 정리했습니다.",
    channelPreviews: [
      {
        channel: "naver-blog",
        caption: "회의실 예약 충돌 82% 감소. 스마트오피스 솔루션 도입 사례를 데이터로 확인해보세요.",
        hashtags: ["스마트오피스", "업무효율", "도입사례"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-008",
    title: "홈카페 원두 추천 숏폼",
    type: "short-form",
    brandId: "brand-d",
    channelIds: ["youtube-shorts"],
    assigneeId: "user-yoon",
    status: "pending",
    createdAt: "2025-09-14T11:15:00+09:00",
    scheduledAt: "2025-09-25T12:00:00+09:00",
    heroImageId: 42,
    shortFormDurationSec: 28,
    copy:
      "홈카페용 원두 3종을 산미, 바디감 기준으로 비교하는 28초 숏폼입니다. 매장 원두 판매 코너로 연결되는 CTA 자막을 포함합니다.",
    channelPreviews: [
      {
        channel: "youtube-shorts",
        caption: "산미파 vs 바디감파, 홈카페 원두 3종 비교. 28초면 취향 찾기 끝.",
        hashtags: ["홈카페", "원두추천", "커피추천"],
      },
    ],
    comments: [],
  },
  {
    id: "ct-009",
    title: "겨울 아우터 프리뷰 카드뉴스",
    type: "card-news",
    brandId: "brand-e",
    channelIds: ["instagram"],
    assigneeId: "user-seo",
    status: "approved",
    createdAt: "2025-09-05T10:30:00+09:00",
    scheduledAt: "2025-09-10T09:00:00+09:00",
    heroImageId: 1059,
    copy:
      "다음 시즌 아우터 라인업을 미리 공개하는 티저 카드뉴스입니다. 정식 출시 알림 신청 CTA로 연결합니다.",
    cardNewsSlides: [
      { id: "slide-1", imageId: 1059, heading: "겨울 아우터, 먼저 만나보세요", body: "10월 말 정식 출시 예정" },
    ],
    channelPreviews: [
      {
        channel: "instagram",
        caption: "겨울 아우터 라인업, 정식 출시 전 살짝 공개합니다.",
        hashtags: ["겨울아우터", "신상예고"],
      },
    ],
    comments: [],
  },
];

export function getContentById(id: string): ContentItem | undefined {
  return contentItems.find((item) => item.id === id);
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getAssigneeById(id: string): Assignee | undefined {
  return assignees.find((assignee) => assignee.id === id);
}

export const notifications: AppNotification[] = [
  {
    id: "ntf-001",
    type: "approval-request",
    title: "가을 신상 니트 룩북 블로그 승인 요청",
    body: "이서연 매니저가 E패션 블로그 콘텐츠 승인을 요청했습니다.",
    contentId: "ct-001",
    read: false,
    createdAt: "2025-09-18T08:13:00+09:00",
  },
  {
    id: "ntf-002",
    type: "approval-request",
    title: "제철 딸기 직송 블로그 승인 요청",
    body: "최유나 매니저가 C푸드 블로그 콘텐츠 승인을 요청했습니다.",
    contentId: "ct-004",
    read: false,
    createdAt: "2025-09-18T10:06:00+09:00",
  },
  {
    id: "ntf-003",
    type: "publish-error",
    title: "겨울 아우터 예고 카드뉴스 발행 오류",
    body: "인스타그램 채널 인증 토큰 만료로 예약 발행에 실패했습니다. 채널 연동을 다시 확인해주세요.",
    contentId: "ct-009",
    read: false,
    createdAt: "2025-09-17T09:02:00+09:00",
  },
  {
    id: "ntf-004",
    type: "publish-complete",
    title: "스마트오피스 솔루션 블로그 발행 완료",
    body: "네이버 블로그에 정상적으로 발행되었습니다.",
    contentId: "ct-007",
    read: true,
    createdAt: "2025-09-15T09:01:00+09:00",
  },
  {
    id: "ntf-005",
    type: "approval-request",
    title: "가을 시즌 라떼 3종 카드뉴스 승인 요청",
    body: "김도윤 매니저가 D카페 카드뉴스 콘텐츠 승인을 요청했습니다.",
    contentId: "ct-002",
    read: true,
    createdAt: "2025-09-17T14:31:00+09:00",
  },
  {
    id: "ntf-006",
    type: "publish-complete",
    title: "겨울 아우터 프리뷰 카드뉴스 발행 완료",
    body: "인스타그램에 정상적으로 발행되었습니다.",
    contentId: "ct-009",
    read: true,
    createdAt: "2025-09-10T09:03:00+09:00",
  },
  {
    id: "ntf-007",
    type: "publish-error",
    title: "여름 시즌 프로모션 카드뉴스 발행 오류",
    body: "카카오 채널 이미지 용량 초과로 발행이 중단되었습니다.",
    read: true,
    createdAt: "2025-09-03T13:40:00+09:00",
  },
  {
    id: "ntf-008",
    type: "approval-request",
    title: "무선이어폰 언박싱 숏폼 승인 요청",
    body: "박지훈 매니저가 A테크 숏폼 콘텐츠 승인을 요청했습니다.",
    contentId: "ct-006",
    read: false,
    createdAt: "2025-09-16T16:46:00+09:00",
  },
  {
    id: "ntf-009",
    type: "publish-complete",
    title: "봄 신메뉴 카드뉴스 발행 완료",
    body: "페이스북에 정상적으로 발행되었습니다.",
    read: true,
    createdAt: "2025-08-28T09:00:00+09:00",
  },
];

export const adminProfile: AdminProfile = {
  name: "정민서",
  role: "콘텐츠 운영 관리자",
  email: "minseo.jeong@marketflow-ops.com",
  phone: "010-2456-7891",
  assignedBrandIds: ["brand-a", "brand-b", "brand-c", "brand-d", "brand-e"],
  notificationSettings: {
    approvalRequest: true,
    publishComplete: true,
    publishError: true,
  },
};
