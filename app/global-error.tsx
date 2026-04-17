"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-4 text-neutral-100">
        <h1 className="text-lg font-semibold">Application error</h1>
        <p className="max-w-md text-center text-sm text-neutral-400">
          {error.message || "A critical error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
