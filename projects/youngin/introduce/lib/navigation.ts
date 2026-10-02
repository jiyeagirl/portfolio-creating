import type { FloorId } from "./types";

/** Single URL per project (CLAUDE.md), so every screen change is component
 *  state. `target` doubles as a facility id, a service id, or a floor number
 *  depending on the view. */
export type View = "lobby" | "floor" | "service";

export interface NavigateOptions {
  floor?: FloorId;
  facilityId?: string;
  serviceId?: string;
}

export type NavigateFn = (view: View, options?: NavigateOptions) => void;
