export type ColorGrade = {
  filter: string;
  overlayGradient?: string;
  overlayBlend?: "soft-light" | "multiply" | "overlay";
  grain: number;
  vignette: number;
};

/** 양방향 파라미터. 범위 -100~100, 기본값 0. 슬라이더 중앙(0)에 눈금/스냅이 있다. */
export type BipolarAdjustmentKey =
  | "exposure"
  | "contrast"
  | "saturation"
  | "highlights"
  | "shadows"
  | "temperature"
  | "tint";

/** 단방향 파라미터. 범위 0~100, 중앙 스냅 없음. lutIntensity만 기본값 100, 나머지는 0. */
export type UnipolarAdjustmentKey = "lutIntensity" | "fade" | "grain";

export type Adjustments = Record<BipolarAdjustmentKey, number> & Record<UnipolarAdjustmentKey, number>;

/** 광학 효과 6종. 각 효과는 셰이더 패스 자체를 건너뛰는 enabled와, ON일 때만 노출되는
 *  intensity(0~100)로 구성된다 — intensity 0으로 "끄기"를 대신하지 않는다. */
export type OpticalEffectKey =
  | "halation"
  | "bloom"
  | "vignette"
  | "chromaticAberration"
  | "lightLeak"
  | "dustScratches";

export type OpticalEffectState = { enabled: boolean; intensity: number };

export type OpticalEffects = Record<OpticalEffectKey, OpticalEffectState>;

/** 강도 축이 없는 순수 on/off 항목. */
export type EditToggles = {
  dateStamp: boolean;
  frame: boolean;
  mirror: boolean;
};

/** 비파괴 편집의 저장 단위 — 원본 + 프리셋 식별자 + 파라미터 전체를 함께 저장하고,
 *  렌더링된 결과물은 캐시/내보내기 산출물로만 취급한다. */
export type FilterState = {
  presetId: string;
  adjustments: Adjustments;
  opticalEffects: OpticalEffects;
  toggles: EditToggles;
};

export type Film = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  characteristics: string[];
  recommendedFor: string[];
  iso: number;
  colorGrade: ColorGrade;
  palette: string[];
  heroId: number;
};

export type Shot = {
  id: string;
  frame: number;
  filmId: string;
  photoId: number;
  time: string;
  resolution: string;
  savedToLibrary: boolean;
  /** 비파괴 편집: 이 컷을 촬영/저장할 때 함께 저장된 전체 파라미터 세트. */
  filterState: FilterState;
};

export type FilterPackTag = "무료" | "신규" | "인기" | "프리미엄";

export type FilterPack = {
  id: string;
  name: string;
  tagline: string;
  photoId: number;
  previewFilter: string;
  price: string;
  owned: boolean;
  downloads: string;
  rating: number;
  tags: FilterPackTag[];
};

export type LutStatus = "active" | "draft" | "disabled";

export type LutAsset = {
  id: string;
  filmId: string;
  fileName: string;
  category: string;
  version: string;
  status: LutStatus;
  sizeKb: number;
  updatedAt: string;
  uploadedBy: string;
};

export type RenderLog = {
  id: string;
  at: string;
  device: string;
  filmId: string;
  gpuMs: number;
  frameDrops: number;
  status: "정상" | "저하" | "실패";
};

export type ErrorLog = {
  id: string;
  at: string;
  code: string;
  message: string;
  device: string;
  resolved: boolean;
};

export type ReleaseNote = {
  version: string;
  releasedAt: string;
  channel: "정식" | "베타";
  notes: string;
  adoption: number;
};

export type ShareChannel = {
  id: string;
  label: string;
  icon: string;
};

export type ShareRecord = {
  id: string;
  filmId: string;
  photoId: number;
  channel: string;
  sharedAt: string;
};
