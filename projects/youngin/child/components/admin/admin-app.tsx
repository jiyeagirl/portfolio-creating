"use client";

// 관리자 콘솔은 사용자용 모바일웹과 완전히 분리된 백오피스다.
// URL(/youngin/child-admin)과 계정이 다르고, 사용자 화면에는 이 콘솔로 가는
// 진입점을 두지 않는다. 화면 코드는 워크스페이스 관례대로 본 프로젝트의
// components/admin/ 안에 있고, child-admin 은 URL 을 하나 더 얻기 위한 엔트리다.
//
// 이 파일은 라우트의 공유 컴파일 단위에 물려 있다. 지우면 이 프로젝트뿐 아니라
// 워크스페이스의 모든 프로젝트 URL 이 500 이 난다 (CLAUDE.md app/ 절).

import "@/projects/youngin/child/styles/child.css";
import { AdminShell } from "@/projects/youngin/child/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/youngin/child/components/admin/dashboard-screen";

export function AdminApp() {
  return (
    <AdminShell>
      <DashboardScreen />
    </AdminShell>
  );
}
