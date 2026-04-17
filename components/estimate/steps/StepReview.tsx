"use client";

import { useEstimateForm } from "@/contexts/EstimateFormContext";

export function StepReview() {
  const { form } = useEstimateForm();
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Confirm inputs before running the engine. All numbers are computed server-side.
      </p>
      <dl className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-900/30">
        <ReviewRow label="Address" value={form.address || "—"} />
        <ReviewRow
          label="Coordinates"
          value={
            form.lat && form.lon
              ? `${form.lat}, ${form.lon}`
              : "—"
          }
        />
        <ReviewRow label="Radius" value={`${form.compRadius} km`} />
        <ReviewRow
          label="Property"
          value={`${form.propertyType} · ${form.subType} · ${form.sizeSqft} sqft · ${form.ageBucket}`}
        />
        <ReviewRow
          label="Legal"
          value={`${form.tenure}, title ${form.titleClarity}`}
        />
        <ReviewRow label="Occupancy" value={form.occupancy} />
      </dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="text-right text-neutral-900 dark:text-neutral-100">{value}</dd>
    </div>
  );
}
