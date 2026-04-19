"use client";

import { ESTIMATE_WIZARD_STEPS } from "@/components/estimate/wizard-steps";

type Props = {
  activeStep: number;
};

export function WizardStepPanels({ activeStep }: Props) {
  const config = ESTIMATE_WIZARD_STEPS[activeStep - 1];
  if (!config) return null;

  const { Component, contentClassName } = config;

  return (
    <div className={contentClassName}>
      <Component />
    </div>
  );
}
