import type {
  AccessSetting,
  AdminSubscription,
  Comment,
  Course,
  Episode,
  MySubscription,
  PaymentEvent,
  Progress,
  Quality,
  TranscodeStatus,
} from "@/projects/platform/eduon/lib/types";
import { THUMBS } from "@/projects/platform/eduon/lib/thumbs";

/* 목업 기준 시각. 실제 시계 대신 이 값을 쓴다 */
export const TODAY = "2026. 10. 28";
export const NOW = "2026. 10. 28 20:14";
export const PRICE = 29000;
/* 첫 달 할인가 (사용자 지정, 2026-10-28). 둘째 달부터 PRICE */
export const FIRST_MONTH_PRICE = 19900;

export const ME = { name: "정다빈", email: "da***@mail.kr", account: "EO-2048-7713" };

/*
 * 강좌 썸네일 picsum 고정 id. 한 장씩 직접 열어 확인했다 (design.md 사진 매핑 표와 같다).
 * 823 빨간 비니, 숲에서 카메라를 든 사람 → 생성형 AI 영상 제작 입문
 * 628 카메라를 두 손으로 든 사람 → AI 사진 보정과 컬러 그레이딩
 * 2   원목 테이블 위 맥북 에어 → 프롬프트 엔지니어링 실전
 * 445 창가 책상 위 노트북과 데스크매트 → 업무 자동화를 위한 AI 에이전트
 * 668 아이맥과 키보드 → Figma로 만드는 앱 UI
 * 60  모니터, 태블릿, 드로잉 태블릿 플랫레이 → 브랜드 아이덴티티 디자인
 * 532 아이맥, 스피커, 드로잉 태블릿이 놓인 책상 → 디지털 드로잉 기초
 * 91  흑백, 이안 리플렉스 카메라를 든 사람 → 흑백 사진으로 배우는 구도
 * 180 위에서 본 맥북과 노트 → React 컴포넌트 설계
 * 370 위에서 본 맥북, 원목 책상 → TypeScript 실무 패턴
 * 0   책상 위 맥북과 커피 → 파이썬 데이터 분석 입문
 * 6   나무 테이블 위 실버 노트북과 유리컵 → Git 협업 워크플로
 * 48  덮은 맥북 프로 → 노코드로 만드는 랜딩 페이지 (승인, 공개 전)
 * 355 진열된 빈티지 카메라 여러 대 → AI 광고 영상 만들기 (스튜디오 작성 중)
 */
