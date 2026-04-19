"use client";

import { BRAND_NAME } from "@/lib/brand";

/**
 * Expanded definitions for results — how to read bands, indices, and optional rows.
 */
export function ResultsExplainer() {
  return (
    <details
      open
      className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/30"
    >
      <summary className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Understanding these numbers
      </summary>
      <div className="space-y-6 border-t border-neutral-200 px-4 pb-5 pt-4 text-xs leading-relaxed text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <p className="text-[13px] text-neutral-700 dark:text-neutral-300">
          {BRAND_NAME} outputs are produced by a <strong className="font-medium text-neutral-900 dark:text-neutral-100">transparent rule engine</strong> (circle-rate tables, property adjustments, comparable listings in your chosen radius, liquidity heuristics). They are{" "}
          <strong className="font-medium text-neutral-900 dark:text-neutral-100">ranges and indices</strong>, not a single “true” price and not a substitute for a licensed appraisal or a lender’s own policy. Use the <strong className="font-medium text-neutral-900 dark:text-neutral-100">info icons</strong> next to each line in the results card for short definitions.
        </p>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Core outputs
          </h3>
          <ul className="mt-2 list-none space-y-3">
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Market value range (₹ min–max)</strong>
              <p className="mt-1 pl-0">
                A band for an <em>orderly</em> sale under the model: anchored on statutory/illustrative circle-rate logic, blended with comparable ₹/sqft where listings exist in radius, then adjusted for property attributes. The spread reflects model uncertainty — not your listing price or a bank’s approved value.
              </p>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Distress value range (₹ min–max)</strong>
              <p className="mt-1">
                A lower band that applies a <em>liquidity discount</em> to the market band — useful for stress scenarios (“if we had to exit quickly”). It does not predict an actual auction or buyer bid.
              </p>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Resale potential index (0–100)</strong>
              <p className="mt-1">
                A single score summarizing how easily the model expects the asset class and micro-market context to resell, relative to other runs — <strong className="font-medium text-neutral-800 dark:text-neutral-200">not</strong> a credit score, ESG score, or regulatory metric.
              </p>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Time to sell (days, min–max)</strong>
              <p className="mt-1">
                An illustrative calendar window from rule-based liquidity (comps density, resale index, property type). Use it for directional planning only; real time-on-market depends on pricing, marketing, and macro conditions.
              </p>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Confidence (0–1)</strong>
              <p className="mt-1">
                An internal score for how much <em>evidence</em> this run had: e.g. location resolved to a city row, enough comps in radius, fewer portal failures. Low confidence does not mean “bad asset” — it often means thin data or optional feeds did not respond.
              </p>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Comps (count · km)</strong>
              <p className="mt-1">
                Number of comparable listings that contributed inside your <strong className="font-medium text-neutral-800 dark:text-neutral-200">comp radius</strong>. Fewer comps usually means wider bands and lower confidence. Seed data and optional portal listings are combined where enabled.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Optional rows (when shown)
          </h3>
          <ul className="mt-2 list-disc space-y-2 pl-4">
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Landmark signals</strong> — Coarse amenity hints when portal comp payloads include landmark metadata; they nudge the model slightly and are not a full GIS study.
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">Portal / MagicBricks errors</strong> — Fetch or parse failed (cookies missing, HTML instead of JSON, rate limits). The engine still returns an estimate using seed comps and circle-rate logic when possible.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            How to use this responsibly
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-4">
            <li>Treat outputs as <strong className="font-medium text-neutral-800 dark:text-neutral-200">demo / pre-qualification</strong> material for workshops and integration tests.</li>
            <li>Do not use as sole collateral evidence for credit approval, regulatory filings, or legal disputes.</li>
            <li>Refresh inputs when location, size, or market conditions change; ranges are point-in-time.</li>
          </ul>
        </section>

        <p className="border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 dark:border-neutral-600 dark:text-neutral-500">
          Institutional lending and appraisal workflows require licensed valuations, documented inspections, and compliance with local law — beyond what this tool provides.
        </p>
      </div>
    </details>
  );
}
