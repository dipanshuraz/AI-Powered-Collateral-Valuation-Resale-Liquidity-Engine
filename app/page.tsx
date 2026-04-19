import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/LandingExperience";

export const metadata: Metadata = {
  title: "EstimateEngine | Collateral valuation & liquidity",
  description:
    "Range-based market and distress estimates, resale index, time-to-liquidate, infrastructure and neighbourhood indices — transparent rule engine for collateral demos.",
};

export default function HomePage() {
  return <LandingExperience />;
}
