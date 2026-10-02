"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// iPad 편집 스튜디오는 lumicam-admin과 같은 이유로 완전히 분리된 URL(/camera/lumicam-ipad)을
// 갖는다 — "같은 제품, 다른 플랫폼"은 이 워크스페이스에서 URL이 다른 별도 프로젝트로
// 표현한다(CLAUDE.md 관례). 실제 화면(IpadFrame, StudioScreen)과 토큰(styles/lumicam.css)은
// 전부 본 프로젝트(camera/lumicam)의 것을 그대로 재사용하고, 이 엔트리는 다른 URL을 얻기
// 위한 얇은 래퍼일 뿐이다.
import "@/projects/camera/lumicam/styles/lumicam.css";
import { IpadFrame } from "@/projects/camera/lumicam/components/ipad-frame";
import { StudioScreen } from "@/projects/camera/lumicam/components/screens/studio-screen";

export default function LumicamIpad() {
  return (
    <IpadFrame screenClassName="lumicam bg-[var(--lc-canvas)] text-[var(--lc-ink)]">
      <StudioScreen />
    </IpadFrame>
  );
}
