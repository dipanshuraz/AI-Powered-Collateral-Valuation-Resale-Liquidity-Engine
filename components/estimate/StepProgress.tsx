const STEPS = [
  { id: 1, label: "Location" },
  { id: 2, label: "Property" },
  { id: 3, label: "Details" },
  { id: 4, label: "Review" },
];

export function StepProgress({
  activeStep,
  hasResult,
}: {
  activeStep: number;
  hasResult: boolean;
}) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
        {STEPS.map((s) => {
          const done = hasResult || activeStep > s.id;
          const current = !hasResult && activeStep === s.id;
          return (
            <li key={s.id} className="flex items-center gap-2">
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
                className={`hidden text-xs sm:inline ${
                  current ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-500"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
        {hasResult && (
          <li className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
              ✓
            </span>
            <span className="hidden sm:inline">Results</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
