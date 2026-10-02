"use client";

import "@/projects/platform/dressday/styles/dressday.css";
import { ResponsiveSite } from "@/components/shared/responsive-site";
import { Site } from "@/projects/platform/dressday/components/site/site";

// 고객용 반응형 웹. 기본 URL은 데스크톱, ?view=mobile이면 iPhone 프레임 안 393폭 (CLAUDE.md Responsive Web Output).
// 초기 화면은 ?screen=<home|browse|product|booking|payment|tracking|return|mypage> (components/site/site.tsx).
// 관리자 웹은 별도 URL /platform/dressday-admin (components/admin/).
export default function Dressday() {
  return (
    <ResponsiveSite screenClassName="bg-white text-[#222222]">
      <Site />
    </ResponsiveSite>
  );
}
