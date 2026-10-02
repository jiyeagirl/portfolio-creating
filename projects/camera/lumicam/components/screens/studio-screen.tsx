"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
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
import { shots } from "@/projects/camera/lumicam/lib/shots";
import type { Adjustments, EditToggles, OpticalEffects } from "@/projects/camera/lumicam/lib/types";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";
import { BipolarSlider, OpticalEffectRow, UnipolarSlider } from "@/projects/camera/lumicam/components/adjustment-controls";

const PREVIEW_ID = 1043;

const PANELS = [
  { key: "preset", label: "프리셋" },
  { key: "adjust", label: "조정" },
  { key: "analysis", label: "분석" },
  { key: "export", label: "내보내기" },
] as const;

type PanelKey = (typeof PANELS)[number]["key"];

const RESOLUTIONS = [
  { id: "12", label: "12MP", subtitle: "4032 × 3024 | 표준" },
  { id: "24", label: "24MP", subtitle: "5712 × 4284 | 고화질" },
  { id: "48", label: "48MP ProRAW", subtitle: "8064 × 6048 | 최대 화질" },
] as const;

/** 결정론적 유사난수 — film id 문자열을 시드로 써서 서버/클라이언트 렌더가 어긋나지 않게 함 */
function seededBars(seed: string, count: number, bias = 0.5) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const rand = h / 4294967295;
    const curve = Math.sin((i / count) * Math.PI);
    bars.push(Math.max(4, Math.round((rand * 0.5 + curve * 0.5) * bias * 100)));
  }
  return bars;
}

