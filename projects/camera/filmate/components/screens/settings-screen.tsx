"use client";

import { useState } from "react";
import { ArrowLeft, CaretRight } from "@phosphor-icons/react";
import type { FilmateNavigate } from "@/projects/camera/filmate/lib/navigation";

const RESOLUTIONS = [
  { id: "12", label: "12MP", subtitle: "4032 × 3024 · 표준" },
  { id: "24", label: "24MP", subtitle: "5712 × 4284 · 고화질" },
  { id: "48", label: "48MP ProRAW", subtitle: "8064 × 6048 · 최대 화질" },
] as const;

const SAVE_OPTIONS = [
  { id: "both", label: "원본 + 필름 버전 저장", subtitle: "보정 전후를 모두 보관해요" },
  { id: "film", label: "필름 버전만 저장", subtitle: "용량을 아끼고 싶을 때" },
] as const;

const LUT_QUALITY = [
  { id: "standard", label: "표준", subtitle: "빠른 처리, 배터리 절약" },
  { id: "high", label: "고품질", subtitle: "정밀한 그레인 표현, 배터리 소모 증가" },
] as const;

const WATERMARK_STYLES = ["필름 프레임", "심플 로고"];
const SHUTTER_SOUNDS = ["클래식 셔터", "필름 감기음"];

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-[var(--fm-accent)]" : "bg-[var(--fm-warm-gray-soft)]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-[var(--fm-foreground)] shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fm-warm-gray)]">
        {label}
      </h2>
      <div className="divide-y divide-[var(--fm-border)] overflow-hidden rounded-2xl border border-[var(--fm-border)] bg-[var(--fm-surface)]">
        {children}
      </div>
    </section>
  );
}

function RadioRow({
  label,
  subtitle,
  selected,
  onSelect,
}: {
  label: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
    >
      <span>
        <span className="block text-[14px] font-medium text-[var(--fm-foreground)]">
          {label}
        </span>
        <span className="mt-0.5 block text-[12px] text-[var(--fm-warm-gray)]">
          {subtitle}
        </span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[var(--fm-accent)]" : "border-[var(--fm-warm-gray-soft)]"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[var(--fm-accent)]" />}
      </span>
    </button>
  );
}

export function SettingsScreen({ onNavigate }: { onNavigate: FilmateNavigate }) {
  const [saveOption, setSaveOption] = useState<(typeof SAVE_OPTIONS)[number]["id"]>("both");
  const [resolution, setResolution] =
    useState<(typeof RESOLUTIONS)[number]["id"]>("24");
  const [lutQuality, setLutQuality] =
    useState<(typeof LUT_QUALITY)[number]["id"]>("high");

  const [watermarkOn, setWatermarkOn] = useState(true);
  const [watermarkStyleIndex, setWatermarkStyleIndex] = useState(0);

  const [shutterSoundOn, setShutterSoundOn] = useState(true);
  const [shutterSoundIndex, setShutterSoundIndex] = useState(0);

  return (
    <div className="h-full w-full pb-12 pt-[64px]">
      <div className="mb-2 flex items-center px-5">
        <button
          type="button"
          onClick={() => onNavigate("camera")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--fm-surface)]"
          aria-label="카메라로 돌아가기"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>
      </div>

      <div className="mb-6 px-6">
        <h1 className="text-[24px] font-bold tracking-tight">설정</h1>
      </div>

      <div className="space-y-6">
        <SettingsGroup label="저장 옵션">
          {SAVE_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.id}
              label={opt.label}
              subtitle={opt.subtitle}
              selected={saveOption === opt.id}
              onSelect={() => setSaveOption(opt.id)}
            />
          ))}
        </SettingsGroup>

        <SettingsGroup label="해상도">
          {RESOLUTIONS.map((opt) => (
            <RadioRow
              key={opt.id}
              label={opt.label}
              subtitle={opt.subtitle}
              selected={resolution === opt.id}
              onSelect={() => setResolution(opt.id)}
            />
          ))}
        </SettingsGroup>

        <SettingsGroup label="워터마크">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] font-medium text-[var(--fm-foreground)]">
              촬영 시 워터마크 삽입
            </span>
            <Switch on={watermarkOn} onToggle={() => setWatermarkOn((v) => !v)} />
          </div>
          {watermarkOn && (
            <button
              type="button"
              onClick={() =>
                setWatermarkStyleIndex((i) => (i + 1) % WATERMARK_STYLES.length)
              }
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-[14px] text-[var(--fm-foreground)]">스타일</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--fm-warm-gray)]">
                {WATERMARK_STYLES[watermarkStyleIndex]}
                <CaretRight size={13} weight="bold" />
              </span>
            </button>
          )}
        </SettingsGroup>

        <SettingsGroup label="셔터 사운드">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] font-medium text-[var(--fm-foreground)]">
              셔터음 재생
            </span>
            <Switch on={shutterSoundOn} onToggle={() => setShutterSoundOn((v) => !v)} />
          </div>
          {shutterSoundOn && (
            <button
              type="button"
              onClick={() =>
                setShutterSoundIndex((i) => (i + 1) % SHUTTER_SOUNDS.length)
              }
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-[14px] text-[var(--fm-foreground)]">사운드</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--fm-warm-gray)]">
                {SHUTTER_SOUNDS[shutterSoundIndex]}
                <CaretRight size={13} weight="bold" />
              </span>
            </button>
          )}
        </SettingsGroup>

        <SettingsGroup label="LUT 품질">
          {LUT_QUALITY.map((opt) => (
            <RadioRow
              key={opt.id}
              label={opt.label}
              subtitle={opt.subtitle}
              selected={lutQuality === opt.id}
              onSelect={() => setLutQuality(opt.id)}
            />
          ))}
        </SettingsGroup>

        <p className="pt-2 text-center text-[12px] tabular-nums text-[var(--fm-warm-gray-soft)]">
          FILMATE 1.4.2
        </p>
      </div>
    </div>
  );
}
