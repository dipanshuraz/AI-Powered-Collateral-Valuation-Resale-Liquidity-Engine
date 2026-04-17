"use client";

import type { EstimateResponsePayload } from "@/lib/flow/types";
import { fmtInr } from "@/lib/format";

export function ResultsPanel({ result }: { result: EstimateResponsePayload }) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-6 dark:border-neutral-700 dark:from-neutral-900/50 dark:to-neutral-950">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Estimate
        </p>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          <Row
            label="Market value"
            value={`${fmtInr(result.market_value_range[0])} – ${fmtInr(result.market_value_range[1])}`}
          />
          <Row
            label="Distress value"
            value={`${fmtInr(result.distress_value_range[0])} – ${fmtInr(result.distress_value_range[1])}`}
          />
          <Row label="Resale index" value={String(result.resale_potential_index)} />
          <Row
            label="Time to sell (days)"
            value={`${result.estimated_time_to_sell_days[0]}–${result.estimated_time_to_sell_days[1]}`}
          />
          <Row label="Confidence" value={String(result.confidence_score)} />
          <Row
            label="Comps"
            value={`${result.comps_used_count} · ${result.comp_radius_km} km`}
          />
          {result.comps_breakdown && (
            <Row
              label="Comps split"
              value={[
                `seed ${result.comps_breakdown.seed_in_radius}`,
                `MB ${result.comps_breakdown.magicbricks_in_radius}`,
                result.comps_breakdown.magicbricks_raw_fetched != null
                  ? `MB raw ${result.comps_breakdown.magicbricks_raw_fetched}`
                  : null,
                result.comps_breakdown.acres99_in_radius != null
                  ? `99acres ${result.comps_breakdown.acres99_in_radius}`
                  : null,
                result.comps_breakdown.housing_in_radius != null
                  ? `H ${result.comps_breakdown.housing_in_radius}`
                  : null,
                result.comps_breakdown.nobroker_in_radius != null
                  ? `NB ${result.comps_breakdown.nobroker_in_radius}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          )}
          {result.landmark_signals && result.landmark_signals.length > 0 && (
            <Row
              label="Landmark signals"
              value={result.landmark_signals.join(", ")}
            />
          )}
          {result.magicbricks_error && (
            <Row label="MagicBricks error" value={result.magicbricks_error} />
          )}
          {result.portal_feed_errors &&
            Object.entries(result.portal_feed_errors).map(([k, v]) => (
              <Row key={k} label={`${k} error`} value={v} />
            ))}
        </dl>
      </div>

      {result.resolved_location && (
        <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
          {JSON.stringify(result.resolved_location, null, 2)}
        </pre>
      )}

      <div>
        <p className="text-xs font-medium text-neutral-500">Drivers</p>
        <ul className="mt-2 list-inside list-disc text-sm text-neutral-800 dark:text-neutral-200">
          {result.key_drivers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium text-neutral-500">Risk flags</p>
        <ul className="mt-2 list-inside list-disc text-sm text-neutral-800 dark:text-neutral-200">
          {result.risk_flags.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      {result.ai_summary && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
            AI summary
          </p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{result.ai_summary}</p>
        </div>
      )}

      <details className="rounded-lg border border-neutral-200 dark:border-neutral-700">
        <summary className="cursor-pointer px-4 py-3 text-xs text-neutral-500">
          Raw JSON
        </summary>
        <pre className="max-h-80 overflow-auto border-t border-neutral-200 p-4 font-mono text-[10px] dark:border-neutral-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>

      <p className="text-[10px] text-neutral-400">
        assumptions_version: {result.assumptions_version}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
      <dt className="shrink-0 text-xs text-neutral-500">{label}</dt>
      <dd className="max-w-[65%] text-right text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-100">
        {value}
      </dd>
    </div>
  );
}
