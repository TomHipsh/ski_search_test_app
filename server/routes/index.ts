import { Router } from 'express';
import type { RequestHandler } from 'express';
import type {
  SkiHotelSearchRequest,
  SkiHotelSearchResponse,
  ValidationErrorResponse,
} from './types.js';
import { validateSkiHotelSearchRequest } from './validators.js';

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

  res.json({ result: 'ok' });
};

router.get('/', (req, res) => {
  res.send('hello-world');
});

router.post('/search', searchSkiHotels);

export default router;
