"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildEstimateBody } from "@/lib/flow/build-estimate-body";
import { getDefaultFormState } from "@/lib/flow/defaults";
import type { EstimateFormState, EstimateResponsePayload } from "@/lib/flow/types";

type Ctx = {
  form: EstimateFormState;
  setForm: (patch: Partial<EstimateFormState>) => void;
  /** Bumps when the flow resets so optional signature pad state remounts cleanly. */
  acknowledgmentPadKey: number;
  activeStep: number;
  setActiveStep: (n: number) => void;
  isSubmitting: boolean;
  result: EstimateResponsePayload | null;
  error: string | null;
  clearError: () => void;
  submitEstimate: () => Promise<void>;
  resetFlow: () => void;
};

const EstimateFormContext = createContext<Ctx | null>(null);

export function EstimateFormProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<EstimateFormState>(getDefaultFormState);
  const [acknowledgmentPadKey, setAcknowledgmentPadKey] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EstimateResponsePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setForm = useCallback((patch: Partial<EstimateFormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const resetFlow = useCallback(() => {
    setFormState(getDefaultFormState());
    setAcknowledgmentPadKey((k) => k + 1);
    setActiveStep(1);
    setResult(null);
    setError(null);
  }, []);

  const submitEstimate = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const body = buildEstimateBody(form);
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        error?: string;
      } & Partial<EstimateResponsePayload>;
      if (!res.ok) {
        setError(String(json.error ?? "Request failed"));
        setResult(null);
        return;
      }
      setResult(json as EstimateResponsePayload);
    } catch {
      setError("Network error");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const value = useMemo(
    () => ({
      form,
      setForm,
      acknowledgmentPadKey,
      activeStep,
      setActiveStep,
      isSubmitting,
      result,
      error,
      clearError,
      submitEstimate,
      resetFlow,
    }),
    [
      form,
      setForm,
      acknowledgmentPadKey,
      activeStep,
      isSubmitting,
      result,
      error,
      clearError,
      submitEstimate,
      resetFlow,
    ]
  );

  return (
    <EstimateFormContext.Provider value={value}>
      {children}
    </EstimateFormContext.Provider>
  );
}

export function useEstimateForm() {
  const x = useContext(EstimateFormContext);
  if (!x) throw new Error("useEstimateForm must be inside EstimateFormProvider");
  return x;
}
