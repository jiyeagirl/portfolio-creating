"use client";

import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import { BottomTabBar } from "@/projects/camera/colorrecipe/components/bottom-tab-bar";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { recipeThumb, recipes } from "@/projects/camera/colorrecipe/lib/recipes";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

const SAVE_FORMATS = [
  { id: "jpeg", label: "JPEG", subtitle: "빠른 저장, 작은 용량" },
  { id: "raw+jpeg", label: "RAW + JPEG", subtitle: "원본 보존, 큰 용량" },
] as const;

const LANGUAGES = ["한국어", "English"];

function SettingsGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="px-6">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
        {label}
      </h2>
      <div className="divide-y divide-[var(--cr-border)] overflow-hidden rounded-2xl bg-[var(--cr-surface)]">
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
        <span className="block text-[14px] font-medium text-[var(--cr-foreground)]">{label}</span>
        <span className="mt-0.5 block text-[12px] text-[var(--cr-cool-gray)]">{subtitle}</span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[var(--cr-accent)]" : "border-[var(--cr-cool-gray-soft)]"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[var(--cr-accent)]" />}
      </span>
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[14px] font-medium text-[var(--cr-foreground)]">{label}</span>
      <Toggle
        checked={checked}
        onChange={onToggle}
        label={label}
        onClassName="bg-[var(--cr-accent)]"
        offClassName="bg-[var(--cr-cool-gray-soft)]"
      />
    </div>
  );
}

function NavRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
    >
      <span className="text-[14px] text-[var(--cr-foreground)]">{label}</span>
      <span className="flex items-center gap-1.5 text-[13px] text-[var(--cr-cool-gray)]">
        {value}
        <CaretRight size={13} weight="bold" />
      </span>
    </button>
  );
}

export function SettingsScreen({ onNavigate }: { onNavigate: ColorRecipeNavigate }) {
  const [saveFormat, setSaveFormat] = useState<(typeof SAVE_FORMATS)[number]["id"]>("jpeg");
  const [cloudSync, setCloudSync] = useState(true);
  const [gridOn, setGridOn] = useState(false);
  const [shutterSound, setShutterSound] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [defaultRecipeIndex, setDefaultRecipeIndex] = useState(0);

  const defaultRecipe = recipes[defaultRecipeIndex];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto pb-24 pt-[64px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-6 px-6">
          <h1 className="text-[24px] font-bold tracking-tight">설정</h1>
        </div>

        <div className="space-y-6">
          <SettingsGroup label="계정">
            <button
              type="button"
              className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cr-accent-dim)] text-[15px] font-semibold text-[var(--cr-accent)]">
                지
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold text-[var(--cr-foreground)]">
                  지은
                </span>
                <span className="block truncate text-[12px] text-[var(--cr-cool-gray)]">
                  jieun.color@colorrecipe.app
                </span>
              </span>
              <CaretRight size={14} weight="bold" className="text-[var(--cr-cool-gray)]" />
            </button>
            <ToggleRow label="클라우드 동기화" checked={cloudSync} onToggle={() => setCloudSync((v) => !v)} />
          </SettingsGroup>

          <SettingsGroup label="카메라">
            {SAVE_FORMATS.map((opt) => (
              <RadioRow
                key={opt.id}
                label={opt.label}
                subtitle={opt.subtitle}
                selected={saveFormat === opt.id}
                onSelect={() => setSaveFormat(opt.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setDefaultRecipeIndex((i) => (i + 1) % recipes.length)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-[14px] font-medium text-[var(--cr-foreground)]">기본 레시피</span>
              <span className="flex items-center gap-2 text-[13px] text-[var(--cr-cool-gray)]">
                <span className="relative h-5 w-5 overflow-hidden rounded-full">
                  <GradedSwatch
                    src={recipeThumb(defaultRecipe.heroSeed, 60)}
                    alt={defaultRecipe.name}
                    grade={defaultRecipe.colorGrade}
                    sizes="20px"
                    className="h-full w-full"
                  />
                </span>
                {defaultRecipe.name}
                <CaretRight size={13} weight="bold" />
              </span>
            </button>
            <ToggleRow label="그리드 기본 표시" checked={gridOn} onToggle={() => setGridOn((v) => !v)} />
            <ToggleRow label="셔터음 재생" checked={shutterSound} onToggle={() => setShutterSound((v) => !v)} />
          </SettingsGroup>

          <SettingsGroup label="색감 레시피">
            <ToggleRow label="레시피 자동 백업" checked={autoBackup} onToggle={() => setAutoBackup((v) => !v)} />
            <NavRow label="레시피 가져오기" />
            <NavRow label="레시피 내보내기" />
          </SettingsGroup>

          <SettingsGroup label="앱 설정">
            <ToggleRow label="다크모드" checked={darkMode} onToggle={() => setDarkMode((v) => !v)} />
            <button
              type="button"
              onClick={() => setLanguageIndex((i) => (i + 1) % LANGUAGES.length)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-[14px] text-[var(--cr-foreground)]">언어</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--cr-cool-gray)]">
                {LANGUAGES[languageIndex]}
                <CaretRight size={13} weight="bold" />
              </span>
            </button>
            <NavRow label="버전 확인" value="1.0.0" />
            <NavRow label="문의하기" />
          </SettingsGroup>

          <p className="pt-2 text-center text-[12px] tabular-nums text-[var(--cr-cool-gray-soft)]">
            COLORRECIPE 1.0.0
          </p>
        </div>
      </div>

      <BottomTabBar active="settings" onNavigate={onNavigate} />
    </div>
  );
}