export function photoUrl(id: number | string, w = 960, h = 540) {
  if (typeof id === "string") return id;
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

/* 재생 가능한 샘플 클립. MDN CC0 샘플이고 주제와 맞지 않아 최종 요약의 교체 요청 목록에 있다 */
export const SAMPLE_CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

function eps(list: Array<[string, string]>): Episode[] {
  return list.map(([title, len], i) => {
    const [m, s] = len.split(":").map(Number);
    return { no: i + 1, title, seconds: m * 60 + s };
  });
}

const DONE: Record<Quality, TranscodeStatus> = { "1080p": "완료", "720p": "완료", "480p": "완료" };
const SUB: AccessSetting = { free: false, previewEpisodes: [1], subscription: true };
const FREE: AccessSetting = { free: true, previewEpisodes: [], subscription: false };

type Seed = Pick<
  Course,
  "id" | "title" | "instructor" | "producer" | "topic" | "level" | "summary" | "photo" | "episodes" | "series" | "addedAt" | "learners"
> &
  Partial<Course>;

function course(seed: Seed): Course {
  return {
    productionMethod: "스튜디오 촬영 + 화면 녹화",
    tools: [],
    subtitles: ["한국어"],
    rightsFiles: ["저작권 확인서.pdf"],
    submittedAt: seed.addedAt,
    review: "승인",
    publish: "공개",
    transcode: "완료",
    outputs: DONE,
    access: SUB,
    version: 1,
    reviewLog: [
      { at: `${seed.addedAt} 10:12`, who: "제작자", action: "검수 제출", version: 1 },
      { at: `${seed.addedAt} 16:47`, who: "운영자 남궁현", action: "승인 후 공개", version: 1 },
    ],
    drm: "적용",
    licenseLog: [
      { at: "2026. 10. 28 19:52", result: "성공", env: "Chrome 130 | Windows" },
      { at: "2026. 10. 28 19:31", result: "성공", env: "Safari 18 | macOS" },
    ],
    ...seed,
    /* 공개 강좌 썸네일은 assets 이미지 (lib/thumbs.ts) */
    ...(seed.id in THUMBS ? { photo: THUMBS[seed.id] } : {}),
  };
}

export const SEED_COURSES: Course[] = [
  course({
    id: "c01",
    title: "생성형 AI 영상 제작 입문",
    instructor: "한지오",
    producer: "A미디어",
    topic: "AI",
    level: "입문",
    summary:
      "텍스트와 이미지로 짧은 영상을 만들고, 컷 구성과 자막까지 붙여 한 편을 완성해요. 프롬프트로 장면을 설계하는 법부터 결과물을 다듬는 편집 흐름까지 다룹니다.",
    photo: 823,
    series: "AI 영상 제작 시리즈 1편",
    addedAt: "2026. 10. 21",
    learners: 4182,
    tools: ["Runway", "CapCut", "Premiere Pro"],
    rightsFiles: ["저작권 확인서.pdf", "사용 음원 라이선스.pdf"],
    episodes: eps([
      ["생성형 영상 도구 지도와 첫 결과물", "12:40"],
      ["장면을 설계하는 프롬프트 문법", "18:05"],
      ["이미지에서 영상으로, 컷 이어 붙이기", "21:32"],
      ["자막, 음악, 내레이션 입히기", "16:48"],
      ["완성본 내보내기와 플랫폼별 규격", "11:27"],
    ]),
  }),
  course({
    id: "c02",
    title: "AI 사진 보정과 컬러 그레이딩",
    instructor: "류세움",
    producer: "C스튜디오",
    topic: "AI",
    level: "중급",
    summary: "AI 보정 도구로 노출과 피부 톤을 정리하고, 한 장의 사진에 일관된 색감을 입혀요.",
    photo: 628,
    series: "단일 강좌",
    addedAt: "2026. 10. 14",
    learners: 2306,
    tools: ["Lightroom", "Photoshop"],
    episodes: eps([
      ["보정 전에 보는 히스토그램", "09:52"],
      ["AI 마스크로 피사체 분리", "14:16"],
      ["컬러 그레이딩 프리셋 만들기", "17:03"],
      ["시리즈 사진 톤 맞추기", "13:39"],
    ]),
  }),
  course({
    id: "c03",
    title: "프롬프트 엔지니어링 실전",
    instructor: "문가람",
    producer: "B러닝",
    topic: "AI",
    level: "입문",
    summary: "업무 문서, 요약, 데이터 정리에 바로 쓰는 프롬프트 패턴 12가지를 실습해요.",
    photo: 2,
    series: "단일 강좌",
    addedAt: "2026. 09. 30",
    learners: 9874,
    tools: ["ChatGPT", "Claude"],
    access: FREE,
    episodes: eps([
      ["좋은 지시문의 네 가지 요소", "11:08"],
      ["예시를 주는 법, 형식을 고정하는 법", "15:44"],
      ["긴 문서 요약과 검증", "13:21"],
    ]),
  }),
  course({
    id: "c04",
    title: "업무 자동화를 위한 AI 에이전트",
    instructor: "배다온",
    producer: "B러닝",
    topic: "AI",
    level: "실무",
    summary: "메일 분류, 회의록 정리, 보고서 초안을 에이전트로 묶어 반복 업무를 줄여요.",
    photo: 445,
    series: "AI 업무 시리즈 2편",
    addedAt: "2026. 10. 25",
    learners: 1427,
    tools: ["Zapier", "Make", "Notion"],
    episodes: eps([
      ["에이전트가 하는 일과 못 하는 일", "10:36"],
      ["메일 분류 흐름 만들기", "19:12"],
      ["회의록에서 할 일 뽑기", "16:55"],
      ["실패했을 때 사람에게 넘기는 설계", "14:09"],
    ]),
  }),
  course({
    id: "c05",
    title: "Figma로 만드는 앱 UI",
    instructor: "표하늘",
    producer: "C스튜디오",
    topic: "디자인",
    level: "입문",
    summary: "오토 레이아웃과 컴포넌트로 로그인부터 상세 화면까지 앱 화면 다섯 개를 완성해요.",
    photo: 668,
    series: "UI 디자인 시리즈 1편",
    addedAt: "2026. 10. 08",
    learners: 6215,
    tools: ["Figma"],
    episodes: eps([
      ["프레임과 그리드 잡기", "13:27"],
      ["오토 레이아웃 기본기", "18:42"],
      ["컴포넌트와 변형", "20:15"],
      ["프로토타입 연결", "12:58"],
      ["개발 전달용 정리", "10:44"],
    ]),
  }),
  course({
    id: "c06",
    title: "브랜드 아이덴티티 디자인",
    instructor: "진소율",
    producer: "A미디어",
    topic: "디자인",
    level: "중급",
    summary: "작은 브랜드의 로고, 컬러, 타입 시스템을 정하고 적용 가이드 한 장으로 정리해요.",
    photo: 60,
    series: "단일 강좌",
    addedAt: "2026. 09. 17",
    learners: 3058,
    tools: ["Illustrator", "Figma"],
    episodes: eps([
      ["브랜드 키워드 정리", "11:53"],
      ["로고 스케치에서 벡터까지", "22:06"],
      ["컬러와 서체 고르기", "15:31"],
      ["적용 가이드 만들기", "13:18"],
    ]),
  }),
  course({
    id: "c07",
    title: "디지털 드로잉 기초",
    instructor: "탁윤재",
    producer: "C스튜디오",
    topic: "디자인",
    level: "입문",
    summary: "드로잉 태블릿 설정부터 선, 명암, 채색까지 한 장의 일러스트를 끝까지 그려요.",
    photo: 532,
    series: "단일 강좌",
    addedAt: "2026. 10. 02",
    learners: 2741,
    tools: ["Procreate", "Photoshop"],
    episodes: eps([
      ["태블릿과 브러시 설정", "08:46"],
      ["선 연습과 형태 잡기", "16:22"],
      ["명암과 채색", "19:37"],
    ]),
  }),
  course({
    id: "c08",
    title: "흑백 사진으로 배우는 구도",
    instructor: "여민결",
    producer: "A미디어",
    topic: "디자인",
    level: "입문",
    summary: "색을 빼고 형태와 빛만으로 화면을 나누는 연습을 해요. 영상 썸네일 구도에도 그대로 쓰입니다.",
    photo: 91,
    series: "단일 강좌",
    addedAt: "2026. 09. 09",
    learners: 5390,
    tools: ["Lightroom"],
    access: FREE,
    episodes: eps([
      ["삼분할보다 먼저 보는 것", "10:14"],
      ["빛의 방향과 대비", "12:51"],
      ["프레임 안의 프레임", "09:38"],
    ]),
  }),
  course({
    id: "c09",
    title: "React 컴포넌트 설계",
    instructor: "채이든",
    producer: "B러닝",
    topic: "개발",
    level: "중급",
    summary: "props와 상태를 어디에 둘지 정하는 기준을 세우고, 재사용되는 컴포넌트를 직접 나눠 봐요.",
    photo: 180,
    series: "프론트엔드 시리즈 2편",
    addedAt: "2026. 10. 18",
    learners: 3876,
    tools: ["React", "TypeScript", "Storybook"],
    episodes: eps([
      ["컴포넌트를 나누는 기준", "14:02"],
      ["상태는 어디에 두는가", "21:47"],
      ["합성과 슬롯 패턴", "18:24"],
      ["Storybook으로 문서화", "15:11"],
    ]),
  }),
  course({
    id: "c10",
    title: "TypeScript 실무 패턴",
    instructor: "채이든",
    producer: "B러닝",
    topic: "개발",
    level: "실무",
    summary: "API 응답 타입, 유니온 좁히기, 제네릭 유틸까지 실무 코드에서 자주 막히는 지점을 다뤄요.",
    photo: 370,
    series: "프론트엔드 시리즈 3편",
    addedAt: "2026. 10. 26",
    learners: 1093,
    tools: ["TypeScript", "VS Code"],
    episodes: eps([
      ["API 응답에 타입 붙이기", "17:28"],
      ["유니온과 타입 좁히기", "19:53"],
      ["제네릭 유틸 직접 만들기", "22:41"],
      ["점진적으로 도입하기", "12:06"],
    ]),
  }),
  course({
    id: "c11",
    title: "파이썬 데이터 분석 입문",
    instructor: "염보라",
    producer: "B러닝",
    topic: "개발",
    level: "입문",
    summary: "판다스로 엑셀 파일을 읽고 정리해서 차트 세 장짜리 보고서를 만들어요.",
    photo: 0,
    series: "데이터 시리즈 1편",
    addedAt: "2026. 09. 24",
    learners: 7462,
    tools: ["Python", "pandas", "Jupyter"],
    episodes: eps([
      ["주피터 노트북 시작", "09:17"],
      ["데이터 읽고 정리하기", "20:33"],
      ["그룹별 집계", "17:46"],
      ["차트로 보고서 만들기", "18:59"],
    ]),
  }),
  course({
    id: "c12",
    title: "Git 협업 워크플로",
    instructor: "길도화",
    producer: "C스튜디오",
    topic: "개발",
    level: "입문",
    summary: "브랜치, 풀 리퀘스트, 충돌 해결까지 팀에서 매일 쓰는 흐름만 골라 익혀요.",
    photo: 6,
    series: "단일 강좌",
    addedAt: "2026. 10. 11",
    learners: 6037,
    tools: ["Git", "GitHub"],
    access: FREE,
    episodes: eps([
      ["커밋을 작게 나누는 이유", "10:42"],
      ["브랜치와 풀 리퀘스트", "16:08"],
      ["충돌 해결 실습", "14:55"],
      ["리뷰 코멘트 주고받기", "11:31"],
    ]),
  }),

  /* 아래는 관리자 목록에서만 보이는 미공개 강좌 (검수 대기, 보완 요청, 승인, 게시 중단) */
  course({
    id: "c14",
    title: "노코드로 만드는 랜딩 페이지",
    instructor: "남지후",
    producer: "A미디어",
    topic: "개발",
    level: "입문",
    summary: "노코드 도구로 신청 폼이 붙은 한 장짜리 페이지를 만들고 도메인까지 연결해요.",
    photo: 48,
    series: "단일 강좌",
    addedAt: "2026. 10. 27",
    learners: 0,
    tools: ["Framer", "Webflow"],
    publish: "비공개",
    episodes: eps([
      ["페이지 구조 잡기", "12:13"],
      ["폼과 데이터 연결", "15:49"],
      ["도메인 연결과 공개", "09:26"],
    ]),
    reviewLog: [
      { at: "2026. 10. 24 11:38", who: "제작자", action: "검수 제출", version: 1 },
      { at: "2026. 10. 25 14:02", who: "운영자 남궁현", action: "보완 요청", note: "2강 개인정보 노출 화면 블러 처리 필요", version: 1 },
      { at: "2026. 10. 26 18:21", who: "제작자", action: "재제출", version: 2 },
      { at: "2026. 10. 27 10:46", who: "운영자 남궁현", action: "승인", version: 2 },
    ],
    version: 2,
  }),
  course({
    id: "c15",
    title: "모션 그래픽 첫걸음",
    instructor: "도해람",
    producer: "C스튜디오",
    topic: "디자인",
    level: "입문",
    summary: "키프레임과 이징으로 로고 애니메이션 세 가지를 만들어요.",
    photo: null,
    series: "단일 강좌",
    addedAt: "2026. 10. 27",
    learners: 0,
    tools: ["After Effects"],
    review: "검수 대기",
    publish: "비공개",
    drm: "미적용",
    licenseLog: [],
    episodes: eps([
      ["키프레임 기본", "11:22"],
      ["이징 곡선 다루기", "13:47"],
      ["로고 애니메이션 완성", "16:31"],
    ]),
    reviewLog: [{ at: "2026. 10. 27 21:09", who: "제작자", action: "검수 제출", version: 1 }],
  }),
  course({
    id: "c16",
    title: "SQL로 시작하는 데이터 조회",
    instructor: "염보라",
    producer: "B러닝",
    topic: "개발",
    level: "입문",
    summary: "SELECT부터 JOIN, 집계까지 실무 테이블로 조회 문장을 직접 써 봐요.",
    photo: null,
    series: "데이터 시리즈 2편",
    addedAt: "2026. 10. 23",
    learners: 0,
    tools: ["PostgreSQL"],
    review: "보완 요청",
    publish: "비공개",
    transcode: "실패",
    outputs: { "1080p": "실패", "720p": "완료", "480p": "완료" },
    transcodeNote: "3강 1080p 변환 중 원본 오디오 트랙 손상 (오류 코드 TC-AUDIO-112)",
    drm: "미적용",
    licenseLog: [],
    revisionNote: "3강 1080p 변환 실패본 재업로드, 2강 자막 싱크 1.2초 밀림 수정 필요",
    episodes: eps([
      ["테이블과 SELECT", "13:05"],
      ["조건과 정렬", "14:38"],
      ["JOIN과 집계", "19:44"],
    ]),
    reviewLog: [
      { at: "2026. 10. 23 15:16", who: "제작자", action: "검수 제출", version: 1 },
      { at: "2026. 10. 24 10:03", who: "운영자 남궁현", action: "보완 요청", note: "3강 1080p 변환 실패본 재업로드, 2강 자막 싱크 1.2초 밀림 수정 필요", version: 1 },
    ],
  }),
  course({
    id: "c17",
    title: "생성형 AI 저작권 기초",
    instructor: "오세린",
    producer: "A미디어",
    topic: "AI",
    level: "입문",
    summary: "생성 결과물의 저작권과 학습 데이터 쟁점을 사례 중심으로 정리해요.",
    photo: null,
    series: "단일 강좌",
    addedAt: "2026. 08. 19",
    learners: 2214,
    tools: [],
    publish: "게시 중단",
    episodes: eps([
      ["저작권의 기본 개념", "12:30"],
      ["학습 데이터 쟁점", "17:12"],
      ["국내외 사례", "15:47"],
    ]),
    reviewLog: [
      { at: "2026. 08. 18 09:41", who: "제작자", action: "검수 제출", version: 1 },
      { at: "2026. 08. 19 13:27", who: "운영자 남궁현", action: "승인 후 공개", version: 1 },
      { at: "2026. 10. 20 17:05", who: "최고관리자 서윤하", action: "게시 중단", note: "인용 판례 정보 갱신 필요, 제작자 수정본 대기", version: 1 },
    ],
  }),
];

/* 스튜디오에서 작성 중인 강좌. 검수 제출하면 관리자 목록에 들어간다 */
export const STUDIO_DRAFT: Course = course({
  id: "c13",
  title: "AI 광고 영상 만들기",
  instructor: "한지오",
  producer: "A미디어",
  topic: "AI",
  level: "중급",
  summary: "생성형 AI로 15초, 30초 광고 영상을 기획하고 촬영 없이 완성본까지 만들어요.",
  photo: 355,
  series: "AI 영상 제작 시리즈 2편",
  addedAt: "2026. 10. 28",
  learners: 0,
  tools: ["Runway", "Premiere Pro"],
  review: "작성 중",
  publish: "비공개",
  transcode: "대기",
  outputs: { "1080p": "대기", "720p": "대기", "480p": "대기" },
  drm: "미적용",
  licenseLog: [],
  rightsFiles: ["사용 음원 라이선스.pdf", "출연자 초상권 동의서.pdf"],
  reviewLog: [],
  episodes: eps([
    ["광고 영상의 구조와 기획", "14:26"],
    ["장면 생성과 일관성 유지", "19:08"],
    ["카피와 자막 타이밍", "12:51"],
  ]),
});

export const UPLOAD_FILE = { name: "ai_video_intro_01.mp4", sizeMb: 1228.8 };

/* 무료 회원의 시청 기록: 무료 공개 강의와 미리보기 회차만 */
export const SEED_PROGRESS: Record<string, Progress> = {
  c09: { episode: 1, seconds: 517, at: "2026. 10. 27 22:31" },
  c12: { episode: 2, seconds: 604, at: "2026. 10. 26 21:08" },
  c03: { episode: 3, seconds: 418, at: "2026. 10. 24 20:47" },
  c08: { episode: 2, seconds: 233, at: "2026. 10. 22 23:12" },
};

/* 구독 이력이 있는 회원(?subscription=active|cancelled|expired)의 시청 기록 */
export const SUBSCRIBER_PROGRESS: Record<string, Progress> = {
  c09: { episode: 2, seconds: 806, at: "2026. 10. 27 22:31" },
  c05: { episode: 3, seconds: 274, at: "2026. 10. 26 21:08" },
  c11: { episode: 2, seconds: 1104, at: "2026. 10. 24 20:47" },
  c03: { episode: 3, seconds: 418, at: "2026. 10. 22 23:12" },
};

/* 학습 완료 강좌와 완료일. 무료 회원은 무료 공개 강좌만 */
export const SEED_COMPLETED: Record<string, string> = { c08: "2026. 10. 19" };
export const SUBSCRIBER_COMPLETED: Record<string, string> = { c01: "2026. 09. 28", c08: "2026. 10. 19", c06: "2026. 09. 12" };

export const SEED_WISHLIST = ["c04", "c10"];

/* 관심 주제 (신규 회원이면 운영자 추천으로 채운다) */
export const INTERESTS: Array<"AI" | "디자인" | "개발"> = ["AI", "개발"];

export const SEED_MY_SUB: MySubscription = {
  status: "free",
  channel: null,
  startedAt: null,
  periodEnd: null,
  history: [],
};

/* ?subscription= 시연 프리셋. 내 학습과 관리자 구독 목록의 "나" 행이 같이 바뀐다 */
export function presetSubscription(kind: "free" | "active" | "cancelled" | "expired"): MySubscription {
  if (kind === "free") return SEED_MY_SUB;
  const paid = [
    { id: "PAY-25081902", at: "2026. 08. 19 21:36", kind: "최초 결제", channel: "web", amount: FIRST_MONTH_PRICE, result: "첫 달 할인가 승인" },
    { id: "PAY-25091904", at: "2026. 09. 19 04:12", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" },
    { id: "PAY-25101903", at: "2026. 10. 19 04:09", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" },
  ] as MySubscription["history"];
  if (kind === "active") return { status: "active", channel: "web", startedAt: "2026. 08. 19", periodEnd: "2026. 11. 19", history: [...paid].reverse() };
  if (kind === "cancelled")
    return {
      status: "cancelled",
      channel: "web",
      startedAt: "2026. 08. 19",
      periodEnd: "2026. 11. 19",
      history: [
        { id: "PAY-25102611", at: "2026. 10. 26 13:44", kind: "갱신 해지", channel: "web", amount: null, result: "다음 갱신 중지" },
        ...[...paid].reverse(),
      ],
    };
  return {
    status: "expired",
    channel: "web",
    startedAt: "2026. 07. 19",
    periodEnd: "2026. 10. 19",
    history: [
      { id: "PAY-25101917", at: "2026. 10. 19 00:00", kind: "만료", channel: "web", amount: null, result: "구독 전용 강의 이용 종료" },
      { id: "PAY-25092303", at: "2026. 09. 23 10:18", kind: "갱신 해지", channel: "web", amount: null, result: "다음 갱신 중지" },
      { id: "PAY-25091906", at: "2026. 09. 19 04:15", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" },
      { id: "PAY-25081902", at: "2026. 08. 19 21:36", kind: "최초 결제", channel: "web", amount: FIRST_MONTH_PRICE, result: "첫 달 할인가 승인" },
    ],
  };
}

export const SEED_ADMIN_SUBS: AdminSubscription[] = [
  {
    id: "SUB-40851",
    name: "예승아",
    email: "sa***@mail.kr",
    channel: "web",
    status: "cancelled",
    periodStart: "2026. 10. 15",
    periodEnd: "2026. 11. 15",
    entitlement: "반영 완료",
    history: [
      { id: "PAY-25102204", at: "2026. 10. 22 19:30", kind: "갱신 해지", channel: "web", amount: null, result: "다음 갱신 중지" },
      { id: "PAY-25101507", at: "2026. 10. 15 04:06", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" },
    ],
    entitlementLog: [{ at: "2026. 10. 22 19:30", change: "자동 갱신 해지, 2026. 11. 15까지 권한 유지", by: "사용자 요청" }],
  },
  {
    id: "SUB-40833",
    name: "황보준",
    email: "jh***@work.kr",
    channel: "web",
    status: "active",
    periodStart: "2026. 10. 12",
    periodEnd: "2026. 11. 12",
    entitlement: "반영 완료",
    history: [{ id: "PAY-25101203", at: "2026. 10. 12 04:03", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" }],
    entitlementLog: [{ at: "2026. 10. 12 04:03", change: "구독 권한 기간 연장", by: "카드 결제 알림" }],
  },
  {
    id: "SUB-40731",
    name: "구민채",
    email: "mc***@work.kr",
    channel: "web",
    status: "expired",
    periodStart: "2026. 09. 01",
    periodEnd: "2026. 10. 01",
    entitlement: "회수 완료",
    history: [
      { id: "PAY-25100100", at: "2026. 10. 01 00:00", kind: "만료", channel: "web", amount: null, result: "이용 종료" },
      { id: "PAY-25091408", at: "2026. 09. 14 22:10", kind: "갱신 해지", channel: "web", amount: null, result: "다음 갱신 중지" },
    ],
    entitlementLog: [{ at: "2026. 10. 01 00:01", change: "구독 권한 만료", by: "만료 배치" }],
  },
  {
    id: "SUB-40688",
    name: "마이현",
    email: "ih***@inbox.kr",
    channel: "web",
    status: "failed",
    periodStart: "2026. 09. 27",
    periodEnd: "2026. 10. 27",
    entitlement: "확인 필요",
    history: [
      { id: "PAY-25102702", at: "2026. 10. 27 04:02", kind: "갱신 실패", channel: "web", amount: PRICE, result: "한도 초과" },
      { id: "PAY-25092705", at: "2026. 09. 27 04:05", kind: "정기 갱신", channel: "web", amount: PRICE, result: "승인" },
    ],
    entitlementLog: [{ at: "2026. 10. 27 04:03", change: "갱신 실패, 3일 재시도 대기", by: "카드 결제 알림" }],
  },
];

export const SEED_EVENTS: PaymentEvent[] = [
  { id: "evt_pay_2702c4", receivedAt: "2026. 10. 27 04:02", channel: "web", type: "갱신 실패", verify: "통과", result: "처리 완료", subId: "SUB-40688", detail: "카드사 응답 한도 초과, 재시도 일정 등록" },
  { id: "evt_pay_2702c5", receivedAt: "2026. 10. 27 04:02", channel: "web", type: "갱신 실패", verify: "중복", result: "중복 수신, 추가 처리 없음", subId: "SUB-40688", detail: "같은 거래 ID로 6초 뒤 재수신" },
  { id: "evt_pay_2204b9", receivedAt: "2026. 10. 22 19:30", channel: "web", type: "갱신 해지", verify: "통과", result: "처리 완료", subId: "SUB-40851", detail: "자동 갱신 중지, 기간 종료일까지 권한 유지" },
  { id: "evt_pay_1807a3", receivedAt: "2026. 10. 18 07:33", channel: "web", type: "정기 갱신", verify: "실패", result: "재확인 필요", subId: "SUB-40833", detail: "결제사 승인 응답 시간 초과" },
  { id: "evt_pay_1203f1", receivedAt: "2026. 10. 12 04:03", channel: "web", type: "정기 갱신", verify: "실패", result: "재처리 완료", subId: "SUB-40833", detail: "1차 검증 실패 후 재확인으로 승인 확인" },
];

export const COMMENTS: Comment[] = [
  { id: "m1", name: "소은재", at: "2026. 10. 27 22:48", episode: 1, body: "도구 비교표가 정말 도움 됐어요. Runway 무료 플랜 제한도 같이 알려 주셔서 시작하기 쉬웠습니다." },
  { id: "m2", name: "엄태오", at: "2026. 10. 26 19:05", episode: 1, body: "첫 결과물 프롬프트를 그대로 따라 했는데 장면이 계속 흔들려요. 2강에서 다루나요?" },
  { id: "m3", name: "한지오 강사", at: "2026. 10. 26 21:30", episode: 1, body: "네, 2강에서 카메라 움직임을 고정하는 지시문을 따로 다룹니다." },
  { id: "m4", name: "변채원", at: "2026. 10. 24 08:17", episode: 1, body: "출근길에 미리보기 보고 바로 구독했어요. 자막 품질이 좋네요." },
];
