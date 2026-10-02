import { createDefaultFilterState } from "./adjustments";
import type { Shot } from "./types";

export const today = "2022.05.18";

const RAW_SHOTS: Omit<Shot, "filterState">[] = [
  { id: "s-01", frame: 1, filmId: "sunlit-gold", photoId: 64, time: "07:14", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-02", frame: 2, filmId: "sunlit-gold", photoId: 1080, time: "07:22", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-03", frame: 3, filmId: "sunlit-gold", photoId: 1040, time: "08:03", resolution: "4032 × 3024", savedToLibrary: true },
  { id: "s-04", frame: 4, filmId: "cream-portrait", photoId: 1027, time: "09:41", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-05", frame: 5, filmId: "cream-portrait", photoId: 1060, time: "09:52", resolution: "4032 × 3024", savedToLibrary: true },
  { id: "s-06", frame: 6, filmId: "cream-portrait", photoId: 1059, time: "10:07", resolution: "4032 × 3024", savedToLibrary: false },
  { id: "s-07", frame: 7, filmId: "harbor-teal", photoId: 1050, time: "11:18", resolution: "8064 × 6048", savedToLibrary: true },
  { id: "s-08", frame: 8, filmId: "harbor-teal", photoId: 1015, time: "11:34", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-09", frame: 9, filmId: "harbor-teal", photoId: 1063, time: "12:02", resolution: "4032 × 3024", savedToLibrary: true },
  { id: "s-10", frame: 10, filmId: "slate-mono", photoId: 1074, time: "14:29", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-11", frame: 11, filmId: "slate-mono", photoId: 1047, time: "14:41", resolution: "4032 × 3024", savedToLibrary: false },
  { id: "s-12", frame: 12, filmId: "slate-mono", photoId: 91, time: "14:58", resolution: "4032 × 3024", savedToLibrary: true },
  { id: "s-13", frame: 13, filmId: "slate-mono", photoId: 1019, time: "18:12", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-14", frame: 14, filmId: "dusk-cinema", photoId: 1067, time: "19:03", resolution: "8064 × 6048", savedToLibrary: true },
  { id: "s-15", frame: 15, filmId: "dusk-cinema", photoId: 1005, time: "19:21", resolution: "5712 × 4284", savedToLibrary: true },
  { id: "s-16", frame: 16, filmId: "dusk-cinema", photoId: 1016, time: "19:37", resolution: "4032 × 3024", savedToLibrary: true },
];

export const shots: Shot[] = RAW_SHOTS.map((shot) => ({ ...shot, filterState: createDefaultFilterState(shot.filmId) }));

// 마지막 컷(가장 자주 노출되는 샷)만 실제로 손을 본 상태로 채워, "다시 편집"이 저장된
// 파라미터를 그대로 불러온다는 비파괴 편집 흐름을 데이터로도 보여준다.
const lastShot = shots[shots.length - 1];
lastShot.filterState = {
  ...lastShot.filterState,
  adjustments: { ...lastShot.filterState.adjustments, exposure: 8, contrast: 10, grain: 20 },
  opticalEffects: {
    ...lastShot.filterState.opticalEffects,
    vignette: { enabled: true, intensity: 45 },
  },
  toggles: { ...lastShot.filterState.toggles, frame: true },
};

export function shotsByFilm(filmId: string) {
  return shots.filter((s) => s.filmId === filmId);
}

export function getShot(id: string) {
  return shots.find((s) => s.id === id);
}
