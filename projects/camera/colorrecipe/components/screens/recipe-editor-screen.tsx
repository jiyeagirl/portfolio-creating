"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Toggle } from "@/components/shared/toggle";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { ParamSlider } from "@/projects/camera/colorrecipe/components/param-slider";
import { Segmented } from "@/projects/camera/colorrecipe/components/segmented";
import { CurveEditor } from "@/projects/camera/colorrecipe/components/curve-editor";
import { buildLiveGrade } from "@/projects/camera/colorrecipe/lib/live-filter";
import { categories, recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import type { Recipe, ToneCurves } from "@/projects/camera/colorrecipe/lib/types";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

type EditorTab = "basic" | "color" | "filter" | "effects" | "save";

const TABS: { id: EditorTab; label: string }[] = [
  { id: "basic", label: "기본보정" },
  { id: "color", label: "색상조정" },
  { id: "filter", label: "필터" },
  { id: "effects", label: "효과" },
  { id: "save", label: "저장" },
];

const CURVE_CHANNELS: { id: keyof ToneCurves; label: string; accent: string }[] = [
  { id: "rgb", label: "RGB", accent: "var(--cr-accent)" },
  { id: "r", label: "R", accent: "#F2555F" },
  { id: "g", label: "G", accent: "#5FC271" },
  { id: "b", label: "B", accent: "#4E9BF2" },
];

export function RecipeEditorScreen({
  recipe,
  isNew,
  onNavigate,
}: {
  recipe: Recipe;
  isNew: boolean;
  onNavigate: ColorRecipeNavigate;
}) {
  const [draft, setDraft] = useState<Recipe>(() => structuredClone(recipe));
  const [tab, setTab] = useState<EditorTab>("basic");
  const [colorSub, setColorSub] = useState<"hsl" | "curve">("hsl");
  const [curveChannel, setCurveChannel] = useState<keyof ToneCurves>("rgb");
  const [activeBand, setActiveBand] = useState(draft.hsl[0].id);
  const [showOriginal, setShowOriginal] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const liveGrade = useMemo(
    () => buildLiveGrade(draft.basic, draft.optical),
    [draft.basic, draft.optical],
  );

  function updateBasic<K extends keyof Recipe["basic"]>(key: K, value: number) {
    setDraft((d) => ({ ...d, basic: { ...d.basic, [key]: value } }));
  }

  function updateOptical<K extends keyof Recipe["optical"]>(key: K, value: Recipe["optical"][K]) {
    setDraft((d) => ({ ...d, optical: { ...d.optical, [key]: value } }));
  }

  function updateBand(bandId: string, patch: Partial<Recipe["hsl"][number]>) {
    setDraft((d) => ({
      ...d,
      hsl: d.hsl.map((b) => (b.id === bandId ? { ...b, ...patch } : b)),
    }));
  }

  const currentBand = draft.hsl.find((b) => b.id === activeBand)!;

  function addTag() {
    const value = tagInput.trim();
    if (!value || draft.tags.includes(value)) return;
    setDraft((d) => ({ ...d, tags: [...d.tags, value] }));
    setTagInput("");
  }

  function goNextTab() {
    const idx = TABS.findIndex((t) => t.id === tab);
    if (idx < TABS.length - 1) setTab(TABS[idx + 1].id);
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ScreenHeader
        title={isNew ? "새 레시피" : `${recipe.name} 편집`}
        onBack={() => onNavigate(isNew ? "recipes" : "recipeDetail", { recipeId: recipe.id })}
        className="bg-[var(--cr-bg)] border-[var(--cr-border)]"
        backButtonClassName="text-[var(--cr-foreground)] hover:bg-[var(--cr-surface)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--cr-foreground)]"
      />

      <div className="relative h-[176px] w-full shrink-0">
        <GradedSwatch
          src={recipeThumb(draft.heroSeed, 500)}
          alt={draft.name || "새 레시피 미리보기"}
          grade={liveGrade}
          intensity={showOriginal ? 0 : draft.lutIntensity}
          sizes="393px"
          className="h-full w-full"
        />
        <button
          type="button"
          onMouseDown={() => setShowOriginal(true)}
          onMouseUp={() => setShowOriginal(false)}
          onMouseLeave={() => setShowOriginal(false)}
          onTouchStart={() => setShowOriginal(true)}
          onTouchEnd={() => setShowOriginal(false)}
          className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md"
        >
          {showOriginal ? "원본" : "누르면 원본"}
        </button>
      </div>

      <div className="border-b border-[var(--cr-border)] px-6 py-3">
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tab === "basic" && (
          <div className="space-y-7">
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
                라이트
              </h2>
              <div className="space-y-4">
                <ParamSlider label="노출" value={draft.basic.exposure} onChange={(v) => updateBasic("exposure", v)} />
                <ParamSlider label="밝기" value={draft.basic.brightness} onChange={(v) => updateBasic("brightness", v)} />
                <ParamSlider label="대비" value={draft.basic.contrast} onChange={(v) => updateBasic("contrast", v)} />
                <ParamSlider label="Highlights" value={draft.basic.highlights} onChange={(v) => updateBasic("highlights", v)} />
                <ParamSlider label="Shadows" value={draft.basic.shadows} onChange={(v) => updateBasic("shadows", v)} />
                <ParamSlider label="Whites" value={draft.basic.whites} onChange={(v) => updateBasic("whites", v)} />
                <ParamSlider label="Blacks" value={draft.basic.blacks} onChange={(v) => updateBasic("blacks", v)} />
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
                컬러
              </h2>
              <div className="space-y-4">
                <ParamSlider label="채도" value={draft.basic.saturation} onChange={(v) => updateBasic("saturation", v)} />
                <ParamSlider label="생동감" value={draft.basic.vibrance} onChange={(v) => updateBasic("vibrance", v)} />
                <ParamSlider label="색온도" value={draft.basic.temperature} onChange={(v) => updateBasic("temperature", v)} />
                <ParamSlider label="Tint" value={draft.basic.tint} onChange={(v) => updateBasic("tint", v)} />
              </div>
            </section>
          </div>
        )}

        {tab === "color" && (
          <div className="space-y-5">
            <Segmented
              options={[
                { id: "hsl", label: "HSL" },
                { id: "curve", label: "톤 커브" },
              ]}
              value={colorSub}
              onChange={setColorSub}
            />

            {colorSub === "hsl" && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {draft.hsl.map((band) => (
                    <button
                      key={band.id}
                      type="button"
                      onClick={() => setActiveBand(band.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        activeBand === band.id
                          ? "bg-[var(--cr-surface-raised)] ring-1 ring-white/20"
                          : "bg-[var(--cr-surface)]"
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: band.swatch }}
                      />
                      {band.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <ParamSlider
                    label="Hue"
                    value={currentBand.hue}
                    min={-30}
                    max={30}
                    unit="°"
                    onChange={(v) => updateBand(currentBand.id, { hue: v })}
                  />
                  <ParamSlider
                    label="Saturation"
                    value={currentBand.saturation}
                    onChange={(v) => updateBand(currentBand.id, { saturation: v })}
                  />
                  <ParamSlider
                    label="Luminance"
                    value={currentBand.luminance}
                    onChange={(v) => updateBand(currentBand.id, { luminance: v })}
                  />
                </div>
              </div>
            )}

            {colorSub === "curve" && (
              <div className="space-y-5">
                <Segmented
                  options={CURVE_CHANNELS.map((c) => ({ id: c.id, label: c.label }))}
                  value={curveChannel}
                  onChange={setCurveChannel}
                />
                <CurveEditor
                  points={draft.curves[curveChannel]}
                  accent={CURVE_CHANNELS.find((c) => c.id === curveChannel)!.accent}
                  onChange={(points) =>
                    setDraft((d) => ({
                      ...d,
                      curves: { ...d.curves, [curveChannel]: points },
                    }))
                  }
                />
                <p className="text-center text-[12px] text-[var(--cr-cool-gray)]">
                  포인트를 눌러 위아래로 드래그하면 곡선이 바뀝니다
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "filter" && (
          <div className="space-y-6">
            <ParamSlider
              label="LUT 강도"
              value={draft.lutIntensity}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => setDraft((d) => ({ ...d, lutIntensity: v }))}
            />
            <p className="text-[13px] leading-[1.6] text-[var(--cr-cool-gray)]">
              LUT 강도는 이 레시피의 색감 그레이딩이 원본 사진 위에 얼마나 강하게 겹쳐질지를
              조절합니다. 미리보기 하단의 &ldquo;누르면 원본&rdquo; 버튼으로 언제든 보정 전 사진과 비교할 수
              있습니다.
            </p>
          </div>
        )}

        {tab === "effects" && (
          <div className="space-y-6">
            <EffectGroup
              title="Bloom"
              enabled={draft.optical.bloomEnabled}
              onToggle={(v) => updateOptical("bloomEnabled", v)}
            >
              <ParamSlider
                label="강도"
                value={draft.optical.bloomIntensity}
                min={0}
                max={100}
                disabled={!draft.optical.bloomEnabled}
                onChange={(v) => updateOptical("bloomIntensity", v)}
              />
              <ParamSlider
                label="Threshold"
                value={draft.optical.bloomThreshold}
                min={0}
                max={100}
                disabled={!draft.optical.bloomEnabled}
                onChange={(v) => updateOptical("bloomThreshold", v)}
              />
            </EffectGroup>

            <EffectGroup
              title="Grain"
              enabled={draft.optical.grainEnabled}
              onToggle={(v) => updateOptical("grainEnabled", v)}
            >
              <ParamSlider
                label="입자 크기"
                value={draft.optical.grainSize}
                min={0}
                max={100}
                disabled={!draft.optical.grainEnabled}
                onChange={(v) => updateOptical("grainSize", v)}
              />
              <ParamSlider
                label="강도"
                value={draft.optical.grainIntensity}
                min={0}
                max={100}
                disabled={!draft.optical.grainEnabled}
                onChange={(v) => updateOptical("grainIntensity", v)}
              />
            </EffectGroup>

            <EffectGroup
              title="Vignette"
              enabled={draft.optical.vignetteEnabled}
              onToggle={(v) => updateOptical("vignetteEnabled", v)}
            >
              <ParamSlider
                label="강도"
                value={draft.optical.vignetteIntensity}
                min={0}
                max={100}
                disabled={!draft.optical.vignetteEnabled}
                onChange={(v) => updateOptical("vignetteIntensity", v)}
              />
              <ParamSlider
                label="Feather"
                value={draft.optical.vignetteFeather}
                min={0}
                max={100}
                disabled={!draft.optical.vignetteEnabled}
                onChange={(v) => updateOptical("vignetteFeather", v)}
              />
            </EffectGroup>

            <EffectGroup
              title="Soft Focus"
              enabled={draft.optical.softFocusEnabled}
              onToggle={(v) => updateOptical("softFocusEnabled", v)}
            >
              <ParamSlider
                label="Blur"
                value={draft.optical.softFocusBlur}
                min={0}
                max={100}
                disabled={!draft.optical.softFocusEnabled}
                onChange={(v) => updateOptical("softFocusBlur", v)}
              />
              <ParamSlider
                label="Glow"
                value={draft.optical.softFocusGlow}
                min={0}
                max={100}
                disabled={!draft.optical.softFocusEnabled}
                onChange={(v) => updateOptical("softFocusGlow", v)}
              />
            </EffectGroup>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
                  기타 효과
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      optical: { ...d.optical, sharpen: 0, fade: 0, noise: 0, chromaticAberration: 0 },
                    }))
                  }
                  className="flex items-center gap-1 text-[12px] font-medium text-[var(--cr-cool-gray)]"
                >
                  <ArrowClockwise size={13} weight="regular" />
                  초기화
                </button>
              </div>
              <div className="space-y-4">
                <ParamSlider label="Sharpen" value={draft.optical.sharpen} min={0} max={100} onChange={(v) => updateOptical("sharpen", v)} />
                <ParamSlider label="Fade" value={draft.optical.fade} min={0} max={100} onChange={(v) => updateOptical("fade", v)} />
                <ParamSlider label="Noise" value={draft.optical.noise} min={0} max={100} onChange={(v) => updateOptical("noise", v)} />
                <ParamSlider
                  label="Chromatic Aberration"
                  value={draft.optical.chromaticAberration}
                  min={0}
                  max={100}
                  onChange={(v) => updateOptical("chromaticAberration", v)}
                />
              </div>
            </section>
          </div>
        )}

        {tab === "save" && (
          <div className="space-y-5">
            <Field label="이름">
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="레시피 이름을 입력하세요"
                className="w-full rounded-[12px] bg-[var(--cr-surface)] px-4 py-3 text-[14px] text-[var(--cr-foreground)] placeholder:text-[var(--cr-cool-gray)] focus:outline-none"
              />
            </Field>

            <Field label="카테고리">
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, category: c }))}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                      draft.category === c
                        ? "bg-[var(--cr-accent)] text-[#04252b]"
                        : "bg-[var(--cr-surface)] text-[var(--cr-cool-gray)]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="설명">
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={3}
                placeholder="이 레시피의 무드나 추천 촬영 상황을 적어보세요"
                className="w-full resize-none rounded-[12px] bg-[var(--cr-surface)] px-4 py-3 text-[14px] leading-[1.5] text-[var(--cr-foreground)] placeholder:text-[var(--cr-cool-gray)] focus:outline-none"
              />
            </Field>

            <Field label="태그">
              <div className="flex flex-wrap gap-2 rounded-[12px] bg-[var(--cr-surface)] p-2.5">
                {draft.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== t) }))}
                    className="rounded-full bg-[var(--cr-surface-raised)] px-3 py-1 text-[12px] font-medium text-[var(--cr-foreground)]"
                  >
                    {t} ×
                  </button>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  onBlur={addTag}
                  placeholder="태그 입력 후 Enter"
                  className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-[12.5px] text-[var(--cr-foreground)] placeholder:text-[var(--cr-cool-gray)] focus:outline-none"
                />
              </div>
            </Field>

            <Field label="썸네일">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-[14px]">
                  <GradedSwatch
                    src={recipeThumb(draft.heroSeed, 160)}
                    alt="썸네일"
                    grade={liveGrade}
                    intensity={draft.lutIntensity}
                    sizes="64px"
                    className="h-full w-full"
                  />
                </div>
                <p className="text-[12.5px] text-[var(--cr-cool-gray)]">
                  최근 이 레시피로 촬영한 사진에서 자동으로 지정됩니다
                </p>
              </div>
            </Field>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-[var(--cr-bg)] px-6 pb-9 pt-4">
        {tab === "save" ? (
          <button
            type="button"
            disabled={!draft.name.trim()}
            onClick={() => onNavigate("recipes")}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--cr-accent)] text-[15px] font-semibold text-[#04252b] disabled:opacity-40"
          >
            레시피 저장
          </button>
        ) : (
          <button
            type="button"
            onClick={goNextTab}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--cr-accent)] text-[15px] font-semibold text-[#04252b]"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

function EffectGroup({
  title,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] bg-[var(--cr-surface-raised)]/60 p-1.5 ring-1 ring-white/[0.06]">
      <div className="rounded-[14px] bg-[var(--cr-surface)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[14.5px] font-semibold text-[var(--cr-foreground)]">{title}</h2>
          <Toggle
            checked={enabled}
            onChange={onToggle}
            label={`${title} 켜고 끄기`}
            onClassName="bg-[var(--cr-accent)]"
            offClassName="bg-[var(--cr-cool-gray-soft)]"
          />
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
        {label}
      </h2>
      {children}
    </div>
  );
}
