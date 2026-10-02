"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 관리자 콘솔에 기업용 화면과 완전히 분리된 URL(/b2b/assetflow-admin)을 주기 위한
// 엔트리이고, 실제 화면은 모두 projects/b2b/assetflow/components/admin/ 안에 있다.
import { AdminApp } from "@/projects/b2b/assetflow/components/admin/admin-app";

export default function AssetFlowAdmin() {
  return <AdminApp />;
}
