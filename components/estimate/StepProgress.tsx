import { ESTIMATE_WIZARD_STEPS } from "@/components/estimate/wizard-steps";

export function StepProgress({
  activeStep,
  hasResult,
}: {
  activeStep: number;
  hasResult: boolean;
}) {
  return (
    <nav
      aria-label="Progress"
      className="-mx-1 mb-8 min-w-0 overflow-x-auto overflow-y-visible pb-1 sm:mx-0 sm:overflow-visible"
    >
      <ol className="flex min-w-max flex-nowrap items-center gap-2 px-1 sm:min-w-0 sm:flex-wrap sm:gap-4">
        {ESTIMATE_WIZARD_STEPS.map((s) => {
          const done = hasResult || activeStep > s.id;
          const current = !hasResult && activeStep === s.id;
          return (
            <li key={s.id} className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  done
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : current
                      ? "border-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                      : "border border-neutral-300 text-neutral-400 dark:border-neutral-600"
                }`}
              >
                {done ? "✓" : s.id}
              </span>
              <span
                className={`whitespace-nowrap text-xs ${
                  current ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-500"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
        {hasResult && (
          <li className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
              ✓
            </span>
            <span>Results</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
