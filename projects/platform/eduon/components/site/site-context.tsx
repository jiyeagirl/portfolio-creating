"use client";

import { createContext, useContext } from "react";
import type { PlaybackState, SiteScreen } from "@/projects/platform/eduon/lib/navigation";

export interface GoOptions {
  courseId?: string;
  episode?: number;
  /** 구독 안내를 보고 구독 화면에 들어온 경우, 결제 뒤 보던 강의로 돌아간다 */
  returnTo?: { courseId: string; episode: number };
  anchor?: "explore";
}

export interface SiteCtx {
  screen: SiteScreen;
  go: (screen: SiteScreen, opts?: GoOptions) => void;
  openCourse: (courseId: string) => void;
  query: string;
  setQuery: (q: string) => void;
  playback: PlaybackState;
  setPlayback: (p: PlaybackState) => void;
  /** 모바일 프레임 안(앱 미리보기)인지. ResponsiveSite가 iframe에 embed=1을 붙인다 */
  inApp: boolean;
  toast: (msg: string) => void;
}

export const SiteContext = createContext<SiteCtx | null>(null);

export function useSite(): SiteCtx {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("SiteContext 밖에서 사용할 수 없습니다");
  return ctx;
}
