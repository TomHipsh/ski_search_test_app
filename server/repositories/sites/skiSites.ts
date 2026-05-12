import { InMemorySkiSiteRepository } from './implementations/inMemorySkiSiteRepository.js';
import { SitesNamespaces } from '../types.js';
import type { SkiSiteDataset } from '../types.js';

const namespace = SitesNamespaces.local;

const skiSites = [
  {
    id: 1,
    name: 'Val Thorens',
    namespace,
  },
  {
    id: 2,
    name: 'Courchevel',
    namespace,
  },
  {
    id: 3,
    name: 'Tignes',
    namespace,
  },
  {
    id: 4,
    name: 'La Plagne',
    namespace,
  },
  {
    id: 5,
    name: 'Chamonix',
    namespace,
  },
] as const satisfies SkiSiteDataset;

export const skiSiteRepository = new InMemorySkiSiteRepository(
  namespace,
  skiSites,
);

const skiSiteRepositories = new Map([
  [skiSiteRepository.namespace, skiSiteRepository],
]);

export const findSkiSiteRepositoryByNamespace = (requestedNamespace: string) => {
  return skiSiteRepositories.get(requestedNamespace);
};
