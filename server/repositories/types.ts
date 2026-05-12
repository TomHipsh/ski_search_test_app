export type SkiSite = {
  id: number;
  name: string;
  namespace: string;
};

export type SkiSiteDataset<TSkiSite extends SkiSite = SkiSite> = readonly TSkiSite[];

export type SkiSiteRepository<TSkiSite extends SkiSite = SkiSite> = {
  namespace: string;
  getAll: () => SkiSiteDataset<TSkiSite>;
  findById: (id: number) => TSkiSite | undefined;
  findByName: (name: string) => TSkiSite | undefined;
};

export enum SitesNamespaces {
  local = "local"
};
