"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { bestSellers, recommendSize } from "@/projects/commerce/verve/lib/mock-data";
import type { Gender, PreferredFit, SizeRecommendationInput, SizeRecommendationResult, WorkoutPurpose } from "@/projects/commerce/verve/lib/types";
import { Button, Field, PriceTag, Select, SpecCell, TextInput } from "@/projects/commerce/verve/components/ui";

const WORKOUTS: WorkoutPurpose[] = ["러닝", "웨이트", "요가/필라테스", "일상 착용"];
const FITS: PreferredFit[] = ["슬림", "레귤러", "오버사이즈"];

export function SizeRecommendationScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [input, setInput] = useState<SizeRecommendationInput>({
    gender: "여성",
    heightCm: 163,
    weightKg: 54,
    workoutPurpose: "러닝",
    preferredFit: "레귤러",
  });
  const [result, setResult] = useState<SizeRecommendationResult | null>(null);

  const handleSubmit = () => {
    setResult(recommendSize(input));
    setStep(2);
  };

  return (
    <div className="min-h-[100dvh] px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[560px]">
        <div className="mb-10 flex items-center gap-2">
          <div className={`h-1 flex-1 ${step >= 1 ? "bg-[var(--v-primary)]" : "bg-[var(--v-hairline)]"}`} />
          <div className={`h-1 flex-1 ${step >= 2 ? "bg-[var(--v-primary)]" : "bg-[var(--v-hairline)]"}`} />
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-[28px] font-medium tracking-[-0.3px] text-[var(--v-ink)]">내 몸에 맞는 사이즈를 찾아드려요</h1>
            <p className="mt-3 text-[14px] text-[var(--v-body)]">신체 정보와 선호하는 핏을 알려주시면 AI가 사이즈를 추천해드려요.</p>

            <div className="mt-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Field label="성별">
                  <Select value={input.gender} onChange={(e) => setInput((p) => ({ ...p, gender: e.target.value as Gender }))}>
                    <option value="여성">여성</option>
                    <option value="남성">남성</option>
                  </Select>
                </Field>
                <Field label="운동 목적">
                  <Select value={input.workoutPurpose} onChange={(e) => setInput((p) => ({ ...p, workoutPurpose: e.target.value as WorkoutPurpose }))}>
                    {WORKOUTS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="키 (cm)">
                  <TextInput
                    type="number"
                    value={input.heightCm}
                    onChange={(e) => setInput((p) => ({ ...p, heightCm: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="몸무게 (kg)">
                  <TextInput
                    type="number"
                    value={input.weightKg}
                    onChange={(e) => setInput((p) => ({ ...p, weightKg: Number(e.target.value) }))}
                  />
                </Field>
              </div>

              <Field label="선호하는 핏">
                <div className="grid grid-cols-3 gap-2">
                  {FITS.map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setInput((p) => ({ ...p, preferredFit: fit }))}
                      className={`h-12 border text-[13px] font-medium transition-colors ${
                        input.preferredFit === fit ? "border-[var(--v-primary)] bg-[var(--v-primary)] text-white" : "border-[var(--v-hairline)] text-[var(--v-ink)]"
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </Field>

              <Button className="mt-4 w-full" onClick={handleSubmit}>
                추천 결과 보기
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-primary)]">추천 완료</p>
            <h1 className="mt-3 text-[28px] font-medium tracking-[-0.3px] text-[var(--v-ink)]">
              {input.heightCm}cm, {input.weightKg}kg에 맞는 사이즈예요
            </h1>

            <div className="mt-10 flex items-center gap-10 border-y border-[var(--v-hairline)] py-8">
              <SpecCell value={result.recommendedSize} label="추천 사이즈" accent />
              <SpecCell value={`${Math.round(result.confidence * 100)}%`} label="추천 신뢰도" />
            </div>

            <div className="mt-8 space-y-3">
              {result.reasons.map((reason, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-[var(--v-body)]">
                  {reason}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-ink)]">예상 핏</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--v-body)]">{result.expectedFit}</p>
            </div>

            <div className="mt-8 border border-[var(--v-hairline)] p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-ink)]">모델과 비교</p>
              <p className="mt-2 text-[13px] text-[var(--v-body)]">
                이 상품의 착용 모델은 키 {result.modelComparison.modelHeightCm}cm, 몸무게 {result.modelComparison.modelWeightKg}kg으로{" "}
                <span className="text-[var(--v-ink)]">{result.modelComparison.modelWearingSize}</span> 사이즈를 착용하고 있어요.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-ink)] mb-4">추천 사이즈로 바로 담기</p>
              <div className="space-y-3">
                {bestSellers.slice(0, 2).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onNavigate("productDetail", p.id)}
                    className="flex w-full items-center gap-4 border border-[var(--v-hairline)] p-3 text-left hover:border-[var(--v-ink)] transition-colors"
                  >
                    <img src={p.gallery[0]} alt={p.name} className="h-16 w-14 object-cover" />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[var(--v-ink)] line-clamp-1">{p.name}</p>
                      <PriceTag price={p.price} size="sm" />
                    </div>
                    <ArrowRight size={16} className="text-[var(--v-body)]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                다시 계산하기
              </Button>
              <Button className="flex-1" onClick={() => onNavigate("shop")}>
                쇼핑 계속하기
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
