"use client";

import { useCallback } from "react";
import { useEstimateForm } from "@/contexts/EstimateFormContext";
import { StepProgress } from "@/components/estimate/StepProgress";
import { ResultsPanel } from "@/components/estimate/ResultsPanel";
import { WizardStepNav } from "@/components/estimate/WizardStepNav";
import { WizardStepPanels } from "@/components/estimate/WizardStepPanels";
import {
  ESTIMATE_WIZARD_STEPS,
  RESULT_DISPLAY_STEP,
  STEP_COUNT,
} from "@/components/estimate/wizard-steps";

export function EstimateWizard() {
  const {
    form,
    activeStep,
    setActiveStep,
    isSubmitting,
    result,
    error,
    clearError,
    submitEstimate,
    resetFlow,
  } = useEstimateForm();

  const currentConfig = ESTIMATE_WIZARD_STEPS[activeStep - 1];
  const stepError = currentConfig?.validate?.(form) ?? null;

  const goToStep = useCallback(
    (step: number) => {
      clearError();
      setActiveStep(step);
    },
    [clearError, setActiveStep]
  );

  const handleContinue = useCallback(() => {
    clearError();
    const idx = activeStep - 1;
    const validate = ESTIMATE_WIZARD_STEPS[idx]?.validate;
    if (validate && validate(form) !== null) return;
    if (activeStep < STEP_COUNT) setActiveStep(activeStep + 1);
  }, [activeStep, clearError, form, setActiveStep]);

  const handleBack = useCallback(() => {
    clearError();
    if (activeStep > 1) setActiveStep(activeStep - 1);
  }, [activeStep, clearError, setActiveStep]);

  if (result) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col">
        <StepProgress activeStep={RESULT_DISPLAY_STEP} hasResult />
        <ResultsPanel result={result} />
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetFlow}
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            New estimate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <WizardStepNav activeStep={activeStep} onGoToStep={goToStep} />

      {error && (
        <div
          className="mb-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur dark:bg-neutral-950/70">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Running estimate…
            </p>
          </div>
        )}

        <WizardStepPanels activeStep={activeStep} />
      </div>

      {stepError && (
        <p className="mt-2 shrink-0 text-xs text-amber-700 dark:text-amber-400">{stepError}</p>
      )}

      <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <button
          type="button"
          disabled={isSubmitting || activeStep <= 1}
          onClick={handleBack}
          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-40 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Back
        </button>
        <div className="flex gap-3">
          {activeStep < STEP_COUNT ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleContinue}
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void submitEstimate()}
              disabled={isSubmitting}
              className="rounded-md bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Run estimate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
