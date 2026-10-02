"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 본사 관리자 콘솔에 점주 관리자 콘솔·사용자 앱과 완전히 분리된 URL
// (/platform/studyspot-hq)과 별도 로그인을 주기 위한 엔트리이고, 실제 화면은 모두
// projects/platform/studyspot/components/hq/ 안에 있다.
import { HqApp } from "@/projects/platform/studyspot/components/hq/hq-app";

export default function StudyspotHq() {
  return <HqApp />;
}
