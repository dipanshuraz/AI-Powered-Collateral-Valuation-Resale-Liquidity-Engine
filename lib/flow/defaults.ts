import type { EstimateFormState } from "@/lib/flow/types";

export const PUNE_DEFAULT_ADDRESS = "Baner, Pune, Maharashtra";
export const PUNE_DEFAULT_LAT = "18.5596";
export const PUNE_DEFAULT_LON = "73.7868";

export function getDefaultFormState(): EstimateFormState {
  return {
    address: PUNE_DEFAULT_ADDRESS,
    lat: PUNE_DEFAULT_LAT,
    lon: PUNE_DEFAULT_LON,
    cityTier: "",
    compRadius: "8",
    propertyType: "residential",
    subType: "apartment",
    sizeSqft: "1200",
    ageBucket: "mid",
    floor: "",
    hasLift: true,
    titleClarity: "clear",
    tenure: "freehold",
    occupancy: "self_occupied",
    yieldPct: "",
    mbEnabled: false,
    mbCityId: "4378",
    mbLocalityId: "82346",
    mbSearchUrl: "",
    feed99Enabled: false,
    feed99Url: "",
    housingFeedEnabled: false,
    housingFeedUrl: "",
    nobrokerFeedEnabled: false,
    nobrokerFeedUrl: "",
    locationNotes: "",
    legalNotes: "",
    docsSummary: "",
    acknowledgmentSignatureDataUrl: "",
  };
}
