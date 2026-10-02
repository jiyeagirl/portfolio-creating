"use client";

import { InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";

export function Footer({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <footer className="border-t border-[var(--v-hairline)] bg-[var(--v-canvas)] px-4 py-16 text-[var(--v-body)] md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-[18px] font-bold uppercase tracking-[1.4px] text-[var(--v-ink)]">VERVE</p>
          <p className="mt-4 max-w-[32ch] text-[13px] leading-relaxed">
            360° 뷰어와 AI 사이즈 추천으로 온라인에서도 정확하게 맞는 스포츠웨어를 만듭니다.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <InstagramLogo size={18} className="text-[var(--v-body)] hover:text-[var(--v-ink)] transition-colors" />
            <YoutubeLogo size={18} className="text-[var(--v-body)] hover:text-[var(--v-ink)] transition-colors" />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-ink)]">Shop</p>
          <ul className="mt-4 space-y-3 text-[13px]">
            <li><button type="button" onClick={() => onNavigate("shop")} className="hover:text-[var(--v-ink)] transition-colors">전체 상품</button></li>
            <li><button type="button" onClick={() => onNavigate("sizeRecommendation")} className="hover:text-[var(--v-ink)] transition-colors">AI 사이즈 추천</button></li>
            <li><button type="button" onClick={() => onNavigate("brand")} className="hover:text-[var(--v-ink)] transition-colors">브랜드 스토리</button></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-ink)]">Support</p>
          <ul className="mt-4 space-y-3 text-[13px]">
            <li><button type="button" onClick={() => onNavigate("support")} className="hover:text-[var(--v-ink)] transition-colors">고객센터</button></li>
            <li><button type="button" onClick={() => onNavigate("mypage")} className="hover:text-[var(--v-ink)] transition-colors">주문/배송 조회</button></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-ink)]">Verve Inc.</p>
          <ul className="mt-4 space-y-2 text-[12px] leading-relaxed">
            <li>대표 이서준 | 사업자등록번호 214-81-77302</li>
            <li>서울시 성동구 왕십리로 115</li>
            <li>고객센터 1522-0483 (평일 10:00-18:00)</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1280px] border-t border-[var(--v-hairline)] pt-6 text-[11px]">
        <p>© 2026 Verve Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
