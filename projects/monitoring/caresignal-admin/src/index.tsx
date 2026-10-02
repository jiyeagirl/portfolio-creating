"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 관리자 콘솔에 별도 URL(/monitoring/caresignal-admin)을 주기 위한 엔트리이고,
// 실제 화면은 모두 projects/monitoring/caresignal/components/admin/ 안에 있다.
import { AdminApp } from "@/projects/monitoring/caresignal/components/admin/admin-app";

export default function CareSignalAdmin() {
  return <AdminApp />;
}
