import type { BasicCorrection, ColorGrade, OpticalEffects } from "@/projects/camera/colorrecipe/lib/types";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Approximates the current editor state as a live CSS filter so slider drags
 * visibly move the preview. This is a mock stand-in for real LUT rendering
 * (see spec.md non-goals) — it is not meant to match the baked preset grade.
 */
export function buildLiveGrade(basic: BasicCorrection, optical: OpticalEffects): ColorGrade {
  const brightness = clamp(1 + (basic.brightness + basic.exposure * 0.6) / 200, 0.4, 1.7);
  const contrast = clamp(1 + basic.contrast / 130, 0.3, 1.9);
  const saturate = clamp(1 + (basic.saturation + basic.vibrance * 0.6) / 130, 0, 2.2);
  const sepia = basic.temperature > 0 ? clamp(basic.temperature / 260, 0, 0.4) : 0;
  const hueRotate = basic.temperature < 0 ? basic.temperature / 9 : basic.tint / 12;
  const blur = optical.softFocusEnabled ? clamp(optical.softFocusBlur / 60, 0, 1.6) : 0;

  return {
    filter: `brightness(${brightness.toFixed(3)}) contrast(${contrast.toFixed(3)}) saturate(${saturate.toFixed(3)}) sepia(${sepia.toFixed(3)}) hue-rotate(${hueRotate.toFixed(1)}deg)${blur > 0 ? ` blur(${blur.toFixed(2)}px)` : ""}`,
    overlayGradient:
      optical.chromaticAberration > 0
        ? `linear-gradient(90deg, rgba(255,0,64,${(optical.chromaticAberration / 100) * 0.14}), transparent 4%, transparent 96%, rgba(0,180,255,${(optical.chromaticAberration / 100) * 0.14}))`
        : undefined,
    overlayBlend: optical.chromaticAberration > 0 ? "screen" : undefined,
    grain: optical.grainEnabled ? (optical.grainIntensity / 100) * 0.6 : 0,
    vignette: optical.vignetteEnabled ? (optical.vignetteIntensity / 100) * 0.4 : 0,
  };
}
