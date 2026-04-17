"use client";

/**
 * Collapsible definitions for results — mirrors how consumer valuation sites explain bands vs. appraisals.
 */
export function ResultsExplainer() {
  return (
    <details className="rounded-lg border border-neutral-200 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/30">
      <summary className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300">
        Understanding these numbers
      </summary>
      <div className="space-y-4 border-t border-neutral-200 px-4 pb-4 pt-3 text-xs leading-relaxed text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Market value range</strong> — Model band for an orderly
          sale, anchored on circle-rate logic and comps in your radius. Not a list price or guarantee.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Distress value range</strong> — Lower band reflecting
          liquidity stress; useful for stress tests, not a bid from a specific buyer.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Resale index (0–100)</strong> — Higher suggests easier
          exit under the model; it is not a credit score.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Time to sell (days)</strong> — Illustrative exit
          window from rule-based liquidity, not a listing commitment.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Confidence</strong> — Internal 0–1 score for how
          much evidence the run had (comps, location resolution, etc.).
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Comps</strong> — Count of comparable listings used
          inside your km radius (seed data ± optional feeds). Thin markets widen uncertainty.
        </p>
        <p className="border-t border-neutral-200 pt-3 text-[10px] text-neutral-500 dark:border-neutral-600 dark:text-neutral-500">
          Demo only — not an appraisal or lending advice. Institutional workflows use licensed valuations and compliance
          checks beyond this tool.
        </p>
      </div>
    </details>
  );
}
