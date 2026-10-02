"use client";

import { InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { Button, Divider } from "@/projects/commerce/verve/components/ui";

const PRINCIPLES = [
  {
    number: "01",
    title: "정확한 핏이 먼저다",
    body: "몸에 맞지 않는 옷은 결국 옷장에 남습니다. 우리는 사이즈를 추천의 영역이 아니라 데이터의 영역으로 옮깁니다.",
  },
  {
    number: "02",
    title: "보이지 않으면 소용없다",
    body: "정면 사진 한 장으로는 소재의 흐름과 실루엣을 알 수 없습니다. 모든 상품을 360도로 공개하는 이유입니다.",
  },
  {
    number: "03",
    title: "데이터는 실사용자에게서 온다",
    body: "AI 추천은 리뷰에 남겨진 실제 체형과 만족도로 계속 검증되고 보완됩니다.",
  },
];

const LOOKBOOK = [
  "https://picsum.photos/id/177/700/900",
  "https://picsum.photos/id/291/700/500",
  "https://picsum.photos/id/786/700/900",
  "https://picsum.photos/id/980/700/500",
  "https://picsum.photos/id/447/700/900",
  "https://picsum.photos/id/349/700/500",
];

export function BrandScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div>
      {/* 매니페스토 히어로 */}
      <section className="relative flex min-h-[80dvh] items-center overflow-hidden">
        <img src="https://picsum.photos/id/550/1600/1200" alt="노을 속 도심 전망대" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-white/70">Brand</p>
          <h1 className="mt-4 max-w-[18ch] text-[32px] font-medium leading-[1.15] tracking-[-0.5px] text-white md:text-[48px]">
            운동을 계속하게 만드는 건 결국 잘 맞는 옷 한 벌입니다
          </h1>
        </div>
      </section>

      {/* 철학 — 비대칭 넘버드 리스트 */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px] space-y-12">
          {PRINCIPLES.map((p) => (
            <div key={p.number} className="grid gap-4 border-t border-[var(--v-hairline)] pt-8 md:grid-cols-[120px_1fr_1.2fr] md:items-start">
              <span className="v-number text-[40px] font-bold text-[var(--v-primary)]">{p.number}</span>
              <h3 className="text-[20px] font-medium text-[var(--v-ink)] md:text-[24px]">{p.title}</h3>
              <p className="text-[14px] leading-relaxed text-[var(--v-body)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 룩북 — 매스너리 */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-[26px] font-medium tracking-[-0.3px] text-[var(--v-ink)] md:text-[36px]">룩북</h2>
          <div className="mt-10 columns-2 gap-3 md:columns-3">
            {LOOKBOOK.map((src, i) => (
              <div key={i} className="mb-3 break-inside-avoid overflow-hidden">
                <img src={src} alt="" className="w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 캠페인 CTA */}
      <section className="bg-[var(--v-primary)] px-4 py-20 text-center md:px-8 md:py-28">
        <h2 className="mx-auto max-w-[18ch] text-[26px] font-medium leading-tight tracking-[-0.3px] text-white md:text-[36px]">
          가을 컬렉션, AI 사이즈 추천으로 먼저 만나보세요
        </h2>
        <div className="mt-8">
          <Button variant="outline" tone="dark" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate("shop")}>
            컬렉션 보기
          </Button>
        </div>
      </section>

      {/* SNS */}
      <section className="px-4 py-16 text-center md:px-8 md:py-24">
        <p className="text-[13px] text-[var(--v-body)]">더 많은 착용 컷은 SNS에서 확인하세요</p>
        <div className="mt-6 flex items-center justify-center gap-6">
          <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-[13px] text-[var(--v-ink)] hover:text-[var(--v-primary)] transition-colors">
            <InstagramLogo size={20} /> @verve.wear
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-[13px] text-[var(--v-ink)] hover:text-[var(--v-primary)] transition-colors">
            <YoutubeLogo size={20} /> Verve Studio
          </a>
        </div>
      </section>

      <Divider className="mx-4 md:mx-8" />
    </div>
  );
}
