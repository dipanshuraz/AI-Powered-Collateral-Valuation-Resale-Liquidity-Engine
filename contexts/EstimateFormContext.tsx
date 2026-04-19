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
import type {
  CollateralUploads,
  EstimateFormState,
  EstimateResponsePayload,
} from "@/lib/flow/types";

const emptyUploads = (): CollateralUploads => ({
  papers: [],
  photosInternal: [],
  photosExternal: [],
});

type Ctx = {
  form: EstimateFormState;
  setForm: (patch: Partial<EstimateFormState>) => void;
  /** Client-only uploads (counts sent to API; files stay in browser). */
  uploads: CollateralUploads;
  setUploads: (u: CollateralUploads | ((prev: CollateralUploads) => CollateralUploads)) => void;
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
  const [uploads, setUploads] = useState<CollateralUploads>(emptyUploads);
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
    setUploads(emptyUploads());
    setAcknowledgmentPadKey((k) => k + 1);
    setActiveStep(1);
    setResult(null);
    setError(null);
  }, []);

  const submitEstimate = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const body = buildEstimateBody(form, uploads);
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
  }, [form, uploads]);

  const value = useMemo(
    () => ({
      form,
      setForm,
      uploads,
      setUploads,
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
      uploads,
      setUploads,
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
