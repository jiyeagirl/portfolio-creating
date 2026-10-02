"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { PageHead, Card, CardHead, Button, Table, Row, Cell, Select } from "@/projects/camera/lumicam/components/admin/ui";
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
import { lutAssets } from "@/projects/camera/lumicam/lib/mock-data";
import type { Adjustments, EditToggles, OpticalEffects } from "@/projects/camera/lumicam/lib/types";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";
import { BipolarSlider, OpticalEffectRow, UnipolarSlider } from "@/projects/camera/lumicam/components/adjustment-controls";

const PREVIEW_ID = 1043;

export function EngineScreen() {
  const [filmId, setFilmId] = useState(films[0].id);
  const film = getFilm(filmId)!;
  const [adjustments, setAdjustments] = useState<Adjustments>(() => createDefaultFilterState(filmId).adjustments);
  const [opticalEffects, setOpticalEffects] = useState<OpticalEffects>(() => createDefaultFilterState(filmId).opticalEffects);
  const [toggles, setToggles] = useState<EditToggles>(() => createDefaultFilterState(filmId).toggles);
  const [saved, setSaved] = useState(true);

  function selectFilm(id: string) {
    setFilmId(id);
    const fresh = createDefaultFilterState(id);
    setAdjustments(fresh.adjustments);
    setOpticalEffects(fresh.opticalEffects);
    setToggles(fresh.toggles);
    setSaved(true);
  }

  function setAdjustment(key: keyof Adjustments, value: number) {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setEffectEnabled(key: keyof OpticalEffects, enabled: boolean) {
    setOpticalEffects((prev) => ({ ...prev, [key]: { ...prev[key], enabled } }));
    setSaved(false);
  }

  function setEffectIntensity(key: keyof OpticalEffects, intensity: number) {
    setOpticalEffects((prev) => ({ ...prev, [key]: { ...prev[key], intensity } }));
    setSaved(false);
  }

  function setToggle(key: keyof EditToggles, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  const previewGrade = {
    ...film.colorGrade,
    filter: `${film.colorGrade.filter} brightness(${1 + adjustments.exposure / 300 + adjustments.shadows / 1000 - adjustments.highlights / 1500}) contrast(${1 + adjustments.contrast / 250}) saturate(${1 + adjustments.saturation / 150}) hue-rotate(${adjustments.temperature / 12 + adjustments.tint / 20}deg)`,
    grain: film.colorGrade.grain + (adjustments.grain / 100) * 0.5,
    vignette: film.colorGrade.vignette,
  };

  const json = useMemo(
    () => JSON.stringify({ presetId: filmId, adjustments, opticalEffects, toggles }, null, 2),
    [filmId, adjustments, opticalEffects, toggles],
  );

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="필터 엔진"
        title="필터 엔진 관리"
        desc="필름별 조정 파라미터와 광학 효과를 JSON으로 운영해 코드 배포 없이 값만 바꿔도 즉시 반영됩니다."
        descNoWrap
        actions={
          <Button
            icon={
              saved ? (
                <Icon icon="solar:check-circle-bold" width={14} />
              ) : (
                <Icon icon="solar:diskette-linear" width={14} />
              )
            }
            onClick={() => setSaved(true)}
          >
            {saved ? "저장됨" : "변경사항 저장"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit">
          <CardHead title="필름 선택" />
          <ul className="space-y-1">
            {films.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => selectFilm(f.id)}
                  className={`flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[12.5px] transition-colors ${
                    f.id === filmId ? "bg-[var(--lc-surface-soft)] font-medium text-[var(--lc-ink)]" : "text-[var(--lc-body)] hover:bg-[var(--lc-surface-soft)]"
                  }`}
                >
                  <span className="h-6 w-6 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${picsum(f.heroId, 60, 60)})`, filter: f.colorGrade.filter }} />
                  {f.shortName}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="실시간 Preview" desc={`${film.name}, 슬라이더를 조정하면 즉시 반영됩니다`} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
              <div className="h-[220px] w-full overflow-hidden rounded-[10px] border border-[var(--lc-border)]">
                <GradedPhoto src={picsum(PREVIEW_ID, 480, 440)} alt={`${film.name} 프리뷰`} grade={previewGrade} className="h-full w-full" sizes="240px" />
              </div>
              <div className="space-y-5">
                {ADJUSTMENT_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--lc-mute)]">
                      {group.label}
                    </p>
                    <div className="space-y-3.5">
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
            </div>
          </Card>

          <Card>
            <CardHead title="광학 효과" desc="토글이 꺼지면 셰이더 패스 자체를 건너뜁니다. 강도 0으로 대체하지 않습니다." />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <p className="mb-2.5 mt-5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--lc-mute)]">
              표시 옵션
            </p>
            <div className="divide-y divide-[var(--lc-border)] overflow-hidden rounded-[10px] border border-[var(--lc-border)]">
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
          </Card>

          <Card>
            <CardHead title="JSON 파라미터" desc="현재 값의 JSON 표현입니다. 비파괴 편집 저장 스키마와 동일합니다." />
            <pre className="overflow-x-auto rounded-[8px] border border-[var(--lc-border)] bg-[var(--lc-canvas)] p-4 text-[11.5px] leading-5 tabular-nums text-[var(--lc-body)]">
              {json}
            </pre>
          </Card>

          <Card>
            <CardHead title="필터 매핑 관리" desc="필름과 실제 3D LUT 파일의 연결을 관리합니다." />
            <Table head={["필름", "매핑된 LUT", "카테고리", "상태"]} minWidth={560}>
              {films.map((f) => {
                const lut = lutAssets.find((l) => l.filmId === f.id);
                return (
                  <Row key={f.id}>
                    <Cell strong>{f.shortName}</Cell>
                    <Cell muted mono>
                      {lut?.fileName ?? "매핑 없음"}
                    </Cell>
                    <Cell muted>{lut?.category ?? "-"}</Cell>
                    <Cell>
                      <Select value={lut?.fileName ?? "매핑 없음"} options={lutAssets.map((l) => l.fileName)} onChange={() => {}} />
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
