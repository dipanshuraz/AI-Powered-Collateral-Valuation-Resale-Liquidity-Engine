"use client";

import type { ReactNode } from "react";
import type { EstimateResponsePayload } from "@/lib/flow/types";
import { BRAND_NAME } from "@/lib/brand";
import { RESULT_METRIC_HELP } from "@/lib/copy/estimate-result-help";
import { fmtInr } from "@/lib/format";
import { ResultsExplainer } from "@/components/estimate/ResultsExplainer";
import { ResultInfoTip } from "@/components/estimate/ResultInfoTip";

export function ResultsPanel({ result }: { result: EstimateResponsePayload }) {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-4 sm:p-6 dark:border-neutral-700 dark:from-neutral-900/50 dark:to-neutral-950">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {BRAND_NAME} · collateral results
        </p>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          <MetricRow
            label="Market value"
            value={`${fmtInr(result.market_value_range[0])} – ${fmtInr(result.market_value_range[1])}`}
            info={RESULT_METRIC_HELP.market_value}
          />
          <MetricRow
            label="Distress value"
            value={`${fmtInr(result.distress_value_range[0])} – ${fmtInr(result.distress_value_range[1])}`}
            info={RESULT_METRIC_HELP.distress_value}
          />
          <MetricRow
            label="Resale index"
            value={String(result.resale_potential_index)}
            info={RESULT_METRIC_HELP.resale_index}
          />
          <MetricRow
            label="Time to sell (days)"
            value={`${result.estimated_time_to_sell_days[0]}–${result.estimated_time_to_sell_days[1]}`}
            info={RESULT_METRIC_HELP.time_to_sell}
          />
          <MetricRow
            label="Confidence"
            value={String(result.confidence_score)}
            info={RESULT_METRIC_HELP.confidence}
          />
          {result.infrastructure_proximity_index != null && (
            <MetricRow
              label="Infrastructure proximity index"
              value={`${result.infrastructure_proximity_index} / 100`}
              info={RESULT_METRIC_HELP.infra_index}
            />
          )}
          {result.neighbourhood_quality_score != null && (
            <MetricRow
              label="Neighbourhood quality score"
              value={`${result.neighbourhood_quality_score} / 100`}
              info={RESULT_METRIC_HELP.neighbourhood_score}
            />
          )}
          <MetricRow
            label="Comps"
            value={`${result.comps_used_count} · ${result.comp_radius_km} km`}
            info={RESULT_METRIC_HELP.comps}
          />
          {result.landmark_signals && result.landmark_signals.length > 0 && (
            <MetricRow
              label="Landmark signals"
              value={result.landmark_signals.join(", ")}
              info={RESULT_METRIC_HELP.landmark_signals}
            />
          )}
          {result.magicbricks_error && (
            <MetricRow
              label="MagicBricks error"
              value={result.magicbricks_error}
              info={RESULT_METRIC_HELP.magicbricks_error}
            />
          )}
          {result.portal_feed_errors &&
            Object.entries(result.portal_feed_errors).map(([k, v]) => (
              <MetricRow
                key={k}
                label={`${k} error`}
                value={v}
                info={RESULT_METRIC_HELP.portal_error}
              />
            ))}
        </dl>
      </div>

      <ResultsExplainer />

      <p className="text-[10px] text-neutral-400">
        assumptions_version: {result.assumptions_version}
      </p>
    </div>
  );
}

function MetricRow({
  label,
  value,
  info,
}: {
  label: string;
  value: string;
  info?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-3 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="flex min-w-0 max-w-full items-center gap-1.5 text-xs text-neutral-500">
        <span className="min-w-0">{label}</span>
        {info ? <ResultInfoTip label={label}>{info}</ResultInfoTip> : null}
      </dt>
      <dd className="min-w-0 max-w-full break-words text-left text-sm font-medium leading-snug text-neutral-900 tabular-nums sm:max-w-[min(100%,22rem)] sm:shrink-0 sm:text-right dark:text-neutral-100">
        {value}
      </dd>
    </div>
  );
}
