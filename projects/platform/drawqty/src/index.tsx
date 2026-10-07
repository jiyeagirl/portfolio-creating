"use client";

import "@/projects/platform/drawqty/styles/drawqty.css";
import { ResponsiveSite } from "@/components/shared/responsive-site";
import { SiteApp } from "@/projects/platform/drawqty/components/site/site-app";

/* 사용자 화면 엔트리. 관리자는 /platform/drawqty-admin 에서 따로 연다. */
export default function Drawqty() {
  return (
    <ResponsiveSite>
      <SiteApp />
    </ResponsiveSite>
  );
}
