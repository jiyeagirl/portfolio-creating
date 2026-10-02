"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Toggle } from "@/components/shared/toggle";
import {
  ADJUSTMENT_GROUPS,
  ADJUSTMENT_LABEL,
  OPTICAL_EFFECT_DEFAULT_INTENSITY,
  OPTICAL_EFFECT_LABEL,
  OPTICAL_EFFECT_ORDER,
  TOGGLE_LABEL,
  createDefaultFilterState,
  isBipolar,
} from "@/projects/camera/lumicam/lib/adjustments";
import { films, getFilm, picsum } from "@/projects/camera/lumicam/lib/films";
import type { Adjustments, EditToggles, OpticalEffects, Shot } from "@/projects/camera/lumicam/lib/types";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";
import { BipolarSlider, OpticalEffectRow, UnipolarSlider } from "@/projects/camera/lumicam/components/adjustment-controls";

const TABS = [
  { key: "adjust", label: "조정" },
  { key: "optical", label: "광학 효과" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function FilterSettingsScreen({ shot, onNavigate }: { shot: Shot; onNavigate: LumicamNavigate }) {
  const [filmId, setFilmId] = useState(shot.filterState.presetId);
  const film = getFilm(filmId)!;
  const [adjustments, setAdjustments] = useState<Adjustments>({ ...shot.filterState.adjustments });
  const [opticalEffects, setOpticalEffects] = useState<OpticalEffects>({ ...shot.filterState.opticalEffects });
  const [toggles, setToggles] = useState<EditToggles>({ ...shot.filterState.toggles });
  const [tab, setTab] = useState<TabKey>("adjust");
  const [showOriginal, setShowOriginal] = useState(false);

  function selectFilm(next: string) {
    setFilmId(next);
    const fresh = createDefaultFilterState(next);
    setAdjustments(fresh.adjustments);
    setOpticalEffects(fresh.opticalEffects);
  }

  function setAdjustment(key: keyof Adjustments, value: number) {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  }

  function setEffectEnabled(key: keyof OpticalEffects, enabled: boolean) {
    setOpticalEffects((prev) => ({ ...prev, [key]: { ...prev[key], enabled } }));
  }

  function setEffectIntensity(key: keyof OpticalEffects, intensity: number) {
    setOpticalEffects((prev) => ({ ...prev, [key]: { ...prev[key], intensity } }));
  }

  function setToggle(key: keyof EditToggles, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }

  const previewGrade = {
    ...film.colorGrade,
    filter: `${film.colorGrade.filter} brightness(${1 + adjustments.exposure / 300 + adjustments.shadows / 1000 - adjustments.highlights / 1500}) contrast(${1 + adjustments.contrast / 250}) saturate(${1 + adjustments.saturation / 150}) hue-rotate(${adjustments.temperature / 12 + adjustments.tint / 20}deg)`,
    grain: film.colorGrade.grain + (adjustments.grain / 100) * 0.5,
    vignette: film.colorGrade.vignette,
  };

  const halation = opticalEffects.halation;
  const bloom = opticalEffects.bloom;
  const vignette = opticalEffects.vignette;
  const lightLeak = opticalEffects.lightLeak;
  const dustScratches = opticalEffects.dustScratches;

  return (
    <div className="flex h-full w-full flex-col bg-[var(--lc-canvas)]">
      <ScreenHeader
        title="필터 조정"
        subtitle={film.name}
        onBack={() => onNavigate("result", shot.id)}
        className="bg-[var(--lc-canvas)] border-[var(--lc-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--lc-ink)]"
        subtitleClassName="text-[11px] text-[var(--lc-mute)]"
        backButtonClassName="text-[var(--lc-ink)] hover:bg-[var(--lc-surface-soft)]"
        right={
          <button
            type="button"
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--lc-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--lc-body)]"
          >
            <Icon icon="solar:transfer-horizontal-linear" width={12} />
            {showOriginal ? "원본" : "누르면 원본"}
          </button>
        }
      />

      <div className="px-5 pt-4">
        <div
          className={`relative h-[220px] w-full overflow-hidden rounded-[12px] transition-[padding,background-color] ${
            toggles.frame ? "border-0 bg-[var(--lc-ink)] p-2" : "border border-[var(--lc-border)]"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[6px]">
            <GradedPhoto
              src={picsum(shot.photoId, 620, 460)}
              alt={`${film.name} 프리뷰`}
              grade={previewGrade}
              ungraded={showOriginal}
              className={`h-full w-full ${toggles.mirror ? "-scale-x-100" : ""}`}
              sizes="393px"
              priority
            />
            {!showOriginal && (
              <>
                {bloom.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), transparent 62%)",
                      mixBlendMode: "screen",
                      opacity: (bloom.intensity / 100) * 0.28,
                    }}
                  />
                )}
                {halation.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(226,157,84,0.9), transparent 55%)",
                      mixBlendMode: "screen",
                      opacity: (halation.intensity / 100) * 0.32,
                    }}
                  />
                )}
                {lightLeak.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 88% 8%, rgba(255,208,140,0.95), transparent 42%)",
                      mixBlendMode: "screen",
                      opacity: (lightLeak.intensity / 100) * 0.45,
                    }}
                  />
                )}
                {vignette.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: `inset 0 0 90px rgba(0,0,0,${(vignette.intensity / 100) * 0.55})` }}
                  />
                )}
                {dustScratches.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent 3px)",
                      opacity: (dustScratches.intensity / 100) * 0.35,
                    }}
                  />
                )}
                {toggles.dateStamp && (
                  <span
                    className="absolute bottom-2 right-2.5 font-mono text-[12px] tabular-nums tracking-wide text-[#ff9d3d]"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {"22 5 18"}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
          필름 프리셋
        </p>
        <div className="mb-5 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {films.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => selectFilm(f.id)}
              className={`shrink-0 overflow-hidden rounded-[10px] border text-left transition-colors ${
                f.id === filmId ? "border-[var(--lc-accent)]" : "border-[var(--lc-border)]"
              }`}
            >
              <span
                className="block h-12 w-16 bg-cover bg-center"
                style={{ backgroundImage: `url(${picsum(f.heroId, 100, 80)})`, filter: f.colorGrade.filter }}
              />
              <span className="block px-1.5 py-1 text-center text-[10px] font-medium text-[var(--lc-ink)]">
                {f.shortName}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-5 flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                tab === t.key
                  ? "bg-[var(--lc-ink)] text-[var(--lc-on-ink)]"
                  : "border border-[var(--lc-border)] text-[var(--lc-body)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "adjust" ? (
          <div className="space-y-6">
            {ADJUSTMENT_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                  {group.label}
                </p>
                <div className="space-y-5">
                  {group.keys.map((key) =>
                    isBipolar(key) ? (
                      <BipolarSlider
                        key={key}
                        label={ADJUSTMENT_LABEL[key]}
                        value={adjustments[key]}
                        onChange={(v) => setAdjustment(key, v)}
                      />
                    ) : (
                      <UnipolarSlider
                        key={key}
                        label={ADJUSTMENT_LABEL[key]}
                        value={adjustments[key]}
                        onChange={(v) => setAdjustment(key, v)}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {OPTICAL_EFFECT_ORDER.map((key) => (
                <OpticalEffectRow
                  key={key}
                  label={OPTICAL_EFFECT_LABEL[key]}
                  enabled={opticalEffects[key].enabled}
                  intensity={opticalEffects[key].intensity}
                  defaultIntensity={OPTICAL_EFFECT_DEFAULT_INTENSITY[key]}
                  onToggle={(next) => setEffectEnabled(key, next)}
                  onIntensityChange={(next) => setEffectIntensity(key, next)}
                />
              ))}
            </div>

            <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
              표시 옵션
            </p>
            <div className="divide-y divide-[var(--lc-border)] overflow-hidden rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)]">
              {(Object.keys(TOGGLE_LABEL) as (keyof EditToggles)[]).map((key) => (
                <div key={key} className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-[13px] font-medium text-[var(--lc-ink)]">{TOGGLE_LABEL[key]}</span>
                  <Toggle
                    checked={toggles[key]}
                    onChange={(next) => setToggle(key, next)}
                    label={TOGGLE_LABEL[key]}
                    size="sm"
                    onClassName="bg-[var(--lc-accent)]"
                    offClassName="bg-[var(--lc-border)]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-3.5">
          <Icon icon="solar:info-circle-linear" width={15} className="mt-0.5 shrink-0 text-[var(--lc-mute)]" />
          <p className="text-[12px] leading-[18px] text-[var(--lc-body)]">
            원본 사진은 그대로 보존돼요. 프리셋과 파라미터 값만 저장되어, 언제든 이 값 그대로
            다시 불러와 재편집할 수 있어요.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--lc-border)] px-5 py-4">
        <button
          type="button"
          onClick={() => onNavigate("result", shot.id)}
          className="h-12 w-full rounded-[6px] bg-[var(--lc-ink)] text-[15px] font-semibold text-[var(--lc-on-ink)] transition-transform active:scale-[0.98]"
        >
          적용하고 돌아가기
        </button>
      </div>
    </div>
  );
}
