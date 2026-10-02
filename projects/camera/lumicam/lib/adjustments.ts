import type {
  Adjustments,
  BipolarAdjustmentKey,
  EditToggles,
  FilterState,
  OpticalEffectKey,
  OpticalEffects,
  UnipolarAdjustmentKey,
} from "./types";

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  lutIntensity: 100,
  exposure: 0,
  contrast: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  fade: 0,
  grain: 0,
};

export const ADJUSTMENT_LABEL: Record<BipolarAdjustmentKey | UnipolarAdjustmentKey, string> = {
  lutIntensity: "LUT 강도",
  exposure: "노출",
  contrast: "대비",
  saturation: "채도",
  highlights: "하이라이트",
  shadows: "섀도우",
  temperature: "색온도",
  tint: "틴트",
  fade: "페이드",
  grain: "그레인",
};

/** 조정 패널 그룹 순서 — 촬영 화면에는 노출하지 않고, 조정 패널에서 이 순서를 지킨다. */
export const ADJUSTMENT_GROUPS: { label: string; keys: (BipolarAdjustmentKey | UnipolarAdjustmentKey)[] }[] = [
  { label: "톤", keys: ["exposure", "contrast", "highlights", "shadows"] },
  { label: "컬러", keys: ["saturation", "temperature", "tint"] },
  { label: "텍스처", keys: ["grain", "fade"] },
];

export const BIPOLAR_KEYS = new Set<string>(["exposure", "contrast", "saturation", "highlights", "shadows", "temperature", "tint"]);

export function isBipolar(key: BipolarAdjustmentKey | UnipolarAdjustmentKey): key is BipolarAdjustmentKey {
  return BIPOLAR_KEYS.has(key);
}

/** 켤 때 기본 강도 — 토글 ON 순간 0이 아니라 이 값에서 시작한다. */
export const OPTICAL_EFFECT_DEFAULT_INTENSITY: Record<OpticalEffectKey, number> = {
  halation: 35,
  bloom: 40,
  vignette: 35,
  chromaticAberration: 30,
  lightLeak: 40,
  dustScratches: 35,
};

export const OPTICAL_EFFECT_LABEL: Record<OpticalEffectKey, string> = {
  halation: "할레이션",
  bloom: "블룸",
  vignette: "비네팅",
  chromaticAberration: "색수차",
  lightLeak: "라이트 리크",
  dustScratches: "먼지 / 스크래치",
};

export const OPTICAL_EFFECT_ORDER: OpticalEffectKey[] = [
  "halation",
  "bloom",
  "vignette",
  "chromaticAberration",
  "lightLeak",
  "dustScratches",
];

export const DEFAULT_OPTICAL_EFFECTS: OpticalEffects = OPTICAL_EFFECT_ORDER.reduce((acc, key) => {
  acc[key] = { enabled: false, intensity: OPTICAL_EFFECT_DEFAULT_INTENSITY[key] };
  return acc;
}, {} as OpticalEffects);

export const TOGGLE_LABEL: Record<keyof EditToggles, string> = {
  dateStamp: "날짜 스탬프",
  frame: "프레임 / 보더",
  mirror: "좌우 반전",
};

export const DEFAULT_TOGGLES: EditToggles = {
  dateStamp: false,
  frame: false,
  mirror: false,
};

export function createDefaultFilterState(presetId: string): FilterState {
  return {
    presetId,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    opticalEffects: OPTICAL_EFFECT_ORDER.reduce((acc, key) => {
      acc[key] = { ...DEFAULT_OPTICAL_EFFECTS[key] };
      return acc;
    }, {} as OpticalEffects),
    toggles: { ...DEFAULT_TOGGLES },
  };
}
