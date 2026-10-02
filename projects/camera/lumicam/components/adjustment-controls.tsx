"use client";

/**
 * 필터 조정 화면(모바일 필터 조정 / iPad 스튜디오 / 관리자 필터 엔진)이 공유하는 슬라이더
 * 프리미티브. 양방향(Bipolar, -100~100, 중앙 스냅)과 단방향(Unipolar, 0~100)을 시각적으로
 * 분리한다 — 전자는 중앙 눈금 + 트랙이 중앙에서부터 채워지고, 후자는 왼쪽부터 채워진다.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Toggle } from "@/components/shared/toggle";

const SNAP_THRESHOLD = 3;

export function BipolarSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  const fillPercent = ((value + 100) / 200) * 100;
  const from = Math.min(50, fillPercent);
  const to = Math.max(50, fillPercent);

  function handleChange(raw: number) {
    onChange(Math.abs(raw) <= SNAP_THRESHOLD ? 0 : raw);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--lc-ink)]">{label}</span>
        <span
          className={`text-[12px] tabular-nums ${value === 0 ? "text-[var(--lc-mute)]" : "text-[var(--lc-accent-soft-ink)]"}`}
        >
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="relative flex h-4 items-center">
        <span className="pointer-events-none absolute left-1/2 h-[9px] w-[2px] -translate-x-1/2 rounded-full bg-[var(--lc-mute)]" />
        <input
          type="range"
          min={-100}
          max={100}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="lc-slider-bipolar h-4 w-full"
          style={{
            ["--lc-slider-from" as string]: `${from}%`,
            ["--lc-slider-to" as string]: `${to}%`,
          }}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export function UnipolarSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--lc-ink)]">{label}</span>
        <span className="text-[12px] tabular-nums text-[var(--lc-mute)]">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lc-slider h-4 w-full"
        style={{ ["--lc-slider-fill" as string]: `${value}%` }}
        aria-label={label}
      />
    </div>
  );
}

/**
 * 광학 효과 한 항목 — 토글(셰이더 패스 스위치)과 강도 슬라이더를 분리한다. OFF일 때는
 * 슬라이더 자체를 언마운트해(라이브 프리뷰 패스를 건너뛴다는 것을 그대로 표현) 접힌다.
 * ON으로 켜는 순간 intensity가 0이면 defaultIntensity로 올려준다 — 0에서 시작하면
 * "켜도 아무 변화 없음 = 고장"으로 읽히기 때문.
 */
export function OpticalEffectRow({
  label,
  enabled,
  intensity,
  defaultIntensity,
  onToggle,
  onIntensityChange,
}: {
  label: string;
  enabled: boolean;
  intensity: number;
  defaultIntensity: number;
  onToggle: (next: boolean) => void;
  onIntensityChange: (next: number) => void;
}) {
  const reduce = useReducedMotion();

  function handleToggle(next: boolean) {
    onToggle(next);
    if (next && intensity === 0) onIntensityChange(defaultIntensity);
  }

  return (
    <div className="rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-[var(--lc-ink)]">{label}</span>
        <Toggle
          checked={enabled}
          onChange={handleToggle}
          label={label}
          size="sm"
          onClassName="bg-[var(--lc-accent)]"
          offClassName="bg-[var(--lc-border)]"
        />
      </div>
      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3.5">
              <UnipolarSlider label="강도" value={intensity} onChange={onIntensityChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
