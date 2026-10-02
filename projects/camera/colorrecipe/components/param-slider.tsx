"use client";

function formatValue(value: number, signed: boolean, unit: string) {
  const rounded = Math.round(value);
  const sign = signed && rounded > 0 ? "+" : "";
  return `${sign}${rounded}${unit}`;
}

export function ParamSlider({
  label,
  value,
  min = -100,
  max = 100,
  unit = "",
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  const signed = min < 0;
  const zeroPoint = signed ? ((0 - min) / (max - min)) * 100 : 0;
  const valuePoint = ((value - min) / (max - min)) * 100;
  const lo = Math.min(zeroPoint, valuePoint);
  const hi = Math.max(zeroPoint, valuePoint);

  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--cr-foreground)]">{label}</span>
        <span className="text-[12px] font-medium tabular-nums text-[var(--cr-cool-gray)]">
          {formatValue(value, signed, unit)}
        </span>
      </div>
      <div className="relative flex h-6 items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-[var(--cr-cool-gray-soft)]/30" />
        <div
          className="absolute h-[3px] rounded-full bg-[var(--cr-accent)]"
          style={{ left: `${lo}%`, width: `${hi - lo}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="cr-range relative h-6 w-full appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
