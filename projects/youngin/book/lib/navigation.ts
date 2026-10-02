export type BookScreen =
  | "home"
  | "libraries"
  | "libraryDetail"
  | "certify"
  | "scan"
  | "bookCertify"
  | "certifyDone"
  | "missionDetail"
  | "record"
  | "collection"
  | "rewards"
  | "share";

export type TabKey = "home" | "libraries" | "certify" | "record";

/** 탭바를 감추는 몰입형 화면. */
export const FULLSCREEN: BookScreen[] = ["scan", "certifyDone", "share"];

/** 하단 탭바에서 어느 탭이 켜져 보일지. 상세 화면은 부모 탭을 유지한다. */
export const TAB_OF_SCREEN: Record<BookScreen, TabKey> = {
  home: "home",
  libraries: "libraries",
  libraryDetail: "libraries",
  certify: "certify",
  scan: "certify",
  bookCertify: "certify",
  certifyDone: "certify",
  missionDetail: "home",
  record: "record",
  collection: "record",
  rewards: "record",
  share: "record",
};

/** 화면 위쪽이 어두워 상태바 글자를 밝게 뒤집어야 하는 화면.
    libraryDetail은 사진 히어로가 상태바 밑으로 올라온다. */
export const DARK_STATUS_BAR: BookScreen[] = ["scan", "certifyDone", "libraryDetail"];

/** 화면 아래쪽이 어두운 화면. 홈 인디케이터만 밝게 뒤집는다.
    libraryDetail은 하단이 밝은 CTA 바라 여기에는 들어가지 않는다. */
export const DARK_BOTTOM: BookScreen[] = ["scan", "certifyDone"];

export type BookNavigate = (screen: BookScreen, id?: string) => void;
