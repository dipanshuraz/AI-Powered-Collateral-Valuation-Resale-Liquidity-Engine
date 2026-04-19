"use client";

import type { ComponentType } from "react";
import type { EstimateFormState } from "@/lib/flow/types";
import { StepAdvanced } from "@/components/estimate/steps/StepAdvanced";
import { StepDocuments } from "@/components/estimate/steps/StepDocuments";
import { StepInfraNeighbourhood } from "@/components/estimate/steps/StepInfraNeighbourhood";
import { StepLocation } from "@/components/estimate/steps/StepLocation";
import { StepProperty } from "@/components/estimate/steps/StepProperty";
import { StepReview } from "@/components/estimate/steps/StepReview";

export type WizardStepConfig = {
  id: number;
  label: string;
  Component: ComponentType;
  /** Panel wrapper */
  contentClassName: string;
  /** When this returns non-null, linear navigation blocks Next and the message is shown. */
  validate?: (form: EstimateFormState) => string | null;
};

function validateLocation(form: EstimateFormState): string | null {
  const hasAddr = form.address.trim().length > 0;
  const lt = form.lat.trim() ? Number(form.lat) : NaN;
  const ln = form.lon.trim() ? Number(form.lon) : NaN;
  const hasCoords =
    !Number.isNaN(lt) &&
    !Number.isNaN(ln) &&
    lt >= -90 &&
    lt <= 90 &&
    ln >= -180 &&
    ln <= 180;
  if (!hasAddr && !hasCoords) {
    return "Enter an address for geocoding, or valid latitude and longitude.";
  }
  return null;
}

function validatePropertySize(form: EstimateFormState): string | null {
  const n = Number(form.sizeSqft);
  if (!form.sizeSqft.trim() || Number.isNaN(n) || n <= 0) {
    return "Enter a valid size in sqft.";
  }
  return null;
}

/** Single source of truth: order, labels, panels, validation. */
export const ESTIMATE_WIZARD_STEPS: readonly WizardStepConfig[] = [
  {
    id: 1,
    label: "Location",
    Component: StepLocation,
    contentClassName: "flex min-h-0 flex-1 flex-col overflow-hidden outline-none",
    validate: validateLocation,
  },
  {
    id: 2,
    label: "Documents",
    Component: StepDocuments,
    contentClassName:
      "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden outline-none",
  },
  {
    id: 3,
    label: "Property",
    Component: StepProperty,
    contentClassName:
      "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden outline-none",
    validate: validatePropertySize,
  },
  {
    id: 4,
    label: "Details",
    Component: StepAdvanced,
    contentClassName:
      "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden outline-none",
  },
  {
    id: 5,
    label: "Infra & area",
    Component: StepInfraNeighbourhood,
    contentClassName:
      "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden outline-none",
  },
  {
    id: 6,
    label: "Review",
    Component: StepReview,
    contentClassName:
      "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden outline-none",
  },
];

export const STEP_COUNT = ESTIMATE_WIZARD_STEPS.length;

/** Active “display” step index when showing results (all numbered steps complete). */
export const RESULT_DISPLAY_STEP = STEP_COUNT + 1;
