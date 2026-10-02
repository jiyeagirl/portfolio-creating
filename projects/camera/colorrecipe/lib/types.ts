export type ColorGrade = {
  filter: string;
  overlayGradient?: string;
  overlayBlend?: "soft-light" | "multiply" | "overlay" | "screen";
  grain: number;
  vignette: number;
};

export type BasicCorrection = {
  brightness: number;
  contrast: number;
  exposure: number;
  saturation: number;
  vibrance: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
};

export type HslBand = {
  id: string;
  label: string;
  swatch: string;
  hue: number;
  saturation: number;
  luminance: number;
};

export type CurvePoint = { x: number; y: number };

export type ToneCurves = {
  rgb: CurvePoint[];
  r: CurvePoint[];
  g: CurvePoint[];
  b: CurvePoint[];
};

export type OpticalEffects = {
  bloomEnabled: boolean;
  bloomIntensity: number;
  bloomThreshold: number;
  grainEnabled: boolean;
  grainSize: number;
  grainIntensity: number;
  vignetteEnabled: boolean;
  vignetteIntensity: number;
  vignetteFeather: number;
  softFocusEnabled: boolean;
  softFocusBlur: number;
  softFocusGlow: number;
  sharpen: number;
  fade: number;
  noise: number;
  chromaticAberration: number;
};

export type RecipeCategory =
  | "데일리"
  | "인물"
  | "풍경"
  | "시네마틱"
  | "빈티지"
  | "모노";

export type Recipe = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: RecipeCategory;
  tags: string[];
  source: "official" | "user";
  favorite: boolean;
  usageCount: number;
  lastUsedAt: string;
  lutIntensity: number;
  heroSeed: string;
  sampleSeeds: string[];
  palette: string[];
  colorGrade: ColorGrade;
  basic: BasicCorrection;
  hsl: HslBand[];
  curves: ToneCurves;
  optical: OpticalEffects;
};

export type Exif = {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  resolution: string;
  fileSize: string;
  fileName: string;
};

export type Photo = {
  id: string;
  seed: string;
  recipeId: string;
  capturedAt: string;
  favorite: boolean;
  exif: Exif;
};
