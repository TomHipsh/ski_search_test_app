import { Router } from 'express';
import type { RequestHandler } from 'express';
import type {
  SkiHotelSearchRequest,
  SkiHotelSearchResponse,
  ValidationErrorResponse,
} from './types.js';
import { validateSkiHotelSearchRequest } from './validators.js';
import { skiSiteRepository } from '../repositories/sites/skiSites.js';
import { sitesRouter } from './sites.js';

const router = Router();

const searchSkiHotels: RequestHandler<
  Record<string, never>,
  SkiHotelSearchResponse | ValidationErrorResponse,
  SkiHotelSearchRequest
> = (req, res) => {
  const validationErrors = validateSkiHotelSearchRequest(req.body);

  if (validationErrors.length > 0) {
    res.status(400).json({
      error: 'Invalid request body',
      details: validationErrors,
    });
    return;
  }

  const skiSite = skiSiteRepository.findByName(req.body.skiSiteName);

  if (!skiSite) {
    res.status(404).json({
      error: 'Ski site not found',
      details: [`ski site "${req.body.skiSiteName}" does not exist`],
    });
    return;
  }

  res.json({ result: 'ok' });
};

router.get('/', (req, res) => {
  res.send('hello-world');
});

router.post('/search', searchSkiHotels);
router.use('/sites', sitesRouter);

export { router };
