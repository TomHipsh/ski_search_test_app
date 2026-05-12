export type SkiHotelSearchRequest = {
  skiSite: number;
  startDate: string;
  endDate: string;
  groupSize: number;
};

export type SkiHotelSearchResponse = {
  result: 'ok';
};

export type ValidationErrorResponse = {
  error: string;
  details: string[];
};
