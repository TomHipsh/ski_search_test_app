import type { HotelSearchResult, SearchHotelsRequest, SkiSite } from './types';

export const fetchSites = async (): Promise<SkiSite[]> => {
  const response = await fetch('/sites');

  if (!response.ok) {
    throw new Error('Failed to load ski sites');
  }

  return response.json();
};

export const searchHotels = async (
  request: SearchHotelsRequest,
): Promise<HotelSearchResult[]> => {
  const response = await fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to search hotels');
  }

  return response.json();
};
