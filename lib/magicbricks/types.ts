/** Raw shapes from MagicBricks `propertySearch` JSON (subset). */
export type MbResultItem = {
  id?: string;
  price?: number;
  carpetArea?: string;
  ltcoordGeo?: string;
  pmtLat?: number;
  pmtLong?: number;
  landmarkDetails?: string[];
  lmtDName?: string;
  ctName?: string;
  prjname?: string;
};

export type MbSearchResponse = {
  resultList?: MbResultItem[] | null;
  editAdditionalDataBean?: unknown;
};
