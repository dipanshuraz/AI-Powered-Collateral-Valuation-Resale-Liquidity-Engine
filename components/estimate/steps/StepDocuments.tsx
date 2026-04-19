"use client";

import { Field } from "@ark-ui/react/field";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

function fileListLabel(files: File[], empty: string) {
  if (files.length === 0) return empty;
  return `${files.length} file${files.length === 1 ? "" : "s"}: ${files.map((f) => f.name).join(", ")}`;
}

export function StepDocuments() {
  const { uploads, setUploads } = useEstimateForm();

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Upload papers (PDFs) and internal / external photos. Files stay in your browser; only
        counts are sent with the estimate to improve confidence.
      </p>

      <div className="space-y-5 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-700 dark:bg-neutral-900/30">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Papers (PDF)</Field.Label>
          <Field.Input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="field text-xs file:mr-3 file:rounded file:border-0 file:bg-neutral-200 file:px-2 file:py-1 file:text-xs dark:file:bg-neutral-700"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setUploads((p) => ({ ...p, papers: files }));
            }}
          />
          <p className="mt-1 text-[11px] text-neutral-500">
            {fileListLabel(uploads.papers, "No papers selected.")}
          </p>
        </Field.Root>

        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Internal photos</Field.Label>
          <Field.Input
            type="file"
            accept="image/*"
            multiple
            className="field text-xs file:mr-3 file:rounded file:border-0 file:bg-neutral-200 file:px-2 file:py-1 file:text-xs dark:file:bg-neutral-700"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setUploads((p) => ({ ...p, photosInternal: files }));
            }}
          />
          <p className="mt-1 text-[11px] text-neutral-500">
            {fileListLabel(uploads.photosInternal, "No internal photos selected.")}
          </p>
        </Field.Root>

        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">External photos</Field.Label>
          <Field.Input
            type="file"
            accept="image/*"
            multiple
            className="field text-xs file:mr-3 file:rounded file:border-0 file:bg-neutral-200 file:px-2 file:py-1 file:text-xs dark:file:bg-neutral-700"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setUploads((p) => ({ ...p, photosExternal: files }));
            }}
          />
          <p className="mt-1 text-[11px] text-neutral-500">
            {fileListLabel(uploads.photosExternal, "No external photos selected.")}
          </p>
        </Field.Root>
      </div>
    </div>
  );
}
