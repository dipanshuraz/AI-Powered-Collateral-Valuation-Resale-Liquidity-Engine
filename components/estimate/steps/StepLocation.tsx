"use client";

import dynamic from "next/dynamic";
import { Field } from "@ark-ui/react/field";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

const LocationMapPicker = dynamic(
  () =>
    import("@/components/estimate/LocationMapPicker").then(
      (m) => m.LocationMapPicker
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[240px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
        aria-hidden
      />
    ),
  }
);

export function StepLocation() {
  const { form, setForm } = useEstimateForm();
  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Collateral location for circle-rate matching and comparable listings within
        radius.
      </p>

      <LocationMapPicker
        lat={form.lat}
        lon={form.lon}
        onPositionChange={(next) => setForm(next)}
        onAddressResolved={(formattedAddress) => setForm({ address: formattedAddress })}
      />

      <Field.Root>
        <Field.Label className="text-xs text-neutral-500">Address</Field.Label>
        <Field.Textarea
          className="field min-h-[2.75rem] resize-none"
          rows={2}
          value={form.address}
          onChange={(e) => setForm({ address: e.target.value })}
          placeholder="Area, city, state — or pick on the map above"
        />
      </Field.Root>
      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Latitude</Field.Label>
          <Field.Input
            className="field font-mono text-xs"
            value={form.lat}
            onChange={(e) => setForm({ lat: e.target.value })}
            placeholder="18.5596"
          />
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Longitude</Field.Label>
          <Field.Input
            className="field font-mono text-xs"
            value={form.lon}
            onChange={(e) => setForm({ lon: e.target.value })}
            placeholder="73.7868"
          />
        </Field.Root>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Comp radius (km)</Field.Label>
          <Field.Input
            type="number"
            min={0.5}
            max={50}
            step={0.5}
            className="field"
            value={form.compRadius}
            onChange={(e) => setForm({ compRadius: e.target.value })}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">
            City tier fallback (1–3)
          </Field.Label>
          <Field.Input
            type="number"
            min={1}
            max={3}
            className="field"
            value={form.cityTier}
            onChange={(e) => setForm({ cityTier: e.target.value })}
            placeholder="if no city match"
          />
        </Field.Root>
      </div>
    </div>
  );
}
