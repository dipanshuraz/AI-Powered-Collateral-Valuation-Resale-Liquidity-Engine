import type { Metadata } from "next";
import { EstimateFormProvider } from "@/contexts/EstimateFormContext";
import { AppShell } from "@/components/layout/AppShell";
import { EstimateWizard } from "@/components/estimate/EstimateWizard";

export const metadata: Metadata = {
  title: "New estimate",
  description: "Collateral valuation and liquidity estimate flow.",
};

export default function EstimatePage() {
  return (
    <EstimateFormProvider>
      <AppShell title="Collateral estimate">
        <div className="flex min-h-0 flex-1 flex-col">
          <EstimateWizard />
        </div>
      </AppShell>
    </EstimateFormProvider>
  );
}
