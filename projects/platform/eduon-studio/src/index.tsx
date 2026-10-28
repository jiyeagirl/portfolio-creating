"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 제작자 스튜디오에 별도 URL(/platform/eduon-studio)을 주기 위한 얇은 엔트리이고,
// 실제 화면은 모두 projects/platform/eduon/components/studio/ 안에 있다.
import { StudioApp } from "@/projects/platform/eduon/components/studio/studio-app";

export default function EduonStudio() {
  return <StudioApp />;
}
