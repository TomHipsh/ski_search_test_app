import type { SkiSite, SkiSiteDataset, SkiSiteRepository } from '../../types.js';

export abstract class AbstractSkiSiteRepository<TSkiSite extends SkiSite = SkiSite>
  implements SkiSiteRepository<TSkiSite>
{
  protected constructor(public readonly namespace: string) {}

  abstract getAll: () => SkiSiteDataset<TSkiSite>;

  abstract findById: (id: number) => TSkiSite | undefined;

  abstract findByName: (name: string) => TSkiSite | undefined;
}
