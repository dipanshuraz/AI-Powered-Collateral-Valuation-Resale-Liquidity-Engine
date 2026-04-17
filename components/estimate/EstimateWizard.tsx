"use client";

import { Steps } from "@ark-ui/react/steps";
import { useEstimateForm } from "@/contexts/EstimateFormContext";
import { StepProgress } from "@/components/estimate/StepProgress";
import { ResultsPanel } from "@/components/estimate/ResultsPanel";
import { StepLocation } from "@/components/estimate/steps/StepLocation";
import { StepProperty } from "@/components/estimate/steps/StepProperty";
import { StepAdvanced } from "@/components/estimate/steps/StepAdvanced";
import { StepReview } from "@/components/estimate/steps/StepReview";

const WIZARD_STEPS = [
  { id: 1, label: "Location" },
  { id: 2, label: "Property" },
  { id: 3, label: "Details" },
  { id: 4, label: "Review" },
] as const;

const STEP_COUNT = 4;

function validateStep1(form: {
  address: string;
  lat: string;
  lon: string;
}): string | null {
  const hasAddr = form.address.trim().length > 0;
  const lt = form.lat.trim() ? Number(form.lat) : NaN;
  const ln = form.lon.trim() ? Number(form.lon) : NaN;
  const hasCoords =
    !Number.isNaN(lt) &&
    !Number.isNaN(ln) &&
    lt >= -90 &&
    lt <= 90 &&
    ln >= -180 &&
    ln <= 180;
  if (!hasAddr && !hasCoords) {
    return "Enter an address for geocoding, or valid latitude and longitude.";
  }
  return null;
}

function validateStep2(sizeSqft: string): string | null {
  const n = Number(sizeSqft);
  if (!sizeSqft.trim() || Number.isNaN(n) || n <= 0) {
    return "Enter a valid size in sqft.";
  }
  return null;
}

const triggerIndicatorClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium " +
  "border-neutral-300 text-neutral-400 dark:border-neutral-600 " +
  "data-[complete]:border-emerald-600 data-[complete]:bg-emerald-600 data-[complete]:text-white " +
  "data-[current]:border-neutral-900 data-[current]:text-neutral-900 dark:data-[current]:border-neutral-100 dark:data-[current]:text-neutral-100";

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

  const arkStep = activeStep - 1;

  const stepError =
    activeStep === 1
      ? validateStep1(form)
      : activeStep === 2
        ? validateStep2(form.sizeSqft)
        : null;

  function handleStepChange(details: { step: number }) {
    clearError();
    setActiveStep(details.step + 1);
  }

  if (result) {
    return (
      <div>
        <StepProgress activeStep={4} hasResult />
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
    <Steps.Root
      count={STEP_COUNT}
      step={arkStep}
      onStepChange={handleStepChange}
      linear
      isStepValid={(index) => {
        if (index === 0) return validateStep1(form) === null;
        if (index === 1) return validateStep2(form.sizeSqft) === null;
        return true;
      }}
      className="block"
    >
      <nav aria-label="Progress" className="mb-8">
        <Steps.List className="flex flex-wrap items-center gap-2 sm:gap-4">
          {WIZARD_STEPS.map((s, i) => (
            <Steps.Item key={s.id} index={i}>
              <Steps.Trigger className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950">
                <Steps.Indicator className={triggerIndicatorClass}>
                  <Steps.ItemContext>
                    {(item) => (item.completed ? "✓" : s.id)}
                  </Steps.ItemContext>
                </Steps.Indicator>
                <span
                  className={`hidden text-xs sm:inline ${
                    arkStep === i
                      ? "font-medium text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500"
                  }`}
                >
                  {s.label}
                </span>
              </Steps.Trigger>
            </Steps.Item>
          ))}
        </Steps.List>
      </nav>

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="relative min-h-[320px]">
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur dark:bg-neutral-950/70">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Running estimate…
            </p>
          </div>
        )}

        <Steps.Content index={0}>
          <StepLocation />
        </Steps.Content>
        <Steps.Content index={1}>
          <StepProperty />
        </Steps.Content>
        <Steps.Content index={2}>
          <StepAdvanced />
        </Steps.Content>
        <Steps.Content index={3}>
          <StepReview />
        </Steps.Content>
      </div>

      {stepError && activeStep <= 2 && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">{stepError}</p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <Steps.PrevTrigger
          disabled={isSubmitting || arkStep === 0}
          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-40 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Back
        </Steps.PrevTrigger>
        <div className="flex gap-3">
          {arkStep < 3 ? (
            <Steps.NextTrigger
              disabled={isSubmitting}
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Continue
            </Steps.NextTrigger>
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
    </Steps.Root>
  );
}
