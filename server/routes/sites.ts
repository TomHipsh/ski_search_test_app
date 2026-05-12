import { Router } from 'express';
import type { RequestHandler } from 'express';
import { findSkiSiteRepositoryByNamespace } from '../repositories/sites/skiSites.js';
import { SitesNamespaces } from '../repositories/types.js';
import type {
  GetSkiSitesQuery,
  GetSkiSitesResponse,
  ValidationErrorResponse,
} from './types.js';

const defaultNamespace = SitesNamespaces.local;
const router = Router();

const getSkiSites: RequestHandler<
  Record<string, never>,
  GetSkiSitesResponse | ValidationErrorResponse,
  Record<string, never>,
  GetSkiSitesQuery
> = (req, res) => {
  const namespace = getNamespace(req.query.namespace);

  if (!namespace) {
    res.status(400).json({
      error: 'Invalid query params',
      details: ['namespace must be a string'],
    });
    return;
  }

  const repository = findSkiSiteRepositoryByNamespace(namespace);

  if (!repository) {
    res.status(404).json({
      error: 'Ski site namespace not found',
      details: [`namespace "${namespace}" does not exist`],
    });
    return;
  }

  res.json(repository.getAll());
};

router.get('/', getSkiSites);

const getNamespace = (namespace: unknown): string | undefined => {
  if (namespace === undefined) {
    return defaultNamespace;
  }

  if (typeof namespace !== 'string') {
    return undefined;
  }

  return namespace.trim();
};

export { router as sitesRouter };
