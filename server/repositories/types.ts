export type SkiSite = {
  id: number;
  name: string;
  namespace: string;
};

export type SkiSiteDataset<TSkiSite extends SkiSite = SkiSite> = readonly TSkiSite[];

export type Hotel = {
  hotelCode: string;
  hotelName: string;
  rating: number;
  contentImageLink: string;
  skiSite: number;
  groupSize: number;
  totalPrice: number;
};

export type HotelsSearchRequest = {
  skiSite: number;
  startDate: string;
  endDate: string;
  groupSize: number;
};

export type HotelsSearchResponse = readonly Hotel[];

export type SkiSiteRepository<TSkiSite extends SkiSite = SkiSite> = {
  namespace: string;
  getAll: () => SkiSiteDataset<TSkiSite>;
  findById: (id: number) => TSkiSite | undefined;
  findByName: (name: string) => TSkiSite | undefined;
};

export enum SitesNamespaces {
  local = 'local',
}

export enum HotelVendors {
  WeSki = 'WeSki',
}
