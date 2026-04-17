import Link from "next/link";

export const metadata = {
  title: "Tenzor | Collateral valuation & liquidity",
  description:
    "Range-based market and distress estimates, resale index, and time-to-liquidate for property-backed collateral (demo).",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Tenzor
          </span>
          <Link
            href="/estimate"
            className="rounded-md bg-neutral-900 px-4 py-2 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Start estimate
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Problem 4a · Demo
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Collateral valuation &amp; resale liquidity
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          A structured engine for <strong className="font-medium text-neutral-800 dark:text-neutral-200">market</strong> and{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">distress</strong> value ranges, a{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">resale index</strong>,{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">time-to-liquidate</strong>, confidence, drivers, and risk flags — with optional listing comps and AI narrative.
        </p>

        <ul className="mt-10 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              <strong className="text-neutral-900 dark:text-neutral-100">End-to-end flow:</strong> location → property → details → review → results.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              Circle-rate anchor, rule adjustments, Haversine comps (seed + optional portals).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              Not a licensed appraisal — estimates for demonstration and integration testing only.
            </span>
          </li>
        </ul>

        <div className="mt-12">
          <Link
            href="/estimate"
            className="inline-flex rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Begin full flow
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-8 text-center text-[10px] text-neutral-400 dark:border-neutral-800">
        Demo — not financial or legal advice.
      </footer>
    </div>
  );
}
