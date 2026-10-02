"use client";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-[var(--cr-surface)] p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 whitespace-nowrap rounded-full px-2 py-2 text-[12px] font-medium transition-colors ${
            value === opt.id
              ? "bg-[var(--cr-accent)] text-[#04252b]"
              : "text-[var(--cr-cool-gray)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
