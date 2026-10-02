"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Sparkle, X } from "@phosphor-icons/react";
import { scanResult, todayMeals } from "@/projects/healthcare/habitkong/lib/meals";
import { Card, SectionTitle } from "@/projects/healthcare/habitkong/components/ui";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";

type ScanStage = "frame" | "scanning" | "done";
const STAGES: ScanStage[] = ["frame", "scanning", "done"];

/* 스크린샷 도구가 넘기는 `?stage=` 값을 읽어 해당 단계에서 시작한다(캡처 전용,
   일반 사용 흐름에는 영향 없음). src/index.tsx의 `?screen=` 처리와 같은 이유로
   서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

export function FoodScanScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialStage = useMemo<ScanStage>(() => {
    const requested = new URLSearchParams(search).get("stage");
    return STAGES.includes(requested as ScanStage) ? (requested as ScanStage) : "frame";
  }, [search]);

  const [stageOverride, setStageOverride] = useState<ScanStage | null>(null);
  const stage = stageOverride ?? initialStage;

  function capture() {
    setStageOverride("scanning");
    window.setTimeout(() => setStageOverride("done"), 850);
  }

  return (
    <div className="min-h-full w-full pb-10">
      <div className="relative h-[330px] w-full overflow-hidden bg-[#17140F]">
        <Image
          src={scanResult.image}
          alt={scanResult.name}
          fill
          sizes="393px"
          priority
          className={`object-cover transition-[filter] duration-300 ${stage === "scanning" ? "brightness-75" : ""}`}
        />

        <button
          type="button"
          onClick={() => onNavigate("diet")}
          aria-label="닫기"
          className="absolute right-4 top-[68px] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white"
        >
          <X size={16} weight="bold" />
        </button>

        {stage !== "done" && (
          <div className="absolute inset-x-10 top-[108px] bottom-[38px] rounded-[28px] border-2 border-white/85" />
        )}

        {stage === "scanning" && (
          <div className="absolute inset-x-10 top-[108px] bottom-[38px] flex items-center justify-center rounded-[28px] bg-black/25">
            <span className="rounded-full bg-black/50 px-3 py-1.5 text-[12px] font-medium text-white">
              음식을 분석하고 있어요
            </span>
          </div>
        )}

        {stage === "frame" && (
          <button
            type="button"
            onClick={capture}
            aria-label="촬영"
            className="absolute bottom-[52px] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-4 ring-white/30 transition-transform active:scale-95"
          >
            <span className="h-[46px] w-[46px] rounded-full border-2 border-[#17140F]" />
          </button>
        )}
      </div>

      <div className="px-5 pt-5">
        {stage !== "done" ? (
          <p className="pt-8 text-center text-[12.5px] leading-relaxed text-[#8A8377]">
            음식을 프레임 안에 맞추고 촬영 버튼을 눌러주세요
          </p>
        ) : (
          <>
            <SectionTitle title="인식 결과" />
            <Card className="mt-3 flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px]">
                <Image src={scanResult.image} alt={scanResult.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-[#17140F]">{scanResult.name}</p>
                <p className="mt-0.5 text-[12px] tabular-nums text-[#8A8377]">
                  약 {scanResult.kcalPerPortion}kcal | 신뢰도 {Math.round(scanResult.confidence * 100)}%
                </p>
              </div>
              <Sparkle size={16} weight="fill" className="shrink-0 text-[#1F6C9F]" />
            </Card>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MacroTile label="탄수화물" value={scanResult.carbsG} />
              <MacroTile label="단백질" value={scanResult.proteinG} />
              <MacroTile label="지방" value={scanResult.fatG} />
            </div>

            <section className="mt-6">
              <SectionTitle title="오늘의 식단 기록" />
              <div className="mt-3 flex flex-col gap-2.5">
                {todayMeals.map((meal) => (
                  <Card key={meal.id} className="flex items-center gap-3 p-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]">
                      <Image src={meal.image} alt={meal.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-[#17140F]">{meal.name}</p>
                      <p className="mt-0.5 text-[11.5px] tabular-nums text-[#8A8377]">
                        {meal.slot} | {meal.time}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#17140F]">
                      {meal.kcal}kcal
                    </span>
                  </Card>
                ))}
                <Card className="flex items-center gap-3 border-dashed p-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]">
                    <Image src={scanResult.image} alt={scanResult.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-[#17140F]">{scanResult.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-[#8A8377]">방금 인식됨, 저장 전</p>
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#17140F]">
                    {scanResult.kcalPerPortion}kcal
                  </span>
                </Card>
              </div>
            </section>

            <button
              type="button"
              onClick={() => onNavigate("diet")}
              className="mt-6 w-full rounded-[6px] bg-[#17140F] py-3 text-[13.5px] font-semibold text-white transition-transform active:scale-[0.98]"
            >
              기록에 저장
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MacroTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] bg-[#F7F6F3] py-3">
      <p className="text-[15px] font-bold tabular-nums text-[#17140F]">
        {value}
        <span className="text-[10px] font-medium text-[#8A8377]">g</span>
      </p>
      <p className="mt-1 text-[10.5px] text-[#8A8377]">{label}</p>
    </div>
  );
}
