"use client";

import { Check } from "@phosphor-icons/react";
import { STEPS, type SiteScreen } from "@/projects/platform/drawqty/lib/navigation";

/* 4단계 진행 표시. 단계 이름이 곧 라벨이다. 이미 도달한 단계는 눌러서 돌아갈 수 있다. */
export function Stepper({
  current,
  reached,
  onGo,
}: {
  current: SiteScreen;
  reached: number;
  onGo: (s: SiteScreen) => void;
}) {
  const index = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="진행 단계">
      <ol className="hidden items-center md:flex">
        {STEPS.map((s, i) => {
          const done = i < index;
          const active = i === index;
          const enabled = i <= reached;
          return (
            <li key={s.key} className="flex items-center">
              {i > 0 && <span className={`mx-3 h-px w-12 lg:w-20 ${i <= index ? "bg-[var(--dq-brand)]" : "bg-[var(--dq-line-strong)]"}`} />}
              <button
                type="button"
                disabled={!enabled || active}
                onClick={() => onGo(s.key)}
                aria-current={active ? "step" : undefined}
                className="flex h-11 items-center gap-2.5 disabled:cursor-default"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold ${
                    done
                      ? "bg-[var(--dq-brand)] text-white"
                      : active
                        ? "bg-[var(--dq-brand)] text-white"
                        : "border border-[var(--dq-line-strong)] text-[var(--dq-ink-3)]"
                  }`}
                >
                  {done ? <Check size={14} weight="bold" /> : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-[14px] ${
                    active ? "font-semibold text-[var(--dq-ink)]" : "font-medium text-[var(--dq-ink-3)]"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="md:hidden">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              aria-label={s.label}
              disabled={i > reached || i === index}
              onClick={() => onGo(s.key)}
              className="flex h-6 flex-1 items-center disabled:cursor-default"
            >
              <span className={`block h-1.5 w-full rounded-full ${i <= index ? "bg-[var(--dq-brand)]" : "bg-[var(--dq-soft-2)]"}`} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
