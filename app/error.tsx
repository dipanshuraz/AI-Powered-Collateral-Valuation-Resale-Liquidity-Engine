"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-neutral-600 dark:text-neutral-400">
        {error.message || "An unexpected error occurred while rendering this page."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        Try again
      </button>
    </div>
  );
}
