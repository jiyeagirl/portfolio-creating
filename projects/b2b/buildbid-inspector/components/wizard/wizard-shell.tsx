"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, X } from "@phosphor-icons/react";
import { WIZARD_STEPS, WIZARD_STEP_LABELS, type WizardStep } from "@/projects/b2b/buildbid-inspector/lib/navigation";

export function WizardShell({
  step,
  direction,
  jobLabel,
  onExit,
  onBackStep,
  onNextStep,
  nextLabel,
  nextDisabled = false,
  footer,
  children,
}: {
  step: WizardStep;
  direction: 1 | -1;
  jobLabel: string;
  onExit: () => void;
  onBackStep: () => void;
  onNextStep: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  /** Optional replacement for the default bottom bar (e.g. review step wants a fuller summary bar). */
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const stepIndex = WIZARD_STEPS.indexOf(step);
  const total = WIZARD_STEPS.length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--bbi-canvas)]">
      <div className="absolute inset-x-0 top-0 z-30 bg-[var(--bbi-surface)] pt-[59px]">
        <div className="flex h-[52px] items-center gap-2 px-4">
          <button
            type="button"
            onClick={stepIndex === 0 ? onExit : onBackStep}
            aria-label="이전"
            className="bbi-btn-press -ml-2 flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--bbi-ink)] hover:bg-[var(--bbi-surface-sunken)]"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold leading-[14px] text-[var(--bbi-muted)]">
              {jobLabel}
            </p>
            <p className="truncate text-[15.5px] font-bold leading-[20px] text-[var(--bbi-ink)]">
              {WIZARD_STEP_LABELS[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            aria-label="검수 종료"
            className="bbi-btn-press flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--bbi-muted)] hover:bg-[var(--bbi-surface-sunken)]"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex items-center gap-3 border-b border-[var(--bbi-border)] px-4 pb-3">
          <div className="flex flex-1 gap-1.5">
            {WIZARD_STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-[5px] flex-1 rounded-[9999px] transition-colors duration-300 ${
                  i < stepIndex
                    ? "bg-[var(--bbi-success)]"
                    : i === stepIndex
                      ? "bg-[var(--bbi-accent)]"
                      : "bg-[var(--bbi-surface-sunken)]"
                }`}
              />
            ))}
          </div>
          <span className="bbi-tabular shrink-0 text-[11px] font-bold text-[var(--bbi-muted)]">
            {stepIndex + 1}/{total}
          </span>
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto bbi-scroll-hidden pb-[112px] pt-[131px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: direction === 1 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: direction === 1 ? -24 : 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--bbi-border)] bg-[var(--bbi-surface)] px-5 pb-8 pt-3">
        {footer ?? (
          <button
            type="button"
            onClick={onNextStep}
            disabled={nextDisabled}
            className={`bbi-btn-press flex h-[52px] w-full items-center justify-center rounded-[9999px] text-[15px] font-bold ${
              nextDisabled
                ? "bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted-soft)]"
                : "bg-[var(--bbi-accent)] text-[var(--bbi-on-accent)]"
            }`}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
