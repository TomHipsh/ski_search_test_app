import { Router } from 'express';
import type { RequestHandler } from 'express';
import type {
  SkiHotelSearchRequest,
  SkiHotelSearchResponse,
  ValidationErrorResponse,
} from './types.js';
import { validateSkiHotelSearchRequest } from './validators.js';
import { hotelRepository } from '../repositories/hotels/hotels.js';
import { skiSiteRepository } from '../repositories/sites/skiSites.js';
import { sitesRouter } from './sites.js';

const router = Router();

const searchSkiHotels: RequestHandler<
  Record<string, never>,
  SkiHotelSearchResponse | ValidationErrorResponse,
  unknown
> = async (req, res) => {
  const validationResult = validateSkiHotelSearchRequest(req.body);

  if (!validationResult.isValid) {
    res.status(400).json({
      error: 'Invalid request body',
      details: validationResult.errors,
    });
    return;
  }

  const searchRequest: SkiHotelSearchRequest = validationResult.data;
  const skiSite = skiSiteRepository.findByName(searchRequest.skiSiteName);

  if (!skiSite) {
    res.status(404).json({
      error: 'Ski site not found',
      details: [`ski site "${searchRequest.skiSiteName}" does not exist`],
    });
    return;
  }

  try {
    const hotels = await hotelRepository.searchHotels({
      skiSite: skiSite.id,
      startDate: searchRequest.startDate,
      endDate: searchRequest.endDate,
      groupSize: searchRequest.groupSize,
    });

    res.json(hotels);
  } catch (error) {
    res.status(502).json({
      error: 'Hotels vendor request failed',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    });
  }
};

router.post('/search', searchSkiHotels);
router.use('/sites', sitesRouter);

export { router };
