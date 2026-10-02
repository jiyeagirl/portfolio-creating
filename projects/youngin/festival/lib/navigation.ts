export type FestivalScreen = "home" | "map" | "mission" | "scan" | "missionDone";

export type TabKey = "home" | "map" | "mission";

/** 탭바를 감추는 몰입형 화면. */
export const FULLSCREEN: FestivalScreen[] = ["scan", "missionDone"];

/** 하단 탭바에서 어느 탭이 켜져 보일지. QR 흐름은 미션 탭을 유지한다. */
export const TAB_OF_SCREEN: Record<FestivalScreen, TabKey> = {
  home: "home",
  map: "map",
  mission: "mission",
  scan: "mission",
  missionDone: "mission",
};

/** 화면 위쪽이 어두워 상태바 글자를 밝게 뒤집어야 하는 화면.
    home은 히어로 사진이 상태바 밑까지 올라온다. */
export const DARK_STATUS_BAR: FestivalScreen[] = ["home", "scan", "missionDone"];

/** 화면 아래쪽이 어두운 화면. 홈 인디케이터만 밝게 뒤집는다. */
export const DARK_BOTTOM: FestivalScreen[] = ["scan", "missionDone"];

export type FestivalNavigate = (screen: FestivalScreen, id?: string) => void;
