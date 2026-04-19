"use client";

import dynamic from "next/dynamic";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

const OptionalAcknowledgmentSignature = dynamic(
  () =>
    import("@/components/estimate/OptionalAcknowledgmentSignature").then((m) => ({
      default: m.OptionalAcknowledgmentSignature,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        Loading optional tools…
      </p>
    ),
  }
);

const LAND_USE: Record<string, string> = {
  residential: "Residential",
  mixed_use: "Mixed-use",
  commercial_industrial: "Commercial / industrial",
};

const PLANNING: Record<string, string> = {
  planned: "Planned",
  unplanned: "Unplanned",
  mixed: "Mixed",
};

export function StepReview() {
  const { form, uploads } = useEstimateForm();
  const docSummary = [
    uploads.papers.length ? `${uploads.papers.length} paper(s)` : null,
    uploads.photosInternal.length ? `${uploads.photosInternal.length} internal photo(s)` : null,
    uploads.photosExternal.length ? `${uploads.photosExternal.length} external photo(s)` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Confirm inputs before running the engine. All numbers are computed server-side.
      </p>
      <OptionalAcknowledgmentSignature />
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
          label="Documents (counts only)"
          value={docSummary || "None selected"}
        />
        <ReviewRow
          label="Property"
          value={`${form.propertyType} · ${form.subType} · ${form.sizeSqft} sqft · ${form.ageBucket}`}
        />
        <ReviewRow
          label="Infra proximity (1–5)"
          value={`Metro ${form.infraMetro} · Rail ${form.infraRail} · Hwy ${form.infraHighway} · Hub ${form.infraCommercialHub} · School ${form.infraSchool} · Hospital ${form.infraHospital}`}
        />
        <ReviewRow
          label="Neighbourhood"
          value={`${LAND_USE[form.neighbourhoodLandUse] ?? form.neighbourhoodLandUse} · ${PLANNING[form.neighbourhoodPlanning] ?? form.neighbourhoodPlanning}`}
        />
        <ReviewRow
          label="Legal"
          value={`${form.tenure}, title ${form.titleClarity}`}
        />
        <ReviewRow label="Occupancy" value={form.occupancy} />
        {form.acknowledgmentSignatureDataUrl ? (
          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700 sm:flex-row sm:items-start sm:justify-between">
            <dt className="text-xs text-neutral-500">Acknowledgment</dt>
            <dd className="sm:max-w-[min(100%,280px)]">
              {/* Data-URL signatures: native img avoids next/image optimizer 500s */}
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic PNG data URL from signature pad */}
              <img
                src={form.acknowledgmentSignatureDataUrl}
                alt="Recorded acknowledgment signature"
                width={280}
                height={96}
                className="max-h-24 w-auto rounded border border-neutral-200 bg-white dark:border-neutral-600"
              />
            </dd>
          </div>
        ) : null}
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
