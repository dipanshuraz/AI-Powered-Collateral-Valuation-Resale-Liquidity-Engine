"use client";

import { useEstimateForm } from "@/contexts/EstimateFormContext";
import type { EstimateFormState } from "@/lib/flow/types";

function infraLevelToNumber(value: string): number {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return 3;
  return Math.min(5, n);
}

const LAND_USE: {
  value: EstimateFormState["neighbourhoodLandUse"];
  label: string;
  sub: string;
}[] = [
  { value: "residential", label: "Residential", sub: "Mostly housing" },
  { value: "mixed_use", label: "Mixed-use", sub: "Retail + homes" },
  { value: "commercial_industrial", label: "Commercial / industrial", sub: "Workshops, offices" },
];

const PLANNING: {
  value: EstimateFormState["neighbourhoodPlanning"];
  label: string;
  sub: string;
}[] = [
  { value: "planned", label: "Planned", sub: "Layouts / notified" },
  { value: "unplanned", label: "Unplanned", sub: "Organic growth" },
  { value: "mixed", label: "Mixed", sub: "Both patterns" },
];

export function StepInfraNeighbourhood() {
  const { form, setForm } = useEstimateForm();

  return (
    <div className="w-full min-w-0 space-y-8">
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            Infrastructure proximity
          </strong>{" "}
          — distance to metro, rail, highways, commercial hubs, schools, and hospitals.           Strong driver of
          price and resale. Use the slider:{" "}
          <span className="whitespace-nowrap text-neutral-500">1 = far</span> →{" "}
          <span className="whitespace-nowrap text-neutral-500">5 = closest / best access</span>.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ProximityRow
            label="Metro"
            value={form.infraMetro}
            onChange={(v) => setForm({ infraMetro: v })}
          />
          <ProximityRow
            label="Rail"
            value={form.infraRail}
            onChange={(v) => setForm({ infraRail: v })}
          />
          <ProximityRow
            label="Highway / arterial"
            value={form.infraHighway}
            onChange={(v) => setForm({ infraHighway: v })}
          />
          <ProximityRow
            label="Commercial hub"
            value={form.infraCommercialHub}
            onChange={(v) => setForm({ infraCommercialHub: v })}
          />
          <ProximityRow
            label="School"
            value={form.infraSchool}
            onChange={(v) => setForm({ infraSchool: v })}
          />
          <ProximityRow
            label="Hospital"
            value={form.infraHospital}
            onChange={(v) => setForm({ infraHospital: v })}
          />
        </div>
      </div>

      <div className="min-w-0 border-t border-neutral-200 pt-8 dark:border-neutral-700">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            Neighbourhood quality
          </strong>{" "}
          — land use character and planning regime (residential vs mixed-use vs industrial; planned vs
          unplanned). Pick the best match.
        </p>

        <div className="mt-5 space-y-6">
          <div>
            <p className="text-xs font-medium text-neutral-500">Land use</p>
            <div
              className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Land use"
            >
              {LAND_USE.map((opt) => (
                <NeighbourhoodChip
                  key={opt.value}
                  selected={form.neighbourhoodLandUse === opt.value}
                  title={opt.label}
                  subtitle={opt.sub}
                  onClick={() => setForm({ neighbourhoodLandUse: opt.value })}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">Planning</p>
            <div
              className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Planning"
            >
              {PLANNING.map((opt) => (
                <NeighbourhoodChip
                  key={opt.value}
                  selected={form.neighbourhoodPlanning === opt.value}
                  title={opt.label}
                  subtitle={opt.sub}
                  onClick={() => setForm({ neighbourhoodPlanning: opt.value })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProximityRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `prox-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const n = infraLevelToNumber(value);

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300" htmlFor={id}>
          {label}
        </label>
        <span className="shrink-0 text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500">
          {`${n}/5`}
        </span>
      </div>
      <div className="space-y-1">
        <input
          id={id}
          type="range"
          min={1}
          max={5}
          step={1}
          value={n}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} proximity`}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={n}
          className="h-2.5 w-full cursor-pointer touch-manipulation accent-emerald-600 dark:accent-emerald-500"
        />
        <div
          className="flex justify-between px-0.5 text-[10px] leading-none text-neutral-500 dark:text-neutral-400"
          aria-hidden
        >
          <span>Far</span>
          <span>Avg</span>
          <span>Best</span>
        </div>
      </div>
    </div>
  );
}

function NeighbourhoodChip({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={
        selected
          ? "flex w-full min-w-0 flex-col rounded-xl border-2 border-emerald-600 bg-emerald-600/10 px-3 py-3 text-left transition dark:border-emerald-500 dark:bg-emerald-950/35 sm:px-4"
          : "flex w-full min-w-0 flex-col rounded-xl border border-neutral-200 bg-white/60 px-3 py-3 text-left transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/40 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/70 sm:px-4"
      }
    >
      <span
        className={
          selected
            ? "text-sm font-semibold text-emerald-900 dark:text-emerald-100"
            : "text-sm font-medium text-neutral-800 dark:text-neutral-100"
        }
      >
        {title}
      </span>
      <span className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">{subtitle}</span>
    </button>
  );
}
