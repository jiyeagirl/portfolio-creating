"use client";

import { useState } from "react";
import { ArrowsClockwise, Ruler, ShoppingBagOpen } from "@phosphor-icons/react";
import { AppBar, Badge, PetAvatar, PrimaryButton } from "@/projects/commerce/pawfit/components/ui";
import { PETS, SIZE_RECOMMENDATIONS } from "@/projects/commerce/pawfit/lib/mock-data";
import type { RecommendConfidence } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

const CONFIDENCE_TONE: Record<RecommendConfidence, "success" | "accent" | "neutral"> = {
  "매우 적합": "success",
  적합: "accent",
  참고용: "neutral",
};

export function SizeRecommendationScreen({
  petId,
  onNavigate,
}: {
  petId: string;
  onNavigate: NavigateFn;
}) {
  const pet = PETS.find((p) => p.id === petId) ?? PETS[0];
  const recommendation = SIZE_RECOMMENDATIONS[petId] ?? Object.values(SIZE_RECOMMENDATIONS)[0];
  const [resultKey, setResultKey] = useState(0);

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="사이즈 추천" subtitle={`${pet.name}의 맞춤 결과`} onBack={() => onNavigate("petProfile")} />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* 반려동물 정보 카드 */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
            <PetAvatar pet={pet} size={52} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-[var(--pf-ink)]">{pet.name}</p>
              <p className="truncate text-[12.5px] text-[var(--pf-muted)]">
                {pet.breed} | {pet.gender}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "몸무게", value: pet.weightKg, unit: "kg" },
              { label: "가슴둘레", value: pet.chestGirthCm, unit: "cm" },
              { label: "목둘레", value: pet.neckCm, unit: "cm" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-card)] px-3 py-3 text-center"
              >
                <p className="text-[11.5px] text-[var(--pf-muted)]">{m.label}</p>
                <p className="pf-num mt-1 text-[16px] font-semibold text-[var(--pf-ink)]">
                  {m.value}
                  <span className="text-[11.5px] font-normal text-[var(--pf-muted)]">{m.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 결과 카드 */}
        <div className="px-5 pt-6">
          <div
            key={resultKey}
            className="pf-result-in rounded-[24px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-strong)] p-6"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--pf-muted)]">
                <Ruler size={15} weight="bold" />
                추천 사이즈
              </span>
              <Badge tone={CONFIDENCE_TONE[recommendation.confidence]}>{recommendation.confidence}</Badge>
            </div>

            <p className="mt-3 text-[64px] font-medium leading-none tracking-[-0.03em] text-[var(--pf-ink)]">
              {recommendation.recommendedSize}
            </p>
            <p className="mt-2 text-[13px] text-[var(--pf-muted)]">
              {pet.name}의 체형 데이터를 기준으로 계산한 결과예요.
            </p>

            <div className="mt-5 border-t border-[var(--pf-hairline)] pt-4">
              <p className="text-[12.5px] font-semibold text-[var(--pf-ink)]">근거</p>
              <ul className="mt-2 space-y-1.5">
                {recommendation.basis.map((line) => (
                  <li key={line} className="flex gap-2 text-[13px] leading-relaxed text-[var(--pf-body)]">
                    <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--pf-muted-soft)]" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 border-t border-[var(--pf-hairline)] pt-4">
              <p className="text-[12.5px] font-semibold text-[var(--pf-ink)]">브랜드별 추천 사이즈</p>
              <div className="mt-2 space-y-0">
                {recommendation.brandSizes.map((b, i) => (
                  <div
                    key={b.brand}
                    className={`flex items-center justify-between py-2 text-[13.5px] ${
                      i !== recommendation.brandSizes.length - 1 ? "border-b border-[var(--pf-hairline)]" : ""
                    }`}
                  >
                    <span className="text-[var(--pf-body)]">{b.brand}</span>
                    <span className="pf-num font-semibold text-[var(--pf-ink)]">{b.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setResultKey((k) => k + 1)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[13px] font-semibold text-[var(--pf-muted)] transition-transform active:scale-[0.97]"
          >
            <ArrowsClockwise size={15} weight="bold" />
            다시 계산
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
        <PrimaryButton onClick={() => onNavigate("productList")}>
          <span className="inline-flex items-center justify-center gap-2">
            <ShoppingBagOpen size={17} weight="bold" />
            추천 상품 보러가기
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}
