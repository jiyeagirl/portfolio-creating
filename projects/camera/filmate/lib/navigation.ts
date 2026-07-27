export type FilmateScreen =
  | "camera"
  | "films"
  | "filmDetail"
  | "contactSheet"
  | "settings";

export type FilmateNavigate = (screen: FilmateScreen, filmId?: string) => void;
