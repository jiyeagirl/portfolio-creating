import { sampleSeeds } from "./films";

export type Shot = {
  id: string;
  frame: number;
  filmId: string;
  seed: string;
  time: string;
};

export const today = "2026.07.24";

export const shots: Shot[] = [
  { id: "s-01", frame: 1, filmId: "kodak-gold", seed: sampleSeeds[0], time: "07:12" },
  { id: "s-02", frame: 2, filmId: "kodak-gold", seed: sampleSeeds[5], time: "07:18" },
  { id: "s-03", frame: 3, filmId: "portra-400", seed: sampleSeeds[1], time: "09:41" },
  { id: "s-04", frame: 4, filmId: "portra-400", seed: sampleSeeds[6], time: "09:47" },
  { id: "s-05", frame: 5, filmId: "fuji-classic", seed: sampleSeeds[2], time: "11:03" },
  { id: "s-06", frame: 6, filmId: "fuji-classic", seed: sampleSeeds[4], time: "11:09" },
  { id: "s-07", frame: 7, filmId: "fuji-classic", seed: sampleSeeds[7], time: "11:22" },
  { id: "s-08", frame: 8, filmId: "mono-400", seed: sampleSeeds[3], time: "13:56" },
  { id: "s-09", frame: 9, filmId: "mono-400", seed: sampleSeeds[7], time: "14:02" },
  { id: "s-10", frame: 10, filmId: "cinema-warm", seed: sampleSeeds[4], time: "19:14" },
  { id: "s-11", frame: 11, filmId: "cinema-warm", seed: sampleSeeds[2], time: "19:20" },
  { id: "s-12", frame: 12, filmId: "cinema-warm", seed: sampleSeeds[0], time: "19:31" },
  { id: "s-13", frame: 13, filmId: "kodak-gold", seed: sampleSeeds[6], time: "19:45" },
  { id: "s-14", frame: 14, filmId: "portra-400", seed: sampleSeeds[1], time: "20:02" },
];

export function shotsByFilm(filmId: string) {
  return shots.filter((s) => s.filmId === filmId);
}