export function StudioScreen() {
  // 편집 대상은 가장 최근 컷 — 저장된 filterState를 그대로 불러와 큰 화면에서 이어 편집한다.
  const lastShot = shots[shots.length - 1];
  const [filmId, setFilmId] = useState(lastShot.filterState.presetId);
  const film = getFilm(filmId)!;
  const [adjustments, setAdjustments] = useState<Adjustments>({ ...lastShot.filterState.adjustments });
  const [opticalEffects, setOpticalEffects] = useState<OpticalEffects>({ ...lastShot.filterState.opticalEffects });
  const [toggles, setToggles] = useState<EditToggles>({ ...lastShot.filterState.toggles });
  const [panel, setPanel] = useState<PanelKey>("preset");
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [resolution, setResolution] = useState<(typeof RESOLUTIONS)[number]["id"]>("48");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [exported, setExported] = useState(false);

  function selectFilm(next: string) {
    setFilmId(next);
    const fresh = createDefaultFilterState(next);
    setAdjustments(fresh.adjustments);
    setOpticalEffects(fresh.opticalEffects);
    setExported(false);
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

  const luminanceBars = useMemo(() => seededBars(`${filmId}-lum`, 32, 0.95), [filmId]);
  const redBars = useMemo(() => seededBars(`${filmId}-r`, 20, 0.85), [filmId]);
  const greenBars = useMemo(() => seededBars(`${filmId}-g`, 20, 0.9), [filmId]);
  const blueBars = useMemo(() => seededBars(`${filmId}-b`, 20, 0.75), [filmId]);

  return (
    <div className="lumicam flex h-full w-full flex-col bg-[var(--lc-canvas)] text-[var(--lc-ink)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--lc-border)] px-6">
        <div>
          <p className="text-[14px] font-semibold leading-4">편집 스튜디오</p>
          <p className="mt-0.5 text-[11px] text-[var(--lc-mute)]">{film.name} | LUMI CAM</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            className="flex items-center gap-1.5 rounded-[6px] border border-[var(--lc-border)] px-3 py-1.5 text-[12px] font-medium"
          >
            <Icon icon="solar:transfer-horizontal-linear" width={13} />
            {showOriginal ? "원본" : "누르면 원본"}
          </button>
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--lc-border)]"
            aria-label="확대 보기"
          >
            <Icon icon="solar:magnifer-zoom-in-linear" width={16} />
          </button>
          <button
            type="button"
            onClick={() => setPanel("export")}
            className="flex items-center gap-1.5 rounded-[6px] bg-[var(--lc-ink)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--lc-on-ink)]"
          >
            <Icon icon="solar:download-minimalistic-linear" width={14} />
            내보내기
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="relative flex-1 bg-[#0e0d0a] p-8">
          <div className="relative h-full w-full overflow-hidden rounded-[12px]">
            <GradedPhoto
              src={picsum(PREVIEW_ID, 1400, 1000)}
              alt="편집 스튜디오 프리뷰"
              grade={previewGrade}
              ungraded={showOriginal}
              className="h-full w-full"
              sizes="800px"
              priority
            />
          </div>
        </div>

        <aside className="flex w-[380px] shrink-0 flex-col border-l border-[var(--lc-border)]">
          <div className="flex border-b border-[var(--lc-border)]">
            {PANELS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPanel(p.key)}
                className={`flex-1 border-b-2 px-2 py-3 text-[12px] font-medium transition-colors ${
                  panel === p.key
                    ? "border-[var(--lc-accent)] text-[var(--lc-ink)]"
                    : "border-transparent text-[var(--lc-mute)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {panel === "preset" && (
              <div className="grid grid-cols-2 gap-3">
                {films.map((f) => {
                  const active = f.id === filmId;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => selectFilm(f.id)}
                      className={`overflow-hidden rounded-[10px] border text-left ${
                        active ? "border-[var(--lc-accent)]" : "border-[var(--lc-border)]"
                      }`}
                    >
                      <span
                        className="block h-16 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${picsum(f.heroId, 200, 140)})`, filter: f.colorGrade.filter }}
                      />
                      <span className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-[11.5px] font-medium">{f.shortName}</span>
                        {active && <Icon icon="solar:check-circle-bold" width={12} className="text-[var(--lc-accent)]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {panel === "adjust" && (
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

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    광학 효과
                  </p>
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
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    표시 옵션
                  </p>
                  <div className="divide-y divide-[var(--lc-border)] overflow-hidden rounded-[10px] border border-[var(--lc-border)] bg-[var(--lc-surface)]">
                    {(Object.keys(TOGGLE_LABEL) as (keyof EditToggles)[]).map((key) => (
                      <div key={key} className="flex items-center justify-between px-3.5 py-3">
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
              </div>
            )}

            {panel === "analysis" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    히스토그램(휘도)
                  </p>
                  <div className="flex h-24 items-end gap-[2px] rounded-[10px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-2">
                    {luminanceBars.map((v, i) => (
                      <span key={i} className="flex-1 rounded-t-[1px] bg-[var(--lc-ink)]/70" style={{ height: `${v}%` }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    RGB 색상 분포
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "R", bars: redBars, color: "#C24B3E" },
                      { label: "G", bars: greenBars, color: "#3E8A5A" },
                      { label: "B", bars: blueBars, color: "#3E6FC2" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-2">
                        <span className="w-3 text-[11px] font-semibold" style={{ color: row.color }}>
                          {row.label}
                        </span>
                        <div className="flex h-8 flex-1 items-end gap-[2px] rounded-[6px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-1">
                          {row.bars.map((v, i) => (
                            <span key={i} className="flex-1 rounded-t-[1px]" style={{ height: `${v}%`, background: row.color, opacity: 0.75 }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {panel === "export" && (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    해상도
                  </p>
                  <div className="divide-y divide-[var(--lc-border)] overflow-hidden rounded-[10px] border border-[var(--lc-border)] bg-[var(--lc-surface)]">
                    {RESOLUTIONS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setResolution(r.id);
                          setExported(false);
                        }}
                        className="flex w-full items-center justify-between px-3.5 py-3 text-left"
                      >
                        <span>
                          <span className="block text-[13px] font-medium">{r.label}</span>
                          <span className="mt-0.5 block text-[11px] text-[var(--lc-mute)]">{r.subtitle}</span>
                        </span>
                        <span
                          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                            resolution === r.id ? "border-[var(--lc-accent)]" : "border-[var(--lc-border)]"
                          }`}
                        >
                          {resolution === r.id && <span className="h-2 w-2 rounded-full bg-[var(--lc-accent)]" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">
                    파일 형식
                  </p>
                  <div className="inline-flex rounded-[6px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-[3px]">
                    {(["jpeg", "png"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setFormat(f);
                          setExported(false);
                        }}
                        className={`rounded-[4px] px-3.5 py-1.5 text-[12px] font-medium uppercase transition-colors ${
                          format === f ? "bg-[var(--lc-ink)] text-[var(--lc-on-ink)]" : "text-[var(--lc-body)]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExported(true)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--lc-ink)] text-[13.5px] font-semibold text-[var(--lc-on-ink)] transition-transform active:scale-[0.98]"
                >
                  {exported ? (
                    <Icon icon="solar:check-circle-bold" width={15} />
                  ) : (
                    <Icon icon="solar:download-minimalistic-linear" width={15} />
                  )}
                  {exported ? "내보내기 완료" : `${format.toUpperCase()}로 내보내기`}
                </button>
                <p className="text-[11px] leading-4 text-[var(--lc-mute)]">
                  선택한 프리셋과 조정 값이 그대로 반영된 {resolution === "48" ? "최대 화질" : resolution === "24" ? "고화질" : "표준"}{" "}
                  이미지가 저장됩니다. 원본과 파라미터는 그대로 보존돼 언제든 재편집할 수 있어요.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {zoomed && (
        <div className="absolute inset-0 z-40 bg-black">
          <GradedPhoto
            src={picsum(PREVIEW_ID, 1600, 1200)}
            alt="확대 보기"
            grade={previewGrade}
            ungraded={showOriginal}
            className="h-full w-full"
            sizes="1194px"
          />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
            aria-label="확대 보기 닫기"
          >
            <Icon icon="solar:close-circle-bold" width={18} />
          </button>
        </div>
      )}
    </div>
  );
}
