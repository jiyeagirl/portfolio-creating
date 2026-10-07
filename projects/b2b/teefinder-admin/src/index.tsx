"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 관리자 콘솔에 회원 앱과 완전히 분리된 URL(/b2b/teefinder-admin)을 주기 위한
// 엔트리이고, 실제 화면은 모두 projects/b2b/teefinder/components/admin/ 안에 있다.
import { AdminStandalone } from "@/projects/b2b/teefinder/components/admin/admin-app";

export default function TeefinderAdmin() {
  return <AdminStandalone />;
}
