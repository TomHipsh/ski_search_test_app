import type { HotelSearchResult } from './types';

export const toApiDate = (date: string): string => {
  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
};

export const isValidGroupSize = (value: string): boolean => {
  const groupSize = Number(value);

  return Number.isInteger(groupSize) && groupSize >= 1 && groupSize <= 10;
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  return (
    startDate.length > 0 &&
    endDate.length > 0 &&
    new Date(startDate).getTime() <= new Date(endDate).getTime()
  );
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const getPricePerPerson = (hotel: HotelSearchResult): number => {
  return hotel.totalPrice / hotel.groupSize;
};
