"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@ark-ui/react/tooltip";

export function ResultInfoTip({
  label,
  children,
}: {
  /** Used for accessible name. */
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip.Root openDelay={180} closeDelay={80}>
      <Tooltip.Trigger
        type="button"
        className="inline-flex shrink-0 rounded-full p-0.5 text-neutral-400 transition hover:text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300"
        aria-label={`About ${label}`}
      >
        <InfoGlyph />
      </Tooltip.Trigger>
      <Tooltip.Positioner className="z-[200]">
        <Tooltip.Content className="max-h-[min(320px,50vh)] max-w-[min(calc(100vw-1.5rem),20rem)] overflow-y-auto rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left text-[11px] leading-relaxed text-neutral-700 shadow-lg dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200">
          {children}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

function InfoGlyph() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
