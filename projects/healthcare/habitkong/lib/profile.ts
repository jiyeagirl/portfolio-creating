/** 마이페이지와 온보딩이 공유하는 사용자 정보 mock. */

export const profile = {
  name: "서지우",
  nickname: "지우",
  email: "jiwoo.seo@zoominmail.com",
  gender: "여성",
  age: 31,
  heightCm: 164,
  weightKg: 63.4,
  joinedAt: "2026.06.10",
  levelLabel: "Lv.7 꾸준한 새싹",
};

export const integrations = [
  {
    id: "apple",
    label: "Apple Health",
    detail: "걸음, 수면, 심박수, 활동 에너지",
    connected: true,
    syncedAt: "오늘 오전 8:12",
  },
  {
    id: "google",
    label: "Google Fit",
    detail: "걸음, 운동 기록",
    connected: false,
    syncedAt: "연동하면 자동으로 채워져요",
  },
];

export const notificationSettings = [
  { id: "routine", label: "루틴 알림", detail: "매일 오전 7:30", on: true },
  { id: "meal", label: "식단 기록 알림", detail: "점심 12:30, 저녁 19:30", on: true },
  { id: "report", label: "주간 리포트", detail: "일요일 오후 9:00", on: true },
  { id: "marketing", label: "혜택 및 소식", detail: "이벤트, 신규 기능 안내", on: false },
];

export const routineTime = {
  label: "루틴 알림 시각",
  value: "오전 7:30",
  options: ["오전 6:30", "오전 7:00", "오전 7:30", "오전 8:00"],
};

export const subscription = {
  plan: "무료 플랜",
  premiumName: "콩이 프리미엄",
  price: "월 4,900원",
  renewNote: "언제든 해지할 수 있어요",
  benefits: [
    "AI 리포트 주 1회에서 매일로",
    "루틴 3개까지 동시 진행",
    "식단 사진 무제한 분석",
    "장기 기록 내보내기",
  ],
};

export const dataMenu = [
  { id: "export", label: "건강 데이터 내보내기", detail: "CSV 파일로 저장" },
  { id: "reset", label: "기록 초기화", detail: "루틴과 식단 기록을 지웁니다" },
  { id: "privacy", label: "개인정보 처리방침", detail: "" },
  { id: "terms", label: "이용약관", detail: "" },
];

export const supportMenu = [
  { id: "faq", label: "자주 묻는 질문", detail: "" },
  { id: "contact", label: "고객센터 문의", detail: "평일 10:00 ~ 18:00" },
  { id: "version", label: "앱 버전", detail: "1.4.2" },
];

/* 온보딩 선택지 */

export const ONBOARDING_GOALS = [
  { id: "weight", label: "체중 관리" },
  { id: "sleep", label: "수면 회복" },
  { id: "energy", label: "체력 기르기" },
  { id: "stress", label: "스트레스 줄이기" },
  { id: "diet", label: "식습관 교정" },
  { id: "posture", label: "자세 교정" },
];

export const LIFE_PATTERNS = [
  { id: "desk", label: "하루 8시간 이상 앉아 있어요" },
  { id: "night", label: "취침이 자정을 넘겨요" },
  { id: "skip", label: "아침을 자주 거르는 편이에요" },
  { id: "delivery", label: "배달 음식을 주 3회 이상 먹어요" },
  { id: "commute", label: "출퇴근에 왕복 1시간 이상 써요" },
];

export const GENERATED_ROUTINE = {
  name: "아침 물 한 잔 마시기",
  reason: "아침을 거르는 패턴과 낮 피로도를 함께 고려했어요. 1분이면 되는 것부터 시작합니다.",
  durationMinutes: 1,
  time: "오전 7:30",
};
