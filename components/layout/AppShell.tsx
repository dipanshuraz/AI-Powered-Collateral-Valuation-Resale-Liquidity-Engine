import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="shrink-0 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            <span>{BRAND_NAME.replace("Engine", "")}</span>
            <span className="text-emerald-600 dark:text-emerald-400">Engine</span>
          </Link>
          <nav className="flex items-center gap-4 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-800 dark:hover:text-neutral-200">
              Home
            </Link>
            <Link
              href="/estimate"
              className="hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              New estimate
            </Link>
          </nav>
        </div>
        {title && (
          <div className="mx-auto max-w-3xl shrink-0 px-4 pb-3 pt-1 sm:px-6">
            <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              {title}
            </h1>
          </div>
        )}
      </header>
      <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col min-h-0 px-4 py-4 sm:px-6 sm:py-5">
        {children}
      </main>
      <footer className="shrink-0 border-t border-neutral-200 py-5 text-center text-[10px] leading-relaxed text-neutral-400 dark:border-neutral-800 sm:py-6">
        <p>Demo — not financial, appraisal, or legal advice.</p>
        <p className="mt-1 max-w-lg mx-auto">
          Outputs are ranges from a rule engine; not a substitute for licensed valuation or credit decisions.
        </p>
      </footer>
    </div>
  );
}
