"use client";

import { ESTIMATE_WIZARD_STEPS } from "@/components/estimate/wizard-steps";

type Props = {
  activeStep: number;
  /** 1-based step index to jump to (only past / completed steps). */
  onGoToStep: (step: number) => void;
};

export function WizardStepNav({ activeStep, onGoToStep }: Props) {
  return (
    <nav
      aria-label="Progress"
      className="-mx-1 mb-4 min-w-0 shrink-0 overflow-x-auto overflow-y-visible pb-1 sm:mx-0 sm:overflow-visible"
    >
      <ol className="flex min-w-max list-none flex-nowrap items-center gap-2 px-1 sm:min-w-0 sm:flex-wrap sm:gap-4">
        {ESTIMATE_WIZARD_STEPS.map((s) => {
          const done = activeStep > s.id;
          const current = activeStep === s.id;
          const canJumpBack = done;

          return (
            <li key={s.id} className="flex shrink-0">
              <button
                type="button"
                disabled={!canJumpBack}
                aria-current={current ? "step" : undefined}
                title={
                  canJumpBack
                    ? `Go back to ${s.label}`
                    : current
                      ? `Current: ${s.label}`
                      : `Complete earlier steps first`
                }
                onClick={() => {
                  if (canJumpBack) onGoToStep(s.id);
                }}
                className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 dark:focus-visible:ring-offset-neutral-950"
              >
                <span
                  className={
                    done
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-600 text-xs font-medium text-white dark:border-emerald-500 dark:bg-emerald-600"
                      : current
                        ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 text-xs font-medium text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                        : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs font-medium text-neutral-400 dark:border-neutral-600"
                  }
                >
                  {done ? "✓" : s.id}
                </span>
                <span
                  className={`whitespace-nowrap text-xs ${
                    current
                      ? "font-medium text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
