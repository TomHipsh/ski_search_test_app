import type { HotelsSearchResponse, SkiSiteDataset } from '../repositories/types.js';

export type SkiHotelSearchRequest = {
  skiSiteName: string;
  startDate: string;
  endDate: string;
  groupSize: number;
};

export type SkiHotelSearchResponse = HotelsSearchResponse;

export type ValidationErrorResponse = {
  error: string;
  details: string[];
};

export type GetSkiSitesQuery = {
  namespace?: string;
};

export type GetSkiSitesResponse = SkiSiteDataset;
