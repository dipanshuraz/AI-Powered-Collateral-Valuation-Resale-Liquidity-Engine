"use client";

import { Collapsible } from "@ark-ui/react/collapsible";
import { SignaturePad } from "@ark-ui/react/signature-pad";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

/**
 * Ark UI signature pad, shown only when the user expands this section (lazy UX + smaller initial paint).
 * Captured PNG data URL is kept in form state for review display only — not sent to `/api/estimate`.
 */
export function OptionalAcknowledgmentSignature() {
  const { form, setForm, acknowledgmentPadKey } = useEstimateForm();

  return (
    <Collapsible.Root
      defaultOpen={false}
      lazyMount
      className="rounded-lg border border-neutral-200 dark:border-neutral-700"
    >
      <Collapsible.Trigger className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-medium text-neutral-700 outline-none hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50">
        Optional: record acknowledgment
        <span className="text-neutral-400" aria-hidden>
          ▾
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content className="border-t border-neutral-200 px-3 pb-3 pt-2 dark:border-neutral-700">
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          For demos or internal sign-off: sign to confirm you have reviewed the inputs. This stays in the browser
          and is not submitted with the estimate request.
        </p>
        <SignaturePad.Root
          key={acknowledgmentPadKey}
          id="estimate-acknowledgment"
          name="estimate_acknowledgment"
          drawing={{
            fill: "#0f172a",
            size: 2,
            simulatePressure: true,
          }}
          translations={{
            control: "Draw your signature in the box",
            clearTrigger: "Clear signature",
          }}
          onDrawEnd={async ({ paths, getDataUrl }) => {
            if (paths.length === 0) {
              setForm({ acknowledgmentSignatureDataUrl: "" });
              return;
            }
            const url = await getDataUrl("image/png");
            setForm({ acknowledgmentSignatureDataUrl: url });
          }}
          className="space-y-2"
        >
          <SignaturePad.Label className="sr-only">Acknowledgment signature</SignaturePad.Label>
          <SignaturePad.Control className="relative h-36 w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900/60">
            <SignaturePad.Guide className="pointer-events-none absolute bottom-6 left-3 right-3 border-b border-dashed border-neutral-300 dark:border-neutral-600" />
            <SignaturePad.Segment />
          </SignaturePad.Control>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SignaturePad.ClearTrigger
              type="button"
              className="text-xs font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
            >
              Clear
            </SignaturePad.ClearTrigger>
            {form.acknowledgmentSignatureDataUrl ? (
              <span className="text-xs text-emerald-700 dark:text-emerald-400">Captured</span>
            ) : null}
          </div>
          <SignaturePad.HiddenInput value={form.acknowledgmentSignatureDataUrl} />
        </SignaturePad.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
