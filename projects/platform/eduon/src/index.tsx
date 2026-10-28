"use client";

import { ResponsiveSite } from "@/components/shared/responsive-site";
import { SiteApp } from "@/projects/platform/eduon/components/site/site-app";

/* 사용자 화면 엔트리. 제작자는 /platform/eduon-studio, 관리자는 /platform/eduon-admin 에서 따로 연다. */
export default function Eduon() {
  return (
    <ResponsiveSite>
      <SiteApp />
    </ResponsiveSite>
  );
}
