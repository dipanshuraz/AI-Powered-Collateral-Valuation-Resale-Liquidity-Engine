import Link from "next/link";
import { LandingDetails } from "@/components/landing/LandingDetails";

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

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Problem 4a · Demo
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Collateral valuation &amp; resale liquidity
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          A structured, <strong className="font-medium text-neutral-800 dark:text-neutral-200">auditable rule engine</strong> for{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">market</strong> and{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">distress</strong> value{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">ranges</strong>, plus a{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">resale index</strong>,{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">time-to-liquidate</strong> band, and{" "}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">confidence</strong> — with optional listing
          comps in a radius you control.
        </p>

        <ul className="mt-10 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              <strong className="text-neutral-900 dark:text-neutral-100">End-to-end flow:</strong> location → property →
              details → review → results.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              <strong className="text-neutral-900 dark:text-neutral-100">Transparent math:</strong> circle-rate anchor,
              rule adjustments, Haversine comps (bundled seed + optional portals where you enable them).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              <strong className="text-neutral-900 dark:text-neutral-100">Built for demos:</strong> not a licensed
              appraisal or lending decision — integrate the API or use the wizard for tests and stakeholder walkthroughs.
            </span>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/estimate"
            className="inline-flex rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Begin full flow
          </Link>
        </div>

        <LandingDetails />
      </main>

      <footer className="border-t border-neutral-200 py-8 text-center text-[10px] leading-relaxed text-neutral-400 dark:border-neutral-800">
        <p>Demo — not financial, appraisal, or legal advice.</p>
        <p className="mt-1 max-w-xl mx-auto">
          Estimates depend on inputs and bundled data; real collateral decisions require licensed valuation and lender policy.
        </p>
      </footer>
    </div>
  );
}
