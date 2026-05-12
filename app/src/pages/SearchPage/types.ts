export type SkiSite = {
  id: number;
  name: string;
  namespace: string;
};

export type HotelSearchResult = {
  hotelCode: string;
  hotelName: string;
  rating: number;
  contentImageLink: string;
  skiSite: number;
  groupSize: number;
  totalPrice: number;
};

export type SearchHotelsRequest = {
  skiSiteName: string;
  startDate: string;
  endDate: string;
  groupSize: number;
};

export type SearchFormState = {
  siteName: string;
  groupSize: string;
  startDate: string;
  endDate: string;
};
