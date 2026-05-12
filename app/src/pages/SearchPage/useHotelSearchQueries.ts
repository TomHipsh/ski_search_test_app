import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { searchHotels } from './api';
import type { HotelSearchResult, SearchHotelsRequest } from './types';

export const useHotelSearchQueries = (
  searchRequests: SearchHotelsRequest[],
) => {
  const queries = useQueries({
    queries: searchRequests.map((request) => {
      return {
        queryKey: ['hotels', request],
        queryFn: () => searchHotels(request),
      };
    }),
  });

  const results = useMemo<HotelSearchResult[]>(() => {
    return getUniqueHotels(queries.flatMap((query) => query.data ?? [])).sort(
      sortByTotalPrice,
    );
  }, [queries]);

  return {
    results,
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.some((query) => query.isError),
  };
};

const getUniqueHotels = (hotels: HotelSearchResult[]): HotelSearchResult[] => {
  const hotelsByCode = new Map<string, HotelSearchResult>();

  for (const hotel of hotels) {
    const existingHotel = hotelsByCode.get(hotel.hotelCode);

    if (!existingHotel || hotel.totalPrice < existingHotel.totalPrice) {
      hotelsByCode.set(hotel.hotelCode, hotel);
    }
  }

  return Array.from(hotelsByCode.values());
};

const sortByTotalPrice = (
  firstHotel: HotelSearchResult,
  secondHotel: HotelSearchResult,
): number => {
  return firstHotel.totalPrice - secondHotel.totalPrice;
};
