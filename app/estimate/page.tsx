import { EstimateFormProvider } from "@/contexts/EstimateFormContext";
import { AppShell } from "@/components/layout/AppShell";
import { EstimateWizard } from "@/components/estimate/EstimateWizard";

export const metadata = {
  title: "New estimate",
  description: "Collateral valuation and liquidity estimate flow.",
};

export default function EstimatePage() {
  return (
    <EstimateFormProvider>
      <AppShell title="Collateral estimate">
        <EstimateWizard />
      </AppShell>
    </EstimateFormProvider>
  );
}
