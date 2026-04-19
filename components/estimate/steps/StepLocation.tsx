"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
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
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchOnMap = useCallback(async () => {
    const q = form.address.trim();
    if (q.length < 2) {
      setSearchError("Enter an address, area, or 6-digit PIN code first.");
      return;
    }
    setSearchBusy(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `/api/forward-geocode?q=${encodeURIComponent(q)}`
      );
      const data = (await res.json()) as {
        error?: string;
        lat?: string;
        lon?: string;
        display_name?: string;
      };
      if (!res.ok) {
        setSearchError(data.error ?? "Search failed");
        return;
      }
      if (!data.lat || !data.lon) {
        setSearchError("No coordinates returned");
        return;
      }
      setForm({
        lat: Number(data.lat).toFixed(6),
        lon: Number(data.lon).toFixed(6),
        address: data.display_name ?? q,
      });
    } catch {
      setSearchError("Network error — try again");
    } finally {
      setSearchBusy(false);
    }
  }, [form.address, setForm]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden">
      <p className="shrink-0 text-sm text-neutral-600 dark:text-neutral-400">
        Collateral location for circle-rate matching and comparable listings within radius. Search
        by address or Indian PIN code (anywhere in India), or tap / drag on the map.
      </p>

      <div className="w-full shrink-0">
        <LocationMapPicker
          lat={form.lat}
          lon={form.lon}
          onPositionChange={(next) => setForm(next)}
          onAddressResolved={(formattedAddress) => setForm({ address: formattedAddress })}
          variant="fullWidth"
        />
      </div>

      <div className="shrink-0 space-y-4">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Address or PIN code</Field.Label>
          <Field.Textarea
            className="field min-h-[2.75rem] resize-none"
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ address: e.target.value })}
            placeholder="e.g. MG Road Bengaluru, or 560001, or full address"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void searchOnMap();
              }
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={searchBusy}
              onClick={() => void searchOnMap()}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {searchBusy ? "Searching…" : "Search on map"}
            </button>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Uses Nominatim (India). PIN codes work outside Pune.
            </span>
          </div>
          {searchError && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400" role="status">
              {searchError}
            </p>
          )}
        </Field.Root>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
    </div>
  );
}
