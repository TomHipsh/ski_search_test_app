import { AbstractSkiSiteRepository } from './skiSiteRepository.js';
import type { SkiSite, SkiSiteDataset } from '../../types.js';

export class InMemorySkiSiteRepository<
  TSkiSite extends SkiSite = SkiSite,
> extends AbstractSkiSiteRepository<TSkiSite> {
  constructor(
    namespace: string,
    private readonly dataset: SkiSiteDataset<TSkiSite>,
  ) {
    super(namespace);
  }

  getAll = (): SkiSiteDataset<TSkiSite> => {
    return this.dataset;
  };

  findById = (id: number): TSkiSite | undefined => {
    return this.dataset.find((skiSite) => skiSite.id === id);
  };

  findByName = (name: string): TSkiSite | undefined => {
    return this.dataset.find((skiSite) => skiSite.name === name);
  };
}
