/**
 * Extra marketing / education blocks for the home page.
 * Wording follows common patterns from public valuation products: clear scope, methodology summary, and limitations.
 */
export function LandingDetails() {
  return (
    <div className="mt-16 space-y-16 border-t border-neutral-200 pt-16 dark:border-neutral-800">
      <section aria-labelledby="what-you-get">
        <h2
          id="what-you-get"
          className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          What you get
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Similar to how large portals show a <strong className="font-medium text-neutral-800 dark:text-neutral-200">home value estimate</strong> with
          caveats, Tenzor focuses on <strong className="font-medium text-neutral-800 dark:text-neutral-200">collateral</strong> for secured lending
          demos: transparent <strong className="font-medium text-neutral-800 dark:text-neutral-200">bands</strong>, not a single hidden number.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Market value range</dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              A model band for orderly sale conditions, anchored on circle-rate logic and comparable listings in your
              radius when available.
            </dd>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Distress value range</dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              A lower band that reflects liquidity and exit stress — useful for stress tests, not a fire-sale quote from a
              specific buyer.
            </dd>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Resale index &amp; time to sell</dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              A 0–100 liquidity-style score and a <strong className="font-medium text-neutral-800 dark:text-neutral-200">days</strong> range for
              illustrative exit timing, driven by comps density and rule-based liquidity rules.
            </dd>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Confidence &amp; comps</dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Confidence is an internal 0–1 score. Comps counts show how many seed or portal listings fell inside your
              Haversine radius for the run.
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="how-it-works">
        <h2
          id="how-it-works"
          className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          How the engine works
        </h2>
        <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <li>
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">Location</strong> — Geocode or map pin;
            match to illustrative circle-rate rows and tier fallbacks from bundled tables.
          </li>
          <li>
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">Property</strong> — Type, size, age, tenure,
            and optional context adjust the band off the benchmark.
          </li>
          <li>
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">Comparables</strong> — Seed JSON comps and
            optional listing feeds (where enabled and permitted) within a km radius; medians and blend rules stay
            deterministic.
          </li>
          <li>
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">Liquidity</strong> — Resale index, distress
            band, and time-to-sell range come from documented heuristics, not opaque ML pricing.
          </li>
        </ol>
      </section>

      <section aria-labelledby="limitations">
        <h2
          id="limitations"
          className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Limitations (read this)
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>
            This is a <strong className="text-neutral-800 dark:text-neutral-200">demo engine</strong>, not a licensed
            appraisal, broker price opinion, or credit decision. Real lenders use appraisals, legal diligence, and
            policy-specific AVM controls.
          </li>
          <li>
            Outputs depend on <strong className="text-neutral-800 dark:text-neutral-200">input quality and bundled seed data</strong>.
            Optional portal feeds may fail (cookies, rate limits, HTML responses) — the UI surfaces errors when that happens.
          </li>
          <li>
            Markets move daily; static tables and snapshot comps do not capture every micro-market shift. Use ranges as
            conversation starters, not transaction prices.
          </li>
        </ul>
      </section>
    </div>
  );
}
