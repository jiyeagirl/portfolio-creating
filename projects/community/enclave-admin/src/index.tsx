"use client";

// 워크스페이스 라우트는 `projects/<category>/<project>/src/index`만 렌더링한다.
// 관리자 콘솔에 사용자 콘솔과 완전히 분리된 URL(/community/enclave-admin)과
// 별도 로그인을 주기 위한 엔트리이고, 실제 화면은 모두
// projects/community/enclave/components/admin/ 안에 있다.
import { AdminApp } from "@/projects/community/enclave/components/admin/admin-app";

export default function EnclaveAdmin() {
  return <AdminApp />;
}
